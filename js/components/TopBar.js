// NOVA CART - Top Header Component (TopBar)
import { db } from '../services/db.js';

export function renderHeader(currentRoute, currentUser, onRoleChange, onLogout) {
  const user = currentUser || { name: 'Dr. Satish Kumar', email: 'satish@novacart.in', role: 'CEO' };
  const route = currentRoute || '/dashboard';

  const routeNames = {
    "/dashboard": "Executive Command Center",
    "/diagnosis": "Business Diagnosis",
    "/ai-analyst": "AI Business Analyst",
    "/customers": "Customer Intelligence",
    "/retention": "Retention Intelligence",
    "/support": "Customer Support",
    "/stores": "Store Intelligence",
    "/inventory": "Inventory Intelligence",
    "/delivery": "Delivery Operations",
    "/live-map": "Live Delivery Map",
    "/delivery-prediction": "AI Delivery Prediction",
    "/cancellations": "Cancellation Intelligence",
    "/marketing": "Marketing Intelligence",
    "/coupons": "Coupon Analytics",
    "/recommendations": "AI Recommendations Center",
    "/support/assistant": "AI Support Assistant",
    "/alerts": "Real-time Alerts Center",
    "/impact": "Financial Impact Dashboard",
    "/simulator": "What-If Business Simulator",
    "/analytics": "Advanced Analytics"
  };

  const title = routeNames[route] || 'Command Center';
  let unacknowledgedAlerts = 0;
  try { unacknowledgedAlerts = db.getAlerts().filter(a => a.status === 'UNACKNOWLEDGED').length; } catch (e) {}

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
        <select id="role-selector" class="input-futuristic" style="width: auto; padding: 6px 12px; font-size: 12px; height: 36px; cursor: pointer;">
          <option value="CEO" ${user.role === 'CEO' ? 'selected' : ''}>Role: CEO</option>
          <option value="Operations Manager" ${user.role === 'Operations Manager' ? 'selected' : ''}>Role: Operations Mgr</option>
          <option value="Marketing Manager" ${user.role === 'Marketing Manager' ? 'selected' : ''}>Role: Marketing Mgr</option>
          <option value="Store Manager" ${user.role === 'Store Manager' ? 'selected' : ''}>Role: Store Mgr</option>
          <option value="Analyst" ${user.role === 'Analyst' ? 'selected' : ''}>Role: Analyst</option>
          <option value="Admin" ${user.role === 'Admin' ? 'selected' : ''}>Role: Admin</option>
        </select>
        <a href="#/alerts" class="glass-card" style="padding: 8px 12px; display: flex; align-items: center; gap: 6px; text-decoration: none;">
          <span style="font-size: 16px;">🔔</span>
          ${unacknowledgedAlerts > 0 ? `<span class="badge badge-rose" style="font-size: 10px; padding: 1px 6px;">${unacknowledgedAlerts}</span>` : ''}
        </a>
        <div style="display: flex; align-items: center; gap: 10px; padding-left: 10px; border-left: 1px solid rgba(255,255,255,0.1);">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #fff;">${(user.name || 'N').charAt(0)}</div>
          <div style="display: flex; flex-direction: column;">
            <span style="font-size: 13px; font-weight: 600; color: #fff;">${user.name || 'User'}</span>
            <span style="font-size: 10px; color: var(--text-muted);">${user.role || 'CEO'}</span>
          </div>
          <button id="btn-logout" title="Logout" style="background: transparent; border: none; color: var(--text-dim); cursor: pointer; font-size: 16px;">🚪</button>
        </div>
      </div>
    </header>
  `;
}
