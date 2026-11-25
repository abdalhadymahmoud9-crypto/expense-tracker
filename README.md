# Ledger

A small expense tracker. Add expenses with a category and note, set a monthly budget, and see spending per category, the budget meter (green, amber at 80%, red when over) and the daily average. Amounts are in EGP. Data stays in your browser (localStorage) unless you sign in. Optional Google sign-in (Firebase Auth + Firestore, free Spark plan) syncs your data to your own account only (rules: owner-only), merging changes instead of overwriting. Sync was checked in one browser profile and one Google account, not across two devices. This device keeps an unencrypted offline copy per account until you use "Remove offline copies" after signing out (copies with unsynced changes are kept).

## Run / test
`python3 -m http.server`, open http://localhost:8000. Tests: `npm test` (Node 18+).

## How it works
- `ledger.js`: pure logic. Money is stored as integer piasters so 0.1 + 0.2 is exactly 0.30.
- `app.js`: forms, rendering, storage.
- `ledger.test.js`: tests for money maths, filtering by month, budget states and the daily average.

## Limits
No export yet. One currency. Categories are fixed in `ledger.js`.

## Credits
Built with AI assistance.
