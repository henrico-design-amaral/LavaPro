import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type Tone = 'neutral' | 'info' | 'ok' | 'warn' | 'bad' | 'accent';

const styles: Record<Tone, string> = {
  neutral: 'bg-white/[0.04] text-ink-200 border-white/10',
  info: 'bg-signal-info/12 text-signal-info border-signal-info/30',
  ok: 'bg-signal-ok/12 text-signal-ok border-signal-ok/30',
  warn: 'bg-signal-warn/12 text-signal-warn border-signal-warn/30',
  bad: 'bg-signal-bad/12 text-signal-bad border-signal-bad/30',
  accent: 'bg-accent-soft text-accent-300 border-accent-500/30',
};

interface Props {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
  size?: 'sm' | 'md';
}

const dotMap: Record<Tone, string> = {
  neutral: 'bg-ink-200',
  info: 'bg-signal-info',
  ok: 'bg-signal-ok',
  warn: 'bg-signal-warn',
  bad: 'bg-signal-bad',
  accent: 'bg-accent-400',
};

export function Badge({ tone = 'neutral', children, className, dot, size = 'sm' }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        styles[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotMap[tone])} />}
      {children}
    </span>
  );
}
