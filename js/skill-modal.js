// js/skill-modal.js — Multi-Step Skill & Minat Update Modal

(function () {
  'use strict';

  /* ── Element refs ─────────────────────────────────────── */
  const modal     = document.getElementById('skill-modal');
  const backdrop  = document.getElementById('skill-modal-backdrop');
  if (!modal || !backdrop) return;

  const step1     = document.getElementById('skill-step-1');
  const step2     = document.getElementById('skill-step-2');
  const btnNext   = document.getElementById('skill-btn-next');
  const btnSave   = document.getElementById('skill-btn-save');
  const btnSkip   = document.getElementById('skill-btn-skip');

  /* ── Open / Close ─────────────────────────────────────── */
  function openModal() {
    backdrop.hidden = false;
    modal.hidden    = false;
    document.body.style.overflow = 'hidden';
    // small delay so CSS transition fires
    requestAnimationFrame(() => {
      backdrop.classList.add('sm-visible');
      modal.classList.add('sm-visible');
    });
    showStep(1);
  }

  function closeModal() {
    backdrop.classList.remove('sm-visible');
    modal.classList.remove('sm-visible');
    document.body.style.overflow = '';
    modal.addEventListener('transitionend', function handler() {
      modal.hidden    = true;
      backdrop.hidden = true;
      modal.removeEventListener('transitionend', handler);
    });
  }

  /* ── Step switching ───────────────────────────────────── */
  function showStep(n) {
    step1.hidden = (n !== 1);
    step2.hidden = (n !== 2);
  }

  /* ── Pill toggle ──────────────────────────────────────── */
  function initPills(containerId, activeClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.skill-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        pill.classList.toggle(activeClass);
        pill.setAttribute('aria-pressed', pill.classList.contains(activeClass));
      });
    });
  }

  /* ── Wire external trigger (from profile-modal.js) ────── */
  // profile-modal.js fires a custom event 'open-skill-modal'
  document.addEventListener('open-skill-modal', openModal);

  // Also wire up the button directly if on this page
  const pmUpdateBtn = document.getElementById('pm-update-skill');
  if (pmUpdateBtn) {
    pmUpdateBtn.addEventListener('click', openModal);
  }

  /* ── Button events ────────────────────────────────────── */
  backdrop.addEventListener('click', closeModal);

  if (btnNext)  btnNext.addEventListener('click',  () => showStep(2));
  if (btnSave)  btnSave.addEventListener('click',  closeModal);
  if (btnSkip)  btnSkip.addEventListener('click',  closeModal);

  /* ── Escape key ───────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ── Init pills on load ───────────────────────────────── */
  initPills('skill-pill-grid',   'skill-pill--active');
  initPills('interest-pill-grid', 'interest-pill--active');

})();
