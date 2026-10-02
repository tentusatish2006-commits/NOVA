// NOVA CART - Sidebar Navigation (no live map)
export function renderSidebar(currentRoute = '/dashboard') {
  const sections = [
    {
      title: 'OVERVIEW',
      items: [
        { route: '/dashboard', label: 'Executive Dashboard', icon: '📊' },
        { route: '/diagnosis', label: 'Business Diagnosis', icon: '🩺' },
        { route: '/ai-analyst', label: 'AI Business Analyst', icon: '🤖' },
      ],
    },
    {
      title: 'CUSTOMERS',
      items: [
        { route: '/customers', label: 'Customer Intelligence', icon: '👥' },
        { route: '/retention', label: 'Retention Intelligence', icon: '🔄' },
        { route: '/support', label: 'Customer Support', icon: '🎧' },
        { route: '/support/assistant', label: 'AI Support Assistant', icon: '💬' },
      ],
    },
    {
      title: 'STORES',
      items: [
        { route: '/stores', label: 'Store Intelligence', icon: '🏪' },
        { route: '/inventory', label: 'Inventory Intelligence', icon: '📦' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { route: '/delivery', label: 'Delivery Operations', icon: '🛵' },
        { route: '/delivery-prediction', label: 'AI Delivery Prediction', icon: '⏱️' },
        { route: '/cancellations', label: 'Cancellation Intelligence', icon: '❌' },
      ],
    },
    {
      title: 'MARKETING',
      items: [
        { route: '/marketing', label: 'Marketing Intelligence', icon: '📢' },
        { route: '/coupons', label: 'Coupon Analytics', icon: '🎟️' },
      ],
    },
    {
      title: 'AI CENTER',
      items: [
        { route: '/recommendations', label: 'AI Recommendations', icon: '💡' },
        { route: '/impact', label: 'Financial Impact', icon: '💰' },
        { route: '/simulator', label: 'Business Simulator', icon: '🧪' },
        { route: '/analytics', label: 'Advanced Analytics', icon: '📈' },
        { route: '/alerts', label: 'Alerts Center', icon: '🔔' },
      ],
    },
  ];

  return `
    <aside class="sidebar glass-panel" style="width: 260px; flex-shrink: 0; height: 100vh; overflow-y: auto; border-radius: 0; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column;">
      <div style="padding: 20px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 12px;">
        <div style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #00f3ff, #8b5cf6); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #000;">N</div>
        <div>
          <div style="font-weight: 800; font-size: 14px; letter-spacing: 1px;" class="gradient-text-cyan">NOVA CART</div>
          <div style="font-size: 10px; color: var(--text-dim); font-family: var(--font-mono);">COMMAND CENTER</div>
        </div>
      </div>
      <nav style="flex: 1; padding: 12px 10px;">
        ${sections.map(sec => `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim); letter-spacing: 1px; padding: 6px 10px;">${sec.title}</div>
            ${sec.items.map(item => {
              const active = currentRoute === item.route || (item.route !== '/dashboard' && currentRoute.startsWith(item.route));
              return `<a href="#${item.route}" data-nav="#${item.route}" class="nav-item ${active ? 'active' : ''}" style="display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px; text-decoration: none; color: ${active ? '#fff' : 'var(--text-muted)'}; background: ${active ? 'rgba(0,243,255,0.12)' : 'transparent'}; border-left: 3px solid ${active ? 'var(--neon-cyan)' : 'transparent'}; font-size: 13px; margin-bottom: 2px;">
                <span>${item.icon}</span><span>${item.label}</span>
              </a>`;
            }).join('')}
          </div>
        `).join('')}
      </nav>
    </aside>
  `;
}
