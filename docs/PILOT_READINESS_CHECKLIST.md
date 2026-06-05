# Pilot Readiness Checklist

> LavaPro · offline-first MVP · branch `rebuild/offline-first-mvp`
>
> Audit run against code in `src/`, `prisma/`, and `docs/` to confirm the MVP can
> be deployed to **one real lava-jato** for 5 days without any cloud dependency,
> auth, or external integration.
>
> **Last Audited & Passed**: 2026-06-05 (Antigravity Audit)


## Scope guardrails (must hold during pilot)

- No cloud, no Railway, no Postgres, no authentication, no billing, no
  multi-tenant, no reseller dashboard, no sync, no online mode.
- One operator, one business, one SQLite file, one machine, one LAN.
- Internet connection: not required at any point.

If a real pilot request violates any of these, escalate before implementing.

---

## Verification matrix

| #   | Check                                                                | Result | Evidence                                                                                                                                                |
| --- | -------------------------------------------------------------------- | :----: | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Concluding a service order deducts stock for every plan item         |   ✅   | `src/lib/inventory.ts:73` `applyUsageToStock` runs `tx.product.update({ data: { currentStock: { increment: -item.quantity } } })` inside a transaction. |
| 2   | Every automatic deduction writes a `StockMovement` record            |   ✅   | `src/lib/inventory.ts:82` creates a `stockMovement` with `reason: 'USAGE'` and `reference: orderId`. Visibility: new "Últimas movimentações" panel on `/inventory`. |
| 3   | Stock already moves automatically when a service order is completed  |   ✅   | `src/lib/actions.ts:148` `completeOrderAction` calls `applyUsageToStock` and rolls back the whole transaction on failure. No additional code needed.   |
| 4   | Manual stock adjustment creates a `StockMovement` record             |   ✅   | `src/lib/actions.ts:257` `adjustStockAction` creates the movement in the same `prisma.$transaction` that updates the product.                            |
| 5   | Daily report counts only completed orders                            |   ✅   | `src/lib/queries.ts:333` `getDailyReport` filters `status: 'COMPLETED'`. Queue/in-progress/cancelled orders are excluded.                              |
| 6   | Margin = revenue − cost (not a percentage of revenue alone)          |   ✅   | `src/lib/queries.ts:87` (dashboard) and `:343` (daily report) compute `margin = revenue - cost` and `marginPct = margin / revenue`.                      |
| 7   | Low-stock alerts use `minStock` (not `minimumStock`)                 |   ✅   | Schema field is `minStock` on `Product`. Alert logic in `getDashboardMetrics` (`:108`), `getDailyReport` (`:362`), and `listProducts` (`:217`).        |
| 8   | No external network calls anywhere in the runtime                    |   ✅   | Grep over `src/` finds zero `fetch(`, `axios`, `XMLHttpRequest`, webhook, `api.`, or `https://` references. The only HTTP-shaped string is an inline SVG `data:` URL used for the native `<select>` arrow. |
| 9   | All interactive screens are keyboard-reachable with visible focus    |   ✅   | Forms use `<Label htmlFor>`. Inventory inline adjust uses `sr-only` labels. Global `:focus-visible` ring in `src/app/globals.css:118`. Errors expose `role="alert"`. |
| 10  | Empty states and error states are usable during normal pilot flow    |   ✅   | `EmptyState` (title + description + optional action) on queue lanes, orders list, customers list, and new-order when no services exist. Inline error banners on every mutating form. |

All 10 checks pass. The MVP is **cleared for a single-operator, single-business pilot**.

---

## Known limitations accepted for the pilot

These are intentional in the offline-first scope and must be communicated to the
pilot operator before the first day.

- **No auth, no user separation.** Anyone with the device sees the same data.
  Keep the device physically controlled.
- **No cloud backup.** The `prisma/dev.db` file is the only source of truth.
  Plan to copy it to an external drive at end of each pilot day.
- **No payment integration.** Prices are recorded as expected revenue; nothing
  is charged. Cash/pix confirmation is offline and out of scope.
- **Single timezone, single currency.** BRL only, local time only. Report
  boundaries follow the device clock.
- **No historical stock-movement filtering.** The inventory page shows the last
  30 movements only. This is sufficient for a 5-day pilot; if the operator
  needs to look back further, query the DB file directly.
- **No printer integration.** Receipts are screen-only during the pilot.
- **"Histórico de movimentações" button is gone.** Replaced by the new
  "Últimas movimentações" table on `/inventory` (commit `audit`).

---

## Risks identified and mitigated

| Risk                                                                              | Mitigation                                                                                                |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `dev.db` corruption on sudden power loss                                          | SQLite WAL is enabled by default. Encourage the operator to close the app cleanly at end of day.         |
| Operator forgets to back up the DB                                                | Document end-of-day copy procedure in `FIELD_TEST_SCRIPT.md` step 11.                                    |
| Pilot device has unstable internet and the app tries to "phone home"              | Verified by grep: there is no remote endpoint in the code. The app does not need a network at all.       |
| Low-stock alerts triggered by seed baseline (8 products)                          | The seed sets realistic Brazilian quantities (in `ml`, `L`, `un`). The operator can re-seed on day 1 if needed. |
| Report shows `—` for days with no orders                                          | Acceptable per `EmptyState` design. Reports page renders a clean "Sem ordens hoje" message.              |

---

## What the pilot will validate

- Real order flow latency feels right on the target device.
- Stock deductions match the operator's mental model.
- Daily report numbers are trusted by the operator.
- Queue lanes map to the actual workflow stages of the business.
- Empty/error states are encountered in normal flow and do not block work.
- No silent failure mode surfaces.

The next document (`FIELD_TEST_SCRIPT.md`) walks the operator through the
exact steps to run during the 5 days.
