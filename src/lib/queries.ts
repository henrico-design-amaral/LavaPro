// LavaPro — read-side data helpers
// Keeps query logic in one place so server components stay clean.

import { prisma } from './db';
import { startOfDay, endOfDay } from './datetime';
import { isVehicleSize, type OrderStatus, type VehicleSize } from './types';

export async function getDefaultBusiness() {
  return prisma.business.findFirst({
    orderBy: { createdAt: 'asc' },
  });
}

export interface DashboardMetrics {
  servicesToday: number;
  ordersQueued: number;
  ordersInProgress: number;
  ordersCompletedToday: number;
  revenueToday: number;
  costToday: number;
  marginToday: number;
  marginPctToday: number;
  lowStockCount: number;
  ticketAverageToday: number;
  topServiceToday: { name: string; count: number } | null;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const business = await getDefaultBusiness();
  if (!business) {
    return {
      servicesToday: 0,
      ordersQueued: 0,
      ordersInProgress: 0,
      ordersCompletedToday: 0,
      revenueToday: 0,
      costToday: 0,
      marginToday: 0,
      marginPctToday: 0,
      lowStockCount: 0,
      ticketAverageToday: 0,
      topServiceToday: null,
    };
  }

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const [queued, inProgress, completedToday, itemsToday, lowStock, serviceCounts] = await Promise.all([
    prisma.serviceOrder.count({ where: { businessId: business.id, status: 'QUEUED' } }),
    prisma.serviceOrder.count({ where: { businessId: business.id, status: 'IN_PROGRESS' } }),
    prisma.serviceOrder.findMany({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: { gte: todayStart, lte: todayEnd },
      },
      select: { totalPrice: true, totalCost: true, id: true },
    }),
    prisma.serviceOrderItem.findMany({
      where: {
        serviceOrder: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: { gte: todayStart, lte: todayEnd },
        },
      },
      include: { serviceType: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: { businessId: business.id, active: true },
      select: { currentStock: true, minStock: true },
    }),
    prisma.serviceOrderItem.groupBy({
      by: ['serviceTypeId'],
      where: {
        serviceOrder: {
          businessId: business.id,
          status: 'COMPLETED',
          completedAt: { gte: todayStart, lte: todayEnd },
        },
      },
      _sum: { quantity: true },
    }),
  ]);

  const revenueToday = completedToday.reduce((acc, o) => acc + o.totalPrice, 0);
  const costToday = completedToday.reduce((acc, o) => acc + o.totalCost, 0);
  const marginToday = revenueToday - costToday;
  const marginPctToday = revenueToday > 0 ? marginToday / revenueToday : 0;
  const lowStockCount = lowStock.filter((p) => p.currentStock <= p.minStock).length;
  const ticketAverageToday = completedToday.length > 0 ? revenueToday / completedToday.length : 0;

  let topServiceToday: DashboardMetrics['topServiceToday'] = null;
  if (serviceCounts.length) {
    const ids = serviceCounts.map((s) => s.serviceTypeId);
    const services = await prisma.serviceType.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true },
    });
    const map = new Map(services.map((s) => [s.id, s.name]));
    const top = serviceCounts.reduce(
      (acc, cur) => ((cur._sum.quantity || 0) > (acc?._sum.quantity || 0) ? cur : acc),
      serviceCounts[0],
    );
    if (top) {
      topServiceToday = {
        name: map.get(top.serviceTypeId) || '—',
        count: top._sum.quantity || 0,
      };
    }
  }

  return {
    servicesToday: itemsToday.reduce((acc, i) => acc + i.quantity, 0),
    ordersQueued: queued,
    ordersInProgress: inProgress,
    ordersCompletedToday: completedToday.length,
    revenueToday,
    costToday,
    marginToday,
    marginPctToday,
    lowStockCount,
    ticketAverageToday,
    topServiceToday,
  };
}

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  queuedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  totalPrice: number;
  totalCost: number;
  customer: { id: string; name: string; phone: string };
  vehicle: { id: string; plate: string; brand: string; model: string; color: string; size: string };
  items: { id: string; quantity: number; priceAtTime: number; serviceType: { id: string; name: string } }[];
}

export async function listOrders(filter?: { status?: OrderStatus }): Promise<OrderListItem[]> {
  const business = await getDefaultBusiness();
  if (!business) return [];
  const orders = await prisma.serviceOrder.findMany({
    where: {
      businessId: business.id,
      ...(filter?.status ? { status: filter.status } : {}),
    },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      vehicle: { select: { id: true, plate: true, brand: true, model: true, color: true, size: true } },
      items: {
        include: { serviceType: { select: { id: true, name: true } } },
      },
    },
    orderBy: [{ status: 'asc' }, { queuedAt: 'desc' }],
    take: 200,
  });
  return orders as OrderListItem[];
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  queuedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  totalPrice: number;
  totalCost: number;
  observations: string | null;
  customer: { id: string; name: string; phone: string; email: string | null };
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    color: string;
    size: string;
  };
  items: {
    id: string;
    serviceTypeId: string;
    quantity: number;
    priceAtTime: number;
    costAtTime: number;
    serviceType: { id: string; name: string; description: string | null };
  }[];
}

export async function getOrderDetail(orderId: string): Promise<OrderDetail | null> {
  const order = await prisma.serviceOrder.findUnique({
    where: { id: orderId },
    include: {
      customer: { select: { id: true, name: true, phone: true, email: true } },
      vehicle: { select: { id: true, plate: true, brand: true, model: true, color: true, size: true } },
      items: {
        include: { serviceType: { select: { id: true, name: true, description: true } } },
      },
    },
  });
  return order as OrderDetail | null;
}

