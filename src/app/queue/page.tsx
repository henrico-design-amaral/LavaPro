import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderActions } from '@/components/order-actions';
import { EmptyState } from '@/components/ui/empty-state';
import { listOrders } from '@/lib/queries';
import { formatBRL } from '@/lib/format';
import { formatElapsed } from '@/lib/datetime';
import { ORDER_STATUSES, ORDER_STATUS_LABEL, type OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const LANE_META: Record<OrderStatus, { tone: 'warn' | 'info' | 'ok' | 'bad'; description: string }> = {
  QUEUED: { tone: 'warn', description: 'Aguardando início' },
  IN_PROGRESS: { tone: 'info', description: 'Atendimento em andamento' },
  COMPLETED: { tone: 'ok', description: 'Finalizadas e pagas' },
  CANCELLED: { tone: 'bad', description: 'Canceladas neste turno' },
};

export default async function QueuePage() {
  const orders = await listOrders();

  const lanes = ORDER_STATUSES.map((status) => ({
    status,
    orders: orders.filter((o) => o.status === status),
  }));

  const liveLanes = lanes.filter((l) => l.status === 'QUEUED' || l.status === 'IN_PROGRESS');
  const closedLanes = lanes.filter((l) => l.status === 'COMPLETED' || l.status === 'CANCELLED');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Fluxo"
        title="Fila operacional"
        description="Inicie, conclua ou cancele as ordens em tempo real. Sem recarregar a página."
        actions={
          <Link href="/orders/new">
            <Button variant="primary" size="md">Nova ordem</Button>
          </Link>
        }
      />

      <section aria-label="Fila ativa" className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {liveLanes.map((lane) => (
          <Lane key={lane.status} status={lane.status} orders={lane.orders} />
        ))}
      </section>

      <section aria-label="Histórico do turno" className="space-y-3">
        <header className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-tight text-ink-100">Histórico do turno</h2>
          <span className="text-xs text-ink-400">fechadas · {closedLanes.reduce((acc, l) => acc + l.orders.length, 0)}</span>
        </header>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {closedLanes.map((lane) => (
            <Lane key={lane.status} status={lane.status} orders={lane.orders} dense />
          ))}
        </div>
      </section>
    </div>
  );
}

function Lane({ status, orders, dense = false }: { status: OrderStatus; orders: Awaited<ReturnType<typeof listOrders>>; dense?: boolean }) {
  const meta = LANE_META[status];
  return (
    <Card
      padding="md"
      title={
        <div className="flex items-center gap-2">
          <Badge tone={meta.tone} dot>{ORDER_STATUS_LABEL[status]}</Badge>
          <span className="text-xs font-normal text-ink-400">{orders.length}</span>
        </div>
      }
      subtitle={meta.description}
    >
      {orders.length === 0 ? (
        <EmptyState
          title={`Sem ordens ${ORDER_STATUS_LABEL[status].toLowerCase()}`}
          description="Nada por aqui no momento."
        />
      ) : (
        <ul className="space-y-2">
          {orders.map((o) => {
            const isProgress = o.status === 'IN_PROGRESS';
            const ageSource = isProgress && o.startedAt ? o.startedAt : o.queuedAt;
            return (
              <li
                key={o.id}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.035]"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="truncate text-sm font-semibold text-ink-50">{o.customer.name}</p>
                      <span className="font-mono text-[11px] text-ink-400">{o.vehicle.plate}</span>
                    </div>
                    <p className="text-[11px] text-ink-300">
                      {o.vehicle.brand} {o.vehicle.model} · {o.vehicle.color}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {o.items.map((i) => (
                        <span
                          key={i.id}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-ink-200"
                        >
                          {i.quantity > 1 ? `${i.quantity}× ` : ''}{i.serviceType.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="num text-base font-semibold text-ink-50">{formatBRL(o.totalPrice)}</p>
                    <p className="text-[11px] text-ink-400">
                      {isProgress ? 'em execução há ' : 'na fila há '}
                      <span className="text-ink-200">{formatElapsed(ageSource)}</span>
                    </p>
                  </div>
                </div>
                {!dense && (
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                    <Link
                      href={`/orders/${o.id}`}
                      className="text-[11px] font-medium text-ink-300 hover:text-ink-50"
                    >
                      Ver detalhes →
                    </Link>
                    <OrderActions orderId={o.id} currentStatus={o.status} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
