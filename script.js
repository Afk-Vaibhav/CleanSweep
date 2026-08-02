/* =========================================================
   CivicSweep — Shared Script
   Contents:
   1. Icon library (inline SVG strings, reused across renders)
   2. Dummy task data
   3. Local storage helpers (claims made by "you" this session)
   4. Navbar: mobile toggle + footer year
   5. Scroll reveal (IntersectionObserver)
   6. Toast notifications
   7. Home page: featured tasks + stat count-up
   8. Tasks page: render, filter, sort, claim
   9. Dashboard page: stats, claim list, badges
   10. Report page: validation + fake submit
   ========================================================= */

/* ---------- 1. Icon library ---------- */
const ICONS = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  litter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
  dumping: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-9 4 9M9 14h-4"/><path d="M13 17l3-11 3 11"/><path d="M11 20h10"/></svg>',
  drainage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 12a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4M4 12a2 2 0 1 0 0 4h16a2 2 0 1 0 0-4"/><circle cx="8" cy="10" r=".6" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r=".6" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r=".6" fill="currentColor" stroke="none"/></svg>',
  toilet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v6a5 5 0 0 1-10 0V4z"/><path d="M9 20h6M12 15v5"/></svg>',
  park: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C9 5 7 8 7 11a5 5 0 0 0 10 0c0-3-2-6-5-9z"/><path d="M12 16v6"/></svg>',
  water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s6 7 6 11.5a6 6 0 0 1-12 0C6 9 12 2 12 2z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.3"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.7-8.94A5.5 5.5 0 0 1 17 8.5a4 4 0 0 1-1 7.5H7z"/><path d="M12 12v6M9.5 15.5L12 13l2.5 2.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.4L22 9.3l-5 4.8 1.3 6.9L12 17.8 5.7 21l1.3-6.9-5-4.8 7.1-1z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"/><circle cx="10" cy="7" r="3.5"/><path d="M22 20v-1a4 4 0 0 0-3-3.87M15 3.6a3.5 3.5 0 0 1 0 6.8"/></svg>',
  coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 15.5c.6.6 1.5 1 2.5 1 1.8 0 3-1 3-2.2 0-3-6-1.3-6-4.3 0-1.2 1.2-2.2 3-2.2 1 0 1.9.4 2.5 1M12 6v1.3M12 16.7V18"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.8-10-9.6C.5 6.8 2.6 4 5.7 4c1.9 0 3.4 1 4.3 2.5C10.9 5 12.4 4 14.3 4 17.4 4 19.5 6.8 22 10.4 19.5 15.2 12 20 12 20z"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
  medal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="6"/><path d="M9.5 9L7 3M14.5 9L17 3M10 13.5l1.5 1.5 3-3"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-1.2.5-2 1-2.7.3 1 1 1.7 2 1.7-1-3 .5-5 2-7z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M5 6H3a3 3 0 0 0 4 4.9M19 6h2a3 3 0 0 1-4 4.9"/><path d="M12 14v3M9 20h6M10 17h4v3h-4z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/></svg>',
};

function iconFor(cat) {
  return ICONS[cat] || ICONS.litter;
}

const CATEGORY_LABELS = {
  litter: 'Street Litter',
  dumping: 'Illegal Dumping',
  drainage: 'Drainage Blockage',
  toilet: 'Public Toilet',
  park: 'Park / Green Space',
  water: 'Water Body',
};

