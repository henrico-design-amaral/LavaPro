import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { MetricCard } from '@/components/ui/metric-card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { EmptyState } from '@/components/ui/empty-state';
import { getDashboardMetrics, listOrders } from '@/lib/queries';
import { formatBRL, formatPercent } from '@/lib/format';
import { formatElapsed, formatRelative } from '@/lib/datetime';
import { VEHICLE_SIZE_LABEL } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [metrics, recent] = await Promise.all([getDashboardMetrics(), listOrders()]);

  const activeOrders = recent.filter((o) => o.status === 'QUEUED' || o.status === 'IN_PROGRESS');
  const completedToday = recent.filter((o) => o.status === 'COMPLETED').slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operação"
        title="Painel"
        description="O cockpit do lava-rápido. Tudo que importa para o dia de hoje em um relance."
        actions={
          <>
            <Link href="/orders/new">
              <Button variant="primary" size="md">Nova ordem</Button>
            </Link>
            <Link href="/queue">
              <Button variant="secondary" size="md">Abrir fila</Button>
            </Link>
          </>
        }
      />

      <section aria-label="Indicadores operacionais" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Receita do dia"
          value={formatBRL(metrics.revenueToday)}
          hint={`${metrics.ordersCompletedToday} ordens concluídas`}
          tone="accent"
          size="lg"
        />
        <MetricCard
          label="Margem bruta estimada"
          value={formatBRL(metrics.marginToday)}
          hint={`${formatPercent(metrics.marginPctToday)} de margem`}
          tone={metrics.marginPctToday >= 0.45 ? 'ok' : metrics.marginPctToday >= 0.25 ? 'warn' : 'bad'}
        />
        <MetricCard
          label="Custo químico"
          value={formatBRL(metrics.costToday)}
          hint="Consumo efetivo registrado"
          tone="warn"
        />
        <MetricCard
          label="Ticket médio"
          value={formatBRL(metrics.ticketAverageToday)}
          hint={`${metrics.servicesToday} serviços executados`}
        />
      </section>

      <section aria-label="Fila e operação" className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <Card
          className="lg:col-span-7"
          title="Fila ativa"
          subtitle="Ordens prontas para iniciar ou em execução"
          trailing={
            <Link href="/queue">
              <Button variant="ghost" size="sm">Ver fila completa →</Button>
            </Link>
          }
          padding="md"
        >
          {activeOrders.length === 0 ? (
            <EmptyState
              title="Fila vazia"
              description="Crie uma nova ordem para começar o dia."
              action={
                <Link href="/orders/new">
                  <Button variant="primary" size="sm">Nova ordem</Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {activeOrders.slice(0, 6).map((o) => {
                const isProgress = o.status === 'IN_PROGRESS';
                const ageSource = isProgress && o.startedAt ? o.startedAt : o.queuedAt;
                return (
                  <li key={o.id} className="group flex items-center gap-4 py-3.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-[11px] font-mono text-ink-300">
                      {o.vehicle.plate.slice(-3)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink-50">{o.customer.name}</p>
                        <span className="text-ink-500">·</span>
                        <span className="truncate text-xs text-ink-300">
                          {o.vehicle.brand} {o.vehicle.model}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-400">
                        <span>{o.items.length} {o.items.length === 1 ? 'serviço' : 'serviços'}</span>
                        <span className="text-ink-600">·</span>
                        <span>há {formatElapsed(ageSource)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="num text-sm font-semibold text-ink-50">{formatBRL(o.totalPrice)}</p>
                      <div className="mt-0.5">
                        <StatusPill status={o.status} />
                      </div>
                    </div>
                    <Link
                      href={`/orders/${o.id}`}
                      className="ml-2 hidden text-xs text-ink-400 hover:text-ink-50 sm:inline"
                    >
                      Abrir →
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="grid grid-cols-1 gap-3 lg:col-span-5">
          <div className="grid grid-cols-2 gap-3">
            <Card padding="md">
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Na fila</p>
              <p className="num mt-2 text-3xl font-semibold text-signal-warn">{metrics.ordersQueued}</p>
              <p className="mt-1 text-xs text-ink-300">aguardando início</p>
            </Card>
            <Card padding="md">
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Em execução</p>
              <p className="num mt-2 text-3xl font-semibold text-signal-info">{metrics.ordersInProgress}</p>
              <p className="mt-1 text-xs text-ink-300">atendimento em andamento</p>
            </Card>
          </div>

          <Card
            title="Estoque em alerta"
            subtitle={`${metrics.lowStockCount} ${metrics.lowStockCount === 1 ? 'produto' : 'produtos'} abaixo do mínimo`}
            trailing={
              <Link href="/inventory">
                <Button variant="ghost" size="sm">Gerenciar →</Button>
              </Link>
            }
          >
            {metrics.lowStockCount === 0 ? (
              <p className="text-sm text-ink-300">Tudo dentro do mínimo configurado. Bom trabalho.</p>
            ) : (
              <p className="text-sm text-ink-200">
                {metrics.lowStockCount} {metrics.lowStockCount === 1 ? 'item precisa de reposição' : 'itens precisam de reposição'}.{' '}
                <Link href="/inventory" className="text-accent-300 hover:text-accent-200">
                  Abrir estoque
                </Link>
              </p>
            )}
          </Card>

          <Card
            title="Mais vendido hoje"
            subtitle="Serviço de maior saída do dia"
          >
            {metrics.topServiceToday ? (
              <div className="flex items-baseline gap-3">
                <p className="num text-2xl font-semibold text-ink-50">{metrics.topServiceToday.count}</p>
                <p className="text-sm text-ink-200">{metrics.topServiceToday.name}</p>
              </div>
            ) : (
              <p className="text-sm text-ink-300">Nenhuma conclusão ainda hoje.</p>
            )}
          </Card>
        </div>
      </section>

      <section aria-label="Concluídas recentemente" className="grid grid-cols-1 gap-3">
        <Card
          title="Concluídas hoje"
          subtitle="Últimas ordens finalizadas com receita e margem estimada"
          padding="md"
        >
          {completedToday.length === 0 ? (
            <p className="text-sm text-ink-300">Sem ordens concluídas até o momento.</p>
          ) : (
            <ul className="divide-y divide-white/[0.04]">
              {completedToday.map((o) => {
                const margin = o.totalPrice - o.totalCost;
                const marginPct = o.totalPrice > 0 ? margin / o.totalPrice : 0;
                return (
                  <li key={o.id} className="flex flex-wrap items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-50">{o.customer.name}</p>
                      <p className="text-[11px] text-ink-400">
                        {o.vehicle.brand} {o.vehicle.model} · {VEHICLE_SIZE_LABEL[o.vehicle.size as keyof typeof VEHICLE_SIZE_LABEL] ?? o.vehicle.size} · {o.items.length} {o.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="num text-sm font-semibold text-ink-50">{formatBRL(o.totalPrice)}</p>
                      <p className="text-[11px] text-ink-400">{formatRelative(o.completedAt)}</p>
                    </div>
                    <Badge tone={marginPct >= 0.4 ? 'ok' : marginPct >= 0.2 ? 'warn' : 'bad'}>
                      {formatPercent(marginPct)} margem
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
