const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const number = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

const business = {
  name: "LavaPro Centro",
  slug: "lavapro-centro",
};

const customers = [
  { id: "c1", name: "Ana Lima", phone: "(11) 98123-4521", email: "ana.lima@example.com" },
  { id: "c2", name: "Bruno Santos", phone: "(11) 99812-3344", email: "" },
  { id: "c3", name: "Carla Rocha", phone: "(11) 97777-1029", email: "carla.rocha@example.com" },
  { id: "c4", name: "Diego Pereira", phone: "(11) 96654-0098", email: "" },
  { id: "c5", name: "Elaine Costa", phone: "(11) 95512-8877", email: "elaine.costa@example.com" },
  { id: "c6", name: "Felipe Marques", phone: "(11) 94421-7766", email: "" },
  { id: "c7", name: "Gabriela Souza", phone: "(11) 93355-2244", email: "gabriela.souza@example.com" },
  { id: "c8", name: "Henrique Oliveira", phone: "(11) 92211-0011", email: "" },
];

const vehicles = [
  { id: "v1", customerId: "c1", plate: "BRA2E19", brand: "Hyundai", model: "HB20", color: "Prata", size: "SMALL" },
  { id: "v2", customerId: "c1", plate: "RIO4A33", brand: "Toyota", model: "Corolla", color: "Preto", size: "MEDIUM" },
  { id: "v3", customerId: "c2", plate: "SAO1C44", brand: "Honda", model: "Civic", color: "Branco", size: "MEDIUM" },
  { id: "v4", customerId: "c3", plate: "DFG7H12", brand: "Jeep", model: "Compass", color: "Cinza", size: "LARGE" },
  { id: "v5", customerId: "c3", plate: "MNO3P88", brand: "Volkswagen", model: "Nivus", color: "Vermelho", size: "SMALL" },
  { id: "v6", customerId: "c4", plate: "XYZ9K02", brand: "Fiat", model: "Pulse", color: "Branco", size: "SMALL" },
  { id: "v7", customerId: "c5", plate: "QWE5R67", brand: "Chevrolet", model: "Tracker", color: "Prata", size: "MEDIUM" },
  { id: "v8", customerId: "c6", plate: "PJK2L54", brand: "Mitsubishi", model: "Pajero Sport", color: "Preto", size: "EXTRA_LARGE" },
  { id: "v9", customerId: "c7", plate: "BCD8F31", brand: "Renault", model: "Kwid", color: "Branco", size: "SMALL" },
  { id: "v10", customerId: "c8", plate: "TUV6G90", brand: "BYD", model: "Dolphin", color: "Azul", size: "SMALL" },
];

const products = [
  { id: "p1", name: "Shampoo automotivo", unit: "ml", initialStock: 5000, minStock: 1500, unitCost: 0.012 },
  { id: "p2", name: "Cera de protecao", unit: "ml", initialStock: 1800, minStock: 800, unitCost: 0.045 },
  { id: "p3", name: "Desengraxante", unit: "ml", initialStock: 900, minStock: 1200, unitCost: 0.022 },
  { id: "p4", name: "Pneu pretinho", unit: "ml", initialStock: 700, minStock: 400, unitCost: 0.038 },
  { id: "p5", name: "Microfibra", unit: "un", initialStock: 60, minStock: 24, unitCost: 6.5 },
  { id: "p6", name: "Desinfetante de painel", unit: "ml", initialStock: 1400, minStock: 600, unitCost: 0.018 },
  { id: "p7", name: "Sabao de roda", unit: "ml", initialStock: 2200, minStock: 800, unitCost: 0.015 },
  { id: "p8", name: "Pretinho liquido", unit: "ml", initialStock: 350, minStock: 400, unitCost: 0.05 },
];

