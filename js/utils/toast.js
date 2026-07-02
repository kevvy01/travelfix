(function() {
  function createToast(title, message, type = 'info') {
    // Remove existing toasts to prevent stacking
    document.querySelectorAll('.toast-notification').forEach(el => el.remove());

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<strong style="display:block; margin-bottom:4px; font-size:1rem;">${title}</strong>${message}`;
    
    // Set background color based on type
    let bg = '#111827'; // default (info)
    if (type === 'success') bg = 'var(--accent-green, #2D6A4F)';
    if (type === 'error') bg = '#DC2626';

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bg,
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: '9999',
      fontSize: '0.9rem',
      fontWeight: '500',
      opacity: '0',
      transition: 'all 0.3s ease'
    });
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translate(-50%, -10px)';
    });
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 0)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function createCustomDialog(title, message, isConfirm, onConfirm) {
    // Remove existing dialogs to prevent stacking
    document.querySelectorAll('.detail-backdrop.toast-dialog').forEach(el => el.remove());

    const backdrop = document.createElement('div');
    backdrop.className = 'detail-backdrop toast-dialog';
    backdrop.style.zIndex = '10000';
    backdrop.style.display = 'flex';
    
    backdrop.innerHTML = `
      <div class="detail-modal" style="max-width: 400px;">
        <div class="dm-header">
          <h2 class="dm-title" style="font-size: 1.1rem;">${title}</h2>
          <button class="dm-close-btn" aria-label="Tutup" style="background:none; border:none; cursor:pointer; color:var(--text-muted);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="dm-body" style="padding: 1.5rem 1.25rem;">
          <p style="font-size: var(--fs-md); color: var(--text-color); margin: 0;">${message}</p>
        </div>
        <div class="dm-footer dm-footer-aligned" style="justify-content: flex-end; gap: 0.5rem;">
          ${isConfirm ? '<button class="dm-btn-secondary" id="dialog-btn-cancel">Batal</button>' : ''}
          <button class="${isConfirm ? 'dm-btn-danger' : 'dm-btn-primary'}" id="dialog-btn-confirm">Oke</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    document.body.style.overflow = 'hidden';
    
    // Force reflow for animation
    backdrop.offsetHeight;
    backdrop.classList.add('dm-visible');

    function closeDialog(result) {
      backdrop.classList.remove('dm-visible');
      document.body.style.overflow = '';
      setTimeout(() => backdrop.remove(), 300);
      if (onConfirm) onConfirm(result);
    }

    backdrop.querySelector('.dm-close-btn').addEventListener('click', () => closeDialog(false));
    backdrop.querySelector('#dialog-btn-confirm').addEventListener('click', () => closeDialog(true));
    if (isConfirm) {
      backdrop.querySelector('#dialog-btn-cancel').addEventListener('click', () => closeDialog(false));
    }
  }

  // Unified global namespace
  window.toast = {
    success: (msg) => createToast("Berhasil", msg, 'success'),
    error: (msg) => createToast("Terjadi Kesalahan", msg, 'error'),
    validation: (msg) => createToast("Validasi", msg, 'error'),
    info: (msg) => createToast("Informasi", msg, 'info'),
    alert: (msg) => createToast("Validasi", msg, 'error'), // Non-modal to comply with dialog rules
    confirm: (msg, onConfirmCallback) => createCustomDialog("Konfirmasi", msg, true, onConfirmCallback)
  };

  // Backward compatibility layer
  window.showAlert = function(message) { window.toast.alert(message); };
  window.showConfirm = function(message, cb) { window.toast.confirm(message, cb); };
  window.showToast = function(message) { window.toast.success(message); };
})();
