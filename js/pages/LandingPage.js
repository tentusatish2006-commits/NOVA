// NOVA CART - Futuristic 3D Landing Page with animated 3D "N"

export function renderLandingPage() {
  return `
    <div style="width: 100vw; height: 100vh; display: flex; flex-direction: column; position: relative; z-index: 10; overflow-y: auto; overflow-x: hidden; background: transparent;">
      
      <!-- Top Brand Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 28px 60px; flex-shrink: 0;">
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #00f3ff, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #000; box-shadow: 0 0 25px rgba(0, 243, 255, 0.6);">
            N
          </div>
          <div>
            <div style="font-weight: 800; font-size: 22px; letter-spacing: 2px;" class="gradient-text-cyan">NOVA CART</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 1px;">PROMPT WARS RESCUE EDITION</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="#/login" class="btn-futuristic-secondary" style="font-size: 13px; padding: 10px 22px;">Sign In</a>
          <a href="#/dashboard" class="btn-futuristic" style="font-size: 13px; padding: 10px 24px;">Enter Command Center →</a>
        </div>
      </div>

      <!-- Main Hero Content Area -->
      <div style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 0 60px; position: relative; gap: 80px;">
        
        <!-- Left: Hero Text -->
        <div style="max-width: 560px; display: flex; flex-direction: column; gap: 22px;">
          <div class="badge badge-cyan" style="padding: 6px 16px; font-size: 12px; font-family: var(--font-mono); letter-spacing: 1px; width: fit-content;">
            ⚡ AI BUSINESS RESCUE PLATFORM
          </div>

          <h1 style="font-size: 52px; font-weight: 800; line-height: 1.1; letter-spacing: -1px; text-shadow: 0 0 40px rgba(0, 243, 255, 0.3);">
            Turn Business Signals Into <br>
            <span class="gradient-text-cyan">Intelligent Rescue Decisions.</span>
          </h1>

          <p style="font-size: 17px; color: var(--text-muted); line-height: 1.65;">
            Connecting 620 local stores across 3 Indian cities. Real-time decision intelligence for quick-commerce: evidence, diagnosis, retention, and business impact projection.
          </p>

          <!-- Main Action Buttons -->
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <a href="#/dashboard" class="btn-futuristic glow-cyan" style="font-size: 15px; padding: 14px 34px; border-radius: 12px;">
              🚀 ENTER COMMAND CENTER
            </a>
            <a href="#/diagnosis" class="btn-futuristic-secondary" style="font-size: 15px; padding: 14px 28px; border-radius: 12px;">
              🔍 VIEW DIAGNOSIS
            </a>
          </div>

          <!-- Metric Highlights -->
          <div style="display: flex; gap: 24px; flex-wrap: wrap; margin-top: 8px;">
            <div>
              <div style="font-size: 22px; font-weight: 800; color: #fff;" class="gradient-text-cyan">120K</div>
              <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">REGISTERED USERS</div>
            </div>
            <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
            <div>
              <div style="font-size: 22px; font-weight: 800; color: #fff;">38,500</div>
              <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">MONTHLY ORDERS</div>
            </div>
            <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
            <div>
              <div style="font-size: 22px; font-weight: 800; color: var(--neon-rose);">27%</div>
              <div style="font-size: 11px; color: var(--neon-rose); font-family: var(--font-mono);">REPEAT RATE ⚠️</div>
            </div>
            <div style="width: 1px; background: rgba(255,255,255,0.1);"></div>
            <div>
              <div style="font-size: 22px; font-weight: 800; color: #fff;" class="gradient-text-violet">₹26.1L</div>
              <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">MONTHLY REVENUE</div>
            </div>
          </div>
        </div>

        <!-- Right: 3D "N" Hero Element -->
        <div class="landing-3d-n-wrapper">
          <div class="landing-3d-scene">
            <!-- Outer glow rings -->
            <div class="n3d-ring n3d-ring-1"></div>
            <div class="n3d-ring n3d-ring-2"></div>
            <div class="n3d-ring n3d-ring-3"></div>
            
            <!-- The 3D N letter -->
            <div class="n3d-letter">
              <div class="n3d-face n3d-face-front">N</div>
              <div class="n3d-face n3d-face-back">N</div>
              <div class="n3d-face n3d-face-left"></div>
              <div class="n3d-face n3d-face-right"></div>
              <div class="n3d-face n3d-face-top"></div>
              <div class="n3d-face n3d-face-bottom"></div>
            </div>

            <!-- Floating particles -->
            <div class="n3d-particle" style="--px:40%;--py:20%;--delay:0s;"></div>
            <div class="n3d-particle" style="--px:70%;--py:60%;--delay:0.5s;"></div>
            <div class="n3d-particle" style="--px:20%;--py:70%;--delay:1s;"></div>
            <div class="n3d-particle" style="--px:80%;--py:30%;--delay:1.5s;"></div>
            <div class="n3d-particle" style="--px:10%;--py:45%;--delay:2s;"></div>
            <div class="n3d-particle" style="--px:60%;--py:85%;--delay:2.5s;"></div>
          </div>
          <div style="text-align: center; margin-top: 20px; font-family: var(--font-mono); font-size: 11px; color: var(--neon-cyan); letter-spacing: 3px; opacity: 0.7;">AI COMMAND ENGINE</div>
        </div>

      </div>

      <!-- Bottom Pipeline Indicator -->
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
