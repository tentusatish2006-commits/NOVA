// NOVA CART - Customer Intelligence Page (/customers)
import { db } from '../services/db.js';

export function renderCustomerIntelligencePage(currentSegment = 'All', searchQuery = '') {
  const customers = db.getCustomers(currentSegment, searchQuery);

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Customer KPI Cards -->
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

      <!-- Controls & Filters -->
      <div class="glass-panel" style="padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <input type="text" id="cust-search-input" value="${searchQuery}" placeholder="Search customer name or ID..." class="input-futuristic" style="width: 260px;">
          
          <select id="cust-segment-filter" class="input-futuristic" style="width: 160px;">
            <option value="All" ${currentSegment === 'All' ? 'selected' : ''}>All Segments</option>
            <option value="High Value" ${currentSegment === 'High Value' ? 'selected' : ''}>VIP High Value</option>
            <option value="Regular" ${currentSegment === 'Regular' ? 'selected' : ''}>Active Regular</option>
            <option value="At Risk" ${currentSegment === 'At Risk' ? 'selected' : ''}>At Risk Churn</option>
            <option value="Inactive" ${currentSegment === 'Inactive' ? 'selected' : ''}>Churned / Inactive</option>
          </select>
        </div>

        <div style="font-size: 12px; color: var(--text-muted);">
          Showing <strong>${customers.length}</strong> customer records
        </div>
      </div>

      <!-- Customer Table -->
      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <table class="table-futuristic">
          <thead>
            <tr>
              <th>Customer ID & Name</th>
              <th>City</th>
              <th>Total Orders</th>
              <th>Total Spend</th>
              <th>Avg Order Value</th>
              <th>Last Order</th>
              <th>Segment Status</th>
              <th>Retention Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${customers.map(c => `
              <tr>
                <td>
                  <div style="font-weight: 700; color: #fff;">${c.name}</div>
                  <div style="font-size: 11px; color: var(--text-dim); font-family: var(--font-mono);">${c.id}</div>
                </td>
                <td>${c.city}</td>
                <td><strong style="color: #fff;">${c.orders}</strong> orders</td>
                <td>₹${c.totalSpend.toLocaleString()}</td>
                <td>₹${c.avgOrder}</td>
                <td>${c.lastOrder}</td>
                <td>
                  <span class="badge ${c.repeatStatus.includes('VIP') ? 'badge-violet' : c.repeatStatus.includes('At Risk') ? 'badge-amber' : c.repeatStatus.includes('Churned') ? 'badge-rose' : 'badge-cyan'}">
                    ${c.repeatStatus}
                  </span>
                </td>
                <td>
                  <span class="badge ${c.retentionRisk === 'HIGH' ? 'badge-rose' : c.retentionRisk === 'MEDIUM' ? 'badge-amber' : 'badge-emerald'}">
                    ${c.retentionRisk} RISK
                  </span>
                </td>
                <td>
                  <button class="btn-view-customer btn-futuristic-secondary" data-custid="${c.id}" style="font-size: 11px; padding: 4px 10px;">
                    👁️ Profile Drawer
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}
