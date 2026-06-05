const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

const orders = [
  ["OS-1001", "Ana Lima", "BRA2E19", "Hyundai HB20", "Lavagem simples", "CONCLUIDA", 45],
  ["OS-1002", "Bruno Santos", "SAO1C44", "Honda Civic", "Lavagem completa", "CONCLUIDA", 85],
  ["OS-1003", "Carla Rocha", "DFG7H12", "Jeep Compass", "Lavagem técnica + Higienização", "CONCLUIDA", 235],
  ["OS-1004", "Diego Pereira", "MNO3P88", "Volkswagen Nivus", "Lavagem simples + Pretinho", "CONCLUIDA", 70],
  ["OS-1005", "Elaine Costa", "XYZ9K02", "Fiat Pulse", "Lavagem completa", "CONCLUIDA", 85],
  ["OS-1006", "Felipe Marques", "QWE5R67", "Chevrolet Tracker", "Polimento cristalizado", "CONCLUIDA", 380],
  ["OS-1007", "Gabriela Souza", "PJK2L54", "Mitsubishi Pajero", "Lavagem completa", "EM_EXECUCAO", 85],
  ["OS-1008", "Henrique Oliveira", "BCD8F31", "Renault Kwid", "Lavagem simples", "EM_EXECUCAO", 45],
  ["OS-1009", "Ana Lima", "RIO4A33", "Toyota Corolla", "Lavagem técnica", "NA_FILA", 140],
  ["OS-1010", "Bruno Santos", "TUV6G90", "BYD Dolphin", "Higienização interna", "NA_FILA", 95],
  ["OS-1011", "Carla Rocha", "SAO1C44", "Honda Civic", "Lavagem simples", "CANCELADA", 45],
  ["OS-1012", "Diego Pereira", "DFG7H12", "Jeep Compass", "Polimento cristalizado", "NA_FILA", 380],
];

const services = [
  ["Lavagem simples", 45, "30 min", "Shampoo + microfibra"],
  ["Lavagem completa", 85, "60 min", "Shampoo, desengraxante, pretinho e painel"],
  ["Lavagem técnica", 140, "90 min", "Cera, shampoo, roda e acabamento"],
  ["Polimento cristalizado", 380, "180 min", "Proteção de pintura e descontaminação"],
  ["Higienização interna", 95, "75 min", "Painéis, vidros internos e aromatização"],
  ["Pretinho nos pneus", 25, "15 min", "Aplicação uniforme e acabamento"],
];

const products = [
  ["Shampoo automotivo", 4474, 1500, "ml"],
  ["Cera de proteção", 1597, 800, "ml"],
  ["Desengraxante", 684, 1200, "ml"],
  ["Pneu pretinho", 568, 400, "ml"],
  ["Microfibra", 54, 24, "un"],
  ["Desinfetante de painel", 1291, 600, "ml"],
  ["Sabão de roda", 2142, 800, "ml"],
  ["Pretinho líquido", 350, 400, "ml"],
];

const views = {
  memorial: "Memorial do produto",
  painel: "Painel operacional",
  fila: "Fila",
  ordens: "Ordens de serviço",
  "nova-os": "Nova OS",
  clientes: "Clientes",
  servicos: "Serviços",
  estoque: "Estoque / SmartStock",
  relatorio: "Relatório diário",
};

const statusLabel = { CONCLUIDA: "Concluída", EM_EXECUCAO: "Em execução", NA_FILA: "Na fila", CANCELADA: "Cancelada" };
const statusClass = { CONCLUIDA: "ok", EM_EXECUCAO: "info", NA_FILA: "warn", CANCELADA: "bad" };

const completedOrders = orders.filter((item) => item[5] === "CONCLUIDA");
const activeOrders = orders.filter((item) => ["NA_FILA", "EM_EXECUCAO"].includes(item[5]));
const revenue = completedOrders.reduce((sum, item) => sum + item[6], 0);
const estimatedCost = 64.82;
const grossMargin = revenue - estimatedCost;
const averageTicket = revenue / completedOrders.length;
const lowProducts = products.filter((item) => item[1] <= item[2]);

