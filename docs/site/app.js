const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const número = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

const negócio = {
  nome: "LavaPro Centro",
  slug: "lavapro-centro",
};

const clientes = [
  { id: "c1", nome: "Ana Lima", telefone: "(11) 98123-4521", email: "ana.lima@example.com" },
  { id: "c2", nome: "Bruno Santos", telefone: "(11) 99812-3344", email: "" },
  { id: "c3", nome: "Carla Rocha", telefone: "(11) 97777-1029", email: "carla.rocha@example.com" },
  { id: "c4", nome: "Diego Pereira", telefone: "(11) 96654-0098", email: "" },
  { id: "c5", nome: "Elaine Costa", telefone: "(11) 95512-8877", email: "elaine.costa@example.com" },
  { id: "c6", nome: "Felipe Marques", telefone: "(11) 94421-7766", email: "" },
  { id: "c7", nome: "Gabriela Souza", telefone: "(11) 93355-2244", email: "gabriela.souza@example.com" },
  { id: "c8", nome: "Henrique Oliveira", telefone: "(11) 92211-0011", email: "" },
];

const veículos = [
  { id: "v1", clienteId: "c1", placa: "BRA2E19", marca: "Hyundai", modelo: "HB20", cor: "Prata", porte: "SMALL" },
  { id: "v2", clienteId: "c1", placa: "RIO4A33", marca: "Toyota", modelo: "Corolla", cor: "Preto", porte: "MEDIUM" },
  { id: "v3", clienteId: "c2", placa: "SAO1C44", marca: "Honda", modelo: "Civic", cor: "Branco", porte: "MEDIUM" },
  { id: "v4", clienteId: "c3", placa: "DFG7H12", marca: "Jeep", modelo: "Compass", cor: "Cinza", porte: "LARGE" },
  { id: "v5", clienteId: "c3", placa: "MNO3P88", marca: "Volkswagen", modelo: "Nivus", cor: "Vermelho", porte: "SMALL" },
  { id: "v6", clienteId: "c4", placa: "XYZ9K02", marca: "Fiat", modelo: "Pulse", cor: "Branco", porte: "SMALL" },
  { id: "v7", clienteId: "c5", placa: "QWE5R67", marca: "Chevrolet", modelo: "Tracker", cor: "Prata", porte: "MEDIUM" },
  { id: "v8", clienteId: "c6", placa: "PJK2L54", marca: "Mitsubishi", modelo: "Pajero Sport", cor: "Preto", porte: "EXTRA_LARGE" },
  { id: "v9", clienteId: "c7", placa: "BCD8F31", marca: "Renault", modelo: "Kwid", cor: "Branco", porte: "SMALL" },
  { id: "v10", clienteId: "c8", placa: "TUV6G90", marca: "BYD", modelo: "Dolphin", cor: "Azul", porte: "SMALL" },
];

const produtos = [
  { id: "p1", nome: "Shampoo automotivo", unidade: "ml", estoqueInicial: 5000, estoqueMínimo: 1500, custoUnitário: 0.012 },
  { id: "p2", nome: "Cera de proteção", unidade: "ml", estoqueInicial: 1800, estoqueMínimo: 800, custoUnitário: 0.045 },
  { id: "p3", nome: "Desengraxante", unidade: "ml", estoqueInicial: 900, estoqueMínimo: 1200, custoUnitário: 0.022 },
  { id: "p4", nome: "Pneu pretinho", unidade: "ml", estoqueInicial: 700, estoqueMínimo: 400, custoUnitário: 0.038 },
  { id: "p5", nome: "Microfibra", unidade: "un", estoqueInicial: 60, estoqueMínimo: 24, custoUnitário: 6.5 },
  { id: "p6", nome: "Desinfetante de painel", unidade: "ml", estoqueInicial: 1400, estoqueMínimo: 600, custoUnitário: 0.018 },
  { id: "p7", nome: "Sabão de roda", unidade: "ml", estoqueInicial: 2200, estoqueMínimo: 800, custoUnitário: 0.015 },
  { id: "p8", nome: "Pretinho líquido", unidade: "ml", estoqueInicial: 350, estoqueMínimo: 400, custoUnitário: 0.05 },
];

