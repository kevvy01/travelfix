// js/login.js — Dummy Authentication Logic

(function () {
  'use strict';

  /* ── Element References ─────────────────────────────── */
  const form        = document.getElementById('login-form');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const eyeToggle   = document.getElementById('eye-toggle');

  /* ── Credentials & Roles ─────────────────────────────── */
  const ROLES = {
    user: { email: 'user123@gmail.com', pass: 'user123', url: 'marketplace.html' },
    admin: { email: 'admin123@gmail.com', pass: 'admin123', url: 'admin-dashboard.html' }
  };

  /* ── Eye Toggle: show / hide password ─────────────────── */
  eyeToggle.addEventListener('click', function () {
    const isPassword = passInput.type === 'password';
    passInput.type   = isPassword ? 'text' : 'password';

    // Swap icon: eye ↔ eye-off
    const eyeIcon    = document.getElementById('icon-eye');
    const eyeOffIcon = document.getElementById('icon-eye-off');
    eyeIcon.style.display    = isPassword ? 'none'  : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';
  });

  /* ── Clear error state on input ───────────────────────── */
  function clearError(input) {
    input.classList.remove('error');
  }

  emailInput.addEventListener('input', () => clearError(emailInput));
  passInput.addEventListener('input',  () => clearError(passInput));

  /* ── Form Submit ─────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email    = emailInput.value.trim();
    const password = passInput.value;

    if (email === ROLES.user.email && password === ROLES.user.pass) {
      // ✅ Regular User Role
      window.location.href = ROLES.user.url;
    } else if (email === ROLES.admin.email && password === ROLES.admin.pass) {
      // ✅ Administrator Role
      window.location.href = ROLES.admin.url;
    } else {
      // ❌ Wrong credentials — shake inputs & alert
      emailInput.classList.add('error');
      passInput.classList.add('error');
      window.toast.alert('Email atau password salah.');
      passInput.value = '';
      passInput.focus();
    }
  });
})();
