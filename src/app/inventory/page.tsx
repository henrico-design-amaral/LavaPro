import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listProducts } from '@/lib/queries';
import { formatBRL, formatQuantity } from '@/lib/format';
import { AdjustStockControl } from './adjust-control';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const products = await listProducts();
  const low = products.filter((p) => p.isLow);
  const ok = products.filter((p) => !p.isLow);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operação"
        title="Estoque"
        description="Produtos químicos e materiais. A baixa é automática ao concluir ordens, e o ajuste manual está sempre disponível."
      />

      {low.length > 0 && (
        <Card
          padding="md"
          title={`${low.length} ${low.length === 1 ? 'produto em alerta' : 'produtos em alerta'}`}
          subtitle="Estoque igual ou abaixo do mínimo"
        >
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {low.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 rounded-2xl border border-signal-warn/30 bg-signal-warn/[0.06] px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-50">{p.name}</p>
                  <p className="text-[11px] text-ink-300">
                    atual <span className="num text-signal-warn">{formatQuantity(p.currentStock)} {p.unit}</span> · mínimo {formatQuantity(p.minStock)} {p.unit}
                  </p>
                </div>
                <Badge tone="warn" dot>baixo</Badge>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card title="Todos os produtos" subtitle="Estoque atual, mínimo e uso nos últimos 30 dias" padding="md">
        <ul className="divide-y divide-white/[0.04]">
          {[...low, ...ok].map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-sm font-medium text-ink-50">{p.name}</p>
                  {p.isLow && <Badge tone="warn" dot>baixo</Badge>}
                  {!p.active && <Badge tone="neutral">inativo</Badge>}
                </div>
                <p className="mt-0.5 text-[11px] text-ink-400">
                  custo unitário {formatBRL(p.unitCost)} · {p.serviceCount} {p.serviceCount === 1 ? 'serviço usa' : 'serviços usam'}
                </p>
              </div>
              <div className="text-right">
                <p className="num text-sm font-semibold text-ink-50">
                  {formatQuantity(p.currentStock)} <span className="text-[11px] font-normal text-ink-400">{p.unit}</span>
                </p>
                <p className="text-[11px] text-ink-400">mínimo {formatQuantity(p.minStock)}</p>
              </div>
              <div className="text-right">
                <p className="num text-sm font-medium text-ink-200">{formatQuantity(p.last30Usage)}</p>
                <p className="text-[11px] text-ink-400">usados · 30d</p>
              </div>
              <AdjustStockControl productId={p.id} productName={p.name} unit={p.unit} />
            </li>
          ))}
        </ul>
      </Card>

      <div className="text-[11px] text-ink-500">
        <Button variant="ghost" size="sm" disabled>Histórico de movimentações · em breve</Button>
      </div>
    </div>
  );
}
