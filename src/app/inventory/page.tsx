import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { listProducts, listRecentStockMovements } from '@/lib/queries';
import { formatBRL, formatQuantity } from '@/lib/format';
import { formatDateTime } from '@/lib/datetime';
import { STOCK_REASON_LABEL, isStockReason } from '@/lib/types';
import { AdjustStockControl } from './adjust-control';

export const dynamic = 'force-dynamic';

const REASON_TONE: Record<string, 'info' | 'ok' | 'warn' | 'bad' | 'neutral'> = {
  INITIAL: 'info',
  USAGE: 'warn',
  PURCHASE: 'ok',
  ADJUSTMENT: 'neutral',
  WASTE: 'bad',
};

export default async function InventoryPage() {
  const [products, movements] = await Promise.all([
    listProducts(),
    listRecentStockMovements(30),
  ]);
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

      <Card
        title="Últimas movimentações"
        subtitle="Cada baixa automática de OS, compra, ajuste ou perda fica registrada aqui"
        padding="md"
      >
        {movements.length === 0 ? (
          <p className="text-sm text-ink-300">Nenhuma movimentação registrada ainda.</p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Quando</TH>
                <TH>Produto</TH>
                <TH>Motivo</TH>
                <TH className="text-right">Delta</TH>
                <TH>OS / nota</TH>
              </TR>
            </THead>
            <TBody>
              {movements.map((m) => {
                const reason = isStockReason(m.reason) ? m.reason : 'ADJUSTMENT';
                const reasonLabel = STOCK_REASON_LABEL[reason];
                const tone = REASON_TONE[reason] ?? 'neutral';
                return (
                  <TR key={m.id}>
                    <TD>
                      <span className="font-mono text-[11px] text-ink-300">{formatDateTime(m.createdAt)}</span>
                    </TD>
                    <TD>
                      <div className="min-w-0">
                        <p className="truncate text-ink-100">{m.productName}</p>
                        <p className="font-mono text-[10px] text-ink-500">{m.unit}</p>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={tone}>{reasonLabel}</Badge>
                    </TD>
                    <TD className="text-right">
                      <span
                        className={`num font-semibold ${
                          m.delta > 0 ? 'text-signal-ok' : m.delta < 0 ? 'text-signal-warn' : 'text-ink-300'
                        }`}
                      >
                        {m.delta > 0 ? '+' : ''}
                        {formatQuantity(m.delta)} {m.unit}
                      </span>
                    </TD>
                    <TD>
                      <div className="text-[11px]">
                        {m.reference && (
                          <p className="font-mono text-ink-400">OS {m.reference.slice(-6).toUpperCase()}</p>
                        )}
                        {m.note && <p className="text-ink-500">{m.note}</p>}
                        {!m.reference && !m.note && <span className="text-ink-500">—</span>}
                      </div>
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
