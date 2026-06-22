if (!localStorage.getItem('loggedIn')) {
  window.location.href = 'pages/login.html';
}

const briefing = `Good morning, Sarah. You have 3 client meetings scheduled today — 
John Lim at 10:00am for Retirement Planning, the Tan Family at 1:00pm for Estate Planning, 
and ABC Corp at 4:00pm for Group Insurance. Two follow-ups require your attention: 
Sarah Ng has not been contacted in 21 days, and David Chong's policy renews in 7 days. 
You are currently at 12 CPD points — 3 away from your monthly quota.`;

document.getElementById('briefing-text').innerText = briefing;

const TIMES = ['8AM','9AM','10AM','11AM','12PM','1PM','2PM','3PM','4PM','5PM'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

const CATEGORY_STYLE = {
  'Client Meeting': 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  'Fin. Planning':  'bg-green-50 text-green-700 hover:bg-green-100',
  'Client Service': 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
  'Staff Meeting':  'bg-purple-50 text-purple-700 hover:bg-purple-100',
  'Email':          'bg-slate-100 text-slate-600 hover:bg-slate-200',
  'empty':          'bg-white hover:bg-blue-50 text-slate-300 hover:text-blue-400',
};

let scheduleData = JSON.parse(localStorage.getItem('capsight_schedule')) || [
  { day: 0, time: 0, name: 'Email',          category: 'Email',          notes: '' },
  { day: 1, time: 0, name: 'Email',          category: 'Email',          notes: '' },
  { day: 2, time: 0, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 3, time: 0, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 4, time: 0, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 0, time: 1, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 1, time: 1, name: 'Email',          category: 'Email',          notes: '' },
  { day: 2, time: 1, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 3, time: 1, name: 'Email',          category: 'Email',          notes: '' },
  { day: 4, time: 1, name: 'Staff Meeting',  category: 'Staff Meeting',  notes: '' },
  { day: 0, time: 2, name: 'Client Meeting', category: 'Client Meeting', notes: 'John Lim' },
  { day: 1, time: 2, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 2, time: 2, name: 'Email',          category: 'Email',          notes: '' },
  { day: 3, time: 2, name: 'Email',          category: 'Email',          notes: '' },
  { day: 4, time: 2, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 0, time: 3, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 1, time: 3, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 2, time: 3, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 3, time: 3, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 4, time: 3, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 0, time: 4, name: 'Email',          category: 'Email',          notes: '' },
  { day: 1, time: 4, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 2, time: 4, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 3, time: 4, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 4, time: 4, name: 'Email',          category: 'Email',          notes: '' },
  { day: 0, time: 5, name: 'Staff Meeting',  category: 'Staff Meeting',  notes: '' },
  { day: 1, time: 5, name: 'Client Meeting', category: 'Client Meeting', notes: 'Tan Family' },
  { day: 2, time: 5, name: 'Staff Meeting',  category: 'Staff Meeting',  notes: '' },
  { day: 3, time: 5, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 4, time: 5, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 0, time: 6, name: 'Staff Meeting',  category: 'Staff Meeting',  notes: '' },
  { day: 1, time: 6, name: 'Email',          category: 'Email',          notes: '' },
  { day: 2, time: 6, name: 'Staff Meeting',  category: 'Staff Meeting',  notes: '' },
  { day: 3, time: 6, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 4, time: 6, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 0, time: 7, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 1, time: 7, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 2, time: 7, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 3, time: 7, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 4, time: 7, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 0, time: 8, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 1, time: 8, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 2, time: 8, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 3, time: 8, name: 'Email',          category: 'Email',          notes: '' },
  { day: 4, time: 8, name: 'Fin. Planning',  category: 'Fin. Planning',  notes: '' },
  { day: 0, time: 9, name: 'Client Meeting', category: 'Client Meeting', notes: 'ABC Corp' },
  { day: 1, time: 9, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 2, time: 9, name: 'Client Meeting', category: 'Client Meeting', notes: '' },
  { day: 3, time: 9, name: 'Client Service', category: 'Client Service', notes: '' },
  { day: 4, time: 9, name: 'Email',          category: 'Email',          notes: '' },
];

let weekOffset = 0;

function getWeekDates(offset) {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function renderCalendar() {
  const dates = getWeekDates(weekOffset);
  const header = document.getElementById('calendar-header');
  const body = document.getElementById('calendar-body');
  const label = document.getElementById('week-label');

  const first = dates[0];
  const last = dates[4];
  label.textContent = `${first.toLocaleDateString('en-GB', { day:'numeric', month:'short' })} — ${last.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}`;

  const today = new Date();
  header.innerHTML = `
    <th class="bg-slate-800 text-white px-3 py-2.5 text-left font-semibold rounded-tl-lg text-xs">Time</th>
    ${dates.map((d, i) => {
      const isToday = d.toDateString() === today.toDateString();
      return `<th class="px-3 py-2.5 text-center font-semibold text-xs ${isToday ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'} ${i === 4 ? 'rounded-tr-lg' : ''}">
        <div>${DAYS[i].slice(0,3)}</div>
        <div class="text-xs font-normal opacity-75">${d.getDate()}/${d.getMonth()+1}</div>
      </th>`;
    }).join('')}
  `;

  body.innerHTML = TIMES.map((time, tIdx) => `
    <tr class="divide-x divide-slate-100">
      <td class="px-3 py-2 text-slate-500 font-semibold bg-slate-50 whitespace-nowrap text-xs">${time}</td>
      ${DAYS.map((_, dIdx) => {
        const task = scheduleData.find(t => t.day === dIdx && t.time === tIdx);
        const style = task ? (CATEGORY_STYLE[task.category] || CATEGORY_STYLE['Email']) : CATEGORY_STYLE['empty'];
        return `
          <td class="px-2 py-1.5 text-center cursor-pointer transition-colors ${style} relative group"
              onclick="openEditModal(${dIdx}, ${tIdx})">
            ${task ? `
              <div class="font-medium text-xs leading-tight">${task.name}</div>
              ${task.notes ? `<div class="text-xs opacity-60 truncate max-w-[80px] mx-auto">${task.notes}</div>` : ''}
            ` : `
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                <i class="ph ph-plus"></i>
              </div>
            `}
          </td>
        `;
      }).join('')}
    </tr>
  `).join('');
}

function prevWeek() { weekOffset--; renderCalendar(); }
function nextWeek() { weekOffset++; renderCalendar(); }

let editingDay = null;
let editingTime = null;

function openAddModal() {
  editingDay = null;
  editingTime = null;
  document.getElementById('modal-title').innerText = 'Add Task';
  document.getElementById('task-name').value = '';
  document.getElementById('task-notes').value = '';
  document.getElementById('task-day').value = '0';
  document.getElementById('task-time').value = '0';
  document.getElementById('task-category').value = 'Client Meeting';
  document.getElementById('delete-task-btn').classList.add('hidden');
  showTaskModal();
}

function openEditModal(day, time) {
  editingDay = day;
  editingTime = time;
  const task = scheduleData.find(t => t.day === day && t.time === time);

  document.getElementById('modal-title').innerText = task ? 'Edit Task' : 'Add Task';
  document.getElementById('task-name').value = task ? task.name : '';
  document.getElementById('task-notes').value = task ? task.notes : '';
  document.getElementById('task-day').value = day;
  document.getElementById('task-time').value = time;
  document.getElementById('task-category').value = task ? task.category : 'Client Meeting';

  const deleteBtn = document.getElementById('delete-task-btn');
  if (task) deleteBtn.classList.remove('hidden');
  else deleteBtn.classList.add('hidden');

  showTaskModal();
}

function showTaskModal() {
  const modal = document.getElementById('task-modal');
  modal.classList.remove('opacity-0', 'invisible');
  modal.classList.add('opacity-100', 'visible');
}

function closeTaskModal() {
  const modal = document.getElementById('task-modal');
  modal.classList.add('opacity-0', 'invisible');
  modal.classList.remove('opacity-100', 'visible');
}

function saveTask() {
  const name = document.getElementById('task-name').value.trim();
  const day = parseInt(document.getElementById('task-day').value);
  const time = parseInt(document.getElementById('task-time').value);
  const category = document.getElementById('task-category').value;
  const notes = document.getElementById('task-notes').value.trim();

  if (!name) {
    alert('Please enter a task name!');
    return;
  }

  scheduleData = scheduleData.filter(t => !(t.day === day && t.time === time));

  scheduleData.push({ day, time, name, category, notes });

  localStorage.setItem('capsight_schedule', JSON.stringify(scheduleData));

  closeTaskModal();
  renderCalendar();
  updateMeetingCount();
}

function deleteTask() {
  if (editingDay === null || editingTime === null) return;
  scheduleData = scheduleData.filter(t => !(t.day === editingDay && t.time === editingTime));
  localStorage.setItem('capsight_schedule', JSON.stringify(scheduleData));
  closeTaskModal();
  renderCalendar();
  updateMeetingCount();
}

document.getElementById('task-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('task-modal')) closeTaskModal();
});

function updateMeetingCount() {
  const today = new Date();
  const jsDay = today.getDay();

  const todayIdx = jsDay - 1;

  const meetingCard = document.querySelector('[data-stat="meetings"]');

  if (todayIdx < 0 || todayIdx > 4) {
    if (meetingCard) meetingCard.innerText = '0';
    return;
  }

  const count = scheduleData.filter(t =>
    t.day === todayIdx && t.category === 'Client Meeting'
  ).length;

  if (meetingCard) meetingCard.innerText = count;
}

renderCalendar();
updateMeetingCount();