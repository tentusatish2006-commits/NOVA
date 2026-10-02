// NOVA CART - Store Intelligence Page (/stores)
import { db } from '../services/db.js';

export function renderStoreIntelligencePage(selectedCity = 'All', searchQuery = '') {
  const stores = db.getStores('All', '');

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">TOTAL PARTNER STORES</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">620</div>
          <div style="font-size: 11px; color: var(--text-muted);">Across 3 cities</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AVG INVENTORY ACCURACY</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">84.2%</div>
          <div style="font-size: 11px; color: var(--neon-amber);">Triggers cancellations</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AVG REJECTION RATE</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">8.4%</div>
          <div style="font-size: 11px; color: var(--neon-rose);">At-risk partners elevated</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">HEALTHY STORES</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--neon-emerald); margin-top: 4px;">512</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">108 need intervention</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
        ${stores.slice(0, 24).map(s => `
          <div class="glass-card" style="padding: 18px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="font-size:15px;font-weight:700;color:#fff;">${s.name}</div>
                <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">${s.city || ''} · ${s.category || ''}</div>
              </div>
              <span class="badge ${s.status === 'at_risk' ? 'badge-rose' : 'badge-cyan'}">${s.status || 'healthy'}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;font-size:12px;color:var(--text-muted);">
              <div>Orders/day<br><b style="color:#fff;">${s.ordersPerDay ?? s.orders ?? '-'}</b></div>
              <div>Inv. accuracy<br><b style="color:#fff;">${s.inventoryAccuracy ?? '-'}%</b></div>
              <div>Rejection<br><b style="color:#fff;">${s.rejectionRate ?? '-'}%</b></div>
              <div>Rating<br><b style="color:#fff;">${s.rating ?? '-'}</b></div>
            </div>
            <button type="button" class="btn-store-detail btn-futuristic-secondary" data-storeid="${s.id}" style="width:100%;font-size:12px;padding:8px;justify-content:center;margin-top:14px;">View Details</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
