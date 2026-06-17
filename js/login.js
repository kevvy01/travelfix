// js/login.js — Dummy Authentication Logic

(function () {
  'use strict';

  /* ── Element References ─────────────────────────────── */
  const form        = document.getElementById('login-form');
  const emailInput  = document.getElementById('email');
  const passInput   = document.getElementById('password');
  const eyeToggle   = document.getElementById('eye-toggle');

  /* ── Credentials ─────────────────────────────────────── */
  const VALID_EMAIL    = 'admin123@gmail.com';
  const VALID_PASSWORD = 'admin123';

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

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // ✅ Correct credentials — redirect
      window.location.href = 'marketplace.html';
    } else {
      // ❌ Wrong credentials — shake inputs & alert
      emailInput.classList.add('error');
      passInput.classList.add('error');
      alert('Email atau password salah!');
      passInput.value = '';
      passInput.focus();
    }
  });
})();
