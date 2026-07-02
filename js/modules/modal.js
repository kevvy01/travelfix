export function openModal(backdropEl) {
  if (!backdropEl) return;
  backdropEl.hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => backdropEl.classList.add('dm-visible'));
}

export function closeModal(backdropEl) {
  if (!backdropEl) return;
  backdropEl.classList.remove('dm-visible');
  document.body.style.overflow = '';
  backdropEl.addEventListener('transitionend', function handler() {
    backdropEl.hidden = true;
    backdropEl.removeEventListener('transitionend', handler);
  });
}

export function initDetailModalsCore() {
  document.querySelectorAll('.dm-close-btn, .dm-close-footer-btn').forEach(btn => {
    if (!btn.dataset.modalCloseBound) {
      btn.dataset.modalCloseBound = "true";
      btn.addEventListener('click', () => {
        const backdrop = btn.closest('.detail-backdrop');
        closeModal(backdrop);
      });
    }
  });

  document.querySelectorAll('.detail-backdrop').forEach(backdrop => {
    if (!backdrop.dataset.modalClickBound) {
      backdrop.dataset.modalClickBound = "true";
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeModal(backdrop);
        }
      });
    }
  });

  if (!window._modalEscListenerBound) {
    window._modalEscListenerBound = true;
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.detail-backdrop.dm-visible').forEach(b => closeModal(b));
    });
  }
}
