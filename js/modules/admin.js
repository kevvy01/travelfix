window.admin = {
  renderStats: function() {
    const users = window.db ? window.db.getUsers() : [];
    const projects = window.db ? window.db.getProjects() : [];

    const totalUsers = users.length;
    const totalFreelancers = users.filter(u => u.role === 'freelancer').length;
    const totalUMKM = users.filter(u => u.role === 'umkm').length;
    const totalProjects = projects.length;
    const openProjects = projects.filter(p => p.status === 'Open').length;
    const inReviewProjects = projects.filter(p => p.status === 'In Review' || p.status === 'In Progress').length;
    const completedProjects = projects.filter(p => p.status === 'Done' || p.status === 'Closed').length;

    const statValues = document.querySelectorAll('.admin-stat-card .admin-stat-value');
    const statTitles = document.querySelectorAll('.admin-stat-card .admin-stat-header');
    
    if (statValues.length >= 7) {
      statTitles[0].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> TOTAL PENGGUNA`;
      statValues[0].textContent = totalUsers;
      
      statTitles[1].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> TOTAL PROYEK`;
      statValues[1].textContent = totalProjects;
      
      statTitles[2].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> TOTAL FREELANCER`;
      statValues[2].textContent = totalFreelancers;
      
      statTitles[3].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> TOTAL UMKM`;
      statValues[3].textContent = totalUMKM;
      
      statTitles[4].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> OPEN PROJECTS`;
      statValues[4].textContent = openProjects;
      
      statTitles[5].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> IN PROGRESS PROJECTS`;
      statValues[5].textContent = inReviewProjects;
      
      statTitles[6].innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> COMPLETED PROJECTS`;
      statValues[6].textContent = completedProjects;
    }

    this.renderChart(projects);
  },

  renderChart: function(projects) {
    // Generate the last 6 months data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    const now = new Date();
    const counts = [0, 0, 0, 0, 0, 0];
    const labels = ["", "", "", "", "", ""];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels[5 - i] = monthNames[d.getMonth()];
      
      // Count projects created in this month
      counts[5 - i] = projects.filter(p => {
        if (!p.createdAt) return false;
        const pDate = new Date(p.createdAt);
        return pDate.getMonth() === d.getMonth() && pDate.getFullYear() === d.getFullYear();
      }).length;
    }
    
    // Determine Y scale
    const maxCount = Math.max(...counts, 10); // Ensure at least scale of 10
    
    // X coordinates mapping (0 to 500)
    // 6 points -> indices 0 to 5 -> x = i * 100
    const points = counts.map((c, i) => {
      const x = i * 100;
      // Y mapping: 0 -> 160 (bottom of chart), maxCount -> 20 (top of chart)
      const y = 160 - ((c / maxCount) * 140);
      return { x, y, c };
    });

    const polygonEl = document.getElementById('admin-chart-fill');
    const polylineEl = document.getElementById('admin-chart-line');
    const pointsEl = document.getElementById('admin-chart-points');
    const labelsEl = document.getElementById('admin-chart-labels');
    
    if (!polygonEl || !polylineEl || !pointsEl || !labelsEl) return;

    const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
    
    polygonEl.setAttribute('points', `0,200 ${pointsStr} 500,200`);
    polylineEl.setAttribute('points', pointsStr);
    
    pointsEl.innerHTML = points.map(p => 
      `<circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--bg-surface)" stroke="var(--accent-green)" stroke-width="2"><title>${p.c} Proyek</title></circle>`
    ).join('');
    
    labelsEl.innerHTML = labels.map(l => `<span>${l}</span>`).join('');
  }
};
