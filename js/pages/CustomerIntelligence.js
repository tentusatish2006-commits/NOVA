// NOVA CART - Customer Intelligence Page
import { db } from '../services/db.js';
import { openModal } from '../components/Modal.js';

export function renderCustomerIntelligencePage() {
  const customers = db.getCustomers('All', '') || [];

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
            ${customers.map((c) => {
              const risk = c.retentionRisk || c.risk || 'LOW';
              const riskClass = risk === 'HIGH' ? 'badge-rose' : risk === 'MEDIUM' ? 'badge-amber' : 'badge-emerald';
              return `
              <tr>
                <td><strong style="color:#fff;">${c.name || '-'}</strong><div style="font-size:11px;color:var(--text-dim);">${c.id}</div></td>
                <td>${c.city || '-'}</td>
                <td><span class="badge badge-cyan">${c.repeatStatus || c.segment || 'Regular'}</span></td>
                <td>${c.orders ?? '-'}</td>
                <td>₹${c.totalSpend ?? '-'}</td>
                <td>${c.lastOrder || '-'}</td>
                <td><span class="badge ${riskClass}">${risk}</span></td>
                <td><button type="button" class="btn-view-customer btn-futuristic-secondary" data-custid="${c.id}" style="font-size:11px;padding:4px 10px;cursor:pointer;">View</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function viewCustomerDetail(customerId) {
  const list = db.getCustomers('All', '') || [];
  const c = list.find((x) => x.id === customerId) || list[0];
  if (!c) {
    openModal('Customer', '<p>Customer not found.</p>');
    return;
  }
  const risk = c.retentionRisk || 'LOW';
  openModal(
    c.name + ' — Profile',
    `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:13px;">
        <div><div style="color:var(--text-dim);font-size:11px;">ID</div><div style="color:#fff;font-weight:600;">${c.id}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">City</div><div style="color:#fff;font-weight:600;">${c.city}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Segment</div><div style="color:#fff;font-weight:600;">${c.repeatStatus}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Retention Risk</div><div style="color:#fff;font-weight:600;">${risk}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Orders</div><div style="color:#fff;font-weight:600;">${c.orders}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Total Spend</div><div style="color:#fff;font-weight:600;">₹${c.totalSpend}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Avg Order</div><div style="color:#fff;font-weight:600;">₹${c.avgOrder || '-'}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Last Order</div><div style="color:#fff;font-weight:600;">${c.lastOrder}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Coupons Used</div><div style="color:#fff;font-weight:600;">${c.couponsUsed ?? 0}</div></div>
        <div><div style="color:var(--text-dim);font-size:11px;">Delivery Complaints</div><div style="color:#fff;font-weight:600;">${c.deliveryComplaints ?? 0}</div></div>
      </div>
      <p style="margin-top:16px;font-size:13px;line-height:1.6;color:var(--text-muted);">
        ${risk === 'HIGH'
          ? 'High churn risk. Recommend VIP Express Pass + wallet credit and SLA guarantee on next order.'
          : risk === 'MEDIUM'
            ? 'Medium risk. Send personalized replenishment nudge for top categories.'
            : 'Healthy engagement. Maintain loyalty rewards and priority support.'}
      </p>
    `
  );
}
