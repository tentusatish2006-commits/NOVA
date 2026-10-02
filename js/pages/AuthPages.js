// NOVA CART - Auth pages (Supabase-backed)

export function renderLoginPage(defaultRole = 'CEO') {
  return `
    <div style="width:100vw;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;position:relative;z-index:10;">
      <div class="glass-card" style="width:100%;max-width:440px;padding:36px;display:flex;flex-direction:column;gap:18px;">
        <div style="text-align:center;">
          <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:linear-gradient(135deg,#00f3ff,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:26px;color:#000;">N</div>
          <h2 style="font-size:24px;font-weight:700;color:#fff;">Sign In</h2>
          <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">NOVA CART Command Center · Powered by Supabase</p>
        </div>

        <div id="auth-message" style="display:none;padding:10px 14px;border-radius:10px;font-size:13px;"></div>

        <form id="login-form" style="display:flex;flex-direction:column;gap:14px;">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:4px;">Email</label>
            <input type="email" id="login-email" placeholder="you@company.com" class="input-futuristic" required autocomplete="email">
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:4px;">Password</label>
            <input type="password" id="login-password" placeholder="••••••••" class="input-futuristic" required autocomplete="current-password">
          </div>
          <button type="submit" id="login-submit" class="btn-futuristic glow-cyan" style="width:100%;justify-content:center;padding:12px;margin-top:4px;">
            Sign In & Enter Command Center
          </button>
        </form>

        <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:14px;">
          <p style="font-size:11px;color:var(--text-dim);margin-bottom:8px;font-family:var(--font-mono);">DEMO (offline fallback)</p>
          <button type="button" class="btn-demo-login btn-futuristic-secondary" data-role="CEO" style="width:100%;font-size:12px;padding:10px;">Demo as CEO (local)</button>
        </div>

        <div style="text-align:center;font-size:13px;color:var(--text-muted);">
          No account? <a href="#/signup" data-nav="#/signup" style="color:var(--neon-cyan);font-weight:600;text-decoration:none;">Create account</a>
          · <a href="#/" data-nav="#/" style="color:var(--text-muted);text-decoration:none;">Home</a>
        </div>
      </div>
    </div>
  `;
}

export function renderSignupPage() {
  return `
    <div style="width:100vw;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;position:relative;z-index:10;">
      <div class="glass-card" style="width:100%;max-width:480px;padding:36px;display:flex;flex-direction:column;gap:18px;">
        <div style="text-align:center;">
          <h2 style="font-size:24px;font-weight:700;color:#fff;">Create Account</h2>
          <p style="font-size:13px;color:var(--text-muted);margin-top:4px;">Supabase Auth · Join the rescue command team</p>
        </div>

        <div id="auth-message" style="display:none;padding:10px 14px;border-radius:10px;font-size:13px;"></div>

        <form id="signup-form" style="display:flex;flex-direction:column;gap:14px;">
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:4px;">Full Name</label>
            <input type="text" id="signup-name" placeholder="Your name" class="input-futuristic" required>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:4px;">Email</label>
            <input type="email" id="signup-email" placeholder="you@company.com" class="input-futuristic" required>
          </div>
          <div>
            <label style="display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:4px;">Role</label>
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
            <label style="display:block;font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:4px;">Password (min 6 chars)</label>
            <input type="password" id="signup-password" placeholder="••••••••••••" class="input-futuristic" required minlength="6">
          </div>
          <button type="submit" id="signup-submit" class="btn-futuristic glow-violet" style="width:100%;justify-content:center;padding:12px;margin-top:4px;">
            Create Account
          </button>
        </form>

        <div style="text-align:center;font-size:13px;color:var(--text-muted);">
          Already have access? <a href="#/login" data-nav="#/login" style="color:var(--neon-cyan);font-weight:600;text-decoration:none;">Sign In</a>
        </div>
      </div>
    </div>
  `;
}

export function showAuthMessage(text, type = 'error') {
  const el = document.getElementById('auth-message');
  if (!el) return;
  el.style.display = 'block';
  el.textContent = text;
  if (type === 'success') {
    el.style.background = 'rgba(16,185,129,0.15)';
    el.style.color = '#34d399';
    el.style.border = '1px solid rgba(16,185,129,0.35)';
  } else if (type === 'info') {
    el.style.background = 'rgba(0,243,255,0.1)';
    el.style.color = '#67e8f9';
    el.style.border = '1px solid rgba(0,243,255,0.3)';
  } else {
    el.style.background = 'rgba(239,68,68,0.12)';
    el.style.color = '#f87171';
    el.style.border = '1px solid rgba(239,68,68,0.35)';
  }
}
