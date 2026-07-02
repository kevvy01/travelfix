// ============================================================
// js/app.js — DOM Rendering Logic
// ============================================================

// ─── Theme Initialization ─────────────────────────────────
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function renderTalentAI() {
  const controls = document.getElementById("ai-controls-container");
  const emptyState = document.getElementById("ai-empty-state");
  const select = document.getElementById("ai-project-select");
  const btn = document.getElementById("btn-find-talent");
  
  if (!controls || !emptyState || !select || !btn) return;

  const currentUser = window.db ? window.db.getCurrentUser() : null;
  if (!currentUser || currentUser.role !== 'umkm') return;

  const allProjects = window.db ? window.db.getProjects() : [];
  const myOpenProjects = allProjects.filter(p => p.createdBy === currentUser.id && p.status === 'Open');

  // Step 1: No projects
  if (myOpenProjects.length === 0) {
    emptyState.style.display = 'flex';
    controls.style.display = 'none';
    document.getElementById("ai-results-area").style.display = 'none';
    document.getElementById("ai-loading-state").style.display = 'none';
    return;
  }

  // Step 2: Projects exist
  emptyState.style.display = 'none';
  controls.style.display = 'block';
  document.getElementById("ai-results-area").style.display = 'none';
  document.getElementById("ai-loading-state").style.display = 'none';

  select.innerHTML = myOpenProjects.map(p => `<option value="${p.id}">${p.title}</option>`).join('');

  btn.onclick = function() {
    // Step 3: Loading state
    const resultsArea = document.getElementById("ai-results-area");
    const loadingState = document.getElementById("ai-loading-state");
    const list = document.getElementById("talent-ai-list");

    resultsArea.style.display = 'none';
    loadingState.style.display = 'flex';

    setTimeout(() => {
      // Step 4: Render ranked recommendations
      const selectedId = select.value;
      const project = myOpenProjects.find(p => String(p.id) === selectedId);
      if (!project) return;

      const neededSkills = new Set(project.skills || []);
      const neededCats = new Set(project.categories || []);

      const allUsers = window.db ? window.db.getUsers() : [];
      const freelancers = allUsers.filter(u => u.role === 'freelancer');

      const matches = freelancers.map(f => {
        const aiResult = window.ai ? window.ai.evaluateTalent(f, neededSkills, neededCats) : { matchPercent: 0, matchReason: 'Profil ini cukup potensial.' };
        return { 
          ...f, 
          matchPercent: aiResult.matchPercent, 
          matchReason: aiResult.matchReason 
        };
      }).filter(f => f.matchPercent > 0);

      matches.sort((a, b) => b.matchPercent - a.matchPercent);

      const countSpan = document.getElementById('ai-results-count');
      if (countSpan) countSpan.textContent = `${matches.length} talenta ditemukan`;
      
      const pillCount = document.querySelectorAll('.ai-banner-pills .ai-pill')[1];
      if (pillCount) pillCount.innerHTML = `<span class="dot"></span> ${matches.length} rekomendasi talenta`;

      if (matches.length === 0) {
        list.innerHTML = `<div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h3 class="empty-state-title">Belum ada rekomendasi talenta</h3>
        <p class="empty-state-desc">Pilih proyek Anda di atas untuk melihat rekomendasi dari AI.</p>
      </div>`;
      } else {
        list.innerHTML = matches.map((f) => talentAiCard(f)).join("");
      }

      loadingState.style.display = 'none';
      resultsArea.style.display = 'block';

    }, 800);
  };
}

function talentAiCard(f) {
  const skills = (f.skills || [])
    .slice(0, 4) // Show max 4
    .map((s) => `<span class="skill-tag">${getIcon("check", "icon-xs")}${s}</span>`)
    .join("");
  const initial = window.getAvatarInitials(f.name);
  
  let badgeLabel = "Low";
  let matchClass = "match-low";

  if (f.matchPercent >= 90) {
    badgeLabel = "Excellent";
    matchClass = "match-high";
  } else if (f.matchPercent >= 80) {
    badgeLabel = "Strong";
    matchClass = "match-high";
  } else if (f.matchPercent >= 70) {
    badgeLabel = "Good";
    matchClass = "match-mid";
  } else if (f.matchPercent >= 60) {
    badgeLabel = "Moderate";
    matchClass = "match-mid";
  }
  
  const portCount = window.portfolioProjects ? window.portfolioProjects.filter(p => p.freelancer === f.name).length : 0;
  const portHtml = portCount > 0 ? `<div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">${getIcon("briefcase", "icon-xs")} ${portCount} Proyek Portofolio</div>` : '';

  return `
  <article class="card card-horizontal card-talentai" role="listitem">
    <div class="card-h-left">
      <div style="width:60px; height:60px; border-radius:50%; background:var(--card-bg); border: 2px solid var(--border-color); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:1.25rem; color:var(--primary-color);">${initial}</div>
    </div>
    <div class="card-h-body">
      <div class="card-h-header">
        <div>
          <h3 class="card-title">${f.name}</h3>
          <div class="card-meta">
            ${getIcon("pin", "icon-sm")}
            <span>${f.location || 'Bantul'}</span>
          </div>
        </div>
        <span class="match-badge ${matchClass}">${f.matchPercent}% Cocok (${badgeLabel})</span>
      </div>
      <p class="card-desc">${f.bio || f.role || 'Freelancer independen siap mengerjakan proyek Anda.'}</p>
      ${f.matchReason ? `<p style="font-size: 0.85rem; color: var(--accent-green-dk); margin-bottom: 0.75rem;">${getIcon("check", "icon-xs")} ${f.matchReason}</p>` : ''}
      ${portHtml}
      <div class="card-tags skills-row">${skills}</div>
      <div class="card-footer-h">
        <button class="btn btn-outline" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="showFreelancerProfileModal(${f.id})">Lihat Profil</button>
        <button class="btn btn-primary" style="padding: 0.4rem 1rem; font-size: 0.85rem;" onclick="window.toast.info('Invitation feature will be implemented with the backend.')">Undang</button>
      </div>
    </div>
  </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initNavigation();
  initSkillModal();
  initDetailModals();
  const page = window.location.pathname.split("/").pop() || "";

  if (page === "marketplace.html") {
    renderMarketplace();
  } else if (page === "ai-match.html") {
    renderAIMatch();
  } else if (page === "trail-map.html") {
    renderTrailMap();
  } else if (page === "portfolio.html") {
    renderPortfolio();
  } else if (page === "umkm-dashboard.html") {
    renderUMKMDashboard();
  } else if (page === "umkm-projects.html") {
    renderUMKMProjects();
  } else if (page === "talent-ai.html") {
    renderTalentAI();
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

// ─── Navigation Initialization ────────────────────────────
function initNavigation() {
  const script = document.createElement('script');
  script.src = 'js/modules/navigation.js';
  script.onload = () => {
    if (typeof window.initNavigation === 'function') {
      window.initNavigation();
    }
  };
  script.onerror = () => console.error('Failed to load navigation module');
  document.head.appendChild(script);
}

// ─── SVG Icons ───────────────────────────────────────────
const icons = {
  puzzle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5a2 2 0 0 0 0-4V8a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-4 0H9.5a2 2 0 0 0-2 2v2.5a2 2 0 0 0 0 4V17a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-2.5z"/></svg>`,
  camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
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

  if (categoryFilter && categoryFilter.options.length <= 1) {
    const options = window.SKILL_OPTIONS || [];
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      categoryFilter.appendChild(option);
    });
  }

  function doRender() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const status = statusFilter ? statusFilter.value : "";
    const category = categoryFilter ? categoryFilter.value : "";

    let filtered = db.getProjects().filter((p) => {
      const matchQ = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchS = !status || p.status === status;
      const matchC = !category || p.categories.includes(category);
      return matchQ && matchS && matchC;
    });

    grid.innerHTML = filtered.length
      ? filtered.map((p) => marketplaceCard(p)).join("")
      : `<div class="empty-state">
           <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
           <h3 class="empty-state-title">Tidak ada hasil</h3>
           <p class="empty-state-desc">Tidak ada proyek yang cocok dengan filter ini.</p>
         </div>`;
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

