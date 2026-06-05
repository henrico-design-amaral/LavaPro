# PROJECT_CONTROL — LavaPro

> Fonte mestre de controle do projeto: identidade, decisões, escopo, handoffs e log factual.

---

## 1. IDENTIDADE DO PROJETO

- **Nome local**: LavaPro
- **Caminho local**: `C:\Users\henri\Documents\04_PROJETOS_CONTEÚDO\01_ACTIVE\LavaPro`
- **Repositório Git**: ainda não configurado para push remoto (MVP local)
- **Branch principal**: `main`
- **Branch de rebuild ativo**: `rebuild/offline-first-mvp`

---

## 2. FUNÇÃO E ESCOPO

### Objetivo estratégico
Validar a operação de um lava-rápido pequeno com um produto **offline-first** antes de qualquer decisão de escala cloud.

### Tese
Validar operação antes de escalar arquitetura.

### Frase-guia
Pense simples. Faça melhor. Torne-se inevitável.

### Limites de escopo

- **Código permitido**: apenas Next.js + TypeScript + SQLite + Prisma 5 estável + Tailwind 3. Sem cloud, sem auth, sem multi-tenant, sem billing.
- **Conteúdo privado**: nada de dados de clientes reais em commit. Apenas o seed sintético.
- **Execução**: a IA propõe, documenta e executa escopos pequenos. O tomador de decisão final é Henrico.

Para detalhes, ver `docs/MVP_SCOPE.md` e `docs/OFFLINE_FIRST_ARCHITECTURE.md`.

---

## 3. FLUXO DE TRABALHO E LEITURA

Antes de qualquer mudança:

1. Ler `PROJECT_CONTROL.md` (este arquivo).
2. Ler `AGENTS.md` para regras dos agentes.
3. Ler `GEMINI.md` (operacional).
4. Consultar `ai-memory/`.

---

## 4. HISTÓRICO DE SESSÕES (LOG FACTUAL)

### 2026-06-03 — Inicialização da fundação
- **Branch**: `main`
- **Escopo**: estruturar o repositório com o Project Foundation Protocol v1.
- **Resultado**: estrutura de governança criada, sem código de produto.

### 2026-06-03 — Rebuild offline-first MVP (sessão 001)
- **Branch**: `rebuild/offline-first-mvp`
- **Escopo**: reconstruir LavaPro como MVP offline-first, conforme brief recebido.
- **Mudanças**:
  - Stack: Next.js 14 + TypeScript + SQLite + Prisma 5.22 + Tailwind 3.
  - Schema Prisma: 9 modelos (Business, Customer, Vehicle, ServiceType, Product, ServiceProductUsage, ServiceOrder, ServiceOrderItem, StockMovement).
  - Lib: 7 módulos (`db`, `types`, `format`, `datetime`, `inventory`, `queries`, `actions`).
  - UI: 9 primitives + 2 components de página (app-shell, order-actions).
  - Páginas: 13 rotas (`/`, `/queue`, `/orders`, `/orders/new`, `/orders/[id]`, `/customers`, `/customers/new`, `/customers/[id]`, `/customers/[id]/vehicles/new`, `/services`, `/inventory`, `/reports`, `/_not-found`).
  - Seed: 1 business, 8 customers, 10 vehicles, 6 services, 8 products, 12 orders, 34 stock movements.
  - Skills: 6 skills em `.opencode/skills/`.
  - Documentação: 6 docs em `docs/`.
- **Validações executadas**:
  - `npm install` — ok
  - `npm run db:push` — ok
  - `npm run db:seed` — ok
  - `npm run typecheck` — ok (zero erro)
  - `npm run lint` — ok (zero warning)
  - `npm run build` — ok (12 rotas, First Load JS 87–99 kB)
  - Smoke test em dev em todas as rotas — 200 em todas
- **Pendências**:
  - Validar com 1 turno real em lava-rápido (Camada 4 do `docs/VALIDATION_PLAN.md`).
  - Histórico de movimentações de estoque.
  - Export CSV do relatório diário.
  - Atalhos de teclado.
  - Testes unitários da engine de consumo.

### Reconciliação e encerramento

- `git status -sb` — auditar arquivos modificados.
- Nenhum arquivo fora de escopo ou dado privado foi modificado.
- Este arquivo foi atualizado.
- Commit atômico a ser criado: `feat: rebuild lavapro offline-first mvp`.

### 2026-06-05 — Demo estatica GitHub Pages
- **Branch**: `rebuild/offline-first-mvp`
- **Escopo**: criar uma camada estatica separada para validacao visual e navegavel no GitHub Pages, sem alterar a arquitetura offline-first local.
- **Mudancas**:
  - Site estatico criado em `docs/site/` com HTML, CSS e JavaScript locais.
  - Demo baseada no seed sintetico: 1 business, 8 customers, 10 vehicles, 6 services, 8 products, 12 orders e 34 stock movements.
  - Workflow GitHub Actions criado em `.github/workflows/pages.yml` para publicar `docs/site`.
  - Documentacao criada em `docs/GITHUB_PAGES_DEMO.md`.
- **Limite preservado**: Prisma, SQLite, server actions e o MVP local nao foram removidos nem substituidos.

---

## 5. COMO RODAR

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

App em `http://localhost:3000`.

Para resetar dados:

```bash
npm run db:reset
```

Para validar a build de produção:

```bash
npm run typecheck
npm run lint
npm run build
```
