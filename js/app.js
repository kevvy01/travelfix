// ============================================================
// js/app.js — DOM Rendering Logic
// ============================================================

// ─── Theme Initialization ─────────────────────────────────
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  highlightActiveNav();
  initSkillModal();
  initDetailModals();
  initNotificationDropdown();
  const page = window.location.pathname.split("/").pop() || "";

  if (page === "marketplace.html") {
    renderMarketplace();
  } else if (page === "ai-match.html") {
    renderAIMatch();
  } else if (page === "trail-map.html") {
    renderTrailMap();
  } else if (page === "portfolio.html") {
    renderPortfolio();
  }
});

// ─── Theme Toggle Logic ───────────────────────────────────
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });
}

// ─── Active Nav Highlight ─────────────────────────────────
function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "";
  const links = document.querySelectorAll(".nav-tab");
  links.forEach((link) => {
    const href = link.getAttribute("href").split("/").pop();
    const isMarket = (href === "marketplace.html") && (path === "marketplace.html");
    if (href === path || isMarket) {
      link.classList.add("active");
    }
  });
}

// ─── SVG Icons ───────────────────────────────────────────
const icons = {
  puzzle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5a2 2 0 0 0 0-4V8a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-4 0H9.5a2 2 0 0 0-2 2v2.5a2 2 0 0 0 0 4V17a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2.5z"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  "shopping-bag": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  "map-pin": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  "trending-up": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  package: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  dollar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  "shopping-cart": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  pottery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8l2 6H6L8 2z"/><path d="M6 8c0 6 2 10 6 12 4-2 6-6 6-12"/><line x1="9" y1="12" x2="15" y2="12"/></svg>`,
  waves: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c.6.5 1.2 1 2.4 1C7 7 7 5 9.6 5c2.4 0 2.4 2 4.8 2 2.4 0 2.4-2 4.8-2 1.2 0 1.8.5 2.4 1"/><path d="M2 12c.6.5 1.2 1 2.4 1 2.6 0 2.6-2 5.2-2 2.4 0 2.4 2 4.8 2 2.4 0 2.4-2 4.8-2 1.2 0 1.8.5 2.4 1"/><path d="M2 18c.6.5 1.2 1 2.4 1 2.6 0 2.6-2 5.2-2 2.4 0 2.4 2 4.8 2 2.4 0 2.4-2 4.8-2 1.2 0 1.8.5 2.4 1"/></svg>`,
  bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  fabric: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  mountain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 20 15.5 4 22 20 3 20"/><polyline points="3 20 9 12 13 16"/></svg>`,
  "music-note": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
};

function getIcon(name, cls = "") {
  return `<span class="icon ${cls}">${icons[name] || icons["puzzle"]}</span>`;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) html += `<span class="star filled">${icons.star}</span>`;
    else if (i === full && half) html += `<span class="star half">${icons.star}</span>`;
    else html += `<span class="star empty">${icons.star}</span>`;
  }
  return `<div class="stars-row">${html}</div>`;
}

// ─── Page: Challenge Marketplace (index.html) ──────────────
function renderMarketplace() {
  const grid = document.getElementById("marketplace-grid");
  if (!grid) return;

  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const categoryFilter = document.getElementById("category-filter");

  function doRender() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const status = statusFilter ? statusFilter.value : "";
    const category = categoryFilter ? categoryFilter.value : "";

    let filtered = marketplaceProjects.filter((p) => {
      const matchQ = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchS = !status || p.status === status;
      const matchC = !category || p.categories.includes(category);
      return matchQ && matchS && matchC;
    });

    grid.innerHTML = filtered.length
      ? filtered.map((p) => marketplaceCard(p)).join("")
      : `<div class="empty-state"><p>Tidak ada proyek yang cocok dengan filter ini.</p></div>`;
  }

  if (searchInput) searchInput.addEventListener("input", doRender);
  if (statusFilter) statusFilter.addEventListener("change", doRender);
  if (categoryFilter) categoryFilter.addEventListener("change", doRender);

  doRender();
}