// ─── Page: Freelancer Projects (freelancer-projects.html) ──────────────
function renderMyProjects() {
  const grid = document.getElementById("my-projects-grid");
  const countEl = document.getElementById("my-projects-count");
  if (!grid) return;

  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const categoryFilter = document.getElementById("category-filter");
  
  if (categoryFilter && categoryFilter.options.length <= 1) {
    const options = window.SKILL_OPTIONS || [];
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      categoryFilter.appendChild(option);
    });
  }
  
  const currentUser = window.db ? db.getCurrentUser() : null;

  if (!currentUser) {
    grid.innerHTML = `<div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <h3 class="empty-state-title">Akses Ditolak</h3>
      <p class="empty-state-desc">Silakan login terlebih dahulu untuk melihat profil Anda.</p>
    </div>`;
    if (countEl) countEl.textContent = `0 proyek dilamar`;
    return;
  }

  function mapStatusForFreelancer(status) {
    switch(status) {
      case 'Open': return 'In Review';
      case 'In Progress': return 'Approved';
      case 'Done': return 'Completed';
      case 'Closed': return 'Rejected';
      default: return status;
    }
  }

  function doRender() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const status = statusFilter ? statusFilter.value : "";
    const category = categoryFilter ? categoryFilter.value : "";

    const appliedProjects = db.getAppliedProjects(currentUser.id);

    let filtered = appliedProjects.filter((p) => {
      const mappedStatus = mapStatusForFreelancer(p.status);
      const matchQ = p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchS = !status || mappedStatus === status;
      const matchC = !category || p.categories.includes(category);
      return matchQ && matchS && matchC;
    });

    if (countEl) countEl.textContent = `${filtered.length} proyek dilamar`;

    grid.innerHTML = filtered.length
      ? filtered.map((p) => marketplaceCard({ ...p, status: mapStatusForFreelancer(p.status) })).join("")
      : `<div class="empty-state" style="grid-column: 1 / -1; min-height: 300px;">
           <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
           <h3 class="empty-state-title">Kosong</h3>
           <p class="empty-state-desc">Belum ada proyek yang sesuai atau dilamar.</p>
        </div>`;
  }

  if (searchInput) searchInput.addEventListener("input", doRender);
  if (statusFilter) statusFilter.addEventListener("change", doRender);
  if (categoryFilter) categoryFilter.addEventListener("change", doRender);

  doRender();
}

