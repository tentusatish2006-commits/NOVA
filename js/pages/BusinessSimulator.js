// NOVA CART - What-If Business Simulator
import { db } from '../services/db.js';

export function renderBusinessSimulatorPage() {
  const savedSimulations = db.getSimulations() || [];

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">What-If Multi-Variable Business Simulator</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Simulate multi-variable rescue scenarios and compare before/after performance.
        </p>
      </div>

      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 18px;">1. Configure Simulation Parameters</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Repeat Purchase Rate: <strong id="sim-val-repeat" style="color: var(--neon-cyan);">35%</strong></label>
            <input type="range" id="sim-repeat" min="20" max="45" value="35" style="width:100%;">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Delivery Time (mins): <strong id="sim-val-del" style="color: var(--neon-cyan);">28m</strong></label>
            <input type="range" id="sim-del" min="20" max="40" value="28" style="width:100%;">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Cancellation Rate: <strong id="sim-val-cancel" style="color: var(--neon-cyan);">6%</strong></label>
            <input type="range" id="sim-cancel" min="3" max="15" value="6" style="width:100%;">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Inventory Accuracy: <strong id="sim-val-inv" style="color: var(--neon-cyan);">94%</strong></label>
            <input type="range" id="sim-inv" min="75" max="99" value="94" style="width:100%;">
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 6px;">Marketing Spend (₹ Lakhs): <strong id="sim-val-mkt" style="color: var(--neon-cyan);">₹12L</strong></label>
            <input type="range" id="sim-mkt" min="8" max="25" value="12" style="width:100%;">
          </div>
          <div style="display: flex; align-items: flex-end;">
            <button type="button" id="btn-run-sim" class="btn-futuristic glow-cyan" style="width: 100%; justify-content: center; padding: 12px; cursor: pointer;">
              ⚡ Run Simulation & Compute Output
            </button>
          </div>
        </div>
      </div>

      <div id="sim-output-container" class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 16px;">2. Simulation Output Comparison</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
          <div class="glass-card" style="padding: 20px; border-color: rgba(244, 63, 94, 0.3);">
            <div style="font-size: 12px; font-family: var(--font-mono); color: var(--neon-rose); margin-bottom: 6px;">CURRENT BASELINE (ACTUALS)</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff;">₹26.1L Revenue / mo</div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; font-size: 13px; color: var(--text-muted);">
              <div>• Monthly Orders: <strong>38,500</strong></div>
              <div>• Repeat Purchase Rate: <strong style="color: var(--neon-rose);">27%</strong></div>
              <div>• Cancellation Rate: <strong style="color: var(--neon-rose);">11%</strong></div>
              <div>• Monthly Marketing Spend: <strong>₹17.0L</strong></div>
              <div>• Net Profit Margin: <strong style="color: var(--neon-rose);">8.2%</strong></div>
            </div>
          </div>
          <div class="glass-card" style="padding: 20px; border-color: rgba(16, 185, 129, 0.3);">
            <div style="font-size: 12px; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 6px;">SIMULATED TARGET SCENARIO</div>
            <div id="sim-target-rev" style="font-size: 24px; font-weight: 800; color: var(--neon-emerald);">₹34.8L Revenue / mo</div>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px; font-size: 13px; color: var(--text-muted);">
              <div>• Projected Monthly Orders: <strong id="sim-target-orders" style="color: #fff;">44,200</strong></div>
              <div>• Repeat Purchase Rate: <strong id="sim-target-repeat" style="color: var(--neon-emerald);">35%</strong></div>
              <div>• Cancellation Rate: <strong id="sim-target-cancel" style="color: var(--neon-emerald);">6%</strong></div>
              <div>• Monthly Marketing Spend: <strong id="sim-target-mkt" style="color: var(--neon-cyan);">₹12.0L</strong></div>
              <div>• Net Profit Margin: <strong id="sim-target-profit" style="color: var(--neon-emerald);">16.4%</strong></div>
              <div>• Avg Delivery: <strong id="sim-target-del" style="color: #fff;">28 min</strong></div>
              <div>• Inventory Accuracy: <strong id="sim-target-inv" style="color: #fff;">94%</strong></div>
            </div>
          </div>
        </div>
        <div id="sim-insight" style="margin-top:16px;font-size:13px;color:var(--text-muted);line-height:1.6;"></div>
        <div style="margin-top: 20px; text-align: right;">
          <button type="button" id="btn-save-sim-scenario" class="btn-futuristic-secondary" style="font-size: 12px; padding: 8px 16px; cursor: pointer;">💾 Save Scenario for Comparison</button>
        </div>
      </div>

      <div class="glass-panel" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px;">3. Saved Simulation History</h3>
        <div id="sim-history-list" style="display: flex; flex-direction: column; gap: 10px;">
          ${savedSimulations.map((sim) => `
            <div class="glass-card" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
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

export function initSimulatorControls() {
  const bindLabel = (id, labelId, fmt) => {
    const el = document.getElementById(id);
    const lab = document.getElementById(labelId);
    if (!el || !lab) return;
    const update = () => { lab.textContent = fmt(el.value); };
    el.addEventListener('input', update);
    update();
  };
  bindLabel('sim-repeat', 'sim-val-repeat', (v) => v + '%');
  bindLabel('sim-del', 'sim-val-del', (v) => v + 'm');
  bindLabel('sim-cancel', 'sim-val-cancel', (v) => v + '%');
  bindLabel('sim-inv', 'sim-val-inv', (v) => v + '%');
  bindLabel('sim-mkt', 'sim-val-mkt', (v) => '₹' + v + 'L');
}

export function runBusinessSimulation() {
  const repeat = parseFloat((document.getElementById('sim-repeat') || {}).value || 35);
  const del = parseFloat((document.getElementById('sim-del') || {}).value || 28);
  const cancel = parseFloat((document.getElementById('sim-cancel') || {}).value || 6);
  const inv = parseFloat((document.getElementById('sim-inv') || {}).value || 94);
  const mkt = parseFloat((document.getElementById('sim-mkt') || {}).value || 12);

  // Simple model vs baseline 38.5k orders, 26.1L revenue, 8.2% margin
  const orderLift = 1 + (repeat - 27) * 0.012 + (11 - cancel) * 0.015 + (37 - del) * 0.008 + (inv - 84) * 0.004;
  const orders = Math.round(38500 * Math.max(0.85, orderLift));
  const aov = 486;
  const grossRevLakhs = (orders * aov) / 100000;
  const promoDrag = Math.max(0, (mkt - 10) * 0.15);
  const cancelLoss = (cancel / 100) * grossRevLakhs * 0.6;
  const netRevLakhs = Math.max(18, grossRevLakhs - promoDrag - cancelLoss);
  let margin = 8.2 + (repeat - 27) * 0.35 + (11 - cancel) * 0.4 + (37 - del) * 0.15 + (inv - 84) * 0.08 - (mkt - 12) * 0.25;
  margin = Math.min(22, Math.max(5, margin));

  const set = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  set('sim-target-rev', '₹' + netRevLakhs.toFixed(1) + 'L Revenue / mo');
  set('sim-target-orders', orders.toLocaleString('en-IN'));
  set('sim-target-repeat', repeat + '%');
  set('sim-target-cancel', cancel + '%');
  set('sim-target-mkt', '₹' + mkt.toFixed(1) + 'L');
  set('sim-target-profit', margin.toFixed(1) + '%');
  set('sim-target-del', del + ' min');
  set('sim-target-inv', inv + '%');

  const insight = document.getElementById('sim-insight');
  if (insight) {
    const delta = (netRevLakhs - 26.1).toFixed(1);
    insight.innerHTML = `<div class="glass-card" style="padding:14px;"><b style="color:#fff;">AI insight:</b> Moving from baseline (27% repeat, 37 min delivery, 11% cancel) to these inputs lifts projected revenue by <b style="color:var(--neon-emerald);">₹${delta}L / mo</b> and margin to <b style="color:var(--neon-emerald);">${margin.toFixed(1)}%</b>. Strongest levers: repeat rate and cancellation reduction.</div>`;
  }

  const out = document.getElementById('sim-output-container');
  if (out) out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  return { repeat, del, cancel, inv, mkt, orders, netRevLakhs, margin };
}

export function saveSimulationScenario() {
  const result = runBusinessSimulation();
  const name = 'Scenario ' + new Date().toLocaleString();
  const card = document.createElement('div');
  card.className = 'glass-card';
  card.style.cssText = 'padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;';
  card.innerHTML = `
    <div>
      <strong style="color:#fff;font-size:14px;">${name}</strong>
      <div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Repeat: ${result.repeat}% | Delivery: ${result.del}m | Cancellation: ${result.cancel}%</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:16px;font-weight:700;color:var(--neon-emerald);">₹${result.netRevLakhs.toFixed(1)}L / mo</div>
      <div style="font-size:11px;color:var(--text-dim);">Margin: ${result.margin.toFixed(1)}%</div>
    </div>`;
  const list = document.getElementById('sim-history-list');
  if (list) list.prepend(card);
}
