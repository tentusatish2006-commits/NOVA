// NOVA CART - AI Delivery Delay Prediction Engine
import { db } from '../services/db.js';

function loadDeliveries() {
  try {
    const list = db.getDeliveries('All') || db.getDeliveries() || [];
    if (list && list.length) return list;
  } catch (e) {}
  return [
    { id: 'ORD-8821', store: 'Urban Fresh Market #1', customer: 'Aarav Sharma', distanceKm: 3.4, city: 'Bengaluru', driver: 'Rajesh Kumar' },
    { id: 'ORD-8822', store: 'City Pantry #3', customer: 'Priya Patel', distanceKm: 1.8, city: 'Mumbai', driver: 'Suresh Yadav' },
    { id: 'ORD-8823', store: 'Metro Corner Store #7', customer: 'Vikram Malhotra', distanceKm: 5.2, city: 'Delhi-NCR', driver: 'Amit Singh' },
  ];
}

function computeDelay(order) {
  const distanceKm = Number(order.distanceKm) || 2.5;
  const hour = new Date().getHours();
  const isPeakHour = hour >= 18 && hour <= 21;
  const prepTimeMin = distanceKm * 6 + 12;
  const trafficMultiplier = isPeakHour ? 1.35 : 1.1;
  const predictedETA = Math.round(prepTimeMin * trafficMultiplier);
  const isLate = predictedETA > 30;
  return {
    orderId: order.id,
    store: order.store,
    customer: order.customer,
    predictedETA,
    lateRisk: isLate ? 'HIGH' : 'LOW',
    mainFactors: [
      'Distance: ' + distanceKm + ' km (~' + Math.round(distanceKm * 6) + ' min transit)',
      'Store prep time estimate: 12 min',
      'Zone congestion: ' + (isPeakHour ? 'High (Peak Evening 6–9 PM)' : 'Normal'),
    ],
    recommendation: isLate
      ? 'Re-assign nearest driver on active route + send store dispatch urgency alert.'
      : 'Maintain standard driver allocation.',
    suggestedDriver: order.driver || 'Rajesh Kumar (0.4 km from store)',
  };
}

export function renderAIDeliveryPredictionPage() {
  const deliveries = loadDeliveries();

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
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 20px; align-items: end;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Select Active Order</label>
            <select id="pred-order-select" class="input-futuristic" style="width:100%;">
              ${deliveries.map((d) => `
                <option value="${d.id}"
                  data-store="${(d.store || '').replace(/"/g, '')}"
                  data-dist="${d.distanceKm || 2}"
                  data-customer="${(d.customer || '').replace(/"/g, '')}"
                  data-driver="${(d.driver || '').replace(/"/g, '')}">
                  ${d.id} — ${d.store || ''} → ${d.customer || ''} (${d.distanceKm || '-'} km)
                </option>`).join('')}
            </select>
          </div>
          <button type="button" id="btn-run-delivery-pred" class="btn-futuristic glow-cyan" style="padding: 12px 24px; cursor: pointer; white-space: nowrap;">
            ⚡ Run AI Delay Prediction
          </button>
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

export function runDeliveryPrediction() {
  const box = document.getElementById('delivery-pred-output');
  const sel = document.getElementById('pred-order-select');
  if (!box) {
    console.error('delivery-pred-output missing');
    return;
  }
  box.innerHTML = '<div style="color:var(--neon-cyan);font-family:var(--font-mono);font-size:13px;">Running delay prediction…</div>';

  try {
    const deliveries = loadDeliveries();
    let order = deliveries[0] || { id: 'ORD-0000', store: 'Store', distanceKm: 2.5, customer: 'Customer' };
    if (sel && sel.value) {
      const found = deliveries.find((d) => d.id === sel.value);
      if (found) order = found;
      else if (sel.options[sel.selectedIndex]) {
        const opt = sel.options[sel.selectedIndex];
        order = {
          id: sel.value,
          store: opt.getAttribute('data-store') || 'Store',
          distanceKm: parseFloat(opt.getAttribute('data-dist') || '2.5'),
          customer: opt.getAttribute('data-customer') || '',
          driver: opt.getAttribute('data-driver') || '',
        };
      }
    }

    const result = computeDelay(order);
    const riskColor = result.lateRisk === 'HIGH' ? 'var(--neon-rose)' : 'var(--neon-emerald)';

    box.innerHTML = `
      <h3 style="font-size:16px;font-weight:700;color:#fff;margin-bottom:14px;">Prediction Result — ${result.orderId}</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px;">
        <div class="glass-card" style="padding:14px;">
          <div style="font-size:11px;color:var(--text-dim);">PREDICTED ETA</div>
          <div style="font-size:22px;font-weight:800;color:#fff;margin-top:4px;">${result.predictedETA} min</div>
        </div>
        <div class="glass-card" style="padding:14px;">
          <div style="font-size:11px;color:var(--text-dim);">LATE RISK</div>
          <div style="font-size:22px;font-weight:800;color:${riskColor};margin-top:4px;">${result.lateRisk}</div>
        </div>
        <div class="glass-card" style="padding:14px;">
          <div style="font-size:11px;color:var(--text-dim);">STORE</div>
          <div style="font-size:16px;font-weight:700;color:#fff;margin-top:4px;">${result.store || '-'}</div>
        </div>
        <div class="glass-card" style="padding:14px;">
          <div style="font-size:11px;color:var(--text-dim);">CUSTOMER</div>
          <div style="font-size:16px;font-weight:700;color:#fff;margin-top:4px;">${result.customer || '-'}</div>
        </div>
      </div>
      <div class="glass-card" style="padding:14px;margin-bottom:12px;">
        <div style="font-size:11px;color:var(--neon-cyan);margin-bottom:8px;">MAIN FACTORS</div>
        <ul style="font-size:13px;color:var(--text-muted);line-height:1.7;padding-left:18px;margin:0;">
          ${result.mainFactors.map((f) => '<li>' + f + '</li>').join('')}
        </ul>
      </div>
      <div class="glass-card" style="padding:14px;">
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">RECOMMENDATION</div>
        <p style="font-size:14px;color:var(--text-muted);line-height:1.6;margin:0;">${result.recommendation}</p>
        <div style="margin-top:8px;font-size:12px;color:var(--neon-cyan);">Suggested driver: ${result.suggestedDriver}</div>
      </div>
    `;
  } catch (e) {
    box.innerHTML = '<div style="color:#f87171;">Prediction failed: ' + (e && e.message ? e.message : String(e)) + '</div>';
  }
}

// Backup global for inline binding if module event fails
if (typeof window !== 'undefined') {
  window.runDeliveryPrediction = runDeliveryPrediction;
}
