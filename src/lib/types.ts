// LavaPro — application-level type-safe constants
// SQLite does not support native enums, so these are string unions
// enforced at the application boundary.

export const VEHICLE_SIZES = ['SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE'] as const;
export type VehicleSize = (typeof VEHICLE_SIZES)[number];

export const VEHICLE_SIZE_LABEL: Record<VehicleSize, string> = {
  SMALL: 'Pequeno',
  MEDIUM: 'Médio',
  LARGE: 'Grande',
  EXTRA_LARGE: 'Extra',
};

export const ORDER_STATUSES = ['QUEUED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  QUEUED: 'Na fila',
  IN_PROGRESS: 'Em execução',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

export const STOCK_REASONS = ['INITIAL', 'USAGE', 'PURCHASE', 'ADJUSTMENT', 'WASTE'] as const;
export type StockReason = (typeof STOCK_REASONS)[number];

export const STOCK_REASON_LABEL: Record<StockReason, string> = {
  INITIAL: 'Estoque inicial',
  USAGE: 'Consumo',
  PURCHASE: 'Compra',
  ADJUSTMENT: 'Ajuste',
  WASTE: 'Perda',
};

export function isVehicleSize(value: string): value is VehicleSize {
  return (VEHICLE_SIZES as readonly string[]).includes(value);
}

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function isStockReason(value: string): value is StockReason {
  return (STOCK_REASONS as readonly string[]).includes(value);
}