function marketplaceCard(p) {
  const statusClass = p.status === "Open" ? "badge-open" : p.status === "In Review" ? "badge-review" : "badge-closed";
  const tags = p.categories.map((c) => `<span class="tag">${c}</span>`).join("");
  return `
  <article class="card card-marketplace" data-id="${p.id}" role="listitem">
    <div class="card-top">
      <div class="card-icon-wrap">${getIcon(p.icon)}</div>
      <span class="badge ${statusClass}">${p.status}</span>
    </div>
    <h3 class="card-title">${p.title}</h3>
    <p class="card-desc">${p.description}</p>
    <div class="card-meta">
      ${getIcon("pin", "icon-sm")}
      <span>${p.location}</span>
    </div>
    <div class="card-tags">${tags}</div>
    <div class="card-footer">
      <div class="card-footer-info">
        ${getIcon("calendar", "icon-sm")}
        <span>${p.deadline}</span>
        <span class="prize-label">${p.prize}</span>
      </div>
    </div>
  </article>`;
}

// ─── Page: AI Match (ai-match.html) ───────────────────────
function renderAIMatch() {
  const list = document.getElementById("ai-match-list");
  if (!list) return;
  list.innerHTML = aiMatchProjects.map((p) => aiMatchCard(p)).join("");
}

function aiMatchCard(p) {
  const skills = p.skills
    .map((s) => `<span class="skill-tag">${getIcon("check", "icon-xs")}${s}</span>`)
    .join("");
  const matchClass = p.matchPercent >= 85 ? "match-high" : p.matchPercent >= 75 ? "match-mid" : "match-low";
  return `
  <article class="card card-horizontal card-aimatch" data-id="${p.id}" role="listitem">
    <div class="card-h-left">
      <div class="card-icon-wrap large">${getIcon("puzzle")}</div>
    </div>
    <div class="card-h-body">
      <div class="card-h-header">
        <div>
          <h3 class="card-title">${p.title}</h3>
          <div class="card-meta">
            ${getIcon("pin", "icon-sm")}
            <span>${p.location}</span>
          </div>
        </div>
        <span class="match-badge ${matchClass}">${p.matchPercent}% Cocok</span>
      </div>
      <p class="card-desc">${p.description}</p>
      <div class="card-tags skills-row">${skills}</div>
      <div class="card-footer-h">
        <div class="footer-meta-row">
          <span class="meta-item">${getIcon("users", "icon-sm")} ${p.applicants} pelamar</span>
          <span class="meta-item">${getIcon("calendar", "icon-sm")} ${p.deadline}</span>
          <span class="badge badge-open">${p.status}</span>
        </div>
      </div>
    </div>
  </article>`;
}

// ─── Page: Creative Trail Map (trail-map.html) ────────────
function renderTrailMap() {
  const pins = document.getElementById("map-pins");
  const grid = document.getElementById("trail-grid");
  if (!pins || !grid) return;

  pins.innerHTML = trailLocations
    .map(
      (loc) => `
    <button class="map-pin-btn" style="top:${loc.lat};left:${loc.lng};"
      onclick="highlightCard(${loc.id})">
      ${getIcon("pin", "icon-sm")} ${loc.tag}
    </button>`
    )
    .join("");

  grid.innerHTML = trailLocations.map((loc) => trailCard(loc)).join("");
}

