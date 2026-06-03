import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listServiceTypes } from '@/lib/queries';
import { formatBRL } from '@/lib/format';
import { formatDuration } from '@/lib/datetime';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await listServiceTypes();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Serviços"
        description="Catálogo de serviços e produtos consumidos por tipo de veículo. Os preços e regras aqui alimentam a fila e o relatório diário."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {services.map((s) => (
          <Card
            key={s.id}
            padding="md"
            title={
              <div className="flex items-center gap-2">
                <span>{s.name}</span>
                {!s.active && <Badge tone="neutral">inativo</Badge>}
              </div>
            }
            subtitle={s.description ?? undefined}
            trailing={
              <div className="text-right">
                <p className="num text-lg font-semibold text-ink-50">{formatBRL(s.basePrice)}</p>
                <p className="text-[11px] text-ink-400">{formatDuration(s.durationMin)}</p>
              </div>
            }
          >
            <div className="mt-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Produtos consumidos</p>
              {s.productUsages.length === 0 ? (
                <p className="mt-1 text-xs text-ink-400">Nenhum produto vinculado.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {s.productUsages.map((u) => (
                    <li key={u.id} className="flex items-center justify-between gap-2 text-[11px]">
                      <span className="truncate text-ink-200">{u.product.name}</span>
                      <span className="font-mono text-ink-400">
                        {u.baseQuantity.toFixed(2)} {u.product.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[11px] text-ink-400">
                {s._count.orderItems} {s._count.orderItems === 1 ? 'execução registrada' : 'execuções registradas'}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
