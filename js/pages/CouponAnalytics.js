// NOVA CART - Coupon Analytics Page (/coupons)
import { db } from '../services/db.js';

export function renderCouponAnalyticsPage() {
  const coupons = db.getCoupons();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Highlight Banner -->
      <div class="glass-panel glow-rose" style="padding: 24px; border-color: rgba(244, 63, 94, 0.4); background: rgba(244, 63, 94, 0.05);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <span class="badge badge-rose" style="font-size: 11px; font-family: var(--font-mono); margin-bottom: 6px;">CASE SIGNAL ALERT</span>
            <h2 style="font-size: 22px; font-weight: 800; color: #fff;">44% of Promotional Coupons are Never Redeemed</h2>
            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
              Promotional spend inflated from ₹9.5L to ₹17L/month without improving customer retention (27%). Broad discount broadcast generates waste.
            </p>
          </div>

          <div style="font-size: 36px; font-weight: 800; color: var(--neon-rose); font-family: var(--font-mono);">
            44% UNUSED
          </div>
        </div>
      </div>

      <!-- Coupon Table -->
      <div class="glass-panel" style="padding: 0; overflow: hidden;">
        <table class="table-futuristic">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount Type</th>
              <th>Issued</th>
              <th>Redeemed</th>
              <th>Unused Rate</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>AI Strategic Action</th>
            </tr>
          </thead>
          <tbody>
            ${coupons.map(c => `
              <tr>
                <td><strong style="color: var(--neon-cyan); font-family: var(--font-mono);">${c.code}</strong></td>
                <td>${c.discount}</td>
                <td>${c.issued.toLocaleString()}</td>
                <td><strong style="color: var(--neon-emerald);">${c.redeemed.toLocaleString()}</strong></td>
                <td><strong style="color: var(--neon-rose);">${c.unusedRate}</strong></td>
                <td>₹${c.cost.toLocaleString()}</td>
                <td>
                  <span class="badge ${c.status === 'Underperforming' ? 'badge-rose' : 'badge-emerald'}">
                    ${c.status}
                  </span>
                </td>
                <td style="font-size: 12px; color: var(--text-muted); max-width: 320px;">
                  ${c.recommendation}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}
