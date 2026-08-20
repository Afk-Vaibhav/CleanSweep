/* =========================================================
   Nagrik — Patna Civic Intelligence — Shared Script
   Contents:
   1. Icon library (inline SVG strings, reused across renders)
   2. Categories, Wards, Reports (prototype data)
   3. Local storage helpers (session-only interactions)
   4. Navbar: mobile toggle + footer year
   5. Scroll reveal (IntersectionObserver)
   6. Toast notifications
   7. Home page: category grid, priority preview, count-up
   8. Explore page: render, filter, "I have this problem too"
   9. Dashboard: stats, Leaflet map, priority list, charts
   10. Report page: validation + simulated AI pipeline
   10b. Supabase integration (report submissions)
   11. Language toggle (EN/HI)
   12. Voice reporting (Web Speech API)
   13. Predictive alerts (real Open-Meteo forecast)
   ========================================================= */

/* ---------- 1. Icon library ---------- */
const ICONS = {
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s6 7 6 11.5a6 6 0 0 1-12 0C6 9 12 2 12 2z"/></svg>',
  drainage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M4 12a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4M4 12a2 2 0 1 0 0 4h16a2 2 0 1 0 0-4"/><circle cx="8" cy="10" r=".6" fill="currentColor" stroke="none"/><circle cx="12" cy="10" r=".6" fill="currentColor" stroke="none"/><circle cx="16" cy="10" r=".6" fill="currentColor" stroke="none"/></svg>',
  garbage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
  road: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21L9 3h6l4 18"/><path d="M12 3v3.5M12 10v3.5M12 17v1.5"/></svg>',
  flood: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15c1.3 1.2 2.6 1.2 4 0 1.3-1.2 2.6-1.2 4 0 1.3 1.2 2.6 1.2 4 0 1.3-1.2 2.6-1.2 4 0"/><path d="M3 19.5c1.3 1.2 2.6 1.2 4 0 1.3-1.2 2.6-1.2 4 0 1.3 1.2 2.6 1.2 4 0 1.3-1.2 2.6-1.2 4 0"/><path d="M12 2s3.2 3.8 3.2 6.6a3.2 3.2 0 0 1-6.4 0C8.8 5.8 12 2 12 2z"/></svg>',
  health: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/></svg>',
  lamp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3M8 8h8l-1.3 4H9.3L8 8z"/><path d="M12 12v9M8.5 21h7"/><path d="M5 6l1.5 1.5M19 6l-1.5 1.5"/></svg>',
  bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="12" rx="2.5"/><path d="M3.5 11h17M7 17v2M17 17v2"/><circle cx="7.5" cy="14" r=".6" fill="currentColor" stroke="none"/><circle cx="16.5" cy="14" r=".6" fill="currentColor" stroke="none"/></svg>',
  school: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5z"/><path d="M6 10.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.5"/><path d="M22 8v6"/></svg>',
  toilet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v6a5 5 0 0 1-10 0V4z"/><path d="M9 20h6M12 15v5"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C9 5 7 8 7 11a5 5 0 0 0 10 0c0-3-2-6-5-9z"/><path d="M12 16v6"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.2 8.4-7 10-3.8-1.6-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
  more: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.3" fill="currentColor" stroke="none"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.3"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.7-8.94A5.5 5.5 0 0 1 17 8.5a4 4 0 0 1-1 7.5H7z"/><path d="M12 12v6M9.5 15.5L12 13l2.5 2.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  checkCircle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.4L22 9.3l-5 4.8 1.3 6.9L12 17.8 5.7 21l1.3-6.9-5-4.8 7.1-1z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1"/><circle cx="10" cy="7" r="3.5"/><path d="M22 20v-1a4 4 0 0 0-3-3.87M15 3.6a3.5 3.5 0 0 1 0 6.8"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-1.2.5-2 1-2.7.3 1 1 1.7 2 1.7-1-3 .5-5 2-7z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/></svg>',
  pulse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>',
  mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/></svg>',
};

function iconFor(cat) {
  return ICONS[cat] || ICONS.more;
}

/* ---------- 2. Categories, Wards, Reports ---------- */
const CATEGORIES = [
  { key: 'water', label: 'Water Shortage' },
  { key: 'drainage', label: 'Drainage Blockage' },
  { key: 'garbage', label: 'Garbage & Waste' },
  { key: 'road', label: 'Road Damage' },
  { key: 'waterlogging', label: 'Waterlogging', icon: 'flood' },
  { key: 'healthcare', label: 'Healthcare', icon: 'health' },
  { key: 'electricity', label: 'Electricity', icon: 'bolt' },
  { key: 'streetlight', label: 'Street Lighting', icon: 'lamp' },
  { key: 'transport', label: 'Public Transport', icon: 'bus' },
  { key: 'school', label: 'School Infrastructure', icon: 'school' },
  { key: 'sanitation', label: 'Sanitation', icon: 'toilet' },
  { key: 'environment', label: 'Environment', icon: 'leaf' },
  { key: 'safety', label: 'Public Safety', icon: 'shield' },
  { key: 'other', label: 'Other', icon: 'more' },
];

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map(c => [c.key, c.label]));
function catIcon(key) {
  const c = CATEGORIES.find(c => c.key === key);
  return iconFor(c && c.icon ? c.icon : key);
}

const WARDS = [
  { id: 42, locality: 'Patliputra Colony', population: 150000, lat: 25.6152, lng: 85.0983, infra: 'Poor' },
  { id: 18, locality: 'Kadamkuan', population: 96000, lat: 25.6118, lng: 85.1352, infra: 'Fair' },
  { id: 35, locality: 'Boring Road', population: 112000, lat: 25.6109, lng: 85.1178, infra: 'Fair' },
  { id: 12, locality: 'Kankarbagh', population: 138000, lat: 25.5884, lng: 85.1553, infra: 'Poor' },
  { id: 24, locality: 'Rajendra Nagar', population: 87000, lat: 25.6121, lng: 85.1449, infra: 'Fair' },
  { id: 8, locality: 'Bailey Road', population: 74000, lat: 25.6098, lng: 85.0834, infra: 'Good' },
  { id: 51, locality: 'Danapur', population: 121000, lat: 25.6352, lng: 85.0382, infra: 'Poor' },
];

function wardById(id) { return WARDS.find(w => w.id === id); }

