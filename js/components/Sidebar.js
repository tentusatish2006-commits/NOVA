// NOVA CART - Sidebar Navigation Component
import { db } from '../services/db.js';

export function renderSidebar(currentRoute) {
  const navGroups = [
    {
      title: "OVERVIEW",
      items: [
        { route: "/dashboard", label: "Executive Dashboard", icon: "📊" },
        { route: "/diagnosis", label: "Business Diagnosis", icon: "🩺" },
        { route: "/ai-analyst", label: "AI Business Analyst", icon: "🤖" }
      ]
    },
    {
      title: "CUSTOMERS",
      items: [
        { route: "/customers", label: "Customer Intelligence", icon: "👥" },
        { route: "/retention", label: "Retention Intelligence", icon: "🔄" },
        { route: "/support", label: "Customer Support", icon: "🎧" }
      ]
    },
    {
      title: "STORES",
      items: [
        { route: "/stores", label: "Store Intelligence", icon: "🏪" },
        { route: "/inventory", label: "Inventory Intelligence", icon: "📦" }
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { route: "/delivery", label: "Delivery Operations", icon: "🛵" },
        { route: "/live-map", label: "Live Delivery Map", icon: "🗺️" },
        { route: "/delivery-prediction", label: "AI Delivery Prediction", icon: "⏱️" },
        { route: "/cancellations", label: "Cancellation Intelligence", icon: "❌" }
      ]
    },
    {
      title: "MARKETING",
      items: [
        { route: "/marketing", label: "Marketing Intelligence", icon: "📢" },
        { route: "/coupons", label: "Coupon Analytics", icon: "🏷️" }
      ]
    },
    {
      title: "AI CENTER",
      items: [
        { route: "/recommendations", label: "AI Recommendations", icon: "💡" },
        { route: "/support/assistant", label: "AI Support Assistant", icon: "🧠" },
        { route: "/alerts", label: "Alerts", icon: "🚨", badge: db.getAlerts().filter(a => a.status === 'UNACKNOWLEDGED').length }
      ]
    },
    {
      title: "IMPACT",
      items: [
        { route: "/impact", label: "Financial Impact", icon: "📈" },
        { route: "/simulator", label: "Business Simulator", icon: "⚡" }
      ]
    },
    {
      title: "ANALYTICS",
      items: [
        { route: "/analytics", label: "Analytics", icon: "📉" }
      ]
    }
  ];

  return `
    <aside class="sidebar glass-panel" style="width: 260px; height: 100vh; flex-shrink: 0; padding: 20px 14px; display: flex; flex-direction: column; gap: 16px; border-radius: 0; border-right: 1px solid rgba(255,255,255,0.08); overflow: hidden; position: sticky; top: 0;">
      <!-- Brand Logo -->
      <div style="display: flex; align-items: center; gap: 12px; padding: 6px 10px; margin-bottom: 10px;">
        <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #00f3ff, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; color: #000; box-shadow: 0 0 15px rgba(0, 243, 255, 0.5);">
          N
        </div>
        <div>
          <div style="font-weight: 800; font-size: 16px; tracking-wide; letter-spacing: 1px;" class="gradient-text-cyan">NOVA CART</div>
          <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); letter-spacing: 0.5px;">COMMAND CENTER</div>
        </div>
      </div>

      <!-- Navigation Groups -->
      <nav style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px; padding-right: 4px;">
        ${navGroups.map(group => `
          <div>
            <div style="font-size: 10px; font-weight: 700; color: var(--text-dim); letter-spacing: 1px; margin-bottom: 6px; padding-left: 10px;">
              ${group.title}
            </div>
            <div style="display: flex; flex-direction: column; gap: 2px;">
              ${group.items.map(item => {
                const isActive = currentRoute === item.route;
                return `
                  <a href="#${item.route}" 
                     class="nav-item ${isActive ? 'active' : ''}" 
                     style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 500; color: ${isActive ? 'var(--neon-cyan)' : 'var(--text-muted)'}; background: ${isActive ? 'rgba(0, 243, 255, 0.1)' : 'transparent'}; border: 1px solid ${isActive ? 'rgba(0, 243, 255, 0.3)' : 'transparent'}; transition: all 0.2s ease;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span>${item.icon}</span>
                      <span>${item.label}</span>
                    </div>
                    ${item.badge ? `<span class="badge badge-rose" style="font-size: 10px; padding: 1px 6px;">${item.badge}</span>` : ''}
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </nav>

      <!-- Quick Demo Tools -->
      <div style="padding: 10px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 8px;">
        <button id="btn-reset-demo" class="btn-futuristic-secondary" style="width: 100%; font-size: 12px; padding: 8px; justify-content: center;">
          ⚡ Reset Demo Data
        </button>
      </div>
    </aside>
  `;
}
