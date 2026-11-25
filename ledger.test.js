import { test } from "node:test";
import assert from "node:assert/strict";
import { addExpense, removeExpense, inMonth, total, byCategory, budgetStatus, dailyAverage, toCents, fmt } from "./ledger.js";

const base = { category: "Food", date: "2026-11-05" };
test("money is exact", () => {
  assert.equal(toCents("0.1") + toCents("0.2"), 30);
  assert.equal(toCents("12,50"), 1250);
  assert.equal(fmt(123456), "1,234.56");
  assert.throws(() => toCents("0")); assert.throws(() => toCents("abc")); assert.throws(() => toCents("-5"));
});
test("add validates category and date", () => {
  assert.equal(addExpense([], { ...base, amount: 20 }).length, 1);
  assert.throws(() => addExpense([], { ...base, amount: 20, category: "Cars" }));
  assert.throws(() => addExpense([], { ...base, amount: 20, date: "5/11" }));
});
test("filter by month, totals, categories, remove", () => {
  let l = addExpense([], { ...base, amount: 50 });
  l = addExpense(l, { category: "Study", date: "2026-11-09", amount: 100 });
  l = addExpense(l, { category: "Study", date: "2026-10-30", amount: 70 });
  assert.equal(inMonth(l, "2026-11").length, 2);
  assert.equal(total(inMonth(l, "2026-11")), 15000);
  assert.equal(byCategory(inMonth(l, "2026-11")).Study, 10000);
  assert.equal(removeExpense(l, l[0].id).length, 2);
});
test("budget status", () => {
  assert.equal(budgetStatus(5000, 0).state, "none");
  assert.equal(budgetStatus(5000, 10000).state, "ok");
  assert.equal(budgetStatus(8000, 10000).state, "close");
  const o = budgetStatus(12000, 10000);
  assert.equal(o.state, "over"); assert.equal(o.pct, 1); assert.equal(o.left, -2000);
});
test("daily average uses days elapsed in current month", () => {
  const l = addExpense([], { ...base, amount: 100 });
  assert.equal(dailyAverage(l, "2026-11", "2026-11-10"), 1000);
  assert.equal(dailyAverage(l, "2026-11", "2026-12-02"), Math.round(10000 / 30));
});
