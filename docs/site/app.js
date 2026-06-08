const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

const orders = [
  { id: "OS-1001", customer: "Ana Lima", plate: "BRA2E19", vehicle: "Hyundai HB20", service: "Lavagem simples", status: "completed", value: 45, started: "08:40", finished: "09:05" },
  { id: "OS-1002", customer: "Bruno Santos", plate: "SAO1C44", vehicle: "Honda Civic", service: "Lavagem completa", status: "completed", value: 85, started: "09:25", finished: "10:25" },
  { id: "OS-1003", customer: "Carla Rocha", plate: "DFG7H12", vehicle: "Jeep Compass", service: "Lavagem técnica + Higienização", status: "completed", value: 235, started: "10:30", finished: "12:30" },
  { id: "OS-1004", customer: "Diego Pereira", plate: "MNO3P88", vehicle: "Volkswagen Nivus", service: "Lavagem simples + Pretinho", status: "completed", value: 70, started: "11:30", finished: "12:05" },
  { id: "OS-1005", customer: "Elaine Costa", plate: "XYZ9K02", vehicle: "Fiat Pulse", service: "Lavagem completa", status: "completed", value: 85, started: "13:00", finished: "14:00" },
  { id: "OS-1006", customer: "Felipe Marques", plate: "QWE5R67", vehicle: "Chevrolet Tracker", service: "Polimento cristalizado", status: "completed", value: 380, started: "14:00", finished: "16:30" },
  { id: "OS-1007", customer: "Gabriela Souza", plate: "PJK2L54", vehicle: "Mitsubishi Pajero", service: "Lavagem completa", status: "progress", value: 85, started: "15:05" },
  { id: "OS-1008", customer: "Henrique Oliveira", plate: "BCD8F31", vehicle: "Renault Kwid", service: "Lavagem simples", status: "progress", value: 45, started: "15:35" },
  { id: "OS-1009", customer: "Ana Lima", plate: "RIO4A33", vehicle: "Toyota Corolla", service: "Lavagem técnica", status: "queued", value: 140 },
  { id: "OS-1010", customer: "Bruno Santos", plate: "TUV6G90", vehicle: "BYD Dolphin", service: "Higienização interna", status: "queued", value: 95 },
  { id: "OS-1011", customer: "Carla Rocha", plate: "SAO1C44", vehicle: "Honda Civic", service: "Lavagem simples", status: "cancelled", value: 45 },
  { id: "OS-1012", customer: "Diego Pereira", plate: "DFG7H12", vehicle: "Jeep Compass", service: "Polimento cristalizado", status: "queued", value: 380 },
];

const services = [
  { name: "Lavagem simples", price: 45, duration: "30 min", inputs: "Shampoo + microfibra" },
  { name: "Lavagem completa", price: 85, duration: "60 min", inputs: "Shampoo, desengraxante, pretinho e painel" },
  { name: "Lavagem técnica", price: 140, duration: "90 min", inputs: "Cera, shampoo, sabão de roda e acabamento" },
  { name: "Polimento cristalizado", price: 380, duration: "180 min", inputs: "Cera de proteção, desengraxante e microfibra" },
  { name: "Higienização interna", price: 95, duration: "75 min", inputs: "Desinfetante, desengraxante e microfibra" },
  { name: "Pretinho nos pneus", price: 25, duration: "15 min", inputs: "Pretinho líquido + microfibra" },
];

const products = [
  { name: "Shampoo automotivo", stock: 4474, min: 1500, unit: "ml" },
  { name: "Cera de proteção", stock: 1597, min: 800, unit: "ml" },
  { name: "Desengraxante", stock: 684, min: 1200, unit: "ml" },
  { name: "Pneu pretinho", stock: 568, min: 400, unit: "ml" },
  { name: "Microfibra", stock: 54, min: 24, unit: "un" },
  { name: "Desinfetante de painel", stock: 1291, min: 600, unit: "ml" },
  { name: "Sabão de roda", stock: 2142, min: 800, unit: "ml" },
  { name: "Pretinho líquido", stock: 350, min: 400, unit: "ml" },
];

const screenMeta = {
  painel: ["Painel operacional", "Síntese do turno, fila, receita, custo e estoque."],
  fila: ["Fila do turno", "Cada ordem em uma raia clara de execução."],
  ordens: ["Ordens de serviço", "Histórico demonstrativo do turno."],
  "nova-os": ["Nova OS", "Prévia da criação de ordem no MVP funcional."],
  clientes: ["Clientes", "Base demonstrativa de clientes e veículos."],
  servicos: ["Serviços", "Catálogo com preço, duração e insumos."],
  estoque: ["Estoque / SmartStock", "Níveis atuais, alertas e consumo estimado."],
  relatorio: ["Relatório diário", "Receita, custo, margem e sinais de fechamento."],
};

