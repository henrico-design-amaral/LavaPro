import React from 'react';
import { WhatsAppButton } from '../shared/WhatsAppButton';

interface CustomerSummaryPanelProps {
  customer: {
    id: string;
    name: string;
    phone?: string | null;
    email?: string | null;
    document?: string | null;
  };
  serviceStatus?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export function CustomerSummaryPanel({ customer, serviceStatus }: CustomerSummaryPanelProps) {
  const isCompleted = serviceStatus === 'COMPLETED';
  
  const whatsappMessage = isCompleted 
    ? `Olá ${customer.name}! Seu veículo acabou de ser finalizado e já está liberado para retirada.`
    : `Olá ${customer.name}! Iniciamos o serviço no seu veículo. Avisaremos assim que estiver concluído!`;

  return (
    <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-muted-foreground block">Name</span>
          <p className="font-medium">{customer.name}</p>
        </div>
        
        {customer.document && (
          <div>
            <span className="text-sm text-muted-foreground block">Document</span>
            <p className="font-medium">{customer.document}</p>
          </div>
        )}

        {customer.phone && (
          <div className="pt-4 mt-4 border-t">
            <span className="text-sm text-muted-foreground block mb-2">Contact</span>
            <div className="flex items-center gap-4">
              <span className="font-medium">{customer.phone}</span>
              <WhatsAppButton 
                phone={customer.phone} 
                message={whatsappMessage} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
