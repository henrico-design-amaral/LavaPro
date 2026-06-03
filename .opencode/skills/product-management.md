# Skill: product-management

Operational heuristics for managing a small operational product like LavaPro — a local car wash cockpit.

## When to apply

- Before defining or expanding scope.
- When a feature idea is raised: validate against MVP first.
- When a tradeoff between polish and validation needs to be made.

## Core principles

1. **Operate before you scale.**
   A local-first MVP that runs reliably in a real lava-rápido beats a cloud-first beta that no one uses. Choose the smallest stack that proves the operating loop.

2. **Measure what the operator cares about.**
   For a lava-rápido, the operator cares about queue throughput, gross margin, and stockout risk. Not DAU, not signups, not feature parity with competitors.

3. **One business. One operator. One day.**
   The MVP simulates a single business, a single terminal, and a single day. Multi-tenant, RBAC, billing, and resellers are deferred until validation.

4. **Decisions are recorded.**
   Architectural decisions live in `docs/PRODUCT_DECISIONS.md`. Any change to scope or direction is added there before code lands.

5. **If the day doesn't close, the product doesn't matter.**
   The closing-of-day report is the canary metric. If the daily report gives wrong numbers, nothing else matters. Treat it as a top-priority feature and test it on every validation cycle.

## MVP scope checklist

Before adding any new feature, ask:

- [ ] Does the operator do this manually today, and is the manual version painful?
- [ ] Can the feature ship in one focused, observable screen?
- [ ] Does it use only data we already have (no new infra)?
- [ ] Does it fit the offline-first constraint (no network calls, no third-party APIs)?

If any answer is "no" → defer to a post-MVP bucket.

## Anti-patterns to refuse

- Adding login flows "for safety" before there is more than one user on the same machine.
- Multi-tenant schemas before there is a second business to onboard.
- Background workers, queues, or schedulers before the synchronous flow is validated.
- Microservices, adapters, or service layers before there is a second business logic to share.
- Cloud-only features (push, email, SMS) before the basic operating loop is confirmed.
