// NOVA CART - Delivery Operations Page (/delivery)
import { db } from '../services/db.js';

export function renderDeliveryOperationsPage(statusFilter = 'All') {
  const deliveries = db.getDeliveries('All');

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">AVERAGE DELIVERY SLA</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">37 min</div>
          <div style="font-size: 11px; color: var(--neon-amber);">⚠️ Inflated from 29 min (+27.5%)</div>
        </div>
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">ON-TIME DELIVERIES</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-emerald); margin-top: 4px;">64.2%</div>
          <div style="font-size: 11px; color: var(--text-muted);">Target SLA > 92%</div>
        </div>
        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">DELAYED / AT RISK ORDERS</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">35.8%</div>
          <div style="font-size: 11px; color: var(--neon-rose);">Main driver of customer support</div>
        </div>
        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">ACTIVE DRIVER FLEET</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-cyan); margin-top: 4px;">1,840 Drivers</div>
          <div style="font-size: 11px; color: var(--neon-cyan);">Across 3 cities</div>
        </div>
      </div>

      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <table class="table-futuristic">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Store Node</th>
              <th>Customer</th>
              <th>Assigned Driver</th>
              <th>Distance</th>
              <th>Estimated ETA</th>
              <th>Delay Risk</th>
              <th>Order Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${(deliveries || []).map(d => `
              <tr>
                <td><strong style="color: #fff; font-family: var(--font-mono);">${d.id}</strong></td>
                <td>${d.store} (${d.city || ''})</td>
                <td>${d.customer}</td>
                <td><strong style="color: var(--neon-cyan);">${d.driver || '-'}</strong></td>
                <td>${d.distanceKm} km</td>
                <td><strong style="color: ${d.etaMin > 30 ? 'var(--neon-amber)' : '#fff'};">${d.etaMin} min</strong></td>
                <td><span class="badge ${d.delayRisk === 'HIGH' ? 'badge-rose' : d.delayRisk === 'MEDIUM' ? 'badge-amber' : 'badge-emerald'}">${d.delayRisk || '-'}</span></td>
                <td>${d.status || '-'}</td>
                <td><button type="button" class="btn-view-order btn-futuristic-secondary" data-ordid="${d.id}" style="font-size: 11px; padding: 4px 10px;">View</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
