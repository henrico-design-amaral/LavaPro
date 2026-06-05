import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { getCustomerDetail } from '@/lib/queries';
import { formatBRL } from '@/lib/format';
import { formatDateTime } from '@/lib/datetime';
import { VEHICLE_SIZE_LABEL } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = await getCustomerDetail(params.id);
  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cliente"
        title={customer.name}
        description={
          <span className="flex flex-wrap items-center gap-2 text-ink-300">
            <span>{customer.phone}</span>
            {customer.email && (
              <>
                <span className="text-ink-600">·</span>
                <span>{customer.email}</span>
              </>
            )}
          </span>
        }
        actions={
          <Link href="/customers">
            <Button variant="ghost" size="md">← Voltar</Button>
          </Link>
        }
      />

      <Card
        title="Veículos"
        subtitle={`${customer.vehicles.length} ${customer.vehicles.length === 1 ? 'veículo vinculado' : 'veículos vinculados'}`}
        trailing={
          <Link href={`/customers/${customer.id}/vehicles/new`}>
            <Button variant="primary" size="sm">+ Adicionar veículo</Button>
          </Link>
        }
      >
        {customer.vehicles.length === 0 ? (
          <EmptyState
            title="Sem veículos"
            description="Cadastre o primeiro veículo deste cliente para abrir ordens."
            action={
              <Link href={`/customers/${customer.id}/vehicles/new`}>
                <Button variant="primary" size="sm">Cadastrar veículo</Button>
              </Link>
            }
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {customer.vehicles.map((v) => (
              <li key={v.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-mono text-sm font-semibold text-ink-50">{v.plate}</p>
                  <Badge tone="neutral">{VEHICLE_SIZE_LABEL[v.size as keyof typeof VEHICLE_SIZE_LABEL] ?? v.size}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-200">{v.brand} {v.model}</p>
                <p className="text-[11px] text-ink-400">cor {v.color}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Histórico" subtitle={`${customer.serviceOrders.length} ordens mais recentes`} padding="md">
        {customer.serviceOrders.length === 0 ? (
          <EmptyState title="Sem histórico" description="As ordens deste cliente aparecerão aqui." />
        ) : (
          <ul className="divide-y divide-white/[0.04]">
            {customer.serviceOrders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusPill status={o.status as 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'} />
                    <span className="font-mono text-[11px] text-ink-400">{o.vehicle.plate}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-ink-200">
                    {o.items.map((i) => i.serviceType.name).join(' · ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="num text-sm font-semibold text-ink-50">{formatBRL(o.totalPrice)}</p>
                  <p className="text-[11px] text-ink-400">{formatDateTime(o.queuedAt)}</p>
                </div>
                <Link href={`/orders/${o.id}`} className="ml-2 text-[11px] font-medium text-accent-300 hover:text-accent-200">
                  Abrir →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
