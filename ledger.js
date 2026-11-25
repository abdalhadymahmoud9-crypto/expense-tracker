// Pure logic for the expense tracker. Money is stored as integer piasters to avoid float errors.
export const CATEGORIES = ["Food", "Transport", "Study", "Fun", "Health", "Other"];

export const toCents = (v) => {
  const n = Math.round(Number(String(v).replace(",", ".")) * 100);
  if (!Number.isFinite(n) || n <= 0) throw new Error("Enter an amount above 0");
  return n;
};
export const fmt = (cents) => (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function addExpense(list, { amount, category, note = "", date }) {
  if (!CATEGORIES.includes(category)) throw new Error("Unknown category");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Bad date");
  return [...list, { id: `${date}-${list.length}-${Math.random().toString(36).slice(2, 6)}`, cents: toCents(amount), category, note: String(note).trim().slice(0, 60), date }];
}
export const removeExpense = (list, id) => list.filter((e) => e.id !== id);
export const inMonth = (list, ym) => list.filter((e) => e.date.startsWith(ym));
export const total = (list) => list.reduce((a, e) => a + e.cents, 0);

export function byCategory(list) {
  const out = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  for (const e of list) out[e.category] += e.cents;
  return out;
}

// state: "ok" under 80%, "close" 80-100%, "over" above budget, "none" if no budget set.
export function budgetStatus(spentCents, budgetCents) {
  if (!budgetCents) return { state: "none", pct: 0, left: 0 };
  const pct = spentCents / budgetCents;
  return { state: pct > 1 ? "over" : pct >= 0.8 ? "close" : "ok", pct: Math.min(pct, 1), left: budgetCents - spentCents };
}

export function dailyAverage(list, ym, today) {
  const [y, m] = ym.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const day = today.startsWith(ym) ? Number(today.slice(8, 10)) : daysInMonth;
  return Math.round(total(inMonth(list, ym)) / day);
}