/* ---------- 2. Dummy task data ---------- */
const TASKS = [
  { id: 'CS-1042', title: 'Overflowing bins outside bus stand', location: 'MG Road Bus Stand', category: 'litter', reward: 150, status: 'open', claimedByYou: false, reported: '2 days ago' },
  { id: 'CS-1043', title: 'Construction debris dumped by roadside', location: 'Riverside Ghat Approach Road', category: 'dumping', reward: 600, status: 'open', claimedByYou: false, reported: '1 day ago' },
  { id: 'CS-1044', title: 'Litter scattered across play area', location: 'Sunrise Colony Community Park', category: 'park', reward: 300, status: 'claimed', claimedByYou: true, reported: '4 days ago' },
  { id: 'CS-1045', title: 'Blocked drain causing waterlogging', location: 'Old Market Drainage Canal', category: 'drainage', reward: 750, status: 'open', claimedByYou: false, reported: '6 hours ago' },
  { id: 'CS-1046', title: 'Unhygienic public toilet block', location: 'Lakeview Public Toilet Block', category: 'toilet', reward: 450, status: 'completed', claimedByYou: true, reported: '9 days ago' },
  { id: 'CS-1047', title: 'Loose garbage near housing gate', location: 'Hillside Housing Society Gate', category: 'litter', reward: 200, status: 'open', claimedByYou: false, reported: '3 days ago' },
  { id: 'CS-1048', title: 'Waste dumped under the underpass', location: 'Central Railway Underpass', category: 'dumping', reward: 550, status: 'claimed', claimedByYou: false, reported: '2 days ago' },
  { id: 'CS-1049', title: 'Plastic waste piled behind school wall', location: 'Greenfield School Backwall', category: 'litter', reward: 180, status: 'open', claimedByYou: false, reported: '5 hours ago' },
  { id: 'CS-1050', title: 'Stagnant water attracting mosquitoes', location: 'Community Health Center Surroundings', category: 'water', reward: 400, status: 'completed', claimedByYou: false, reported: '11 days ago' },
];

/* ---------- 3. Local storage helpers ---------- */
const LS_CLAIMS = 'civicsweep_my_claims';
const LS_COMPLETED = 'civicsweep_my_completed';

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    /* storage unavailable — interactions still work for this page view */
  }
}

// Merge base TASKS with anything the visitor has claimed/completed this session
function getTasksWithOverlay() {
  const myClaims = readList(LS_CLAIMS);
  const myCompleted = readList(LS_COMPLETED);
  return TASKS.map(t => {
    const task = { ...t };
    if (myCompleted.includes(task.id)) {
      task.status = 'completed';
      task.claimedByYou = true;
    } else if (myClaims.includes(task.id)) {
      task.status = 'claimed';
      task.claimedByYou = true;
    }
    return task;
  });
}

function claimTask(id) {
  const claims = readList(LS_CLAIMS);
  if (!claims.includes(id)) {
    claims.push(id);
    writeList(LS_CLAIMS, claims);
  }
}

function completeTask(id) {
  const completed = readList(LS_COMPLETED);
  if (!completed.includes(id)) {
    completed.push(id);
    writeList(LS_COMPLETED, completed);
  }
}

/* ---------- 4. Navbar + footer year ---------- */
function initNavbar() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- 5. Scroll reveal ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

