import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { listCustomers, listServiceTypes } from '@/lib/queries';
import { NewOrderForm } from './form';

export const dynamic = 'force-dynamic';

export default async function NewOrderPage() {
  const [customers, serviceTypes] = await Promise.all([listCustomers(), listServiceTypes()]);
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Nova"
        title="Abrir ordem de serviço"
        description="Selecione cliente, veículo e os serviços contratados. O custo será calculado na conclusão."
      />
      <Card padding="lg">
        <NewOrderForm
          customers={customers.map((c) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            vehicles: c.vehicles.map((v) => ({
              id: v.id,
              plate: v.plate,
              brand: v.brand,
              model: v.model,
              color: v.color,
              size: v.size,
            })),
          }))}
          services={serviceTypes.map((s) => ({
            id: s.id,
            name: s.name,
            basePrice: s.basePrice,
            durationMin: s.durationMin,
            description: s.description,
          }))}
        />
      </Card>
    </div>
  );
}
