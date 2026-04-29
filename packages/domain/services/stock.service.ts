import { PrismaClient, ServiceOrderStatus, StockMovementType, VehicleSize } from '@prisma/client';

const prisma = new PrismaClient();

export class SmartStockService {
  /**
   * Trigger: ServiceCompleted -> create StockMovement(type = AUTO_CONSUMPTION)
   * This function should be called when a ServiceOrder transitions to COMPLETED.
   */
  static async processServiceCompletion(serviceOrderId: string) {
    // 1. Fetch the completed Service Order and its items, vehicle, and organization
    const serviceOrder = await prisma.serviceOrder.findUnique({
      where: { id: serviceOrderId },
      include: {
        items: true,
        vehicle: true,
      },
    });

    if (!serviceOrder || serviceOrder.status !== ServiceOrderStatus.COMPLETED) {
      throw new Error("Service Order must be completed to process stock consumption.");
    }

    const vehicleSize = serviceOrder.vehicle?.size || VehicleSize.COMPACT;

    // 2. Iterate through each ServiceOrderItem to calculate consumption
    for (const item of serviceOrder.items) {
      // Find the predefined product usage map for this Service Type and Vehicle Size
      const usages = await prisma.serviceProductUsage.findMany({
        where: {
          serviceTypeId: item.serviceTypeId,
          vehicleSize: vehicleSize,
        },
      });

      // 3. Apply the Formula: realConsumption = estimatedQuantity × wasteFactor
      for (const usage of usages) {
        const realConsumption = usage.estimatedQuantity * usage.wasteFactor;
        const totalConsumption = realConsumption * item.quantity; // in case of multiple quantities of the same service

        // 4. Create the StockMovement for AUTO_CONSUMPTION
        await prisma.stockMovement.create({
          data: {
            organizationId: serviceOrder.organizationId,
            productId: usage.productId,
            type: StockMovementType.AUTO_CONSUMPTION,
            quantity: -totalConsumption, // Negative because it's a deduction
            serviceOrderId: serviceOrder.id,
            notes: `Auto-consumption for Service ${item.serviceTypeId} (Size: ${vehicleSize})`,
          },
        });

        // 5. Update the actual Product stock
        await prisma.product.update({
          where: { id: usage.productId },
          data: {
            currentStock: {
              decrement: totalConsumption,
            },
          },
        });
      }
    }

    return true;
  }
}
