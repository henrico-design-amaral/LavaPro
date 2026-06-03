/* LavaPro — seed
 * Idempotent: drops all rows and re-creates from a deterministic source.
 * Goal: a believable, operational day in a small car wash.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function makeDateToday(hours: number, minutes = 0): Date {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function addMinutes(d: Date, minutes: number): Date {
  return new Date(d.getTime() + minutes * 60_000);
}

async function reset() {
  // Order matters: leaves first, then dependents.
  await prisma.stockMovement.deleteMany();
  await prisma.serviceOrderItem.deleteMany();
  await prisma.serviceOrder.deleteMany();
  await prisma.serviceProductUsage.deleteMany();
  await prisma.serviceType.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.business.deleteMany();
}

async function main() {
  await reset();

  const business = await prisma.business.create({
    data: {
      name: 'LavaPro Centro',
      slug: 'lavapro-centro',
    },
  });

  // ---- Customers + vehicles
  const customerSeed = [
    { name: 'Ana Lima', phone: '(11) 98123-4521', email: 'ana.lima@example.com' },
    { name: 'Bruno Santos', phone: '(11) 99812-3344', email: null },
    { name: 'Carla Rocha', phone: '(11) 97777-1029', email: 'carla.rocha@example.com' },
    { name: 'Diego Pereira', phone: '(11) 96654-0098', email: null },
    { name: 'Elaine Costa', phone: '(11) 95512-8877', email: 'elaine.costa@example.com' },
    { name: 'Felipe Marques', phone: '(11) 94421-7766', email: null },
    { name: 'Gabriela Souza', phone: '(11) 93355-2244', email: 'gabriela.souza@example.com' },
    { name: 'Henrique Oliveira', phone: '(11) 92211-0011', email: null },
  ] as const;

  const vehicleSeed = [
    { plate: 'BRA2E19', brand: 'Hyundai', model: 'HB20', color: 'Prata', size: 'SMALL' as const },
    { plate: 'RIO4A33', brand: 'Toyota', model: 'Corolla', color: 'Preto', size: 'MEDIUM' as const },
    { plate: 'SAO1C44', brand: 'Honda', model: 'Civic', color: 'Branco', size: 'MEDIUM' as const },
    { plate: 'DFG7H12', brand: 'Jeep', model: 'Compass', color: 'Cinza', size: 'LARGE' as const },
    { plate: 'MNO3P88', brand: 'Volkswagen', model: 'Nivus', color: 'Vermelho', size: 'SMALL' as const },
    { plate: 'XYZ9K02', brand: 'Fiat', model: 'Pulse', color: 'Branco', size: 'SMALL' as const },
    { plate: 'QWE5R67', brand: 'Chevrolet', model: 'Tracker', color: 'Prata', size: 'MEDIUM' as const },
    { plate: 'PJK2L54', brand: 'Mitsubishi', model: 'Pajero Sport', color: 'Preto', size: 'EXTRA_LARGE' as const },
    { plate: 'BCD8F31', brand: 'Renault', model: 'Kwid', color: 'Branco', size: 'SMALL' as const },
    { plate: 'TUV6G90', brand: 'BYD', model: 'Dolphin', color: 'Azul', size: 'SMALL' as const },
  ] as const;

  const customers = await Promise.all(
    customerSeed.map((c) =>
      prisma.customer.create({
        data: { ...c, businessId: business.id },
      }),
    ),
  );

  const vehicles = [];
  const customerVehicles: Record<number, number> = {
    0: 2, // Ana -> 2 cars
    1: 1,
    2: 2,
    3: 1,
    4: 1,
    5: 1,
    6: 1,
    7: 1,
  };
  let vIdx = 0;
  for (let cIdx = 0; cIdx < customers.length; cIdx++) {
    const count = customerVehicles[cIdx] ?? 1;
    for (let k = 0; k < count && vIdx < vehicleSeed.length; k++) {
      const v = vehicleSeed[vIdx];
      const created = await prisma.vehicle.create({
        data: { ...v, customerId: customers[cIdx].id },
      });
      vehicles.push(created);
      vIdx++;
    }
  }

  // ---- Products
  const productSeed = [
    { name: 'Shampoo automotivo', unit: 'ml', currentStock: 5000, minStock: 1500, unitCost: 0.012 },
    { name: 'Cera de proteção', unit: 'ml', currentStock: 1800, minStock: 800, unitCost: 0.045 },
    { name: 'Desengraxante', unit: 'ml', currentStock: 900, minStock: 1200, unitCost: 0.022 },
    { name: 'Pneu pretinho', unit: 'ml', currentStock: 700, minStock: 400, unitCost: 0.038 },
    { name: 'Microfibra', unit: 'un', currentStock: 60, minStock: 24, unitCost: 6.5 },
    { name: 'Desinfetante de painel', unit: 'ml', currentStock: 1400, minStock: 600, unitCost: 0.018 },
    { name: 'Sabão de roda', unit: 'ml', currentStock: 2200, minStock: 800, unitCost: 0.015 },
    { name: 'Pretinho líquido', unit: 'ml', currentStock: 350, minStock: 400, unitCost: 0.05 },
  ] as const;

  const products = await Promise.all(
    productSeed.map((p) =>
      prisma.product.create({ data: { ...p, businessId: business.id } }),
    ),
  );

  const productByName = new Map(products.map((p) => [p.name, p]));

  // ---- Service types
  const serviceSeed = [
    {
      name: 'Lavagem simples',
      description: 'Lavagem externa com shampoo e secagem.',
      basePrice: 45,
      durationMin: 30,
      usages: [
        { product: 'Shampoo automotivo', base: 60, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.25, factorXLarge: 1.6 },
        { product: 'Microfibra', base: 0.2, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.2 },
      ],
    },
    {
      name: 'Lavagem completa',
      description: 'Lavagem externa + interna + secagem + pretinho.',
      basePrice: 85,
      durationMin: 60,
      usages: [
        { product: 'Shampoo automotivo', base: 80, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.25, factorXLarge: 1.6 },
        { product: 'Desengraxante', base: 25, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.3, factorXLarge: 1.6 },
        { product: 'Pneu pretinho', base: 30, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.2, factorXLarge: 1.4 },
        { product: 'Microfibra', base: 0.5, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.2 },
        { product: 'Desinfetante de painel', base: 25, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.3 },
      ],
    },
    {
      name: 'Lavagem técnica',
      description: 'Lavagem detalhada com cera de proteção e secagem precisa.',
      basePrice: 140,
      durationMin: 90,
      usages: [
        { product: 'Shampoo automotivo', base: 90, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.25, factorXLarge: 1.6 },
        { product: 'Cera de proteção', base: 50, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.2, factorXLarge: 1.5 },
        { product: 'Microfibra', base: 0.8, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.2 },
        { product: 'Sabão de roda', base: 40, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.2, factorXLarge: 1.5 },
      ],
    },
    {
      name: 'Polimento cristalizado',
      description: 'Polimento de pintura com proteção por 6 meses.',
      basePrice: 380,
      durationMin: 180,
      usages: [
        { product: 'Cera de proteção', base: 90, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.2, factorXLarge: 1.5 },
        { product: 'Desengraxante', base: 40, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.3, factorXLarge: 1.6 },
        { product: 'Microfibra', base: 1.5, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.2 },
      ],
    },
    {
      name: 'Higienização interna',
      description: 'Aspiração, painéis, vidros internos e aromatização.',
      basePrice: 95,
      durationMin: 75,
      usages: [
        { product: 'Desinfetante de painel', base: 40, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.3 },
        { product: 'Desengraxante', base: 20, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.2, factorXLarge: 1.4 },
        { product: 'Microfibra', base: 0.6, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.2 },
      ],
    },
    {
      name: 'Pretinho nos pneus',
      description: 'Aplicação de pretinho líquido com acabamento uniforme.',
      basePrice: 25,
      durationMin: 15,
      usages: [
        { product: 'Pneu pretinho', base: 25, factorSmall: 0.85, factorMedium: 1.0, factorLarge: 1.2, factorXLarge: 1.4 },
        { product: 'Microfibra', base: 0.2, factorSmall: 0.9, factorMedium: 1.0, factorLarge: 1.1, factorXLarge: 1.2 },
      ],
    },
  ] as const;

  const serviceTypes: Array<{
    id: string;
    name: string;
    basePrice: number;
  }> = [];
  for (const s of serviceSeed) {
    const created = await prisma.serviceType.create({
      data: {
        businessId: business.id,
        name: s.name,
        description: s.description,
        basePrice: s.basePrice,
        durationMin: s.durationMin,
        productUsages: {
          create: s.usages.map((u) => {
            const product = productByName.get(u.product);
            if (!product) throw new Error(`Product not found: ${u.product}`);
            return {
              productId: product.id,
              baseQuantity: u.base,
              factorSmall: u.factorSmall,
              factorMedium: u.factorMedium,
              factorLarge: u.factorLarge,
              factorXLarge: u.factorXLarge,
            };
          }),
        },
      },
    });
    serviceTypes.push(created);
  }

  // ---- Initial stock movements (so the system shows a real history)
  for (const p of products) {
    await prisma.stockMovement.create({
      data: {
        businessId: business.id,
        productId: p.id,
        delta: p.currentStock,
        reason: 'INITIAL',
        note: 'Estoque inicial da operação',
      },
    });
  }

  // ---- Service orders (12) covering different statuses
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function plannedCostForOrder(serviceIds: string[], vehicleSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE', qty: number = 1) {
    let cost = 0;
    for (const sid of serviceIds) {
      const s = serviceTypes.find((x) => x.id === sid);
      if (!s) continue;
      // This block mirrors planUsage but does not re-query; we have the data.
      // Simulated by reading the usages inline would require another query;
      // instead, we re-fetch inline for accuracy.
    }
    return 0; // filled below by simulateCost
  }

  // Helper to compute the planned cost for a list of items
  async function simulateCost(items: { serviceTypeId: string; quantity: number; vehicleSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE' }[]) {
    let total = 0;
    for (const it of items) {
      const usages = await prisma.serviceProductUsage.findMany({
        where: { serviceTypeId: it.serviceTypeId },
        include: { product: true },
      });
      for (const u of usages) {
        const factor =
          it.vehicleSize === 'SMALL'
            ? u.factorSmall
            : it.vehicleSize === 'MEDIUM'
            ? u.factorMedium
            : it.vehicleSize === 'LARGE'
            ? u.factorLarge
            : u.factorXLarge;
        const used = u.baseQuantity * factor * it.quantity;
        total += used * u.product.unitCost;
      }
    }
    return Math.round(total * 100) / 100;
  }

  type OrderPlan = {
    customerIdx: number;
    vehicleIdx: number;
    serviceNames: string[];
    observations?: string;
    queuedAt: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  };

  const ordersPlan: OrderPlan[] = [
    {
      customerIdx: 0,
      vehicleIdx: 0,
      serviceNames: ['Lavagem simples'],
      queuedAt: makeDateToday(8, 30),
      startedAt: makeDateToday(8, 40),
      completedAt: makeDateToday(9, 5),
      status: 'COMPLETED',
    },
    {
      customerIdx: 1,
      vehicleIdx: 2,
      serviceNames: ['Lavagem completa'],
      queuedAt: makeDateToday(9, 15),
      startedAt: makeDateToday(9, 25),
      completedAt: makeDateToday(10, 25),
      status: 'COMPLETED',
    },
    {
      customerIdx: 2,
      vehicleIdx: 3,
      serviceNames: ['Lavagem técnica', 'Higienização interna'],
      queuedAt: makeDateToday(10, 0),
      startedAt: makeDateToday(10, 30),
      completedAt: makeDateToday(12, 30),
      status: 'COMPLETED',
    },
    {
      customerIdx: 3,
      vehicleIdx: 4,
      serviceNames: ['Lavagem simples', 'Pretinho nos pneus'],
      queuedAt: makeDateToday(11, 10),
      startedAt: makeDateToday(11, 30),
      completedAt: makeDateToday(12, 5),
      status: 'COMPLETED',
    },
    {
      customerIdx: 4,
      vehicleIdx: 5,
      serviceNames: ['Lavagem completa'],
      queuedAt: makeDateToday(12, 40),
      startedAt: makeDateToday(13, 0),
      completedAt: makeDateToday(14, 0),
      status: 'COMPLETED',
    },
    {
      customerIdx: 5,
      vehicleIdx: 6,
      serviceNames: ['Polimento cristalizado'],
      queuedAt: makeDateToday(13, 30),
      startedAt: makeDateToday(14, 0),
      completedAt: makeDateToday(16, 30),
      status: 'COMPLETED',
    },
    {
      customerIdx: 6,
      vehicleIdx: 7,
      serviceNames: ['Lavagem completa'],
      queuedAt: makeDateToday(14, 50),
      startedAt: makeDateToday(15, 5),
      status: 'IN_PROGRESS',
    },
    {
      customerIdx: 7,
      vehicleIdx: 8,
      serviceNames: ['Lavagem simples'],
      queuedAt: makeDateToday(15, 20),
      startedAt: makeDateToday(15, 35),
      status: 'IN_PROGRESS',
    },
    {
      customerIdx: 0,
      vehicleIdx: 1,
      serviceNames: ['Lavagem técnica'],
      queuedAt: makeDateToday(16, 0),
      status: 'QUEUED',
    },
    {
      customerIdx: 1,
      vehicleIdx: 9,
      serviceNames: ['Higienização interna'],
      queuedAt: makeDateToday(16, 15),
      status: 'QUEUED',
    },
    {
      customerIdx: 2,
      vehicleIdx: 2,
      serviceNames: ['Lavagem simples'],
      queuedAt: makeDateToday(7, 30),
      cancelledAt: makeDateToday(7, 50),
      status: 'CANCELLED',
      observations: 'Cliente desistiu — fila muito longa.',
    },
    {
      customerIdx: 3,
      vehicleIdx: 3,
      serviceNames: ['Polimento cristalizado'],
      queuedAt: makeDateToday(17, 0),
      status: 'QUEUED',
      observations: 'Levar cuidado extra com capô — pediu atenção.',
    },
  ];

  for (const plan of ordersPlan) {
    const customer = customers[plan.customerIdx];
    const vehicle = vehicles[plan.vehicleIdx];
    if (!customer || !vehicle) continue;

    const serviceIds = plan.serviceNames
      .map((n) => serviceTypes.find((s) => s.name === n)?.id)
      .filter((x): x is string => Boolean(x));

    const items = serviceIds.map((sid) => ({ serviceTypeId: sid, quantity: 1 }));
    const totalPrice = items.reduce((acc, it) => {
      const st = serviceTypes.find((s) => s.id === it.serviceTypeId);
      return acc + (st?.basePrice ?? 0) * it.quantity;
    }, 0);

    const order = await prisma.serviceOrder.create({
      data: {
        businessId: business.id,
        customerId: customer.id,
        vehicleId: vehicle.id,
        status: plan.status,
        observations: plan.observations ?? null,
        queuedAt: plan.queuedAt,
        startedAt: plan.startedAt ?? null,
        completedAt: plan.completedAt ?? null,
        cancelledAt: plan.cancelledAt ?? null,
        totalPrice,
        totalCost: 0,
        items: {
          create: items.map((it) => {
            const st = serviceTypes.find((s) => s.id === it.serviceTypeId);
            return {
              serviceTypeId: it.serviceTypeId,
              quantity: it.quantity,
              priceAtTime: st?.basePrice ?? 0,
              costAtTime: 0,
            };
          }),
        },
      },
      include: { items: true },
    });

    if (plan.status === 'COMPLETED') {
      // Simulate stock movement for completed orders
      for (const it of order.items) {
        const usages = await prisma.serviceProductUsage.findMany({
          where: { serviceTypeId: it.serviceTypeId },
          include: { product: true },
        });
        for (const u of usages) {
          const factor =
            vehicle.size === 'SMALL'
              ? u.factorSmall
              : vehicle.size === 'MEDIUM'
              ? u.factorMedium
              : vehicle.size === 'LARGE'
              ? u.factorLarge
              : u.factorXLarge;
          const used = Math.round(u.baseQuantity * factor * it.quantity * 100) / 100;
          if (used <= 0) continue;
          await prisma.product.update({
            where: { id: u.productId },
            data: { currentStock: { increment: -used } },
          });
          await prisma.stockMovement.create({
            data: {
              businessId: business.id,
              productId: u.productId,
              delta: -used,
              reason: 'USAGE',
              reference: order.id,
              note: `Consumo automático · OS ${order.id.slice(-6)}`,
            },
          });
        }
      }
      // Compute and persist the totalCost for completed orders
      const cost = await simulateCost(
        order.items.map((it) => ({
          serviceTypeId: it.serviceTypeId,
          quantity: it.quantity,
          vehicleSize: vehicle.size as 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE',
        })),
      );
      await prisma.serviceOrder.update({
        where: { id: order.id },
        data: { totalCost: cost },
      });
      await prisma.serviceOrderItem.updateMany({
        where: { serviceOrderId: order.id },
        data: { costAtTime: 0 },
      });
    }
  }

  // ---- Final summary log
  const counts = {
    business: await prisma.business.count(),
    customers: await prisma.customer.count(),
    vehicles: await prisma.vehicle.count(),
    services: await prisma.serviceType.count(),
    products: await prisma.product.count(),
    orders: await prisma.serviceOrder.count(),
    ordersQueued: await prisma.serviceOrder.count({ where: { status: 'QUEUED' } }),
    ordersInProgress: await prisma.serviceOrder.count({ where: { status: 'IN_PROGRESS' } }),
    ordersCompleted: await prisma.serviceOrder.count({ where: { status: 'COMPLETED' } }),
    ordersCancelled: await prisma.serviceOrder.count({ where: { status: 'CANCELLED' } }),
    stockMovements: await prisma.stockMovement.count(),
  };

  console.log('Seed completo:');
  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
