# Field Test Script

> 5-day field pilot · one lava-jato · one operator · one device
>
> Goal: validate that LavaPro, in its current offline-first MVP form, supports
> a real workday end to end — order intake, queue progress, stock
> consumption, and daily reporting — without any cloud dependency.

## Before day 1 (setup, ~30 min)

1. Pick a target device.
   - Laptop, mini-PC, or tablet with a stable keyboard. Touch-only is not the
     primary input mode in this MVP.
   - Windows, macOS, or Linux — anything that runs Node 18+ and Chromium.
2. Clone the repo at the `rebuild/offline-first-mvp` branch.
3. Install dependencies: `npm install`.
4. Initialize the database: `npm run db:push`.
5. Seed the demo data: `npm run db:seed`.
6. Start the app: `npm run dev` and open `http://localhost:3000`.
7. Smoke test the 9 routes in the smoke matrix below. Spend 5 min clicking
   through each. If any route is empty or broken, stop and file a bug.
8. Take a full backup of `prisma/dev.db` and store it in a folder named
   `backups/dia-0`. This is the baseline.

### Smoke matrix (5 min)

| Route           | Expect to see                                                                                  |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `/`             | Dashboard with metrics, queue summary, low-stock list.                                         |
| `/queue`        | 4 lanes (Na fila, Em execução, Concluído, Cancelado) with seeded orders.                       |
| `/orders`       | List of recent orders.                                                                         |
| `/orders/new`   | Form: customer, vehicle, service plan, notes.                                                  |
| `/customers`    | List of seeded customers.                                                                      |
| `/customers/new`| Form to register a customer.                                                                   |
| `/services`     | List of seeded services with size + price.                                                     |
| `/inventory`    | All products, low-stock callout at top if any, "Últimas movimentações" table at the bottom.    |
| `/reports`      | Daily report for today. If no orders concluded today, the report shows zeros with a clean empty mix. |

---

## Daily routine (5–10 min start of day, 5 min end of day)

### Start of day (5 min)

1. Start the dev server (`npm run dev`).
2. Open `/queue` and verify it loads.
3. Open `/inventory` and look at the **Últimas movimentações** table.
   - The most recent rows should be yesterday's completed orders (USAGE).
4. Note any low-stock product on a piece of paper or in the laptop's notes app.

### End of day (5 min)

1. Make sure every order from the day is in a terminal state
   (Concluído or Cancelado). The queue should not have stale "Em execução"
   rows.
2. Open `/reports?date=TODAY` and capture:
   - Receita (revenue)
   - Custo estimado (cost)
   - Margem bruta (margin)
   - Ticket médio
3. Take a fresh backup of `prisma/dev.db` to `backups/dia-N/dev.db` where `N`
   is the day number.
4. **Do not delete** the previous day's backup until the 5-day pilot is over.

---

## Day 1 — Warm-up + data seeding

Goal: exercise the full happy path with the operator, then reset and re-seed.

1. Ask the operator to describe their current day in their own words. Note it.
2. Walk through these flows with the operator watching:
   - **Register a real customer** at `/customers/new`.
   - **Register a real vehicle** for that customer (the new-customer flow does
     this inline; if the customer already exists, go to the customer detail
     page if it exists, otherwise use a fresh `/orders/new` flow).
   - **Open a new service order** at `/orders/new`. Pick the right service for
     the vehicle size.
   - **Move the order through the queue** on `/queue`: start, complete.
   - **Adjust stock manually** at `/inventory` for a product the operator
     just received (reason: Compra).
3. Open `/reports?date=TODAY` and walk the operator through every number.
4. After the operator is comfortable, **reset the database** to the seed:
   - Delete `prisma/dev.db`.
   - Run `npm run db:push` and `npm run db:seed` again.
5. Take a `backups/dia-1-reset` copy.

**Why reset on day 1**: the operator's first run is a learning run. We want
the real pilot data to start clean on day 2.

---

## Day 2 — First real shift

Goal: the operator uses LavaPro for the whole morning or whole afternoon
without you coaching.

1. Start of day backup.
2. Tell the operator:
   - "Treat LavaPro as the source of truth for orders and stock today."
   - "If anything feels wrong, just say it out loud — I'll write it down."
3. Stay nearby but do not help unless asked. Take notes on:
   - Where the operator hesitates.
   - What the operator does that the app does not expect.
   - Any time the operator reaches for a pen, paper, or external tool.
4. At end of day, capture:
   - `/reports?date=TODAY` numbers.
   - Notes on hesitations and workarounds.
   - The DB backup.
5. 15 min debrief: ask the operator to walk you through the day, then prompt
   with the questions in `USER_INTERVIEW_GUIDE.md` section "Same-day debrief".

---

## Day 3 — Same flow, with a "problem injection"

Goal: verify the app handles a realistic problem the operator will face.

Pick **one** of the following at the start of the day:

- **Stock out of nothing**: before opening, set the current stock of
  "Shampoo automotivo" to `0` via the manual adjust (reason: Perda) and tell
  the operator nothing. See whether the next order that uses it surfaces a
  problem.
- **Forgot to conclude**: leave one order in "Em execução" at end of yesterday,
  intentionally. See how the operator handles it at start of day.
- **Wrong service size picked**: ask the operator to walk through a specific
  case and notice if the size affects the price in a way that surprises them.

After the day, note:
- Did the operator notice the problem?
- Did the app help or hinder the resolution?
- Did any error message land clearly, or did the operator have to guess?

---

## Day 4 — Edge cases

Goal: probe the limits of the current MVP.

Ask the operator to try, in order, with a clear "this is just to see what
happens" framing:

1. Create an order, then immediately cancel it. (Covers the cancellation
   path and the no-stock-deduction rule.)
2. Try to complete an order with a quantity that exceeds stock for one of
   its plan items. (Covers the rollback path.)
3. Add a new product manually (note: there is no product-create UI yet — if
   this is requested, capture it as a gap, do not improvise a flow).
4. Try to register a customer with a duplicate name. (Note: the MVP does not
   dedupe by name; capture the operator's reaction.)
5. Open the daily report for **yesterday** and the day before via
   `/reports?date=YYYY-MM-DD`. Verify the report switches dates cleanly.

End-of-day backup and debrief as on day 2.

---

## Day 5 — End-to-end review

Goal: capture a final round of feedback and close the pilot cleanly.

1. Run the same flow as day 2, but ask the operator to use the app first
   thing in the morning and **last thing at night**.
2. End the day with the full **user interview** in
   `USER_INTERVIEW_GUIDE.md` (30 min, recorded with consent if possible).
3. Take the final backup to `backups/dia-5-final`.
4. Do **not** delete the database. The team will inspect it post-pilot.
5. Confirm with the operator when the laptop / device will be returned.

---

## What to capture during the pilot

Use a single shared note file (`pilot-notes.md` in the repo, not committed)
and log every entry in the same format:

```
[day N] [time] [observer] [category: bug|feedback|metric|surprise]
description of what happened
```

Categories:

- **bug**: reproducible incorrect behavior.
- **feedback**: operator preference or complaint, no bug.
- **metric**: anything we want to count (see `PILOT_METRICS.md`).
- **surprise**: an interaction we did not anticipate.

At the end of the pilot, this file becomes the primary input to the
post-pilot review.
