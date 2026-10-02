// NOVA CART - Advanced Analytics with distinct tab data
export function renderAnalyticsPage(currentTab = 'Finance') {
  const tabs = ['Finance', 'Customers', 'Orders', 'Stores', 'Inventory', 'Delivery', 'Marketing', 'Support'];
  const data = {
    Finance: {
      m1: { label: 'Monthly Revenue', value: '₹26.1L', hint: '+19.7% vs 6 mo ago' },
      m2: { label: 'Gross Margin', value: '8.2%', hint: 'Target 16%+' },
      m3: { label: 'Promo Spend', value: '₹17L', hint: '44% coupons unused' },
      body: 'Finance view: revenue growth is real but margin is compressed by promo waste and cancellation write-offs (~₹20.5L/mo lost). Shift spend from acquisition discounts to retention SLA guarantees.',
    },
    Customers: {
      m1: { label: 'Registered Users', value: '120,000', hint: '+46% growth' },
      m2: { label: 'Repeat Rate', value: '27%', hint: 'Down from 41%' },
      m3: { label: 'At-Risk Segment', value: '34,200', hint: 'High churn probability' },
      body: 'Customer view: acquisition is strong but second-order conversion is only 31% within 30 days. 68% of churned users reported delivery delays > 35 min on first or second order.',
    },
    Orders: {
      m1: { label: 'Monthly Orders', value: '38,500', hint: '+23.4% growth' },
      m2: { label: 'Avg Order Value', value: '₹486', hint: '+7.5% vs baseline' },
      m3: { label: 'Cancellation Rate', value: '11%', hint: 'Doubled from 6%' },
      body: 'Orders view: volume is up but 4,235 cancelled orders/month destroy trust. 42% of cancels are stockouts after acceptance; 31% are delay-driven.',
    },
    Stores: {
      m1: { label: 'Partner Stores', value: '620', hint: '3 cities' },
      m2: { label: 'Inventory Accuracy', value: '84.2%', hint: 'Drives cancellations' },
      m3: { label: 'Rejection Rate', value: '8.4%', hint: 'At-risk partners elevated' },
      body: 'Stores view: 108 partners need intervention. High rejection and low inventory accuracy cluster in Whitefield (BLR) and selected Noida nodes.',
    },
    Inventory: {
      m1: { label: 'SKU Stockouts Today', value: '1,420', hint: 'Across network' },
      m2: { label: 'Substitution Rate', value: '14.8%', hint: 'Under-used rescue lever' },
      m3: { label: '4h Stockout Risk', value: '84 items', hint: 'Needs pre-allocation' },
      body: 'Inventory view: system stock lags shelf reality. Pre-allocate top movers and enable 1-click substitutes to protect first-order experience.',
    },
    Delivery: {
      m1: { label: 'Avg Delivery Time', value: '37 min', hint: 'Was 29 min' },
      m2: { label: 'On-Time Rate', value: '64.2%', hint: 'Target > 92%' },
      m3: { label: 'Active Drivers', value: '1,840', hint: 'Peak shortage 6–9 PM' },
      body: 'Delivery view: peak evening congestion and store prep queues push ETA past the trust threshold. Dynamic dispatch + surge capacity in Koramangala and Bandra are priority.',
    },
    Marketing: {
      m1: { label: 'Promo Budget', value: '₹17L/mo', hint: 'Broad discounts' },
      m2: { label: 'Coupon Redemption', value: '56%', hint: '44% unused' },
      m3: { label: 'CAC Trend', value: 'Rising', hint: 'Weak 2nd-order lift' },
      body: 'Marketing view: flat SUPER50-style offers do not fix SLA damage. Reallocate budget to 2nd-order incentives and delay-victim recovery offers only.',
    },
    Support: {
      m1: { label: 'Tickets / Month', value: '5,900', hint: '+90% load' },
      m2: { label: 'Top Category', value: 'Delivery', hint: 'Then cancellations' },
      m3: { label: 'Repeat Complainers', value: 'High', hint: 'Rarely convert to #2' },
      body: 'Support view: tickets spike from preventable delivery and inventory failures. Proactive delay notifications and auto-credits reduce inbound volume.',
    },
  };
  const d = data[currentTab] || data.Finance;

  return `
    <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <h2 style="font-size: 20px; font-weight: 700; color: #fff;">Advanced Analytics Command Center</h2>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">Cross-domain telemetry — each tab shows different metrics.</p>
        </div>
        <button type="button" id="btn-export-csv" class="btn-futuristic-secondary" style="padding: 10px 20px;">⬇ Export CSV</button>
      </div>

      <div class="glass-panel" style="padding: 14px; display: flex; gap: 8px; overflow-x: auto; flex-wrap: wrap;">
        ${tabs.map(t => `
          <button type="button" class="btn-analytics-tab ${currentTab === t ? 'btn-futuristic' : 'btn-futuristic-secondary'}" data-tab="${t}" style="font-size: 13px; padding: 8px 18px; cursor: pointer;">
            ${t}
          </button>
        `).join('')}
      </div>

      <div class="glass-panel glow-cyan" style="padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">${currentTab} Telemetry Overview</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${d.m1.label}</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">${d.m1.value}</div>
            <div style="font-size: 11px; color: var(--neon-cyan);">${d.m1.hint}</div>
          </div>
          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${d.m2.label}</div>
            <div style="font-size: 24px; font-weight: 800; color: #fff; margin-top: 4px;">${d.m2.value}</div>
            <div style="font-size: 11px; color: var(--neon-emerald);">${d.m2.hint}</div>
          </div>
          <div class="glass-card" style="padding: 16px;">
            <div style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">${d.m3.label}</div>
            <div style="font-size: 24px; font-weight: 800; color: var(--neon-amber); margin-top: 4px;">${d.m3.value}</div>
            <div style="font-size: 11px; color: var(--neon-amber);">${d.m3.hint}</div>
          </div>
        </div>
        <div style="font-size: 14px; color: var(--text-muted); line-height: 1.65;">${d.body}</div>
      </div>
    </div>
  `;
}
