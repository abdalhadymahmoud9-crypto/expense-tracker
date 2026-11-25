# Ledger

A small expense tracker. Add expenses with a category and note, set a monthly budget, and see spending per category, the budget meter (green, amber at 80%, red when over) and the daily average. Amounts are in EGP. Data stays in your browser (localStorage).

## Run / test
`python3 -m http.server`, open http://localhost:8000. Tests: `npm test` (Node 18+).

## How it works
- `ledger.js`: pure logic. Money is stored as integer piasters so 0.1 + 0.2 is exactly 0.30.
- `app.js`: forms, rendering, storage.
- `ledger.test.js`: tests for money maths, filtering by month, budget states and the daily average.

## Limits
No accounts, sync or export yet. One currency. Categories are fixed in `ledger.js`.

## Credits
Built with AI assistance.
