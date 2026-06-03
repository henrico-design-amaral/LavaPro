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
