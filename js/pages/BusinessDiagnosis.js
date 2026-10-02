// NOVA CART - Business Diagnosis Page with working cause tabs + full diagnosis
import { aiEngine } from '../services/aiEngine.js';

export const CAUSE_CONTENT = {
  retention: {
    title: 'Customer Retention',
    evidence: [
      '54% first-order completion rate across new signups.',
      '30-day conversion from 1st order to 2nd order fell to 31%.',
      '68% of churned users reported a delivery delay > 35 min on their 1st or 2nd order.',
      'High-frequency buyers dropped average orders per month from 4.2 to 2.1.',
    ],
    root: 'Customer trust breaks after order #1 due to delivery SLA degradation. Broad promo coupons do not fix delayed or incomplete first experiences.',
    actions: ['2nd-order SLA guarantee', '48h post-order cashback trigger', 'VIP express pass for delay victims'],
  },
  delivery: {
    title: 'Delivery Reliability',
    evidence: [
      'Average delivery time rose from 29 min to 37 min.',
      'Peak evening windows (6–9 PM) show 1.35× congestion multiplier.',
      'Koramangala (BLR) and Bandra (MUM) are highest-delay hubs.',
      'Driver shortage correlated with 41+ min ETA orders.',
    ],
    root: 'Uncoordinated store prep queues and peak-hour driver shortage push ETA past the trust threshold of ~30 minutes.',
    actions: ['Dynamic driver re-allocation', 'Store dispatch urgency alerts', 'Peak-hour capacity buffer'],
  },
  inventory: {
    title: 'Inventory Accuracy',
    evidence: [
      'Inventory accuracy sits at 84.2% across partner stores.',
      'Cancellation rate doubled from 6% to 11%.',
      'Post-acceptance stockouts drive customer complaints.',
      'High-risk stores show rejection rates above 10%.',
    ],
    root: 'Stores accept orders for items that are out of stock locally; system inventory lags real shelf state.',
    actions: ['Pre-allocation engine', 'Substitution suggestions at checkout', 'Real-time stock sync for top SKUs'],
  },
  marketing: {
    title: 'Marketing Efficiency',
    evidence: [
      '₹17L / month promo spend with 44% unused coupon budget.',
      'Broad discounts fail to lift 2nd-order conversion.',
      'Coupon-dependent users show higher churn after offer expiry.',
      'Acquisition grew +46% while repeat rate fell to 27%.',
    ],
    root: 'Spend is tilted to acquisition discounts instead of retention and SLA recovery offers.',
    actions: ['Shift budget to 2nd-order incentives', 'Stop blanket coupons', 'Target delay-affected cohorts only'],
  },
  partner: {
    title: 'Partner Experience',
    evidence: [
      'Partner rejection rate averages 8.4% in at-risk stores.',
      '620 stores; uneven prep SLAs across cities.',
      'Store acceptance without inventory truth damages CX.',
      'Low acceptance stores correlate with high cancellation zones.',
    ],
    root: 'Partner ops lack tight inventory + prep accountability; acceptance incentives ignore fulfillment quality.',
    actions: ['Partner scorecards', 'Acceptance quality penalties', 'Preferred partner routing'],
  },
  support: {
    title: 'Customer Support',
    evidence: [
      'Support tickets rose to 5,900 / month (+90%).',
      'High load on delay and cancellation categories.',
      'Resolution lag compounds churn after failed first orders.',
      'Repeat complainers rarely convert to order #2.',
    ],
    root: 'Support is reactive; tickets spike from delivery/inventory failures that should be prevented upstream.',
    actions: ['Proactive delay notifications', 'Auto-wallet credit on SLA breach', 'AI triage for ticket routing'],
  },
};

