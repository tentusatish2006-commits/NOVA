// NOVA CART - Authentication Pages (/login, /signup, /forgot-password)

export function renderLoginPage(currentRole = 'CEO') {
  return `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; z-index: 10;">
      <div class="glass-panel glow-cyan" style="width: 100%; max-width: 440px; padding: 36px; display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Header -->
        <div style="text-align: center;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #00f3ff, #8b5cf6); display: inline-flex; align-items: center; justify-content: center; font-weight: 800; font-size: 24px; color: #000; box-shadow: 0 0 20px rgba(0, 243, 255, 0.5); margin-bottom: 12px;">
            N
          </div>
          <h2 style="font-size: 24px; font-weight: 700; color: #fff;">Sign In to Nova Cart</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">AI Business Rescue Command Center</p>
        </div>

        <!-- Form -->
        <form id="login-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 6px;">Email Address</label>
            <input type="email" id="login-email" value="ceo@novacart.in" class="input-futuristic" required>
          </div>

          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <label style="font-size: 12px; font-weight: 600; color: var(--text-muted);">Password</label>
              <a href="#/forgot-password" style="font-size: 11px; color: var(--neon-cyan); text-decoration: none;">Forgot password?</a>
            </div>
            <div style="position: relative;">
              <input type="password" id="login-password" value="••••••••••••" class="input-futuristic" required>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 8px;">
            <input type="checkbox" id="remember-me" checked style="accent-color: var(--neon-cyan);">
            <label for="remember-me" style="font-size: 12px; color: var(--text-muted);">Remember this session</label>
          </div>

          <button type="submit" class="btn-futuristic glow-cyan" style="width: 100%; justify-content: center; padding: 12px; margin-top: 4px;">
            Sign In to Command Center
          </button>
        </form>

        <!-- Demo Quick Logins -->
        <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); text-align: center; margin-bottom: 12px;">
            ⚡ QUICK DEMO USER LOGIN (ONE-CLICK)
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <button class="btn-demo-login btn-futuristic-secondary" data-role="CEO" style="font-size: 11px; padding: 8px; justify-content: center;">👔 CEO</button>
            <button class="btn-demo-login btn-futuristic-secondary" data-role="Operations Manager" style="font-size: 11px; padding: 8px; justify-content: center;">🛵 Operations Mgr</button>
            <button class="btn-demo-login btn-futuristic-secondary" data-role="Marketing Manager" style="font-size: 11px; padding: 8px; justify-content: center;">📢 Marketing Mgr</button>
            <button class="btn-demo-login btn-futuristic-secondary" data-role="Store Manager" style="font-size: 11px; padding: 8px; justify-content: center;">🏪 Store Mgr</button>
            <button class="btn-demo-login btn-futuristic-secondary" data-role="Analyst" style="font-size: 11px; padding: 8px; justify-content: center;">📊 Analyst</button>
            <button class="btn-demo-login btn-futuristic-secondary" data-role="Admin" style="font-size: 11px; padding: 8px; justify-content: center;">🛡️ Admin</button>
          </div>
        </div>

        <!-- Footer Link -->
        <div style="text-align: center; font-size: 13px; color: var(--text-muted);">
          Don't have an account? <a href="#/signup" style="color: var(--neon-cyan); font-weight: 600; text-decoration: none;">Request Account</a>
        </div>

      </div>
    </div>
  `;
}

export function renderSignupPage() {
  return `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative; z-index: 10;">
      <div class="glass-panel glow-violet" style="width: 100%; max-width: 480px; padding: 36px; display: flex; flex-direction: column; gap: 20px;">
        <div style="text-align: center;">
          <h2 style="font-size: 24px; font-weight: 700; color: #fff;">Create Nova Cart Account</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Join the AI Business Rescue Command Team</p>
        </div>

        <form id="signup-form" style="display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px;">Full Name</label>
            <input type="text" id="signup-name" placeholder="Dr. Satish Kumar" class="input-futuristic" required>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px;">Email Address</label>
            <input type="email" id="signup-email" placeholder="name@novacart.in" class="input-futuristic" required>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px;">Select Role</label>
            <select id="signup-role" class="input-futuristic">
              <option value="CEO">CEO / Executive</option>
              <option value="Operations Manager">Operations Manager</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Analyst">Data Analyst</option>
              <option value="Admin">System Administrator</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px;">Password</label>
            <input type="password" id="signup-password" placeholder="••••••••••••" class="input-futuristic" required>
          </div>

          <button type="submit" class="btn-futuristic glow-violet" style="width: 100%; justify-content: center; padding: 12px; margin-top: 8px;">
            Create Account & Enter
          </button>
        </form>

        <div style="text-align: center; font-size: 13px; color: var(--text-muted);">
          Already have access? <a href="#/login" style="color: var(--neon-cyan); font-weight: 600; text-decoration: none;">Sign In</a>
        </div>
      </div>
    </div>
  `;
}
