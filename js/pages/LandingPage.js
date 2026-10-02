// NOVA CART - Landing — auth first
export function renderLandingPage() {
  return `
    <div id="landing-root" style="width:100vw;height:100vh;display:flex;flex-direction:column;position:relative;z-index:10;overflow-y:auto;overflow-x:hidden;background:transparent;">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:28px 60px;flex-shrink:0;">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#00f3ff,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:24px;color:#000;box-shadow:0 0 25px rgba(0,243,255,0.6);">N</div>
          <div>
            <div style="font-weight:800;font-size:22px;letter-spacing:2px;" class="gradient-text-cyan">NOVA CART</div>
            <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);letter-spacing:1px;">PROMPT WARS RESCUE EDITION</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <a href="#/login" class="btn-futuristic-secondary" data-nav="#/login" style="font-size:13px;padding:10px 22px;">Sign In</a>
          <a href="#/signup" class="btn-futuristic" data-nav="#/signup" style="font-size:13px;padding:10px 24px;">Sign Up →</a>
        </div>
      </div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:0 60px;gap:80px;flex-wrap:wrap;">
        <div style="max-width:560px;display:flex;flex-direction:column;gap:22px;">
          <div class="badge badge-cyan" style="padding:6px 16px;font-size:12px;font-family:var(--font-mono);width:fit-content;">⚡ AI BUSINESS RESCUE PLATFORM</div>
          <h1 style="font-size:52px;font-weight:800;line-height:1.1;letter-spacing:-1px;text-shadow:0 0 40px rgba(0,243,255,0.3);">Turn Business Signals Into <br><span class="gradient-text-cyan">Intelligent Rescue Decisions.</span></h1>
          <p style="font-size:17px;color:var(--text-muted);line-height:1.65;">Connecting 620 local stores across 3 Indian cities. Real-time decision intelligence for quick-commerce.</p>
          <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;">
            <a href="#/login" class="btn-futuristic glow-cyan" data-nav="#/login" data-after-login="#/dashboard" style="font-size:15px;padding:14px 34px;border-radius:12px;cursor:pointer;">🚀 ENTER COMMAND CENTER</a>
            <a href="#/login" class="btn-futuristic-secondary" data-nav="#/login" data-after-login="#/diagnosis" style="font-size:15px;padding:14px 28px;border-radius:12px;cursor:pointer;">🔍 VIEW DIAGNOSIS</a>
          </div>
          <p style="font-size:13px;color:var(--text-dim);">Sign in or sign up first — then you enter the command center.</p>
          <div style="display:flex;gap:28px;margin-top:20px;flex-wrap:wrap;">
            <div><div style="font-size:28px;font-weight:800;color:#fff;">120K</div><div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);">REGISTERED USERS</div></div>
            <div><div style="font-size:28px;font-weight:800;color:#fff;">38,500</div><div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);">MONTHLY ORDERS</div></div>
            <div><div style="font-size:28px;font-weight:800;color:var(--neon-amber);">27%</div><div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);">REPEAT RATE</div></div>
            <div><div style="font-size:28px;font-weight:800;color:var(--neon-violet);">₹26.1L</div><div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);">MONTHLY REVENUE</div></div>
          </div>
        </div>
        <div class="landing-3d-n-wrapper" id="n3d-wrapper" style="width:340px;height:340px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <div class="landing-3d-scene" id="n3d-scene">
            <div class="n3d-ring n3d-ring-1"></div>
            <div class="n3d-ring n3d-ring-2"></div>
            <div class="n3d-ring n3d-ring-3"></div>
            <div class="n3d-letter" id="n3d-letter">
              <div class="n3d-face n3d-face-front">N</div>
              <div class="n3d-face n3d-face-back">N</div>
              <div class="n3d-face n3d-face-left"></div>
              <div class="n3d-face n3d-face-right"></div>
              <div class="n3d-face n3d-face-top"></div>
              <div class="n3d-face n3d-face-bottom"></div>
            </div>
          </div>
          <div style="text-align:center;margin-top:20px;font-family:var(--font-mono);font-size:11px;color:var(--neon-cyan);letter-spacing:3px;opacity:0.7;">AI COMMAND ENGINE · MOVE MOUSE</div>
        </div>
      </div>
    </div>
  `;
}

export function initLandingN3D() {
  const letter = document.getElementById('n3d-letter');
  const scene = document.getElementById('n3d-scene');
  const wrapper = document.getElementById('n3d-wrapper');
  if (!letter || !scene) return;
  let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
  window.addEventListener('mousemove', (e) => {
    const rect = (wrapper || scene).getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2 || 1);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2 || 1);
    targetRY = Math.max(-1, Math.min(1, dx)) * 28;
    targetRX = Math.max(-1, Math.min(1, -dy)) * 22;
  });
  const tick = () => {
    curRX += (targetRX - curRX) * 0.08;
    curRY += (targetRY - curRY) * 0.08;
    letter.style.transform = 'rotateX(' + curRX + 'deg) rotateY(' + curRY + 'deg)';
    requestAnimationFrame(tick);
  };
  tick();
}