function highlightCard(id) {
  document.querySelectorAll(".card-trail").forEach((c) => c.classList.remove("highlighted"));
  const target = document.getElementById(`trail-card-${id}`);
  if (target) {
    target.classList.add("highlighted");
    target.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function trailCard(loc) {
  const tags = loc.categories.map((c) => `<span class="tag">${c}</span>`).join("");
  return `
  <article class="card card-trail" id="trail-card-${loc.id}">
    <div class="card-top">
      <div class="card-icon-wrap">${getIcon(loc.icon)}</div>
    </div>
    <h3 class="card-title">${loc.name}</h3>
    <p class="card-desc">${loc.description}</p>
    <div class="card-tags">${tags}</div>
    <div class="trail-stats">
      <span>${getIcon("pin", "icon-sm")} ${loc.projects} proyek</span>
      <span>${getIcon("star", "icon-sm")} ${loc.rating}</span>
    </div>
  </article>`;
}

// ─── Page: Impact Portfolio (portfolio.html) ──────────────
function renderPortfolio() {
  const list = document.getElementById("portfolio-list");
  const statsRow = document.getElementById("portfolio-stats");
  if (!list) return;

  if (statsRow) {
    const stats = [
      { label: "Proyek Selesai", value: "4", icon: "package" },
      { label: "Rata-rata Engagement", value: "+42%", icon: "trending-up" },
      { label: "Impact Score", value: "128", icon: "award" },
      { label: "Rating Rata-rata", value: "4.8 ★", icon: "star" },
    ];
    statsRow.innerHTML = stats
      .map(
        (s) => `
      <div class="stat-card">
        <div class="stat-icon">${getIcon(s.icon)}</div>
        <div class="stat-value">${s.value}</div>
        <div class="stat-label">${s.label}</div>
      </div>`
      )
      .join("");
  }

  list.innerHTML = portfolioProjects.map((p) => portfolioCard(p)).join("");
}

function portfolioCard(p) {
  const metrics = p.metrics
    .map(
      (m) => `
    <div class="metric-item">
      ${getIcon(m.icon, "icon-sm")}
      <span>${m.label}</span>
    </div>`
    )
    .join("");

  return `
  <article class="card card-horizontal card-portfolio" data-id="${p.id}" role="listitem">
    <div class="card-h-left">
      <div class="card-icon-wrap large">${getIcon(p.icon)}</div>
      <span class="category-tag">${p.category}</span>
    </div>
    <div class="card-h-body">
      <div class="card-h-header">
        <div>
          <h3 class="card-title">${p.title}</h3>
          <span class="freelancer-tag">oleh ${p.freelancer}</span>
        </div>
        <div class="rating-block">
          ${renderStars(p.rating)}
          <span class="rating-num">${p.rating}</span>
        </div>
      </div>
      <p class="card-desc">${p.description}</p>
      <p class="impact-text">${p.impact}</p>
      <div class="metrics-row">${metrics}</div>
      <div class="card-footer-h">
        <span class="meta-item">${getIcon("calendar", "icon-sm")} ${p.date}</span>
      </div>
    </div>
  </article>`;
}

// ─── Global: Skill & Minat Modal Logic ──────────────────
function initSkillModal() {
  const modal = document.getElementById('skill-modal');
  const backdrop = document.getElementById('skill-modal-backdrop');

  // Guard: if the modal HTML doesn't exist on this page, exit cleanly without error
  if (!modal || !backdrop) return;

  const step1     = document.getElementById('skill-step-1');
  const step2     = document.getElementById('skill-step-2');
  const btnNext   = document.getElementById('skill-btn-next');
  const btnSave   = document.getElementById('skill-btn-save');
  const btnSkip   = document.getElementById('skill-btn-skip');

  function openModal() {
    backdrop.hidden = false;
    modal.hidden    = false;
    document.body.style.overflow = 'hidden';
    
    // small delay so CSS transition fires
    requestAnimationFrame(() => {
      backdrop.classList.add('sm-visible');
      modal.classList.add('sm-visible');
    });
    showStep(1);
  }

  function closeModal() {
    backdrop.classList.remove('sm-visible');
    modal.classList.remove('sm-visible');
    document.body.style.overflow = '';
    
    modal.addEventListener('transitionend', function handler() {
      modal.hidden    = true;
      backdrop.hidden = true;
      modal.removeEventListener('transitionend', handler);
    });
  }

  function showStep(n) {
    if (step1) step1.hidden = (n !== 1);
    if (step2) step2.hidden = (n !== 2);
  }

  // Handle open event triggered from profile-modal.js
  document.addEventListener('open-skill-modal', openModal);

  // Directly bind update button if available
  const pmUpdateBtn = document.getElementById('pm-update-skill');
  if (pmUpdateBtn) {
    pmUpdateBtn.addEventListener('click', openModal);
  }

  // Close when clicking the backdrop
  backdrop.addEventListener('click', closeModal);

  // Bind navigation / action buttons inside modal
  if (btnNext) btnNext.addEventListener('click', () => showStep(2));
  if (btnSave) btnSave.addEventListener('click', closeModal);
  if (btnSkip) btnSkip.addEventListener('click', closeModal);

  // Escape key closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Safe Pill Click event delegation inside grids (prevents errors and runs cleanly)
  const skillGrid = document.getElementById('skill-pill-grid');
  if (skillGrid) {
    skillGrid.addEventListener('click', (e) => {
      const pill = e.target.closest('.skill-pill');
      if (pill) {
        pill.classList.toggle('skill-pill--active');
        pill.setAttribute('aria-pressed', pill.classList.contains('skill-pill--active'));
      }
    });
  }

  const interestGrid = document.getElementById('interest-pill-grid');
  if (interestGrid) {
    interestGrid.addEventListener('click', (e) => {
      const pill = e.target.closest('.interest-pill');
      if (pill) {
        pill.classList.toggle('interest-pill--active');
        pill.setAttribute('aria-pressed', pill.classList.contains('interest-pill--active'));
      }
    });
  }
}


// ─── Detail Modals ───────────────────────────────────────
function initDetailModals() {
  // ── Helper: open a backdrop+modal ──
  function openModal(backdropEl) {
    if (!backdropEl) return;
    backdropEl.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => backdropEl.classList.add('dm-visible'));
  }

  function closeModal(backdropEl) {
    if (!backdropEl) return;
    backdropEl.classList.remove('dm-visible');
    document.body.style.overflow = '';
    backdropEl.addEventListener('transitionend', function handler() {
      backdropEl.hidden = true;
      backdropEl.removeEventListener('transitionend', handler);
    });
  }

  // ── Close buttons inside each modal footer ──
  document.querySelectorAll('.dm-close-btn, .dm-close-footer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const backdrop = btn.closest('.detail-backdrop');
      closeModal(backdrop);
    });
  });

  // ── Close on backdrop click (outside the modal box) ──
  document.querySelectorAll('.detail-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  // ── Escape key ──
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.detail-backdrop.dm-visible').forEach(b => closeModal(b));
  });

  // ── Action: Ambil Proyek Button ──
  document.body.addEventListener('click', (e) => {
    const ambilBtn = e.target.closest('#btn-ambil-proyek');
    if (ambilBtn) {
      const backdrop = ambilBtn.closest('.detail-backdrop');
      if (backdrop) {
        closeModal(backdrop);
        setTimeout(() => {
          alert('Proyek berhasil diambil.');
        }, 300);
      }
    }
  });

  // ── Global Event Delegation — card clicks ──
  document.body.addEventListener('click', (e) => {
    // Don't fire if clicking a button/link inside the card
    if (e.target.closest('button') || e.target.closest('a')) return;

    // Project cards: Marketplace & AI Match
    const projectCard = e.target.closest('.card-marketplace, .card-aimatch');
    if (projectCard) {
      const id = parseInt(projectCard.dataset.id, 10);
      const data = (projectCard.classList.contains('card-marketplace') ? marketplaceProjects : aiMatchProjects)
                    .find(p => p.id === id);
      if (data) populateAndOpenProjectModal(data, openModal);
      return;
    }

    // Trail Map location cards
    const trailCard = e.target.closest('.card-trail');
    if (trailCard) {
      const id = parseInt(trailCard.id.replace('trail-card-', ''), 10);
      const data = trailLocations.find(l => l.id === id);
      if (data) populateAndOpenLocationModal(data, openModal);
      return;
    }

    // Portfolio cards
    const portfolioCard = e.target.closest('.card-portfolio');
    if (portfolioCard) {
      const id = parseInt(portfolioCard.dataset.id, 10);
      const data = portfolioProjects.find(p => p.id === id);
      if (data) populateAndOpenPortfolioModal(data, openModal);
      return;
    }
  });
}

