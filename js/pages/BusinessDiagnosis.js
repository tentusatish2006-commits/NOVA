// NOVA CART - Business Diagnosis Page (/diagnosis)
import { aiEngine } from '../services/aiEngine.js';

export function renderBusinessDiagnosisPage() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Section Title & Intro -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Business Rescue Diagnosis Engine</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
            Deep-dive operational signals to pinpoint root causes behind falling repeat rates & margin erosion.
          </p>
        </div>
        <button id="btn-run-diagnosis" class="btn-futuristic glow-cyan" style="padding: 12px 24px;">
          ⚡ Run Full AI Diagnosis
        </button>
      </div>

      <!-- BUSINESS SIGNALS COMPARISON CARDS -->
      <div>
        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 12px;">
          BUSINESS SIGNALS: 6 MONTHS AGO vs CURRENT
        </h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
          
          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 12px; color: var(--text-dim);">Registered Users</div>
            <div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">82,000 → 120,000</div>
            <div style="font-size: 11px; color: var(--neon-emerald);">↑ +46% Growth</div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 12px; color: var(--text-dim);">Monthly Orders</div>
            <div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">31,200 → 38,500</div>
            <div style="font-size: 11px; color: var(--neon-emerald);">↑ +23.4% Growth</div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 12px; color: var(--text-dim);">Monthly Revenue</div>
            <div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">₹21.8L → ₹26.1L</div>
            <div style="font-size: 11px; color: var(--neon-emerald);">↑ +19.7% Growth</div>
          </div>

          <div class="glass-card glow-rose" style="padding: 16px; border-color: rgba(244, 63, 94, 0.4);">
            <div style="font-size: 12px; color: var(--neon-rose);">Repeat Purchase Rate</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--neon-rose); margin: 4px 0;">41% → 27%</div>
            <div style="font-size: 11px; color: var(--neon-rose);">⚠️ -14% DROP</div>
          </div>

          <div class="glass-card" style="padding: 16px; border-color: rgba(245, 158, 11, 0.3);">
            <div style="font-size: 12px; color: var(--neon-amber);">Average Delivery Time</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--neon-amber); margin: 4px 0;">29 min → 37 min</div>
            <div style="font-size: 11px; color: var(--neon-amber);">⚠️ +8 MIN DELAY</div>
          </div>

          <div class="glass-card" style="padding: 16px; border-color: rgba(245, 158, 11, 0.3);">
            <div style="font-size: 12px; color: var(--neon-amber);">Cancellation Rate</div>
            <div style="font-size: 18px; font-weight: 700; color: var(--neon-amber); margin: 4px 0;">6% → 11%</div>
            <div style="font-size: 11px; color: var(--neon-amber);">⚠️ +83% INCREASE</div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 12px; color: var(--text-dim);">Support Tickets</div>
            <div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">3,100 → 5,900/mo</div>
            <div style="font-size: 11px; color: var(--neon-rose);">⚠️ +90% SURGE</div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 12px; color: var(--text-dim);">Promo Spend</div>
            <div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">₹9.5L → ₹17L/mo</div>
            <div style="font-size: 11px; color: var(--neon-violet);">⚠️ 44% UNUSED WASTE</div>
          </div>

        </div>
      </div>

      <!-- ROOT CAUSE EXPLORER -->
      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <span>🎯</span> Root Cause Explorer
        </h3>

        <!-- Tabs -->
        <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08);">
          <button class="cause-tab btn-futuristic" data-cause="retention" style="font-size: 12px; padding: 6px 14px;">Customer Retention</button>
          <button class="cause-tab btn-futuristic-secondary" data-cause="delivery" style="font-size: 12px; padding: 6px 14px;">Delivery Reliability</button>
          <button class="cause-tab btn-futuristic-secondary" data-cause="inventory" style="font-size: 12px; padding: 6px 14px;">Inventory Accuracy</button>
          <button class="cause-tab btn-futuristic-secondary" data-cause="marketing" style="font-size: 12px; padding: 6px 14px;">Marketing Efficiency</button>
          <button class="cause-tab btn-futuristic-secondary" data-cause="partner" style="font-size: 12px; padding: 6px 14px;">Partner Experience</button>
          <button class="cause-tab btn-futuristic-secondary" data-cause="support" style="font-size: 12px; padding: 6px 14px;">Customer Support</button>
        </div>

        <!-- Explorer Content -->
        <div id="cause-explorer-content" style="margin-top: 18px;">
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
            <div class="glass-card" style="padding: 20px;">
              <h4 style="font-size: 14px; font-weight: 700; color: var(--neon-cyan); margin-bottom: 10px;">Primary Evidence & Operational Signals</h4>
              <ul style="font-size: 13px; color: var(--text-muted); line-height: 1.8; padding-left: 18px;">
                <li>54% first-order completion rate across new signups.</li>
                <li>30-day conversion from 1st order to 2nd order fell to 31%.</li>
                <li>68% of churned users reported a delivery delay > 35 min on their 1st or 2nd order.</li>
                <li>High-frequency buyers dropped average orders per month from 4.2 to 2.1.</li>
              </ul>
            </div>

            <div class="glass-card" style="padding: 20px;">
              <h4 style="font-size: 14px; font-weight: 700; color: var(--neon-violet); margin-bottom: 10px;">Root Cause & Recommendation</h4>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">
                Customer trust is broken immediately after order #1 due to delivery SLA degradation. Broad promotional coupons fail to fix this because discounts do not compensate for cold/delayed groceries.
              </p>
              <div style="font-size: 12px; padding: 10px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan); color: var(--neon-cyan);">
                💡 Action: Implement 2nd-order SLA guarantee + automated 48-hour cashback trigger.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI DIAGNOSIS OUTPUT CONTAINER -->
      <div id="diagnosis-output-container" class="glass-panel glow-cyan" style="padding: 24px; display: none;">
        <!-- Dynamically rendered by JS -->
      </div>

    </div>
  `;
}
