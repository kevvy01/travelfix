// js/db.js — Simulated Local Database Auth
(function (global) {
  'use strict';

  const DB_KEY = 'bantul_users';

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
  }

  // Task 2.2: Register User
  function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    
    // Check if email exists
    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
      return { success: false, message: "Email sudah terdaftar!" };
    }

    // Push new user
    users.push({ name, email, password, role: "freelancer" });
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
    logout
  };

  // Auto-init on load
  initDB();

})(window);