/* ---------- 6. Toast ---------- */
let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `${ICONS.checkCircle}<span class="toast__msg"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast__msg').textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

/* ---------- 7. Home page: featured tasks + count-up ---------- */
function taskPhotoMarkup(task) {
  return `
    <div class="task-card__photo" data-cat="${task.category}">
      ${iconFor(task.category)}
      <span class="task-card__status task-card__status--${task.status}">${statusLabel(task)}</span>
      <span class="task-card__reward">₹${task.reward}</span>
    </div>`;
}

function statusLabel(task) {
  if (task.status === 'open') return 'Open';
  if (task.status === 'claimed') return task.claimedByYou ? 'Claimed by you' : 'Claimed';
  return 'Completed';
}

function renderFeaturedTasks() {
  const mount = document.getElementById('featuredTasks');
  if (!mount) return;
  const featured = TASKS.filter(t => t.status === 'open').slice(0, 3);
  mount.innerHTML = featured.map(task => `
    <article class="task-card">
      ${taskPhotoMarkup(task)}
      <div class="task-card__body">
        <div class="task-card__cat">${CATEGORY_LABELS[task.category]}</div>
        <h3 class="task-card__title">${task.title}</h3>
        <div class="task-card__loc">${ICONS.pin}<span>${task.location}</span></div>
        <div class="task-card__foot">
          <span class="task-card__reported">${task.reported}</span>
          <a href="tasks.html" class="btn btn--secondary btn--sm">View task</a>
        </div>
      </div>
    </article>
  `).join('');
}

function initCountUp() {
  const values = document.querySelectorAll('.stat__value[data-count]');
  if (!values.length) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = (target * eased);
      el.textContent = prefix + (target % 1 === 0 ? Math.round(current).toLocaleString('en-IN') : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    values.forEach(el => obs.observe(el));
  } else {
    values.forEach(animate);
  }
}

/* ---------- 8. Tasks page: render, filter, sort, claim ---------- */
let activeStatusFilter = 'all';
let activeCategoryFilter = 'all';

function renderTaskGrid() {
  const mount = document.getElementById('taskGrid');
  if (!mount) return;
  const tasks = getTasksWithOverlay();
  const filtered = tasks.filter(t => {
    const statusOk = activeStatusFilter === 'all' || t.status === activeStatusFilter;
    const catOk = activeCategoryFilter === 'all' || t.category === activeCategoryFilter;
    return statusOk && catOk;
  });

  if (!filtered.length) {
    mount.innerHTML = `<div class="task-empty">No tasks match these filters yet. Try a different category or status.</div>`;
    return;
  }

  mount.innerHTML = filtered.map(task => `
    <article class="task-card" data-id="${task.id}">
      ${taskPhotoMarkup(task)}
      <div class="task-card__body">
        <div class="task-card__cat">${CATEGORY_LABELS[task.category]}</div>
        <h3 class="task-card__title">${task.title}</h3>
        <div class="task-card__loc">${ICONS.pin}<span>${task.location}</span></div>
        <div class="task-card__foot">
          <span class="task-card__reported">${task.reported}</span>
          ${claimButtonMarkup(task)}
        </div>
      </div>
    </article>
  `).join('');

  mount.querySelectorAll('[data-claim-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-claim-id');
      claimTask(id);
      showToast('Task claimed! Find it under Active Claims in your dashboard.');
      renderTaskGrid();
    });
  });
}

function claimButtonMarkup(task) {
  if (task.status === 'open') {
    return `<button class="btn btn--primary btn--sm" data-claim-id="${task.id}">Claim Task</button>`;
  }
  if (task.status === 'claimed') {
    return task.claimedByYou
      ? `<button class="btn btn--claimed btn--sm" disabled>${ICONS.check} Claimed by you</button>`
      : `<button class="btn btn--taken btn--sm" disabled>Already claimed</button>`;
  }
  return `<button class="btn btn--taken btn--sm" disabled>${ICONS.check} Completed</button>`;
}

function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const select = document.getElementById('categoryFilter');
  if (!tabs.length && !select) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      activeStatusFilter = tab.dataset.status;
      renderTaskGrid();
    });
  });

  if (select) {
    select.addEventListener('change', () => {
      activeCategoryFilter = select.value;
      renderTaskGrid();
    });
  }
}

/* ---------- 9. Dashboard page ---------- */
function renderDashboard() {
  const claimList = document.getElementById('activeClaimList');
  const completedList = document.getElementById('completedList');
  if (!claimList && !completedList) return;

  const tasks = getTasksWithOverlay();
  const active = tasks.filter(t => t.status === 'claimed' && t.claimedByYou);
  const completed = tasks.filter(t => t.status === 'completed' && t.claimedByYou);

  if (claimList) {
    claimList.innerHTML = active.length ? active.map(claimRowMarkup).join('') : `
      <div class="dash-empty">You don't have any active claims. <a href="tasks.html">Browse open tasks</a> to get started.</div>`;

    claimList.querySelectorAll('[data-complete-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-complete-id');
        completeTask(id);
        showToast('Nice work! Task marked as completed.');
        renderDashboard();
      });
    });
  }

  if (completedList) {
    completedList.innerHTML = completed.length ? completed.map(claimRowMarkup).join('') : `
      <div class="dash-empty">Completed tasks will show up here once you finish a cleanup.</div>`;
  }

  updateDashboardStats(completed, active);
  updateBadges(completed.length);
}

function claimRowMarkup(task) {
  const isActive = task.status === 'claimed';
  return `
    <div class="claim-row">
      <div class="claim-row__photo" data-cat="${task.category}">
        ${iconFor(task.category)}
      </div>
      <div class="claim-row__info">
        <strong>${task.title}</strong>
        <span>${task.location}</span>
      </div>
      <span class="claim-row__reward">₹${task.reward}</span>
      ${isActive
        ? `<span class="claim-row__status claim-row__status--claimed">In progress</span>
           <button class="btn btn--primary btn--sm" data-complete-id="${task.id}">Mark Complete</button>`
        : `<span class="claim-row__status claim-row__status--completed">${ICONS.check} Completed</span>`}
    </div>`;
}

function updateDashboardStats(completed, active) {
  const completedCountEl = document.getElementById('statCompleted');
  const earningsEl = document.getElementById('statEarnings');
  const activeCountEl = document.getElementById('statActive');
  const earnings = completed.reduce((sum, t) => sum + t.reward, 0);
  if (completedCountEl) completedCountEl.textContent = completed.length;
  if (earningsEl) earningsEl.textContent = '₹' + earnings.toLocaleString('en-IN');
  if (activeCountEl) activeCountEl.textContent = active.length;
}

