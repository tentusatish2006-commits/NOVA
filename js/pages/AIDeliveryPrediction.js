// NOVA CART - AI Delivery Delay Prediction Engine (/delivery-prediction)
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderAIDeliveryPredictionPage() {
  const deliveries = db.getDeliveries();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Intro -->
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">AI Delivery Delay Predictor</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Simulates preparation bottleneck, traffic congestion, and partner availability to predict SLA breaches before dispatch.
        </p>
      </div>

      <!-- Select Order & Telemetry Simulator -->
      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">
          1. Select Active Route to Evaluate SLA Risk
        </h3>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Select Active Order</label>
            <select id="pred-order-select" class="input-futuristic">
              ${deliveries.map(d => `
                <option value="${d.id}">${d.id} — ${d.store} → ${d.customer} (${d.distanceKm} km)</option>
              `).join('')}
            </select>
          </div>

          <div style="display: flex; align-items: flex-end;">
            <button id="btn-run-delivery-pred" class="btn-futuristic glow-cyan" style="width: 100%; justify-content: center; padding: 12px;">
              ⚡ Run AI Delay Prediction
            </button>
          </div>
        </div>
      </div>

      <!-- Output Container -->
      <div id="delivery-pred-output" class="glass-panel" style="padding: 24px; min-height: 240px; display: flex; align-items: center; justify-content: center; text-align: center; color: var(--text-dim);">
        Select an active route above and click "Run AI Delay Prediction" to see predicted ETA, risk factors, and driver re-assignment recommendations.
      </div>

    </div>
  `;
}