const serviços = [
  {
    id: "s1",
    nome: "Lavagem simples",
    descrição: "Lavagem externa com shampoo e secagem.",
    preçoBase: 45,
    duraçãoMin: 30,
    usos: [
      uso("p1", 60, 0.85, 1, 1.25, 1.6),
      uso("p5", 0.2, 0.9, 1, 1.1, 1.2),
    ],
  },
  {
    id: "s2",
    nome: "Lavagem completa",
    descrição: "Lavagem externa, interna, secagem e pretinho.",
    preçoBase: 85,
    duraçãoMin: 60,
    usos: [
      uso("p1", 80, 0.85, 1, 1.25, 1.6),
      uso("p3", 25, 0.9, 1, 1.3, 1.6),
      uso("p4", 30, 0.85, 1, 1.2, 1.4),
      uso("p5", 0.5, 0.9, 1, 1.1, 1.2),
      uso("p6", 25, 0.9, 1, 1.1, 1.3),
    ],
  },
  {
    id: "s3",
    nome: "Lavagem técnica",
    descrição: "Lavagem detalhada com cera de proteção e secagem precisa.",
    preçoBase: 140,
    duraçãoMin: 90,
    usos: [
      uso("p1", 90, 0.85, 1, 1.25, 1.6),
      uso("p2", 50, 0.85, 1, 1.2, 1.5),
      uso("p5", 0.8, 0.9, 1, 1.1, 1.2),
      uso("p7", 40, 0.9, 1, 1.2, 1.5),
    ],
  },
  {
    id: "s4",
    nome: "Polimento cristalizado",
    descrição: "Polimento de pintura com proteção estimada por 6 meses.",
    preçoBase: 380,
    duraçãoMin: 180,
    usos: [
      uso("p2", 90, 0.85, 1, 1.2, 1.5),
      uso("p3", 40, 0.9, 1, 1.3, 1.6),
      uso("p5", 1.5, 0.9, 1, 1.1, 1.2),
    ],
  },
  {
    id: "s5",
    nome: "Higienização interna",
    descrição: "Aspiração, painéis, vidros internos e aromatização.",
    preçoBase: 95,
    duraçãoMin: 75,
    usos: [
      uso("p6", 40, 0.9, 1, 1.1, 1.3),
      uso("p3", 20, 0.9, 1, 1.2, 1.4),
      uso("p5", 0.6, 0.9, 1, 1.1, 1.2),
    ],
  },
  {
    id: "s6",
    nome: "Pretinho nos pneus",
    descrição: "Aplicação de pretinho líquido com acabamento uniforme.",
    preçoBase: 25,
    duraçãoMin: 15,
    usos: [
      uso("p4", 25, 0.85, 1, 1.2, 1.4),
      uso("p5", 0.2, 0.9, 1, 1.1, 1.2),
    ],
  },
];

const ordens = [
  ordem("OS-1001", "c1", "v1", ["s1"], "COMPLETED", "08:30", "08:40", "09:05"),
  ordem("OS-1002", "c2", "v3", ["s2"], "COMPLETED", "09:15", "09:25", "10:25"),
  ordem("OS-1003", "c3", "v4", ["s3", "s5"], "COMPLETED", "10:00", "10:30", "12:30"),
  ordem("OS-1004", "c4", "v5", ["s1", "s6"], "COMPLETED", "11:10", "11:30", "12:05"),
  ordem("OS-1005", "c5", "v6", ["s2"], "COMPLETED", "12:40", "13:00", "14:00"),
  ordem("OS-1006", "c6", "v7", ["s4"], "COMPLETED", "13:30", "14:00", "16:30"),
  ordem("OS-1007", "c7", "v8", ["s2"], "IN_PROGRESS", "14:50", "15:05"),
  ordem("OS-1008", "c8", "v9", ["s1"], "IN_PROGRESS", "15:20", "15:35"),
  ordem("OS-1009", "c1", "v2", ["s3"], "QUEUED", "16:00"),
  ordem("OS-1010", "c2", "v10", ["s5"], "QUEUED", "16:15"),
  ordem("OS-1011", "c3", "v3", ["s1"], "CANCELLED", "07:30", null, null, "07:50", "Cliente desistiu: fila muito longa."),
  ordem("OS-1012", "c4", "v4", ["s4"], "QUEUED", "17:00", null, null, null, "Cuidado extra com capô e pintura frontal."),
];

const metadadosTela = {
  painel: "Painel",
  fila: "Fila",
  ordens: "Ordens de serviço",
  "nova-os": "Nova OS",
  clientes: "Clientes",
  serviços: "Serviços",
  estoque: "Estoque / SmartStock",
  relatório: "Relatório diário",
};

