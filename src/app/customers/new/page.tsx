import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { NewCustomerForm } from './form';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Novo"
        title="Cadastrar cliente"
        description="O cadastro é simples e local. Você poderá adicionar veículos depois."
      />
      <Card padding="lg">
        <NewCustomerForm />
      </Card>
    </div>
  );
}
