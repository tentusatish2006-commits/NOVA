// NOVA CART - What-If Business Simulator (/simulator)
import { db } from '../services/db.js';

export function renderBusinessSimulatorPage() {
  const savedSimulations = db.getSimulations();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">What-If Multi-Variable Business Simulator</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Simulate complex multi-variable business rescue scenarios and compare before/after operational performance.
        </p>
      </div>

      <!-- Controls & Input Sliders -->
      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 18px;">
          1. Configure Simulation Parameters
        </h3>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
          
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Repeat Purchase Rate: <strong id="sim-val-repeat" style="color: var(--neon-cyan);">35%</strong></label>
            <input type="range" id="sim-repeat" min="20" max="45" value="35">
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Delivery Time (mins): <strong id="sim-val-del" style="color: var(--neon-cyan);">28m</strong></label>
            <input type="range" id="sim-del" min="20" max="40" value="28">
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Cancellation Rate: <strong id="sim-val-cancel" style="color: var(--neon-cyan);">6%</strong></label>
            <input type="range" id="sim-cancel" min="3" max="15" value="6">
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Inventory Accuracy: <strong id="sim-val-inv" style="color: var(--neon-cyan);">94%</strong></label>
            <input type="range" id="sim-inv" min="75" max="99" value="94">
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Marketing Spend (₹ Lakhs): <strong id="sim-val-mkt" style="color: var(--neon-cyan);">₹12L</strong></label>
            <input type="range" id="sim-mkt" min="8" max="25" value="12">
          </div>

          <div style="display: flex; align-items: flex-end;">
            <button id="btn-run-sim" class="btn-futuristic glow-cyan" style="width: 100%; justify-content: center; padding: 12px;">
              ⚡ Run Simulation & Compute Output
            </button>
          </div>

        </div>
      </div>

      <!-- Side-by-Side Comparison Container -->
      <div id="sim-output-container" class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">2. Simulation Output Comparison</h3>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
          
          <!-- Baseline Current -->
          <div class="glass-card" style="padding: 20px; border-color: rgba(244, 63, 94, 0.3);">
            <div style="font-size: 12px; font-family: var(--font-mono); color: var(--neon-rose); margin-bottom: 6px;">CURRENT BASELINE (ACTUALS)</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff;">₹26.1L Revenue / mo</div>
            
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; font-size: 13px; color: var(--text-muted);">
              <div>• Monthly Orders: <strong>38,500</strong></div>
              <div>• Repeat Purchase Rate: <strong style="color: var(--neon-rose);">27%</strong></div>
              <div>• Cancellation Rate: <strong style="color: var(--neon-rose);">11%</strong></div>
              <div>• Monthly Marketing Spend: <strong>₹17.0L</strong></div>
              <div>• Net Profit Margin: <strong>8.2%</strong></div>
            </div>
          </div>

          <!-- Simulated Target -->
          <div class="glass-card glow-cyan" style="padding: 20px; border-color: var(--border-cyan);">
            <div style="font-size: 12px; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 6px;">SIMULATED TARGET SCENARIO</div>
            <div id="sim-target-rev" style="font-size: 24px; font-weight: 800; color: var(--neon-emerald);">₹34.8L Revenue / mo</div>
            
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; font-size: 13px; color: var(--text-muted);">
              <div>• Projected Monthly Orders: <strong id="sim-target-orders" style="color: #fff;">44,200</strong></div>
              <div>• Repeat Purchase Rate: <strong id="sim-target-repeat" style="color: var(--neon-emerald);">35%</strong></div>
              <div>• Cancellation Rate: <strong id="sim-target-cancel" style="color: var(--neon-emerald);">6%</strong></div>
              <div>• Monthly Marketing Spend: <strong id="sim-target-mkt" style="color: var(--neon-cyan);">₹12.0L</strong></div>
              <div>• Net Profit Margin: <strong id="sim-target-profit" style="color: var(--neon-emerald);">16.4%</strong></div>
            </div>
          </div>

        </div>

        <div style="margin-top: 20px; text-align: right;">
          <button id="btn-save-sim-scenario" class="btn-futuristic-secondary" style="font-size: 12px; padding: 8px 16px;">
            💾 Save Scenario for Comparison
          </button>
        </div>
      </div>

      <!-- Saved Scenarios List -->
      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px;">3. Saved Simulation History</h3>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${savedSimulations.map(sim => `
            <div class="glass-card" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between;">
              <div>
                <strong style="color: #fff; font-size: 14px;">${sim.name}</strong>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
                  Repeat: ${sim.repeatRate}% | Delivery: ${sim.deliveryMin}m | Cancellation: ${sim.cancellationRate}%
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 16px; font-weight: 700; color: var(--neon-emerald);">₹${sim.projectedMonthlyRevenueLakhs}L / mo</div>
                <div style="font-size: 11px; color: var(--text-dim);">Margin: ${sim.netProfitMargin}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
