import { cn } from '@/lib/cn';
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="surface overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table {...props} className={cn('w-full text-left text-sm', className)} />
      </div>
    </div>
  );
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      {...props}
      className={cn(
        'border-b border-white/5 bg-white/[0.015] text-[11px] uppercase tracking-wider text-ink-400',
        className,
      )}
    />
  );
}

export function TBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cn('divide-y divide-white/[0.04]', className)} />;
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} className={cn('transition-colors hover:bg-white/[0.02]', className)} />;
}

export function TH({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={cn('px-4 py-3 font-medium', className)} />;
}

export function TD({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn('px-4 py-3 align-middle text-ink-100', className)} />;
}
