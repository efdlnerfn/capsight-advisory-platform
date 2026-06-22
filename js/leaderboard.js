const SAMPLE_DATA = [
  { id: 1, name: "Alvin Tan Wei Shen",   role: "Financial Advisor",          phone: "+60 12-345 6789", email: "alvin.tan@mail.com",   score: 90 },
  { id: 2, name: "Farhan Hakimi",        role: "Principal Wealth Manager",   phone: "+60 13-987 6543", email: "farhan.h@mail.com",    score: 58 },
  { id: 3, name: "Sarah Ahmad",          role: "Senior Advisor",             phone: "+60 17-234 5678", email: "sarah.ahmad@mail.com", score: 85 },
  { id: 4, name: "Aisha Khan",           role: "Product Designer",           phone: "+60 19-876 5432", email: "aisha.khan@mail.com",  score: 79 },
  { id: 5, name: "Liam Wong",            role: "Account Manager",            phone: "+60 11-1234 5678", email: "liam.wong@mail.com", score: 71 },
  { id: 6, name: "Nora Cole",            role: "Support Specialist",         phone: "+60 11-1432 5678", email: "nora.cole@mail.com",  score: 64 },
  { id: 7, name: "Omar Diaz",            role: "Financial Consultant",       phone: "+60 16-765 4321", email: "omar.diaz@mail.com",  score: 55 },
  { id: 8, name: "Mia Park",             role: "Project Manager",            phone: "+60 18-210 9876", email: "mia.park@mail.com",   score: 40 },
];


const podiumEl  = document.getElementById("podium");
const listEl    = document.getElementById("rank-list");
const updatedEl = document.getElementById("last-updated");

function getInitials(name = "") {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeHTML(str = "") {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function computeRankings(entries) {
  return [...entries]
    .filter(e => e && e.name != null)
    .sort((a, b) => (b.score || 0) - (a.score || 0))   
    .map((entry, i) => ({
      ...entry,
      score: Number(entry.score) || 0,
      rank: i + 1,
      displayScore: Number(entry.score) || 0,          
    }));
}

function renderPodium(ranked) {
  const top = ranked.slice(0, 3);
  const slots = [top[1], top[0], top[2]];        
  const places = ["podium-second", "podium-first", "podium-third"];

  podiumEl.innerHTML = slots.map((entry, i) => {
    if (!entry) return `<div class="podium-card ${places[i]} podium-empty"></div>`;
    const medal = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉";
    const initials = getInitials(entry.name);
    
    return `
      <div class="podium-card entrance ${places[i]}" data-id="${entry.id}" style="animation-delay:${i * 70}ms">
        <span class="medal">${medal}</span>
        <div class="rank-badge">${entry.rank}</div>
        <div class="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl ring-2 ring-slate-100 select-none">
          ${initials}
        </div>
        <div class="podium-name">${escapeHTML(entry.name)}</div>
        <div class="podium-role">${escapeHTML(entry.role)}</div>
        <div class="podium-score">
          <span class="score-num">${entry.displayScore}</span>
          <span class="score-num text-sm text-slate-400">/ 100</span>
        </div>
        <div class="podium-bar"><div class="podium-bar-fill" style="width:${entry.displayScore}%"></div></div>
      </div>
    `;
  }).join("");
}

function renderList(rest) {
  if (rest.length === 0) {
    listEl.innerHTML = `<div class="px-6 py-10 text-center text-slate-400 text-sm">No more advisors to show.</div>`;
    return;
  }
  listEl.innerHTML = rest.map((entry, i) => {
    const initials = getInitials(entry.name);
    return `
      <div class="lb-grid lb-row entrance" data-id="${entry.id}" style="animation-delay:${i * 50}ms">
        <span class="text-lg font-bold text-slate-400 text-center">${entry.rank}</span>
        <span class="flex items-center gap-3 min-w-0">
          <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-100 shrink-0 select-none">
            ${initials}
          </div>
          <span class="font-semibold text-slate-900 truncate">${escapeHTML(entry.name)}</span>
        </span>
        <span class="hidden md:block text-sm font-semibold text-blue-600 truncate">${escapeHTML(entry.role)}</span>
        <span class="hidden lg:flex flex-col gap-0.5 text-xs text-slate-500 min-w-0">
          <span class="flex items-center gap-1.5"><i class="ph ph-phone text-slate-400"></i><span class="truncate">${escapeHTML(entry.phone)}</span></span>
          <span class="flex items-center gap-1.5"><i class="ph ph-envelope-simple text-slate-400"></i><span class="truncate">${escapeHTML(entry.email)}</span></span>
        </span>
        <span class="text-right">
          <span class="font-bold text-blue-600 text-base">${entry.displayScore}</span><span class="text-slate-400 text-xs font-semibold">/100</span>
          <div class="mt-1.5 h-1.5 w-24 ml-auto bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-blue-500 rounded-full" style="width:${entry.displayScore}%"></div>
          </div>
        </span>
      </div>
    `;
  }).join("");
}

function updateLeaderboard(data) {
  const ranked = computeRankings(Array.isArray(data) ? data : []);
  renderPodium(ranked);
  renderList(ranked.slice(3));
  if (updatedEl) {
    updatedEl.textContent = `Updated ${new Date().toLocaleTimeString()}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  
  updateLeaderboard(SAMPLE_DATA);
});