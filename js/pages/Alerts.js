// NOVA CART - Real-Time Alerts Center Page (/alerts)
import { db } from '../services/db.js';

export function renderAlertsPage() {
  const alerts = db.getAlerts();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Real-Time Operational Alerts Center</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Live telemetry exception alerts monitoring delivery SLA breaches, store stockouts, and customer support spikes.
        </p>
      </div>

      <!-- Alerts List -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${alerts.map(alt => `
          <div class="glass-card" style="padding: 18px; display: flex; align-items: center; justify-content: space-between; gap: 20px; border-left: 4px solid ${alt.severity === 'CRITICAL' ? 'var(--neon-rose)' : 'var(--neon-amber)'};">
            <div style="display: flex; align-items: flex-start; gap: 14px;">
              <div style="font-size: 24px; padding: 8px; background: rgba(255,255,255,0.04); border-radius: 10px;">
                ${alt.category === 'Delivery' ? '🛵' : alt.category === 'Store' ? '🏪' : '📦'}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="badge ${alt.severity === 'CRITICAL' ? 'badge-rose' : 'badge-amber'}">${alt.severity}</span>
                  <span class="badge badge-cyan">${alt.category}</span>
                  <strong style="color: #fff; font-size: 15px;">${alt.title}</strong>
                </div>
                <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${alt.description}</p>
                <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px; font-family: var(--font-mono);">Timestamp: ${alt.timestamp}</div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="badge ${alt.status === 'UNACKNOWLEDGED' ? 'badge-rose' : 'badge-emerald'}">
                ${alt.status}
              </span>
              ${alt.status === 'UNACKNOWLEDGED' ? `
                <button class="btn-ack-alert btn-futuristic glow-cyan" data-altid="${alt.id}" style="font-size: 11px; padding: 6px 14px;">
                  Acknowledge & Assign
                </button>
              ` : `
                <button disabled class="btn-futuristic-secondary" style="font-size: 11px; padding: 6px 14px; opacity: 0.5;">
                  ✓ Acknowledged
                </button>
              `}
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}
