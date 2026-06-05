# OFFLINE_FIRST_ARCHITECTURE — LavaPro

## Princípio

O LavaPro roda 100% na máquina onde foi instalado. Sem servidor, sem nuvem, sem sincronização, sem telemetria. O banco é um arquivo SQLite local.

## Por que

1. **Validação precisa de operação, não de arquitetura.**
   O objetivo do MVP é validar o loop operacional: abrir ordem → atender → fechar → relatório diário. Se esse loop não funciona no barro, nenhuma camada de cloud vai salvá-lo.

2. **O usuário é um único operador em um único turno.**
   Não há conflito de versão entre dispositivos. Não há latência de rede. Não há falha de sync. Tudo é instantâneo.

3. **Custo zero para começar.**
   Sem Railway, sem Postgres, sem domínio, sem TLS, sem billing. O operador instala e usa.

4. **Privacidade e controle de dados do cliente.**
   Os dados ficam na máquina do cliente. Nada sai.

## Decisões de arquitetura

### Banco: SQLite

- `prisma/dev.db` é o arquivo de banco. Vive na pasta do projeto.
- `prisma db push` cria/atualiza o schema.
- `prisma db seed` popula dados de exemplo.
- Para reset: `npm run db:reset` (apaga e recria com seed).
- Não usar `migrate` no MVP; `push` é suficiente para iteração local.

### ORM: Prisma 5 (estável)

- Sem Prisma 7 experimental. Sem `multiSchema`. Sem `adapter-pg`.
- Enums viraram strings com tipos TypeScript em `src/lib/types.ts`, porque SQLite não suporta enums nativos.
- Cliente em singleton global para evitar recriação em hot reload (`src/lib/db.ts`).

### Frontend: Next.js 14 App Router

- Server Components para todas as listagens e detalhes (dados sempre frescos).
- Server Actions para mutações (criar ordem, iniciar, concluir, cancelar, ajustar estoque, criar cliente, criar veículo).
- Client Components apenas para forms com estado local (nova ordem, ajuste de estoque, novo cliente, novo veículo).
- `revalidatePath` após cada mutação para refletir o estado novo sem refresh manual.

### Estilo: Tailwind 3

- Tema dark operacional (variantes `ink`, `accent`, `signal`).
- Sem CSS-in-JS.
- Sem biblioteca de UI (Shadcn, Radix, etc) para manter a pegada mínima.

### Lógica de negócio: `src/lib/`

- `db.ts` — cliente Prisma singleton.
- `types.ts` — uniões TypeScript que substituem enums.
- `format.ts` — `formatBRL`, `formatNumber`, `formatPercent`.
- `datetime.ts` — `formatDate`, `formatElapsed`, `startOfDay`, `endOfDay`.
- `inventory.ts` — engine de consumo: `planUsage`, `applyUsageToStock`, `totalPlannedCost`.
- `queries.ts` — read-side: `getDashboardMetrics`, `listOrders`, `getOrderDetail`, `listCustomers`, `listServiceTypes`, `listProducts`, `getDailyReport`.
- `actions.ts` — write-side: `createOrderAction`, `startOrderAction`, `completeOrderAction`, `cancelOrderAction`, `adjustStockAction`, `createCustomerAction`, `createVehicleAction`.

### Transações

Toda mutação que toca mais de uma tabela é executada em `prisma.$transaction`. Em particular:

- Concluir uma OS: aplica consumo no estoque e cria `StockMovement` na mesma transação.
- Ajustar estoque: atualiza `Product.currentStock` e cria `StockMovement` na mesma transação.

### Fórmula de consumo

```
consumo = quantidadeBase × fatorPorTamanho
custo   = consumo × unitCost
```

Implementada em `src/lib/inventory.ts`. Usada em:

- Conclusão de ordem (`completeOrderAction`): calcula e persiste `totalCost` da OS e dos itens.
- Detalhe da ordem: exibe plano previsto (para ordens em fila / execução) e plano efetivo (para concluídas).
- Seed: simula o mesmo cálculo para as 6 ordens concluídas.

### IDs e chaves

- CUIDs via Prisma default. Sem UUID v4 manual.
- Índices em `plate`, `phone`, `(businessId, status)`, `(businessId, productId)`, `createdAt`.

## O que está fora da arquitetura

- `multiSchema`: explicitamente fora. A versão cloud-first anterior tinha isso e está arquivada.
- `adapter-pg`: explicitamente fora. Sem Postgres no MVP.
- `server-only` packages além de `server-only` do Next (sem dependência extra).
- `next-auth` ou similar: sem auth.
- WebSockets ou SSE: o refresh via `router.refresh()` no cliente é suficiente.

## Como rodar

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

App disponível em `http://localhost:3000`.

## Como resetar dados

```bash
npm run db:reset
```

## Caminho de evolução (pós-MVP, não implementado)

- Persistir em Postgres quando houver um operador remoto.
- Sincronização via fila local (SQLite WAL + replicação) entre terminais.
- Autenticação local por senha mestra.
- Exportação de fechamento do dia em CSV.
- Backup automático do `.db` para um diretório externo.

Esses itens **não estão no roadmap ativo**. Entram somente depois que a validação operacional estiver verde por pelo menos 2 turnos reais em um lava-rápido real.