const services = [
  {
    id: "s1",
    name: "Lavagem simples",
    description: "Lavagem externa com shampoo e secagem.",
    basePrice: 45,
    durationMin: 30,
    usages: [
      usage("p1", 60, 0.85, 1, 1.25, 1.6),
      usage("p5", 0.2, 0.9, 1, 1.1, 1.2),
    ],
  },
  {
    id: "s2",
    name: "Lavagem completa",
    description: "Lavagem externa + interna + secagem + pretinho.",
    basePrice: 85,
    durationMin: 60,
    usages: [
      usage("p1", 80, 0.85, 1, 1.25, 1.6),
      usage("p3", 25, 0.9, 1, 1.3, 1.6),
      usage("p4", 30, 0.85, 1, 1.2, 1.4),
      usage("p5", 0.5, 0.9, 1, 1.1, 1.2),
      usage("p6", 25, 0.9, 1, 1.1, 1.3),
    ],
  },
  {
    id: "s3",
    name: "Lavagem tecnica",
    description: "Lavagem detalhada com cera de protecao e secagem precisa.",
    basePrice: 140,
    durationMin: 90,
    usages: [
      usage("p1", 90, 0.85, 1, 1.25, 1.6),
      usage("p2", 50, 0.85, 1, 1.2, 1.5),
      usage("p5", 0.8, 0.9, 1, 1.1, 1.2),
      usage("p7", 40, 0.9, 1, 1.2, 1.5),
    ],
  },
  {
    id: "s4",
    name: "Polimento cristalizado",
    description: "Polimento de pintura com protecao por 6 meses.",
    basePrice: 380,
    durationMin: 180,
    usages: [
      usage("p2", 90, 0.85, 1, 1.2, 1.5),
      usage("p3", 40, 0.9, 1, 1.3, 1.6),
      usage("p5", 1.5, 0.9, 1, 1.1, 1.2),
    ],
  },
  {
    id: "s5",
    name: "Higienizacao interna",
    description: "Aspiracao, paineis, vidros internos e aromatizacao.",
    basePrice: 95,
    durationMin: 75,
    usages: [
      usage("p6", 40, 0.9, 1, 1.1, 1.3),
      usage("p3", 20, 0.9, 1, 1.2, 1.4),
      usage("p5", 0.6, 0.9, 1, 1.1, 1.2),
    ],
  },
  {
    id: "s6",
    name: "Pretinho nos pneus",
    description: "Aplicacao de pretinho liquido com acabamento uniforme.",
    basePrice: 25,
    durationMin: 15,
    usages: [
      usage("p4", 25, 0.85, 1, 1.2, 1.4),
      usage("p5", 0.2, 0.9, 1, 1.1, 1.2),
    ],
  },
];

const orders = [
  order("OS-1001", "c1", "v1", ["s1"], "COMPLETED", "08:30", "08:40", "09:05"),
  order("OS-1002", "c2", "v3", ["s2"], "COMPLETED", "09:15", "09:25", "10:25"),
  order("OS-1003", "c3", "v4", ["s3", "s5"], "COMPLETED", "10:00", "10:30", "12:30"),
  order("OS-1004", "c4", "v5", ["s1", "s6"], "COMPLETED", "11:10", "11:30", "12:05"),
  order("OS-1005", "c5", "v6", ["s2"], "COMPLETED", "12:40", "13:00", "14:00"),
  order("OS-1006", "c6", "v7", ["s4"], "COMPLETED", "13:30", "14:00", "16:30"),
  order("OS-1007", "c7", "v8", ["s2"], "IN_PROGRESS", "14:50", "15:05"),
  order("OS-1008", "c8", "v9", ["s1"], "IN_PROGRESS", "15:20", "15:35"),
  order("OS-1009", "c1", "v2", ["s3"], "QUEUED", "16:00"),
  order("OS-1010", "c2", "v10", ["s5"], "QUEUED", "16:15"),
  order("OS-1011", "c3", "v3", ["s1"], "CANCELLED", "07:30", null, null, "07:50", "Cliente desistiu - fila muito longa."),
  order("OS-1012", "c4", "v4", ["s4"], "QUEUED", "17:00", null, null, null, "Levar cuidado extra com capo."),
];

const viewMeta = {
  dashboard: "Dashboard",
  queue: "Queue",
  orders: "Orders",
  "new-order": "New Order preview",
  customers: "Customers",
  services: "Services",
  inventory: "Inventory / SmartStock",
  report: "Daily Report",
};

