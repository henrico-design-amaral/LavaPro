import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/ui/metric-card';
import { Badge } from '@/components/ui/badge';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { getDailyReport } from '@/lib/queries';
import { formatBRL, formatPercent, formatQuantity } from '@/lib/format';
import { formatDate } from '@/lib/datetime';

export const dynamic = 'force-dynamic';

export default async function ReportsPage({ searchParams }: { searchParams?: { date?: string } }) {
  const date = searchParams?.date ? new Date(searchParams.date) : new Date();
  const report = await getDailyReport(date);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fechamento"
        title="Relatório diário"
        description={<>Resumo do dia <span className="text-ink-200">{formatDate(report.date)}</span> · receita, custo estimado, margem e mix de serviços.</>}
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Receita"
          value={formatBRL(report.revenue)}
          hint={`${report.ordersCompleted} ordens concluídas`}
          tone="accent"
          size="lg"
        />
        <MetricCard
          label="Custo estimado"
          value={formatBRL(report.cost)}
          hint="Consumo de produtos químicos"
          tone="warn"
        />
        <MetricCard
          label="Margem bruta"
          value={formatBRL(report.margin)}
          hint={formatPercent(report.marginPct)}
          tone={report.marginPct >= 0.45 ? 'ok' : report.marginPct >= 0.25 ? 'warn' : 'bad'}
        />
        <MetricCard
          label="Ticket médio"
          value={formatBRL(report.ticketAverage)}
          hint="por ordem concluída"
        />
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Mix de serviços"
          subtitle="Serviços executados hoje e receita associada"
          padding="md"
        >
          {report.byService.length === 0 ? (
            <p className="text-sm text-ink-300">Sem serviços concluídos hoje.</p>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>Serviço</TH>
                  <TH className="text-right">Quantidade</TH>
                  <TH className="text-right">Receita</TH>
                </TR>
              </THead>
              <TBody>
                {report.byService.map((s) => (
                  <TR key={s.name}>
                    <TD>
                      <div className="flex items-center gap-2">
                        <span className="text-ink-50">{s.name}</span>
                        {s === report.byService[0] && <Badge tone="accent">mais vendido</Badge>}
                      </div>
                    </TD>
                    <TD className="text-right">
                      <span className="num text-ink-100">{s.quantity}</span>
                    </TD>
                    <TD className="text-right">
                      <span className="num font-semibold text-ink-50">{formatBRL(s.revenue)}</span>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Card>

        <Card
          title="Alertas de estoque"
          subtitle="Itens que precisam de reposição"
          padding="md"
        >
          {report.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink-300">Nenhum item abaixo do mínimo.</p>
          ) : (
            <ul className="space-y-2">
              {report.lowStockProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-2 rounded-xl border border-signal-warn/20 bg-signal-warn/[0.05] px-3 py-2">
                  <p className="truncate text-sm text-ink-100">{p.name}</p>
                  <p className="font-mono text-[11px] text-signal-warn">
                    {formatQuantity(p.currentStock)}/{formatQuantity(p.minStock)} {p.unit}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        title="Resumo executivo"
        subtitle="O que esses números dizem"
        padding="md"
      >
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Velocidade</p>
            <p className="mt-1 text-sm text-ink-100">
              {report.ordersCompleted === 0
                ? 'Nenhuma ordem fechada hoje.'
                : `${report.ordersCompleted} ${report.ordersCompleted === 1 ? 'ordem fechada' : 'ordens fechadas'}, ticket médio de ${formatBRL(report.ticketAverage)}.`}
            </p>
          </li>
          <li className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Saúde da margem</p>
            <p className="mt-1 text-sm text-ink-100">
              {report.revenue === 0
                ? 'Sem receita para calcular.'
                : report.marginPct >= 0.45
                ? 'Margem saudável. Mantenha o padrão.'
                : report.marginPct >= 0.25
                ? 'Margem aceitável. Revise custos de produtos.'
                : 'Margem apertada. Priorize revisar mix e fornecedores.'}
            </p>
          </li>
          <li className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-400">Estoque</p>
            <p className="mt-1 text-sm text-ink-100">
              {report.lowStockProducts.length === 0
                ? 'Tudo dentro do mínimo.'
                : `${report.lowStockProducts.length} ${report.lowStockProducts.length === 1 ? 'item precisa de reposição' : 'itens precisam de reposição'}.`}
            </p>
          </li>
        </ul>
      </Card>
    </div>
  );
}
