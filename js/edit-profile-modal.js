// ============================================================
// js/edit-profile-modal.js — Edit Profile Modal Logic
// ============================================================

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── DOM References ────────────────────────────────────────
    const modal      = document.getElementById('edit-profile-modal');
    const backdrop   = document.getElementById('edit-profile-backdrop');
    const btnOpen    = document.getElementById('btn-open-edit-profile');
    const btnClose   = document.getElementById('btn-close-edit-profile');
    const btnCancel  = document.getElementById('btn-cancel-edit-profile');
    const btnSave    = document.getElementById('btn-save-edit-profile');

    const inputName  = document.getElementById('edit-name');
    const inputEmail = document.getElementById('edit-email');
    const inputPass  = document.getElementById('edit-password');

    // Guard: if modal HTML does not exist on this page, exit silently
    if (!modal || !backdrop || !btnOpen) return;

    // ── Open Modal ────────────────────────────────────────────
    function openModal() {
      const rawUser = localStorage.getItem('currentUser');
      if (!rawUser) return;
      const user = JSON.parse(rawUser);

      // 1. Auto-fill text inputs
      if (inputName)  inputName.value  = user.name  || '';
      if (inputEmail) inputEmail.value = user.email || '';
      if (inputPass)  inputPass.value  = '';  // always blank for security

      // 2. Pre-select saved skills & interests
      const savedSkills    = Array.isArray(user.skills)    ? user.skills    : [];
      const savedInterests = Array.isArray(user.interests) ? user.interests : [];

      modal.querySelectorAll('.epm-pill').forEach(function (pill) {
        const skillVal    = pill.getAttribute('data-skill');
        const interestVal = pill.getAttribute('data-interest');
        const isSelected  =
          (skillVal    && savedSkills.includes(skillVal))    ||
          (interestVal && savedInterests.includes(interestVal));

        pill.classList.toggle('selected', isSelected);
      });

      // 3. Show
      backdrop.hidden = false;
      modal.hidden    = false;
      document.body.style.overflow = 'hidden';

      // rAF so CSS transitions fire after display change
      requestAnimationFrame(function () {
        backdrop.classList.add('epm-visible');
        modal.classList.add('epm-visible');
      });

      // Focus first input for accessibility
      if (inputName) inputName.focus();
    }

    // ── Close Modal ───────────────────────────────────────────
    function closeModal() {
      backdrop.classList.remove('epm-visible');
      modal.classList.remove('epm-visible');
      document.body.style.overflow = '';

      modal.addEventListener('transitionend', function handler() {
        modal.hidden    = true;
        backdrop.hidden = true;
        modal.removeEventListener('transitionend', handler);
      });
    }

    // ── Pill Toggle (event delegation) ────────────────────────
    modal.addEventListener('click', function (e) {
      const pill = e.target.closest('.epm-pill');
      if (pill) {
        pill.classList.toggle('selected');
      }
    });

    // ── Save Handler ──────────────────────────────────────────
    function handleSave() {
      const rawUser = localStorage.getItem('currentUser');
      if (!rawUser) return;
      const currentUser = JSON.parse(rawUser);

      const newName     = inputName  ? inputName.value.trim()  : currentUser.name;
      const newEmail    = inputEmail ? inputEmail.value.trim() : currentUser.email;
      const newPassword = inputPass  ? inputPass.value         : '';

      if (!newName || !newEmail) {
        alert('Nama dan Email tidak boleh kosong!');
        return;
      }

      // Collect selected pills
      const newSkills    = [];
      const newInterests = [];
      modal.querySelectorAll('.epm-pill.selected').forEach(function (pill) {
        const s = pill.getAttribute('data-skill');
        const i = pill.getAttribute('data-interest');
        if (s) newSkills.push(s);
        if (i) newInterests.push(i);
      });

      // Persist via db.js
      if (window.db && typeof window.db.updateUserProfile === 'function') {
        const result = window.db.updateUserProfile(
          currentUser.email,   // look-up key (old email)
          newName,
          newEmail,
          newPassword,
          newSkills,
          newInterests
        );

        if (!result.success) {
          alert('Gagal memperbarui profil: ' + (result.message || 'Unknown error'));
          return;
        }
      } else {
        // Fallback: update currentUser directly if db.js isn't loaded
        const updated = Object.assign({}, currentUser, {
          name: newName, email: newEmail,
          skills: newSkills, interests: newInterests
        });
        if (newPassword.trim() !== '') updated.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(updated));
      }

      // Re-render dropdown UI (function lives in app.js)
      if (typeof updateProfileUI === 'function') {
        updateProfileUI();
      }

      // Also update dynamic skill/interest pill lists in the dropdown
      renderDropdownPills();

      closeModal();
      // Small delay so transition doesn't overlap the alert box
      setTimeout(function () {
        alert('Profil berhasil diperbarui!');
      }, 350);
    }

    // ── Re-render dropdown skill/interest pills ───────────────
    function renderDropdownPills() {
      const rawUser = localStorage.getItem('currentUser');
      if (!rawUser) return;
      const user = JSON.parse(rawUser);

      const skillsList    = document.getElementById('dropdown-skills-list');
      const interestsList = document.getElementById('dropdown-interests-list');

      if (skillsList) {
        const skills = Array.isArray(user.skills) ? user.skills : [];
        skillsList.innerHTML = skills.length
          ? skills.map(function (s) { return '<span>' + s + '</span>'; }).join('')
          : '<span style="color:var(--text-muted);font-size:0.8rem;">Belum ada skill</span>';
      }

      if (interestsList) {
        const interests = Array.isArray(user.interests) ? user.interests : [];
        interestsList.innerHTML = interests.length
          ? interests.map(function (i) { return '<span>' + i + '</span>'; }).join('')
          : '<span style="color:var(--text-muted);font-size:0.8rem;">Belum ada minat</span>';
      }
    }

    // ── Event Bindings ────────────────────────────────────────
    btnOpen.addEventListener('click', openModal);
    if (btnClose)  btnClose.addEventListener('click', closeModal);
    if (btnCancel) btnCancel.addEventListener('click', closeModal);
    if (btnSave)   btnSave.addEventListener('click', handleSave);

    // Close on backdrop click
    backdrop.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    // ── Initial render of dropdown pills on page load ─────────
    renderDropdownPills();

  });

})();
