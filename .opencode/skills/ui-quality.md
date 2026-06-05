# Skill: ui-quality

LavaPro's visual register is "operational cockpit". Use this skill to keep quality consistent across pages.

## Aesthetic intent

- Dark surface, deep neutral, slight cool tint. Never pure `#000000`.
- High contrast for data, low contrast for chrome.
- Premium automotive character: tight radii, monospaced numerics, hairline borders.
- Information density is welcome. White space carries hierarchy, not decoration.

## Color rules

- Background: `#070a10` (page) → `#0a0e16` (surface) → `#11151f` (card). Layered, not flat.
- Text: `#f5f6f8` (ink-50) for primary, `#9ba3b3` (ink-300) for muted, `#6b7388` (ink-400) for dim.
- Accent: cyan `#22d3ee` (water/clean). Use sparingly for active states and one or two highlights per screen.
- Status: green (ok), amber (warn), red (bad), blue (info). Only on status pills and traffic-light moments.

## Typography rules

- Sans system for body. No third-party web font in MVP.
- Monospace for numerics, plate, IDs, durations. Always with `font-variant-numeric: tabular-nums`.
- Display sizes: `text-2xl` to `text-4xl`. No hero size > `text-4xl` in operational UI.
- Sentence case. No all-caps body copy. Reserve uppercase for short labels (`NA FILA`, `EM EXECUÇÃO`).

## Component rules

- **Card**: surface, 1.25rem radius, hairline border, internal padding `p-5 sm:p-6`. No side-stripe accents.
- **Metric**: large number on the left, label above, hint below. No big colored gradient background.
- **Status pill**: small, with a leading dot, tone-coded (warn/info/ok/bad).
- **Button**: pill shape (`rounded-full`), three sizes, four tones (primary, secondary, ghost, danger/success).
- **Table**: surface card, hairline dividers, no zebra striping, hover row tint.

## Layout rules

- Asymmetric bento for the dashboard: revenue spans 2 cols, margin and cost are paired, etc.
- Status lanes on the queue page: `QUEUED` and `IN_PROGRESS` side by side, history below.
- Service list on the catalog page: `repeat(auto-fit, minmax(320px, 1fr))` so cards resize gracefully.

## Forbidden patterns

- No gradient text.
- No glassmorphism as a default surface treatment.
- No `border-left` accent on cards or list items.
- No identical card grids of 3 columns with icon + heading + text.
- No tiny uppercase eyebrow above every section heading.
- No emoji as UI icons.
- No bounce/elastic easing. Use `cubic-bezier(0.22, 0.61, 0.36, 1)` for entrances and standard ease-out for hover.

## Accessibility bars

- Body text contrast against surface: ≥ 4.5:1.
- Focus ring on every interactive element (2px accent-500 with 2px offset).
- Color is never the only carrier of meaning: status pill always has a text label and a dot.
- Reduced motion is respected (`@media (prefers-reduced-motion: reduce)`).
- Every form has `<label>` for every input.
