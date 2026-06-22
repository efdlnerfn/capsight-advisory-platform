const OPERATIONAL_BUDGET_CAP = 21000;

let expenses = [
  { id: 1, date: "2026-06-18", vendor: "HubSpot",            category: "CRM & AI Tools",     amount: 540.00, payment: "Corporate Amex",   taxDeductible: true,  hasReceipt: true  },
  { id: 2, date: "2026-06-17", vendor: "Opentable — Marble 8", category: "Client Meals",     amount: 320.50, payment: "Corporate Amex",   taxDeductible: true,  hasReceipt: true  },
  { id: 3, date: "2026-06-15", vendor: "AirAsia",             category: "Travel",            amount: 1280.00, payment: "Operating Account", taxDeductible: true, hasReceipt: true  },
  { id: 4, date: "2026-06-14", vendor: "Adobe Creative Cloud", category: "Software",          amount: 89.90,  payment: "Corporate Amex",   taxDeductible: true,  hasReceipt: false },
  { id: 5, date: "2026-06-12", vendor: "SCICOM Licensing",     category: "Compliance Licensing", amount: 450.00, payment: "Operating Account", taxDeductible: true, hasReceipt: true },
  { id: 6, date: "2026-06-10", vendor: "Grab (client pickup)", category: "Travel",           amount: 42.30,  payment: "Corporate Amex",   taxDeductible: true,  hasReceipt: true  },
  { id: 7, date: "2026-06-08", vendor: "Officemate",           category: "Office Supplies",  amount: 156.80, payment: "Operating Account", taxDeductible: true,  hasReceipt: false },
];

const CATEGORY_CLASS = {
  "Software":            "cat-software",
  "Client Meals":        "cat-client-meals",
  "Travel":              "cat-travel",
  "Marketing":           "cat-marketing",
  "CRM & AI Tools":      "cat-crm-ai-tools",
  "Compliance Licensing":"cat-compliance",
  "Office Rent":         "cat-office-rent",
  "Office Supplies":     "cat-office-supplies",
};

const $ = (id) => document.getElementById(id);

