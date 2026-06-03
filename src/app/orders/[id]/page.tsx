import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import { OrderActions } from '@/components/order-actions';
import { getOrderDetail, listServiceTypes, getCustomerDetail } from '@/lib/queries';
import { formatBRL, formatPercent } from '@/lib/format';
import { formatDateTime, formatElapsed, formatRelative } from '@/lib/datetime';
import { VEHICLE_SIZE_LABEL } from '@/lib/types';
import { prisma } from '@/lib/db';
import { planUsage, totalPlannedCost } from '@/lib/inventory';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderDetail(params.id);
  if (!order) notFound();

  const customerDetail = await getCustomerDetail(order.customer.id);
  const allServices = await listServiceTypes();

  const serviceById = new Map(allServices.map((s) => [s.id, s]));
  const itemPlan = order.items
    .map((i) => {
      const st = serviceById.get(i.serviceTypeId);
      if (!st) return null;
      const sizeKey = order.vehicle.size as 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';
      const fullUsages = st.productUsages as Array<
        (typeof st.productUsages)[number] & { product: { id: string; name: string; unit: string; unitCost: number; currentStock: number; minStock: number; businessId: string; active: boolean; createdAt: Date; updatedAt: Date } }
      >;
      return {
        item: i,
        service: st,
        plan: planUsage(fullUsages, sizeKey, i.quantity),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const simulatedCost = order.status === 'COMPLETED' ? order.totalCost : totalPlannedCost(itemPlan.flatMap((i) => i.plan));
  const margin = order.totalPrice - simulatedCost;
  const marginPct = order.totalPrice > 0 ? margin / order.totalPrice : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Ordem · ${order.id.slice(-6).toUpperCase()}`}
        title={`${order.customer.name} · ${order.vehicle.brand} ${order.vehicle.model}`}
        description={
          <span className="flex flex-wrap items-center gap-2 text-ink-300">
            <span className="font-mono">{order.vehicle.plate}</span>
            <span className="text-ink-600">·</span>
            <span>{order.vehicle.color}</span>
            <span className="text-ink-600">·</span>
            <span>{VEHICLE_SIZE_LABEL[order.vehicle.size as keyof typeof VEHICLE_SIZE_LABEL] ?? order.vehicle.size}</span>
          </span>
        }
        actions={
          <>
            <StatusPill status={order.status} />
            <OrderActions orderId={order.id} currentStatus={order.status} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card padding="md">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Valor</p>
          <p className="num mt-2 text-3xl font-semibold text-ink-50">{formatBRL(order.totalPrice)}</p>
        </Card>
        <Card padding="md">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Custo estimado</p>
          <p className="num mt-2 text-3xl font-semibold text-signal-warn">{formatBRL(simulatedCost)}</p>
          <p className="mt-1 text-[11px] text-ink-400">
            {order.status === 'COMPLETED' ? 'custo efetivo ao concluir' : 'custo previsto pela fórmula'}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Margem estimada</p>
          <p className={`num mt-2 text-3xl font-semibold ${marginPct >= 0.45 ? 'text-signal-ok' : marginPct >= 0.25 ? 'text-signal-warn' : 'text-signal-bad'}`}>
            {formatBRL(margin)}
          </p>
          <p className="mt-1 text-[11px] text-ink-400">{formatPercent(marginPct)} de margem</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Linha do tempo" className="lg:col-span-1">
          <ul className="space-y-3 text-sm">
            <Timeline label="Na fila" value={formatDateTime(order.queuedAt)} />
            {order.startedAt && <Timeline label="Iniciada" value={formatDateTime(order.startedAt)} />}
            {order.completedAt && <Timeline label="Concluída" value={formatDateTime(order.completedAt)} />}
            {order.cancelledAt && <Timeline label="Cancelada" value={formatDateTime(order.cancelledAt)} tone="bad" />}
            {order.startedAt && !order.completedAt && !order.cancelledAt && (
              <li className="flex items-center justify-between">
                <span className="text-ink-300">Em execução há</span>
                <Badge tone="info">{formatElapsed(order.startedAt)}</Badge>
              </li>
            )}
            {order.queuedAt && (order.status === 'QUEUED') && (
              <li className="flex items-center justify-between">
                <span className="text-ink-300">Aguardando há</span>
                <Badge tone="warn">{formatElapsed(order.queuedAt)}</Badge>
              </li>
            )}
          </ul>
          {order.observations && (
            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Observações</p>
              <p className="mt-1.5 text-sm text-ink-100">{order.observations}</p>
            </div>
          )}
        </Card>

        <Card title="Serviços contratados" subtitle="Itens da ordem e preço fixado na criação" className="lg:col-span-2">
          <ul className="divide-y divide-white/[0.04]">
            {itemPlan.map(({ item, service, plan }) => (
              <li key={item.id} className="py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-50">
                      {item.quantity > 1 ? `${item.quantity}× ` : ''}
                      {service.name}
                    </p>
                    {service.description && (
                      <p className="mt-0.5 text-xs text-ink-300">{service.description}</p>
                    )}
                  </div>
                  <span className="num text-sm font-semibold text-ink-50">
                    {formatBRL(item.priceAtTime * item.quantity)}
                  </span>
                </div>
                {plan.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {plan.map((p) => (
                      <span
                        key={p.productId}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-ink-200"
                      >
                        <span className="font-mono text-ink-300">{p.quantity.toFixed(2)} {p.unit}</span>
                        <span className="text-ink-500">·</span>
                        <span>{p.productName}</span>
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        title="Cliente"
        subtitle={
          customerDetail
            ? `${customerDetail.vehicles.length} ${customerDetail.vehicles.length === 1 ? 'veículo' : 'veículos'} · ${customerDetail._count?.serviceOrders ?? 0} ordens`
            : ''
        }
        trailing={
          <Link href={`/customers/${order.customer.id}`}>
            <Button variant="ghost" size="sm">Abrir cliente →</Button>
          </Link>
        }
      >
        {customerDetail && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Nome</p>
              <p className="mt-1 text-ink-100">{customerDetail.name}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Telefone</p>
              <p className="mt-1 text-ink-100">{customerDetail.phone}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Última visita</p>
              <p className="mt-1 text-ink-100">
                {customerDetail.serviceOrders[0] ? formatRelative(customerDetail.serviceOrders[0].queuedAt) : '—'}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function Timeline({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'bad' }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-ink-300">{label}</span>
      <span className={`num ${tone === 'bad' ? 'text-signal-bad' : 'text-ink-100'}`}>{value}</span>
    </li>
  );
}