// ─── Page: UMKM Dashboard (umkm-dashboard.html) ───────────────────
function renderUMKMDashboard() {
  const currentUser = window.db ? db.getCurrentUser() : null;
  if (!currentUser) return;

  const nameEl = document.getElementById("umkm-user-name");
  if (nameEl) nameEl.textContent = currentUser.name;

  const projects = window.db ? db.getProjects().filter(p => p.createdBy === currentUser.id) : [];

  const statTotal = document.getElementById("stat-total");
  const statOpen = document.getElementById("stat-open");
  const statInProgress = document.getElementById("stat-inprogress");
  const statCompleted = document.getElementById("stat-completed");

  if (statTotal) statTotal.textContent = projects.length;
  if (statOpen) statOpen.textContent = projects.filter(p => p.status === "Open").length;
  if (statInProgress) statInProgress.textContent = projects.filter(p => p.status === "In Progress" || p.status === "In Review").length;
  if (statCompleted) statCompleted.textContent = projects.filter(p => p.status === "Completed" || p.status === "Done" || p.status === "Closed").length;

  const recentGrid = document.getElementById("umkm-recent-projects");
  if (!recentGrid) return;

  if (projects.length === 0) {
    recentGrid.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <h3 class="empty-state-title">Belum Ada Proyek</h3>
        <p class="empty-state-desc">Anda belum memiliki proyek. Buat proyek pertama Anda untuk mulai bekerja sama dengan talenta terbaik.</p>
        <button type="button" class="btn btn-primary btn-md btn-open-create-project" id="create-project-btn-empty">Buat Proyek</button>
      </div>
    `;
    initCreateProjectModal();
    return;
  }

  // Sort by updatedAt descending
  projects.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));

  const recentProjects = projects.slice(0, 5);
  recentGrid.innerHTML = recentProjects.map(p => marketplaceCard(p)).join("");

  initCreateProjectModal();
}

function initCreateProjectModal() {
  const modal = document.getElementById("create-project-modal");
  if (!modal) return;

  const openBtns = document.querySelectorAll(".btn-open-create-project, #create-project-btn");
  const closeBtn = document.getElementById("btn-close-create-project");
  const cancelBtn = document.getElementById("btn-cancel-create-project");
  const submitBtn = document.getElementById("btn-submit-create-project");
  const errorSpan = document.getElementById("cp-error");
  const form = document.getElementById("create-project-form");

  let selectedCategories = [];

  function openModal() {
    modal.removeAttribute("hidden");
    selectedCategories = [];
    
    // Render the tag selector using the global function
    if (typeof window.renderTagSelector === 'function') {
      window.renderTagSelector('cp-category-container', window.SKILL_OPTIONS || [], selectedCategories, 'skill-pill', 'skill-pill--active');
    }

    requestAnimationFrame(() => {
      modal.classList.add("dm-visible");
    });

    if (errorSpan) errorSpan.style.display = "none";
    if (form) form.reset();
  }

  function closeModal() {
    modal.classList.remove("dm-visible");

    setTimeout(() => {
      modal.setAttribute("hidden", "");
    }, 280); // sesuaikan dengan durasi transition CSS
  }

  openBtns.forEach(btn => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  if (submitBtn) {
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault();
      
      const title = document.getElementById("cp-title").value.trim();
      const location = document.getElementById("cp-location").value.trim();
      const budget = document.getElementById("cp-budget").value.trim();
      let deadline = document.getElementById("cp-deadline").value.trim();
      if (deadline && window.formatDate) {
        deadline = window.formatDate(deadline);
      }
      const description = document.getElementById("cp-description").value.trim();
      const requirements = document.getElementById("cp-requirements").value.trim();
      const icon = document.getElementById("cp-icon").value;

      const categories = [...selectedCategories];

      if (!title || categories.length === 0 || !location || !budget || !deadline || !description || !requirements) {
        errorSpan.style.display = "block";
        return;
      }

      errorSpan.style.display = "none";

      const projectData = {
        title,
        categories,
        location,
        prize: budget,
        deadline,
        description,
        requirements,
        icon: icon || "puzzle"
      };

      if (window.db && typeof window.db.createProject === "function") {
        window.db.createProject(projectData);
        closeModal();
        if (document.getElementById("stat-total")) renderUMKMDashboard();
        if (document.getElementById("mp-stat-total")) renderUMKMProjects();
      }
    });
  }
}

// ─── Page: UMKM Projects (umkm-projects.html) ───────────────────
function renderUMKMProjects() {
  const currentUser = window.db ? db.getCurrentUser() : null;
  if (!currentUser) return;

  const projects = window.db.getProjects().filter(p => p.createdBy === currentUser.id);

  // Update stats
  const statTotal = document.getElementById("mp-stat-total");
  const statOpen = document.getElementById("mp-stat-open");
  const statReview = document.getElementById("mp-stat-review");
  const statClosed = document.getElementById("mp-stat-closed");

  if (statTotal) statTotal.textContent = projects.length;
  if (statOpen) statOpen.textContent = projects.filter(p => p.status === "Open").length;
  if (statReview) statReview.textContent = projects.filter(p => p.status === "In Review").length;
  if (statClosed) statClosed.textContent = projects.filter(p => p.status === "Closed" || p.status === "Done" || p.status === "Completed").length;

  const grid = document.getElementById("umkm-projects-grid");
  if (!grid) return;

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        <h3 class="empty-state-title">Belum Ada Proyek</h3>
        <p class="empty-state-desc">Anda belum memiliki proyek. Buat proyek pertama Anda untuk mulai bekerja sama dengan talenta terbaik.</p>
        <button type="button" class="btn btn-primary btn-md btn-open-create-project" id="create-project-btn-empty">Buat Proyek</button>
      </div>
    `;
    initCreateProjectModal();
    return;
  }

  projects.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
  grid.innerHTML = projects.map(p => umkmProjectCard(p)).join("");
  initCreateProjectModal();
}

function umkmProjectCard(p) {
  const statusClass = p.status === "Open" ? "badge-open" : p.status === "In Review" ? "badge-review" : "badge-closed";
  const tags = p.categories && p.categories.length ? p.categories.map((c) => `<span class="tag">${c}</span>`).join("") : "";
  const applicantsCount = Array.isArray(p.applicants) ? p.applicants.length : (p.applicants || 0);
  
  return `
  <article class="card card-marketplace" data-id="${p.id}" role="listitem">
    <div class="card-top">
      <div class="card-icon-wrap">${getIcon(p.icon)}</div>
      <span class="badge ${statusClass}">${p.status}</span>
    </div>
    <h3 class="card-title">${p.title}</h3>
    <div class="card-meta">
      ${getIcon("users", "icon-sm")}
      <span>${applicantsCount} Pelamar</span>
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

  const currentUser = window.db ? window.db.getCurrentUser() : null;
  if (!currentUser) return;

  const allProjects = window.db ? window.db.getProjects() : [];
  const openProjects = allProjects.filter(p => p.status === 'Open');

  const matches = openProjects.map(p => {
    const matchData = window.ai ? window.ai.calculateMatch(currentUser, p) : { score: 0, reason: 'Profil cocok.' };
    return { ...p, matchPercent: matchData.score, matchReason: matchData.reason };
  }).filter(p => p.matchPercent > 0);

  matches.sort((a, b) => b.matchPercent - a.matchPercent);

  // Update banner count
  const countSpan = document.querySelector('.section-count');
  if (countSpan) countSpan.textContent = `${matches.length} proyek ditemukan`;
  const pillCount = document.querySelectorAll('.ai-banner-pills .ai-pill')[1];
  if (pillCount) pillCount.innerHTML = `<span class="dot"></span> ${matches.length} rekomendasi untukmu`;

  if (matches.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <h3 class="empty-state-title">Belum ada rekomendasi</h3>
      <p class="empty-state-desc">Lengkapi profil (skill dan minat) Anda untuk mendapatkan rekomendasi proyek yang cocok.</p>
    </div>`;
    return;
  }

  list.innerHTML = matches.map((p) => aiMatchCard(p)).join("");
}

