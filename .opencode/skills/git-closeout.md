# Skill: git-closeout

Closeout protocol for LavaPro. Run before finishing any session that touched code or docs.

## 1. Status check

```bash
git status -sb
git branch --show-current
```

- Confirm the branch matches the scope.
- Confirm there are no untracked files in ignored directories (e.g. `node_modules/`, `.next/`, `prisma/dev.db`).

## 2. Diff inspection

```bash
git diff --stat
```

- Read each line of the diff for the files you touched. Not just the stats.
- For schema changes, also re-read the schema file end to end.
- For seed changes, run `npm run db:reset` locally and confirm counts.

## 3. Atomic commit

- One commit per scope. Never mix "fix bug" with "add new screen".
- Commit message: `<type>: <subject>` in lower case, present tense, max 72 chars.
  - `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`, `style:`
- Body: one paragraph with the why, the what, and any trade-offs.

## 4. Never push without explicit authorization

- LavaPro local validation does not require pushing.
- If pushing is requested, confirm before running `git push`.
- Never run `git push --force`, `git reset --hard`, or `git clean -fd`.

## 5. Update governance

- Append a session entry to `PROJECT_CONTROL.md` (date, branch, scope, files, validations, pending).
- If a new architectural decision was made, add a row to `docs/PRODUCT_DECISIONS.md`.

## 6. Handoff

- Reply with:
  - Branch
  - Commit hash
  - Files touched
  - Validations executed
  - Known limitations
  - Suggested next step
