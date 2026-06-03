'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const NAV = [
  { href: '/', label: 'Painel', short: 'PA' },
  { href: '/queue', label: 'Fila', short: 'FI' },
  { href: '/orders', label: 'Ordens', short: 'OR' },
  { href: '/customers', label: 'Clientes', short: 'CL' },
  { href: '/services', label: 'Serviços', short: 'SV' },
  { href: '/inventory', label: 'Estoque', short: 'ES' },
  { href: '/reports', label: 'Relatório', short: 'RE' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 text-ink-950 shadow-soft-sm">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12c2-5 6-8 9-8s7 3 9 8c-2 5-6 8-9 8s-7-3-9-8Z" />
                <circle cx="12" cy="12" r="2.6" />
              </svg>
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-ink-50">
              LavaPro
            </span>
            <span className="hidden rounded-full border border-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-400 sm:inline">
              MVP
            </span>
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative inline-flex h-8 items-center rounded-full px-3 text-xs font-medium tracking-tight transition-colors',
                        active
                          ? 'bg-white/[0.06] text-ink-50'
                          : 'text-ink-300 hover:bg-white/[0.04] hover:text-ink-50',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-ink-200 sm:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-signal-ok" />
              Offline-first
            </span>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      <nav aria-label="Principal (mobile)" className="md:hidden">
        <div className="border-b border-white/[0.06] bg-ink-950/80 backdrop-blur">
          <ul className="flex items-center gap-0.5 overflow-x-auto px-2 py-1.5">
            {NAV.map((item) => {
              const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={cn(
                      'inline-flex h-8 items-center rounded-full px-3 text-[11px] font-medium tracking-tight transition-colors',
                      active
                        ? 'bg-white/[0.06] text-ink-50'
                        : 'text-ink-300 hover:bg-white/[0.04] hover:text-ink-50',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-white/[0.06] py-6 text-center text-[11px] text-ink-500">
        LavaPro · Cockpit operacional · Validação MVP local
      </footer>
    </div>
  );
}