// severity/urgency are 1-10, priorityScore 0-100, citizensAffected is the demand signal
const REPORTS = [
  { id: 'PC-8801', title: 'No regular water supply for 3 months', category: 'water', ward: 42, severity: 9, urgency: 10, aiConfidence: 95, priorityScore: 94, status: 'in-progress', citizensAffected: 1240, reported: '2 days ago', lat: 25.6161, lng: 85.0967 },
  { id: 'PC-8802', title: 'Garbage overflowing at three collection points', category: 'garbage', ward: 18, severity: 8, urgency: 7, aiConfidence: 92, priorityScore: 91, status: 'verified', citizensAffected: 860, reported: '1 day ago', lat: 25.6127, lng: 85.1339 },
  { id: 'PC-8803', title: 'Deep potholes along the main stretch', category: 'road', ward: 35, severity: 8, urgency: 8, aiConfidence: 90, priorityScore: 88, status: 'verified', citizensAffected: 640, reported: '3 days ago', lat: 25.6117, lng: 85.1192 },
  { id: 'PC-8804', title: 'Drain blocked, water pooling on the road', category: 'waterlogging', ward: 42, severity: 8, urgency: 9, aiConfidence: 94, priorityScore: 86, status: 'pending', citizensAffected: 410, reported: '6 hours ago', lat: 25.6139, lng: 85.1006 },
  { id: 'PC-8805', title: 'Frequent unscheduled power cuts', category: 'electricity', ward: 8, severity: 6, urgency: 6, aiConfidence: 88, priorityScore: 68, status: 'in-progress', citizensAffected: 520, reported: '4 days ago', lat: 25.6091, lng: 85.0851 },
  { id: 'PC-8806', title: 'Long queues, understaffed primary health centre', category: 'healthcare', ward: 12, severity: 7, urgency: 6, aiConfidence: 85, priorityScore: 74, status: 'pending', citizensAffected: 380, reported: '5 days ago', lat: 25.5877, lng: 85.1571 },
  { id: 'PC-8807', title: 'Public toilet block unusable for weeks', category: 'sanitation', ward: 35, severity: 6, urgency: 5, aiConfidence: 89, priorityScore: 61, status: 'resolved', citizensAffected: 300, reported: '9 days ago', lat: 25.6101, lng: 85.1157 },
  { id: 'PC-8808', title: 'Broken railing near the canal footpath', category: 'safety', ward: 12, severity: 6, urgency: 6, aiConfidence: 87, priorityScore: 66, status: 'verified', citizensAffected: 130, reported: '2 days ago', lat: 25.5897, lng: 85.1528 },
  { id: 'PC-8809', title: 'Streetlights out along the colony road', category: 'streetlight', ward: 24, severity: 5, urgency: 4, aiConfidence: 91, priorityScore: 58, status: 'verified', citizensAffected: 210, reported: '6 days ago', lat: 25.6132, lng: 85.1431 },
  { id: 'PC-8810', title: 'School boundary wall collapsed in one section', category: 'school', ward: 18, severity: 5, urgency: 4, aiConfidence: 86, priorityScore: 52, status: 'verified', citizensAffected: 90, reported: '8 days ago', lat: 25.6106, lng: 85.1368 },
  { id: 'PC-8811', title: 'No shelter or seating at the bus stand', category: 'transport', ward: 51, severity: 4, urgency: 3, aiConfidence: 83, priorityScore: 41, status: 'verified', citizensAffected: 150, reported: '7 days ago', lat: 25.6338, lng: 85.0401 },
  { id: 'PC-8812', title: 'Trees felled for encroachment near the park', category: 'environment', ward: 24, severity: 4, urgency: 3, aiConfidence: 81, priorityScore: 38, status: 'pending', citizensAffected: 75, reported: '10 days ago', lat: 25.6109, lng: 85.1467 },
];

