// NOVA CART - Reusable Futuristic Glass Modal System

export function openModal(title, bodyHtml, footerButtons = '') {
  let modalOverlay = document.getElementById('app-modal-overlay');
  
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'app-modal-overlay';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(5, 7, 17, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;
    document.body.appendChild(modalOverlay);
  }

  modalOverlay.style.display = 'flex';
  modalOverlay.innerHTML = `
    <div class="glass-panel glow-cyan" style="width: 100%; max-width: 600px; max-height: 85vh; display: flex; flex-direction: column; padding: 24px; position: relative;">
      
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${title}</h3>
        <button id="modal-btn-close" style="background: transparent; border: none; color: var(--text-dim); font-size: 20px; cursor: pointer;">
          ✕
        </button>
      </div>

      <!-- Body Content -->
      <div style="flex: 1; overflow-y: auto; padding: 16px 0; font-size: 13px; color: var(--text-muted);">
        ${bodyHtml}
      </div>

      <!-- Footer Actions -->
      <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08);">
        ${footerButtons || `<button id="modal-btn-close-2" class="btn-futuristic-secondary" style="font-size: 12px; padding: 8px 18px;">Close</button>`}
      </div>

    </div>
  `;

  const closeFn = () => {
    modalOverlay.style.display = 'none';
  };

  const close1 = document.getElementById('modal-btn-close');
  const close2 = document.getElementById('modal-btn-close-2');
  if (close1) close1.addEventListener('click', closeFn);
  if (close2) close2.addEventListener('click', closeFn);
}
