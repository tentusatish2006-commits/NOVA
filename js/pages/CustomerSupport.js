// NOVA CART - Customer Support Intelligence Page (/support)
import { db } from '../services/db.js';

export function renderCustomerSupportPage() {
  const tickets = db.getTickets();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top Support Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">MONTHLY SUPPORT SURGE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">5,900 / mo</div>
          <div style="font-size: 11px; color: var(--neon-rose);">⚠️ Surged +90% from 3,100/mo</div>
        </div>

        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.3);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">DELIVERY DELAY SHARE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">52% Share</div>
          <div style="font-size: 11px; color: var(--neon-amber);">3,068 tickets due to 37 min SLA breach</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AVG RESOLUTION TIME</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;">4.2 Hours</div>
          <div style="font-size: 11px; color: var(--neon-emerald);">Target < 2.0 Hours</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">AUTO-RESOLVED WITH AI</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-cyan); margin-top: 4px;">64.8%</div>
          <div style="font-size: 11px; color: var(--neon-cyan);">Using AI Support Workspace</div>
        </div>
      </div>

      <!-- Quick Action Bar -->
      <div class="glass-panel glow-cyan" style="padding: 18px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">AI Support Assistant Workspace</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
            Lookup Customer & Order ID to generate instant root cause synthesis and automated customer response.
          </p>
        </div>

        <a href="#/support/assistant" class="btn-futuristic glow-cyan" style="padding: 10px 22px;">
          🧠 Launch AI Support Assistant →
        </a>
      </div>

      <!-- Support Tickets Table -->
      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <table class="table-futuristic">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Order ID</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Summary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(t => `
              <tr>
                <td><strong style="color: var(--neon-cyan); font-family: var(--font-mono);">${t.id}</strong></td>
                <td>${t.customer}</td>
                <td><strong style="color: #fff; font-family: var(--font-mono);">${t.orderId}</strong></td>
                <td>${t.category}</td>
                <td>
                  <span class="badge ${t.priority === 'HIGH' ? 'badge-rose' : 'badge-amber'}">${t.priority}</span>
                </td>
                <td>
                  <span class="badge ${t.status === 'OPEN' ? 'badge-rose' : 'badge-emerald'}">${t.status}</span>
                </td>
                <td style="font-size: 12px; color: var(--text-muted); max-width: 260px;">${t.summary}</td>
                <td>
                  <a href="#/support/assistant?ticket=${t.id}" class="btn-futuristic-secondary" style="font-size: 11px; padding: 4px 10px; text-decoration: none;">
                    🧠 Resolve with AI
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}
