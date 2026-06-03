# 03 · Design system

> Ver `.opencode/skills/ui-quality.md` para a versão operacional. Esta nota é a referência de alto nível.

## Paleta

- **Page bg**: `#070a10` (ink-950)
- **Surface**: `#0a0e16` (ink-900)
- **Card**: `#11151f` (ink-800) → gradiente vertical sutil para `#0d111a`
- **Ink 50**: `#f5f6f8` (texto primário)
- **Ink 300**: `#9ba3b3` (muted)
- **Ink 400**: `#6b7388` (dim)
- **Accent**: `#22d3ee` (cyan-400)
- **Status ok**: `#10b981`
- **Status warn**: `#f59e0b`
- **Status bad**: `#ef4444`
- **Status info**: `#3b82f6`

Hairlines: `rgba(255,255,255,0.06)` para divisões; `rgba(255,255,255,0.10)` para bordas ativas.

## Tipografia

- Sans: stack do sistema (sem web font em MVP).
- Mono: `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` para numerics, placas, IDs, durações.
- `font-variant-numeric: tabular-nums` em qualquer sequência numérica.

## Hierarquia de tamanhos

- Display (h1): `text-2xl` (mobile) / `text-3xl` (desktop)
- Section title (h2): `text-base` ou `text-lg`
- Body: `text-sm`
- Hint / metadata: `text-xs` ou `text-[11px]`
- Eyebrow (label de seção): `text-[11px]` uppercase, tracking `[0.18em]`

## Componentes

- Card (surface, hairline, radius 1.25rem, padding 5–6)
- Metric (label + big number + hint, sem gradient)
- StatusPill (dot + label, tone-coded)
- Button (pill, 3 sizes, 5 variants)
- Table (surface, hairline dividers, hover tint)
- EmptyState (dashed border, icon opcional, ação)

## Layouts

- Dashboard: bento assimétrico, 4 colunas em desktop.
- Fila: 2 lanes ativas no topo, histórico embaixo.
- Catálogo: `repeat(auto-fit, minmax(320px, 1fr))`.
- Tabelas: header fixo, linhas com hover.
- Mobile: tudo colapsa para stack vertical com `px-4 py-6`.

## Movimento

- Entrada de cards: `fade-up` 480ms `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- Hover: 200ms ease-out em cor e transform.
- Reduced motion: zero animação (ver `globals.css`).
- Pulse em `StatusPill` para `IN_PROGRESS` (dot pulsando).

## Acessibilidade

- Foco visível (2px accent-500 com offset 2px).
- Contraste body ≥ 4.5:1.
- Cor nunca é o único sinal de status.
- `prefers-reduced-motion: reduce` honrado.
- Form errors com `role="alert"`.
