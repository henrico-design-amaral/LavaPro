# IMPLEMENTATION_LOG — LavaPro

Diário de bordo das sessões. Cada entrada registra o que foi feito, o que foi validado, e o que ficou pendente.

---

## 2026-06-03 · Sessão 001 — Rebuild offline-first MVP

**Branch**: `rebuild/offline-first-mvp`
**Commit inicial**: hash a definir nesta sessão
**Executor**: Antigravity + OpenCode (MiniMax M3 Free)
**Modo**: `/goal` (execução direta por instrução do usuário)

### Escopo

Reconstruir o LavaPro como MVP offline-first, conforme brief recebido.

### Arquivos criados

#### Configuração
- `package.json`
- `tsconfig.json`
- `next.config.mjs`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `.eslintrc.json`
- `.env` (apenas `DATABASE_URL="file:./prisma/dev.db"`)
- `next-env.d.ts`
- `.gitignore` (atualizado para incluir `prisma/dev.db` e `prisma/migrations/`)

#### Prisma
- `prisma/schema.prisma` (modelo completo: Business, Customer, Vehicle, ServiceType, Product, ServiceProductUsage, ServiceOrder, ServiceOrderItem, StockMovement)
- `prisma/seed.ts` (1 business, 8 customers, 10 vehicles, 6 services, 8 products, 12 orders, 34 stock movements)

#### Lib
- `src/lib/db.ts` (Prisma singleton)
- `src/lib/types.ts` (VehicleSize, OrderStatus, StockReason + helpers)
- `src/lib/format.ts` (formatBRL, formatNumber, formatPercent, formatQuantity)
- `src/lib/datetime.ts` (formatDate, formatDateTime, formatElapsed, formatDuration, startOfDay, endOfDay)
- `src/lib/cn.ts` (helper de classes)
- `src/lib/inventory.ts` (planUsage, applyUsageToStock, totalPlannedCost, roundTo2/3)
- `src/lib/queries.ts` (getDashboardMetrics, listOrders, getOrderDetail, listCustomers, getCustomerDetail, listServiceTypes, listProducts, getDailyReport)
- `src/lib/actions.ts` (createOrderAction, startOrderAction, completeOrderAction, cancelOrderAction, adjustStockAction, createCustomerAction, createVehicleAction)

#### UI primitives
- `src/components/ui/button.tsx` (5 variants, 3 sizes)
- `src/components/ui/card.tsx` (surface + title/subtitle/trailing/padding)
- `src/components/ui/badge.tsx` (6 tones, dot opcional, 2 sizes)
- `src/components/ui/status-pill.tsx` (StatusPill com dot, pulse em IN_PROGRESS)
- `src/components/ui/input.tsx` (Input, Textarea, Select, Label, FieldGroup)
- `src/components/ui/table.tsx` (Table, THead, TBody, TR, TH, TD)
- `src/components/ui/empty-state.tsx`
- `src/components/ui/metric-card.tsx`
- `src/components/ui/page-header.tsx`
- `src/components/app-shell.tsx` (header + nav desktop + nav mobile)
- `src/components/order-actions.tsx` (server action buttons com transições)

#### Páginas
- `src/app/layout.tsx` + `src/app/globals.css` + `src/app/not-found.tsx`
- `src/app/page.tsx` (Dashboard — bento com 4 métricas + fila ativa + alertas)
- `src/app/queue/page.tsx` (lanes por status)
- `src/app/orders/page.tsx` (lista)
- `src/app/orders/new/page.tsx` + `form.tsx` (criação com inline customer/vehicle)
- `src/app/orders/[id]/page.tsx` (detalhe com timeline, margem, plano de consumo)
- `src/app/customers/page.tsx` (lista)
- `src/app/customers/new/page.tsx` + `form.tsx`
- `src/app/customers/[id]/page.tsx` (detalhe com veículos e histórico)
- `src/app/customers/[id]/vehicles/new/page.tsx` + `form.tsx`
- `src/app/services/page.tsx` (catálogo com produtos consumidos)
- `src/app/inventory/page.tsx` + `adjust-control.tsx`
- `src/app/reports/page.tsx` (fechamento do dia)

#### Skills
- `.opencode/skills/product-management.md`
- `.opencode/skills/ux-heuristics.md`
- `.opencode/skills/ui-quality.md`
- `.opencode/skills/accessibility-review.md`
- `.opencode/skills/systematic-debugging.md`
- `.opencode/skills/git-closeout.md`

#### Documentação
- `docs/MVP_SCOPE.md`
- `docs/OFFLINE_FIRST_ARCHITECTURE.md`
- `docs/VALIDATION_PLAN.md`
- `docs/PRODUCT_DECISIONS.md`
- `docs/IMPLEMENTATION_LOG.md` (este arquivo)
- `docs/BENCHMARK_SUMMARY.md`

### Validações executadas

- `npm install` — ok (Prisma client gerado)
- `npm run db:push` — ok (SQLite criado)
- `npm run db:seed` — ok (1/8/10/6/8/12/34 conforme brief)
- `npm run typecheck` — ok (zero erro)
- `npm run lint` — ok (zero warning)
- `npm run build` — ok (12 rotas, First Load JS 87–99 kB)
- Smoke test em dev (`npm run dev` + `Invoke-WebRequest`):
  - `/` → 200
  - `/queue` → 200
  - `/orders` → 200
  - `/orders/new` → 200
  - `/customers` → 200
  - `/customers/new` → 200
  - `/services` → 200
  - `/inventory` → 200
  - `/reports` → 200

### Checklist de acessibilidade aplicado

- [x] Contraste de texto body contra surface ≥ 4.5:1 (validação visual em globals.css)
- [x] Foco visível (`:focus-visible` com anel accent-500)
- [x] Cor não é o único sinal: status sempre com dot + texto
- [x] Labels em todos os inputs (`<label htmlFor>`)
- [x] `prefers-reduced-motion: reduce` desabilita animações (em globals.css)
- [x] Tabelas com `<thead>` / `<tbody>` semânticos
- [x] Listas com `<ul>` / `<li>` semânticos
- [x] Erros de formulário com `role="alert"`
- [x] Headings em ordem: cada página começa com `h1` no PageHeader
- [x] Botões com texto descritivo (sem botões só com ícone)
- [x] Form de ordem permite navegação por teclado em todos os campos
- [x] Estados vazios (`EmptyState`) com chamada para ação

### Limitações conhecidas

- Sem login: o app assume um único operador por máquina.
- Sem persistência entre dispositivos: o `.db` é local.
- Sem impressão de fechamento: o relatório é apenas em tela.
- Sem export CSV: o operador anota manualmente ou tira print.
- Sem PWA: o app é uma aplicação web tradicional, mas roda 100% sem rede em runtime.
- O consumo é estimado pela fórmula, não medido fisicamente.
- O estoque mínimo é uma heurística, sem curva de segurança.

### Pendências

- [ ] Validar com 1 turno real em um lava-rápido.
- [ ] Adicionar histórico de movimentações de estoque (tela pedida pelo brief, marcada como "em breve").
- [ ] Adicionar export CSV do relatório diário.
- [ ] Adicionar atalhos de teclado (ex.: `i` para iniciar, `c` para concluir).
- [ ] Adicionar testes unitários da engine de consumo em `src/lib/inventory.ts`.

### Próximo passo

Executar a Camada 4 do plano de validação (instalar em um lava-rápido real e operar 1 turno). Antes disso, nenhum trabalho de escala deve começar.
