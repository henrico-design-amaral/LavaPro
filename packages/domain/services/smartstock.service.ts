
import { PrismaClient, StockMovementType }
from "@prisma/client"

const prisma = new PrismaClient()

export async function runSmartStockConsumption(orderId: string) {

  const order = await prisma.serviceOrder.findUnique({
    where: { id: orderId },
    include: { vehicle: true }
  })

  if (!order) return

  const usages =
    await prisma.serviceProductUsage.findMany({
      where: {
        serviceTypeId: order.serviceTypeId,
        vehicleSize: order.vehicle.size
      }
    })

  for (const usage of usages) {

    const consumption =
      usage.estimatedQuantity * usage.wasteFactor

    await prisma.stockMovement.create({
      data: {
        productId: usage.productId,
        quantity: consumption,
        type: StockMovementType.AUTO_CONSUMPTION
      }
    })

    await prisma.product.update({
      where: { id: usage.productId },
      data: {
        currentStock: { decrement: consumption }
      }
    })
  }

}
