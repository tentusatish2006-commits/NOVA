// NOVA CART - Master Application Router & Event Manager
import { Canvas3D } from './components/3dCanvas.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderHeader } from './components/Header.js';
import { openModal } from './components/Modal.js';
import { db } from './services/db.js';
import { aiEngine } from './services/aiEngine.js';

// Import Pages
import { renderLandingPage } from './pages/LandingPage.js';
import { renderLoginPage, renderSignupPage } from './pages/AuthPages.js';
import { renderExecutiveDashboard } from './pages/ExecutiveDashboard.js';
import { renderBusinessDiagnosisPage } from './pages/BusinessDiagnosis.js';
import { renderAIBusinessAnalystPage } from './pages/AIBusinessAnalyst.js';
import { renderCustomerIntelligencePage } from './pages/CustomerIntelligence.js';
import { renderRetentionIntelligencePage } from './pages/RetentionIntelligence.js';
import { renderCustomerSupportPage } from './pages/CustomerSupport.js';
import { renderAISupportAssistantPage } from './pages/AISupportAssistant.js';
import { renderStoreIntelligencePage } from './pages/StoreIntelligence.js';
import { renderInventoryIntelligencePage } from './pages/InventoryIntelligence.js';
import { renderDeliveryOperationsPage } from './pages/DeliveryOperations.js';
import { renderLiveDeliveryMapPage, initLiveMapLeaflet } from './pages/LiveDeliveryMap.js';
import { renderAIDeliveryPredictionPage } from './pages/AIDeliveryPrediction.js';
import { renderCancellationIntelligencePage } from './pages/CancellationIntelligence.js';
import { renderMarketingIntelligencePage } from './pages/MarketingIntelligence.js';
import { renderCouponAnalyticsPage } from './pages/CouponAnalytics.js';
import { renderAIRecommendationsPage } from './pages/AIRecommendations.js';
import { renderFinancialImpactPage } from './pages/FinancialImpact.js';
import { renderBusinessSimulatorPage } from './pages/BusinessSimulator.js';
import { renderAnalyticsPage } from './pages/Analytics.js';
import { renderAlertsPage } from './pages/Alerts.js';

