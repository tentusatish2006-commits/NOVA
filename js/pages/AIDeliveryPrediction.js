// NOVA CART - AI Delivery Delay Prediction Engine
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderAIDeliveryPredictionPage() {
  let deliveries = [];
  try { deliveries = db.getDeliveries('All') || db.getDeliveries() || []; } catch (e) { deliveries = []; }
  if (!deliveries.length) {
    deliveries = [
      { id: 'ORD-1001', store: 'Green Leaf Mart', customer: 'Aarav', distanceKm: 2.4, city: 'Bengaluru' },
      { id: 'ORD-1002', store: 'Urban Fresh', customer: 'Kavya', distanceKm: 3.1, city: 'Bengaluru' },
      { id: 'ORD-1003', store: 'City Pantry', customer: 'Ravi', distanceKm: 4.2, city: 'Mumbai' },
    ];
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">AI Delivery Delay Predictor</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Simulates preparation bottleneck, traffic congestion, and partner availability to predict SLA breaches before dispatch.
        </p>
      </div>

      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">1. Select Active Route to Evaluate SLA Risk</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Select Active Order</label>
            <select id="pred-order-select" class="input-futuristic">
              ${deliveries.map(d => `<option value="${d.id}" data-store="${d.store || ''}" data-dist="${d.distanceKm || 2}" data-customer="${d.customer || ''}">${d.id} — ${d.store || ''} → ${d.customer || ''} (${d.distanceKm || '-'} km)</option>`).join('')}
            </select>
          </div>
          <div style="display: flex; align-items: flex-end;">
            <button type="button" id="btn-run-delivery-pred" class="btn-futuristic glow-cyan" style="width: 100%; justify-content: center; padding: 12px; cursor: pointer;">
              ⚡ Run AI Delay Prediction
            </button>
          </div>
        </div>
      </div>

      <div id="delivery-pred-output" class="glass-panel" style="padding: 24px; min-height: 240px;">
        <div style="text-align: center; color: var(--text-dim); padding-top: 40px;">
          Select an active route above and click "Run AI Delay Prediction".
        </div>
      </div>
    </div>
  `;
}

export async function runDeliveryPrediction() {
  const box = document.getElementById('delivery-pred-output');
  const sel = document.getElementById('pred-order-select');
  if (!box) return;
  box.innerHTML = '<div style="color:var(--neon-cyan);font-family:var(--font-mono);font-size:13px;">Running delay prediction…</div>';
  const opt = sel && sel.options[sel.selectedIndex];
  const order = {
    id: sel ? sel.value : 'ORD-0000',
    store: opt ? opt.getAttribute('data-store') : 'Store',
    distanceKm: opt ? parseFloat(opt.getAttribute('data-dist') || '2') : 2.5,
  };
  try {
    const result = await aiEngine.predictDeliveryDelay(order);
    box.innerHTML = `
      <h3 style="font-size:16px;font-weight:700;color:#fff;margin-bottom:14px;">Prediction Result — ${result.orderId || order.id}</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px;">
        <div class="glass-card" style="padding:14px;"><div style="font-size:11px;color:var(--text-dim);">PREDICTED ETA</div><div style="font-size:22px;font-weight:800;color:#fff;margin-top:4px;">${result.predictedETA} min</div></div>
        <div class="glass-card" style="padding:14px;"><div style="font-size:11px;color:var(--text-dim);">LATE RISK</div><div style="font-size:22px;font-weight:800;color:${result.lateRisk === 'HIGH' ? 'var(--neon-rose)' : 'var(--neon-emerald)'};margin-top:4px;">${result.lateRisk}</div></div>
        <div class="glass-card" style="padding:14px;"><div style="font-size:11px;color:var(--text-dim);">STORE</div><div style="font-size:16px;font-weight:700;color:#fff;margin-top:4px;">${result.store || order.store}</div></div>
      </div>
      <div class="glass-card" style="padding:14px;margin-bottom:12px;">
        <div style="font-size:11px;color:var(--neon-cyan);margin-bottom:8px;">MAIN FACTORS</div>
        <ul style="font-size:13px;color:var(--text-muted);line-height:1.7;padding-left:18px;">
          ${(result.mainFactors || []).map(f => `<li>${f}</li>`).join('') || '<li>Standard transit assumptions</li>'}
        </ul>
      </div>
      <div class="glass-card" style="padding:14px;">
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">RECOMMENDATION</div>
        <p style="font-size:14px;color:var(--text-muted);line-height:1.6;">${result.recommendation || ''}</p>
        ${result.suggestedDriver ? `<div style="margin-top:8px;font-size:12px;color:var(--neon-cyan);">Suggested driver: ${result.suggestedDriver}</div>` : ''}
      </div>
    `;
  } catch (e) {
    box.innerHTML = '<div style="color:#f87171;">Prediction failed: ' + e.message + '</div>';
  }
}
