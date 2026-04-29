
import { runSmartStockConsumption } 
from "@/packages/domain/services/smartstock.service"

export async function updateStatus(orderId: string, status: string) {

  if (status === "COMPLETED") {
    await runSmartStockConsumption(orderId)
  }

}