function fmtMY(num) {
  return Number(num || 0).toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function escapeHTML(str = "") {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function recomputeTotals() {
  const now = new Date();
  const monthly = expenses.filter(e => {
    const d = new Date(e.date + "T00:00:00");
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const burn = monthly.reduce((s, e) => s + Number(e.amount), 0);

  const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
  const taxTotal = expenses
    .filter(e => e.taxDeductible && new Date(e.date + "T00:00:00") >= qStart)
    .reduce((s, e) => s + Number(e.amount), 0);

  const pct = Math.min(100, Math.round((burn / OPERATIONAL_BUDGET_CAP) * 100));

  $("hero-burn").textContent = fmtMY(burn);
  $("hero-txn-count").textContent = monthly.length;
  $("hero-tax").textContent = fmtMY(taxTotal);
  $("hero-budget-used").textContent = fmtMY(burn);
  $("hero-budget-cap").textContent = fmtMY(OPERATIONAL_BUDGET_CAP);

  $("hero-budget-pct").textContent = pct;
  $("hero-budget-bar").style.width = pct + "%";

  const pill = $("budget-status-pill");
  const bar = $("hero-budget-bar");
  if (pct >= 90) {
    pill.innerHTML = '<i class="ph-bold ph-warning-octagon"></i> Critical';
    pill.className = "inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded-full";
    bar.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
  } else if (pct >= 70) {
    pill.innerHTML = '<i class="ph-bold ph-warning"></i> Monitor';
    pill.className = "inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full";
    bar.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
  } else {
    pill.innerHTML = '<i class="ph-bold ph-check-circle"></i> Healthy';
    pill.className = "inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full";
    bar.style.background = "linear-gradient(90deg, #10b981, #059669)";
  }
}

function categoryPill(cat) {
  const cls = CATEGORY_CLASS[cat] || "cat-office-rent";
  return `<span class="cat-pill ${cls}"><i class="ph-fill ph-circle text-[6px]"></i>${escapeHTML(cat)}</span>`;
}

function receiptCell(e) {
  if (e.hasReceipt) {
    return `<span class="receipt-yes" title="Receipt attached"><i class="ph-fill ph-check-circle text-base"></i></span>`;
  }
  return `<span class="receipt-no" title="No receipt"><i class="ph ph-paperclip-tilt text-base"></i></span>`;
}

function renderLedger(filterText = "", highlightId = null) {
  const body = $("ledger-body");
  const empty = $("ledger-empty");
  const q = filterText.trim().toLowerCase();

  const rows = expenses
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(e => {
      if (!q) return true;
      return [e.vendor, e.category, e.payment, fmtDate(e.date)]
        .some(v => String(v).toLowerCase().includes(q));
    });

  if (rows.length === 0) {
    body.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  body.innerHTML = rows.map(e => `
    <tr class="${highlightId === e.id ? "row-new" : ""}">
      <td class="cell-date">${fmtDate(e.date)}</td>
      <td>${categoryPill(e.category)}</td>
      <td class="cell-vendor">${escapeHTML(e.vendor)}</td>
      <td class="cell-amount">RM ${fmtMY(e.amount)}</td>
      <td class="cell-receipt">${receiptCell(e)}</td>
    </tr>
  `).join("");
}

const dropZone = $("drop-zone");
const fileInput = $("exp-receipt");
const receiptName = $("receipt-name");
const receiptLabel = $("receipt-file-label");
const dropText = $("drop-text");
let receiptAttached = false;

function showReceiptState(fileName) {
  receiptAttached = true;
  dropText.classList.add("hidden");
  receiptLabel.textContent = fileName;
  receiptName.classList.remove("hidden");
  dropZone.classList.add("has-file");
}

function handleFile(file) {
  if (!file) return;
  const ok = file.type.startsWith("image/") || file.type === "application/pdf";
  if (!ok) {
    showToast("Please upload a PDF or image receipt.", "error");
    return;
  }
  fileInput.files = dataTransfer(file);
  showReceiptState(file.name);
}

function dataTransfer(file) {
  const dt = new DataTransfer();
  dt.items.add(file);
  return dt.files;
}

dropZone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

["dragenter", "dragover"].forEach(evt =>
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach(evt =>
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
  })
);
dropZone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

const form = $("expense-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const vendor = $("exp-vendor").value.trim();
  const category = $("exp-category").value;
  const amount = parseFloat($("exp-amount").value);
  const date = $("exp-date").value;
  const payment = $("exp-payment").value;

  if (!vendor || !category || isNaN(amount) || amount <= 0 || !date || !payment) {
    showToast("Please complete all required fields.", "error");
    return;
  }

  const newExpense = {
    id: Date.now(),
    date,
    vendor,
    category,
    amount,
    payment,
    taxDeductible: category !== "Client Meals" || amount <= 250,
    hasReceipt: receiptAttached,
  };

  expenses.push(newExpense);
  renderLedger($("ledger-search").value, newExpense.id);
  recomputeTotals();

  form.reset();
  setDefaultDate();
  receiptAttached = false;
  receiptName.classList.add("hidden");
  dropText.classList.remove("hidden");
  dropZone.classList.remove("has-file");

  showToast(`Logged RM ${fmtMY(amount)} to ${vendor}.`, "success");
});

$("ledger-search").addEventListener("input", (e) => {
  renderLedger(e.target.value);
});

function showToast(message, type = "success") {
  const container = $("toast-container");
  const tone = type === "error"
    ? "bg-red-600"
    : "bg-emerald-600";
  const icon = type === "error" ? "ph-warning-circle" : "ph-check-circle";

  const toast = document.createElement("div");
  toast.className = `toast-animate ${tone} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 max-w-xs`;
  toast.innerHTML = `<i class="ph-fill ${icon} text-lg"></i><span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function setDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  $("exp-date").value = today;
}

document.addEventListener("DOMContentLoaded", () => {
  setDefaultDate();
  recomputeTotals();
  renderLedger();
});