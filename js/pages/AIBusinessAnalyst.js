// NOVA CART - AI Business Analyst Page (/ai-analyst)
import { aiEngine } from '../services/aiEngine.js';

export function renderAIBusinessAnalystPage() {
  const presetQuestions = [
    "Why is retention falling?",
    "Why are cancellations increasing?",
    "Why are support tickets increasing?",
    "What is causing delivery delays?",
    "Which business problem should we investigate?",
    "How can we improve repeat purchases?",
    "Where are stores struggling?"
  ];

  return `
    <div style="display: grid; grid-template-columns: 340px 1fr; gap: 24px; padding-bottom: 40px;">
      
      <!-- Left Column: Business Telemetry Context -->
      <div class="glass-panel" style="padding: 22px; display: flex; flex-direction: column; gap: 18px;">
        <div>
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan);">LIVE TELEMETRY CONTEXT</div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff; margin-top: 2px;">Active Case Signals</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Registered Users</span>
            <strong style="color: #fff;">120,000</strong>
          </div>
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Monthly Orders</span>
            <strong style="color: #fff;">38,500</strong>
          </div>
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Repeat Rate</span>
            <strong style="color: var(--neon-rose);">27% (41% → 27%)</strong>
          </div>
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Avg Delivery Time</span>
            <strong style="color: var(--neon-amber);">37 min (29 → 37)</strong>
          </div>
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Cancellation Rate</span>
            <strong style="color: var(--neon-amber);">11% (6% → 11%)</strong>
          </div>
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Support Tickets</span>
            <strong style="color: var(--neon-rose);">5,900 / mo</strong>
          </div>
          <div class="glass-card" style="padding: 10px 12px; display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Promo Spend</span>
            <strong style="color: var(--neon-violet);">₹17L / mo</strong>
          </div>
        </div>

        <div style="font-size: 11px; color: var(--text-dim); padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
          🤖 AI Mode: <span style="color: var(--neon-emerald); font-weight: 600;">Active (Hybrid LLM / Rules Engine)</span>
        </div>
      </div>

      <!-- Right Column: Interactive AI Holographic Workspace -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Top Holographic AI Orb Panel -->
        <div class="glass-panel glow-cyan" style="padding: 28px; text-align: center; position: relative; overflow: hidden;">
          <div class="ai-orb" style="margin-bottom: 16px;"></div>
          <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Nova Business Analyst AI</h2>
          <p style="font-size: 13px; color: var(--text-muted); max-width: 500px; margin: 4px auto 0 auto;">
            Ask complex business, operational, customer, or financial questions. Our engine synthesizes multi-dimensional signals into evidence-backed decisions.
          </p>
        </div>

        <!-- Pre-built Questions Bar -->
        <div>
          <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 8px;">
            HIGH-LEVERAGE RESCUE QUESTIONS
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${presetQuestions.map(q => `
              <button class="btn-preset-query btn-futuristic-secondary" data-question="${q}" style="font-size: 12px; padding: 6px 12px;">
                💬 ${q}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Input Query Box -->
        <form id="ai-analyst-form" style="display: flex; gap: 12px;">
          <input type="text" id="ai-query-input" placeholder="Type your business question..." class="input-futuristic" style="flex: 1; padding: 14px; font-size: 14px;" required>
          <button type="submit" class="btn-futuristic glow-cyan" style="padding: 0 28px; font-size: 14px;">
            Ask AI →
          </button>
        </form>

        <!-- AI Output Response Container -->
        <div id="ai-response-container" class="glass-panel" style="padding: 24px; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
          <div style="text-align: center; color: var(--text-dim); font-size: 14px;">
            Select a question above or type a custom prompt to generate an AI Business Analysis.
          </div>
        </div>

      </div>

    </div>
  `;
}
