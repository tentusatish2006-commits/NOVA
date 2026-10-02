// NOVA CART - Store Intelligence Page (/stores)
import { db } from '../services/db.js';

export function renderStoreIntelligencePage(selectedCity = 'All', searchQuery = '') {
  const stores = db.getStores(selectedCity, searchQuery);

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Store Network KPIs -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">PARTNER STORE NETWORK</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;" class="gradient-text-cyan">620 Stores</div>
          <div style="font-size: 11px; color: var(--neon-cyan);">Across BLR, MUM & DEL</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AVG DAILY ORDERS / STORE</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;">62.1 Orders</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">38,500 total monthly</div>
        </div>

        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.3);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">AVG INVENTORY ACCURACY</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">84.2%</div>
          <div style="font-size: 11px; color: var(--neon-amber);">⚠️ Target > 96%</div>
        </div>

        <div class="glass-card" style="padding: 18px; border-color: rgba(244, 63, 94, 0.3);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">AVG STORE REJECTION RATE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">8.4%</div>
          <div style="font-size: 11px; color: var(--neon-rose);">Triggers cancellations</div>
        </div>
      </div>

      <!-- Controls & Filters -->
      <div class="glass-panel" style="padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <input type="text" id="store-search" value="${searchQuery}" placeholder="Search store name or category..." class="input-futuristic" style="width: 260px;">
          
          <select id="store-city-filter" class="input-futuristic" style="width: 160px;">
            <option value="All" ${selectedCity === 'All' ? 'selected' : ''}>All Cities</option>
            <option value="Bengaluru" ${selectedCity === 'Bengaluru' ? 'selected' : ''}>Bengaluru</option>
            <option value="Mumbai" ${selectedCity === 'Mumbai' ? 'selected' : ''}>Mumbai</option>
            <option value="Delhi-NCR" ${selectedCity === 'Delhi-NCR' ? 'selected' : ''}>Delhi-NCR</option>
          </select>
        </div>

        <div style="font-size: 12px; color: var(--text-muted);">
          Displaying <strong>${stores.length}</strong> partner store nodes
        </div>
      </div>

      <!-- 3D Interactive Store Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
        ${stores.slice(0, 18).map(s => `
          <div class="glass-card store-card-interactive" style="padding: 20px; border-left: 4px solid ${s.rejectionRate > 10 ? 'var(--neon-rose)' : s.inventoryAccuracy < 85 ? 'var(--neon-amber)' : 'var(--neon-cyan)'}; cursor: pointer;">
            <div style="display: flex; align-items: flex-start; justify-content: space-between;">
              <div>
                <span class="badge badge-cyan" style="font-size: 10px; font-family: var(--font-mono);">${s.id}</span>
                <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-top: 4px;">${s.name}</h3>
                <div style="font-size: 12px; color: var(--text-muted);">${s.category} • ${s.city}</div>
              </div>
              <span class="badge ${s.status === 'at_risk' ? 'badge-rose' : 'badge-emerald'}">
                ${s.status === 'at_risk' ? 'AT RISK' : 'HEALTHY'}
              </span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 12px;">
              <div>
                <div style="color: var(--text-dim);">Daily Orders</div>
                <div style="font-size: 15px; font-weight: 700; color: #fff;">${s.ordersPerDay}</div>
              </div>
              <div>
                <div style="color: var(--text-dim);">Inventory Accuracy</div>
                <div style="font-size: 15px; font-weight: 700; color: ${s.inventoryAccuracy < 85 ? 'var(--neon-amber)' : 'var(--neon-emerald)'};">${s.inventoryAccuracy}%</div>
              </div>
              <div>
                <div style="color: var(--text-dim);">Rejection Rate</div>
                <div style="font-size: 15px; font-weight: 700; color: ${s.rejectionRate > 10 ? 'var(--neon-rose)' : '#fff'};">${s.rejectionRate}%</div>
              </div>
              <div>
                <div style="color: var(--text-dim);">Store Rating</div>
                <div style="font-size: 15px; font-weight: 700; color: var(--neon-cyan);">⭐ ${s.rating}</div>
              </div>
            </div>

            <button class="btn-store-detail btn-futuristic-secondary" data-storeid="${s.id}" style="width: 100%; font-size: 12px; padding: 8px; justify-content: center; margin-top: 14px;">
              🔍 Open Store Telemetry Drawer
            </button>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}
