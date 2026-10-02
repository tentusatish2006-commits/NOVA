// NOVA CART - AI Recommendations Center (/recommendations)
import { db } from '../services/db.js';

export function renderAIRecommendationsPage() {
  const recommendations = db.getRecommendations();

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      
      <div>
        <h2 style="font-size: 20px; font-weight: 700; color: #fff;">AI Business Rescue Recommendations Center</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
          Enforces the core rescue pipeline: EVIDENCE → INSIGHT → PROBLEM → AI ANALYSIS → RECOMMENDATION → ACTION → BUSINESS IMPACT
        </p>
      </div>

      <!-- Recommendation Cards List -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${recommendations.map(rec => `
          <div class="glass-panel glow-cyan" style="padding: 24px; display: flex; flex-direction: column; gap: 16px; border-left: 6px solid ${rec.severity === 'CRITICAL' ? 'var(--neon-rose)' : 'var(--neon-amber)'};">
            
            <!-- Header -->
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="badge ${rec.severity === 'CRITICAL' ? 'badge-rose' : 'badge-amber'}">${rec.severity} SEVERITY</span>
                <span style="font-size: 12px; font-family: var(--font-mono); color: var(--text-dim);">${rec.id}</span>
                <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${rec.title}</h3>
              </div>
              
              <span id="status-badge-${rec.id}" class="badge badge-cyan" style="font-size: 12px; padding: 4px 12px;">
                STATUS: ${rec.status}
              </span>
            </div>

            <!-- Problem & Evidence -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 13px;">
              <div class="glass-card" style="padding: 14px; border-color: rgba(244, 63, 94, 0.2);">
                <div style="color: var(--neon-rose); font-weight: 700; margin-bottom: 4px;">⚠️ OBSERVED PROBLEM</div>
                <div style="color: var(--text-muted);">${rec.problem}</div>
              </div>

              <div class="glass-card" style="padding: 14px; border-color: rgba(0, 243, 255, 0.2);">
                <div style="color: var(--neon-cyan); font-weight: 700; margin-bottom: 4px;">📊 SUPPORTING EVIDENCE</div>
                <div style="color: var(--text-muted);">${rec.evidence}</div>
              </div>
            </div>

            <!-- Recommendation Body -->
            <div class="glass-card" style="padding: 16px; background: rgba(0, 243, 255, 0.04); border-color: var(--border-cyan);">
              <div style="color: var(--neon-cyan); font-weight: 700; margin-bottom: 6px;">💡 AI RECOMMENDATION & ACTION</div>
              <div style="font-size: 14px; color: #fff; line-height: 1.5; font-weight: 500;">${rec.recommendation}</div>
            </div>

            <!-- Target Impact & Assumptions -->
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--text-muted); padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
              <div>🎯 <strong>Target Business Impact:</strong> <span style="color: var(--neon-emerald); font-weight: 700;">${rec.expectedMetric}</span></div>
              <div>📐 <strong>Underlying Assumption:</strong> ${rec.assumptions}</div>
            </div>

            <!-- Interactive Action Buttons -->
            <div style="display: flex; align-items: center; gap: 10px; padding-top: 6px;">
              <button class="btn-rec-action btn-futuristic glow-cyan" data-id="${rec.id}" data-action="ACCEPTED" style="font-size: 12px; padding: 8px 16px;">
                ✅ Accept & Execute Action
              </button>
              <button class="btn-rec-action btn-futuristic-secondary" data-id="${rec.id}" data-action="IN_PROGRESS" style="font-size: 12px; padding: 8px 16px;">
                🔄 Assign to Ops Team
              </button>
              <button class="btn-rec-action btn-futuristic-secondary" data-id="${rec.id}" data-action="COMPLETED" style="font-size: 12px; padding: 8px 16px;">
                🎉 Mark as Completed
              </button>
              <button class="btn-rec-action btn-futuristic-secondary btn-danger" data-id="${rec.id}" data-action="REJECTED" style="font-size: 12px; padding: 8px 16px;">
                ❌ Reject Recommendation
              </button>
            </div>

          </div>
        `).join('')}
      </div>

    </div>
  `;
}
