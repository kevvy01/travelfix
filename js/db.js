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

  // Task: Update User Profile
  function updateUserProfile(currentEmail, newName, newEmail, newPassword, newSkills, newInterests) {
    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    const userIndex = users.findIndex(u => u.email === currentEmail);

    if (userIndex === -1) {
      return { success: false, message: 'User tidak ditemukan.' };
    }

    // Update name & email
    users[userIndex].name  = newName;
    users[userIndex].email = newEmail;

    // Only update password if a new one was provided
    if (newPassword && newPassword.trim() !== '') {
      users[userIndex].password = newPassword;
    }

    // Update skills & interests arrays
    users[userIndex].skills    = newSkills;
    users[userIndex].interests = newInterests;

    // Persist the updated users array
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    // Sync the live session so the page reflects changes immediately
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.email === currentEmail) {
      const updatedSession = { ...currentUser, ...users[userIndex] };
      localStorage.setItem('currentUser', JSON.stringify(updatedSession));
    }

    return { success: true };
  }

  // Expose to global window object
  global.db = {
    initDB,
    registerUser,
    loginUser,
    updateUserProfile
  };

  // Auto-init on load
  initDB();

})(window);
