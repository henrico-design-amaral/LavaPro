import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { listCustomers } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Base"
        title="Clientes"
        description={`${customers.length} ${customers.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}. Cada cliente pode ter um ou mais veículos vinculados.`}
        actions={
          <Link href="/customers/new">
            <Button variant="primary" size="md">Novo cliente</Button>
          </Link>
        }
      />

      <Card padding="none">
        {customers.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Nenhum cliente cadastrado"
              description="Comece cadastrando seu primeiro cliente."
              action={
                <Link href="/customers/new">
                  <Button variant="primary" size="sm">Novo cliente</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Nome</TH>
                <TH>Telefone</TH>
                <TH className="text-right">Veículos</TH>
                <TH className="text-right">Ordens</TH>
                <TH className="text-right">Ações</TH>
              </TR>
            </THead>
            <TBody>
              {customers.map((c) => (
                <TR key={c.id}>
                  <TD>
                    <div>
                      <p className="font-medium text-ink-50">{c.name}</p>
                      {c.email && <p className="text-[11px] text-ink-400">{c.email}</p>}
                    </div>
                  </TD>
                  <TD>
                    <span className="text-ink-200">{c.phone}</span>
                  </TD>
                  <TD className="text-right">
                    <span className="num text-ink-100">{c.vehicles.length}</span>
                  </TD>
                  <TD className="text-right">
                    <span className="num text-ink-100">{c._count.serviceOrders}</span>
                  </TD>
                  <TD className="text-right">
                    <Link href={`/customers/${c.id}`}>
                      <Button variant="ghost" size="sm">Abrir</Button>
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
