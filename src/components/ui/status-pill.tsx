import { ORDER_STATUS_LABEL, type OrderStatus } from '@/lib/types';
import { Badge } from './badge';

const TONE: Record<OrderStatus, 'warn' | 'info' | 'ok' | 'bad'> = {
  QUEUED: 'warn',
  IN_PROGRESS: 'info',
  COMPLETED: 'ok',
  CANCELLED: 'bad',
};

const PULSE: Record<OrderStatus, boolean> = {
  QUEUED: false,
  IN_PROGRESS: true,
  COMPLETED: false,
  CANCELLED: false,
};

export function StatusPill({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <Badge tone={TONE[status]} dot className={className}>
      <span className={PULSE[status] ? 'relative inline-flex h-1.5 w-1.5' : ''}>
        {PULSE[status] && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-info opacity-60" />
        )}
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" />
      </span>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
