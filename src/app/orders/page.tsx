import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import { EmptyState } from '@/components/ui/empty-state';
import { listOrders } from '@/lib/queries';
import { formatBRL } from '@/lib/format';
import { formatDateTime } from '@/lib/datetime';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Ordens de serviço"
        description="Histórico completo de ordens. Filtre, abra, conclua ou cancele."
        actions={
          <Link href="/orders/new">
            <Button variant="primary" size="md">Nova ordem</Button>
          </Link>
        }
      />

      <Card padding="none">
        {orders.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Nenhuma ordem cadastrada"
              description="Crie a primeira ordem do dia para começar."
              action={
                <Link href="/orders/new">
                  <Button variant="primary" size="sm">Nova ordem</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Cliente</TH>
                <TH>Veículo</TH>
                <TH>Status</TH>
                <TH className="text-right">Valor</TH>
                <TH>Quando</TH>
                <TH className="text-right">Ações</TH>
              </TR>
            </THead>
            <TBody>
              {orders.map((o) => (
                <TR key={o.id}>
                  <TD>
                    <div>
                      <p className="font-medium text-ink-50">{o.customer.name}</p>
                      <p className="text-[11px] text-ink-400">{o.customer.phone}</p>
                    </div>
                  </TD>
                  <TD>
                    <div>
                      <p className="text-ink-100">{o.vehicle.brand} {o.vehicle.model}</p>
                      <p className="font-mono text-[11px] text-ink-400">{o.vehicle.plate}</p>
                    </div>
                  </TD>
                  <TD>
                    <StatusPill status={o.status} />
                  </TD>
                  <TD className="text-right">
                    <span className="num font-semibold text-ink-50">{formatBRL(o.totalPrice)}</span>
                  </TD>
                  <TD>
                    <div className="text-[11px]">
                      <p className="text-ink-200">{formatDateTime(o.queuedAt)}</p>
                      {o.completedAt && (
                        <p className="text-ink-400">concluída {formatDateTime(o.completedAt)}</p>
                      )}
                    </div>
                  </TD>
                  <TD className="text-right">
                    <Link href={`/orders/${o.id}`}>
                      <Button variant="ghost" size="sm">Abrir</Button>
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>

      <div className="text-[11px] text-ink-500">
        <Badge tone="neutral">{orders.length}</Badge>
        <span className="ml-2">ordens listadas · limite de 200</span>
      </div>
    </div>
  );
}