export async function listCustomers() {
  const business = await getDefaultBusiness();
  if (!business) return [];
  return prisma.customer.findMany({
    where: { businessId: business.id },
    orderBy: { name: 'asc' },
    include: {
      vehicles: { orderBy: { plate: 'asc' } },
      _count: { select: { serviceOrders: true } },
    },
  });
}

export async function getCustomerDetail(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      vehicles: { orderBy: { plate: 'asc' } },
      _count: { select: { serviceOrders: true } },
      serviceOrders: {
        orderBy: { queuedAt: 'desc' },
        take: 30,
        include: {
          vehicle: { select: { plate: true, model: true } },
          items: { include: { serviceType: { select: { name: true } } } },
        },
      },
    },
  });
  return customer;
}

export async function listServiceTypes() {
  const business = await getDefaultBusiness();
  if (!business) return [];
  return prisma.serviceType.findMany({
    where: { businessId: business.id },
    orderBy: { name: 'asc' },
    include: {
      productUsages: { include: { product: { select: { name: true, unit: true } } } },
      _count: { select: { orderItems: true } },
    },
  });
}

export interface ProductWithStats {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
  unitCost: number;
  active: boolean;
  serviceCount: number;
  isLow: boolean;
  last30Usage: number;
}

export async function listProducts(): Promise<ProductWithStats[]> {
  const business = await getDefaultBusiness();
  if (!business) return [];
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { serviceUsages: true } },
    },
  });
  const movements = await prisma.stockMovement.findMany({
    where: { businessId: business.id, reason: 'USAGE', createdAt: { gte: since } },
  });
  const usageByProduct = new Map<string, number>();
  for (const m of movements) {
    const used = Math.abs(m.delta);
    usageByProduct.set(m.productId, (usageByProduct.get(m.productId) || 0) + used);
  }
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    unit: p.unit,
    currentStock: p.currentStock,
    minStock: p.minStock,
    unitCost: p.unitCost,
    active: p.active,
    serviceCount: p._count.serviceUsages,
    isLow: p.currentStock <= p.minStock,
    last30Usage: usageByProduct.get(p.id) || 0,
  }));
}

export interface DailyReport {
  date: Date;
  ordersCompleted: number;
  revenue: number;
  cost: number;
  margin: number;
  marginPct: number;
  ticketAverage: number;
  byService: { name: string; quantity: number; revenue: number }[];
  lowStockProducts: { name: string; currentStock: number; minStock: number; unit: string }[];
}

export async function getDailyReport(date: Date = new Date()): Promise<DailyReport> {
  const business = await getDefaultBusiness();
  if (!business) {
    return {
      date,
      ordersCompleted: 0,
      revenue: 0,
      cost: 0,
      margin: 0,
      marginPct: 0,
      ticketAverage: 0,
      byService: [],
      lowStockProducts: [],
    };
  }
  const start = startOfDay(date);
  const end = endOfDay(date);

  const [orders, lowStock] = await Promise.all([
    prisma.serviceOrder.findMany({
      where: {
        businessId: business.id,
        status: 'COMPLETED',
        completedAt: { gte: start, lte: end },
      },
      include: { items: { include: { serviceType: { select: { name: true } } } } },
    }),
    prisma.product.findMany({
      where: { businessId: business.id, active: true },
    }),
  ]);

  const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const cost = orders.reduce((acc, o) => acc + o.totalCost, 0);
  const margin = revenue - cost;
  const marginPct = revenue > 0 ? margin / revenue : 0;
  const ticketAverage = orders.length ? revenue / orders.length : 0;

  const byServiceMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const o of orders) {
    for (const it of o.items) {
      const name = it.serviceType.name;
      const cur = byServiceMap.get(name) || { name, quantity: 0, revenue: 0 };
      cur.quantity += it.quantity;
      cur.revenue += it.priceAtTime * it.quantity;
      byServiceMap.set(name, cur);
    }
  }
  const byService = Array.from(byServiceMap.values()).sort((a, b) => b.quantity - a.quantity);

  const lowStockProducts = lowStock
    .filter((p) => p.currentStock <= p.minStock)
    .map((p) => ({
      name: p.name,
      currentStock: p.currentStock,
      minStock: p.minStock,
      unit: p.unit,
    }));

  return {
    date,
    ordersCompleted: orders.length,
    revenue,
    cost,
    margin,
    marginPct,
    ticketAverage,
    byService,
    lowStockProducts,
  };
}

export interface StockMovementWithProduct {
  id: string;
  productId: string;
  productName: string;
  unit: string;
  delta: number;
  reason: string;
  reference: string | null;
  note: string | null;
  createdAt: Date;
}

export async function listRecentStockMovements(limit = 30): Promise<StockMovementWithProduct[]> {
  const business = await getDefaultBusiness();
  if (!business) return [];
  const rows = await prisma.stockMovement.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { product: { select: { name: true, unit: true } } },
  });
  return rows.map((m) => ({
    id: m.id,
    productId: m.productId,
    productName: m.product.name,
    unit: m.product.unit,
    delta: m.delta,
    reason: m.reason,
    reference: m.reference,
    note: m.note,
    createdAt: m.createdAt,
  }));
}

export { isVehicleSize as _isVehicleSize };
export type { VehicleSize };
