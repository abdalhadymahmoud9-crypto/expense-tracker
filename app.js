import { CATEGORIES, addExpense, removeExpense, inMonth, total, byCategory, budgetStatus, dailyAverage, toCents, fmt } from "./ledger.js";

const KEY = "ledger-v1", BKEY = "ledger-budget-v1";
const $ = (s) => document.querySelector(s);
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
let items = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } })();
let budget = Number(localStorage.getItem(BKEY)) || 0;
let month = today().slice(0, 7);

CATEGORIES.forEach((c) => $("#cat").append(new Option(c, c)));
$("#date").value = today();
$("#month").value = month;

$("#add").onsubmit = (e) => {
  e.preventDefault();
  try {
    items = addExpense(items, { amount: $("#amount").value, category: $("#cat").value, note: $("#note").value, date: $("#date").value });
    localStorage.setItem(KEY, JSON.stringify(items));
    $("#amount").value = ""; $("#note").value = ""; $("#err").textContent = ""; render();
  } catch (err) { $("#err").textContent = err.message; }
};
$("#month").onchange = (e) => { month = e.target.value || month; render(); };
$("#budget").onchange = (e) => {
  try { budget = e.target.value ? toCents(e.target.value) : 0; } catch { budget = 0; }
  localStorage.setItem(BKEY, String(budget)); render();
};
$("#list").onclick = (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  items = removeExpense(items, id); localStorage.setItem(KEY, JSON.stringify(items)); render();
};

function render() {
  const rows = inMonth(items, month), spent = total(rows), st = budgetStatus(spent, budget);
  $("#spent").textContent = fmt(spent);
  $("#budget").value = budget ? (budget / 100).toFixed(2) : "";
  $("#meter").className = st.state;
  $("#meter i").style.width = st.pct * 100 + "%";
  $("#status").textContent = st.state === "none" ? "Set a monthly budget to track it."
    : st.state === "over" ? `Over budget by ${fmt(-st.left)} EGP` : `${fmt(st.left)} EGP left`;
  $("#avg").textContent = fmt(dailyAverage(items, month, today())) + " / day";
  const cats = byCategory(rows), big = Math.max(1, ...Object.values(cats));
  $("#cats").innerHTML = CATEGORIES.map((c) =>
    `<li><span>${c}</span><i style="--w:${(cats[c] / big) * 100}%"></i><em>${fmt(cats[c])}</em></li>`).join("");
  $("#list").innerHTML = [...rows].sort((a, b) => b.date.localeCompare(a.date)).map((e) =>
    `<li><span class="d">${e.date.slice(5)}</span><span class="n">${esc(e.note) || e.category}<small>${e.category}</small></span><b>${fmt(e.cents)}</b><button data-del="${e.id}" aria-label="Delete">✕</button></li>`).join("")
    || `<li class="none">No expenses this month.</li>`;
}
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
render();