const statusMap = {
  completed: ["Concluída", "ok"],
  progress: ["Em execução", "info"],
  queued: ["Na fila", "warn"],
  cancelled: ["Cancelada", "bad"],
};

const completed = orders.filter((order) => order.status === "completed");
const active = orders.filter((order) => ["queued", "progress"].includes(order.status));
const revenue = completed.reduce((sum, order) => sum + order.value, 0);
const estimatedCost = 64.82;
const margin = revenue - estimatedCost;
const avgTicket = revenue / completed.length;
const lowProducts = products.filter((product) => product.stock <= product.min);

function status(orderStatus) {
  const [label, tone] = statusMap[orderStatus];
  return `<span class="pill ${tone}">${label}</span>`;
}

function kpi(label, value, hint, tone = "") {
  return `<article class="kpi-card ${tone}"><span>${label}</span><strong>${value}</strong><small>${hint}</small></article>`;
}

function block(title, subtitle, content, className = "") {
  return `<article class="data-card ${className}"><header><h4>${title}</h4>${subtitle ? `<p>${subtitle}</p>` : ""}</header>${content}</article>`;
}

function orderItem(order) {
  return `<li class="order-item"><div><span class="mono">${order.id}</span><strong>${order.customer}</strong><small>${order.vehicle} · ${order.plate}</small><small>${order.service}</small></div><div class="item-side"><b>${money.format(order.value)}</b>${status(order.status)}</div></li>`;
}

