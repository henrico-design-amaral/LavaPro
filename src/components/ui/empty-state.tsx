import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface Props {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-10 text-center', className)}>
      {icon && (
        <div className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.04] text-ink-200">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-ink-50">{title}</p>
        {description && <p className="mt-1 text-xs text-ink-300">{description}</p>}
      </div>
      {action}
    </div>
  );
}
