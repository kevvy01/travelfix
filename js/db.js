// js/db.js — Simulated Local Database Auth
(function (global) {
  'use strict';

  const DB_KEY = 'bantul_users';

  // --- Database Migration Helpers ---
  function migrateUsers() {
    const users = JSON.parse(localStorage.getItem(DB_KEY));
    if (!users) return;

    let maxId = users.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
    let updated = false;

    users.forEach(u => {
      if (!u.id) {
        maxId++;
        u.id = maxId;
        updated = true;
      }
      if (!u.createdAt) {
        u.createdAt = new Date().toISOString();
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }
  }

  function migrateCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && !currentUser.id) {
      const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
      const match = users.find(u => u.email === currentUser.email);
      if (match && match.id) {
        currentUser.id = match.id;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
      }
    }
  }

  function migrateProjects() {
    const projects = JSON.parse(localStorage.getItem('bantul_projects'));
    if (!projects) return;

    let updated = false;

    projects.forEach(p => {
      if (p.createdBy === undefined) {
        p.createdBy = null;
        updated = true;
      }
      if (!p.applicants) {
        p.applicants = [];
        updated = true;
      }
      if (p.assignedTo === undefined) {
        p.assignedTo = null;
        updated = true;
      }
      if (!p.createdAt) {
        p.createdAt = new Date().toISOString();
        updated = true;
      }
      if (!p.updatedAt) {
        p.updatedAt = p.createdAt;
        updated = true;
      }
      
      if (p.categories === null || p.categories === undefined) {
        p.categories = [];
        updated = true;
      } else if (typeof p.categories === 'string') {
        p.categories = [p.categories];
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem('bantul_projects', JSON.stringify(projects));
    }
  }

  // Task 2.1: Initialization (initDB)
  function initDB() {
    let users = JSON.parse(localStorage.getItem(DB_KEY));
    if (!users) {
      // Seed default accounts
      users = [
        { name: "User Reguler", email: "user123@gmail.com", password: "user123", role: "freelancer" },
        { name: "Admin System", email: "admin123@gmail.com", password: "admin123", role: "admin" }
      ];
      localStorage.setItem(DB_KEY, JSON.stringify(users));
    }

    if (!localStorage.getItem('bantul_projects') && typeof marketplaceProjects !== 'undefined') {
      localStorage.setItem('bantul_projects', JSON.stringify(marketplaceProjects));
    }
    if (!localStorage.getItem('bantul_portfolio') && typeof portfolioProjects !== 'undefined') {
      localStorage.setItem('bantul_portfolio', JSON.stringify(portfolioProjects));
    }
    if (!localStorage.getItem('bantul_villages') && typeof trailLocations !== 'undefined') {
      localStorage.setItem('bantul_villages', JSON.stringify(trailLocations));
    }

    // Run migrations
    migrateUsers();
    migrateCurrentUser();
    migrateProjects();
  }

  // Task 2.2: Register User
  function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    
    // Check if email exists
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
      return { success: false, message: "Email sudah terdaftar!" };
    }

    // Generate unique incremental id
    const newId = users.length > 0 ? Math.max(...users.map(u => Number(u.id) || 0)) + 1 : 1;

    // Push new user
    users.push({ 
      id: newId,
      name, 
      email, 
      password, 
      role: "freelancer",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return { success: true };
  }

  // Task 2.3: Login User
  function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      // Save current session
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, role: user.role };
    } else {
      return { success: false, message: "Email atau password salah!" };
    }
  }

  // New Data Access Layer API
  function getUsers() {
    return JSON.parse(localStorage.getItem(DB_KEY)) || [];
  }

  function getProjects() {
    return JSON.parse(localStorage.getItem('bantul_projects')) || [];
  }

  function getPortfolio() {
    return JSON.parse(localStorage.getItem('bantul_portfolio')) || [];
  }

  function getVillages() {
    return JSON.parse(localStorage.getItem('bantul_villages')) || [];
  }

  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser')) || null;
  }

  function saveUsers(users) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  }

  function saveProjects(projects) {
    localStorage.setItem('bantul_projects', JSON.stringify(projects));
  }

  function logout() {
    localStorage.removeItem('currentUser');
  }

  // --- CRUD API ---

  // User CRUD
  function getUserById(id) {
    const users = getUsers();
    const user = users.find(u => String(u.id) === String(id));
    return user || null;
  }

  function updateUser(id, updates) {
    const users = getUsers();
    const index = users.findIndex(u => String(u.id) === String(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveUsers(users);
      return users[index];
    }
    return null;
  }

  // Project CRUD
  function getProjectById(id) {
    const projects = getProjects();
    const project = projects.find(p => String(p.id) === String(id));
    return project || null;
  }

  function createProject(project) {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const projects = getProjects();
    const newId = projects.length > 0 ? Math.max(...projects.map(p => Number(p.id) || 0)) + 1 : 1;
    const now = new Date().toISOString();

    let safeCategories = [];
    if (project.categories) {
      safeCategories = Array.isArray(project.categories) 
        ? project.categories 
        : (typeof project.categories === 'string' ? [project.categories] : []);
    }

    const newProject = { 
      id: newId, 
      createdBy: currentUser.id,
      applicants: [],
      assignedTo: null,
      createdAt: now,
      updatedAt: now,
      ...project,
      categories: safeCategories
    };
    projects.push(newProject);
    saveProjects(projects);
    return newProject;
  }

  function updateProject(id, updates) {
    const projects = getProjects();
    const index = projects.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      saveProjects(projects);
      return projects[index];
    }
    return null;
  }

  function deleteProject(id) {
    const projects = getProjects();
    const index = projects.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      projects.splice(index, 1);
      saveProjects(projects);
      return true;
    }
    return false;
  }

  // --- Workflow Engine API ---

  function applyProject(projectId, freelancerId) {
    const project = getProjectById(projectId);
    if (!project || project.status !== "Open") return null;
    
    if (project.applicants.includes(freelancerId)) {
      return null;
    }

    const updates = {
      applicants: [...project.applicants, freelancerId],
      updatedAt: new Date().toISOString()
    };
    return updateProject(projectId, updates);
  }

  function approveApplicant(projectId, freelancerId) {
    const project = getProjectById(projectId);
    if (!project) return null;
    
    if (!project.applicants.includes(freelancerId)) {
      return null;
    }

    const updates = {
      assignedTo: freelancerId,
      status: "In Progress",
      updatedAt: new Date().toISOString()
    };
    return updateProject(projectId, updates);
  }

  function finishProject(projectId) {
    const project = getProjectById(projectId);
    if (!project || project.status !== "In Progress") return null;

    const updates = {
      status: "Done",
      updatedAt: new Date().toISOString()
    };
    return updateProject(projectId, updates);
  }

  function getProjectsByCreator(userId) {
    return getProjects().filter(p => String(p.createdBy) === String(userId));
  }

  function getAppliedProjects(freelancerId) {
    return getProjects().filter(p => p.applicants.includes(freelancerId));
  }

  function getAssignedProjects(freelancerId) {
    return getProjects().filter(p => String(p.assignedTo) === String(freelancerId));
  }

  // Expose to global window object
  global.db = {
    initDB,
    registerUser,
    loginUser,
    getUsers,
    getProjects,
    getPortfolio,
    getVillages,
    getCurrentUser,
    saveUsers,
    saveProjects,
    logout,
    getUserById,
    updateUser,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    applyProject,
    approveApplicant,
    finishProject,
    getProjectsByCreator,
    getAppliedProjects,
    getAssignedProjects
  };

  // Auto-init on load
  initDB();

})(window);
