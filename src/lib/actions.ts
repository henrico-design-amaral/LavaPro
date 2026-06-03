// LavaPro — server actions: service orders
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from './db';
import { applyUsageToStock, planUsage, totalPlannedCost, type PlannedUsage } from './inventory';
import type { OrderStatus, VehicleSize } from './types';

async function getDefaultBusinessId(): Promise<string> {
  const business = await prisma.business.findFirst();
  if (!business) throw new Error('Nenhum negócio configurado. Rode npm run db:seed.');
  return business.id;
}

export interface CreateOrderItemInput {
  serviceTypeId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: string;
  vehicleId: string;
  items: CreateOrderItemInput[];
  observations?: string | null;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
  orderId?: string;
}

export async function createOrderAction(input: CreateOrderInput): Promise<ActionResult> {
  const businessId = await getDefaultBusinessId();

  if (!input.customerId) return { ok: false, error: 'Selecione um cliente.' };
  if (!input.vehicleId) return { ok: false, error: 'Selecione um veículo.' };
  if (!input.items.length) return { ok: false, error: 'Adicione ao menos um serviço.' };

  const items = input.items.filter((i) => i.quantity > 0);
  if (!items.length) return { ok: false, error: 'Adicione ao menos um serviço com quantidade válida.' };

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: input.vehicleId },
    include: { customer: true },
  });
  if (!vehicle || vehicle.customerId !== input.customerId) {
    return { ok: false, error: 'Veículo não pertence ao cliente informado.' };
  }
  if (!isValidVehicleSize(vehicle.size as string)) {
    return { ok: false, error: 'Tamanho do veículo inválido.' };
  }

  const serviceTypes = await prisma.serviceType.findMany({
    where: { businessId, id: { in: items.map((i) => i.serviceTypeId) }, active: true },
    include: {
      productUsages: { include: { product: true } },
    },
  });
  if (serviceTypes.length !== new Set(items.map((i) => i.serviceTypeId)).size) {
    return { ok: false, error: 'Um ou mais serviços são inválidos.' };
  }

  const orderItemsData = items.map((i) => {
    const st = serviceTypes.find((s) => s.id === i.serviceTypeId)!;
    return {
      serviceTypeId: st.id,
      priceAtTime: st.basePrice,
      costAtTime: 0,
      quantity: i.quantity,
    };
  });

  const order = await prisma.serviceOrder.create({
    data: {
      businessId,
      customerId: input.customerId,
      vehicleId: input.vehicleId,
      observations: input.observations?.trim() || null,
      status: 'QUEUED',
      totalPrice: orderItemsData.reduce((acc, i) => acc + i.priceAtTime * i.quantity, 0),
      totalCost: 0,
      items: { create: orderItemsData },
    },
  });

  revalidatePath('/');
  revalidatePath('/queue');
  revalidatePath('/orders');
  return { ok: true, orderId: order.id };
}

function isValidVehicleSize(value: string): value is VehicleSize {
  return value === 'SMALL' || value === 'MEDIUM' || value === 'LARGE' || value === 'EXTRA_LARGE';
}

export async function startOrderAction(orderId: string): Promise<ActionResult> {
  const order = await prisma.serviceOrder.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: 'Ordem não encontrada.' };
  if (order.status !== 'QUEUED') return { ok: false, error: 'Apenas ordens na fila podem ser iniciadas.' };

  await prisma.serviceOrder.update({
    where: { id: orderId },
    data: { status: 'IN_PROGRESS', startedAt: new Date() },
  });

  revalidatePath('/');
  revalidatePath('/queue');
  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);
  return { ok: true, orderId };
}

export async function completeOrderAction(orderId: string): Promise<ActionResult> {
  const businessId = await getDefaultBusinessId();
  const order = await prisma.serviceOrder.findUnique({
    where: { id: orderId },
    include: {
      vehicle: true,
      items: {
        include: {
          serviceType: {
            include: { productUsages: { include: { product: true } } },
          },
        },
      },
    },
  });
  if (!order) return { ok: false, error: 'Ordem não encontrada.' };
  if (order.status !== 'IN_PROGRESS') {
    return { ok: false, error: 'Apenas ordens em execução podem ser concluídas.' };
  }
  if (!isValidVehicleSize(order.vehicle.size as string)) {
    return { ok: false, error: 'Tamanho do veículo inválido.' };
  }

  const plan: PlannedUsage[] = order.items.flatMap((item) => {
    const usages = item.serviceType.productUsages;
    return planUsage(usages, order.vehicle.size as 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE', item.quantity);
  });

  const totalCost = totalPlannedCost(plan);

  await prisma.$transaction(async (tx) => {
    await applyUsageToStock({ tx, businessId, serviceOrderId: order.id, plan });
    await tx.serviceOrder.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        totalCost,
      },
    });
  });

  revalidatePath('/');
  revalidatePath('/queue');
  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);
  revalidatePath('/inventory');
  revalidatePath('/reports');
  return { ok: true, orderId };
}

