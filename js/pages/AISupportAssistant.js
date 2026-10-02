// NOVA CART - AI Support Assistant Workspace (/support/assistant)
import { db } from '../services/db.js';
import { aiEngine } from '../services/aiEngine.js';

export function renderAISupportAssistantPage() {
  const tickets = db.getTickets();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">AI Support Resolution Workspace</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Lookup customer order telemetry to synthesize root cause, generate policy-compliant response, and update ticket state.
        </p>
      </div>

      <!-- Search & Lookup Panel -->
      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px;">1. Telemetry Ticket Lookup</h3>

        <form id="support-lookup-form" style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 14px;">
          <div>
            <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Customer Name or ID</label>
            <input type="text" id="supp-cust-input" value="Aarav Sharma" class="input-futuristic" required>
          </div>

          <div>
            <label style="font-size: 11px; font-weight: 600; color: var(--text-muted); display: block; margin-bottom: 4px;">Order ID</label>
            <input type="text" id="supp-order-input" value="ORD-8821" class="input-futuristic" required>
          </div>

          <div style="display: flex; align-items: flex-end;">
            <button type="submit" class="btn-futuristic glow-cyan" style="padding: 10px 24px;">
              🔍 Retrieve & Synthesize
            </button>
          </div>
        </form>
      </div>

      <!-- Synthesized Ticket Workspace Result -->
      <div id="support-workspace-result" class="glass-panel" style="padding: 24px; min-height: 280px;">
        <!-- Rendered dynamically -->
        <div style="text-align: center; color: var(--text-dim); padding-top: 40px;">
          Click "Retrieve & Synthesize" to run AI customer support resolution.
        </div>
      </div>

    </div>
  `;
}
