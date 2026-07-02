window.highlightActiveNav = function() {
  const path = window.location.pathname.split("/").pop() || "";
  const links = document.querySelectorAll(".nav-tab");
  links.forEach((link) => {
    const href = link.getAttribute("href").split("/").pop();
    const isMarket = (href === "marketplace.html") && (path === "marketplace.html");
    if (href === path || isMarket) {
      link.classList.add("active");
    }
  });
};

window.initNotificationDropdown = function() {
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
};

window.updateProfileUI = function() {
  const user = window.auth ? window.auth.getCurrentUser() : null;
  if (!user) return;

  // 1. Update text content
  const navName = document.getElementById('nav-user-name');
  const dropdownName = document.getElementById('dropdown-user-name');
  const dropdownEmail = document.getElementById('dropdown-user-email');
  
  if (navName) navName.textContent = user.name.split(' ')[0]; 
  if (dropdownName) dropdownName.textContent = user.name;
  if (dropdownEmail) dropdownEmail.textContent = user.email;
  
  // 2. Avatar Initials Logic
  const initials = user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
    
  const navAvatar = document.getElementById('nav-user-avatar');
  const dropdownAvatar = document.getElementById('dropdown-user-avatar');
  
  if (navAvatar) navAvatar.textContent = initials;
  if (dropdownAvatar) dropdownAvatar.textContent = initials;

  // 3. Update Dropdown Content
  const umkmSection = document.getElementById('pm-section-umkm');
  const skillsSection = document.getElementById('pm-section-skills');
  const interestsSection = document.getElementById('pm-section-interests');

  if (user.role === 'umkm') {
    if (umkmSection) {
      umkmSection.style.display = 'block';
      const catEl = document.getElementById('pm-umkm-category');
      const locEl = document.getElementById('pm-umkm-location');
      if (catEl) catEl.textContent = user.businessCategory || '—';
      if (locEl) locEl.textContent = user.location || '—';
    }
    if (skillsSection) skillsSection.style.display = 'none';
    if (interestsSection) interestsSection.style.display = 'none';
  } else {
    if (umkmSection) umkmSection.style.display = 'none';
    
    if (skillsSection) {
      skillsSection.style.display = 'block';
      const container = document.getElementById('pm-skills-container');
      if (container) {
        if (user.skills && user.skills.length > 0) {
          container.innerHTML = user.skills.map(s => `<span>${s}</span>`).join('');
        } else {
          container.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada data</span>';
        }
      }
    }

    if (interestsSection) {
      interestsSection.style.display = 'block';
      const container = document.getElementById('pm-interests-container');
      if (container) {
        if (user.interests && user.interests.length > 0) {
          container.innerHTML = user.interests.map(i => `<span>${i}</span>`).join('');
        } else {
          container.innerHTML = '<span style="color:var(--text-muted); font-size:var(--fs-sm);">Belum ada data</span>';
        }
      }
    }
  }
};

window.initNavigation = function() {
  if (typeof window.highlightActiveNav === 'function') window.highlightActiveNav();
  if (typeof window.initNotificationDropdown === 'function') window.initNotificationDropdown();
  if (typeof window.updateProfileUI === 'function') window.updateProfileUI();
};