function aiMatchCard(p) {
  const categories = (p.categories || [])
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
            <span>${p.location || 'Bantul'}</span>
          </div>
        </div>
        <span class="match-badge ${matchClass}">${p.matchPercent}% Cocok</span>
      </div>
      <p class="card-desc">${p.description}</p>
      ${p.matchReason ? `<p style="font-size: 0.85rem; color: var(--accent-green-dk); margin-bottom: 0.75rem;">${getIcon("check", "icon-xs")} ${p.matchReason}</p>` : ''}
      <div class="card-tags skills-row">${categories}</div>
      <div class="card-footer-h">
        <div class="footer-meta-row">
          <span class="meta-item">${getIcon("users", "icon-sm")} ${(p.applicants || []).length} pelamar</span>
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
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      // Collect active skills and interests
      const activeSkills = Array.from(document.querySelectorAll('#skill-pill-grid .skill-pill--active')).map(p => p.textContent.trim());
      const activeInterests = Array.from(document.querySelectorAll('#interest-pill-grid .interest-pill--active')).map(p => p.textContent.trim());

      // Update in DB and synchronize UI immediately
      const currentUser = window.auth ? window.auth.getCurrentUser() : null;
      if (currentUser && window.db) {
        window.db.updateUser(currentUser.id, { skills: activeSkills, interests: activeInterests });
        
        // Update local session to persist on reload
        const updatedUser = window.db.getUserById(currentUser.id);
        if (window.auth) window.auth.setCurrentUser(updatedUser);
        
        // Refresh the profile modal DOM dynamically
        if (typeof updateProfileUI === 'function') {
          updateProfileUI();
        }
      }
      closeModal();
    });
  }
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
  // Load reusable modal logic from external module
  import('./modules/modal.js').then(module => {
    window.openModal = module.openModal;
    window.closeModal = module.closeModal;
    module.initDetailModalsCore();
  }).catch(err => console.error('Failed to load modal module:', err));

  // ── Action: Ambil Proyek Button ──
  document.body.addEventListener('click', (e) => {
    const ambilBtn = e.target.closest('#btn-ambil-proyek');
    if (ambilBtn) {
      const backdrop = ambilBtn.closest('.detail-backdrop');
      if (backdrop) {
        window.closeModal(backdrop);
        setTimeout(() => {
          window.toast.success('Proyek berhasil diambil.');
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
    // Ensure we don't accidentally intercept freelancer cards in Talent AI
    if (projectCard && !projectCard.classList.contains('card-talentai')) {
      const id = parseInt(projectCard.dataset.id, 10);
      const data = db.getProjects().find(p => String(p.id) === String(id));
      if (data) populateAndOpenProjectModal(data, window.openModal);
      return;
    }

    // Trail Map location cards
    const trailCard = e.target.closest('.card-trail');
    if (trailCard) {
      const id = parseInt(trailCard.id.replace('trail-card-', ''), 10);
      const data = trailLocations.find(l => l.id === id);
      if (data) populateAndOpenLocationModal(data, window.openModal);
      return;
    }

    // Portfolio cards
    const portfolioCard = e.target.closest('.card-portfolio');
    if (portfolioCard) {
      const id = parseInt(portfolioCard.dataset.id, 10);
      const data = portfolioProjects.find(p => p.id === id);
      if (data) populateAndOpenPortfolioModal(data, window.openModal);
      return;
    }
  });
}

function populateAndOpenProjectModal(p, openModal) {
  const backdrop = document.getElementById('project-detail-backdrop');
  if (!backdrop) return;

  // Track the current project ID for approval actions
  if (p && p.id) {
    backdrop.setAttribute('data-current-project-id', p.id);
  }

  if (typeof window.switchProjectModalView === 'function') {
    window.switchProjectModalView('project');
  }

  // Detect which dataset this project is from
  const isAiMatch = typeof p.matchPercent !== 'undefined';
  const isUMKMProjectsPage = document.getElementById("umkm-projects-grid") !== null;

  backdrop.querySelector('#pdm-title').textContent = p.title;

  const statusBadge = backdrop.querySelector('#pdm-status');
  if (statusBadge) {
    statusBadge.textContent = p.status;
    statusBadge.className = `badge ${p.status === "Open" ? "badge-open" : p.status === "In Review" ? "badge-review" : "badge-closed"}`;
  }

  const applicantsCount = Array.isArray(p.applicants) ? p.applicants.length : (p.applicants || 0);

  if (isUMKMProjectsPage) {
    backdrop.querySelector('#pdm-subtitle').textContent = `${p.location} · ${applicantsCount} pelamar · Deadline: ${p.deadline}`;
  } else {
    backdrop.querySelector('#pdm-subtitle').textContent = isAiMatch
      ? `${p.location} · ${p.applicants} pelamar · Deadline: ${p.deadline}`
      : `${p.location} · Deadline: ${p.deadline}`;
  }

  backdrop.querySelector('#pdm-description').textContent = p.description || '—';
  
  const reqEl = backdrop.querySelector('#pdm-requirements');
  if (reqEl) {
    // Preserve line breaks if provided
    reqEl.innerHTML = p.requirements ? window.nl2br(p.requirements) : 'Freelancer wajib memiliki portofolio relevan. Pembayaran 50% di muka, 50% setelah selesai.';
  }

  // Skills or Categories as pills
  const pillContainer = backdrop.querySelector('#pdm-skills');
  const skillsArray = p.skills || p.categories || [];
  pillContainer.innerHTML = skillsArray.map(s => `<span class="dm-pill">${s}</span>`).join('');

  // Price
  backdrop.querySelector('#pdm-price').textContent = p.prize
    ? `${p.prize}`
    : '—';

  // Applicants Rendering (UMKM Projects Only)
  if (isUMKMProjectsPage) {
    const applicantsList = backdrop.querySelector('#pdm-applicants-list');
    if (applicantsList) {
      if (!p.applicants || p.applicants.length === 0) {
        applicantsList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No applicants yet.</p>`;
      } else {
        const applicantHTML = p.applicants.map(applicantId => {
          const user = window.db ? db.getUserById(applicantId) : null;
          if (!user) return '';
          
          const avatar = window.getAvatarInitials(user.name);
          const primarySkill = (user.skills && user.skills[0]) || (user.interests && user.interests[0]) || 'Freelancer';
          
          return `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="user-avatar" style="width: 40px; height: 40px; font-size: 1rem;">${avatar}</div>
                <div>
                  <h4 style="margin: 0; font-size: 0.95rem; color: var(--text-color);">${user.name}</h4>
                  <p style="margin: 0; font-size: 0.8rem; color: var(--text-muted);">${primarySkill}</p>
                </div>
              </div>
              <button type="button" class="btn btn-outline btn-sm btn-view-profile" data-id="${user.id}">View Profile</button>
            </div>
          `;
        }).join('');
        applicantsList.innerHTML = applicantHTML;
      }
    }
  }

  // Apply Button Integration
  const applyBtn = backdrop.querySelector('#btn-ambil-proyek');
  if (applyBtn) {
    const currentUser = window.db ? db.getCurrentUser() : null;
    const currentProject = window.db ? (db.getProjectById(p.id) || p) : p;
    
    if (currentProject.status === 'In Progress' && currentUser && currentProject.assignedTo === currentUser.id) {
      applyBtn.textContent = 'Finish Project';
      applyBtn.disabled = false;
      
      const newApplyBtn = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);

      newApplyBtn.addEventListener('click', () => {
        const res = db.finishProject(currentProject.id);
        if (res) {
          renderUmkmProjects();
        } else {
          window.toast.error('Failed to finish project.');
        }
      });
    } else {
      // Always compute state explicitly to prevent leaking state between cards
      if (currentProject.status !== 'Open') {
        applyBtn.textContent = 'Closed';
        applyBtn.disabled = true;
      } else if (currentUser && currentProject.applicants && currentProject.applicants.includes(currentUser.id)) {
        applyBtn.textContent = 'Applied';
        applyBtn.disabled = true;
      } else {
        applyBtn.textContent = 'Apply';
        applyBtn.disabled = false;
      }

      // Replace the button to strip any old event listeners
      const newApplyBtn = applyBtn.cloneNode(true);
      applyBtn.parentNode.replaceChild(newApplyBtn, applyBtn);

      newApplyBtn.addEventListener('click', () => {
        if (!currentUser) {
          window.toast.validation('You must be logged in to apply.');
          return;
        }
        
        const res = db.applyProject(currentProject.id, currentUser.id);
        if (res) {
          window.toast.success('Project berhasil dilamar.');

          // Update ONLY this specific modal's button state
          newApplyBtn.textContent = 'Applied';
          newApplyBtn.disabled = true;
        } else {
          window.toast.error('Gagal melamar. Proyek mungkin sudah ditutup atau Anda sudah melamar.');
        }
      });
    }
  }

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




// ============================================================
// FREELANCER PROFILE MODAL (UMKM VIEW)
// ============================================================
window.switchProjectModalView = function(viewName) {
  const pHeader = document.getElementById('pdm-header-project');
  const profHeader = document.getElementById('pdm-header-profile');
  const pView = document.getElementById('pdm-view-project');
  const profView = document.getElementById('pdm-view-profile');
  
  if (!pHeader || !profHeader || !pView || !profView) return;

  if (viewName === 'profile') {
    pHeader.style.display = 'none';
    pView.style.display = 'none';
    profHeader.style.display = 'flex';
    profView.style.display = 'block';
  } else {
    // Default to 'project'
    profHeader.style.display = 'none';
    profView.style.display = 'none';
    pHeader.style.display = 'flex';
    pView.style.display = 'block';
  }
};

window.showFreelancerProfileModal = function(userId) {
  const backdrop = document.getElementById('project-detail-backdrop');
  if (!backdrop) return;
  
  const user = window.db ? db.getUserById(userId) : null;
  if (!user) return;

  const avatar = backdrop.querySelector('#pdm-profile-avatar');
  const name = backdrop.querySelector('#pdm-profile-name');
  const role = backdrop.querySelector('#pdm-profile-role');
  
  const bioSec = backdrop.querySelector('#pdm-profile-section-bio');
  const bioTxt = backdrop.querySelector('#pdm-profile-bio');
  const skillsContainer = backdrop.querySelector('#pdm-profile-skills');
  const interestsContainer = backdrop.querySelector('#pdm-profile-interests');
  const portSec = backdrop.querySelector('#pdm-profile-section-portfolio');
  const portLnk = backdrop.querySelector('#pdm-profile-portfolio');
  const contSec = backdrop.querySelector('#pdm-profile-section-contact');
  const contTxt = backdrop.querySelector('#pdm-profile-contact');

  if (avatar) avatar.textContent = window.getAvatarInitials(user.name);
  if (name) name.textContent = user.name;
  if (role) role.textContent = user.role || 'Freelancer';
  
  if (bioSec && bioTxt) {
    if (user.bio) {
      bioSec.style.display = '';
      bioTxt.textContent = user.bio;
    } else {
      bioSec.style.display = 'none';
    }
  }

  if (skillsContainer) {
    if (user.skills && user.skills.length > 0) {
      skillsContainer.innerHTML = user.skills.map(s => `<span class="dm-pill">${s}</span>`).join('');
    } else {
      skillsContainer.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada data</span>';
    }
  }

  if (interestsContainer) {
    if (user.interests && user.interests.length > 0) {
      interestsContainer.innerHTML = user.interests.map(i => `<span class="dm-pill">${i}</span>`).join('');
    } else {
      interestsContainer.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada data</span>';
    }
  }

  if (portSec && portLnk) {
    if (user.portfolio) {
      portSec.style.display = '';
      portLnk.href = user.portfolio;
      portLnk.textContent = user.portfolio;
    } else {
      portSec.style.display = 'none';
    }
  }

  if (contSec && contTxt) {
    if (user.contact) {
      contSec.style.display = '';
      if (typeof user.contact === 'object') {
        const c = user.contact;
        let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        if (c.email) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Email:</strong><br>${c.email}</div>`;
        if (c.whatsapp) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">WhatsApp:</strong><br>${c.whatsapp}</div>`;
        if (c.instagram) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Instagram:</strong><br>${c.instagram}</div>`;
        if (c.linkedin) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">LinkedIn:</strong><br>${c.linkedin}</div>`;
        if (c.website) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Website:</strong><br><a href="${c.website}" target="_blank" style="color:var(--primary-color);">${c.website}</a></div>`;
        if (c.address) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Alamat:</strong><br>${c.address}</div>`;
        html += '</div>';
        
        // If empty object or all fields empty
        if (html === '<div style="display: flex; flex-direction: column; gap: 0.5rem;"></div>') {
          contTxt.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada kontak</span>';
        } else {
          contTxt.innerHTML = html;
        }
      } else {
        contTxt.textContent = user.contact;
      }
    } else {
      contSec.style.display = 'none';
    }
  }

  // Handle Approve button logic
  backdrop.setAttribute('data-current-applicant-id', userId);
  const currentProjectId = backdrop.getAttribute('data-current-project-id');
  const currentProject = window.db ? db.getProjectById(currentProjectId) : null;
  const approveBtn = backdrop.querySelector('#btn-approve-freelancer');
  
  if (approveBtn && currentProject) {
    if (currentProject.status !== 'Open') {
      approveBtn.style.display = 'none';
    } else {
      approveBtn.style.display = 'block';
    }
  }

  window.switchProjectModalView('profile');
  
  // Ensure the modal actually opens if it was called while hidden (e.g., from Talent AI page)
  if (backdrop.hidden) {
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Force reflow
    backdrop.offsetHeight;
    
    // Apply animation class to the backdrop itself
    backdrop.classList.add('dm-visible');
  }
};

document.body.addEventListener('click', (e) => {
  const viewProfileBtn = e.target.closest('.btn-view-profile');
  if (viewProfileBtn) {
    const userId = viewProfileBtn.dataset.id;
    if (typeof window.showFreelancerProfileModal === 'function') {
      window.showFreelancerProfileModal(userId);
    }
  }
  
  const backBtn = e.target.closest('#pdm-back-btn');
  if (backBtn) {
    if (typeof window.switchProjectModalView === 'function') {
      window.switchProjectModalView('project');
    }
  }
  
  const approveBtn = e.target.closest('#btn-approve-freelancer');
  if (approveBtn) {
    const backdrop = document.getElementById('project-detail-backdrop');
    if (!backdrop) return;
    
    const projectId = backdrop.getAttribute('data-current-project-id');
    const freelancerId = backdrop.getAttribute('data-current-applicant-id');
    
    if (projectId && freelancerId && window.db) {
      const res = db.approveApplicant(projectId, freelancerId);
      if (res) {
        window.toast.success('Freelancer successfully approved!');
        
        window.closeModal(backdrop);
        
        // Refresh UMKM dashboard if it's the current page
        if (typeof renderUmkmApplicants === 'function') {
          renderUmkmApplicants(projectId);
        }
      } else {
        window.toast.error('Failed to approve freelancer.');
      }
    }
  }
});

// Profile initialization is now delegated to navigation.js on load

// ============================================================
// ADMIN DASHBOARD
// ============================================================
function initAdminDashboard() {
  // Render based on the current page context
  if (document.getElementById('admin-view-dashboard')) {
    renderAdminStats();
  }
  if (document.getElementById('admin-view-users')) {
    renderAdminUsers();
  }
  if (document.getElementById('admin-view-projects')) {
    renderAdminProjects();
  }
  if (document.getElementById('admin-view-umkm')) {
    renderAdminUMKM();
  }

  // Global event delegation for admin actions
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.btn-suspend-user')) {
      const id = e.target.closest('.btn-suspend-user').dataset.id;
      db.suspendUser(id);
      renderAdminUsers();
    }
    if (e.target.closest('.btn-delete-user')) {
      const id = e.target.closest('.btn-delete-user').dataset.id;
      window.toast.confirm('Are you sure you want to delete this user?', (confirmed) => {
        if (confirmed) {
          db.deleteUser(id);
          renderAdminUsers();
        }
      });
    }
    if (e.target.closest('.btn-close-project')) {
      const id = e.target.closest('.btn-close-project').dataset.id;
      window.toast.confirm('Are you sure you want to force close this project?', (confirmed) => {
        if (confirmed) {
          db.forceCloseProject(id);
          renderAdminProjects();
        }
      });
    }
    if (e.target.closest('.btn-delete-project')) {
      const id = e.target.closest('.btn-delete-project').dataset.id;
      window.toast.confirm('Are you sure you want to delete this project?', (confirmed) => {
        if (confirmed) {
          db.deleteProject(id);
          renderAdminProjects();
        }
      });
    }
    if (e.target.closest('.btn-view-project')) {
      const id = parseInt(e.target.closest('.btn-view-project').dataset.id, 10);
      const data = db.getProjects().find(p => String(p.id) === String(id));
      if (data && typeof populateAndOpenProjectModal === 'function') {
        populateAndOpenProjectModal(data, window.openModal);
      }
    }
  });

  // Search and Filter Listeners
  const searchUsers = document.getElementById('admin-search-users');
  const filterRole = document.getElementById('admin-filter-role');
  if(searchUsers) searchUsers.addEventListener('input', renderAdminUsers);
  if(filterRole) filterRole.addEventListener('change', renderAdminUsers);

  const searchProjects = document.getElementById('admin-search-projects');
  const filterStatus = document.getElementById('admin-filter-status');
  if(searchProjects) searchProjects.addEventListener('input', renderAdminProjects);
  if(filterStatus) filterStatus.addEventListener('change', renderAdminProjects);

  const searchUmkm = document.getElementById('admin-search-umkm');
  if(searchUmkm) searchUmkm.addEventListener('input', renderAdminUMKM);

  // Initial render
}

