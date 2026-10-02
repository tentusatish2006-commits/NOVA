// NOVA CART - Store Intelligence Page
import { db } from '../services/db.js';
import { openModal } from '../components/Modal.js';

export function renderStoreIntelligencePage() {
  const stores = (db.getStores('All', '') || []).slice(0, 24);

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
        ${stores.map((s) => `
          <div class="glass-card" style="padding: 18px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="font-size:15px;font-weight:700;color:#fff;">${s.name}</div>
                <div style="font-size:12px;color:var(--text-dim);margin-top:2px;">${s.city || ''} · ${s.category || ''}</div>
              </div>
              <span class="badge ${s.status === 'at_risk' ? 'badge-rose' : 'badge-cyan'}">${s.status || 'healthy'}</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;font-size:12px;color:var(--text-muted);">
              <div>Orders/day<br><b style="color:#fff;">${s.ordersPerDay ?? '-'}</b></div>
              <div>Inv. accuracy<br><b style="color:#fff;">${s.inventoryAccuracy ?? '-'}%</b></div>
              <div>Rejection<br><b style="color:#fff;">${s.rejectionRate ?? '-'}%</b></div>
              <div>Rating<br><b style="color:#fff;">${s.rating ?? '-'}</b></div>
            </div>
            <button type="button" class="btn-store-detail btn-futuristic-secondary" data-storeid="${s.id}" style="width:100%;font-size:12px;padding:8px;margin-top:14px;cursor:pointer;">View Details</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function viewStoreDetail(storeId) {
  const list = db.getStores('All', '') || [];
  const s = list.find((x) => x.id === storeId) || list[0];
  if (!s) {
    openModal('Store', '<p>Store not found.</p>');
    return;
  }
  openModal(
    s.name,
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">
        <div><div style="color:var(--text-dim);font-size:11px;">ID</div><div style="color:#fff;font-weight:600;">${s.id}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">City</div><div style="color:#fff;font-weight:600;">${s.city}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Category</div><div style="color:#fff;font-weight:600;">${s.category}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Status</div><div style="color:#fff;font-weight:600;">${s.status}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Orders / day</div><div style="color:#fff;font-weight:600;">${s.ordersPerDay}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Monthly Revenue</div><div style="color:#fff;font-weight:600;">₹${(s.monthlyRevenue || 0).toLocaleString('en-IN')}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Inventory Accuracy</div><div style="color:#fff;font-weight:600;">${s.inventoryAccuracy}%</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Rejection Rate</div><div style="color:#fff;font-weight:600;">${s.rejectionRate}%</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Rating</div><div style="color:#fff;font-weight:600;">${s.rating}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Hours</div><div style="color:#fff;font-weight:600;">${s.openHours || '-'}</div></div>
        <div style="grid-column:1/-1;"><div style="color:var(--text-dim);font-size:11px;">Contact</div><div style="color:#fff;font-weight:600;">${s.contact || '-'}</div></div>
      </div>
      <p style="margin-top:16px;font-size:13px;line-height:1.6;color:var(--text-muted);">
        ${s.status === 'at_risk'
          ? 'At-risk partner: high rejection or low inventory accuracy. Recommend scorecard review and inventory sync.'
          : 'Healthy partner node. Maintain preferred routing and monitor peak-hour capacity.'}
      </p>
    `
  );
}