function updateBadges(completedCount) {
  const badges = document.querySelectorAll('.badge-card[data-threshold]');
  badges.forEach(badge => {
    const threshold = parseInt(badge.dataset.threshold, 10);
    badge.classList.toggle('is-unlocked', completedCount >= threshold);
  });
}

/* ---------- 10. Report page ---------- */
function initReportForm() {
  const form = document.getElementById('reportForm');
  if (!form) return;

  const fileInput = document.getElementById('reportImage');
  const uploadZone = document.getElementById('uploadZone');
  const preview = document.getElementById('uploadPreview');
  const previewImg = preview ? preview.querySelector('img') : null;
  const previewName = preview ? preview.querySelector('.upload-preview__name') : null;
  const removeBtn = preview ? preview.querySelector('.upload-preview__remove') : null;

  if (fileInput && preview) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImg.src = e.target.result;
        previewName.textContent = file.name;
        preview.classList.add('is-visible');
        clearFieldError('reportImage');
      };
      reader.readAsDataURL(file);
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fileInput.value = '';
        preview.classList.remove('is-visible');
      });
    }

    ['dragover', 'dragleave', 'drop'].forEach(evt => {
      uploadZone.addEventListener(evt, (e) => {
        e.preventDefault();
        uploadZone.classList.toggle('is-dragover', evt === 'dragover');
      });
    });
    uploadZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
      }
    });
  }

  const requiredFields = [
    { id: 'reportName', message: 'Please enter your name.' },
    { id: 'reportContact', message: 'Please enter a valid email or phone number.', validate: validateContact },
    { id: 'reportLocation', message: 'Please tell us where the issue is.' },
    { id: 'reportCategory', message: 'Please choose a category.' },
    { id: 'reportDescription', message: 'Please add at least 20 characters describing the issue.', validate: (v) => v.trim().length >= 20 },
    { id: 'reportImage', message: 'Please attach a photo of the issue.', isFile: true },
  ];

  requiredFields.forEach(field => {
    const el = document.getElementById(field.id);
    if (!el) return;
    const evtName = field.isFile ? 'change' : 'blur';
    el.addEventListener(evtName, () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });
    if (!isValid) {
      const firstError = form.querySelector('.has-error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    submitReport(form);
  });

  function validateField(field) {
    const el = document.getElementById(field.id);
    const row = el.closest('.form-row');
    let valid;
    if (field.isFile) {
      valid = el.files && el.files.length > 0;
    } else if (field.validate) {
      valid = field.validate(el.value);
    } else {
      valid = el.value.trim().length > 0;
    }
    if (row) row.classList.toggle('has-error', !valid);
    if (!field.isFile) el.classList.toggle('has-error', !valid);
    return valid;
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    const row = el.closest('.form-row');
    if (row) row.classList.remove('has-error');
  }

  function validateContact(value) {
    const v = value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+]?[\d\s-]{8,15}$/;
    return emailPattern.test(v) || phonePattern.test(v);
  }
}

function submitReport(form) {
  const successPanel = document.getElementById('successPanel');
  const reportId = 'CS-' + Math.floor(1000 + Math.random() * 9000);
  const idEl = document.getElementById('successId');
  if (idEl) idEl.textContent = '#' + reportId;
  form.style.display = 'none';
  if (successPanel) successPanel.classList.add('is-visible');
  showToast('Report submitted — thank you for helping keep your city clean.');
}

function resetReportForm() {
  const form = document.getElementById('reportForm');
  const successPanel = document.getElementById('successPanel');
  const preview = document.getElementById('uploadPreview');
  if (!form) return;
  form.reset();
  form.style.display = '';
  document.querySelectorAll('.form-row.has-error, .form-control.has-error').forEach(el => el.classList.remove('has-error'));
  if (successPanel) successPanel.classList.remove('is-visible');
  if (preview) preview.classList.remove('is-visible');
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  renderFeaturedTasks();
  initCountUp();
  initFilters();
  renderTaskGrid();
  renderDashboard();
  initReportForm();

  const reportAgainBtn = document.getElementById('reportAgainBtn');
  if (reportAgainBtn) reportAgainBtn.addEventListener('click', resetReportForm);
});