function renderAdminStats() {
  if (window.admin && typeof window.admin.renderStats === 'function') {
    window.admin.renderStats();
  }
}

function renderAdminUsers() {
  const tbody = document.getElementById('admin-users-table');
  if (!tbody) return;
  
  const query = (document.getElementById('admin-search-users')?.value || '').toLowerCase();
  const role = document.getElementById('admin-filter-role')?.value || '';
  
  const users = window.db ? db.getUsers() : [];
  
  const filtered = users.filter(u => {
    const matchQ = (u.name || '').toLowerCase().includes(query) || (u.email || '').toLowerCase().includes(query);
    const matchR = !role || u.role === role;
    return matchQ && matchR;
  });
  
  tbody.innerHTML = filtered.map(u => {
    const isSuspended = u.status === 'Suspended';
    const statusBadge = isSuspended ? 'badge-suspended' : 'badge-active';
    return `
      <tr data-id="${u.id}">
        <td><strong>${u.name || '-'}</strong></td>
        <td>${u.email}</td>
        <td style="text-transform:capitalize;">${u.role}</td>
        <td><span class="admin-badge ${statusBadge}">${u.status || 'Active'}</span></td>
        <td>
          <div class="admin-table-actions">
            ${u.role === 'freelancer' ? `<button class="admin-btn-action admin-btn-view-profile" data-id="${u.id}">Profile</button>` : ''}
            <button class="admin-btn-action admin-btn-warning btn-suspend-user" data-id="${u.id}">${isSuspended ? 'Unsuspend' : 'Suspend'}</button>
            <button class="admin-btn-action admin-btn-danger btn-delete-user" data-id="${u.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminProjects() {
  const tbody = document.getElementById('admin-projects-table');
  if (!tbody) return;
  
  const query = (document.getElementById('admin-search-projects')?.value || '').toLowerCase();
  const statusFilter = document.getElementById('admin-filter-status')?.value || '';
  
  const projects = window.db ? db.getProjects() : [];
  const users = window.db ? db.getUsers() : [];
  
  const filtered = projects.filter(p => {
    const matchQ = (p.title || '').toLowerCase().includes(query);
    const matchS = !statusFilter || p.status === statusFilter;
    return matchQ && matchS;
  });
  
  tbody.innerHTML = filtered.map(p => {
    const creator = users.find(u => String(u.id) === String(p.createdBy));
    const creatorName = creator ? creator.name : 'Unknown';
    let badgeClass = 'badge-active';
    if(p.status === 'Open') badgeClass = 'badge-open';
    if(p.status === 'In Review' || p.status === 'In Progress') badgeClass = 'badge-review';
    if(p.status === 'Closed' || p.status === 'Done') badgeClass = 'badge-closed';
    
    return `
      <tr data-id="${p.id}">
        <td><strong>${p.title}</strong></td>
        <td>${creatorName}</td>
        <td><span class="admin-badge ${badgeClass}">${p.status}</span></td>
        <td>${(p.applicants || []).length}</td>
        <td>
          <div class="admin-table-actions">
            <button class="admin-btn-action btn-view-project" data-id="${p.id}">Detail</button>
            ${p.status !== 'Closed' && p.status !== 'Done' ? `<button class="admin-btn-action admin-btn-warning btn-close-project" data-id="${p.id}">Close</button>` : ''}
            <button class="admin-btn-action admin-btn-danger btn-delete-project" data-id="${p.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAdminUMKM() {
  const tbody = document.getElementById('admin-umkm-table');
  if (!tbody) return;
  
  const query = (document.getElementById('admin-search-umkm')?.value || '').toLowerCase();
  
  const users = window.db ? db.getUsers() : [];
  const projects = window.db ? db.getProjects() : [];
  
  const umkms = users.filter(u => u.role === 'umkm');
  
  const filtered = umkms.filter(u => {
    return (u.businessName || u.name || '').toLowerCase().includes(query);
  });
  
  tbody.innerHTML = filtered.map(u => {
    const uProjects = projects.filter(p => String(p.createdBy) === String(u.id));
    const approvedCount = uProjects.filter(p => p.assignedTo).length;
    
    return `
      <tr data-id="${u.id}">
        <td><strong>${u.businessName || u.name || '-'}</strong></td>
        <td>${u.businessCategory || '-'}</td>
        <td>${uProjects.length}</td>
        <td>${approvedCount}</td>
      </tr>
    `;
  }).join('');
}

// Attach init to DOMContentLoaded if we are on the admin page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.admin-layout')) {
    initAdminDashboard();
  }
});