function severityTier(score) {
  if (score >= 8) return 'critical';
  if (score >= 6) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

const SEVERITY_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABEL = { pending: 'Pending Review', verified: 'Verified', 'in-progress': 'In Progress', resolved: 'Resolved' };

function wardReportCount(wardId) {
  return REPORTS.filter(r => r.ward === wardId).length;
}

function wardCriticalCount(wardId) {
  return REPORTS.filter(r => r.ward === wardId && severityTier(r.severity) === 'critical').length;
}

function wardTopCategory(wardId) {
  const counts = {};
  REPORTS.filter(r => r.ward === wardId).forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.length ? CATEGORY_LABELS[sorted[0][0]] : '—';
}

// Illustrative city-wide figures (prototype data, larger scale than the sample reports above)
const CITY_STATS = {
  totalReports: 12420,
  resolved: 8210,
  hotspots: 42,
  criticalIssues: 342,
  wardTotals: [
    { ward: 42, count: 1284 }, { ward: 18, count: 920 }, { ward: 35, count: 840 },
    { ward: 12, count: 612 }, { ward: 24, count: 405 }, { ward: 8, count: 290 }, { ward: 51, count: 245 },
  ],
  categoryShare: [
    { key: 'garbage', pct: 31 }, { key: 'water', pct: 28 }, { key: 'road', pct: 17 },
    { key: 'drainage', pct: 14 }, { key: 'other', pct: 10 },
  ],
};

/* ---------- 3. Local storage helpers ---------- */
const LS_SUPPORTED = 'nagrik_my_supported';

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

function supportReport(id) {
  const list = readList(LS_SUPPORTED);
  if (!list.includes(id)) {
    list.push(id);
    writeList(LS_SUPPORTED, list);
  }
}

function isSupportedByYou(id) {
  return readList(LS_SUPPORTED).includes(id);
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

/* ---------- 7. Home page ---------- */
function renderCategoryGrid() {
  const mount = document.getElementById('categoryGrid');
  if (!mount) return;
  mount.innerHTML = CATEGORIES.map(cat => `
    <a class="category-tile" href="report.html?category=${cat.key}">
      <span class="category-tile__icon">${iconFor(cat.icon || cat.key)}</span>
      <span class="category-tile__label">${cat.label}</span>
    </a>
  `).join('');
}

function issuePhotoMarkup(report) {
  const tier = severityTier(report.severity);
  return `
    <div class="task-card__photo" data-cat="${report.category}">
      ${catIcon(report.category)}
      <span class="task-card__status task-card__status--${tier}">${SEVERITY_LABEL[tier]}</span>
      <span class="task-card__reward">${report.priorityScore}/100</span>
    </div>`;
}

function renderPriorityPreview() {
  const mount = document.getElementById('priorityPreview');
  if (!mount) return;
  const top = [...REPORTS].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);
  mount.innerHTML = top.map(report => `
    <article class="task-card">
      ${issuePhotoMarkup(report)}
      <div class="task-card__body">
        <div class="task-card__cat">${CATEGORY_LABELS[report.category]} &middot; Ward ${report.ward}</div>
        <h3 class="task-card__title">${report.title}</h3>
        <div class="task-card__loc">${ICONS.pin}<span>${wardById(report.ward).locality}, Patna</span></div>
        <div class="task-card__foot">
          <span class="task-card__reported">${report.citizensAffected.toLocaleString('en-IN')} citizens affected</span>
          <a href="tasks.html" class="btn btn--secondary btn--sm">View</a>
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

/* ---------- 8. Explore page: render, filter, support ---------- */
let activeStatusFilter = 'all';
let activeCategoryFilter = 'all';

function renderIssueGrid() {
  const mount = document.getElementById('taskGrid');
  if (!mount) return;
  const filtered = REPORTS.filter(r => {
    const statusOk = activeStatusFilter === 'all' || r.status === activeStatusFilter;
    const catOk = activeCategoryFilter === 'all' || r.category === activeCategoryFilter;
    return statusOk && catOk;
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  if (!filtered.length) {
    mount.innerHTML = `<div class="task-empty">No reports match these filters yet. Try a different category or status.</div>`;
    return;
  }

  mount.innerHTML = filtered.map(report => {
    const supported = isSupportedByYou(report.id);
    const count = report.citizensAffected + (supported ? 1 : 0);
    return `
    <article class="task-card" data-id="${report.id}">
      ${issuePhotoMarkup(report)}
      <div class="task-card__body">
        <div class="task-card__cat">${CATEGORY_LABELS[report.category]} &middot; Ward ${report.ward}</div>
        <h3 class="task-card__title">${report.title}</h3>
        <div class="task-card__loc">${ICONS.pin}<span>${wardById(report.ward).locality}, Patna</span></div>
        <div class="task-card__foot">
          <span class="task-card__reported" data-count-for="${report.id}">${count.toLocaleString('en-IN')} affected</span>
          ${supportButtonMarkup(report, supported)}
        </div>
      </div>
    </article>
  `;
  }).join('');

  mount.querySelectorAll('[data-support-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-support-id');
      supportReport(id);
      showToast('Added — "I have this problem too" recorded.');
      renderIssueGrid();
    });
  });
}

function supportButtonMarkup(report, supported) {
  if (report.status === 'resolved') {
    return `<button class="btn btn--taken btn--sm" disabled>${ICONS.check} Resolved</button>`;
  }
  if (supported) {
    return `<button class="btn btn--claimed btn--sm" disabled>${ICONS.check} You reported this</button>`;
  }
  return `<button class="btn btn--primary btn--sm" data-support-id="${report.id}">I Have This Too</button>`;
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
      renderIssueGrid();
    });
  });

  if (select) {
    select.innerHTML = '<option value="all">All categories</option>' +
      CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
    select.addEventListener('change', () => {
      activeCategoryFilter = select.value;
      renderIssueGrid();
    });
  }
}

/* ---------- 9. Dashboard: stats, map, priority list, charts ---------- */
function renderDashboardStats() {
  const map = { statTotal: CITY_STATS.totalReports, statCritical: CITY_STATS.criticalIssues, statHotspots: CITY_STATS.hotspots, statResolved: CITY_STATS.resolved };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val.toLocaleString('en-IN');
  });
}

function severityColor(tier) {
  return { critical: 'var(--color-danger)', high: 'var(--color-marigold-dark)', medium: 'var(--color-amber)', low: 'var(--color-forest)' }[tier];
}

function wardSeverityTier(wardId) {
  const reports = REPORTS.filter(r => r.ward === wardId);
  if (!reports.length) return 'low';
  const maxSeverity = Math.max(...reports.map(r => r.severity));
  return severityTier(maxSeverity);
}

function initDashboardMap() {
  const el = document.getElementById('civicMap');
  if (!el || typeof L === 'undefined') return;

  const map = L.map(el, { scrollWheelZoom: false }).setView([25.6035, 85.1105], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  WARDS.forEach(ward => {
    const tier = wardSeverityTier(ward.id);
    const count = wardReportCount(ward.id);
    const radius = 10 + count * 2.2;
    const marker = L.circleMarker([ward.lat, ward.lng], {
      radius,
      color: severityColor(tier),
      weight: 2,
      fillColor: severityColor(tier),
      fillOpacity: 0.35,
    }).addTo(map);

    marker.bindPopup(wardPopupMarkup(ward, tier, count));
    marker.on('click', () => showWardIntelligence(ward.id));
  });

  REPORTS.forEach(report => {
    const tier = severityTier(report.severity);
    L.circleMarker([report.lat, report.lng], {
      radius: 5,
      color: severityColor(tier),
      weight: 1.5,
      fillColor: '#fff',
      fillOpacity: 0.9,
    }).addTo(map).bindPopup(reportPopupMarkup(report));
  });

  const bounds = L.latLngBounds(WARDS.map(w => [w.lat, w.lng]));
  map.fitBounds(bounds, { padding: [40, 40] });
}

function wardPopupMarkup(ward, tier, count) {
  return `
    <div class="map-popup">
      <strong>Ward ${ward.id} &mdash; ${ward.locality}</strong>
      <span class="severity-pill severity-pill--${tier}">${SEVERITY_LABEL[tier]} concentration</span>
      <p>${count} active reports &middot; Population ${ward.population.toLocaleString('en-IN')}</p>
      <p>Infrastructure: ${ward.infra}</p>
    </div>`;
}

function reportPopupMarkup(report) {
  const tier = severityTier(report.severity);
  return `
    <div class="map-popup">
      <strong>${report.title}</strong>
      <span class="severity-pill severity-pill--${tier}">${CATEGORY_LABELS[report.category]}</span>
      <p>Priority ${report.priorityScore}/100 &middot; ${STATUS_LABEL[report.status]}</p>
    </div>`;
}

function showWardIntelligence(wardId) {
  const panel = document.getElementById('wardIntelligence');
  if (!panel) return;
  const ward = wardById(wardId);
  const reports = REPORTS.filter(r => r.ward === wardId);
  const critical = reports.filter(r => severityTier(r.severity) === 'critical').length;
  const high = reports.filter(r => severityTier(r.severity) === 'high').length;
  const topCat = wardTopCategory(wardId);
  const avgPriority = reports.length ? Math.round(reports.reduce((s, r) => s + r.priorityScore, 0) / reports.length) : 0;

  panel.innerHTML = `
    <h3>Ward ${ward.id} &mdash; ${ward.locality}</h3>
    <div class="stat-line">
      <div><strong>${reports.length}</strong><span>Sample reports</span></div>
      <div><strong>${critical}</strong><span>Critical</span></div>
      <div><strong>${high}</strong><span>High</span></div>
      <div><strong>${avgPriority}</strong><span>Avg. priority</span></div>
    </div>
    <p class="ward-summary">Most-reported category here is <strong>${topCat}</strong>. Population of ${ward.population.toLocaleString('en-IN')} against ${ward.infra.toLowerCase()} existing infrastructure keeps this ward's average priority elevated &mdash; recommend prioritising ${topCat.toLowerCase()} assessment before the next monsoon cycle.</p>
  `;
  panel.classList.add('is-active');
}

function renderPriorityList() {
  const mount = document.getElementById('priorityList');
  if (!mount) return;
  const top = [...REPORTS].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 6);
  mount.innerHTML = top.map((report, i) => {
    const tier = severityTier(report.severity);
    return `
    <div class="claim-row">
      <div class="claim-row__photo" data-cat="${report.category}">${catIcon(report.category)}</div>
      <div class="claim-row__info">
        <strong>#${i + 1} &middot; ${CATEGORY_LABELS[report.category]} &mdash; Ward ${report.ward}</strong>
        <span>${report.title}</span>
      </div>
      <span class="claim-row__reward">${report.priorityScore}/100</span>
      <span class="severity-pill severity-pill--${tier}">${SEVERITY_LABEL[tier]}</span>
    </div>`;
  }).join('');
}

function renderCategoryChart() {
  const mount = document.getElementById('categoryChart');
  if (!mount) return;
  mount.innerHTML = CITY_STATS.categoryShare.map(row => `
    <div class="bar-row">
      <span class="bar-row__label">${CATEGORY_LABELS[row.key]}</span>
      <span class="bar-row__track"><span class="bar-row__fill" style="width:${row.pct}%"></span></span>
      <span class="bar-row__pct">${row.pct}%</span>
    </div>
  `).join('');
}

function renderWardList() {
  const mount = document.getElementById('wardList');
  if (!mount) return;
  mount.innerHTML = CITY_STATS.wardTotals.map(row => {
    const ward = wardById(row.ward);
    return `
    <div class="claim-row">
      <div class="claim-row__photo" data-cat="ward">${row.ward}</div>
      <div class="claim-row__info">
        <strong>Ward ${row.ward} &mdash; ${ward.locality}</strong>
        <span>${wardTopCategory(row.ward)} leads complaints here</span>
      </div>
      <span class="claim-row__reward">${row.count.toLocaleString('en-IN')}</span>
    </div>`;
  }).join('');
}

/* ---------- 10. Report page: validation + simulated AI pipeline ---------- */
function populateCategorySelect() {
  const select = document.getElementById('reportCategory');
  if (!select) return;
  select.innerHTML = '<option value="" selected disabled>Choose the type of issue</option>' +
    CATEGORIES.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
  const params = new URLSearchParams(window.location.search);
  const preset = params.get('category');
  if (preset && CATEGORY_LABELS[preset]) select.value = preset;
}

const KEYWORD_MAP = [
  { cat: 'water', words: ['water', 'paani', 'pani', 'supply', 'tap'] },
  { cat: 'drainage', words: ['drain', 'sewage', 'nali'] },
  { cat: 'waterlogging', words: ['waterlog', 'flood', 'jalbharav', 'submerg'] },
  { cat: 'garbage', words: ['garbage', 'trash', 'waste', 'kachra', 'litter', 'dump'] },
  { cat: 'road', words: ['road', 'pothole', 'sadak', 'street damage'] },
  { cat: 'electricity', words: ['electric', 'power cut', 'bijli', 'transformer'] },
  { cat: 'streetlight', words: ['streetlight', 'street light', 'lamp', 'lighting'] },
  { cat: 'healthcare', words: ['hospital', 'health', 'clinic', 'doctor'] },
  { cat: 'transport', words: ['bus', 'transport', 'auto stand'] },
  { cat: 'school', words: ['school', 'classroom'] },
  { cat: 'sanitation', words: ['toilet', 'sanitation', 'sewer'] },
  { cat: 'environment', words: ['tree', 'park', 'environment', 'pollution'] },
  { cat: 'safety', words: ['unsafe', 'accident', 'safety', 'crime'] },
];

function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const entry of KEYWORD_MAP) {
    if (entry.words.some(w => lower.includes(w))) return entry.cat;
  }
  return null;
}

function initReportForm() {
  const form = document.getElementById('reportForm');
  if (!form) return;

  populateCategorySelect();

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

  const locBtn = document.getElementById('useLocationBtn');
  const locResult = document.getElementById('locationResult');
  if (locBtn) {
    locBtn.addEventListener('click', () => {
      locBtn.disabled = true;
      locBtn.textContent = 'Detecting location…';
      const finish = (position) => {
        if (position && position.coords) {
          capturedCoords = { lat: position.coords.latitude, lng: position.coords.longitude };
        }
        const ward = WARDS[Math.floor(Math.random() * WARDS.length)];
        document.getElementById('reportLocation').value = `${ward.locality}, Ward ${ward.id}, Patna`;
        if (locResult) {
          locResult.innerHTML = `${ICONS.pin} Detected: <strong>${ward.locality}, Ward ${ward.id}</strong>`;
          locResult.classList.add('is-visible');
        }
        locBtn.textContent = 'Location detected';
        clearFieldError('reportLocation');
      };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(finish, () => finish(null), { timeout: 4000 });
      } else {
        finish(null);
      }
    });
  }

  const requiredFields = [
    { id: 'reportTitle', message: 'Please describe the problem in a few words.' },
    { id: 'reportLocation', message: 'Please tell us where the issue is, or use current location.' },
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
    runAiPipeline(form);
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
}

/* ---------- 10b. Supabase integration (report submissions) ---------- */
const SUPABASE_URL = 'https://nixqmoiadhjcngygrwuh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QQaeeeNoC6OuSAnO9yt5-A_Nfb1y15Q';
let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

async function saveReportToSupabase(record) {
  if (!supabaseClient) {
    showToast('Saved locally — Supabase library did not load, so nothing was sent to the database.');
    return;
  }
  const { error } = await supabaseClient.from('reports').insert([record]);
  if (error) {
    console.error('Supabase insert failed:', error);
    showToast("Report shown here, but the database save failed — check your Supabase table/policies.");
  } else {
    showToast('Report saved to your Supabase database.');
  }
}

let capturedCoords = null;

const PIPELINE_STEPS = [
  'Reading description and photo…',
  'Detecting category and location…',
  'Estimating severity and urgency…',
  'Checking nearby reports for duplicates…',
  'Assigning ward and priority score…',
];

function runAiPipeline(form) {
  const processingPanel = document.getElementById('processingPanel');
  const successPanel = document.getElementById('successPanel');
  const stepList = document.getElementById('pipelineSteps');
  form.style.display = 'none';

  if (!processingPanel || !stepList) {
    revealResult(form);
    return;
  }

  processingPanel.classList.add('is-visible');
  stepList.innerHTML = PIPELINE_STEPS.map((s, i) => `<li data-step="${i}">${s}</li>`).join('');
  const items = stepList.querySelectorAll('li');

  items.forEach((li, i) => {
    setTimeout(() => {
      li.classList.add('is-done');
      if (i === items.length - 1) {
        setTimeout(() => {
          processingPanel.classList.remove('is-visible');
          revealResult(form);
        }, 450);
      }
    }, 500 * (i + 1));
  });
}

function revealResult(form) {
  const successPanel = document.getElementById('successPanel');
  const reportId = 'PC-' + Math.floor(1000 + Math.random() * 9000);

  const titleEl = document.getElementById('reportTitle');
  const descEl = document.getElementById('reportDescription');
  const catEl = document.getElementById('reportCategory');
  const locEl = document.getElementById('reportLocation');
  const text = `${titleEl ? titleEl.value : ''} ${descEl ? descEl.value : ''}`;
  const detected = detectCategory(text) || (catEl ? catEl.value : 'other') || 'other';
  const severity = 5 + Math.floor(Math.random() * 5);
  const urgency = Math.min(10, severity + (Math.random() > 0.5 ? 1 : 0));
  const confidence = 84 + Math.floor(Math.random() * 13);
  const duplicates = 8 + Math.floor(Math.random() * 55);
  const ward = WARDS[Math.floor(Math.random() * WARDS.length)];
  const tier = severityTier(severity);
  const priorityScore = Math.min(99, Math.round((severity + urgency) * 5 + confidence / 10));

  const idEl = document.getElementById('successId');
  if (idEl) idEl.textContent = '#' + reportId;

  const grid = document.getElementById('analysisGrid');
  if (grid) {
    grid.innerHTML = `
      <div><strong class="analysis-grid__value">${CATEGORY_LABELS[detected] || 'Other'}</strong><span>Category detected</span></div>
      <div><strong class="analysis-grid__value severity-pill severity-pill--${tier}">${SEVERITY_LABEL[tier]}</strong><span>Severity ${severity}/10</span></div>
      <div><strong class="analysis-grid__value">${urgency}/10</strong><span>Urgency</span></div>
      <div><strong class="analysis-grid__value">${confidence}%</strong><span>AI confidence</span></div>
      <div><strong class="analysis-grid__value">Ward ${ward.id}</strong><span>${ward.locality}</span></div>
      <div><strong class="analysis-grid__value">${duplicates}</strong><span>Similar reports nearby</span></div>
    `;
  }

  if (successPanel) successPanel.classList.add('is-visible');

  saveReportToSupabase({
    display_id: reportId,
    title: titleEl ? titleEl.value : '',
    description: descEl ? descEl.value : '',
    category: detected,
    location_text: locEl ? locEl.value : '',
    ward: ward.id,
    latitude: capturedCoords ? capturedCoords.lat : null,
    longitude: capturedCoords ? capturedCoords.lng : null,
    severity,
    urgency,
    ai_confidence: confidence,
    priority_score: priorityScore,
    status: 'pending',
    citizens_affected: 1,
  });

  capturedCoords = null;
}

function resetReportForm() {
  const form = document.getElementById('reportForm');
  const successPanel = document.getElementById('successPanel');
  const preview = document.getElementById('uploadPreview');
  const locResult = document.getElementById('locationResult');
  const locBtn = document.getElementById('useLocationBtn');
  if (!form) return;
  form.reset();
  form.style.display = '';
  document.querySelectorAll('.form-row.has-error, .form-control.has-error').forEach(el => el.classList.remove('has-error'));
  if (successPanel) successPanel.classList.remove('is-visible');
  if (preview) preview.classList.remove('is-visible');
  if (locResult) locResult.classList.remove('is-visible');
  if (locBtn) { locBtn.disabled = false; locBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.5"/></svg> Use My Current Location'; }
}

/* ---------- 11. Language toggle (EN/HI) ---------- */
const LS_LANG = 'nagrik_lang';

const TRANSLATIONS = {
  en: {
    'nav.home': 'Home', 'nav.report': 'Report a Problem', 'nav.explore': 'Explore Issues',
    'nav.dashboard': 'Dashboard', 'nav.about': 'About',
    'footer.tagline': 'An AI civic intelligence platform that turns citizen reports into verified, prioritized infrastructure action for Patna, Bihar.',
    'footer.platform': 'Platform', 'footer.company': 'Company', 'footer.getinvolved': 'Get Involved',
    'footer.credit': 'Patna Civic Intelligence \u00b7 Prototype',
    'home.eyebrow': 'Patna civic intelligence',
    'home.h1.pre': 'Turn Citizen Reports Into', 'home.h1.accent': 'Infrastructure Priorities',
    'home.lede': "Report a civic problem in a minute. AI verifies it, clusters it with similar reports nearby, and surfaces the wards that need attention most \u2014 so Patna's authorities know exactly where to act first.",
    'home.cta1': 'Report a Problem', 'home.cta2': 'Explore Civic Issues',
    'home.meta1': 'Problems reported', 'home.meta2': 'Problems resolved', 'home.meta3': 'Active hotspots',
    'home.how.eyebrow': 'How it works', 'home.how.h2': 'From a single report to a city-wide priority',
    'home.step1.title': 'Report What You See', 'home.step2.title': 'AI Reads, Scores and Clusters It', 'home.step3.title': 'Authorities Act on the Hotspot',
    'home.category.eyebrow': 'Report anything civic', 'home.category.h2': 'Fourteen categories, one pipeline',
    'home.priority.eyebrow': 'Live from Patna', 'home.priority.h2': 'Top of the priority list right now',
    'home.testimonials.eyebrow': 'Voices from Patna', 'home.testimonials.h2': 'What people are saying',
    'home.cta.h2': 'Seen a problem worth flagging?', 'home.cta.p': "Report it in a minute, or browse what's already been reported near you and add your voice to it.",
    'report.eyebrow': 'Report a problem', 'report.h1': "Tell us what's wrong",
    'report.lede': 'A title, a location and a photo are enough to get started \u2014 the AI pipeline handles category, severity and routing from there.',
    'report.title.label': 'What is wrong?', 'report.title.placeholder': 'e.g. Drainage blocked near my locality',
    'report.location.label': 'Location', 'report.location.placeholder': 'Street, landmark or locality name', 'report.location.btn': 'Use My Current Location',
    'report.category.label': 'Category', 'report.category.placeholder': 'Choose the type of issue',
    'report.category.hint': 'Not sure? Pick your best guess \u2014 the AI will confirm or correct it.',
    'report.description.label': 'Description', 'report.description.placeholder': "What's happening, how long it's been going on, and anything authorities should know.",
    'report.description.hint': 'Minimum 20 characters. Hindi and Hinglish are fine.',
    'report.photo.label': 'Photo', 'report.upload.text': 'Click to upload or drag a photo here', 'report.upload.hint': 'PNG or JPG, up to 10MB',
    'report.submit': 'Submit Report', 'report.mic.label': 'Speak',
    'tasks.eyebrow': 'Explore civic issues', 'tasks.h1': "See what's already been reported",
    'tasks.lede': "Every card is a verified or pending report from somewhere in Patna, ranked by priority score. Spot your own problem here? Add your voice instead of filing a duplicate.",
    'dashboard.eyebrow': 'Civic intelligence dashboard', 'dashboard.h1': 'Patna, ward by ward',
    'dashboard.lede': "Evidence-based priorities drawn from every verified citizen report \u2014 not just where complaints are loudest, but where they matter most.",
    'about.eyebrow': 'About Nagrik', 'about.h1': "Complaints alone don't fix a city",
    'about.lede': 'Nagrik exists because a citizen reporting a problem and a government prioritizing it used to be two completely disconnected acts. We built the pipeline between them \u2014 verification, clustering, scoring \u2014 so a report becomes evidence, not noise.',
  },
  hi: {
    'nav.home': '\u0939\u094b\u092e', 'nav.report': '\u0938\u092e\u0938\u094d\u092f\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902', 'nav.explore': '\u0938\u092e\u0938\u094d\u092f\u093e\u090f\u0902 \u0926\u0947\u0916\u0947\u0902',
    'nav.dashboard': '\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921', 'nav.about': '\u0939\u092e\u093e\u0930\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902',
    'footer.tagline': '\u090f\u0915 \u090f\u0906\u0908 \u0928\u093e\u0917\u0930\u093f\u0915 \u092c\u0941\u0926\u094d\u0927\u093f\u092e\u0924\u094d\u0924\u093e \u092a\u094d\u0932\u0947\u091f\u092b\u093c\u0949\u0930\u094d\u092e \u091c\u094b \u092a\u091f\u0928\u093e, \u092c\u093f\u0939\u093e\u0930 \u0915\u0947 \u0932\u093f\u090f \u0928\u093e\u0917\u0930\u093f\u0915\u094b\u0902 \u0915\u0940 \u0936\u093f\u0915\u093e\u092f\u0924\u094b\u0902 \u0915\u094b \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924, \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e-\u092a\u094d\u0930\u093e\u092a\u094d\u0924 \u092c\u0941\u0928\u093f\u092f\u093e\u0926\u0940 \u0922\u093e\u0902\u091a\u0947 \u0915\u0940 \u0915\u093e\u0930\u094d\u0930\u0935\u093e\u0908 \u092e\u0947\u0902 \u092c\u0926\u0932\u0924\u093e \u0939\u0948\u0964',
    'footer.platform': '\u092a\u094d\u0932\u0947\u091f\u092b\u093c\u0949\u0930\u094d\u092e', 'footer.company': '\u0915\u0902\u092a\u0928\u0940', 'footer.getinvolved': '\u091c\u0941\u095c\u0947\u0902',
    'footer.credit': '\u092a\u091f\u0928\u093e \u0928\u093e\u0917\u0930\u093f\u0915 \u092c\u0941\u0926\u094d\u0927\u093f\u092e\u0924\u094d\u0924\u093e \u00b7 \u092a\u094d\u0930\u094b\u091f\u094b\u091f\u093e\u0907\u092a',
    'home.eyebrow': '\u092a\u091f\u0928\u093e \u0928\u093e\u0917\u0930\u093f\u0915 \u092c\u0941\u0926\u094d\u0927\u093f\u092e\u0924\u094d\u0924\u093e',
    'home.h1.pre': '\u0928\u093e\u0917\u0930\u093f\u0915 \u0936\u093f\u0915\u093e\u092f\u0924\u094b\u0902 \u0915\u094b', 'home.h1.accent': '\u092c\u0941\u0928\u093f\u092f\u093e\u0926\u0940 \u0922\u093e\u0902\u091a\u0947 \u0915\u0940 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e\u0913\u0902 \u092e\u0947\u0902 \u092c\u0926\u0932\u0947\u0902',
    'home.lede': '\u090f\u0915 \u092e\u093f\u0928\u091f \u092e\u0947\u0902 \u0928\u093e\u0917\u0930\u093f\u0915 \u0938\u092e\u0938\u094d\u092f\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902\u0964 \u090f\u0906\u0908 \u0907\u0938\u0947 \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0915\u0930\u0924\u093e \u0939\u0948, \u0906\u0938-\u092a\u093e\u0938 \u0915\u0940 \u092e\u093f\u0932\u0924\u0940-\u091c\u0941\u0932\u0924\u0940 \u0936\u093f\u0915\u093e\u092f\u0924\u094b\u0902 \u0915\u0947 \u0938\u093e\u0925 \u091c\u094b\u095c\u0924\u093e \u0939\u0948, \u0914\u0930 \u0938\u092c\u0938\u0947 \u091c\u094d\u092f\u093e\u0926\u093e \u0927\u094d\u092f\u093e\u0928 \u0926\u0947\u0928\u0947 \u092f\u094b\u0917\u094d\u092f \u0935\u093e\u0930\u094d\u0921\u094b\u0902 \u0915\u094b \u0938\u093e\u092e\u0928\u0947 \u0932\u093e\u0924\u093e \u0939\u0948 \u2014 \u0924\u093e\u0915\u093f \u092a\u091f\u0928\u093e \u0915\u0947 \u0905\u0927\u093f\u0915\u093e\u0930\u0940 \u091c\u093e\u0928 \u0938\u0915\u0947\u0902 \u0915\u093f \u092a\u0939\u0932\u0947 \u0915\u0939\u093e\u0902 \u0915\u093e\u0930\u094d\u0930\u0935\u093e\u0908 \u0915\u0930\u0928\u0940 \u0939\u0948\u0964',
    'home.cta1': '\u0938\u092e\u0938\u094d\u092f\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902', 'home.cta2': '\u0928\u093e\u0917\u0930\u093f\u0915 \u0938\u092e\u0938\u094d\u092f\u093e\u090f\u0902 \u0926\u0947\u0916\u0947\u0902',
    'home.meta1': '\u0926\u0930\u094d\u091c \u0938\u092e\u0938\u094d\u092f\u093e\u090f\u0902', 'home.meta2': '\u0938\u0941\u0932\u091d\u0940 \u0938\u092e\u0938\u094d\u092f\u093e\u090f\u0902', 'home.meta3': '\u0938\u0915\u094d\u0930\u093f\u092f \u0939\u0949\u091f\u0938\u094d\u092a\u0949\u091f',
    'home.how.eyebrow': '\u092f\u0939 \u0915\u0948\u0938\u0947 \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948', 'home.how.h2': '\u090f\u0915 \u0936\u093f\u0915\u093e\u092f\u0924 \u0938\u0947 \u0936\u0939\u0930-\u0935\u094d\u092f\u093e\u092a\u0940 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e \u0924\u0915',
    'home.step1.title': '\u091c\u094b \u0926\u0947\u0916\u0947\u0902, \u0935\u0939 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902', 'home.step2.title': '\u090f\u0906\u0908 \u092a\u095d\u0924\u093e, \u0906\u0902\u0915\u0924\u093e \u0914\u0930 \u091c\u094b\u095c\u0924\u093e \u0939\u0948', 'home.step3.title': '\u0905\u0927\u093f\u0915\u093e\u0930\u0940 \u0939\u0949\u091f\u0938\u094d\u092a\u0949\u091f \u092a\u0930 \u0915\u093e\u0930\u094d\u0930\u0935\u093e\u0908 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902',
    'home.category.eyebrow': '\u0915\u094b\u0908 \u092d\u0940 \u0928\u093e\u0917\u0930\u093f\u0915 \u0938\u092e\u0938\u094d\u092f\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902', 'home.category.h2': '\u091a\u094c\u0926\u0939 \u0936\u094d\u0930\u0947\u0923\u093f\u092f\u093e\u0902, \u090f\u0915 \u092a\u093e\u0907\u092a\u0932\u093e\u0907\u0928',
    'home.priority.eyebrow': '\u092a\u091f\u0928\u093e \u0938\u0947 \u0932\u093e\u0907\u0935', 'home.priority.h2': '\u0905\u092d\u0940 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e \u0938\u0942\u091a\u0940 \u092e\u0947\u0902 \u0938\u092c\u0938\u0947 \u090a\u092a\u0930',
    'home.testimonials.eyebrow': '\u092a\u091f\u0928\u093e \u0915\u0940 \u0906\u0935\u093e\u091c\u0947\u0902', 'home.testimonials.h2': '\u0932\u094b\u0917 \u0915\u094d\u092f\u093e \u0915\u0939 \u0930\u0939\u0947 \u0939\u0948\u0902',
    'home.cta.h2': '\u0915\u094b\u0908 \u0938\u092e\u0938\u094d\u092f\u093e \u0928\u091c\u093c\u0930 \u0906\u0908?', 'home.cta.p': '\u090f\u0915 \u092e\u093f\u0928\u091f \u092e\u0947\u0902 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902, \u092f\u093e \u0905\u092a\u0928\u0947 \u0906\u0938-\u092a\u093e\u0938 \u092a\u0939\u0932\u0947 \u0938\u0947 \u0926\u0930\u094d\u091c \u0938\u092e\u0938\u094d\u092f\u093e\u090f\u0902 \u0926\u0947\u0916\u0947\u0902 \u0914\u0930 \u0909\u0928\u0915\u093e \u0938\u092e\u0930\u094d\u0925\u0928 \u0915\u0930\u0947\u0902\u0964',
    'report.eyebrow': '\u0938\u092e\u0938\u094d\u092f\u093e \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902', 'report.h1': '\u092c\u0924\u093e\u090f\u0902 \u0915\u094d\u092f\u093e \u0917\u095c\u092c\u095c\u0940 \u0939\u0948',
    'report.lede': '\u090f\u0915 \u0936\u0940\u0930\u094d\u0937\u0915, \u090f\u0915 \u0938\u094d\u0925\u093e\u0928 \u0914\u0930 \u090f\u0915 \u092b\u093c\u094b\u091f\u094b \u0936\u0941\u0930\u0941\u0906\u0924 \u0915\u0947 \u0932\u093f\u090f \u0915\u093e\u092b\u093c\u0940 \u0939\u0948 \u2014 \u090f\u0906\u0908 \u092a\u093e\u0907\u092a\u0932\u093e\u0907\u0928 \u0936\u094d\u0930\u0947\u0923\u0940, \u0917\u0902\u092d\u0940\u0930\u0924\u093e \u0914\u0930 \u0930\u0942\u091f\u093f\u0902\u0917 \u0916\u0941\u0926 \u0938\u0902\u092d\u093e\u0932\u0924\u093e \u0939\u0948\u0964',
    'report.title.label': '\u0915\u094d\u092f\u093e \u0938\u092e\u0938\u094d\u092f\u093e \u0939\u0948?', 'report.title.placeholder': '\u091c\u0948\u0938\u0947: \u092e\u0947\u0930\u0947 \u092e\u094b\u0939\u0932\u094d\u0932\u0947 \u0915\u0947 \u092a\u093e\u0938 \u0928\u093e\u0932\u0940 \u091c\u093e\u092e \u0939\u0948',
    'report.location.label': '\u0938\u094d\u0925\u093e\u0928', 'report.location.placeholder': '\u0938\u095c\u0915, \u0932\u0948\u0902\u0921\u092e\u093e\u0930\u094d\u0915 \u092f\u093e \u092e\u094b\u0939\u0932\u094d\u0932\u0947 \u0915\u093e \u0928\u093e\u092e', 'report.location.btn': '\u092e\u0947\u0930\u0940 \u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u0932\u094b\u0915\u0947\u0936\u0928 \u0915\u093e \u0909\u092a\u092f\u094b\u0917 \u0915\u0930\u0947\u0902',
    'report.category.label': '\u0936\u094d\u0930\u0947\u0923\u0940', 'report.category.placeholder': '\u0938\u092e\u0938\u094d\u092f\u093e \u0915\u093e \u092a\u094d\u0930\u0915\u093e\u0930 \u091a\u0941\u0928\u0947\u0902',
    'report.category.hint': '\u092a\u0915\u094d\u0915\u093e \u0928\u0939\u0940\u0902 \u0939\u0948? \u0905\u092a\u0928\u093e \u0905\u0928\u0941\u092e\u093e\u0928 \u091a\u0941\u0928\u0947\u0902 \u2014 \u090f\u0906\u0908 \u092a\u0941\u0937\u094d\u091f\u093f \u092f\u093e \u0938\u0941\u0927\u093e\u0930 \u0915\u0930 \u0926\u0947\u0917\u093e\u0964',
    'report.description.label': '\u0935\u093f\u0935\u0930\u0923', 'report.description.placeholder': '\u0915\u094d\u092f\u093e \u0939\u094b \u0930\u0939\u093e \u0939\u0948, \u0915\u092c \u0938\u0947 \u091a\u0932 \u0930\u0939\u093e \u0939\u0948, \u0914\u0930 \u0905\u0927\u093f\u0915\u093e\u0930\u093f\u092f\u094b\u0902 \u0915\u094b \u0915\u094d\u092f\u093e \u092a\u0924\u093e \u0939\u094b\u0928\u093e \u091a\u093e\u0939\u093f\u090f\u0964',
    'report.description.hint': '\u0915\u092e \u0938\u0947 \u0915\u092e 20 \u0905\u0915\u094d\u0937\u0930\u0964 \u0939\u093f\u0902\u0926\u0940 \u0914\u0930 \u0939\u093f\u0902\u0917\u094d\u0932\u093f\u0936, \u0926\u094b\u0928\u094b\u0902 \u0920\u0940\u0915 \u0939\u0948\u0902\u0964',
    'report.photo.label': '\u092b\u093c\u094b\u091f\u094b', 'report.upload.text': '\u092b\u093c\u094b\u091f\u094b \u0905\u092a\u0932\u094b\u0921 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0915\u094d\u0932\u093f\u0915 \u0915\u0930\u0947\u0902 \u092f\u093e \u092f\u0939\u093e\u0902 \u0916\u0940\u0902\u091a\u0947\u0902', 'report.upload.hint': 'PNG \u092f\u093e JPG, 10MB \u0924\u0915',
    'report.submit': '\u0930\u093f\u092a\u094b\u0930\u094d\u091f \u0938\u092c\u092e\u093f\u091f \u0915\u0930\u0947\u0902', 'report.mic.label': '\u092c\u094b\u0932\u0947\u0902',
    'tasks.eyebrow': '\u0928\u093e\u0917\u0930\u093f\u0915 \u0938\u092e\u0938\u094d\u092f\u093e\u090f\u0902 \u0926\u0947\u0916\u0947\u0902', 'tasks.h1': '\u0926\u0947\u0916\u0947\u0902 \u0905\u092c \u0924\u0915 \u0915\u094d\u092f\u093e \u0926\u0930\u094d\u091c \u0939\u0941\u0906 \u0939\u0948',
    'tasks.lede': '\u0939\u0930 \u0915\u093e\u0930\u094d\u0921 \u092a\u091f\u0928\u093e \u092e\u0947\u0902 \u0915\u0939\u0940\u0902 \u0915\u0940 \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u092f\u093e \u0932\u0902\u092c\u093f\u0924 \u0936\u093f\u0915\u093e\u092f\u0924 \u0939\u0948, \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e \u0938\u094d\u0915\u094b\u0930 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u0915\u094d\u0930\u092e\u092c\u0926\u094d\u0927\u0964 \u092f\u0939\u093e\u0902 \u0905\u092a\u0928\u0940 \u0938\u092e\u0938\u094d\u092f\u093e \u0926\u093f\u0916\u0940? \u0921\u0941\u092a\u094d\u0932\u0940\u0915\u0947\u091f \u0926\u0930\u094d\u091c \u0915\u0930\u0928\u0947 \u0915\u0947 \u092c\u091c\u093e\u092f \u0905\u092a\u0928\u093e \u0938\u092e\u0930\u094d\u0925\u0928 \u091c\u094b\u095c\u0947\u0902\u0964',
    'dashboard.eyebrow': '\u0928\u093e\u0917\u0930\u093f\u0915 \u092c\u0941\u0926\u094d\u0927\u093f\u092e\u0924\u094d\u0924\u093e \u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921', 'dashboard.h1': '\u092a\u091f\u0928\u093e, \u0935\u093e\u0930\u094d\u0921 \u0926\u0930 \u0935\u093e\u0930\u094d\u0921',
    'dashboard.lede': '\u0939\u0930 \u0938\u0924\u094d\u092f\u093e\u092a\u093f\u0924 \u0928\u093e\u0917\u0930\u093f\u0915 \u0936\u093f\u0915\u093e\u092f\u0924 \u0938\u0947 \u0928\u093f\u0915\u0932\u0940 \u092a\u094d\u0930\u092e\u093e\u0923-\u0906\u0927\u093e\u0930\u093f\u0924 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e\u090f\u0902 \u2014 \u0938\u093f\u0930\u094d\u095e \u0935\u0939\u093e\u0902 \u0928\u0939\u0940\u0902 \u091c\u0939\u093e\u0902 \u0936\u093f\u0915\u093e\u092f\u0924\u0947\u0902 \u0938\u092c\u0938\u0947 \u091c\u094d\u092f\u093e\u0926\u093e \u0939\u0948\u0902, \u092c\u0932\u094d\u0915\u093f \u0935\u0939\u093e\u0902 \u091c\u0939\u093e\u0902 \u0935\u0947 \u0938\u092c\u0938\u0947 \u092e\u093e\u092f\u0928\u0947 \u0930\u0916\u0924\u0940 \u0939\u0948\u0902\u0964',
    'about.eyebrow': '\u0928\u093e\u0917\u0930\u093f\u0915 \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902', 'about.h1': '\u0938\u093f\u0930\u094d\u095e \u0936\u093f\u0915\u093e\u092f\u0924 \u0938\u0947 \u0936\u0939\u0930 \u0928\u0939\u0940\u0902 \u0938\u0941\u0927\u0930\u0924\u093e',
    'about.lede': '\u0928\u093e\u0917\u0930\u093f\u0915 \u0907\u0938\u0932\u093f\u090f \u092c\u0928\u093e \u0915\u094d\u092f\u094b\u0902\u0915\u093f \u0936\u093f\u0915\u093e\u092f\u0924 \u0926\u0930\u094d\u091c \u0915\u0930\u0928\u093e \u0914\u0930 \u0938\u0930\u0915\u093e\u0930 \u0915\u093e \u0909\u0938\u0947 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915\u0924\u093e \u0926\u0947\u0928\u093e \u2014 \u092f\u0947 \u0926\u094b\u0928\u094b\u0902 \u092a\u0939\u0932\u0947 \u092a\u0942\u0930\u0940 \u0924\u0930\u0939 \u0905\u0932\u0917-\u0905\u0932\u0917 \u0915\u093e\u092e \u0939\u0941\u0906 \u0915\u0930\u0924\u0947 \u0925\u0947\u0964 \u0939\u092e\u0928\u0947 \u0907\u0928\u0915\u0947 \u092c\u0940\u091a \u090f\u0915 \u092a\u093e\u0907\u092a\u0932\u093e\u0907\u0928 \u092c\u0928\u093e\u0908 \u0939\u0948 \u2014 \u0938\u0924\u094d\u092f\u093e\u092a\u0928, \u0938\u092e\u0942\u0939\u0940\u0915\u0930\u0923, \u0938\u094d\u0915\u094b\u0930\u093f\u0902\u0917 \u2014 \u0924\u093e\u0915\u093f \u0939\u0930 \u0936\u093f\u0915\u093e\u092f\u0924 \u0936\u094b\u0930 \u0928\u0939\u0940\u0902, \u0938\u092c\u0942\u0924 \u092c\u0928\u0947\u0964',
  }
};

function getLang() {
  try { return localStorage.getItem(LS_LANG) || 'en'; } catch (e) { return 'en'; }
}

function applyLanguage(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === lang);
  });
  try { localStorage.setItem(LS_LANG, lang); } catch (e) { /* storage unavailable */ }
}

function initLanguageToggle() {
  const buttons = document.querySelectorAll('.lang-toggle__btn');
  if (!buttons.length) return;
  buttons.forEach(btn => btn.addEventListener('click', () => applyLanguage(btn.dataset.lang)));
  applyLanguage(getLang());
}

/* ---------- 12. Voice reporting (Web Speech API) ---------- */
function initVoiceInput() {
  const micBtn = document.getElementById('micBtn');
  const descField = document.getElementById('reportDescription');
  if (!micBtn || !descField) return;

  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionCtor) {
    micBtn.disabled = true;
    micBtn.title = 'Voice input needs Chrome or Edge on this device.';
    return;
  }

  const recognition = new SpeechRecognitionCtor();
  recognition.continuous = false;
  recognition.interimResults = false;
  let listening = false;

  micBtn.addEventListener('click', () => {
    if (listening) { recognition.stop(); return; }
    recognition.lang = getLang() === 'hi' ? 'hi-IN' : 'en-IN';
    try { recognition.start(); } catch (e) { /* already running */ }
  });

  recognition.addEventListener('start', () => { listening = true; micBtn.classList.add('is-listening'); });
  recognition.addEventListener('end', () => { listening = false; micBtn.classList.remove('is-listening'); });

  recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results).map(r => r[0].transcript).join(' ');
    descField.value = descField.value ? `${descField.value} ${transcript}` : transcript;
    descField.dispatchEvent(new Event('blur'));
  });

  recognition.addEventListener('error', () => {
    listening = false;
    micBtn.classList.remove('is-listening');
    showToast('Could not hear that \u2014 try again or type instead.');
  });
}

/* ---------- 13. Predictive alerts (real Open-Meteo forecast) ---------- */
const PATNA_LAT = 25.5941;
const PATNA_LNG = 85.1376;

function floodProneWards() {
  return WARDS.map(ward => {
    const relevant = REPORTS.filter(r => r.ward === ward.id && (r.category === 'waterlogging' || r.category === 'drainage'));
    return { ward, count: relevant.length };
  }).filter(w => w.count > 0).sort((a, b) => b.count - a.count);
}

async function initPredictiveAlert() {
  const mount = document.getElementById('predictiveAlert');
  if (!mount) return;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${PATNA_LAT}&longitude=${PATNA_LNG}&daily=precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata&forecast_days=3`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('forecast unavailable');
    const data = await res.json();
    const totalRain = (data.daily.precipitation_sum || []).reduce((s, v) => s + (v || 0), 0);
    const maxProbability = Math.max(...(data.daily.precipitation_probability_max || [0]));
    const proneWards = floodProneWards();
    const topWard = proneWards[0];
    const elevatedRisk = maxProbability >= 50 && totalRain >= 5 && topWard;

    if (elevatedRisk) {
      mount.className = 'alert-card alert-card--risk';
      mount.innerHTML = `
        <div class="alert-card__icon">${ICONS.flame}</div>
        <div class="alert-card__body">
          <strong>Elevated waterlogging risk \u2014 Ward ${topWard.ward.id}, ${topWard.ward.locality}</strong>
          <p>${totalRain.toFixed(0)}mm of rain forecast over the next 3 days (${maxProbability}% peak probability), on top of ${topWard.count} open drainage/waterlogging reports and ${topWard.ward.infra.toLowerCase()} existing infrastructure in this ward. Recommend pre-emptive drain clearance before the rain arrives.</p>
          <span class="alert-card__source">Forecast: Open-Meteo, live for Patna</span>
        </div>`;
    } else {
      mount.className = 'alert-card alert-card--calm';
      mount.innerHTML = `
        <div class="alert-card__icon">${ICONS.checkCircle}</div>
        <div class="alert-card__body">
          <strong>No elevated flooding risk flagged</strong>
          <p>${totalRain.toFixed(0)}mm of rain forecast for Patna over the next 3 days (${maxProbability}% peak probability) \u2014 not enough, combined with current drainage report volumes, to flag a hotspot.</p>
          <span class="alert-card__source">Forecast: Open-Meteo, live for Patna</span>
        </div>`;
    }
  } catch (e) {
    mount.className = 'alert-card alert-card--calm';
    mount.innerHTML = `
      <div class="alert-card__icon">${ICONS.cloud}</div>
      <div class="alert-card__body">
        <strong>Forecast unavailable</strong>
        <p>Couldn't reach the weather service just now, so predictive scoring is paused. Everything else on the dashboard is unaffected.</p>
      </div>`;
  }
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  renderCategoryGrid();
  renderPriorityPreview();
  initCountUp();
  initFilters();
  renderIssueGrid();
  renderDashboardStats();
  initDashboardMap();
  renderPriorityList();
  renderCategoryChart();
  renderWardList();
  initReportForm();
  initLanguageToggle();
  initVoiceInput();
  initPredictiveAlert();

  const reportAgainBtn = document.getElementById('reportAgainBtn');
  if (reportAgainBtn) reportAgainBtn.addEventListener('click', resetReportForm);
});