function metric(label, value, hint, tone = "") {
  return `<section class="metric ${tone}"><span>${label}</span><strong>${value}</strong><small>${hint}</small></section>`;
}

function panel(title, subtitle, body, extra = "") {
  return `<section class="panel ${extra}"><header><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ""}</header>${body}</section>`;
}

function pill(status) { return `<span class="status ${statusClass[status]}">${statusLabel[status]}</span>`; }
function orderCard(item) { return `<li class="row-card"><div><strong>${item[1]} <span>${item[2]}</span></strong><p>${item[3]} · ${item[4]}</p></div><div class="right"><b>${money.format(item[6])}</b>${pill(item[5])}</div></li>`; }
function ordersTable(list) { return `<div class="table-wrap"><table><thead><tr><th>OS</th><th>Cliente</th><th>Veículo</th><th>Serviço</th><th>Status</th><th class="right">Valor</th></tr></thead><tbody>${list.map((item) => `<tr><td class="mono">${item[0]}</td><td>${item[1]}</td><td><span class="mono">${item[2]}</span><br>${item[3]}</td><td>${item[4]}</td><td>${pill(item[5])}</td><td class="right">${money.format(item[6])}</td></tr>`).join("")}</tbody></table></div>`; }

function renderMemorial() {
  return `<section class="view"><div class="hero-card"><p class="eyebrow">Memorial do produto</p><h2>LavaPro é um MVP offline-first para transformar a rotina de lava-rápidos em uma operação legível.</h2><p>O produto nasceu para resolver um problema simples e recorrente: serviços entram por conversa, fila ou caderno; o consumo de produtos fica invisível; e o fechamento do dia depende de memória, planilha ou conferência manual. O LavaPro organiza essa operação em um fluxo único: registrar a OS, acompanhar a fila, concluir o serviço, baixar estoque estimado e entender a margem do turno.</p><div class="chips"><span>Sem internet como premissa</span><span>Uma unidade</span><span>Uma equipe</span><span>Validação antes de escala</span></div><div style="height:24px"></div><a class="primary-button" href="#painel">Entrar na aplicação</a></div><div class="metrics-grid">${metric("Hipótese central", "Fila + margem", "O dono precisa enxergar operação e resultado no mesmo lugar", "accent")}${metric("Primeiro usuário", "Operador", "Quem recebe o carro e move a OS", "info")}${metric("Decisão crítica", "Estoque", "Baixa estimada por serviço e porte do veículo", "warn")}${metric("Validação", "1 turno", "Rodar em operação real antes de cloud", "ok")}</div><div class="two-col">${panel("O que esta demo representa", "Uma versão pública e estática para apresentar o conceito", `<p class="note">Esta página no GitHub Pages não grava dados. Ela demonstra narrativa, layout, fluxo e valor do produto. O MVP funcional roda localmente com SQLite e Prisma.</p>`)}${panel("O que será validado no piloto", "Critérios práticos", `<ul class="list"><li class="row-card"><span>O operador cria OS sem atrito?</span><b>Entrada rápida</b></li><li class="row-card"><span>A fila fica mais clara?</span><b>Status visual</b></li><li class="row-card"><span>O estoque ganha previsibilidade?</span><b>SmartStock</b></li><li class="row-card"><span>O fechamento ajuda decisão?</span><b>Margem diária</b></li></ul>`)}</div></section>`;
}