// ============================================================
// ADMIN USER PROFILE VIEWER
// ============================================================

function injectAdminUserProfileModal() {
  let modal = document.getElementById('admin-user-profile-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.className = 'detail-backdrop';
  modal.id = 'admin-user-profile-modal';
  modal.hidden = true;
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'admin-pm-name');
  
  modal.innerHTML = `
    <div class="detail-modal">
      <div class="dm-header">
        <div style="display: flex; gap: 16px; align-items: center;">
          <div class="user-avatar" id="admin-pm-avatar" style="width: 40px; height: 40px; font-size: 1rem;">U</div>
          <div>
            <h2 class="dm-title" id="admin-pm-name" style="margin:0; font-size: 1.1rem;">User Name</h2>
            <span class="badge" id="admin-pm-role" style="font-size: 0.7rem; text-transform: uppercase;">Role</span>
          </div>
        </div>
        <button class="dm-close-btn" id="admin-pm-close-btn" aria-label="Tutup modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="dm-body">
        <div class="dm-section" id="admin-pm-section-bio">
          <span class="dm-section-label">Tentang</span>
          <p class="dm-section-text" id="admin-pm-bio">—</p>
        </div>
        <div class="dm-section">
          <span class="dm-section-label">Skill</span>
          <div class="dm-pills" id="admin-pm-skills"></div>
        </div>
        <div class="dm-section">
          <span class="dm-section-label">Minat &amp; Bidang</span>
          <div class="dm-pills" id="admin-pm-interests"></div>
        </div>
        <div class="dm-section" id="admin-pm-section-portfolio">
          <span class="dm-section-label">Portfolio</span>
          <p class="dm-section-text"><a href="#" id="admin-pm-portfolio" target="_blank" style="color: var(--accent-green); text-decoration: none; word-break: break-all;"></a></p>
        </div>
        <div class="dm-section" id="admin-pm-section-contact">
          <span class="dm-section-label">Kontak</span>
          <p class="dm-section-text" id="admin-pm-contact"></p>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#admin-pm-close-btn');
  closeBtn.addEventListener('click', () => {
    if (typeof window.closeModal === 'function') {
      window.closeModal(modal);
    }
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (typeof window.closeModal === 'function') {
        window.closeModal(modal);
      }
    }
  });

  return modal;
}

window.showAdminUserProfileModal = function(userId) {
  const modal = injectAdminUserProfileModal();
  
  const user = window.db ? db.getUserById(userId) : null;
  if (!user) return;

  const avatar = modal.querySelector('#admin-pm-avatar');
  const name = modal.querySelector('#admin-pm-name');
  const role = modal.querySelector('#admin-pm-role');
  
  const bioSec = modal.querySelector('#admin-pm-section-bio');
  const bioTxt = modal.querySelector('#admin-pm-bio');
  const skillsContainer = modal.querySelector('#admin-pm-skills');
  const interestsContainer = modal.querySelector('#admin-pm-interests');
  const portSec = modal.querySelector('#admin-pm-section-portfolio');
  const portLnk = modal.querySelector('#admin-pm-portfolio');
  const contSec = modal.querySelector('#admin-pm-section-contact');
  const contTxt = modal.querySelector('#admin-pm-contact');

  if (avatar) avatar.textContent = window.getAvatarInitials(user.name);
  if (name) name.textContent = user.name;
  if (role) role.textContent = user.role || 'User';
  
  if (bioSec && bioTxt) {
    if (user.bio) {
      bioSec.style.display = '';
      bioTxt.textContent = user.bio;
    } else {
      bioSec.style.display = 'none';
    }
  }

  if (skillsContainer) {
    if (user.skills && user.skills.length > 0) {
      skillsContainer.innerHTML = user.skills.map(s => `<span class="dm-pill">${s}</span>`).join('');
    } else {
      skillsContainer.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada data</span>';
    }
  }

  if (interestsContainer) {
    if (user.interests && user.interests.length > 0) {
      interestsContainer.innerHTML = user.interests.map(i => `<span class="dm-pill">${i}</span>`).join('');
    } else {
      interestsContainer.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada data</span>';
    }
  }

  if (portSec && portLnk) {
    if (user.portfolio) {
      portSec.style.display = '';
      portLnk.href = user.portfolio;
      portLnk.textContent = user.portfolio;
    } else {
      portSec.style.display = 'none';
    }
  }

  if (contSec && contTxt) {
    if (user.contact) {
      contSec.style.display = '';
      if (typeof user.contact === 'object') {
        const c = user.contact;
        let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        if (c.email) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Email:</strong><br>${c.email}</div>`;
        if (c.whatsapp) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">WhatsApp:</strong><br>${c.whatsapp}</div>`;
        if (c.instagram) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Instagram:</strong><br>${c.instagram}</div>`;
        if (c.linkedin) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">LinkedIn:</strong><br>${c.linkedin}</div>`;
        if (c.website) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Website:</strong><br><a href="${c.website}" target="_blank" style="color:var(--primary-color);">${c.website}</a></div>`;
        if (c.address) html += `<div><strong style="color:var(--text-muted); font-size:var(--fs-sm);">Alamat:</strong><br>${c.address}</div>`;
        html += '</div>';
        
        if (html === '<div style="display: flex; flex-direction: column; gap: 0.5rem;"></div>') {
          contTxt.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada kontak</span>';
        } else {
          contTxt.innerHTML = html;
        }
      } else {
        contTxt.textContent = user.contact;
      }
    } else {
      contSec.style.display = 'none';
    }
  }

  document.body.style.overflow = 'hidden';
  modal.hidden = false;
  void modal.offsetWidth;
  modal.classList.add('dm-visible');
};

document.body.addEventListener('click', (e) => {
  const adminViewProfileBtn = e.target.closest('.admin-btn-view-profile');
  if (adminViewProfileBtn) {
    const userId = adminViewProfileBtn.dataset.id;
    if (typeof window.showAdminUserProfileModal === 'function') {
      window.showAdminUserProfileModal(userId);
    }
  }
});