function populateAndOpenProjectModal(p, openModal) {
  const backdrop = document.getElementById('project-detail-backdrop');
  if (!backdrop) return;

  // Detect which dataset this project is from
  const isAiMatch = typeof p.matchPercent !== 'undefined';

  backdrop.querySelector('#pdm-title').textContent = p.title;
  backdrop.querySelector('#pdm-subtitle').textContent = isAiMatch
    ? `${p.location} · ${p.applicants} pelamar · Deadline: ${p.deadline}`
    : `${p.location} · Deadline: ${p.deadline}`;

  backdrop.querySelector('#pdm-description').textContent = p.description || '—';
  
  const reqEl = backdrop.querySelector('#pdm-requirements');
  if (reqEl) {
    // Preserve line breaks if provided
    reqEl.innerHTML = p.requirements ? p.requirements.replace(/\n/g, '<br>') : 'Freelancer wajib memiliki portofolio relevan. Pembayaran 50% di muka, 50% setelah selesai.';
  }

  // Skills or Categories as pills
  const pillContainer = backdrop.querySelector('#pdm-skills');
  const skillsArray = p.skills || p.categories || [];
  pillContainer.innerHTML = skillsArray.map(s => `<span class="dm-pill">${s}</span>`).join('');

  // Price
  backdrop.querySelector('#pdm-price').textContent = p.prize
    ? `${p.prize}`
    : '—';

  openModal(backdrop);
}

