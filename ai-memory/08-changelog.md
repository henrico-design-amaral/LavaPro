# 08 · Changelog do projeto

## 2026-06-03 — v0.1.0 (MVP local)

- Stack definida: Next.js 14 + TypeScript + SQLite + Prisma 5.22 + Tailwind 3.
- Schema Prisma criado com 9 modelos.
- Lib core: db, types, format, datetime, inventory, queries, actions.
- UI: 9 primitives + AppShell + OrderActions.
- 13 rotas: `/`, `/queue`, `/orders` (list/new/detail), `/customers` (list/new/detail + vehicles/new), `/services`, `/inventory`, `/reports`, `/_not-found`.
- Seed: 1/8/10/6/8/12/34.
- Documentação: 6 docs em `docs/`.
- Skills locais: 6 em `.opencode/skills/`.
- Validação: typecheck, lint, build, smoke test em dev — todos OK.
- Branch: `rebuild/offline-first-mvp`.

## 2026-06-05 — Demo estática de validação no GitHub Pages

- Criada camada estática separada em `docs/site/`.
- Telas navegáveis: Painel, Fila, Ordens de serviço, Nova OS, Clientes, Serviços, Estoque / SmartStock e Relatório diário.
- Dados demonstrativos derivados de `prisma/seed.ts`: 1/8/10/6/8/12/34.
- Workflow `.github/workflows/pages.yml` publica apenas `docs/site` no GitHub Pages.
- Documentação `docs/GITHUB_PAGES_DEMO.md` explica a separação entre demo estática e MVP funcional local.
- Arquitetura offline-first local preservada: Prisma, SQLite, server actions e Next runtime continuam no MVP.

## 2026-06-05 — Polimento da demo pública

- Demo corrigida na `main` para PT-BR com acentos e sem rótulos mistos em inglês na UI.
- Primeiro painel fortalecido com hero de validação, contadores visíveis do seed e aviso de não persistência.
- Workflow de Pages mantido para push na `main`, publicação de `docs/site` e validação de `app.js` com `node --check`.
