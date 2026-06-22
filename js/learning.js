let currentPoints = 12;
let courseCompleted = false;

function openModal() {
  if (courseCompleted) {
    showToast("You've already completed this module!", "info");
    return;
  }
  const modal = document.getElementById('course-modal');
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('course-modal');
  modal.classList.remove('active');
}

function completeFirstCourse() {
  if (courseCompleted) return;
  courseCompleted = true;

  // Add 4 points
  currentPoints += 4;

  // Update points badge text
  const badgeText = document.getElementById('points-badge-text');
  if (badgeText) badgeText.innerText = currentPoints;

  // Update progress text
  const progressText = document.getElementById('progress-text');
  if (progressText) progressText.innerText = `${currentPoints}/30`;

  // Update progress bar fill
  const fill = document.getElementById('progress-bar-fill');
  if (fill) fill.style.width = `${(currentPoints / 30) * 100}%`;

  // Update points ring
  const ring = document.getElementById('points-ring');
  if (ring) {
    const circumference = 314.159;
    const offset = circumference - (currentPoints / 30) * circumference;
    ring.setAttribute('stroke-dashoffset', offset);
  }

  // Update course card status
  const statusEl = document.getElementById('status-risk');
  if (statusEl) {
    statusEl.className = 'absolute top-4 right-4 bg-green-50 text-green-600 text-xs px-2 py-1 rounded font-bold border border-green-100';
    statusEl.innerText = '✓ Completed';
  }

  // Update course card style
  const cardEl = document.getElementById('card-risk');
  if (cardEl) {
    cardEl.classList.remove('border-blue-500/30', 'hover:border-blue-500');
    cardEl.classList.add('border-green-300', 'bg-green-50/30');
  }

  // Update complete button
  const btn = document.getElementById('complete-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Completed!';
    btn.className = 'px-5 py-2 rounded-lg text-sm font-medium bg-green-600 text-white flex items-center gap-2';
  }

  // Update course count badge
  const countBadge = document.getElementById('course-count-badge');
  if (countBadge) countBadge.innerText = '1 of 6 completed';

  // Show toast
  showToast('Module completed! +4 CPD Points added 🎉', 'success');

  // Close modal after short delay
  setTimeout(() => closeModal(), 1500);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const colors = {
    success: 'bg-green-600',
    info: 'bg-blue-600',
    error: 'bg-red-600'
  };

  const toast = document.createElement('div');
  toast.className = `toast-animate ${colors[type]} text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2`;
  toast.innerHTML = `<i class="ph ph-check-circle text-base"></i> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function toggleReminder(btn, name) {
  const icon = btn.querySelector('i');
  const isSet = icon.classList.contains('ph-fill');
  if (isSet) {
    icon.classList.remove('ph-fill', 'ph-bell', 'text-blue-600');
    icon.classList.add('ph', 'ph-bell', 'text-slate-400');
    showToast(`Reminder removed for ${name}`, 'info');
  } else {
    icon.classList.remove('ph', 'text-slate-400');
    icon.classList.add('ph-fill', 'ph-bell', 'text-blue-600');
    showToast(`Reminder set for ${name}!`, 'success');
  }
}

function handleLockedClick(name) {
  showToast(`Complete previous modules to unlock ${name}`, 'info');
}

// Search functionality
const searchInput = document.getElementById('module-search');
const searchClear = document.getElementById('search-clear');
const courseGrid = document.getElementById('course-grid');
const noResults = document.getElementById('no-results');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    searchClear.classList.toggle('hidden', !query);

    const cards = courseGrid.querySelectorAll('.course-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const match = text.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visibleCount++;
    });

    noResults.classList.toggle('hidden', visibleCount > 0);
  });
}

if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.add('hidden');
    courseGrid.querySelectorAll('.course-card').forEach(c => c.style.display = '');
    noResults.classList.add('hidden');
  });
}

// Tab switching
const navTabs = document.querySelectorAll('.nav-tab');
const panels = document.querySelectorAll('.tab-panel');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

navTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    navTabs.forEach(t => {
      t.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-sm');
      t.classList.add('text-slate-500');
    });
    tab.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-sm');
    tab.classList.remove('text-slate-500');

    panels.forEach(p => p.classList.add('hidden'));
    const activePanel = document.getElementById(`panel-${target}`);
    if (activePanel) activePanel.classList.remove('hidden');

    if (pageTitle) pageTitle.innerText = tab.dataset.title || '';
    if (pageSubtitle) pageSubtitle.innerText = tab.dataset.subtitle || '';
  });
});

// Follow-up checklist
function toggleFollowup(btn) {
  const item = btn.closest('.followup-item');
  const text = item.querySelector('.followup-text');
  const icon = btn.querySelector('i');
  const isDone = text.classList.contains('is-done');

  if (isDone) {
    text.classList.remove('is-done');
    btn.classList.remove('bg-blue-500', 'border-blue-500');
    icon.classList.add('opacity-0');
  } else {
    text.classList.add('is-done');
    btn.classList.add('bg-blue-500', 'border-blue-500');
    icon.classList.remove('opacity-0');
  }

  // Update remaining count
  const remaining = document.querySelectorAll('.followup-text:not(.is-done)').length;
  const remainingEl = document.getElementById('followup-remaining');
  if (remainingEl) remainingEl.innerText = remaining;
}

// Close modal on backdrop click
const modal = document.getElementById('course-modal');
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}