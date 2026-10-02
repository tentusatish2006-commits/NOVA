// NOVA CART - Customer Intelligence Page (/customers)
import { db } from '../services/db.js';

export function renderCustomerIntelligencePage(currentSegment = 'All', searchQuery = '') {
  const customers = db.getCustomers('All', '');

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">REGISTERED USERS</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">120,000</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">↑ +46% Growth</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">MONTHLY ACTIVE (MAU)</div>
          <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">46,000</div>
          <div style="font-size: 11px; color: var(--text-muted);">38.3% Engagement</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">REPEAT BUYERS</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">27%</div>
          <div style="font-size: 11px; color: var(--neon-rose);">⚠️ Down from 41%</div>
        </div>
        <div class="glass-card" style="padding: 16px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AT-RISK SEGMENT</div>
          <div style="font-size: 24px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">34,200</div>
          <div style="font-size: 11px; color: var(--neon-amber);">High churn probability</div>
        </div>
      </div>

      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <table class="table-futuristic">
          <thead>
            <tr>
              <th>Customer ID & Name</th>
              <th>City</th>
              <th>Segment</th>
              <th>Orders</th>
              <th>Total Spend</th>
              <th>Last Order</th>
              <th>Risk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td><strong style="color:#fff;">${c.name || c.id}</strong><div style="font-size:11px;color:var(--text-dim);">${c.id}</div></td>
                <td>${c.city || '-'}</td>
                <td><span class="badge badge-cyan">${c.segment || 'Regular'}</span></td>
                <td>${c.orders ?? c.orderCount ?? '-'}</td>
                <td>₹${c.totalSpend ?? c.spend ?? '-'}</td>
                <td>${c.lastOrder || '-'}</td>
                <td>${c.risk || c.churnRisk || '-'}</td>
                <td><button type="button" class="btn-view-customer btn-futuristic-secondary" data-custid="${c.id}" style="font-size:11px;padding:4px 10px;">View</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
