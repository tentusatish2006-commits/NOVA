// NOVA CART - Executive Command Center Dashboard
import { CASE_METRICS } from '../types.js';
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderExecutiveDashboard() {
  const recommendations = db.getRecommendations();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top 9 Metric Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
        
        <!-- Registered Users -->
        <div class="glass-card" style="padding: 18px; position: relative;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">REGISTERED USERS</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;" class="gradient-text-cyan">120,000</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">↑ 82,000 → 120,000 (+46%)</div>
        </div>

        <!-- MAU -->
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">MONTHLY ACTIVE USERS</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">46,000</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">↑ 39,000 → 46,000 (+18%)</div>
        </div>

        <!-- Monthly Orders -->
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">MONTHLY ORDERS</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">38,500</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">↑ 31,200 → 38,500 (+23%)</div>
        </div>

        <!-- Revenue -->
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">MONTHLY REVENUE</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;" class="gradient-text-violet">₹26.1L</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">↑ ₹21.8L → ₹26.1L/mo</div>
        </div>

        <!-- AOV -->
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AVG ORDER VALUE (AOV)</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">₹486</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">↑ ₹452 → ₹486 (+7.5%)</div>
        </div>

        <!-- Repeat Purchase (CRITICAL) -->
        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.06);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">REPEAT PURCHASE RATE</div>
          <div style="font-size: 26px; font-weight: 800; color: var(--neon-rose); margin: 4px 0;">27%</div>
          <div style="font-size: 11px; color: var(--neon-rose); font-weight: 600;">⚠️ 41% → 27% (-14% DROP)</div>
        </div>

        <!-- Cancellation Rate (HIGH RISK) -->
        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.4); background: rgba(245, 158, 11, 0.05);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">CANCELLATION RATE</div>
          <div style="font-size: 26px; font-weight: 800; color: var(--neon-amber); margin: 4px 0;">11%</div>
          <div style="font-size: 11px; color: var(--neon-amber);">⚠️ 6% → 11% (DOUBLED)</div>
        </div>

        <!-- Average Delivery Time -->
        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.3);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AVG DELIVERY TIME</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">37 min</div>
          <div style="font-size: 11px; color: var(--neon-amber);">↑ 29 min → 37 min (+27%)</div>
        </div>

        <!-- Support Tickets -->
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">SUPPORT TICKETS / MO</div>
          <div style="font-size: 26px; font-weight: 800; color: #fff; margin: 4px 0;">5,900</div>
          <div style="font-size: 11px; color: var(--neon-rose);">↑ 3,100 → 5,900 (+90%)</div>
        </div>

      </div>

      <!-- AI Business Summary Banner & Action -->
      <div class="glass-panel glow-cyan" style="padding: 24px; display: flex; align-items: center; justify-content: space-between; gap: 20px;">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="font-size: 32px; padding: 10px; background: rgba(0, 243, 255, 0.1); border-radius: 12px; border: 1px solid var(--border-cyan);">
            🤖
          </div>
          <div>
            <div style="font-size: 12px; font-family: var(--font-mono); color: var(--neon-cyan); letter-spacing: 1px;">AI RESCUE SUMMARY</div>
            <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">
              Business acquisition growth is strong (+46%), but retention, delivery SLA & support efficiency require urgent rescue intervention.
            </h3>
            <p style="font-size: 13px; color: var(--text-muted);">
              Primary root cause: Delivery delays (37 min) & inventory stockouts (11% cancellations) erode trust after 1st order. Broad promo spend (₹17L/mo) fails to repair retention.
            </p>
          </div>
        </div>

        <a href="#/diagnosis" class="btn-futuristic glow-cyan" style="white-space: nowrap; padding: 12px 24px;">
          🔍 Analyze Business & Run AI Diagnosis
        </a>
      </div>

      <!-- Interactive 3D Business Health Grid -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
            <span>🛡️</span> Interactive Business Health Visualization
          </h2>
          <span style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">Click any category to drill down</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
          
          <a href="#/retention" class="glass-card" style="padding: 16px; text-decoration: none; border-color: rgba(244, 63, 94, 0.3);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px;">🔄</span>
              <span class="badge badge-rose">CRITICAL</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 10px;">Customer Retention</div>
            <div style="font-size: 12px; color: var(--neon-rose); margin-top: 4px;">Score: 27% (41% → 27%)</div>
          </a>

          <a href="#/delivery" class="glass-card" style="padding: 16px; text-decoration: none; border-color: rgba(245, 158, 11, 0.3);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px;">🛵</span>
              <span class="badge badge-amber">DELAYED</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 10px;">Delivery Reliability</div>
            <div style="font-size: 12px; color: var(--neon-amber); margin-top: 4px;">Avg SLA: 37 mins</div>
          </a>

          <a href="#/inventory" class="glass-card" style="padding: 16px; text-decoration: none; border-color: rgba(245, 158, 11, 0.3);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px;">📦</span>
              <span class="badge badge-amber">AT RISK</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 10px;">Inventory Accuracy</div>
            <div style="font-size: 12px; color: var(--neon-amber); margin-top: 4px;">Accuracy: 84.2%</div>
          </a>

          <a href="#/marketing" class="glass-card" style="padding: 16px; text-decoration: none; border-color: rgba(139, 92, 246, 0.3);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px;">📢</span>
              <span class="badge badge-violet">INEFFICIENT</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 10px;">Marketing Spend</div>
            <div style="font-size: 12px; color: var(--neon-violet); margin-top: 4px;">₹17L/mo (44% unused)</div>
          </a>

          <a href="#/stores" class="glass-card" style="padding: 16px; text-decoration: none; border-color: rgba(0, 243, 255, 0.3);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px;">🏪</span>
              <span class="badge badge-cyan">620 STORES</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 10px;">Partner Health</div>
            <div style="font-size: 12px; color: var(--neon-cyan); margin-top: 4px;">Rejection: 8.4% avg</div>
          </a>

          <a href="#/support" class="glass-card" style="padding: 16px; text-decoration: none; border-color: rgba(244, 63, 94, 0.3);">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 20px;">🎧</span>
              <span class="badge badge-rose">HIGH LOAD</span>
            </div>
            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-top: 10px;">Customer Support</div>
            <div style="font-size: 12px; color: var(--neon-rose); margin-top: 4px;">5,900 tickets / mo</div>
          </a>

        </div>
      </div>

      <!-- Priority Actions List -->
      <div class="glass-panel" style="padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px;">
            <span>⚡</span> Priority Rescue Recommendations
          </h2>
          <a href="#/recommendations" style="font-size: 12px; color: var(--neon-cyan); text-decoration: none;">View All Recommendations →</a>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${recommendations.map(rec => `
            <div class="glass-card" style="padding: 16px; display: flex; flex-direction: column; gap: 8px; border-left: 4px solid ${rec.severity === 'CRITICAL' ? 'var(--neon-rose)' : 'var(--neon-amber)'};">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="badge ${rec.severity === 'CRITICAL' ? 'badge-rose' : 'badge-amber'}">${rec.severity}</span>
                  <span style="font-size: 14px; font-weight: 700; color: #fff;">${rec.title}</span>
                </div>
                <span class="badge badge-cyan">${rec.status}</span>
              </div>
              <p style="font-size: 13px; color: var(--text-muted);">${rec.recommendation}</p>
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-dim); margin-top: 4px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
                <span>🎯 Target Impact: <strong style="color: var(--neon-emerald);">${rec.expectedMetric}</strong></span>
                <a href="#/recommendations" style="color: var(--neon-cyan); text-decoration: none;">Review Action →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
