// NOVA CART - Cancellation Intelligence Page (/cancellations)

export function renderCancellationIntelligencePage() {
  const cancellationReasons = [
    { title: "Product Unavailable / Out-of-Stock", pct: 42, count: 1780, severity: "CRITICAL", mainCause: "Ghost stock accepted by store POS. Item missing during packing.", action: "Implement real-time POS stock locking & instant substitution drawer." },
    { title: "Customer Cancelled Due to Delay (>35m)", pct: 31, count: 1310, severity: "HIGH", mainCause: "Delivery ETA exceeded 35 mins during peak evening window.", action: "Dynamic surge driver allocation + express priority queuing." },
    { title: "Store Rejected Order", pct: 14, count: 590, severity: "MEDIUM", mainCause: "Store busy during rush hours, auto-reject after 5 min timeout.", action: "Adjust auto-accept thresholds & partner dispatch timing." },
    { title: "Delivery Partner Unavailable", pct: 8, count: 340, severity: "MEDIUM", mainCause: "High driver demand in Koramangala & Bandra zones.", action: "Zone surge pay incentive for 18:00 - 21:00 peak hours." },
    { title: "Other Reasons", pct: 5, count: 210, severity: "LOW", mainCause: "Address discrepancy or payment processing failure.", action: "Automate address validation check at checkout." }
  ];

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <!-- Top KPIs -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div class="glass-card glow-rose" style="padding: 18px; border-color: rgba(244, 63, 94, 0.4);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-rose);">CANCELLATION RATE</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-rose); margin-top: 4px;">11%</div>
          <div style="font-size: 11px; color: var(--neon-rose);">⚠️ Doubled from 6% baseline</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">MONTHLY CANCELLED ORDERS</div>
          <div style="font-size: 28px; font-weight: 800; color: #fff; margin-top: 4px;">4,235 Orders</div>
          <div style="font-size: 11px; color: var(--text-muted);">Loss of ~₹20.5L revenue</div>
        </div>

        <div class="glass-card" style="padding: 18px; border-color: rgba(245, 158, 11, 0.3);">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-amber);">STOCKOUT CANCELLATIONS</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">42% Share</div>
          <div style="font-size: 11px; color: var(--neon-amber);">Largest cancellation driver</div>
        </div>

        <div class="glass-card" style="padding: 18px;">
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">DELAY CANCELLATIONS</div>
          <div style="font-size: 28px; font-weight: 800; color: var(--neon-cyan); margin-top: 4px;">31% Share</div>
          <div style="font-size: 11px; color: var(--neon-cyan);">Direct SLA breach correlation</div>
        </div>
      </div>

      <!-- Action & Explanation -->
      <div class="glass-panel glow-cyan" style="padding: 24px; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">AI Cancellation Cause Diagnosis</h3>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px; max-width: 600px;">
            "Product availability (42%) and delivery delay breaches (31%) account for 73% of total order cancellations across Nova Cart stores."
          </p>
        </div>

        <button id="btn-gen-cancel-plan" class="btn-futuristic glow-cyan" style="padding: 12px 24px;">
          ⚡ Generate AI Action Plan
        </button>
      </div>

      <!-- Cancellation Reasons Breakdown Grid -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Root Cause Breakdown & Recommended Actions</h3>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${cancellationReasons.map(r => `
            <div class="glass-card" style="padding: 20px; display: flex; flex-direction: column; gap: 10px; border-left: 4px solid ${r.severity === 'CRITICAL' ? 'var(--neon-rose)' : r.severity === 'HIGH' ? 'var(--neon-amber)' : 'var(--neon-cyan)'};">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span class="badge ${r.severity === 'CRITICAL' ? 'badge-rose' : r.severity === 'HIGH' ? 'badge-amber' : 'badge-cyan'}">${r.severity}</span>
                  <h4 style="font-size: 16px; font-weight: 700; color: #fff;">${r.title}</h4>
                </div>
                <div style="font-size: 16px; font-weight: 800; color: var(--neon-cyan); font-family: var(--font-mono);">
                  ${r.pct}% (${r.count} orders/mo)
                </div>
              </div>

              <div style="font-size: 13px; color: var(--text-muted);">
                <strong>Root Cause:</strong> ${r.mainCause}
              </div>

              <div style="font-size: 12px; padding: 10px 14px; background: rgba(0, 243, 255, 0.06); border-radius: 8px; border: 1px solid var(--border-cyan); color: var(--neon-cyan);">
                💡 <strong>Recommended Action:</strong> ${r.action}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}
