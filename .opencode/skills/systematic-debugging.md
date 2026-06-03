# Skill: systematic-debugging

When something fails in LavaPro, follow this protocol before guessing.

## 1. Reproduce

- Capture the exact inputs, the exact screen, and the exact order of actions.
- Run it twice. If it is intermittent, log the variance.
- If the error appears in production data, dump the row(s) involved.

## 2. Localize

- Stack trace → which file and which function.
- If no stack trace, bisect: split the flow in half and run each half independently.
- For UI issues: use the browser devtools to inspect the DOM, the network (when local), and the console.

## 3. Hypothesize

- Write down the top 2 hypotheses before checking the code.
- For each hypothesis, predict the symptom it would cause. Then check the code/data for the symptom.

## 4. Verify

- For SQL/Prisma: log the generated query and run it in `npx prisma studio` or via the SQLite CLI.
- For React/Next: read the server component's data flow end to end, not just the surface.
- For state bugs: print the props on the boundary, then move inward.

## 5. Fix at the right layer

- Don't paper over a data bug with a UI guard. Fix the data.
- Don't patch a UI bug in CSS when the component is rendering the wrong data. Fix the data.
- Add the smallest change that resolves the root cause.

## 6. Validate

- Reproduce the original failure → confirm it is gone.
- Run the typecheck (`npm run typecheck`) and the build (`npm run build`).
- For UI: re-test the entire flow on the affected screen.
- For data: re-run the seed and confirm counts are still right.

## 7. Record

- If the bug revealed a missing invariant, add a one-line invariant in code (e.g. `// Invariant: order.items cannot be empty for a non-cancelled order`).
- If the bug revealed a process gap, add a row to `docs/IMPLEMENTATION_LOG.md`.
- Never erase the trail.