function populateAndOpenLocationModal(loc, openModal) {
  const backdrop = document.getElementById('location-detail-backdrop');
  if (!backdrop) return;

  backdrop.querySelector('#ldm-title').textContent = loc.name;
  backdrop.querySelector('#ldm-client').textContent = `${loc.tag} · ${loc.projects} proyek aktif`;
  backdrop.querySelector('#ldm-description').textContent = loc.description;
  backdrop.querySelector('#ldm-address').textContent = `Kawasan ${loc.tag}, Kabupaten Bantul, DI Yogyakarta`;
  backdrop.querySelector('#ldm-contact').textContent = `wa.me/628100000${loc.id} · info@bantulcreative.id`;

  const tagContainer = backdrop.querySelector('#ldm-tags');
  tagContainer.innerHTML = loc.categories.map(c => `<span class="dm-pill">${c}</span>`).join('');

  openModal(backdrop);
}

function populateAndOpenPortfolioModal(p, openModal) {
  const backdrop = document.getElementById('portfolio-detail-backdrop');
  if (!backdrop) return;

  backdrop.querySelector('#pfdm-title').textContent = p.title;
  backdrop.querySelector('#pfdm-subtitle').textContent = `oleh ${p.freelancer} · ${p.date}`;
  backdrop.querySelector('#pfdm-description').textContent = p.description;
  backdrop.querySelector('#pfdm-impact-text').textContent = p.impact;

  const metricsContainer = backdrop.querySelector('#pfdm-metrics');
  metricsContainer.innerHTML = p.metrics.map(m => `
    <span class="dm-metric-badge">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      ${m.label}
    </span>`).join('');

  openModal(backdrop);
}


// ─── Notification Dropdown ───────────────────────────────
function initNotificationDropdown() {
  const notifWrap = document.querySelector('.notif-btn-wrap');
  const notifBtn  = document.querySelector('.notif-btn');
  const dropdown  = document.getElementById('notif-dropdown');

  if (!notifWrap || !notifBtn || !dropdown) return;

  let isOpen = false;

  function openDropdown() {
    dropdown.hidden = false;
    requestAnimationFrame(() => dropdown.classList.add('nd-visible'));
    isOpen = true;
  }

  function closeDropdown() {
    dropdown.classList.remove('nd-visible');
    dropdown.addEventListener('transitionend', function handler() {
      dropdown.hidden = true;
      dropdown.removeEventListener('transitionend', handler);
    });
    isOpen = false;
  }

  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isOpen ? closeDropdown() : openDropdown();
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !notifWrap.contains(e.target)) closeDropdown();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeDropdown();
  });

  // Tab switching
  const tabs = dropdown.querySelectorAll('.nd-tab');
  const panels = dropdown.querySelectorAll('.nd-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('nd-tab--active'));
      panels.forEach(p => p.classList.remove('nd-panel--active'));
      tab.classList.add('nd-tab--active');
      const target = dropdown.querySelector(`#${tab.dataset.target}`);
      if (target) target.classList.add('nd-panel--active');
    });
  });

  // Mark all as read
  const markAllBtn = dropdown.querySelector('.nd-mark-all');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      dropdown.querySelectorAll('.nd-item.nd-unread').forEach(item => {
        item.classList.remove('nd-unread');
        const dot = item.querySelector('.nd-item-dot');
        if (dot) dot.style.visibility = 'hidden';
      });
      // Reset badge count
      const badge = document.querySelector('.notif-badge');
      if (badge) badge.textContent = '0';
    });
  }
}

