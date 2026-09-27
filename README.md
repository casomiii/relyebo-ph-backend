
# RELYEBO Directive 1 - Background Grinders

## Purpose
When QA logs UAT bug from 5-scenario stress test, this baseline lets Jules fix overnight.

## Included Baseline
- src/middleware/checkSoftGate.js (hardened: blocks POST/PUT/PATCH/DELETE for PENDING, allows GET)
- src/hocs/withSoftGate.jsx (React HOC + hook)
- src/routes/paymongoWebhook.js (PayMongo listener with idempotency + admin override)
- src/store/ledgerStore.js (prevents duplicate ledger entries)

## How QA uses it
1. QA runs 5-scenario UAT stress test on staging
2. If failure, QA creates Issue from template .github/ISSUE_TEMPLATE/uat-bug.md
3. Paste logs, check Soft Gate or Idempotency
4. Assign to Jules for overnight fixing
5. Jules opens PR by morning with tests

## Example Issues
See /docs folder for 2 ready-to-paste examples
