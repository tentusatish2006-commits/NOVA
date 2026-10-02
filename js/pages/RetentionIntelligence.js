// NOVA CART - Retention Intelligence Page (/retention)
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderRetentionIntelligencePage() {
  const customers = db.getCustomers();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
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

      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">🔻 Case Study 4-Stage Customer Conversion Funnel</h3>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px;">
          <div class="glass-card" style="padding: 18px; text-align: center;"><div style="font-size: 11px; color: var(--neon-cyan);">STAGE 1</div><div style="font-size: 16px; font-weight: 800; color: #fff; margin: 6px 0;">New Registered User</div><div style="font-size: 24px; font-weight: 800; color: var(--neon-cyan);">100%</div></div>
          <div class="glass-card" style="padding: 18px; text-align: center;"><div style="font-size: 11px; color: var(--neon-blue);">STAGE 2</div><div style="font-size: 16px; font-weight: 800; color: #fff; margin: 6px 0;">First Order Placed</div><div style="font-size: 24px; font-weight: 800; color: var(--neon-blue);">54%</div></div>
          <div class="glass-card glow-rose" style="padding: 18px; text-align: center;"><div style="font-size: 11px; color: var(--neon-rose);">STAGE 3 (BOTTLENECK)</div><div style="font-size: 16px; font-weight: 800; color: var(--neon-rose); margin: 6px 0;">Second Order (30 Days)</div><div style="font-size: 24px; font-weight: 800; color: var(--neon-rose);">31%</div></div>
          <div class="glass-card" style="padding: 18px; text-align: center;"><div style="font-size: 11px; color: var(--neon-violet);">STAGE 4</div><div style="font-size: 16px; font-weight: 800; color: #fff; margin: 6px 0;">Repeat Customer (3+)</div><div style="font-size: 24px; font-weight: 800; color: var(--neon-violet);">72%</div></div>
        </div>
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">🤖 AI Retention Risk & Churn Intervention Engine</h3>
        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${customers.map(c => {
            const isHighRisk = c.retentionRisk === 'HIGH';
            return `
              <div class="glass-card" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; border-left: 4px solid ${isHighRisk ? 'var(--neon-rose)' : 'var(--neon-emerald)'};">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="width: 42px; height: 42px; border-radius: 50%; background: ${isHighRisk ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; display: flex; align-items: center; justify-content: center; font-size: 18px;">${isHighRisk ? '⚠️' : '✅'}</div>
                  <div>
                    <div style="font-size: 15px; font-weight: 700; color: #fff;">${c.name} (${c.id})</div>
                    <div style="font-size: 12px; color: var(--text-muted);">City: ${c.city} | Orders: ${c.orders} | Last Order: ${c.lastOrder} | Delivery Complaints: ${c.deliveryComplaints}</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 14px;">
                  <span class="badge ${isHighRisk ? 'badge-rose' : 'badge-emerald'}">${c.retentionRisk || 'LOW'} RISK</span>
                  <button type="button" class="btn-trigger-retention btn-futuristic" data-custid="${c.id}" style="font-size: 12px; padding: 6px 14px; cursor: pointer;">Trigger Rescue Action</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export async function triggerRescueAction(customerId, buttonEl) {
  if (buttonEl) {
    buttonEl.disabled = true;
    buttonEl.textContent = 'Triggering…';
  }
  try {
    let msg = 'Rescue action queued: VIP Express Pass + ₹60 wallet credit within 48h.';
    try {
      const result = await aiEngine.predictRetentionRisk({
        name: customerId || 'Customer',
        deliveryComplaints: 2,
        couponsUsed: 1,
        lastOrder: new Date(Date.now() - 12 * 86400000).toISOString(),
        totalSpend: 3500,
      });
      msg = (result.recommendation || msg) + (result.expectedMetric ? ' Expected: ' + result.expectedMetric : '');
    } catch (e) {}
    if (buttonEl) {
      buttonEl.textContent = 'Rescue Triggered ✓';
      buttonEl.classList.remove('btn-futuristic');
      buttonEl.classList.add('btn-futuristic-secondary');
    }
    const toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;padding:14px 18px;border-radius:12px;background:rgba(16,185,129,0.95);color:#041016;font-size:13px;font-weight:600;max-width:360px;box-shadow:0 8px 30px rgba(0,0,0,0.35);';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  } catch (e) {
    if (buttonEl) {
      buttonEl.disabled = false;
      buttonEl.textContent = 'Trigger Rescue Action';
    }
    alert('Failed to trigger rescue: ' + e.message);
  }
}
