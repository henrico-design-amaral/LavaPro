// LavaPro — inventory consumption engine
// Formula: consumoRealEstimado = quantidadeBase × fatorPorTamanhoDoVeiculo
// Cost:    custoEstimado      = consumoRealEstimado × unitCost (do produto no momento do cálculo)

import type { Prisma, PrismaClient, Product, ServiceProductUsage } from '@prisma/client';
import type { VehicleSize } from './types';

const SIZE_FACTOR_KEY: Record<VehicleSize, 'factorSmall' | 'factorMedium' | 'factorLarge' | 'factorXLarge'> = {
  SMALL: 'factorSmall',
  MEDIUM: 'factorMedium',
  LARGE: 'factorLarge',
  EXTRA_LARGE: 'factorXLarge',
};

export interface PlannedUsage {
  productId: string;
  productName: string;
  unit: string;
  baseQuantity: number;
  factor: number;
  quantity: number;
  unitCost: number;
  estimatedCost: number;
}

export interface UsageWithProduct extends ServiceProductUsage {
  product: Product;
}

export function planUsage(
  usages: UsageWithProduct[],
  vehicleSize: VehicleSize,
  quantity = 1,
): PlannedUsage[] {
  const factorKey = SIZE_FACTOR_KEY[vehicleSize] ?? 'factorMedium';
  return usages.map((u) => {
    const factor = u[factorKey];
    const realQuantity = u.baseQuantity * factor * quantity;
    const unitCost = u.product.unitCost;
    return {
      productId: u.productId,
      productName: u.product.name,
      unit: u.product.unit,
      baseQuantity: u.baseQuantity,
      factor,
      quantity: roundTo3(realQuantity),
      unitCost,
      estimatedCost: roundTo2(realQuantity * unitCost),
    };
  });
}

export function roundTo2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function roundTo3(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export function totalPlannedCost(plan: PlannedUsage[]): number {
  return roundTo2(plan.reduce((acc, p) => acc + p.estimatedCost, 0));
}

export interface ApplyUsageOptions {
  tx: Prisma.TransactionClient | PrismaClient;
  businessId: string;
  serviceOrderId: string;
  plan: PlannedUsage[];
  reason?: 'USAGE';
}

export async function applyUsageToStock(opts: ApplyUsageOptions): Promise<void> {
  const { tx, businessId, serviceOrderId, plan } = opts;
  for (const item of plan) {
    if (item.quantity <= 0) continue;
    const delta = -item.quantity;
    await tx.product.update({
      where: { id: item.productId },
      data: { currentStock: { increment: delta } },
    });
    await tx.stockMovement.create({
      data: {
        businessId,
        productId: item.productId,
        delta,
        reason: 'USAGE',
        reference: serviceOrderId,
        note: `Consumo automático · OS ${serviceOrderId.slice(-6)}`,
      },
    });
  }
}

export async function revertUsageFromStock(opts: {
  tx: Prisma.TransactionClient | PrismaClient;
  businessId: string;
  serviceOrderId: string;
}): Promise<void> {
  const { tx, businessId, serviceOrderId } = opts;
  const movements = await tx.stockMovement.findMany({
    where: { businessId, reference: serviceOrderId, reason: 'USAGE' },
  });
  for (const m of movements) {
    await tx.product.update({
      where: { id: m.productId },
      data: { currentStock: { increment: -m.delta } }, // invert
    });
    await tx.stockMovement.delete({ where: { id: m.id } });
  }
}

export function isLowStock(product: Pick<Product, 'currentStock' | 'minStock'>): boolean {
  return product.currentStock <= product.minStock;
}
