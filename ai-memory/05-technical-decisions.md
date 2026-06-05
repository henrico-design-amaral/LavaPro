# 05 · Decisões técnicas

> Versão resumida. Detalhes em `docs/PRODUCT_DECISIONS.md`.

## Stack

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Framework | Next.js 14 App Router | SSR + Server Actions, sem cliente pesado |
| Linguagem | TypeScript estrito | Segurança de tipos em toda a aplicação |
| Banco | SQLite local | Zero infra, arquivo único, portável |
| ORM | Prisma 5.22 (estável) | Schema declarativo, tipos gerados |
| Estilo | Tailwind 3 | Sem CSS-in-JS, build pequeno |
| UI | Componentes próprios | Sem dependência de UI kit em MVP |

## Decisões explícitas

1. **Enums viraram strings + unions TypeScript** (SQLite não suporta enums nativos).
2. **Server Actions para mutação** (sem `/api/*` separado).
3. **`revalidatePath` após cada mutação** (reflete o estado novo sem refresh manual).
4. **`PrismaClient` em singleton global** (evita recriação em hot reload).
5. **Transação em `completeOrderAction` e `adjustStockAction`** (consistência de estoque + histórico).
6. **Fórmula de consumo** centralizada em `src/lib/inventory.ts`.
7. **Sem `migrate`** no MVP: `db push` é suficiente.

## Não-objetivos

- Sem `multiSchema` (arquivado do cloud-first).
- Sem `adapter-pg` (sem Postgres no MVP).
- Sem `next-auth` (sem auth).
- Sem Shadcn, Radix, MUI (sem UI kit em MVP).
- Sem Prisma 7 experimental.
