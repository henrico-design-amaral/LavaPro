# LavaPro

> Cockpit operacional para lava-rápidos pequenos. Offline-first. Feito para validar a operação antes de qualquer decisão de escala.

## Tese

Validar a operação de um lava-rápido pequeno com um produto **local-first** antes de qualquer migração para cloud. A frase-guia é: pense simples, faça melhor, torne-se inevitável.

## Como rodar

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

App disponível em `http://localhost:3000`. Não precisa de internet em runtime.

Para resetar o banco e repopular o seed:

```bash
npm run db:reset
```

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o Next.js em modo dev |
| `npm run build` | Faz o build de produção |
| `npm run start` | Roda o build de produção |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `next lint` |
| `npm run db:push` | Aplica o schema Prisma ao SQLite local |
| `npm run db:seed` | Popula o banco com 1 negócio, 8 clientes, 10 veículos, 6 serviços, 8 produtos e 12 ordens |
| `npm run db:reset` | Apaga e recria o banco com seed |

## Estrutura

```
.
├── prisma/
│   ├── schema.prisma        # 9 modelos: Business, Customer, Vehicle, ServiceType, Product,
│   │                        #            ServiceProductUsage, ServiceOrder, ServiceOrderItem, StockMovement
│   └── seed.ts              # Idempotente. Reset + seed.
├── src/
│   ├── app/                 # App Router do Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx         # /          → Dashboard
│   │   ├── queue/           # /queue     → Fila operacional
│   │   ├── orders/          # /orders    → Ordens de serviço
│   │   ├── customers/       # /customers → Clientes e veículos
│   │   ├── services/        # /services  → Catálogo de serviços
│   │   ├── inventory/       # /inventory → Estoque e ajustes
│   │   └── reports/         # /reports   → Fechamento diário
│   ├── components/          # UI primitives + page components
│   └── lib/                 # db, types, format, datetime, inventory, queries, actions
├── docs/                    # Documentação (MVP_SCOPE, ARCHITECTURE, VALIDATION_PLAN, etc)
├── .opencode/skills/        # Skills locais do projeto
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## O que o LavaPro faz

- **Dashboard** com receita, custo, margem, ticket médio, top service, fila ativa e alertas de estoque do dia.
- **Fila** com lanes por status: `Na fila`, `Em execução`, `Concluído`, `Cancelado`. Ações inline em cada card.
- **Ordens** com criação guiada (cliente → veículo → serviços → observações) e detalhe com timeline, plano de consumo e margem.
- **Clientes e veículos** com histórico por placa.
- **Catálogo de serviços** com os produtos consumidos por tamanho de veículo.
- **Estoque** com alerta de mínimo, baixa automática ao concluir OS, e ajuste manual (compra/perda/ajuste).
- **Relatório diário** com KPIs, mix de serviços e alertas de estoque.

## O que o LavaPro **não** faz (no MVP)

- Não autentica usuários. É uma máquina, um operador.
- Não sincroniza entre dispositivos. O banco é um arquivo SQLite local.
- Não fala com a nuvem. Zero chamada externa em runtime.
- Não tem multi-tenant. Um banco, um negócio.
- Não tem billing. Não tem reseller. Não tem RBAC. Não tem feature flags.

Esses itens podem entrar **depois** da validação operacional. Estão fora de propósito hoje.

## Validação

Para validar a build, rode em ordem:

```bash
npm run typecheck
npm run lint
npm run build
```

Para validar o fluxo operacional completo, siga `docs/VALIDATION_PLAN.md`.

## Documentação

- `docs/MVP_SCOPE.md` — escopo do MVP, módulos, status, fórmula de consumo.
- `docs/OFFLINE_FIRST_ARCHITECTURE.md` — decisões arquiteturais, layout do código, como rodar.
- `docs/VALIDATION_PLAN.md` — camadas de validação, fluxos manuais, checklist de a11y.
- `docs/PRODUCT_DECISIONS.md` — ADRs vivos, datados, atômicos.
- `docs/IMPLEMENTATION_LOG.md` — diário de bordo por sessão.
- `docs/BENCHMARK_SUMMARY.md` — referência competitiva e padrões adotados.

## Decisão de manter o repositório versionado

A branch ativa de trabalho é `rebuild/offline-first-mvp`. A branch `main` guarda apenas a fundação. Promoção para `main` exige:

1. Validação de Camada 1, 2 e 3 do `VALIDATION_PLAN.md` em verde.
2. Aprovação explícita de Henrico.
3. Atualização do `PROJECT_CONTROL.md`.

## Skills locais

- `.opencode/skills/product-management.md`
- `.opencode/skills/ux-heuristics.md`
- `.opencode/skills/ui-quality.md`
- `.opencode/skills/accessibility-review.md`
- `.opencode/skills/systematic-debugging.md`
- `.opencode/skills/git-closeout.md`

## Pessoas

- **Henrico Amaral** — decisão estratégica e aprovação final.
- **Antigravity (IA)** — executor técnico, auditor de código, guardião da memória.
- **Claude (IA)** — referência em refatoração e design system (em sessões específicas).

---

Pense simples. Faça melhor. Torne-se inevitável.
