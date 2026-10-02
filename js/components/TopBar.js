// NOVA CART - Top Bar / Header
export function renderHeader(currentRoute = '/dashboard', user = {}) {
  const titles = {
    '/dashboard': 'Executive Dashboard',
    '/executive': 'Executive Dashboard',
    '/diagnosis': 'Business Diagnosis',
    '/ai-analyst': 'AI Business Analyst',
    '/customers': 'Customer Intelligence',
    '/retention': 'Retention Intelligence',
    '/support': 'Customer Support',
    '/support/assistant': 'AI Support Assistant',
    '/ai-support': 'AI Support Assistant',
    '/stores': 'Store Intelligence',
    '/inventory': 'Inventory Intelligence',
    '/delivery': 'Delivery Operations',
    '/delivery-prediction': 'AI Delivery Prediction',
    '/ai-delivery': 'AI Delivery Prediction',
    '/cancellations': 'Cancellation Intelligence',
    '/marketing': 'Marketing Intelligence',
    '/coupons': 'Coupon Analytics',
    '/recommendations': 'AI Recommendations',
    '/impact': 'Financial Impact',
    '/financial': 'Financial Impact',
    '/simulator': 'Business Simulator',
    '/analytics': 'Advanced Analytics',
    '/alerts': 'Alerts Center',
  };

  const title = titles[currentRoute] || 'Command Center';
  const name = (user && user.name) ? user.name : '';
  const role = (user && user.role) ? user.role : '';

  return `
    <header style="display:flex;align-items:center;justify-content:space-between;padding:14px 24px;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(8,12,22,0.85);backdrop-filter:blur(12px);flex-shrink:0;gap:12px;flex-wrap:wrap;">
      <div>
        <div style="font-size:11px;font-family:var(--font-mono);color:var(--text-dim);letter-spacing:1px;">NOVA CART</div>
        <h1 style="font-size:18px;font-weight:700;color:#fff;margin:2px 0 0;">${title}</h1>
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        ${name ? `<div style="text-align:right;"><div style="font-size:13px;font-weight:600;color:#fff;">${name}</div><div style="font-size:11px;color:var(--text-dim);">${role}</div></div>` : ''}
        <button type="button" id="btn-download-pdf" class="btn-futuristic-secondary" style="padding:8px 14px;font-size:12px;cursor:pointer;">📄 Download PDF</button>
        <button type="button" id="btn-logout" class="btn-futuristic-secondary" style="padding:8px 14px;font-size:12px;cursor:pointer;">Logout</button>
      </div>
    </header>
  `;
}
