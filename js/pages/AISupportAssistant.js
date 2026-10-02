// NOVA CART - AI Support Assistant Workspace
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderAISupportAssistantPage() {
  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">AI Support Resolution Workspace</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Lookup customer order telemetry to synthesize root cause, generate policy-compliant response, and update ticket state.
        </p>
      </div>

      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px;">1. Telemetry Ticket Lookup</h3>
        <form id="support-lookup-form" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 14px; align-items: end;">
          <div>
            <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Customer Name or ID</label>
            <input type="text" id="supp-cust-input" value="Aarav Sharma" class="input-futuristic" required>
          </div>
          <div>
            <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Order ID</label>
            <input type="text" id="supp-order-input" value="ORD-8821" class="input-futuristic" required>
          </div>
          <button type="submit" id="btn-support-synthesize" class="btn-futuristic glow-cyan" style="padding: 10px 24px; cursor: pointer;">
            🔍 Retrieve & Synthesize
          </button>
        </form>
      </div>

      <div id="support-workspace-result" class="glass-panel" style="padding: 24px; min-height: 280px;">
        <div style="text-align: center; color: var(--text-dim); padding-top: 40px;">
          Click "Retrieve & Synthesize" to run AI customer support resolution.
        </div>
      </div>
    </div>
  `;
}

export async function runSupportSynthesis(customerName, orderId) {
  const box = document.getElementById('support-workspace-result');
  if (!box) return;
  box.innerHTML = '<div style="color:var(--neon-cyan);font-family:var(--font-mono);font-size:13px;">Retrieving telemetry & synthesizing…</div>';
  try {
    const ticket = { id: 'TKT-' + Date.now(), subject: 'Delivery delay / order issue', status: 'OPEN', category: 'Delivery', orderId: orderId || 'ORD-0000' };
    const customer = { name: customerName || 'Customer', deliveryComplaints: 2, totalSpend: 4200 };
    const order = { id: orderId || 'ORD-0000', store: 'Green Leaf Mart', distanceKm: 2.4, status: 'DELAYED' };
    const result = await aiEngine.generateSupportResolution(ticket, customer, order);
    box.innerHTML = `
      <h3 style="font-size:16px;font-weight:700;color:#fff;margin-bottom:14px;">AI Support Synthesis</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;">
        <div class="glass-card" style="padding:16px;">
          <div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);">CUSTOMER</div>
          <div style="font-size:15px;font-weight:700;color:#fff;margin-top:4px;">${customer.name}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Order: ${order.id}</div>
        </div>
        <div class="glass-card" style="padding:16px;">
          <div style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono);">ROOT CAUSE</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:6px;line-height:1.5;">${result.likelyCause || 'Delivery SLA breach'}</div>
        </div>
      </div>
      <div class="glass-card" style="padding:16px;margin-top:14px;">
        <div style="font-size:11px;color:var(--neon-cyan);font-family:var(--font-mono);margin-bottom:8px;">SUGGESTED CUSTOMER RESPONSE</div>
        <p style="font-size:14px;color:var(--text-muted);line-height:1.65;">${result.suggestedResponseText || ''}</p>
      </div>
      ${result.recommendedResolution ? `<div class="glass-card" style="padding:12px;margin-top:12px;font-size:13px;color:var(--text-muted);"><b style="color:#fff;">Resolution</b><br>${result.recommendedResolution}</div>` : ''}
    `;
  } catch (e) {
    box.innerHTML = '<div style="color:#f87171;">Synthesis failed: ' + e.message + '</div>';
  }
}
