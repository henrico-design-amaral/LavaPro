import React from 'react';

type ServiceOrderStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface StatusPipelineTrackerProps {
  status: ServiceOrderStatus;
  onStatusChange?: (newStatus: ServiceOrderStatus) => void;
}

export function StatusPipelineTracker({ status, onStatusChange }: StatusPipelineTrackerProps) {
  const pipeline: ServiceOrderStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'];
  
  const getStatusColor = (current: ServiceOrderStatus, target: ServiceOrderStatus) => {
    if (status === 'CANCELLED') return 'bg-destructive text-destructive-foreground opacity-50';
    
    const currentIndex = pipeline.indexOf(current);
    const targetIndex = pipeline.indexOf(target);
    
    if (targetIndex < currentIndex) return 'bg-primary text-primary-foreground';
    if (targetIndex === currentIndex) return 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2';
    return 'bg-muted text-muted-foreground';
  };

  const getLabel = (s: ServiceOrderStatus) => {
    switch(s) {
      case 'SCHEDULED': return 'Agendado';
      case 'IN_PROGRESS': return 'Em Execução';
      case 'COMPLETED': return 'Finalizado';
      case 'CANCELLED': return 'Cancelado';
      default: return s;
    }
  };

  return (
    <div className="w-full flex items-center justify-between p-4 bg-card border rounded-lg shadow-sm">
      <div className="flex flex-1 items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full" />
        
        {pipeline.map((stage) => (
          <button
            key={stage}
            disabled={status === 'CANCELLED' || !onStatusChange}
            onClick={() => onStatusChange?.(stage)}
            className={`relative z-10 flex flex-col items-center gap-2 group`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${getStatusColor(status, stage)}`}>
              {pipeline.indexOf(stage) + 1}
            </div>
            <span className="text-sm font-medium">{getLabel(stage)}</span>
          </button>
        ))}
      </div>
      
      {status === 'CANCELLED' && (
        <div className="ml-8 px-4 py-2 bg-destructive/10 text-destructive rounded-md font-medium">
          Cancelado
        </div>
      )}
    </div>
  );
}
