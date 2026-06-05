import { cn } from '@/lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-all duration-200 ease-out ' +
  'disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap ' +
  'rounded-full active:scale-[0.98]';

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
};

const variants: Record<Variant, string> = {
  primary:
    'bg-ink-50 text-ink-950 hover:bg-white shadow-soft-sm hover:shadow-soft-md',
  secondary:
    'bg-white/[0.04] text-ink-50 hover:bg-white/[0.07] border border-white/10',
  ghost:
    'bg-transparent text-ink-200 hover:bg-white/[0.05] border border-transparent',
  danger:
    'bg-signal-bad/15 text-signal-bad hover:bg-signal-bad/25 border border-signal-bad/30',
  success:
    'bg-signal-ok/15 text-signal-ok hover:bg-signal-ok/25 border border-signal-ok/30',
};

export function Button({
  variant = 'primary',
  size = 'md',
  leading,
  trailing,
  className,
  children,
  ...props
}: Props) {
  return (
    <button {...props} className={cn(base, sizes[size], variants[variant], className)}>
      {leading}
      <span>{children}</span>
      {trailing}
    </button>
  );
}
