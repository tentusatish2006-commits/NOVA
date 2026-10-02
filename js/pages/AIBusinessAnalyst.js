// NOVA CART - AI Business Analyst with working Ask AI
import { aiEngine } from '../services/aiEngine.js';

const presetQuestions = [
  'Why did repeat purchase rate drop from 41% to 27%?',
  'What is driving the cancellation rate increase?',
  'Which cities have the worst delivery SLA?',
  'Where should we reallocate marketing budget?',
  'What is the highest-ROI rescue action this month?',
];

export function renderAIBusinessAnalystPage() {
  return `
    <div style="display: flex; flex-direction: column; gap: 20px; padding-bottom: 40px; max-width: 960px;">
      <div class="glass-panel glow-cyan" style="padding: 28px; text-align: center;">
        <div class="ai-orb" style="margin-bottom: 16px;"></div>
        <h2 style="font-size: 22px; font-weight: 800; color: #fff;">Nova Business Analyst AI</h2>
        <p style="font-size: 13px; color: var(--text-muted); max-width: 500px; margin: 4px auto 0 auto;">
          Ask complex business, operational, customer, or financial questions.
        </p>
      </div>

      <div>
        <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-dim); margin-bottom: 8px;">HIGH-LEVERAGE RESCUE QUESTIONS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${presetQuestions
            .map(
              (q) =>
                `<button type="button" class="btn-preset-query btn-futuristic-secondary" data-question="${q.replace(/"/g, '&quot;')}" style="font-size: 12px; padding: 6px 12px; cursor: pointer;">💬 ${q}</button>`
            )
            .join('')}
        </div>
      </div>

      <form id="ai-analyst-form" style="display: flex; gap: 12px; flex-wrap: wrap;">
        <input type="text" id="ai-query-input" placeholder="Type your business question..." class="input-futuristic" style="flex: 1; min-width: 220px; padding: 14px; font-size: 14px;" required>
        <button type="submit" id="btn-ask-ai" class="btn-futuristic glow-cyan" style="padding: 0 28px; font-size: 14px; height: 48px; cursor: pointer;">Ask AI →</button>
      </form>

      <div id="ai-response-container" class="glass-panel" style="padding: 24px; min-height: 200px;">
        <div style="text-align: center; color: var(--text-dim); font-size: 14px;">
          Select a question above or type a custom prompt to generate an AI Business Analysis.
        </div>
      </div>
    </div>
  `;
}

export async function runAIQuery(question) {
  const box = document.getElementById('ai-response-container');
  if (!box) return;
  const q = (question || '').trim();
  if (!q) {
    box.innerHTML = '<div style="color:#f87171;">Please enter a question.</div>';
    return;
  }
  box.innerHTML = '<div style="color:var(--neon-cyan);font-family:var(--font-mono);font-size:13px;">Analyzing signals…</div>';
  try {
    const result = await aiEngine.processQuery(q);
    const answer = result.answer || result.insight || result.summary || String(result);
    const evidence = result.evidence || result.sources || '';
    const conf = result.confidence || '';
    box.innerHTML = `
      <div style="font-size:11px;font-family:var(--font-mono);color:var(--text-dim);margin-bottom:8px;">QUESTION</div>
      <div style="font-size:14px;color:#fff;font-weight:600;margin-bottom:16px;">${q}</div>
      <div style="font-size:11px;font-family:var(--font-mono);color:var(--neon-cyan);margin-bottom:8px;">AI ANSWER</div>
      <p style="font-size:14px;color:var(--text-muted);line-height:1.65;">${answer}</p>
      ${evidence ? `<div class="glass-card" style="padding:12px;margin-top:14px;font-size:12px;color:var(--text-dim);">${evidence}</div>` : ''}
      ${conf ? `<div style="margin-top:10px;font-size:11px;color:var(--text-dim);">Confidence: ${conf}</div>` : ''}
    `;
  } catch (e) {
    box.innerHTML = '<div style="color:#f87171;">AI error: ' + e.message + '</div>';
  }
}
