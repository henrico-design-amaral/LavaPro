import { PrismaClient, ServiceOrderStatus, StockMovementType, VehicleSize } from "./generated/client";

const prismaClientSingleton = () => {
  const basePrisma = new PrismaClient();

  // Implement the SmartStock Trigger using Prisma Extensions
  const prisma = basePrisma.$extends({
    query: {
      serviceOrder: {
        async update({ args, query }) {
          const isCompleting = args.data.status === ServiceOrderStatus.COMPLETED;

          // Execute the update first
          const result = await query(args);

          // Trigger: ServiceCompleted -> create StockMovement(type = AUTO_CONSUMPTION)
          if (isCompleting && result.status === ServiceOrderStatus.COMPLETED) {

            // 1. Fetch the complete Service Order to get items and vehicle info
            const serviceOrder = await basePrisma.serviceOrder.findUnique({
              where: { id: result.id },
              include: {
                items: true,
                vehicle: true,
              },
            });

            if (serviceOrder) {
              const vehicleSize = serviceOrder.vehicle?.size || VehicleSize.COMPACT;

              // 2. Iterate items to calculate SmartStock consumption
              for (const item of serviceOrder.items) {
                const usages = await basePrisma.serviceProductUsage.findMany({
                  where: {
                    serviceTypeId: item.serviceTypeId,
                    vehicleSize: vehicleSize,
                  },
                });

                for (const usage of usages) {
                  // Formula: realConsumption = estimatedQuantity * wasteFactor
                  const realConsumption = usage.estimatedQuantity * usage.wasteFactor;
                  const totalConsumption = realConsumption * item.quantity;

                  // 3. Create StockMovement (AUTO_CONSUMPTION)
                  await basePrisma.stockMovement.create({
                    data: {
                      organizationId: serviceOrder.organizationId,
                      productId: usage.productId,
                      type: StockMovementType.AUTO_CONSUMPTION,
                      quantity: -totalConsumption, // Deduction
                      serviceOrderId: serviceOrder.id,
                      notes: `Auto-consumption trigger for ServiceOrder ${serviceOrder.id}`,
                    },
                  });

                  // 4. Update the actual Product stock
                  await basePrisma.product.update({
                    where: { id: usage.productId },
                    data: {
                      currentStock: {
                        decrement: totalConsumption,
                      },
                    },
                  });
                }
              }
            }
          }

          return result;
        },
      },
    },
  });

  return prisma;
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
