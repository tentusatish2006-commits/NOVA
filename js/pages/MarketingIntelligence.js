// NOVA CART - Marketing Intelligence Page (/marketing)
import { db } from '../services/db.js';

export function renderMarketingIntelligencePage() {
  const coupons = db.getCoupons();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card glow-violet" style="padding: 18px; border-color: rgba(139, 92, 246, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-violet);">MONTHLY MARKETING SPEND</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-violet); margin-top: 4px;">₹17.0L</div>
          <div style="font-size: 11px; color: var(--neon-violet);">⚠️ Increased from ₹9.5L/mo (+79%)</div>
        </div>

        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">PROMO UNREDEEMED WASTE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">44% Unused</div>
          <div style="font-size: 11px; color: var(--neon-rose);">⚠️ ~₹4.5L/mo wasted on broadcast coupons</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">ACQUISITION CAC</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;">₹142 / User</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">38,000 new signups</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">CUSTOMER LTV / CAC RATIO</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-cyan); margin-top: 4px;">2.4x</div>
          <div style="font-size: 11px; color: var(--neon-amber);">Eroded due to 27% repeat rate</div>
        </div>
      </div>

      <!-- AI Marketing Strategy Assessment -->
      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="font-size: 32px; padding: 10px; background: rgba(0, 243, 255, 0.1); border-radius: 12px; border: 1px solid var(--border-cyan);">
            🤖
          </div>
          <div>
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan);">AI STRATEGY EVALUATION</div>
            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">
              "Is increasing promotional spending likely to solve the retention collapse?"
            </h3>
            <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
              <strong>NO.</strong> Telemetry analysis confirms that throwing promo discounts at churned users does NOT repair retention when operational delivery SLA is broken (37 min). 44% of broadcast coupons are never redeemed.
            </p>
            <div style="font-size: 12px; color: var(--neon-emerald); margin-top: 10px; padding: 8px 12px; background: rgba(16, 185, 129, 0.1); border-radius: 6px; display: inline-block;">
              💡 Recommendation: Re-allocate ₹4.5L/mo from unredeemed coupons into targeted 2nd-order SLA guarantees.
            </div>
          </div>
        </div>
      </div>

      <!-- Active Campaigns -->
      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">Active Promotional Campaigns & Efficiency</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
          ${coupons.map(c => `
            <div class="glass-card" style="padding: 20px; display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span class="badge badge-cyan" style="font-size: 12px; font-family: var(--font-mono);">${c.code}</span>
                <span class="badge ${c.status === 'Underperforming' ? 'badge-rose' : 'badge-emerald'}">${c.status}</span>
              </div>

              <div>
                <div style="font-size: 18px; font-weight: 800; color: #fff;">${c.discount}</div>
                <div style="font-size: 12px; color: var(--text-muted);">Total Spend: ₹${(c.cost).toLocaleString()}</div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.06);">
                <div>
                  <div style="color: var(--text-dim);">Issued</div>
                  <div style="font-weight: 700; color: #fff;">${c.issued.toLocaleString()}</div>
                </div>
                <div>
                  <div style="color: var(--text-dim);">Redeemed</div>
                  <div style="font-weight: 700; color: var(--neon-emerald);">${c.redeemed.toLocaleString()}</div>
                </div>
                <div>
                  <div style="color: var(--text-dim);">Unused Rate</div>
                  <div style="font-weight: 700; color: var(--neon-rose);">${c.unusedRate}</div>
                </div>
                <div>
                  <div style="color: var(--text-dim);">ROI Metric</div>
                  <div style="font-weight: 700; color: var(--neon-cyan);">1.8x</div>
                </div>
              </div>

              <div style="font-size: 11px; color: var(--text-muted); padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                💡 <strong>AI Guidance:</strong> ${c.recommendation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
