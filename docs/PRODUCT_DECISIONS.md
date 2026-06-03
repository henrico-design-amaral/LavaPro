# PRODUCT_DECISIONS — LavaPro

Registro vivo de decisões de produto. Cada entrada é atômica e datada. Toda decisão significativa (arquitetural, de escopo ou de design) entra aqui antes de virar código.

---

## 2026-06-03 · Decisão 001 — Pivot para offline-first

**Contexto**
A versão cloud-first anterior tentou nascer como SaaS multi-tenant com Railway, Postgres, Prisma 7, multiSchema, adapter-pg, billing, reseller, RBAC e feature flags. Isso era prematuro para um produto que ainda não tem um único operador usando.

**Decisão**
Reconstruir o LavaPro como MVP offline-first com Next.js + TypeScript + SQLite + Prisma 5 estável + Tailwind. Sem cloud, sem auth, sem multi-tenant, sem billing, sem reseller, sem RBAC, sem feature flags.

**Consequência**
- A versão anterior é tratada como experimento técnico arquivado, não como base do MVP.
- O banco é um arquivo SQLite local.
- Não há dependência de runtime em nada além de Node + npm.
- A validação com lava-rápidos reais vem antes de qualquer migração para cloud.

**Reverter quando**
A validação operacional estiver verde (ver `docs/VALIDATION_PLAN.md`) e existir demanda real por mais de um operador remoto ou mais de um negócio.

---

## 2026-06-03 · Decisão 002 — Stack mínima

**Contexto**
Múltiplas opções de UI (Shadcn, Radix, MUI, etc) e de ORM (Prisma 7, Drizzle) foram consideradas. O MVP precisa de algo que o operador instale, use e mantenha sem treinamento técnico.

**Decisão**
- Next.js 14 (App Router) com TypeScript estrito.
- Prisma 5.22 (estável) com SQLite.
- Tailwind 3 sem plugin de UI.
- Sem Shadcn, Radix, MUI, Framer Motion ou similar no MVP.
- Sem Prisma 7 experimental. Sem `multiSchema`. Sem `adapter-pg`.

**Consequência**
- Build pequeno (~90 kB First Load JS por rota).
- Zero dependência de runtime em serviços externos.
- Componentes próprios, simples, auditáveis.
- Trade-off: menos componentes prontos; mais código para escrever e manter.

**Reverter quando**
A complexidade da UI começar a cobrar um kit de componentes reutilizáveis (ex.: combobox acessível, datepicker). Aí,引进 Shadcn como base opcional, sem acoplá-lo a runtime cloud.

---

## 2026-06-03 · Decisão 003 — Enums viraram strings + unions TypeScript

**Contexto**
SQLite não suporta enums nativos no Prisma 5. A versão cloud-first usava Postgres, que suporta. Para manter a pegada offline, o schema precisa funcionar com SQLite.

**Decisão**
Campos como `Vehicle.size`, `ServiceOrder.status` e `StockMovement.reason` são `String` no schema, com uniões TypeScript (`VehicleSize`, `OrderStatus`, `StockReason`) em `src/lib/types.ts`. Validação na fronteira da aplicação.

**Consequência**
- Schema portável para qualquer banco relacional.
- Sem código gerado, sem bundle extra.
- Validação no servidor (e não no banco). Toda escrita passa por um action que valida o valor.
- Trade-off: erros de tipo viram erros de runtime se o caller usar `as` demais. Mitigado com helpers `isX(value: string): value is X`.

**Reverter quando**
O MVP migrar para Postgres, no caminho cloud. Aí os enums voltam a ser nativos do banco.

---

## 2026-06-03 · Decisão 004 — Fórmula de consumo

**Contexto**
Cada serviço consome produtos diferentes em quantidade diferente, dependendo do tamanho do veículo. O operador precisa de uma estimativa razoável para planejar compra e precificar.

**Decisão**
```
consumo = quantidadeBase × fatorPorTamanho
custo   = consumo × unitCost
```

Fatores por tamanho (em `prisma/seed.ts` e `src/lib/inventory.ts`):
- `SMALL` × 0.85
- `MEDIUM` × 1.00
- `LARGE` × 1.25
- `EXTRA_LARGE` × 1.60

**Consequência**
- Fórmula simples, auditável, ajustável por linha de `ServiceProductUsage`.
- A conclusão da ordem aplica a fórmula e persiste `totalCost` na OS.
- A baixa no estoque é proporcional ao consumo previsto.
- Trade-off: o consumo é estimado, não medido. Ajustes manuais continuam disponíveis em `/inventory`.

**Reverter quando**
O lava-rápido quiser medir consumo real (ex.: bombas dosadoras com leitura digital). Aí, a fórmula vira um fallback e o valor real é registrado em `StockMovement`.

---

## 2026-06-03 · Decisão 005 — Tema visual "cockpit operacional"

**Contexto**
O brief pediu estética automotiva, cockpit operacional, cards densos e legíveis, sem "protótipo cru".

**Decisão**
- Tema dark com 3 camadas de cinza-azulado (page / surface / card).
- Accent cyan (#22d3ee) usado com moderação: foco, ativo, destaque único.
- Status pills com dot + texto, sempre com 3 tokens (ok / warn / bad / info).
- Tipografia: sans do sistema + monospace para numerics e placas.
- Layout: bento assimétrico no dashboard, lanes na fila, tabelas com hover.
- Sem glassmorphism, sem gradient text, sem side-stripe border, sem identical card grids.

**Consequência**
- Identidade visual coerente, com cara de produto, não de template.
- Densidade alta sem cansaço visual.
- Acessível (contraste WCAG AA, foco visível, motion reduzido honrado).
- Trade-off: o tema é opinativo. Operadores acostumados com UI clara podem estranhar. Mitigado pelo cabeçalho "MVP" e pelo aviso de "offline-first".

**Reverter quando**
A validação com operadores reais indicar dor de leitura. Aí, oferecer tema claro como opt-in (sem perder a estrutura).
