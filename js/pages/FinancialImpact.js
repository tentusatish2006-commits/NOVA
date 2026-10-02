// NOVA CART - Financial Impact Dashboard (/impact)

export function renderFinancialImpactPage() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Financial & Operational Impact Dashboard</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Adjust operational target sliders to model projected revenue recovery, order retention, and net profit margin.
        </p>
      </div>

      <!-- Sliders Panel -->
      <div class="glass-panel glow-cyan" style="padding: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
        
        <!-- Repeat Purchase Slider -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 13px; font-weight: 700; color: #fff;">Target Repeat Rate</label>
            <span id="slider-repeat-val" style="font-size: 16px; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono);">36%</span>
          </div>
          <input type="range" id="slider-repeat" min="27" max="45" value="36" step="1">
          <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>Current: 27%</span>
            <span>Target: 45%</span>
          </div>
        </div>

        <!-- Delivery SLA Slider -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 13px; font-weight: 700; color: #fff;">Target Delivery SLA</label>
            <span id="slider-delivery-val" style="font-size: 16px; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono);">28 min</span>
          </div>
          <input type="range" id="slider-delivery" min="25" max="37" value="28" step="1">
          <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>Current: 37 min</span>
            <span>Target: 25 min</span>
          </div>
        </div>

        <!-- Cancellation Slider -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 13px; font-weight: 700; color: #fff;">Target Cancellation Rate</label>
            <span id="slider-cancel-val" style="font-size: 16px; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono);">6%</span>
          </div>
          <input type="range" id="slider-cancel" min="4" max="11" value="6" step="1">
          <div style="font-size: 11px; color: var(--text-muted); display: flex; justify-content: space-between;">
            <span>Current: 11%</span>
            <span>Target: 4%</span>
          </div>
        </div>

      </div>

      <!-- Projection Output Cards -->
      <div>
        <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 8px;">
          SCENARIO PROJECTION (TRANSPARENT MATHEMATICAL MODEL)
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
          
          <div class="glass-card glow-cyan" style="padding: 20px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">PROJECTED MONTHLY REVENUE</div>
            <div id="proj-revenue" style="font-size: 32px; font-weight: 800; color: #fff; margin: 6px 0;" class="gradient-text-cyan">₹34.8L / mo</div>
            <div style="font-size: 12px; color: var(--neon-emerald);">+₹8.7L/mo (+33.3% revenue recovery)</div>
          </div>

          <div class="glass-card" style="padding: 20px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">PROJECTED NET PROFIT MARGIN</div>
            <div id="proj-profit" style="font-size: 32px; font-weight: 800; color: var(--neon-emerald); margin: 6px 0;">16.4%</div>
            <div style="font-size: 12px; color: var(--neon-emerald);">Up from current 8.2% baseline</div>
          </div>

          <div class="glass-card" style="padding: 20px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">SAVED CANCELLED ORDERS</div>
            <div id="proj-saved-orders" style="font-size: 32px; font-weight: 800; color: #fff; margin: 6px 0;">+1,925 / mo</div>
            <div style="font-size: 12px; color: var(--neon-cyan);">~₹9.35L recovered order value</div>
          </div>

          <div class="glass-card" style="padding: 20px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">SUPPORT TICKET LOAD</div>
            <div id="proj-tickets" style="font-size: 32px; font-weight: 800; color: var(--neon-cyan); margin: 6px 0;">3,200 / mo</div>
            <div style="font-size: 12px; color: var(--neon-emerald);">-45.7% support ticket volume drop</div>
          </div>

        </div>
      </div>

    </div>
  `;
}
