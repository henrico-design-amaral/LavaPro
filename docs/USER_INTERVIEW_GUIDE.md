# User Interview Guide

> 30-minute semi-structured interview, run at the end of day 5 of the pilot.
>
> Audience: the operator who used LavaPro for 5 real workdays.
> Goal: extract qualitative signal about trust, friction, and willingness to
> keep using the product. We are not validating features — we are validating
> the **workflow**.

## How to run the interview

- Set 30 minutes on a clock. Stop at 30 even if not finished.
- Audio-record with consent, or take verbatim notes. Either is fine.
- Ask the questions in order. Follow-ups are encouraged; do not lead.
- The operator should not be looking at the app during the interview.
  Memory and gut feel are what we want.
- If the operator says "no complaints", that **is** signal. Note it.

## Opening (2 min)

> "Thanks for doing this. I want to hear your honest impressions of the last
> 5 days. There are no wrong answers and nothing you say will hurt anyone's
> feelings. If you hated something, that's exactly what I need to know."

Confirm consent to record or to take verbatim notes.

## Section 1 — Overall feel (5 min)

1. In one phrase, how would you describe LavaPro to a friend who runs a
   lava-jato?
2. Did you ever reach for pen, paper, your phone, or another tool to do
   something the app should have done? When?
3. On a scale of 0 to 10, how much did you trust the numbers in the daily
   report? What would move that number up?
4. Was there a moment this week where you thought "this is exactly what I
   needed"?

## Section 2 — Daily flow (10 min)

Walk through the operator's typical day, in order, and ask:

5. **Intake**: when a car arrived, how did you decide whether to put it in
   the app? Was there a car you chose not to register? Why?
6. **Service selection**: did the price + service matching feel right, or
   did you second-guess yourself? On which services?
7. **Queue**: did the 4-lane view (Na fila / Em execução / Concluído /
   Cancelado) match your mental model of what was happening? If not, what
   was missing?
8. **Stock**: did you ever think "I'm not sure if the app recorded that"?
   When? How did you resolve it?
9. **Daily report**: did you look at the report every day? What did you do
   with the numbers? Did you ever show them to anyone?

## Section 3 — Friction catalog (8 min)

For each of these, ask the operator to rate 0–5 (0 = no friction, 5 = blocked
my work) and describe in their own words:

10. Registering a new customer.
11. Registering a new vehicle.
12. Creating a service order.
13. Moving an order through the queue.
14. Adjusting stock manually.
15. Reading the daily report.
16. Understanding why a product was in the low-stock list.

Listen for the **highest** score. That is the next thing to fix.

## Section 4 — Failure modes (3 min)

17. Did anything break, freeze, or surprise you? What did you do?
18. Was there a moment you were about to do something in the app and then
    thought "I can't, the app doesn't support that"? What was it?
19. Did you ever lose data — an order that disappeared, a stock count that
    looked wrong? If yes, did you trust the app to recover?

## Section 5 — Future (2 min)

20. If you kept using LavaPro for the next 3 months, what is the first thing
    you would want it to learn or do better?
21. Is there anyone in your life you would recommend LavaPro to today?
    Why or why not?

## Closing

> "Last thing: is there a question I should have asked that I didn't?"

Thank the operator. Pay or gift as agreed in advance.

## Same-day debrief (run at end of days 2 and 4, 10 min)

This is a shorter version you can run while the day is still fresh:

- What worked today?
- What did you do that the app did not expect?
- Did you trust the report at the end of the day?
- One word to describe today.

Capture the answers verbatim in `pilot-notes.md`.

## After the interview

Within 24 hours, transcribe the recording (or clean up the notes) and tag
each answer with:

- A category: `workflow`, `trust`, `friction`, `failure`, `future`.
- A severity: `blocker` (cannot ship beyond pilot), `should-fix` (next
  iteration), `nice-to-have`.

These tags feed the post-pilot prioritization meeting.