function orderTable(list) {
  return `<div class="table-scroll"><table><thead><tr><th>OS</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Status</th><th class="right">Valor</th></tr></thead><tbody>${list.map((order) => `<tr><td class="mono">${order.id}</td><td>${order.customer}</td><td><span class="mono">${order.plate}</span><br>${order.vehicle}</td><td>${order.service}</td><td>${status(order.status)}</td><td class="right">${money.format(order.value)}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderPainel() {
  return `<div class="screen-grid"><section class="kpi-grid">${kpi("Receita", money.format(revenue), `${completed.length} ordens concluídas`, "accent")}${kpi("Margem", money.format(margin), "Estimativa do turno", "ok")}${kpi("Custo químico", money.format(estimatedCost), "Consumo simulado", "warn")}${kpi("Ticket médio", money.format(avgTicket), "Por OS concluída")}</section>${block("Fila ativa", "Ordens aguardando ou em execução", `<ul class="order-list">${active.map(orderItem).join("")}</ul>`, "wide")}${block("Pulso do turno", "Sinais que importam agora", `<div class="signal-list"><div><b>3</b><span>na fila</span></div><div><b>2</b><span>em execução</span></div><div><b>${lowProducts.length}</b><span>alertas de estoque</span></div><div><b>34</b><span>movimentos</span></div></div>`)}${block("Concluídas hoje", "Fechamento parcial do turno", orderTable(completed), "wide")}</div>`;
}

function renderFila() {
  const lanes = ["queued", "progress", "completed", "cancelled"];
  return `<div class="lane-grid">${lanes.map((lane) => { const laneOrders = orders.filter((order) => order.status === lane); const [label, tone] = statusMap[lane]; return block(`${label} (${laneOrders.length})`, "Raia operacional", laneOrders.length ? `<ul class="order-list">${laneOrders.map(orderItem).join("")}</ul>` : `<p class="empty">Sem ordens nesta raia.</p>`, tone); }).join("")}</div>`;
}

function renderOrdens() {
  return `<div class="screen-grid"><section class="kpi-grid">${kpi("Total", "12", "Ordens demonstrativas")}${kpi("Ativas", active.length, "Fila + execução", "accent")}${kpi("Concluídas", completed.length, "Turno demo", "ok")}${kpi("Canceladas", "1", "Registro mantido", "bad")}</section>${block("Histórico de ordens", "Visão consolidada", orderTable(orders), "wide")}</div>`;
}

function renderNovaOs() {
  return `<div class="two-up">${block("Nova ordem de serviço", "Formulário demonstrativo", `<div class="form-demo"><label>Cliente<output>Ana Lima</output></label><label>Veículo<output>Toyota Corolla · RIO4A33</output></label><label>Serviços<output>Lavagem técnica + Pretinho nos pneus</output></label><label>Observações<output>Revisar capô e rodas antes da entrega.</output></label><button type="button" class="primary-button" data-demo>Simular criação</button></div>`)}${block("Cálculo previsto", "Valor, custo e margem antes da execução", `<div class="signal-list"><div><b>${money.format(165)}</b><span>valor</span></div><div><b>${money.format(8.73)}</b><span>custo</span></div><div><b>105 min</b><span>duração</span></div><div><b>${money.format(156.27)}</b><span>margem</span></div></div><p class="muted-note">No MVP local, concluir a OS gera baixa auditável de estoque.</p>`)}</div>`;
}

function renderClientes() {
  const unique = [...new Map(orders.map((order) => [order.customer, order])).values()];
  return `<div class="screen-grid"><section class="kpi-grid">${kpi("Clientes", "8", "Base demo", "accent")}${kpi("Veículos", "10", "Cadastrados")}${kpi("Recorrentes", "2", "Mais de um veículo", "warn")}${kpi("Canal", "WhatsApp", "Rotina atual")}</section>${block("Clientes e veículos", "Lista reduzida para validação", `<ul class="order-list">${unique.map((order) => `<li class="order-item"><div><strong>${order.customer}</strong><small>${order.vehicle} · <span class="mono">${order.plate}</span></small></div><div class="item-side"><span>${order.service}</span></div></li>`).join("")}</ul>`, "wide")}</div>`;
}

function renderServicos() {
  return `<div class="service-grid">${services.map((service) => block(service.name, service.inputs, `<div class="service-meta"><strong>${money.format(service.price)}</strong><span>${service.duration}</span></div>`)).join("")}</div>`;
}

function renderEstoque() {
  return `<div class="screen-grid"><section class="kpi-grid">${kpi("Produtos", "8", "Catálogo")}${kpi("Alertas", lowProducts.length, "Abaixo do mínimo", lowProducts.length ? "bad" : "ok")}${kpi("Movimentos", "34", "Entradas + consumo", "accent")}${kpi("Custo", money.format(estimatedCost), "Consumido", "warn")}</section>${block("SmartStock", "Estoque calculado a partir do consumo estimado", `<ul class="order-list">${products.map((product) => { const ratio = Math.min(100, Math.max(6, (product.stock / product.min) * 100)); const low = product.stock <= product.min; return `<li class="stock-item"><div><strong>${product.name} ${low ? `<span class="pill bad">baixo</span>` : ""}</strong><small>Mínimo: ${number.format(product.min)} ${product.unit}</small><span class="bar"><i class="${low ? "low" : ""}" style="width:${ratio}%"></i></span></div><b>${number.format(product.stock)} ${product.unit}</b></li>`; }).join("")}</ul>`, "wide")}</div>`;
}

function renderRelatorio() {
  return `<div class="screen-grid"><section class="kpi-grid">${kpi("Receita", money.format(revenue), "6 ordens", "accent")}${kpi("Custo", money.format(estimatedCost), "Produtos", "warn")}${kpi("Margem", money.format(margin), "Resultado bruto", "ok")}${kpi("Ticket", money.format(avgTicket), "Média")}</section>${block("Resumo executivo", "Fechamento do turno", `<ul class="order-list"><li class="order-item"><span>Serviço mais vendido</span><b>Lavagem completa</b></li><li class="order-item"><span>Produtos críticos</span><b>${lowProducts.length}</b></li><li class="order-item"><span>Movimentos auditáveis</span><b>34</b></li><li class="order-item"><span>Hipótese validada</span><b>Estoque por serviço</b></li></ul>`)}${block("Nota de validação", "Demo pública", `<p class="muted-note">Esta demo valida narrativa e interface. Para validar persistência, baixa de estoque e criação real de OS, rode o MVP offline-first local.</p>`)}</div>`;
}

const renderers = { painel: renderPainel, fila: renderFila, ordens: renderOrdens, "nova-os": renderNovaOs, clientes: renderClientes, servicos: renderServicos, estoque: renderEstoque, relatorio: renderRelatorio };

function currentScreen() {
  const hash = window.location.hash.replace("#", "");
  return renderers[hash] ? hash : "painel";
}

function render() {
  const screen = currentScreen();
  const [title, description] = screenMeta[screen];
  document.querySelector("#screen-kicker").textContent = "Aplicação";
  document.querySelector("#screen-title").textContent = title;
  document.querySelector("#screen-description").textContent = description;
  document.querySelector("#screen-body").innerHTML = renderers[screen]();
  document.querySelectorAll("[data-screen]").forEach((link) => link.classList.toggle("active", link.dataset.screen === screen));
  document.title = `LavaPro — ${title}`;
  bindDemo();
}

function bindDemo() {
  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => showToast("Prévia estática: nenhuma OS foi gravada. Rode o MVP local para persistência real."));
  });
}

function showToast(message) {
  const current = document.querySelector(".toast");
  if (current) current.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => toast.classList.remove("show"), 3200);
  setTimeout(() => toast.remove(), 3800);
}

document.querySelectorAll("[data-enter-app]").forEach((link) => {
  link.addEventListener("click", () => {
    if (!window.location.hash || window.location.hash === "#memorial") window.location.hash = "painel";
  });
});

window.addEventListener("hashchange", render);
render();

window.LavaProStaticDemo = { orders, services, products };
