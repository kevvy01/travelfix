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
      const roleInput = document.getElementById('reg-role');
      const role = roleInput ? roleInput.value : 'freelancer';

      // Reset errors
      [nameInput, emailInput, passInput, confirmInput].forEach(el => el.classList.remove('error'));

      // Validate empty fields
      if (!name || !email || !password || !confirmPassword) {
        window.toast.validation("Semua kolom harus diisi.");
        if (!name) nameInput.classList.add('error');
        if (!email) emailInput.classList.add('error');
        if (!password) passInput.classList.add('error');
        if (!confirmPassword) confirmInput.classList.add('error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        window.toast.validation("Format email tidak valid.");
        emailInput.classList.add('error');
        return;
      }

      // Validate password length
      if (password.length < 8) {
        window.toast.validation("Password minimal 8 karakter.");
        passInput.classList.add('error');
        return;
      }

      // Validate password match
      if (password !== confirmPassword) {
        window.toast.validation("Password dan Konfirmasi Password tidak cocok!");
        passInput.classList.add('error');
        confirmInput.classList.add('error');
        return;
      }

      // Call simulated database
      const result = window.db.registerUser(name, email, password, role);

      if (result.success) {
        window.toast.success("Registrasi berhasil! Silakan login.");
        window.location.href = 'login.html';
      } else {
        window.toast.validation(result.message);
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
        } else if (result.role === 'umkm') {
          window.location.href = 'umkm-dashboard.html';
        } else {
          window.location.href = 'marketplace.html';
        }
      } else {
        emailInput.classList.add('error');
        passInput.classList.add('error');
        window.toast.validation(result.message);
        passInput.value = '';
        passInput.focus();
      }
    });
  }

})();
