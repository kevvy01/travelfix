// js/auth.js — Authentication Form Handlers
(function () {
  'use strict';

  // --- Registration Logic ---
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const passInput = document.getElementById('reg-password');
      const confirmInput = document.getElementById('reg-confirm');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passInput.value;
      const confirmPassword = confirmInput.value;

      // Reset errors
      [nameInput, emailInput, passInput, confirmInput].forEach(el => el.classList.remove('error'));

      if (password !== confirmPassword) {
        alert("Password dan Konfirmasi Password tidak cocok!");
        passInput.classList.add('error');
        confirmInput.classList.add('error');
        return;
      }

      // Call simulated database
      const result = window.db.registerUser(name, email, password);

      if (result.success) {
        alert("Registrasi berhasil! Silakan login.");
        window.location.href = 'login.html';
      } else {
        alert(result.message);
        emailInput.classList.add('error');
      }
    });
  }

  // --- Login Logic ---
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('password');
    const eyeToggle = document.getElementById('eye-toggle');

    // Eye toggle for login password
    if (eyeToggle) {
      eyeToggle.addEventListener('click', function () {
        const isPassword = passInput.type === 'password';
        passInput.type = isPassword ? 'text' : 'password';

        const eyeIcon = document.getElementById('icon-eye');
        const eyeOffIcon = document.getElementById('icon-eye-off');
        if (eyeIcon) eyeIcon.style.display = isPassword ? 'none' : 'block';
        if (eyeOffIcon) eyeOffIcon.style.display = isPassword ? 'block' : 'none';
      });
    }

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passInput.value;

      emailInput.classList.remove('error');
      passInput.classList.remove('error');

      // Call simulated database
      const result = window.db.loginUser(email, password);

      if (result.success) {
        if (result.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'marketplace.html';
        }
      } else {
        emailInput.classList.add('error');
        passInput.classList.add('error');
        alert(result.message);
        passInput.value = '';
        passInput.focus();
      }
    });
  }

})();