export async function cancelOrderAction(orderId: string): Promise<ActionResult> {
  const order = await prisma.serviceOrder.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: 'Ordem não encontrada.' };
  if (order.status === 'COMPLETED') return { ok: false, error: 'Ordens concluídas não podem ser canceladas.' };
  if (order.status === 'CANCELLED') return { ok: false, error: 'Ordem já está cancelada.' };

  await prisma.serviceOrder.update({
    where: { id: orderId },
    data: { status: 'CANCELLED', cancelledAt: new Date() },
  });

  revalidatePath('/');
  revalidatePath('/queue');
  revalidatePath('/orders');
  revalidatePath(`/orders/${orderId}`);
  return { ok: true, orderId };
}

export async function deleteOrderAction(orderId: string): Promise<ActionResult> {
  await prisma.serviceOrder.delete({ where: { id: orderId } });
  revalidatePath('/');
  revalidatePath('/queue');
  revalidatePath('/orders');
  return { ok: true, orderId };
}

export async function createCustomerAction(input: {
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const businessId = await getDefaultBusinessId();
  if (!input.name.trim()) return { ok: false, error: 'Informe o nome do cliente.' };
  if (!input.phone.trim()) return { ok: false, error: 'Informe o telefone do cliente.' };

  const customer = await prisma.customer.create({
    data: {
      businessId,
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      notes: input.notes?.trim() || null,
    },
  });
  revalidatePath('/customers');
  return { ok: true, id: customer.id };
}

export async function createVehicleAction(input: {
  customerId: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  size: VehicleSize;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  if (!input.customerId) return { ok: false, error: 'Selecione um cliente.' };
  if (!input.plate.trim()) return { ok: false, error: 'Informe a placa.' };
  if (!input.brand.trim()) return { ok: false, error: 'Informe a marca.' };
  if (!input.model.trim()) return { ok: false, error: 'Informe o modelo.' };
  if (!isValidVehicleSize(input.size)) return { ok: false, error: 'Tamanho inválido.' };

  const vehicle = await prisma.vehicle.create({
    data: {
      customerId: input.customerId,
      plate: input.plate.trim().toUpperCase(),
      brand: input.brand.trim(),
      model: input.model.trim(),
      color: input.color.trim() || '—',
      size: input.size,
    },
  });
  revalidatePath('/customers');
  revalidatePath(`/customers/${input.customerId}`);
  return { ok: true, id: vehicle.id };
}

export async function adjustStockAction(input: {
  productId: string;
  delta: number;
  reason: 'PURCHASE' | 'ADJUSTMENT' | 'WASTE';
  note?: string;
}): Promise<ActionResult> {
  const businessId = await getDefaultBusinessId();
  if (!Number.isFinite(input.delta) || input.delta === 0) {
    return { ok: false, error: 'Informe um delta diferente de zero.' };
  }
  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product) return { ok: false, error: 'Produto não encontrado.' };

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id: input.productId },
      data: { currentStock: { increment: input.delta } },
    });
    await tx.stockMovement.create({
      data: {
        businessId,
        productId: input.productId,
        delta: input.delta,
        reason: input.reason,
        note: input.note?.trim() || null,
      },
    });
  });

  revalidatePath('/inventory');
  return { ok: true };
}

export async function _formCreateOrder(formData: FormData) {
  const customerId = String(formData.get('customerId') || '');
  const vehicleId = String(formData.get('vehicleId') || '');
  const observations = String(formData.get('observations') || '');

  const serviceTypeIds = formData.getAll('serviceTypeId').map(String);
  const quantities = formData.getAll('quantity').map((v) => Number(String(v)) || 0);

  const items = serviceTypeIds
    .map((id, idx) => ({ serviceTypeId: id, quantity: quantities[idx] || 1 }))
    .filter((i) => i.serviceTypeId);

  const result = await createOrderAction({ customerId, vehicleId, items, observations });
  if (!result.ok || !result.orderId) {
    throw new Error(result.error || 'Falha ao criar ordem.');
  }
  redirect(`/orders/${result.orderId}`);
}

export async function _formCreateCustomer(formData: FormData) {
  const name = String(formData.get('name') || '');
  const phone = String(formData.get('phone') || '');
  const email = String(formData.get('email') || '');
  const notes = String(formData.get('notes') || '');
  const result = await createCustomerAction({
    name,
    phone,
    email: email || null,
    notes: notes || null,
  });
  if (!result.ok) throw new Error(result.error || 'Falha ao criar cliente.');
  redirect(`/customers/${result.id}`);
}

export async function _formCreateVehicle(formData: FormData) {
  const customerId = String(formData.get('customerId') || '');
  const plate = String(formData.get('plate') || '');
  const brand = String(formData.get('brand') || '');
  const model = String(formData.get('model') || '');
  const color = String(formData.get('color') || '');
  const size = String(formData.get('size') || 'MEDIUM') as VehicleSize;
  const result = await createVehicleAction({ customerId, plate, brand, model, color, size });
  if (!result.ok) throw new Error(result.error || 'Falha ao criar veículo.');
  redirect(`/customers/${customerId}`);
}

export async function _formAdjustStock(formData: FormData) {
  const productId = String(formData.get('productId') || '');
  const delta = Number(String(formData.get('delta') || '0'));
  const reason = String(formData.get('reason') || 'ADJUSTMENT') as 'PURCHASE' | 'ADJUSTMENT' | 'WASTE';
  const note = String(formData.get('note') || '');
  const result = await adjustStockAction({ productId, delta, reason, note });
  if (!result.ok) throw new Error(result.error || 'Falha ao ajustar estoque.');
  redirect('/inventory');
}

export type { OrderStatus };
