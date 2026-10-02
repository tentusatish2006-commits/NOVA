// NOVA CART - Landing Page with interactive 3D glowing N

export function renderLandingPage() {
  return `
    <div id="landing-root" style="width: 100vw; height: 100vh; display: flex; flex-direction: column; position: relative; z-index: 10; overflow-y: auto; overflow-x: hidden; background: transparent;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 28px 60px; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #00f3ff, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #000; box-shadow: 0 0 25px rgba(0, 243, 255, 0.6);">N</div>
          <div>
            <div style="font-weight: 800; font-size: 22px; letter-spacing: 2px;" class="gradient-text-cyan">NOVA CART</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 1px;">PROMPT WARS RESCUE EDITION</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="#/login" class="btn-futuristic-secondary" data-nav="#/login" style="font-size: 13px; padding: 10px 22px;">Sign In</a>
          <a href="#/signup" class="btn-futuristic" data-nav="#/signup" style="font-size: 13px; padding: 10px 24px;">Sign Up →</a>
        </div>
      </div>
      <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 60px; position: relative; gap: 80px; flex-wrap: wrap;">
        <div style="max-width: 560px; display: flex; flex-direction: column; gap: 22px;">
          <div class="badge badge-cyan" style="padding: 6px 16px; font-size: 12px; font-family: var(--font-mono); letter-spacing: 1px; width: fit-content;">⚡ AI BUSINESS RESCUE PLATFORM</div>
          <h1 style="font-size: 52px; font-weight: 800; line-height: 1.1; letter-spacing: -1px; text-shadow: 0 0 40px rgba(0, 243, 255, 0.3);">Turn Business Signals Into <br><span class="gradient-text-cyan">Intelligent Rescue Decisions.</span></h1>
          <p style="font-size: 17px; color: var(--text-muted); line-height: 1.65;">Connecting 620 local stores across 3 Indian cities. Real-time decision intelligence for quick-commerce: evidence, diagnosis, retention, and business impact projection.</p>
          <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 8px;">
            <a href="#/login" class="btn-futuristic glow-cyan" data-nav="#/login" data-after-login="#/dashboard" style="font-size: 15px; padding: 14px 34px; border-radius: 12px; cursor: pointer;">🚀 ENTER COMMAND CENTER</a>
            <a href="#/login" class="btn-futuristic-secondary" data-nav="#/login" data-after-login="#/diagnosis" style="font-size: 15px; padding: 14px 28px; border-radius: 12px; cursor: pointer;">🔍 VIEW DIAGNOSIS</a>
          </div>
          <div style="display: flex; gap: 28px; margin-top: 28px; flex-wrap: wrap;">
            <div><div style="font-size: 28px; font-weight: 800; color: #fff;">120K</div><div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 1px;">REGISTERED USERS</div></div>
            <div><div style="font-size: 28px; font-weight: 800; color: #fff;">38,500</div><div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 1px;">MONTHLY ORDERS</div></div>
            <div><div style="font-size: 28px; font-weight: 800; color: var(--neon-amber);">27%</div><div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 1px;">REPEAT RATE ⚠</div></div>
            <div><div style="font-size: 28px; font-weight: 800; color: var(--neon-violet);">₹26.1L</div><div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono); letter-spacing: 1px;">MONTHLY REVENUE</div></div>
          </div>
        </div>
        <div class="landing-3d-n-wrapper" id="n3d-wrapper" style="width: 340px; height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;">
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
            <div class="n3d-particle" style="--px:40%;--py:20%;--delay:0s;"></div>
            <div class="n3d-particle" style="--px:70%;--py:60%;--delay:0.5s;"></div>
            <div class="n3d-particle" style="--px:20%;--py:70%;--delay:1s;"></div>
            <div class="n3d-particle" style="--px:80%;--py:30%;--delay:1.5s;"></div>
            <div class="n3d-particle" style="--px:10%;--py:45%;--delay:2s;"></div>
            <div class="n3d-particle" style="--px:60%;--py:85%;--delay:2.5s;"></div>
          </div>
          <div style="text-align: center; margin-top: 20px; font-family: var(--font-mono); font-size: 11px; color: var(--neon-cyan); letter-spacing: 3px; opacity: 0.7;">AI COMMAND ENGINE · MOVE MOUSE</div>
        </div>
      </div>
      <div style="display: flex; align-items: center; justify-content: center; gap: 10px; padding: 20px 60px; font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); flex-shrink: 0; border-top: 1px solid rgba(255,255,255,0.05); flex-wrap: wrap;">
        <span>EVIDENCE</span> <span style="color: var(--neon-cyan);">→</span>
        <span>INSIGHT</span> <span style="color: var(--neon-cyan);">→</span>
        <span>PROBLEM</span> <span style="color: var(--neon-cyan);">→</span>
        <span style="color: var(--neon-cyan);">AI ANALYSIS</span> <span style="color: var(--neon-cyan);">→</span>
        <span>RECOMMENDATION</span> <span style="color: var(--neon-cyan);">→</span>
        <span>ACTION</span> <span style="color: var(--neon-cyan);">→</span>
        <span style="color: var(--neon-emerald); font-weight: 700;">BUSINESS IMPACT</span>
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
  const onMove = (e) => {
    const rect = (wrapper || scene).getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2 || 1);
    const dy = (e.clientY - cy) / (rect.height / 2 || 1);
    targetRY = Math.max(-1, Math.min(1, dx)) * 28;
    targetRX = Math.max(-1, Math.min(1, -dy)) * 22;
  };
  window.addEventListener('mousemove', onMove);
  const tick = () => {
    curRX += (targetRX - curRX) * 0.08;
    curRY += (targetRY - curRY) * 0.08;
    letter.style.transform = 'rotateX(' + curRX + 'deg) rotateY(' + curRY + 'deg)';
    requestAnimationFrame(tick);
  };
  tick();
}