function renderPainel() { return `<section class="view"><div class="hero-card"><p class="eyebrow">Painel do turno</p><h2>Controle operacional para lava-rápidos sem depender de internet.</h2><p>Esta tela sintetiza receita, margem estimada, fila ativa e alertas de estoque. É o primeiro cockpit do MVP local.</p><div class="chips"><span>Offline-first</span><span>SmartStock</span><span>Fila visual</span><span>Margem diária</span></div></div><div class="metrics-grid">${metric("Receita do dia", money.format(revenue), `${completedOrders.length} ordens concluídas`, "accent")}${metric("Margem bruta", money.format(grossMargin), "Receita menos custo estimado", "ok")}${metric("Custo químico", money.format(estimatedCost), "Consumo estimado por serviço", "warn")}${metric("Ticket médio", money.format(averageTicket), "Por ordem concluída")}</div><div class="two-col">${panel("Fila ativa", "Ordens aguardando ou em execução", `<ul class="list">${activeOrders.map(orderCard).join("")}</ul>`)}${panel("Pulso do turno", "Sinais para decisão rápida", `<div class="signal-grid"><span><b>3</b> na fila</span><span><b>2</b> em execução</span><span><b>6</b> concluídas</span><span><b>34</b> movimentos</span></div><p class="note">Diferencial validado: cada serviço pode baixar produtos automaticamente conforme tipo de serviço e tamanho do veículo.</p>`)}</div>${panel("Concluídas hoje", "Receita, status e serviço por OS finalizada", ordersTable(completedOrders))}</section>`; }
function renderFila() { const lanes = ["NA_FILA", "EM_EXECUCAO", "CONCLUIDA", "CANCELADA"]; return `<section class="view"><div class="metrics-grid">${lanes.map((lane) => metric(statusLabel[lane], orders.filter((item) => item[5] === lane).length, lane === "NA_FILA" ? "Aguardando início" : lane === "EM_EXECUCAO" ? "Serviço em andamento" : lane === "CONCLUIDA" ? "Finalizadas no turno" : "Canceladas", statusClass[lane])).join("")}</div><div class="two-col">${lanes.map((lane) => panel(`${statusLabel[lane]} (${orders.filter((item) => item[5] === lane).length})`, "Raia operacional demonstrativa", `<ul class="list">${orders.filter((item) => item[5] === lane).map(orderCard).join("") || "<li class='empty'>Sem ordens nesta raia.</li>"}</ul>`)).join("")}</div></section>`; }
function renderOrdens() { return `<section class="view"><div class="metrics-grid">${metric("Ordens", "12", "Total demonstrativo")}${metric("Ativas", activeOrders.length, "Fila + execução", "accent")}${metric("Concluídas", completedOrders.length, "Turno demo", "ok")}${metric("Canceladas", "1", "Registrada", "bad")}</div>${panel("Ordens de serviço", "Visão consolidada do turno", ordersTable(orders))}</section>`; }
function renderNovaOS() { return `<section class="view"><div class="two-col">${panel("Nova OS", "Prévia sem persistência no GitHub Pages", `<div class="form-preview"><label>Cliente<output>Ana Lima · (11) 98123-4521</output></label><label>Veículo<output>Toyota Corolla · RIO4A33</output></label><label>Serviços<output>Lavagem técnica + Pretinho nos pneus</output></label><label>Observações<output>Revisar capô e rodas antes da entrega.</output></label><button class="primary-button" data-demo-action="create">Simular criação</button></div>`)}${panel("Resumo calculado", "Consumo planejado e margem estimada", `<div class="signal-grid"><span><b>${money.format(165)}</b> valor</span><span><b>${money.format(8.73)}</b> custo</span><span><b>105 min</b> duração</span><span><b>${money.format(156.27)}</b> margem</span></div><p class="note">No MVP local, a OS é persistida em SQLite e a conclusão gera baixa auditável de estoque.</p>`)}</div></section>`; }
function renderClientes() { const unique = [...new Map(orders.map((item) => [item[1], item])).values()]; return `<section class="view"><div class="metrics-grid">${metric("Clientes", "8", "Base demonstrativa", "accent")}${metric("Veículos", "10", "Cadastrados")}${metric("Recorrentes", "2", "Clientes com mais de um veículo", "warn")}${metric("Contato", "WhatsApp", "Canal operacional")}</div>${panel("Clientes e veículos", "Lista resumida para validação visual", `<ul class="list">${unique.map((item) => `<li class="row-card"><div><strong>${item[1]}</strong><p>${item[3]} · <span class="mono">${item[2]}</span></p></div><span>${item[4]}</span></li>`).join("")}</ul>`)}</section>`; }
function renderServicos() { return `<section class="view"><div class="three-col">${services.map((item) => panel(item[0], item[3], `<div class="signal-grid compact"><span><b>${money.format(item[1])}</b> preço</span><span><b>${item[2]}</b> duração</span></div>`)).join("")}</div></section>`; }
function renderEstoque() { return `<section class="view"><div class="metrics-grid">${metric("Produtos", "8", "Catálogo SmartStock")}${metric("Alertas", lowProducts.length, "Abaixo ou no mínimo", lowProducts.length ? "bad" : "ok")}${metric("Movimentos", "34", "Entradas + consumo", "accent")}${metric("Custo consumido", money.format(estimatedCost), "Ordens concluídas", "warn")}</div>${panel("Estoque / SmartStock", "Nível atual calculado a partir de movimentos demonstrativos", `<ul class="list">${products.map((item) => { const ratio = Math.max(6, Math.min(100, (item[1] / item[2]) * 100)); const low = item[1] <= item[2]; return `<li class="row-card"><div><strong>${item[0]} ${low ? "<em class='status bad'>baixo</em>" : ""}</strong><p>Mínimo: ${number.format(item[2])} ${item[3]}</p><span class="bar"><i class="${low ? "low" : ""}" style="width:${ratio}%"></i></span></div><div class="right"><b>${number.format(item[1])} ${item[3]}</b><small>atual</small></div></li>`; }).join("")}</ul>`)}</section>`; }
function renderRelatorio() { return `<section class="view"><div class="metrics-grid">${metric("Receita", money.format(revenue), "6 ordens concluídas", "accent")}${metric("Custo estimado", money.format(estimatedCost), "Produtos consumidos", "warn")}${metric("Margem bruta", money.format(grossMargin), "Indicador de viabilidade", "ok")}${metric("Ticket médio", money.format(averageTicket), "Por ordem concluída")}</div><div class="two-col">${panel("Resumo executivo", "Fechamento do turno", `<ul class="list"><li class="row-card"><span>Serviço mais vendido</span><b>Lavagem completa</b></li><li class="row-card"><span>Produtos críticos</span><b>${lowProducts.length}</b></li><li class="row-card"><span>Movimentos auditáveis</span><b>34</b></li><li class="row-card"><span>Hipótese validada</span><b>Estoque por serviço</b></li></ul>`)}${panel("O que esta demo valida", "Sem backend e sem persistência pública", `<p class="note">A demo valida narrativa, layout, hierarquia de informação e proposta comercial. Para validar criação real de ordens, baixa de estoque e relatórios persistentes, rode o MVP local offline-first.</p>`)}</div></section>`; }

