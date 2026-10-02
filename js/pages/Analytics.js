// NOVA CART - Advanced Analytics Page (/analytics)
import { db } from '../services/db.js';

export function renderAnalyticsPage(currentTab = 'Finance') {
  const tabs = ["Finance", "Customers", "Orders", "Stores", "Inventory", "Delivery", "Marketing", "Support"];

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Title & Export Controls -->
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Multi-Domain Advanced Analytics</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
            Cross-tabulate telemetry across financial, operational, customer, and marketing dimensions.
          </p>
        </div>

        <div style="display: flex; gap: 12px;">
          <button id="btn-export-csv" class="btn-futuristic-secondary" style="padding: 10px 20px;">
            📥 Export CSV Data
          </button>
          <a href="#/reports" class="btn-futuristic glow-cyan" style="padding: 10px 20px;">
            📄 Generate Custom Report
          </a>
        </div>
      </div>

      <!-- Domain Tabs -->
      <div class="glass-panel" style="padding: 14px; display: flex; gap: 8px; overflow-x: auto;">
        ${tabs.map(t => `
          <button class="btn-analytics-tab ${currentTab === t ? 'btn-futuristic' : 'btn-futuristic-secondary'}" data-tab="${t}" style="font-size: 13px; padding: 8px 18px;">
            ${t} Analytics
          </button>
        `).join('')}
      </div>

      <!-- Domain Content Body -->
      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">
          ${currentTab} Telemetry Overview & Drilldown
        </h3>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${currentTab} Metric #1</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">Telemetry Data A</div>
            <div style="font-size: 11px; color: var(--neon-cyan);">High Precision Signal</div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${currentTab} Metric #2</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">Telemetry Data B</div>
            <div style="font-size: 11px; color: var(--neon-emerald);">Operational Normal</div>
          </div>

          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${currentTab} Metric #3</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">Telemetry Data C</div>
            <div style="font-size: 11px; color: var(--neon-amber);">Attention Required</div>
          </div>
        </div>

        <div style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
          Displaying aggregated ${currentTab.toLowerCase()} data across Bengaluru, Mumbai, and Delhi-NCR stores. All table items support drill-down inspection.
        </div>
      </div>

    </div>
  `;
}