export function renderCausePanel(causeKey = 'retention') {
  const c = CAUSE_CONTENT[causeKey] || CAUSE_CONTENT.retention;
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
      <div class="glass-card" style="padding: 20px;">
        <h4 style="font-size: 14px; font-weight: 700; color: var(--neon-cyan); margin-bottom: 10px;">Primary Evidence — ${c.title}</h4>
        <ul style="font-size: 13px; color: var(--text-muted); line-height: 1.8; padding-left: 18px;">
          ${c.evidence.map((e) => `<li>${e}</li>`).join('')}
        </ul>
      </div>
      <div class="glass-card" style="padding: 20px;">
        <h4 style="font-size: 14px; font-weight: 700; color: var(--neon-violet); margin-bottom: 10px;">Root Cause & Recommendation</h4>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.65; margin-bottom: 12px;">${c.root}</p>
        <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 6px;">RECOMMENDED ACTIONS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${c.actions.map((a) => `<span class="badge badge-cyan" style="padding: 4px 10px;">${a}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

export function renderBusinessDiagnosisPage() {
  const tabs = [
    ['retention', 'Customer Retention'],
    ['delivery', 'Delivery Reliability'],
    ['inventory', 'Inventory Accuracy'],
    ['marketing', 'Marketing Efficiency'],
    ['partner', 'Partner Experience'],
    ['support', 'Customer Support'],
  ];
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Business Rescue Diagnosis Engine</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Deep-dive operational signals to pinpoint root causes.</p>
        </div>
        <button type="button" id="btn-run-diagnosis" class="btn-futuristic glow-cyan" style="padding: 12px 24px;">⚡ Run Full AI Diagnosis</button>
      </div>

      <div>
        <h3 style="font-size: 14px; font-weight: 700; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 12px;">BUSINESS SIGNALS: 6 MONTHS AGO vs CURRENT</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
          <div class="glass-card" style="padding: 16px;"><div style="font-size: 12px; color: var(--text-dim);">Registered Users</div><div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">82k → 120k</div><div style="font-size: 11px; color: var(--neon-emerald);">↑ +46%</div></div>
          <div class="glass-card" style="padding: 16px;"><div style="font-size: 12px; color: var(--text-dim);">Monthly Orders</div><div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">31.2k → 38.5k</div><div style="font-size: 11px; color: var(--neon-emerald);">↑ +23%</div></div>
          <div class="glass-card" style="padding: 16px;"><div style="font-size: 12px; color: var(--text-dim);">Repeat Rate</div><div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">41% → 27%</div><div style="font-size: 11px; color: var(--neon-rose);">↓ −14 pts</div></div>
          <div class="glass-card" style="padding: 16px;"><div style="font-size: 12px; color: var(--text-dim);">Avg Delivery</div><div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">29 → 37 min</div><div style="font-size: 11px; color: var(--neon-amber);">↑ +27%</div></div>
          <div class="glass-card" style="padding: 16px;"><div style="font-size: 12px; color: var(--text-dim);">Cancellations</div><div style="font-size: 18px; font-weight: 700; color: #fff; margin: 4px 0;">6% → 11%</div><div style="font-size: 11px; color: var(--neon-rose);">↑ doubled</div></div>
        </div>
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px;">🎯 Root Cause Explorer</h3>
        <div id="cause-tabs" style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.08); flex-wrap: wrap;">
          ${tabs
            .map(
              ([key, label], i) =>
                `<button type="button" class="cause-tab ${i === 0 ? 'btn-futuristic' : 'btn-futuristic-secondary'}" data-cause="${key}" style="font-size: 12px; padding: 8px 14px; cursor: pointer;">${label}</button>`
            )
            .join('')}
        </div>
        <div id="cause-explorer-content" style="margin-top: 18px;">${renderCausePanel('retention')}</div>
      </div>

      <div id="diagnosis-output-container" class="glass-panel glow-cyan" style="padding: 24px; display: none;"></div>
    </div>
  `;
}

export async function runFullDiagnosis(container) {
  if (!container) return;
  container.style.display = 'block';
  container.innerHTML = '<div style="color:var(--neon-cyan);font-family:var(--font-mono);font-size:13px;">Running full AI diagnosis…</div>';
  try {
    const result = await aiEngine.diagnoseBusiness({});
    container.innerHTML = `
      <h3 style="font-size:16px;font-weight:700;color:#fff;margin-bottom:12px;">⚡ Full AI Diagnosis Result</h3>
      <p style="font-size:14px;color:var(--text-muted);line-height:1.65;margin-bottom:12px;">${result.insight || result.summary || JSON.stringify(result)}</p>
      ${result.primaryCause ? `<div class="badge badge-cyan" style="margin-bottom:10px;">Primary: ${result.primaryCause}</div>` : ''}
      ${result.recommendation ? `<div class="glass-card" style="padding:14px;margin-top:10px;"><b style="color:#fff;">Recommendation</b><p style="margin-top:6px;font-size:13px;color:var(--text-muted);">${result.recommendation}</p></div>` : ''}
      ${result.confidence ? `<div style="margin-top:10px;font-size:11px;color:var(--text-dim);">Confidence: ${result.confidence}</div>` : ''}
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (e) {
    container.innerHTML = '<div style="color:#f87171;">Diagnosis failed: ' + e.message + '</div>';
  }
}
