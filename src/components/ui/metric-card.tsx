import { cn } from '@/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

interface MetricProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  hint?: ReactNode;
  tone?: 'default' | 'ok' | 'warn' | 'bad' | 'accent';
  size?: 'md' | 'lg';
  trailing?: ReactNode;
}

const toneClass: Record<NonNullable<MetricProps['tone']>, string> = {
  default: 'text-ink-50',
  ok: 'text-signal-ok',
  warn: 'text-signal-warn',
  bad: 'text-signal-bad',
  accent: 'text-accent-300',
};

export function MetricCard({
  label,
  value,
  delta,
  hint,
  tone = 'default',
  size = 'md',
  trailing,
  className,
  ...rest
}: MetricProps) {
  return (
    <div
      {...rest}
      className={cn(
        'surface flex flex-col gap-2 p-5 transition-colors duration-300',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-ink-400">
          {label}
        </span>
        {trailing}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'num font-semibold tracking-tightest',
            size === 'lg' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl',
            toneClass[tone],
          )}
        >
          {value}
        </span>
        {delta && <span className="text-xs text-ink-300">{delta}</span>}
      </div>
      {hint && <div className="text-xs text-ink-400">{hint}</div>}
    </div>
  );
}