const renderers = { memorial: renderMemorial, painel: renderPainel, fila: renderFila, ordens: renderOrdens, "nova-os": renderNovaOS, clientes: renderClientes, servicos: renderServicos, estoque: renderEstoque, relatorio: renderRelatorio };
function currentView() { const hash = window.location.hash.replace("#", "") || "memorial"; return renderers[hash] ? hash : "memorial"; }
function render() { const view = currentView(); document.title = `LavaPro — ${views[view]}`; document.querySelector("#view-title").textContent = views[view]; document.querySelector("#main").innerHTML = renderers[view](); document.querySelectorAll(".nav a").forEach((link) => link.classList.toggle("active", link.dataset.view === view)); bindDemoActions(); }
function bindDemoActions() { document.querySelectorAll("[data-demo-action]").forEach((button) => { button.addEventListener("click", () => { const action = button.dataset.demoAction; const message = action === "create" ? "Prévia estática: nenhuma OS foi gravada. Rode o MVP local para persistência real." : "Simulação estática: sem backend, sem banco e sem sincronização real."; showToast(message); }); }); }
function showToast(message) { const old = document.querySelector(".toast"); if (old) old.remove(); const toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); toast.textContent = message; document.body.appendChild(toast); requestAnimationFrame(() => toast.classList.add("show")); setTimeout(() => toast.classList.remove("show"), 3200); setTimeout(() => toast.remove(), 3800); }
window.addEventListener("hashchange", render); render();
window.LavaProStaticDemo = { negocio: "LavaPro Centro", contadores: { negocios: 1, clientes: 8, veiculos: 10, servicos: 6, produtos: 8, ordens: 12, movimentos: 34 } };
