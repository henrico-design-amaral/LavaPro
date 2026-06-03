# Skill: accessibility-review

LavaPro is a small app, but it is an operational app used by people under time pressure. Accessibility is a quality gate, not an afterthought.

## Mandatory checklist

For every UI change, confirm:

- [ ] **Color contrast ≥ 4.5:1** for body text on its background.
- [ ] **Visible focus ring** on every interactive element (Tab through the page once before merging).
- [ ] **Color is not the only signal** for status (every status has a text label and a dot).
- [ ] **Forms** have `<label>` for every input, including selects and textareas.
- [ ] **Buttons** have descriptive text (not just icons). Icon-only buttons use `aria-label`.
- [ ] **Tables** have `<thead>` and `<tbody>` and a recognizable header row.
- [ ] **Lists** use `<ul>` and `<li>` semantically, not generic `<div>`s.
- [ ] **Headings** follow a strict order (no `h3` before `h1`).
- [ ] **Skip-targets**: main content is reachable by keyboard without traps.
- [ ] **Reduced motion** is respected via the global CSS media query.
- [ ] **Dialogs** use the native `<dialog>` element (not custom modals).
- [ ] **Form errors** are announced via `role="alert"`.
- [ ] **Empty states** describe what is missing and how to add it.

## Common issues to refuse

- `placeholder` as the only label.
- A `div` that "looks like" a button (no `<button>`, no keyboard handler).
- Status conveyed by background color only.
- Heading hierarchy broken (e.g. `h1` → `h3`).
- Click handlers on non-interactive elements (use a real button or link).
