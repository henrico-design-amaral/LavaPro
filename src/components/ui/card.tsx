import { cn } from '@/lib/cn';
import type { HTMLAttributes, ReactNode } from 'react';

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'>;

interface Props extends DivProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const padMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({ children, title, subtitle, trailing, className, padding = 'md', ...rest }: Props) {
  return (
    <div
      {...rest}
      className={cn('surface relative overflow-hidden', padMap[padding], className)}
    >
      {(title || trailing) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold tracking-tight text-ink-50">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-ink-300">{subtitle}</p>
            )}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