const statusLabel = {
  QUEUED: "Na fila",
  IN_PROGRESS: "Em execucao",
  COMPLETED: "Concluida",
  CANCELLED: "Cancelada",
};

const statusClass = {
  QUEUED: "queued",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const sizeLabel = {
  SMALL: "Pequeno",
  MEDIUM: "Medio",
  LARGE: "Grande",
  EXTRA_LARGE: "Extra grande",
};

function usage(productId, base, factorSmall, factorMedium, factorLarge, factorXLarge) {
  return { productId, base, factorSmall, factorMedium, factorLarge, factorXLarge };
}

function order(id, customerId, vehicleId, serviceIds, status, queuedAt, startedAt, completedAt, cancelledAt, observations = "") {
  return { id, customerId, vehicleId, serviceIds, status, queuedAt, startedAt, completedAt, cancelledAt, observations };
}

function factorFor(size, item) {
  if (size === "SMALL") return item.factorSmall;
  if (size === "LARGE") return item.factorLarge;
  if (size === "EXTRA_LARGE") return item.factorXLarge;
  return item.factorMedium;
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function serviceById(id) {
  return services.find((service) => service.id === id);
}

function customerById(id) {
  return customers.find((customer) => customer.id === id);
}

function vehicleById(id) {
  return vehicles.find((vehicle) => vehicle.id === id);
}

function orderTotal(orderItem) {
  return orderItem.serviceIds.reduce((sum, id) => sum + serviceById(id).basePrice, 0);
}

function orderDuration(orderItem) {
  return orderItem.serviceIds.reduce((sum, id) => sum + serviceById(id).durationMin, 0);
}

function plannedUsageForOrder(orderItem) {
  const vehicle = vehicleById(orderItem.vehicleId);
  return orderItem.serviceIds.flatMap((serviceId) => {
    const service = serviceById(serviceId);
    return service.usages.map((item) => ({
      serviceId,
      productId: item.productId,
      quantity: round2(item.base * factorFor(vehicle.size, item)),
    }));
  });
}

function costForOrder(orderItem) {
  return round2(
    plannedUsageForOrder(orderItem).reduce((sum, item) => {
      const product = productById(item.productId);
      return sum + item.quantity * product.unitCost;
    }, 0),
  );
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function buildMovements() {
  const movements = products.map((product, index) => ({
    id: `SM-${String(index + 1).padStart(3, "0")}`,
    time: "07:00",
    productId: product.id,
    delta: product.initialStock,
    reason: "INITIAL",
    reference: "",
    note: "Estoque inicial da operacao",
  }));

  let movementIndex = movements.length + 1;
  orders
    .filter((item) => item.status === "COMPLETED")
    .forEach((item) => {
      plannedUsageForOrder(item).forEach((planned) => {
        movements.push({
          id: `SM-${String(movementIndex).padStart(3, "0")}`,
          time: item.completedAt,
          productId: planned.productId,
          delta: -planned.quantity,
          reason: "USAGE",
          reference: item.id,
          note: `Consumo automatico - ${item.id}`,
        });
        movementIndex += 1;
      });
    });

  return movements;
}

const movements = buildMovements();

const stockByProduct = products.reduce((acc, product) => {
  acc[product.id] = round2(
    movements
      .filter((movement) => movement.productId === product.id)
      .reduce((sum, movement) => sum + movement.delta, 0),
  );
  return acc;
}, {});

const completedOrders = orders.filter((item) => item.status === "COMPLETED");
const activeOrders = orders.filter((item) => ["QUEUED", "IN_PROGRESS"].includes(item.status));
const lowProducts = products.filter((product) => stockByProduct[product.id] <= product.minStock);

const report = {
  revenue: completedOrders.reduce((sum, item) => sum + orderTotal(item), 0),
  cost: round2(completedOrders.reduce((sum, item) => sum + costForOrder(item), 0)),
  ordersCompleted: completedOrders.length,
  servicesCompleted: completedOrders.reduce((sum, item) => sum + item.serviceIds.length, 0),
};
report.margin = round2(report.revenue - report.cost);
report.marginPct = report.revenue > 0 ? report.margin / report.revenue : 0;
report.ticketAverage = report.ordersCompleted > 0 ? report.revenue / report.ordersCompleted : 0;

function serviceMix() {
  const map = new Map();
  completedOrders.forEach((item) => {
    item.serviceIds.forEach((serviceId) => {
      const service = serviceById(serviceId);
      const current = map.get(serviceId) || { name: service.name, quantity: 0, revenue: 0 };
      current.quantity += 1;
      current.revenue += service.basePrice;
      map.set(serviceId, current);
    });
  });
  return [...map.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue);
}

function statusPill(status) {
  return `<span class="status ${statusClass[status]}">${statusLabel[status]}</span>`;
}

function metric(label, value, hint, tone = "") {
  return `
    <section class="card-shell metric-card">
      <div class="card">
        <p class="metric-label">${label}</p>
        <p class="metric-value ${tone}">${value}</p>
        <p class="metric-hint">${hint}</p>
      </div>
    </section>
  `;
}

function wrapCard(title, subtitle, body, extra = "") {
  return `
    <section class="card-shell ${extra}">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>${title}</h2>
            ${subtitle ? `<p class="card-subtitle">${subtitle}</p>` : ""}
          </div>
        </div>
        ${body}
      </div>
    </section>
  `;
}

function renderDashboard() {
  const topService = serviceMix()[0];
  return `
    <section class="view">
      <div class="four-col">
        ${metric("Receita do dia", money.format(report.revenue), `${report.ordersCompleted} ordens concluidas`, "accent")}
        ${metric("Margem bruta", money.format(report.margin), `${percent(report.marginPct)} de margem`, "ok")}
        ${metric("Custo quimico", money.format(report.cost), "Consumo efetivo simulado", "warn")}
        ${metric("Ticket medio", money.format(report.ticketAverage), `${report.servicesCompleted} servicos executados`)}
      </div>

      <div class="hero-grid">
        ${wrapCard(
          "Fila ativa",
          "Ordens prontas para iniciar ou em execucao",
          `<ul class="lane-list">${activeOrders.map(orderRow).join("")}</ul>`,
        )}
        ${wrapCard(
          "Pulso operacional",
          "Status do turno demo",
          `<div class="kpi-strip">
            <span class="tag warn">${countStatus("QUEUED")} na fila</span>
            <span class="tag accent">${countStatus("IN_PROGRESS")} em execucao</span>
            <span class="tag ok">${countStatus("COMPLETED")} concluidas</span>
            <span class="tag">${movements.length} movimentos</span>
          </div>
          <div style="height:18px"></div>
          <p class="row-title">Mais vendido hoje</p>
          <p class="row-meta">${topService.quantity}x ${topService.name} - ${money.format(topService.revenue)} em receita.</p>
          <div style="height:18px"></div>
          <p class="row-title">Estoque em alerta</p>
          <p class="row-meta">${lowProducts.length} produtos abaixo ou no minimo operacional.</p>`,
        )}
      </div>

      ${wrapCard(
        "Concluidas hoje",
        "Receita, custo e margem estimada por OS finalizada",
        `<div class="table-wrap">${ordersTable(completedOrders)}</div>`,
      )}
    </section>
  `;
}

function orderRow(item) {
  const customer = customerById(item.customerId);
  const vehicle = vehicleById(item.vehicleId);
  const servicesText = item.serviceIds.map((id) => serviceById(id).name).join(" + ");
  return `
    <li class="row-card">
      <div>
        <p class="row-title">${customer.name} <span class="mono fine">${vehicle.plate}</span></p>
        <p class="row-meta">${vehicle.brand} ${vehicle.model} - ${servicesText}</p>
      </div>
      <div class="right">
        <p class="row-title">${money.format(orderTotal(item))}</p>
        ${statusPill(item.status)}
      </div>
    </li>
  `;
}

function countStatus(status) {
  return orders.filter((item) => item.status === status).length;
}

function renderQueue() {
  const lanes = ["QUEUED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  return `
    <section class="view">
      <div class="four-col">
        ${lanes.map((status) => metric(statusLabel[status], countStatus(status), laneHint(status), statusTone(status))).join("")}
      </div>
      <div class="two-col">
        ${lanes.map((status) => {
          const laneOrders = orders.filter((item) => item.status === status);
          return wrapCard(
            `${statusLabel[status]} (${laneOrders.length})`,
            laneHint(status),
            laneOrders.length
              ? `<ul class="lane-list">${laneOrders.map(orderRow).join("")}</ul>`
              : `<div class="empty-state"><h3>Sem ordens</h3><p>Nada nesta raia no momento.</p></div>`,
          );
        }).join("")}
      </div>
    </section>
  `;
}

function laneHint(status) {
  return {
    QUEUED: "Aguardando inicio",
    IN_PROGRESS: "Atendimento em andamento",
    COMPLETED: "Finalizadas no turno",
    CANCELLED: "Canceladas no turno",
  }[status];
}

function statusTone(status) {
  return {
    QUEUED: "warn",
    IN_PROGRESS: "info",
    COMPLETED: "ok",
    CANCELLED: "bad",
  }[status];
}

function renderOrders() {
  return `
    <section class="view">
      <div class="four-col">
        ${metric("Ordens", orders.length, "limite visual da demo")}
        ${metric("Ativas", activeOrders.length, "fila + execucao", "accent")}
        ${metric("Concluidas", completedOrders.length, "turno demo", "ok")}
        ${metric("Canceladas", countStatus("CANCELLED"), "registradas", "bad")}
      </div>
      ${wrapCard("Ordens de servico", "Historico completo mockado do seed", `<div class="table-wrap">${ordersTable(orders)}</div>`)}
    </section>
  `;
}

function ordersTable(list) {
  return `
    <table>
      <thead>
        <tr>
          <th>OS</th>
          <th>Cliente</th>
          <th>Veiculo</th>
          <th>Status</th>
          <th class="right">Valor</th>
          <th>Horario</th>
        </tr>
      </thead>
      <tbody>
        ${list.map((item) => {
          const customer = customerById(item.customerId);
          const vehicle = vehicleById(item.vehicleId);
          return `
            <tr>
              <td class="mono">${item.id}</td>
              <td>${customer.name}<br><span class="fine">${customer.phone}</span></td>
              <td>${vehicle.brand} ${vehicle.model}<br><span class="mono fine">${vehicle.plate}</span></td>
              <td>${statusPill(item.status)}</td>
              <td class="right">${money.format(orderTotal(item))}</td>
              <td>${timeline(item)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function timeline(item) {
  if (item.completedAt) return `${item.queuedAt} -> ${item.completedAt}`;
  if (item.cancelledAt) return `${item.queuedAt} -> ${item.cancelledAt}`;
  if (item.startedAt) return `${item.queuedAt} -> em execucao`;
  return `${item.queuedAt} -> aguardando`;
}

function renderNewOrder() {
  const preview = {
    customer: customers[0],
    vehicle: vehicles[1],
    serviceIds: ["s3", "s6"],
    observations: "Previa estatica: cliente quer revisar capo e rodas.",
  };
  const item = order("PREVIEW", preview.customer.id, preview.vehicle.id, preview.serviceIds, "QUEUED", "Agora");
  const planned = plannedUsageForOrder(item);
  return `
    <section class="view">
      <div class="hero-grid">
        ${wrapCard(
          "Nova ordem - preview",
          "Formulario demonstrativo sem persistencia. No MVP local, a criacao real usa server actions e SQLite.",
          `<div class="preview-form">
            <div class="field-grid">
              ${staticField("Cliente", `${preview.customer.name} - ${preview.customer.phone}`)}
              ${staticField("Veiculo", `${preview.vehicle.brand} ${preview.vehicle.model} - ${preview.vehicle.plate}`)}
              ${staticField("Servicos", preview.serviceIds.map((id) => serviceById(id).name).join(" + "))}
              ${staticField("Observacoes", preview.observations)}
            </div>
            <div class="button-row">
              <button type="button" class="primary-button" data-demo-action="create">Simular criacao</button>
              <a class="ghost-button" href="#orders">Ver ordens</a>
            </div>
          </div>`,
        )}
        ${wrapCard(
          "Resumo calculado",
          "Consumo planejado e margem estimada",
          `<div class="kpi-strip">
            <span class="tag accent">${money.format(orderTotal(item))}</span>
            <span class="tag warn">${money.format(costForOrder(item))} custo</span>
            <span class="tag">${orderDuration(item)} min</span>
          </div>
          <div style="height:18px"></div>
          <ul class="product-list">
            ${planned.map((line) => {
              const product = productById(line.productId);
              return `<li class="row-card"><span>${product.name}</span><span class="mono">${number.format(line.quantity)} ${product.unit}</span></li>`;
            }).join("")}
          </ul>`,
        )}
      </div>
    </section>
  `;
}

function staticField(label, value) {
  return `<label class="field"><span>${label}</span><output>${value}</output></label>`;
}

function renderCustomers() {
  return `
    <section class="view">
      <div class="four-col">
        ${metric("Clientes", customers.length, "seed demonstrativo", "accent")}
        ${metric("Veiculos", vehicles.length, "cadastrados")}
        ${metric("Com e-mail", customers.filter((item) => item.email).length, "contatos completos", "ok")}
        ${metric("Recorrentes", 2, "clientes com 2 veiculos", "warn")}
      </div>
      ${wrapCard(
        "Clientes",
        "Lista estatica baseada no prisma/seed.ts",
        `<ul class="customer-list">${customers.map((customer) => {
          const ownedVehicles = vehicles.filter((vehicle) => vehicle.customerId === customer.id);
          return `
            <li class="row-card">
              <div>
                <p class="row-title">${customer.name}</p>
                <p class="row-meta">${customer.phone}${customer.email ? ` - ${customer.email}` : ""}</p>
              </div>
              <div class="right">
                <p class="row-title">${ownedVehicles.length} veiculo${ownedVehicles.length === 1 ? "" : "s"}</p>
                <p class="row-meta">${ownedVehicles.map((vehicle) => vehicle.plate).join(", ")}</p>
              </div>
            </li>
          `;
        }).join("")}</ul>`,
      )}
    </section>
  `;
}

function renderServices() {
  return `
    <section class="view">
      <div class="three-col">
        ${services.map((service) => wrapCard(
          service.name,
          service.description,
          `<div class="kpi-strip">
            <span class="tag accent">${money.format(service.basePrice)}</span>
            <span class="tag">${service.durationMin} min</span>
            <span class="tag warn">${service.usages.length} insumos</span>
          </div>
          <div style="height:18px"></div>
          <ul class="product-list">
            ${service.usages.map((item) => {
              const product = productById(item.productId);
              return `<li class="row-card"><span>${product.name}</span><span class="mono">${number.format(item.base)} ${product.unit}</span></li>`;
            }).join("")}
          </ul>`,
        )).join("")}
      </div>
    </section>
  `;
}

function renderInventory() {
  return `
    <section class="view">
      <div class="four-col">
        ${metric("Produtos", products.length, "catalogo SmartStock")}
        ${metric("Alertas", lowProducts.length, "estoque baixo", lowProducts.length ? "bad" : "ok")}
        ${metric("Movimentos", movements.length, "8 iniciais + 26 usos", "accent")}
        ${metric("Custo consumido", money.format(report.cost), "ordens concluidas", "warn")}
      </div>
      ${wrapCard(
        "Inventory / SmartStock",
        "Estoque atual calculado a partir dos movimentos mockados",
        `<ul class="product-list">${products.map(productRow).join("")}</ul>`,
      )}
      ${wrapCard(
        "Movimentacoes de estoque",
        "Historico estatico com 34 movimentos",
        `<div class="table-wrap">${movementsTable()}</div>`,
      )}
    </section>
  `;
}

function productRow(product) {
  const stock = stockByProduct[product.id];
  const ratio = Math.min(100, Math.max(4, (stock / product.minStock) * 100));
  const low = stock <= product.minStock;
  return `
    <li class="row-card">
      <div>
        <p class="row-title">${product.name} ${low ? '<span class="status low">baixo</span>' : ""}</p>
        <p class="row-meta">minimo ${number.format(product.minStock)} ${product.unit} - custo ${money.format(product.unitCost)} / ${product.unit}</p>
        <div class="progress" aria-label="Nivel de estoque"><span class="${low ? "low" : ""}" style="width:${ratio}%"></span></div>
      </div>
      <div class="right">
        <p class="row-title">${number.format(stock)} ${product.unit}</p>
        <p class="row-meta">atual</p>
      </div>
    </li>
  `;
}

function movementsTable() {
  return `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Horario</th>
          <th>Produto</th>
          <th>Motivo</th>
          <th class="right">Delta</th>
          <th>Referencia</th>
        </tr>
      </thead>
      <tbody>
        ${movements.slice().reverse().map((movement) => {
          const product = productById(movement.productId);
          return `
            <tr>
              <td class="mono">${movement.id}</td>
              <td class="mono">${movement.time}</td>
              <td>${product.name}</td>
              <td><span class="tag ${movement.reason === "INITIAL" ? "accent" : "warn"}">${movement.reason}</span></td>
              <td class="right mono">${movement.delta > 0 ? "+" : ""}${number.format(movement.delta)} ${product.unit}</td>
              <td>${movement.reference || "Estoque inicial"}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderReport() {
  return `
    <section class="view">
      <div class="four-col">
        ${metric("Receita", money.format(report.revenue), `${report.ordersCompleted} ordens concluidas`, "accent")}
        ${metric("Custo estimado", money.format(report.cost), "consumo de produtos", "warn")}
        ${metric("Margem bruta", money.format(report.margin), percent(report.marginPct), "ok")}
        ${metric("Ticket medio", money.format(report.ticketAverage), "por ordem concluida")}
      </div>
      <div class="hero-grid">
        ${wrapCard(
          "Mix de servicos",
          "Servicos executados no turno demo",
          `<div class="table-wrap compact-table">
            <table>
              <thead><tr><th>Servico</th><th class="right">Qtd</th><th class="right">Receita</th></tr></thead>
              <tbody>
                ${serviceMix().map((item, index) => `
                  <tr>
                    <td>${item.name} ${index === 0 ? '<span class="tag accent">mais vendido</span>' : ""}</td>
                    <td class="right">${item.quantity}</td>
                    <td class="right">${money.format(item.revenue)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>`,
        )}
        ${wrapCard(
          "Resumo executivo",
          "Sinais para fechamento diario",
          `<ul class="product-list">
            <li class="row-card"><span>Velocidade</span><span>${report.ordersCompleted} ordens fechadas</span></li>
            <li class="row-card"><span>Margem</span><span>${percent(report.marginPct)}</span></li>
            <li class="row-card"><span>Estoque</span><span>${lowProducts.length} alertas</span></li>
            <li class="row-card"><span>Movimentos</span><span>${movements.length} registros</span></li>
          </ul>`,
        )}
      </div>
    </section>
  `;
}

function percent(value) {
  return `${Math.round(value * 100)}%`;
}

const renderers = {
  dashboard: renderDashboard,
  queue: renderQueue,
  orders: renderOrders,
  "new-order": renderNewOrder,
  customers: renderCustomers,
  services: renderServices,
  inventory: renderInventory,
  report: renderReport,
};

function currentView() {
  const view = window.location.hash.replace("#", "") || "dashboard";
  return renderers[view] ? view : "dashboard";
}

function render() {
  const view = currentView();
  document.title = `LavaPro - ${viewMeta[view]}`;
  document.querySelector("#view-title").textContent = viewMeta[view];
  document.querySelector("#main").innerHTML = renderers[view]();
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view);
  });
  bindDemoActions();
}

function bindDemoActions() {
  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.demoAction;
      const message =
        action === "create"
          ? "Preview estatico: nenhuma OS foi gravada. Rode o MVP local para persistencia real."
          : "Demo estatica validada localmente: sem backend, sem banco, sem runtime Next.";
      showToast(message);
    });
  });
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => toast.classList.remove("show"), 3200);
  setTimeout(() => toast.remove(), 3800);
}

window.addEventListener("hashchange", render);
render();

window.LavaProStaticDemo = {
  business,
  counts: {
    business: 1,
    customers: customers.length,
    vehicles: vehicles.length,
    services: services.length,
    products: products.length,
    orders: orders.length,
    stockMovements: movements.length,
  },
};
