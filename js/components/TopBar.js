// NOVA CART - Top Header — shows real logged-in user only
import { db } from '../services/db.js';

export function renderHeader(currentRoute, currentUser, onRoleChange, onLogout) {
  const user = currentUser || {};
  const displayName = user.name || user.email || 'Guest';
  const displayRole = user.role || 'User';
  const initial = (displayName.trim().charAt(0) || '?').toUpperCase();
  const route = currentRoute || '/dashboard';

  const routeNames = {
    '/dashboard': 'Executive Command Center',
    '/diagnosis': 'Business Diagnosis',
    '/ai-analyst': 'AI Business Analyst',
    '/customers': 'Customer Intelligence',
    '/retention': 'Retention Intelligence',
    '/support': 'Customer Support',
    '/stores': 'Store Intelligence',
    '/inventory': 'Inventory Intelligence',
    '/delivery': 'Delivery Operations',
    '/live-map': 'Live Delivery Map',
    '/delivery-prediction': 'AI Delivery Prediction',
    '/cancellations': 'Cancellation Intelligence',
    '/marketing': 'Marketing Intelligence',
    '/coupons': 'Coupon Analytics',
    '/recommendations': 'AI Recommendations Center',
    '/support/assistant': 'AI Support Assistant',
    '/alerts': 'Real-time Alerts Center',
    '/impact': 'Financial Impact Dashboard',
    '/simulator': 'What-If Business Simulator',
    '/analytics': 'Advanced Analytics',
  };

  const title = routeNames[route] || 'Command Center';
  let unacknowledgedAlerts = 0;
  try {
    unacknowledgedAlerts = db.getAlerts().filter((a) => a.status === 'UNACKNOWLEDGED').length;
  } catch (e) {}

  return `
    <header class="header glass-panel" style="padding: 14px 24px; border-radius: 0; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; gap: 20px;">
      <div>
        <div style="font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 6px; font-family: var(--font-mono);">
          <span>NOVA CART</span><span>/</span><span style="color: var(--neon-cyan);">${title}</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 700; color: #fff; margin-top: 2px;">${title}</h1>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="position: relative; width: 220px;">
          <input type="text" id="global-search" placeholder="Search orders, stores, customers..." class="input-futuristic" style="padding-left: 32px; font-size: 12px; height: 36px;">
          <span style="position: absolute; left: 10px; top: 9px; font-size: 14px; opacity: 0.5;">🔍</span>
        </div>
        <select id="role-selector" class="input-futuristic" style="width: auto; min-width: 140px; height: 36px; font-size: 12px;">
          ${['CEO', 'Operations Manager', 'Marketing Manager', 'Store Manager', 'Analyst', 'Admin']
            .map((r) => `<option value="${r}" ${displayRole === r ? 'selected' : ''}>Role: ${r}</option>`)
            .join('')}
        </select>
        <button id="btn-download-pdf" class="btn-futuristic-secondary" title="Download PDF report" style="font-size: 12px; padding: 8px 14px; height: 36px;">📄 PDF</button>
        <a href="#/alerts" data-nav="#/alerts" style="position: relative; text-decoration: none; color: inherit;">
          <span style="font-size: 18px;">🔔</span>
          ${unacknowledgedAlerts > 0 ? `<span style="position:absolute;top:-4px;right:-6px;background:#f43f5e;color:#fff;font-size:10px;border-radius:999px;padding:1px 5px;">${unacknowledgedAlerts}</span>` : ''}
        </a>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #00f3ff, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000;">${initial}</div>
          <div style="line-height: 1.2;">
            <div style="font-size: 13px; font-weight: 600; color: #fff;">${displayName}</div>
            <div style="font-size: 11px; color: var(--text-dim);">${displayRole}</div>
          </div>
          <button id="btn-logout" title="Logout" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer; font-size: 16px;">🚪</button>
        </div>
      </div>
    </header>
  `;
}
