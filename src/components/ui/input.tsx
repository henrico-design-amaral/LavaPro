import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-xl border bg-white/[0.03] px-3.5 text-sm text-ink-50',
        'placeholder:text-ink-400/70',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40',
        invalid
          ? 'border-signal-bad/40 focus:ring-signal-bad/30 focus:border-signal-bad/40'
          : 'border-white/10 hover:border-white/20',
        className,
      )}
      {...props}
    />
  );
});

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[88px] w-full rounded-xl border bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink-50',
        'placeholder:text-ink-400/70',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40',
        'border-white/10 hover:border-white/20',
        className,
      )}
      {...props}
    />
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-10 w-full appearance-none rounded-xl border bg-white/[0.03] px-3.5 pr-9 text-sm text-ink-50',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40',
        'border-white/10 hover:border-white/20',
        "bg-[url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ba3b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")] bg-[right_0.75rem_center] bg-no-repeat",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export function Label({ children, htmlFor, hint, className }: { children: React.ReactNode; htmlFor?: string; hint?: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn('mb-1.5 flex items-center justify-between text-xs font-medium text-ink-200', className)}>
      <span>{children}</span>
      {hint && <span className="text-[11px] font-normal text-ink-400">{hint}</span>}
    </label>
  );
}

export function FieldGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col', className)}>{children}</div>;
}
