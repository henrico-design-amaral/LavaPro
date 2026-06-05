# Pilot Metrics

> What to measure during the 5-day pilot · how to measure it · what "good"
> looks like.
>
> These metrics are deliberately small. We are validating a workflow, not
> running an A/B test.

## Source of truth

All metrics are derived from the SQLite database (`prisma/dev.db`) at the end
of each pilot day, plus the observer's notes (`pilot-notes.md`). Do not
invent new metrics during the pilot. If a question needs a new metric, write
it down as a hypothesis and decide after the pilot.

## How to extract daily numbers

For each pilot day, the observer runs a short query script (or opens
`prisma/dev.db` in a SQLite browser) and captures:

- Total orders created.
- Orders by terminal status (Concluído / Cancelado).
- Orders by service.
- Total revenue (sum of `totalPrice` on `ServiceOrder` or `priceAtTime * quantity` on `ServiceOrderItem` for orders concluded that day, in BRL).
- Total estimated cost (sum of `totalCost` on `ServiceOrder` for concluded orders).
- Average ticket (revenue / orders concluded).
- Margin % ((revenue − cost) / revenue).
- Stock movements by reason (USAGE, PURCHASE, ADJUSTMENT, WASTE).
- Low-stock products at end of day.

A small helper SQL is provided in `scripts/pilot-metrics.sql` (added during
the audit, see `IMPLEMENTATION_LOG.md` session 002).

---

## The 7 metrics we actually track

### M1. Orders completed per day

- **What**: count of `ServiceOrder` rows with `status = 'COMPLETED'` and
  `completedAt` falling in the pilot day window.
- **Why**: the basic throughput of the business under LavaPro.
- **Target**: not a fixed number — compare to the operator's pre-pilot
  baseline ("how many cars did you wash per day last week?"). LavaPro should
  not reduce throughput by more than 10%.
- **Source**: SQL.

### M2. Order completion latency

- **What**: median and p90 of `completedAt − createdAt` for completed orders,
  in minutes.
- **Why**: surfaces if the app adds friction to the order lifecycle.
- **Target**: should be dominated by the actual service time, not the app.
  A 5-minute median for a "Lavagem simples" with a 20-minute service is
  acceptable; a 30-minute median is a red flag.
- **Source**: SQL.

### M3. Cancellation rate

- **What**: count of `CANCELLED` orders / count of all orders, per day.
- **Why**: cancellations are not free. They should be rare in a real shift.
- **Target**: under 5%. Anything above 10% means the operator is creating
  speculative orders or the cancel button is too easy to hit.
- **Source**: SQL.

### M4. Stock deduction accuracy

- **What**: for a sample of 3 completed orders per day, compare the
  `StockMovement` USAGE rows for that order to the plan items on the order.
  Each line item should produce exactly one USAGE movement with the right
  `delta`.
- **Why**: this is the audit's check #2 in production. If a movement is
  missing or wrong, the inventory will drift.
- **Target**: 100% of audited orders match.
- **Source**: spot check by the observer against the "Últimas
  movimentações" panel on `/inventory`.

### M5. Low-stock false positive rate

- **What**: count of products flagged as low-stock at end of day, where the
  operator says the count is actually fine in real life.
- **Why**: trust in the alert is the difference between "I check the report"
  and "I ignore the report".
- **Target**: 0. If a product is flagged as low and the operator is
  surprised, we have a unit-conversion or minStock problem.
- **Source**: end-of-day verbal check with the operator.

### M6. Time to first order of the day

- **What**: the time between "operator arrived at the shop" and "first
  order is QUEUED in LavaPro", in minutes.
- **Why**: a slow start kills the day. The MVP should not be the cause.
- **Target**: under 5 minutes on day 3+. Day 1 may be longer due to
  learning.
- **Source**: observer note.

### M7. Operator-reported friction score

- **What**: per interview question 10–16 in `USER_INTERVIEW_GUIDE.md`,
  average score across the 7 areas.
- **Why**: a single number that summarizes where the operator struggles.
- **Target**: any individual area above 3 is a fix-now candidate.
- **Source**: end-of-pilot interview.

---

## Optional secondary metrics (capture if cheap)

- Number of times the operator adjusted stock manually, by reason. Helps us
  decide if `PURCHASE` should become a one-tap flow.
- Number of distinct services used per day. If it is always 1 or 2, the
  catalog may be too narrow.
- Number of customers created vs. existing customers reused. If new
  customers dominate, the customer-search flow is missing.

Do not block the pilot on these. Capture them only if the observer has
spare cycles.

---

## What we will **not** measure

- Conversion rate, retention, MAU, NPS. There is one operator, one
  business, no marketing. These numbers are not informative at this scale.
- Time on screen, click count, page views. The product has no analytics
  layer; adding one would violate the offline-first scope.
- Operator satisfaction on a numeric scale at the end of each day. That
  number is too noisy over 5 days. The interview on day 5 is enough.

---

## Reporting cadence

- **End of each pilot day** (5 min): the observer fills in the daily row in
  the `pilot-metrics.csv` table (created from the SQL).
- **End of pilot** (1 hour): produce a 1-page summary in
  `docs/PILOT_RESULTS.md` (added post-pilot) with each of M1–M7 plus a
  short qualitative read.
- **Post-pilot review meeting** (1 hour): the team walks through M1–M7,
  the friction catalog, and the surprises log, and decides the next
  iteration.
