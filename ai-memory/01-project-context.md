# 01 · Contexto do projeto

## Estado atual

- **Branch**: `rebuild/offline-first-mvp`
- **Versão**: MVP local, ainda sem tag.
- **Banco**: SQLite local em `prisma/dev.db`.
- **Stack**: Next.js 14 (App Router) + TypeScript estrito + Prisma 5.22 + Tailwind 3 + SQLite.

## Por que rebuild

A versão cloud-first anterior tentou nascer como SaaS multi-tenant com Railway, Postgres, Prisma 7, multiSchema, adapter-pg, billing, reseller e RBAC. Prematuro.

A nova direção é: validar a operação local de um lava-rápido pequeno antes de qualquer migração para cloud. Stack mínima, sem dependências de runtime em serviços externos.

## Como rodar

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

## Validação local executada

- `npm install` — ok
- `npm run db:push` — ok
- `npm run db:seed` — ok (1/8/10/6/8/12/34)
- `npm run typecheck` — ok
- `npm run lint` — ok
- `npm run build` — ok (12 rotas)
- Smoke test em dev: 9 rotas retornando 200

## Próximo marco

Camada 4 do `docs/VALIDATION_PLAN.md` — instalar em um lava-rápido real e operar 1 turno sem internet.
