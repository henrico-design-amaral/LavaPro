# Skill: ux-heuristics

LavaPro applies Nielsen's 10 usability heuristics to its operational cockpit. Use this checklist when designing, reviewing, or shipping UI changes.

## Heuristics in practice

### 1. Visibility of system status
- Always show the order's current status with a clear pill (`Na fila`, `Em execução`, `Concluído`, `Cancelado`).
- Show elapsed time on every active order.
- Show low-stock counts on the dashboard before the user opens inventory.

### 2. Match between system and the real world
- Use operator language: `Ordem`, `Fila`, `Cliente`, `Veículo`, `Placa`, `Tamanho`.
- Avoid internal jargon: `resource`, `entity`, `record`, `entry`.
- Money, dates, and times in `pt-BR` (`R$ 1.234,56`, `dd/MM/yyyy HH:mm`).

### 3. User control and freedom
- A `Cancelar` action exists for orders that are not yet concluded.
- Navigation has a clear "← Voltar" pattern in detail pages.
- The form for `Nova ordem` allows inline customer/vehicle creation without losing progress.

### 4. Consistency and standards
- The same status pill on dashboard, queue, and detail.
- The same metric card pattern on dashboard and reports.
- The same form fields for customer/vehicle creation everywhere.

### 5. Error prevention
- Required fields validated before submit.
- Destructive actions (`Cancelar ordem`) require an explicit confirm.
- Manual stock adjustments validate that `delta !== 0` before save.

### 6. Recognition rather than recall
- Customer and vehicle shown by name and plate, not by ID.
- Recent orders visible on the customer detail page.
- Service products shown in the order detail so the operator sees what was applied.

### 7. Flexibility and efficiency of expertise
- Inline creation of customer and vehicle from the new-order form.
- One-click status transitions (`Iniciar`, `Concluir`).
- Keyboard navigation works on every form.

### 8. Aesthetic and minimalist design
- Dark, calm, dense, no decoration. Information density is a feature in this register.
- Numerics are tabular and prominent; metadata is small and quiet.
- No "kicker" uppercase eyebrow above every section.

### 9. Help users recognize, diagnose, and recover from errors
- Inline error messages on form fields, not modals or toasts.
- Stock adjustment errors are visible next to the form, not lost.
- "Falha ao criar cliente" tells the user what failed.

### 10. Help and documentation
- A help badge `MVP` is visible in the header to remind the operator they are on the local validation build.
- The README points to docs/MVP_SCOPE and docs/VALIDATION_PLAN.

## Heuristic self-review

Before shipping a UI change, score it 0–2 per heuristic:

- 0 = not considered
- 1 = addressed but weak
- 2 = addressed strongly

If the total is below 14, refine. If below 10, redesign.
