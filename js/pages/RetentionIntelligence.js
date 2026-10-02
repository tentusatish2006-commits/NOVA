// NOVA CART - Retention Intelligence Page (/retention)
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderRetentionIntelligencePage() {
  const customers = db.getCustomers();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Retention KPIs -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">REPEAT PURCHASE RATE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">27%</div>
          <div style="font-size: 11px; color: var(--neon-rose);">⚠️ Down from 41% baseline</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">1ST ORDER CONVERSION</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;">54%</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">New signup activation</div>
        </div>

        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.3);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">2ND ORDER CONVERSION (30D)</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">31%</div>
          <div style="font-size: 11px; color: var(--neon-amber);">⚠️ Primary Churn Bottleneck</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">3+ ORDER RETENTION PROB.</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-cyan); margin-top: 4px;">72%</div>
          <div style="font-size: 11px; color: var(--neon-cyan);">High lifetime loyalty if unlocked</div>
        </div>
      </div>

      <!-- 4-Stage Retention Conversion Funnel -->
      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span>🔻</span> Case Study 4-Stage Customer Conversion Funnel
        </h3>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; position: relative;">
          
          <!-- Stage 1 -->
          <div class="glass-card" style="padding: 18px; text-align: center; border-color: rgba(0, 243, 255, 0.3);">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan);">STAGE 1</div>
            <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">New Registered User</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--neon-cyan);">100%</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">120,000 Total Signups</div>
          </div>

          <!-- Stage 2 -->
          <div class="glass-card" style="padding: 18px; text-align: center; border-color: rgba(59, 130, 246, 0.3);">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-blue);">STAGE 2</div>
            <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">First Order Placed</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--neon-blue);">54%</div>
            <div style="font-size: 11px; color: var(--neon-emerald); margin-top: 6px;">64,800 Active First Buyers</div>
          </div>

          <!-- Stage 3 (CRITICAL DROPOFF) -->
          <div class="glass-card glow-rose" style="padding: 18px; text-align: center; border-color: rgba(244, 63, 94, 0.5); background: rgba(244, 63, 94, 0.08);">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">STAGE 3 (BOTTLENECK)</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--neon-rose); margin: 6px 0;">Second Order (30 Days)</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--neon-rose);">31%</div>
            <div style="font-size: 11px; color: var(--neon-rose); margin-top: 6px;">⚠️ 69% Churn After Order #1</div>
          </div>

          <!-- Stage 4 -->
          <div class="glass-card" style="padding: 18px; text-align: center; border-color: rgba(139, 92, 246, 0.3);">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-violet);">STAGE 4</div>
            <div style="font-size: 18px; font-weight: 800; color: #fff; margin: 6px 0;">Repeat Customer (3+ Orders)</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--neon-violet);">72%</div>
            <div style="font-size: 11px; color: var(--neon-cyan); margin-top: 6px;">Sticky Lifetime Loyalty</div>
          </div>

        </div>
      </div>

      <!-- AI Retention Risk Engine Customer List -->
      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span>🤖</span> AI Retention Risk & Churn Intervention Engine
        </h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${customers.map(c => {
            const isHighRisk = c.retentionRisk === 'HIGH';
            return `
              <div class="glass-card" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-left: 4px solid ${isHighRisk ? 'var(--neon-rose)' : 'var(--neon-emerald)'};">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: ${isHighRisk ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                    ${isHighRisk ? '⚠️' : '✅'}
                  </div>
                  <div>
                    <div style="font-size: 15px; font-weight: 700; color: #fff;">${c.name} (${c.id})</div>
                    <div style="font-size: 12px; color: var(--text-muted);">
                      City: ${c.city} | Orders: ${c.orders} | Last Order: ${c.lastOrder} | Delivery Complaints: ${c.deliveryComplaints}
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 14px;">
                  <span class="badge ${isHighRisk ? 'badge-rose' : 'badge-emerald'}">
                    ${c.retentionRisk} RISK
                  </span>
                  <button class="btn-trigger-retention btn-futuristic" data-custid="${c.id}" style="font-size: 12px; padding: 6px 14px;">
                    Trigger Rescue Action
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;
}
