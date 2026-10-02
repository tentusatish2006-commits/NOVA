// NOVA CART - Inventory Intelligence Page (/inventory)
import { db } from '../services/db.js';

export function renderInventoryIntelligencePage() {
  const inventory = db.getInventory();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">INVENTORY ACCURACY</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">84.2%</div>
          <div style="font-size: 11px; color: var(--neon-amber);">⚠️ Causes 42% of cancellations</div>
        </div>

        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">UNAVAILABLE PRODUCTS TODAY</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">1,420 SKUs</div>
          <div style="font-size: 11px; color: var(--neon-rose);">Across 620 store locations</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">SMART SUBSTITUTION RATE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-cyan); margin-top: 4px;">14.8%</div>
          <div style="font-size: 11px; color: var(--neon-cyan);">Opportunity to save orders</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">PREDICTED STOCKOUTS (NEXT 4H)</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;">84 Items</div>
          <div style="font-size: 11px; color: var(--neon-amber);">Actionable re-stock alerts</div>
        </div>
      </div>

      <!-- Action Banner -->
      <div class="glass-panel glow-cyan" style="padding: 20px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">AI Predictive Stockout & Restock Dispatcher</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
            Identifies items where predicted daily demand exceeds store buffer before cancellations occur.
          </p>
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="btn-analyze-inv" class="btn-futuristic-secondary" style="padding: 10px 20px;">
            🔍 Analyze Stock Telemetry
          </button>
          <button id="btn-generate-restock" class="btn-futuristic glow-cyan" style="padding: 10px 22px;">
            📦 Generate Restock Recommendations
          </button>
        </div>
      </div>

      <!-- Inventory Risk Table -->
      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <table class="table-futuristic">
          <thead>
            <tr>
              <th>Product SKU</th>
              <th>Store Location</th>
              <th>Current Stock</th>
              <th>Avg Daily Demand</th>
              <th>Est. Hours to Stockout</th>
              <th>Risk Severity</th>
              <th>AI Restock Recommendation</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => `
              <tr>
                <td><strong style="color: #fff;">${item.product}</strong></td>
                <td>${item.store}</td>
                <td>
                  <span style="font-size: 15px; font-weight: 800; color: ${item.currentStock === 0 ? 'var(--neon-rose)' : 'var(--neon-amber)'};">
                    ${item.currentStock} units
                  </span>
                </td>
                <td>${item.avgDailyDemand} units/day</td>
                <td><strong style="color: var(--neon-amber);">${item.predictedStockoutHours} hrs</strong></td>
                <td>
                  <span class="badge ${item.risk === 'CRITICAL' ? 'badge-rose' : 'badge-amber'}">
                    ${item.risk}
                  </span>
                </td>
                <td style="font-size: 12px; color: var(--text-muted); max-width: 320px;">
                  ${item.recommendation}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}
