import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { NewVehicleForm } from './form';
import { getCustomerDetail } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function NewVehiclePage({ params }: { params: { id: string } }) {
  const customer = await getCustomerDetail(params.id);
  if (!customer) notFound();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={`Cliente · ${customer.name}`}
        title="Adicionar veículo"
        description="O tamanho do veículo define o fator de consumo de produtos em cada serviço."
      />
      <Card padding="lg">
        <NewVehicleForm customerId={customer.id} />
      </Card>
    </div>
  );
}