class App {
  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('nova_cart_user')) || {
      name: "Dr. Satish Kumar",
      email: "satish@novacart.in",
      role: "CEO"
    };

    // State parameters for filtering
    this.custSegment = 'All';
    this.custSearch = '';
    this.storeCity = 'All';
    this.storeSearch = '';
    this.deliveryStatus = 'All';
    this.analyticsTab = 'Finance';

    this.parseRoute();
    this.init();
  }

  parseRoute() {
    let raw = window.location.hash.replace('#', '');
    if (!raw || raw === '') {
      raw = window.location.pathname;
    }
    raw = raw.split('?')[0] || '/';
    if (raw === '/index.html') raw = '/';
    this.currentRoute = raw;
  }

  init() {
    // 1. Initialize 3D WebGL Background safely
    try {
      this.canvas = new Canvas3D('canvas-container');
    } catch (e) {
      console.warn("3D canvas init error fallback:", e);
    }

    // 2. Setup Hash Change Router
    window.addEventListener('hashchange', () => {
      this.parseRoute();
      this.render();
    });

    this.render();
  }

  setCurrentUserRole(role) {
    this.currentUser.role = role;
    localStorage.setItem('nova_cart_user', JSON.stringify(this.currentUser));
    this.render();
  }

  logout() {
    localStorage.removeItem('nova_cart_user');
    window.location.hash = '#/login';
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    // Is standalone page without sidebar/header?
    const isStandalone = this.currentRoute === '/' || this.currentRoute === '/login' || this.currentRoute === '/signup';

    if (isStandalone) {
      if (this.currentRoute === '/login') root.innerHTML = renderLoginPage(this.currentUser.role);
      else if (this.currentRoute === '/signup') root.innerHTML = renderSignupPage();
      else root.innerHTML = renderLandingPage();

      this.bindStandaloneEvents();
      return;
    }

    // Main App Layout
    const mainPadding = this.currentRoute === '/live-map' ? '0' : '24px 32px';

    root.innerHTML = `
      <div style="display: flex; width: 100vw; height: 100vh; overflow: hidden;">
        ${renderSidebar(this.currentRoute)}
        <div style="flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden;">
          ${renderHeader(this.currentRoute, this.currentUser, (role) => this.setCurrentUserRole(role), () => this.logout())}
          <main id="page-main" style="flex: 1; display: flex; flex-direction: column; padding: ${mainPadding}; overflow-y: auto; overflow-x: hidden;">
            ${this.renderRouteContent()}
          </main>
        </div>
      </div>
    `;

    this.bindAppEvents();
  }

  renderRouteContent() {
    switch (this.currentRoute) {
      case '/dashboard': return renderExecutiveDashboard();
      case '/diagnosis': return renderBusinessDiagnosisPage();
      case '/ai-analyst': return renderAIBusinessAnalystPage();
      case '/customers': return renderCustomerIntelligencePage(this.custSegment, this.custSearch);
      case '/retention': return renderRetentionIntelligencePage();
      case '/support': return renderCustomerSupportPage();
      case '/support/assistant': return renderAISupportAssistantPage();
      case '/stores': return renderStoreIntelligencePage(this.storeCity, this.storeSearch);
      case '/inventory': return renderInventoryIntelligencePage();
      case '/delivery': return renderDeliveryOperationsPage(this.deliveryStatus);
      case '/live-map': return renderLiveDeliveryMapPage();
      case '/delivery-prediction': return renderAIDeliveryPredictionPage();
      case '/cancellations': return renderCancellationIntelligencePage();
      case '/marketing': return renderMarketingIntelligencePage();
      case '/coupons': return renderCouponAnalyticsPage();
      case '/recommendations': return renderAIRecommendationsPage();
      case '/impact': return renderFinancialImpactPage();
      case '/simulator': return renderBusinessSimulatorPage();
      case '/analytics': return renderAnalyticsPage(this.analyticsTab);
      case '/alerts': return renderAlertsPage();
      default: return renderExecutiveDashboard();
    }
  }

  bindStandaloneEvents() {
    document.querySelectorAll('.btn-demo-login').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.target.getAttribute('data-role');
        this.setCurrentUserRole(role);
        window.location.hash = '#/dashboard';
      });
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.hash = '#/dashboard';
      });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.hash = '#/dashboard';
      });
    }
  }

  bindAppEvents() {
    // Header & Navigation Controls
    const roleSel = document.getElementById('role-selector');
    if (roleSel) roleSel.addEventListener('change', (e) => this.setCurrentUserRole(e.target.value));

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.logout());

    const btnReset = document.getElementById('btn-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm("Reset Nova Cart demo telemetry dataset to case study baseline?")) {
          db.reset();
          alert("Demo dataset restored to baseline!");
          this.render();
        }
      });
    }

    // Customer Intelligence Events
    if (this.currentRoute === '/customers') {
      const searchInput = document.getElementById('cust-search-input');
      const segmentFilter = document.getElementById('cust-segment-filter');
      
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.custSearch = e.target.value;
          this.render();
        });
      }
      if (segmentFilter) {
        segmentFilter.addEventListener('change', (e) => {
          this.custSegment = e.target.value;
          this.render();
        });
      }

      document.querySelectorAll('.btn-view-customer').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const custId = e.target.getAttribute('data-custid');
          const customer = db.getCustomers().find(c => c.id === custId) || db.getCustomers()[0];
          openModal(
            `Customer Profile Drawer — ${customer.name} (${customer.id})`,
            `
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; font-size: 13px;">
                  <div>City: <strong style="color: #fff;">${customer.city}</strong></div>
                  <div>Repeat Status: <strong style="color: var(--neon-cyan);">${customer.repeatStatus}</strong></div>
                  <div>Total Orders: <strong style="color: #fff;">${customer.orders} orders</strong></div>
                  <div>Total Spend: <strong style="color: var(--neon-emerald);">₹${customer.totalSpend.toLocaleString()}</strong></div>
                  <div>Avg Order Value: <strong style="color: #fff;">₹${customer.avgOrder}</strong></div>
                  <div>Last Order Date: <strong style="color: #fff;">${customer.lastOrder}</strong></div>
                  <div>Coupons Used: <strong style="color: var(--neon-violet);">${customer.couponsUsed}</strong></div>
                  <div>Delivery Complaints: <strong style="color: var(--neon-rose);">${customer.deliveryComplaints}</strong></div>
                </div>

                <div style="padding: 12px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan);">
                  <strong>AI Retention Risk Analysis:</strong> ${customer.retentionRisk} RISK.<br>
                  <em>Recommendation: Issue targeted 2nd-order retention credit + priority driver SLA routing.</em>
                </div>
              </div>
            `
          );
        });
      });
    }

    // Retention Intelligence Events
    if (this.currentRoute === '/retention') {
      document.querySelectorAll('.btn-trigger-retention').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const custId = e.target.getAttribute('data-custid');
          const customer = db.getCustomers().find(c => c.id === custId);
          alert(`Rescue intervention dispatched to ${customer ? customer.name : custId}! VIP Pass + ₹60 wallet credit issued.`);
        });
      });
    }

    // Store Intelligence Events
    if (this.currentRoute === '/stores') {
      const storeSearch = document.getElementById('store-search');
      const cityFilter = document.getElementById('store-city-filter');

      if (storeSearch) {
        storeSearch.addEventListener('input', (e) => {
          this.storeSearch = e.target.value;
          this.render();
        });
      }
      if (cityFilter) {
        cityFilter.addEventListener('change', (e) => {
          this.storeCity = e.target.value;
          this.render();
        });
      }

      document.querySelectorAll('.btn-store-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const storeId = e.target.getAttribute('data-storeid');
          const store = db.getStores().find(s => s.id === storeId) || db.getStores()[0];
          openModal(
            `Store Telemetry Drawer — ${store.name} (${store.id})`,
            `
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                  <div>Category: <strong style="color: #fff;">${store.category}</strong></div>
                  <div>City Hub: <strong style="color: #fff;">${store.city}</strong></div>
                  <div>Daily Volume: <strong style="color: var(--neon-cyan);">${store.ordersPerDay} orders/day</strong></div>
                  <div>Inventory Accuracy: <strong style="color: ${store.inventoryAccuracy < 85 ? 'var(--neon-amber)' : 'var(--neon-emerald)'};">${store.inventoryAccuracy}%</strong></div>
                  <div>Rejection Rate: <strong style="color: ${store.rejectionRate > 10 ? 'var(--neon-rose)' : '#fff'};">${store.rejectionRate}%</strong></div>
                  <div>Store Rating: <strong style="color: var(--neon-cyan);">⭐ ${store.rating}</strong></div>
                  <div>Operating Hours: <strong>${store.openHours}</strong></div>
                  <div>Contact: <strong>${store.contact}</strong></div>
                </div>

                <div style="padding: 12px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan);">
                  <strong>AI Performance Audit:</strong> Store rejection rate is ${store.rejectionRate}%. ${store.rejectionRate > 10 ? 'Requires immediate POS inventory sync to stop ghost cancellations.' : 'Operational performance is healthy.'}
                </div>
              </div>
            `
          );
        });
      });
    }

    // Inventory Events
    if (this.currentRoute === '/inventory') {
      const btnAnalyze = document.getElementById('btn-analyze-inv');
      const btnRestock = document.getElementById('btn-generate-restock');

      if (btnAnalyze) {
        btnAnalyze.addEventListener('click', () => {
          alert("Inventory Telemetry Analysis Complete: 84 SKUs identified with stockouts in next 4 hours.");
        });
      }
      if (btnRestock) {
        btnRestock.addEventListener('click', () => {
          openModal(
            "AI Dark Store Restock Recommendations",
            `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 10px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan);">
                  📦 <strong>Restock Order #109 Dispatched:</strong> Amul Taaza Milk 1L (120 units) -> Koramangala Hub
                </div>
                <div style="padding: 10px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan);">
                  📦 <strong>Restock Order #110 Dispatched:</strong> Aashirvaad Atta 5kg (45 units) -> Bandra Central Hub
                </div>
                <div style="padding: 10px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan);">
                  📦 <strong>Restock Order #111 Dispatched:</strong> Britannia Bread 400g (80 units) -> Gurgaon Hub
                </div>
              </div>
            `
          );
        });
      }
    }

    // Delivery Events
    if (this.currentRoute === '/delivery') {
      const delFilter = document.getElementById('delivery-status-filter');
      if (delFilter) {
        delFilter.addEventListener('change', (e) => {
          this.deliveryStatus = e.target.value;
          this.render();
        });
      }

      document.querySelectorAll('.btn-view-order').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const ordId = e.target.getAttribute('data-ordid');
          const order = db.getDeliveries().find(d => d.id === ordId) || db.getDeliveries()[0];
          openModal(
            `Order Telemetry Drawer — ${order.id}`,
            `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>Store Node: <strong style="color: #fff;">${order.store}</strong></div>
                <div>Customer Name: <strong style="color: #fff;">${order.customer}</strong></div>
                <div>Assigned Driver: <strong style="color: var(--neon-cyan);">${order.driver}</strong></div>
                <div>Transit Distance: <strong>${order.distanceKm} km</strong></div>
                <div>ETA Estimate: <strong style="color: ${order.etaMin > 30 ? 'var(--neon-rose)' : 'var(--neon-emerald)'};">${order.etaMin} mins</strong></div>
                <div>Current SLA Status: <span class="badge ${order.status === 'Delayed' ? 'badge-rose' : 'badge-emerald'}">${order.status}</span></div>
              </div>
            `
          );
        });
      });
    }

    // Live Map Events
    if (this.currentRoute === '/live-map') {
      setTimeout(() => initLiveMapLeaflet('Bengaluru'), 100);
    }

    // Business Diagnosis Events
    if (this.currentRoute === '/diagnosis') {
      const btnDiag = document.getElementById('btn-run-diagnosis');
      if (btnDiag) {
        btnDiag.addEventListener('click', async () => {
          const res = await aiEngine.diagnoseBusiness();
          const outContainer = document.getElementById('diagnosis-output-container');
          if (outContainer) {
            outContainer.style.display = 'block';
            outContainer.innerHTML = `
              <div style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan); margin-bottom: 6px;">AI RESCUE DIAGNOSIS RUNNER</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 14px;">${res.title}</h3>
              <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: var(--text-muted);">
                <div><strong>1. Observed Problem:</strong> ${res.problem}</div>
                <div><strong>2. Synthesis Insight:</strong> ${res.insight}</div>
                <div><strong>3. Root Cause Analysis:</strong> ${res.aiAnalysis}</div>
                <div style="padding: 12px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan); color: var(--neon-cyan);">
                  💡 <strong>4. Recommendation & Action:</strong> ${res.recommendation} — ${res.action}
                </div>
                <div><strong>5. Target Business Impact:</strong> <span style="color: var(--neon-emerald); font-weight: 700;">${res.expectedMetric}</span></div>
              </div>
            `;
          }
        });
      }

      // Cause Tabs
      document.querySelectorAll('.cause-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          document.querySelectorAll('.cause-tab').forEach(t => t.className = 'cause-tab btn-futuristic-secondary');
          e.target.className = 'cause-tab btn-futuristic';
          const cause = e.target.getAttribute('data-cause');
          const explorer = document.getElementById('cause-explorer-content');
          if (explorer) {
            explorer.innerHTML = `
              <div class="glass-card" style="padding: 20px;">
                <h4 style="font-size: 15px; font-weight: 700; color: var(--neon-cyan); margin-bottom: 8px;">Selected Root Cause Domain: ${cause.toUpperCase()}</h4>
                <p style="font-size: 13px; color: var(--text-muted);">
                  Telemetry signals confirm operational bottlenecks in ${cause} are directly impacting the 27% repeat purchase rate.
                </p>
              </div>
            `;
          }
        });
      });
    }

    // AI Analyst Events
    if (this.currentRoute === '/ai-analyst') {
      const form = document.getElementById('ai-analyst-form');
      const input = document.getElementById('ai-query-input');
      const container = document.getElementById('ai-response-container');

      const handleQuery = async (queryText) => {
        container.innerHTML = `<div style="text-align: center; color: var(--neon-cyan);">🤖 AI Processing telemetry signals...</div>`;
        const result = await aiEngine.processQuery(queryText);
        container.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div style="font-size: 12px; font-family: var(--font-mono); color: var(--neon-cyan);">AI SYNTHESIS RESPONSE</div>
            <p style="font-size: 15px; font-weight: 600; color: #fff; line-height: 1.5;">${result.answer}</p>
            <div style="font-size: 13px; color: var(--text-muted);">📊 <strong>Supporting Evidence:</strong> ${result.evidence}</div>
            <div style="padding: 12px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan); color: var(--neon-cyan); font-size: 13px;">
              💡 <strong>Action Recommendation:</strong> ${result.recommendation}
            </div>
            <div style="font-size: 12px; color: var(--neon-emerald);">🎯 Expected Metric: ${result.expectedMetric}</div>
          </div>
        `;
      };

      if (form && input) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (input.value.trim()) handleQuery(input.value.trim());
        });
      }

      document.querySelectorAll('.btn-preset-query').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const q = e.target.getAttribute('data-question');
          if (input) input.value = q;
          handleQuery(q);
        });
      });
    }

    // AI Delivery Prediction Events
    if (this.currentRoute === '/delivery-prediction') {
      const btnPred = document.getElementById('btn-run-delivery-pred');
      const out = document.getElementById('delivery-pred-output');
      const sel = document.getElementById('pred-order-select');

      if (btnPred && out && sel) {
        btnPred.addEventListener('click', async () => {
          const order = db.getDeliveries().find(d => d.id === sel.value) || db.getDeliveries()[0];
          const res = await aiEngine.predictDeliveryDelay(order);
          out.innerHTML = `
            <div style="width: 100%; text-align: left; display: flex; flex-direction: column; gap: 14px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3 style="font-size: 18px; font-weight: 700; color: #fff;">Route Telemetry Analysis: ${res.orderId}</h3>
                <span class="badge ${res.lateRisk === 'HIGH' ? 'badge-rose' : 'badge-emerald'}">${res.lateRisk} LATE RISK</span>
              </div>
              <div style="font-size: 24px; font-weight: 800; color: var(--neon-amber);">Predicted ETA: ${res.predictedETA} mins</div>
              <div style="font-size: 13px; color: var(--text-muted);">
                <strong>Main Factors:</strong> ${res.mainFactors.join(' | ')}
              </div>
              <div style="padding: 12px; background: rgba(0, 243, 255, 0.08); border-radius: 8px; border: 1px solid var(--border-cyan); color: var(--neon-cyan); font-size: 13px;">
                💡 <strong>Recommended Action:</strong> ${res.recommendation} (${res.suggestedDriver})
              </div>
            </div>
          `;
        });
      }
    }

    // Support Assistant Events
    if (this.currentRoute === '/support/assistant') {
      const form = document.getElementById('support-lookup-form');
      const out = document.getElementById('support-workspace-result');

      if (form && out) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const cust = document.getElementById('supp-cust-input').value;
          const ord = document.getElementById('supp-order-input').value;

          const res = await aiEngine.generateSupportResolution({ id: 'TCK-4091', category: 'Delivery Delay', orderId: ord }, { name: cust }, { id: ord });

          out.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 18px; font-weight: 700; color: #fff;">AI Synthesized Resolution: ${res.ticketId}</h3>
                <span class="badge badge-rose">HIGH PRIORITY</span>
              </div>
              <div style="font-size: 13px; color: var(--text-muted);">
                <strong>Customer:</strong> ${res.customerName} | <strong>Issue:</strong> ${res.issueCategory}
              </div>
              <div style="font-size: 13px; color: var(--text-muted);">
                <strong>Likely Cause:</strong> ${res.likelyCause}
              </div>
              <div style="padding: 14px; background: rgba(0, 243, 255, 0.06); border-radius: 8px; border: 1px solid var(--border-cyan);">
                <div style="font-size: 12px; font-weight: 700; color: var(--neon-cyan); margin-bottom: 6px;">PROPOSED CUSTOMER RESPONSE TEXT:</div>
                <p style="font-size: 13px; color: #fff; font-style: italic;">"${res.suggestedResponseText}"</p>
              </div>

              <div style="display: flex; gap: 10px;">
                <button id="btn-supp-resolve" class="btn-futuristic glow-cyan" style="font-size: 12px; padding: 8px 16px;">
                  ✅ Approve & Resolve Ticket
                </button>
                <button id="btn-supp-escalate" class="btn-futuristic-secondary" style="font-size: 12px; padding: 8px 16px;">
                  ⚠️ Escalate to Ops Lead
                </button>
              </div>
            </div>
          `;

          const btnRes = document.getElementById('btn-supp-resolve');
          if (btnRes) {
            btnRes.addEventListener('click', () => {
              db.resolveTicket('TCK-4091', res.recommendedResolution);
              alert("Ticket TCK-4091 resolved and customer credited ₹75 wallet refund!");
            });
          }
        });
      }
    }

    // Recommendations Events
    if (this.currentRoute === '/recommendations') {
      document.querySelectorAll('.btn-rec-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          const action = e.target.getAttribute('data-action');
          db.updateRecommendationStatus(id, action);
          const badge = document.getElementById(`status-badge-${id}`);
          if (badge) badge.innerText = `STATUS: ${action}`;
          alert(`Recommendation ${id} updated to ${action}`);
        });
      });
    }

    // Financial Impact Events
    if (this.currentRoute === '/impact') {
      const rRep = document.getElementById('slider-repeat');
      const rDel = document.getElementById('slider-delivery');
      const rCan = document.getElementById('slider-cancel');

      const updateImpactMath = () => {
        const rep = parseInt(rRep ? rRep.value : 36);
        const del = parseInt(rDel ? rDel.value : 28);
        const can = parseInt(rCan ? rCan.value : 6);

        if (document.getElementById('slider-repeat-val')) document.getElementById('slider-repeat-val').innerText = `${rep}%`;
        if (document.getElementById('slider-delivery-val')) document.getElementById('slider-delivery-val').innerText = `${del} min`;
        if (document.getElementById('slider-cancel-val')) document.getElementById('slider-cancel-val').innerText = `${can}%`;

        const revLakhs = (26.1 * (1 + (rep - 27) * 0.025 + (37 - del) * 0.01 + (11 - can) * 0.015)).toFixed(1);
        const profitPct = (8.2 + (rep - 27) * 0.5 + (37 - del) * 0.3).toFixed(1);

        if (document.getElementById('proj-revenue')) document.getElementById('proj-revenue').innerText = `₹${revLakhs}L / mo`;
        if (document.getElementById('proj-profit')) document.getElementById('proj-profit').innerText = `${profitPct}%`;
      };

      if (rRep) rRep.addEventListener('input', updateImpactMath);
      if (rDel) rDel.addEventListener('input', updateImpactMath);
      if (rCan) rCan.addEventListener('input', updateImpactMath);
    }

    // Business Simulator Events
    if (this.currentRoute === '/simulator') {
      const btnRunSim = document.getElementById('btn-run-sim');
      const btnSaveSim = document.getElementById('btn-save-sim-scenario');

      const sRep = document.getElementById('sim-repeat');
      const sDel = document.getElementById('sim-del');
      const sCan = document.getElementById('sim-cancel');
      const sInv = document.getElementById('sim-inv');
      const sMkt = document.getElementById('sim-mkt');

      const updateSimValues = () => {
        if (sRep && document.getElementById('sim-val-repeat')) document.getElementById('sim-val-repeat').innerText = `${sRep.value}%`;
        if (sDel && document.getElementById('sim-val-del')) document.getElementById('sim-val-del').innerText = `${sDel.value}m`;
        if (sCan && document.getElementById('sim-val-cancel')) document.getElementById('sim-val-cancel').innerText = `${sCan.value}%`;
        if (sInv && document.getElementById('sim-val-inv')) document.getElementById('sim-val-inv').innerText = `${sInv.value}%`;
        if (sMkt && document.getElementById('sim-val-mkt')) document.getElementById('sim-val-mkt').innerText = `₹${sMkt.value}L`;
      };

      [sRep, sDel, sCan, sInv, sMkt].forEach(input => {
        if (input) input.addEventListener('input', updateSimValues);
      });

      if (btnRunSim) {
        btnRunSim.addEventListener('click', () => {
          const rep = parseInt(sRep ? sRep.value : 35);
          const del = parseInt(sDel ? sDel.value : 28);
          const can = parseInt(sCan ? sCan.value : 6);
          const mkt = parseInt(sMkt ? sMkt.value : 12);

          const revLakhs = (26.1 * (1 + (rep - 27) * 0.025 + (37 - del) * 0.01 + (11 - can) * 0.015)).toFixed(1);
          const profitPct = (8.2 + (rep - 27) * 0.5 + (37 - del) * 0.3 - (mkt - 9.5) * 0.2).toFixed(1);
          const projOrders = Math.round(38500 * (revLakhs / 26.1));

          if (document.getElementById('sim-target-rev')) document.getElementById('sim-target-rev').innerText = `₹${revLakhs}L Revenue / mo`;
          if (document.getElementById('sim-target-orders')) document.getElementById('sim-target-orders').innerText = projOrders.toLocaleString();
          if (document.getElementById('sim-target-repeat')) document.getElementById('sim-target-repeat').innerText = `${rep}%`;
          if (document.getElementById('sim-target-cancel')) document.getElementById('sim-target-cancel').innerText = `${can}%`;
          if (document.getElementById('sim-target-mkt')) document.getElementById('sim-target-mkt').innerText = `₹${mkt}.0L`;
          if (document.getElementById('sim-target-profit')) document.getElementById('sim-target-profit').innerText = `${profitPct}%`;
        });
      }

      if (btnSaveSim) {
        btnSaveSim.addEventListener('click', () => {
          const rep = parseInt(sRep ? sRep.value : 35);
          const del = parseInt(sDel ? sDel.value : 28);
          const can = parseInt(sCan ? sCan.value : 6);
          const mkt = parseInt(sMkt ? sMkt.value : 12);
          const revLakhs = (26.1 * (1 + (rep - 27) * 0.025 + (37 - del) * 0.01 + (11 - can) * 0.015)).toFixed(1);

          db.saveSimulation({
            id: `SIM-${Date.now()}`,
            name: `Scenario (Repeat ${rep}%, SLA ${del}m)`,
            repeatRate: rep,
            deliveryMin: del,
            cancellationRate: can,
            promoSpendLakhs: mkt,
            projectedMonthlyRevenueLakhs: parseFloat(revLakhs),
            netProfitMargin: "14.2%"
          });
          alert("Simulation scenario saved!");
          this.render();
        });
      }
    }

    // Analytics Events
    if (this.currentRoute === '/analytics') {
      document.querySelectorAll('.btn-analytics-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.analyticsTab = e.target.getAttribute('data-tab');
          this.render();
        });
      });

      const btnCsv = document.getElementById('btn-export-csv');
      if (btnCsv) {
        btnCsv.addEventListener('click', () => {
          alert(`Downloading ${this.analyticsTab}_Telemetry_Export.csv`);
        });
      }
    }

    // Alerts Events
    if (this.currentRoute === '/alerts') {
      document.querySelectorAll('.btn-ack-alert').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-altid');
          db.acknowledgeAlert(id);
          this.render();
        });
      });
    }
  }
}

// Instantiate Master App safely regardless of DOM readyState
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.novaApp = new App();
  });
} else {
  window.novaApp = new App();
}