const rótuloStatus = {
  QUEUED: "Na fila",
  IN_PROGRESS: "Em execução",
  COMPLETED: "Concluída",
  CANCELLED: "Cancelada",
};

const classeStatus = {
  QUEUED: "queued",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const rótuloPorte = {
  SMALL: "Pequeno",
  MEDIUM: "Médio",
  LARGE: "Grande",
  EXTRA_LARGE: "Extra grande",
};

function uso(produtoId, base, fatorPequeno, fatorMédio, fatorGrande, fatorExtraGrande) {
  return { produtoId, base, fatorPequeno, fatorMédio, fatorGrande, fatorExtraGrande };
}

function ordem(id, clienteId, veículoId, serviçoIds, status, entrouÀs, iniciouÀs, concluiuÀs, cancelouÀs, observações = "") {
  return { id, clienteId, veículoId, serviçoIds, status, entrouÀs, iniciouÀs, concluiuÀs, cancelouÀs, observações };
}

function fatorPorPorte(porte, item) {
  if (porte === "SMALL") return item.fatorPequeno;
  if (porte === "LARGE") return item.fatorGrande;
  if (porte === "EXTRA_LARGE") return item.fatorExtraGrande;
  return item.fatorMédio;
}

function produtoPorId(id) {
  return produtos.find((produto) => produto.id === id);
}

function serviçoPorId(id) {
  return serviços.find((serviço) => serviço.id === id);
}

function clientePorId(id) {
  return clientes.find((cliente) => cliente.id === id);
}

function veículoPorId(id) {
  return veículos.find((veículo) => veículo.id === id);
}

function totalDaOrdem(item) {
  return item.serviçoIds.reduce((soma, id) => soma + serviçoPorId(id).preçoBase, 0);
}

function duraçãoDaOrdem(item) {
  return item.serviçoIds.reduce((soma, id) => soma + serviçoPorId(id).duraçãoMin, 0);
}

function usoPlanejadoDaOrdem(item) {
  const veículo = veículoPorId(item.veículoId);
  return item.serviçoIds.flatMap((serviçoId) => {
    const serviço = serviçoPorId(serviçoId);
    return serviço.usos.map((usoItem) => ({
      serviçoId,
      produtoId: usoItem.produtoId,
      quantidade: arredondar2(usoItem.base * fatorPorPorte(veículo.porte, usoItem)),
    }));
  });
}

function custoDaOrdem(item) {
  return arredondar2(
    usoPlanejadoDaOrdem(item).reduce((soma, usoItem) => {
      const produto = produtoPorId(usoItem.produtoId);
      return soma + usoItem.quantidade * produto.custoUnitário;
    }, 0),
  );
}

function arredondar2(valor) {
  return Math.round(valor * 100) / 100;
}

function montarMovimentos() {
  const lista = produtos.map((produto, índice) => ({
    id: `ME-${String(índice + 1).padStart(3, "0")}`,
    hora: "07:00",
    produtoId: produto.id,
    variação: produto.estoqueInicial,
    motivo: "INITIAL",
    referência: "",
    nota: "Estoque inicial da operação",
  }));

  let índiceMovimento = lista.length + 1;
  ordens
    .filter((item) => item.status === "COMPLETED")
    .forEach((item) => {
      usoPlanejadoDaOrdem(item).forEach((planejado) => {
        lista.push({
          id: `ME-${String(índiceMovimento).padStart(3, "0")}`,
          hora: item.concluiuÀs,
          produtoId: planejado.produtoId,
          variação: -planejado.quantidade,
          motivo: "USAGE",
          referência: item.id,
          nota: `Consumo automático: ${item.id}`,
        });
        índiceMovimento += 1;
      });
    });

  return lista;
}

const movimentos = montarMovimentos();

const estoquePorProduto = produtos.reduce((acumulado, produto) => {
  acumulado[produto.id] = arredondar2(
    movimentos
      .filter((movimento) => movimento.produtoId === produto.id)
      .reduce((soma, movimento) => soma + movimento.variação, 0),
  );
  return acumulado;
}, {});

const ordensConcluídas = ordens.filter((item) => item.status === "COMPLETED");
const ordensAtivas = ordens.filter((item) => ["QUEUED", "IN_PROGRESS"].includes(item.status));
const produtosEmAlerta = produtos.filter((produto) => estoquePorProduto[produto.id] <= produto.estoqueMínimo);

const relatório = {
  receita: ordensConcluídas.reduce((soma, item) => soma + totalDaOrdem(item), 0),
  custo: arredondar2(ordensConcluídas.reduce((soma, item) => soma + custoDaOrdem(item), 0)),
  ordensConcluídas: ordensConcluídas.length,
  serviçosExecutados: ordensConcluídas.reduce((soma, item) => soma + item.serviçoIds.length, 0),
};
relatório.margem = arredondar2(relatório.receita - relatório.custo);
relatório.margemPct = relatório.receita > 0 ? relatório.margem / relatório.receita : 0;
relatório.ticketMédio = relatório.ordensConcluídas > 0 ? relatório.receita / relatório.ordensConcluídas : 0;

function mixDeServiços() {
  const mapa = new Map();
  ordensConcluídas.forEach((item) => {
    item.serviçoIds.forEach((serviçoId) => {
      const serviço = serviçoPorId(serviçoId);
      const atual = mapa.get(serviçoId) || { nome: serviço.nome, quantidade: 0, receita: 0 };
      atual.quantidade += 1;
      atual.receita += serviço.preçoBase;
      mapa.set(serviçoId, atual);
    });
  });
  return [...mapa.values()].sort((a, b) => b.quantidade - a.quantidade || b.receita - a.receita);
}

function pílulaStatus(status) {
  return `<span class="status ${classeStatus[status]}">${rótuloStatus[status]}</span>`;
}

function métrica(rótulo, valor, apoio, tom = "") {
  return `
    <section class="card-shell metric-card">
      <div class="card">
        <p class="metric-label">${rótulo}</p>
        <p class="metric-value ${tom}">${valor}</p>
        <p class="metric-hint">${apoio}</p>
      </div>
    </section>
  `;
}

function cartão(título, subtítulo, corpo, extra = "") {
  return `
    <section class="card-shell ${extra}">
      <div class="card">
        <div class="card-header">
          <div>
            <h2>${título}</h2>
            ${subtítulo ? `<p class="card-subtitle">${subtítulo}</p>` : ""}
          </div>
        </div>
        ${corpo}
      </div>
    </section>
  `;
}

function renderPainel() {
  const campeão = mixDeServiços()[0];
  return `
    <section class="view">
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">Validação pública</p>
          <h2>Um cockpit operacional para provar o LavaPro sem rodar o MVP completo na nuvem.</h2>
          <p>
            Esta página demonstra a experiência principal do LavaPro com dados sintéticos:
            fila, ordens de serviço, catálogo, estoque inteligente e fechamento diário.
            Ela valida apresentação, navegação, hierarquia visual e narrativa de produto.
          </p>
          <div class="button-row">
            <a class="primary-button" href="#fila">Ver fila</a>
            <a class="ghost-button" href="#estoque">Abrir SmartStock</a>
          </div>
        </div>
        <div class="hero-console" aria-label="Prévia operacional">
          <div class="console-topline">
            <span class="status in-progress">Turno ativo</span>
            <span class="fine">LavaPro Centro</span>
          </div>
          <div class="console-metrics">
            <div><span>Receita</span><strong>${moeda.format(relatório.receita)}</strong></div>
            <div><span>Margem</span><strong>${percentual(relatório.margemPct)}</strong></div>
            <div><span>Fila</span><strong>${contarStatus("QUEUED")}</strong></div>
          </div>
          <ul class="console-list">
            ${ordensAtivas.slice(0, 3).map(linhaConsole).join("")}
          </ul>
        </div>
      </section>

      <section class="validation-strip" aria-label="Escopo validado pela demo">
        <div>
          <p class="eyebrow">O que esta demo valida</p>
          <p>Fluxo visual, leitura de status, navegação entre telas e coerência dos dados demonstrativos.</p>
        </div>
        <div class="warning-chip">Nenhum dado é persistido no GitHub Pages.</div>
      </section>

      <div class="seed-grid">
        ${contadorSeed("1", "negócio")}
        ${contadorSeed("8", "clientes")}
        ${contadorSeed("10", "veículos")}
        ${contadorSeed("6", "serviços")}
        ${contadorSeed("8", "produtos")}
        ${contadorSeed("12", "ordens")}
        ${contadorSeed("34", "movimentos de estoque")}
      </div>

      <div class="four-col">
        ${métrica("Receita do dia", moeda.format(relatório.receita), `${relatório.ordensConcluídas} ordens concluídas`, "accent")}
        ${métrica("Margem bruta", moeda.format(relatório.margem), `${percentual(relatório.margemPct)} de margem`, "ok")}
        ${métrica("Custo químico", moeda.format(relatório.custo), "Consumo efetivo simulado", "warn")}
        ${métrica("Ticket médio", moeda.format(relatório.ticketMédio), `${relatório.serviçosExecutados} serviços executados`)}
      </div>

      <div class="hero-grid">
        ${cartão(
          "Fila ativa",
          "Ordens prontas para iniciar ou em execução",
          `<ul class="lane-list">${ordensAtivas.map(linhaOrdem).join("")}</ul>`,
        )}
        ${cartão(
          "Pulso operacional",
          "Status do turno demonstrativo",
          `<div class="kpi-strip">
            <span class="tag warn">${contarStatus("QUEUED")} na fila</span>
            <span class="tag accent">${contarStatus("IN_PROGRESS")} em execução</span>
            <span class="tag ok">${contarStatus("COMPLETED")} concluídas</span>
            <span class="tag">${movimentos.length} movimentos</span>
          </div>
          <div class="spacer"></div>
          <p class="row-title">Serviço mais vendido</p>
          <p class="row-meta">${campeão.quantidade}x ${campeão.nome} — ${moeda.format(campeão.receita)} em receita.</p>
          <div class="spacer"></div>
          <p class="row-title">Estoque em alerta</p>
          <p class="row-meta">${produtosEmAlerta.length} produtos abaixo ou no mínimo operacional.</p>`,
        )}
      </div>

      ${cartão(
        "Concluídas hoje",
        "Receita, custo e margem estimada por OS finalizada",
        `<div class="table-wrap">${tabelaOrdens(ordensConcluídas)}</div>`,
      )}
    </section>
  `;
}

function contadorSeed(valor, rótulo) {
  return `
    <div class="seed-item">
      <strong>${valor}</strong>
      <span>${rótulo}</span>
    </div>
  `;
}

function linhaConsole(item) {
  const cliente = clientePorId(item.clienteId);
  const veículo = veículoPorId(item.veículoId);
  return `
    <li>
      <span>${cliente.nome}</span>
      <strong>${veículo.placa}</strong>
    </li>
  `;
}

function linhaOrdem(item) {
  const cliente = clientePorId(item.clienteId);
  const veículo = veículoPorId(item.veículoId);
  const textoServiços = item.serviçoIds.map((id) => serviçoPorId(id).nome).join(" + ");
  return `
    <li class="row-card">
      <div>
        <p class="row-title">${cliente.nome} <span class="mono fine">${veículo.placa}</span></p>
        <p class="row-meta">${veículo.marca} ${veículo.modelo} — ${textoServiços}</p>
      </div>
      <div class="right">
        <p class="row-title">${moeda.format(totalDaOrdem(item))}</p>
        ${pílulaStatus(item.status)}
      </div>
    </li>
  `;
}

function contarStatus(status) {
  return ordens.filter((item) => item.status === status).length;
}

function renderFila() {
  const raias = ["QUEUED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  return `
    <section class="view">
      <div class="four-col">
        ${raias.map((status) => métrica(rótuloStatus[status], contarStatus(status), apoioDaRaia(status), tomDoStatus(status))).join("")}
      </div>
      <div class="two-col">
        ${raias.map((status) => {
          const ordensDaRaia = ordens.filter((item) => item.status === status);
          return cartão(
            `${rótuloStatus[status]} (${ordensDaRaia.length})`,
            apoioDaRaia(status),
            ordensDaRaia.length
              ? `<ul class="lane-list">${ordensDaRaia.map(linhaOrdem).join("")}</ul>`
              : `<div class="empty-state"><h3>Sem ordens</h3><p>Nada nesta raia no momento.</p></div>`,
          );
        }).join("")}
      </div>
    </section>
  `;
}

function apoioDaRaia(status) {
  return {
    QUEUED: "Aguardando início",
    IN_PROGRESS: "Atendimento em andamento",
    COMPLETED: "Finalizadas no turno",
    CANCELLED: "Canceladas no turno",
  }[status];
}

function tomDoStatus(status) {
  return {
    QUEUED: "warn",
    IN_PROGRESS: "info",
    COMPLETED: "ok",
    CANCELLED: "bad",
  }[status];
}

function renderOrdens() {
  return `
    <section class="view">
      <div class="four-col">
        ${métrica("Ordens", ordens.length, "histórico demonstrativo")}
        ${métrica("Ativas", ordensAtivas.length, "fila + execução", "accent")}
        ${métrica("Concluídas", ordensConcluídas.length, "turno demonstrativo", "ok")}
        ${métrica("Canceladas", contarStatus("CANCELLED"), "registradas", "bad")}
      </div>
      ${cartão("Ordens de serviço", "Histórico completo com dados sintéticos", `<div class="table-wrap">${tabelaOrdens(ordens)}</div>`)}
    </section>
  `;
}

function tabelaOrdens(lista) {
  return `
    <table>
      <thead>
        <tr>
          <th>OS</th>
          <th>Cliente</th>
          <th>Veículo</th>
          <th>Status</th>
          <th class="right">Valor</th>
          <th>Horário</th>
        </tr>
      </thead>
      <tbody>
        ${lista.map((item) => {
          const cliente = clientePorId(item.clienteId);
          const veículo = veículoPorId(item.veículoId);
          return `
            <tr>
              <td class="mono">${item.id}</td>
              <td>${cliente.nome}<br><span class="fine">${cliente.telefone}</span></td>
              <td>${veículo.marca} ${veículo.modelo}<br><span class="mono fine">${veículo.placa}</span></td>
              <td>${pílulaStatus(item.status)}</td>
              <td class="right">${moeda.format(totalDaOrdem(item))}</td>
              <td>${linhaDoTempo(item)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function linhaDoTempo(item) {
  if (item.concluiuÀs) return `${item.entrouÀs} → ${item.concluiuÀs}`;
  if (item.cancelouÀs) return `${item.entrouÀs} → ${item.cancelouÀs}`;
  if (item.iniciouÀs) return `${item.entrouÀs} → em execução`;
  return `${item.entrouÀs} → aguardando`;
}

function renderNovaOS() {
  const prévia = {
    cliente: clientes[0],
    veículo: veículos[1],
    serviçoIds: ["s3", "s6"],
    observações: "Prévia estática: cliente quer revisar capô e rodas.",
  };
  const item = ordem("Prévia", prévia.cliente.id, prévia.veículo.id, prévia.serviçoIds, "QUEUED", "Agora");
  const planejado = usoPlanejadoDaOrdem(item);
  return `
    <section class="view">
      <div class="hero-grid">
        ${cartão(
          "Nova OS",
          "Formulário demonstrativo sem persistência. No MVP local, a criação real usa server actions e SQLite.",
          `<div class="preview-form">
            <div class="field-grid">
              ${campoEstático("Cliente", `${prévia.cliente.nome} — ${prévia.cliente.telefone}`)}
              ${campoEstático("Veículo", `${prévia.veículo.marca} ${prévia.veículo.modelo} — ${prévia.veículo.placa}`)}
              ${campoEstático("Serviços", prévia.serviçoIds.map((id) => serviçoPorId(id).nome).join(" + "))}
              ${campoEstático("Observações", prévia.observações)}
            </div>
            <div class="button-row">
              <button type="button" class="primary-button" data-demo-action="create">Simular criação</button>
              <a class="ghost-button" href="#ordens">Ver ordens</a>
            </div>
          </div>`,
        )}
        ${cartão(
          "Resumo calculado",
          "Consumo planejado e margem estimada",
          `<div class="kpi-strip">
            <span class="tag accent">${moeda.format(totalDaOrdem(item))}</span>
            <span class="tag warn">${moeda.format(custoDaOrdem(item))} custo</span>
            <span class="tag">${duraçãoDaOrdem(item)} min</span>
          </div>
          <div class="spacer"></div>
          <ul class="product-list">
            ${planejado.map((linha) => {
              const produto = produtoPorId(linha.produtoId);
              return `<li class="row-card"><span>${produto.nome}</span><span class="mono">${número.format(linha.quantidade)} ${produto.unidade}</span></li>`;
            }).join("")}
          </ul>`,
        )}
      </div>
    </section>
  `;
}

function campoEstático(rótulo, valor) {
  return `<label class="field"><span>${rótulo}</span><output>${valor}</output></label>`;
}

function renderClientes() {
  return `
    <section class="view">
      <div class="four-col">
        ${métrica("Clientes", clientes.length, "dados demonstrativos", "accent")}
        ${métrica("Veículos", veículos.length, "cadastrados")}
        ${métrica("Com e-mail", clientes.filter((item) => item.email).length, "contatos completos", "ok")}
        ${métrica("Recorrentes", 2, "clientes com 2 veículos", "warn")}
      </div>
      ${cartão(
        "Clientes",
        "Lista estática baseada no arquivo de seed do projeto",
        `<ul class="customer-list">${clientes.map((cliente) => {
          const veículosDoCliente = veículos.filter((veículo) => veículo.clienteId === cliente.id);
          return `
            <li class="row-card">
              <div>
                <p class="row-title">${cliente.nome}</p>
                <p class="row-meta">${cliente.telefone}${cliente.email ? ` — ${cliente.email}` : ""}</p>
              </div>
              <div class="right">
                <p class="row-title">${veículosDoCliente.length} veículo${veículosDoCliente.length === 1 ? "" : "s"}</p>
                <p class="row-meta">${veículosDoCliente.map((veículo) => veículo.placa).join(", ")}</p>
              </div>
            </li>
          `;
        }).join("")}</ul>`,
      )}
    </section>
  `;
}

function renderCatálogo() {
  return `
    <section class="view">
      <div class="three-col">
        ${serviços.map((serviço) => cartão(
          serviço.nome,
          serviço.descrição,
          `<div class="kpi-strip">
            <span class="tag accent">${moeda.format(serviço.preçoBase)}</span>
            <span class="tag">${serviço.duraçãoMin} min</span>
            <span class="tag warn">${serviço.usos.length} insumos</span>
          </div>
          <div class="spacer"></div>
          <ul class="product-list">
            ${serviço.usos.map((item) => {
              const produto = produtoPorId(item.produtoId);
              return `<li class="row-card"><span>${produto.nome}</span><span class="mono">${número.format(item.base)} ${produto.unidade}</span></li>`;
            }).join("")}
          </ul>`,
        )).join("")}
      </div>
    </section>
  `;
}

function renderEstoque() {
  return `
    <section class="view">
      <div class="four-col">
        ${métrica("Produtos", produtos.length, "catálogo SmartStock")}
        ${métrica("Alertas", produtosEmAlerta.length, "estoque baixo", produtosEmAlerta.length ? "bad" : "ok")}
        ${métrica("Movimentos", movimentos.length, "8 iniciais + 26 consumos", "accent")}
        ${métrica("Custo consumido", moeda.format(relatório.custo), "ordens concluídas", "warn")}
      </div>
      ${cartão(
        "Estoque / SmartStock",
        "Estoque atual calculado a partir dos movimentos demonstrativos",
        `<ul class="product-list">${produtos.map(linhaProduto).join("")}</ul>`,
      )}
      ${cartão(
        "Movimentações de estoque",
        "Histórico estático com 34 movimentos",
        `<div class="table-wrap">${tabelaMovimentos()}</div>`,
      )}
    </section>
  `;
}

function linhaProduto(produto) {
  const estoque = estoquePorProduto[produto.id];
  const proporção = Math.min(100, Math.max(4, (estoque / produto.estoqueMínimo) * 100));
  const baixo = estoque <= produto.estoqueMínimo;
  return `
    <li class="row-card">
      <div>
        <p class="row-title">${produto.nome} ${baixo ? '<span class="status low">baixo</span>' : ""}</p>
        <p class="row-meta">mínimo ${número.format(produto.estoqueMínimo)} ${produto.unidade} — custo ${moeda.format(produto.custoUnitário)} / ${produto.unidade}</p>
        <div class="progress" aria-label="Nível de estoque"><span class="${baixo ? "low" : ""}" style="width:${proporção}%"></span></div>
      </div>
      <div class="right">
        <p class="row-title">${número.format(estoque)} ${produto.unidade}</p>
        <p class="row-meta">atual</p>
      </div>
    </li>
  `;
}

function rótuloMotivo(motivo) {
  return {
    INITIAL: "Inicial",
    USAGE: "Consumo",
  }[motivo] || "Ajuste";
}

function tabelaMovimentos() {
  return `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Horário</th>
          <th>Produto</th>
          <th>Motivo</th>
          <th class="right">Variação</th>
          <th>Referência</th>
        </tr>
      </thead>
      <tbody>
        ${movimentos.slice().reverse().map((movimento) => {
          const produto = produtoPorId(movimento.produtoId);
          return `
            <tr>
              <td class="mono">${movimento.id}</td>
              <td class="mono">${movimento.hora}</td>
              <td>${produto.nome}</td>
              <td><span class="tag ${movimento.motivo === "INITIAL" ? "accent" : "warn"}">${rótuloMotivo(movimento.motivo)}</span></td>
              <td class="right mono">${movimento.variação > 0 ? "+" : ""}${número.format(movimento.variação)} ${produto.unidade}</td>
              <td>${movimento.referência || "Estoque inicial"}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
}

function renderRelatório() {
  return `
    <section class="view">
      <div class="four-col">
        ${métrica("Receita", moeda.format(relatório.receita), `${relatório.ordensConcluídas} ordens concluídas`, "accent")}
        ${métrica("Custo estimado", moeda.format(relatório.custo), "consumo de produtos", "warn")}
        ${métrica("Margem bruta", moeda.format(relatório.margem), percentual(relatório.margemPct), "ok")}
        ${métrica("Ticket médio", moeda.format(relatório.ticketMédio), "por ordem concluída")}
      </div>
      <div class="hero-grid">
        ${cartão(
          "Mix de serviços",
          "Serviços executados no turno demonstrativo",
          `<div class="table-wrap compact-table">
            <table>
              <thead><tr><th>Serviço</th><th class="right">Qtd</th><th class="right">Receita</th></tr></thead>
              <tbody>
                ${mixDeServiços().map((item, índice) => `
                  <tr>
                    <td>${item.nome} ${índice === 0 ? '<span class="tag accent">mais vendido</span>' : ""}</td>
                    <td class="right">${item.quantidade}</td>
                    <td class="right">${moeda.format(item.receita)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>`,
        )}
        ${cartão(
          "Resumo executivo",
          "Sinais para fechamento diário",
          `<ul class="product-list">
            <li class="row-card"><span>Velocidade</span><span>${relatório.ordensConcluídas} ordens fechadas</span></li>
            <li class="row-card"><span>Margem</span><span>${percentual(relatório.margemPct)}</span></li>
            <li class="row-card"><span>Estoque</span><span>${produtosEmAlerta.length} alertas</span></li>
            <li class="row-card"><span>Movimentos</span><span>${movimentos.length} registros</span></li>
          </ul>`,
        )}
      </div>
    </section>
  `;
}

function percentual(valor) {
  return `${Math.round(valor * 100)}%`;
}

const renderizadores = {
  painel: renderPainel,
  fila: renderFila,
  ordens: renderOrdens,
  "nova-os": renderNovaOS,
  clientes: renderClientes,
  serviços: renderCatálogo,
  estoque: renderEstoque,
  relatório: renderRelatório,
};

function telaAtual() {
  const hash = decodeURIComponent(window.location.hash.replace("#", "")) || "painel";
  return renderizadores[hash] ? hash : "painel";
}

function renderizar() {
  const tela = telaAtual();
  document.title = `LavaPro — ${metadadosTela[tela]}`;
  document.querySelector("#view-title").textContent = metadadosTela[tela];
  document.querySelector("#main").innerHTML = renderizadores[tela]();
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("active", link.dataset.view === tela);
  });
  conectarAçõesDemonstrativas();
}

function conectarAçõesDemonstrativas() {
  document.querySelectorAll("[data-demo-action]").forEach((botão) => {
    botão.addEventListener("click", () => {
      const ação = botão.dataset.demoAction;
      const mensagem =
        ação === "create"
          ? "Prévia estática: nenhuma OS foi gravada. Rode o MVP local para persistência real."
          : "Demo estática validada localmente: sem backend, sem banco e sem runtime Next.";
      exibirAviso(mensagem);
    });
  });
}

function exibirAviso(mensagem) {
  const existente = document.querySelector(".toast");
  if (existente) existente.remove();
  const aviso = document.createElement("div");
  aviso.className = "toast";
  aviso.setAttribute("role", "status");
  aviso.textContent = mensagem;
  document.body.appendChild(aviso);
  requestAnimationFrame(() => aviso.classList.add("show"));
  setTimeout(() => aviso.classList.remove("show"), 3200);
  setTimeout(() => aviso.remove(), 3800);
}

window.LavaProDemo = {
  negócio,
  contagens: {
    negócios: 1,
    clientes: clientes.length,
    veículos: veículos.length,
    serviços: serviços.length,
    produtos: produtos.length,
    ordens: ordens.length,
    movimentosDeEstoque: movimentos.length,
  },
};

window.addEventListener("hashchange", renderizar);
renderizar();
