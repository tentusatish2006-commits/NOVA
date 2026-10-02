// NOVA CART - Router
import { Canvas3D } from './components/3dCanvas.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderHeader } from './components/TopBar.js';
import { db } from './services/db.js';
import { auth } from './services/auth.js';
import { downloadPdfReport, downloadCsv } from './services/pdfExport.js';
import { renderLandingPage, initLandingN3D } from './pages/HomeLanding.js';
import { renderLoginPage, renderSignupPage, showAuthMessage } from './pages/AuthPages.js';
import { renderExecutiveDashboard } from './pages/ExecutiveDashboard.js';
import { renderBusinessDiagnosisPage, renderCausePanel, runFullDiagnosis } from './pages/BusinessDiagnosis.js';
import { renderAIBusinessAnalystPage, runAIQuery } from './pages/AIBusinessAnalyst.js';
import { renderCustomerIntelligencePage, viewCustomerDetail } from './pages/CustomerIntelligence.js';
import { renderRetentionIntelligencePage, triggerRescueAction } from './pages/RetentionIntelligence.js';
import { renderCustomerSupportPage } from './pages/CustomerSupport.js';
import { renderAISupportAssistantPage, runSupportSynthesis } from './pages/AISupportAssistant.js';
import { renderStoreIntelligencePage, viewStoreDetail } from './pages/StoreIntelligence.js';
import { renderInventoryIntelligencePage } from './pages/InventoryIntelligence.js';
import { renderDeliveryOperationsPage } from './pages/DeliveryOperations.js';
import { renderAIDeliveryPredictionPage, runDeliveryPrediction } from './pages/AIDeliveryPrediction.js';
import { renderCancellationIntelligencePage, generateCancelActionPlan } from './pages/CancellationIntelligence.js';
import { renderMarketingIntelligencePage } from './pages/MarketingIntelligence.js';
import { renderCouponAnalyticsPage } from './pages/CouponAnalytics.js';
import { renderAIRecommendationsPage } from './pages/AIRecommendations.js';
import { renderFinancialImpactPage } from './pages/FinancialImpact.js';
import { renderBusinessSimulatorPage, initSimulatorControls, runBusinessSimulation, saveSimulationScenario } from './pages/BusinessSimulator.js';
import { renderAnalyticsPage } from './pages/Analytics.js';
import { renderAlertsPage } from './pages/Alerts.js';

class App {
  constructor() {
    this.currentUser = null;
    this.custSegment = 'All'; this.custSearch = '';
    this.storeCity = 'All'; this.storeSearch = '';
    this.deliveryStatus = 'All'; this.analyticsTab = 'Finance';
    this.parseRoute();
    this.init();
  }

  async init() {
    try { this.canvas = new Canvas3D('canvas-container'); } catch (e) {}
    const restored = await auth.restoreSession();
    if (restored) {
      this.currentUser = restored;
      localStorage.setItem('nova_cart_user', JSON.stringify(restored));
      localStorage.setItem('nova_cart_logged_in', '1');
    } else {
      try {
        const raw = localStorage.getItem('nova_cart_user');
        if (raw && localStorage.getItem('nova_cart_logged_in') === '1') {
          const u = JSON.parse(raw);
          if (u && u.role) this.currentUser = u;
        }
      } catch (e) {}
    }
    window.addEventListener('hashchange', () => { this.parseRoute(); this.render(); });
    this.render();
  }

  isAuthenticated() {
    return !!(this.currentUser && this.currentUser.role && localStorage.getItem('nova_cart_logged_in') === '1');
  }

  parseRoute() {
    let raw = window.location.hash.replace(/^#/, '');
    if (!raw || raw === '') raw = '/';
    raw = raw.split('?')[0] || '/';
    if (raw === '/index.html' || raw === '/NOVA' || raw === '/NOVA/' || raw === '/NOVA/index.html') raw = '/';
    if (!raw.startsWith('/')) raw = '/' + raw;
    this.currentRoute = raw;
  }

  setCurrentUserRole(role) {
    if (!this.currentUser) return;
    this.currentUser.role = role;
    localStorage.setItem('nova_cart_user', JSON.stringify(this.currentUser));
    this.render();
  }

  async logout() {
    await auth.logout();
    this.currentUser = null;
    window.location.hash = '#/login';
  }

  navigate(hash) {
    if (!hash) return;
    window.location.hash = hash.startsWith('#') ? hash : '#' + hash;
  }

  completeLogin(user) {
    if (!user || !user.role) return;
    this.currentUser = user;
    localStorage.setItem('nova_cart_user', JSON.stringify(user));
    localStorage.setItem('nova_cart_logged_in', '1');
    const next = localStorage.getItem('nova_cart_after_login') || '#/dashboard';
    localStorage.removeItem('nova_cart_after_login');
    this.navigate(next);
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;
    const publicRoutes = ['/', '/login', '/signup'];
    const isStandalone = publicRoutes.includes(this.currentRoute);
    if (!isStandalone && !this.isAuthenticated()) {
      localStorage.setItem('nova_cart_after_login', '#' + this.currentRoute);
      if (this.currentRoute !== '/login') { window.location.hash = '#/login'; return; }
    }
    if (isStandalone) {
      if (this.currentRoute === '/login') root.innerHTML = renderLoginPage((this.currentUser && this.currentUser.role) || 'CEO');
      else if (this.currentRoute === '/signup') root.innerHTML = renderSignupPage();
      else root.innerHTML = renderLandingPage();
      this.bindStandaloneEvents();
      return;
    }
    const user = this.currentUser || { name: 'Guest', email: '', role: 'User' };
    root.innerHTML = `
      <div style="display:flex; width:100vw; height:100vh; overflow:hidden;">
        ${renderSidebar(this.currentRoute)}
        <div style="flex:1; display:flex; flex-direction:column; min-width:0; height:100vh; overflow:hidden;">
          ${renderHeader(this.currentRoute, user)}
          <main id="page-main" style="flex:1; display:flex; flex-direction:column; padding:24px 32px; overflow-y:auto; overflow-x:hidden;">
            ${this.renderRouteContent()}
          </main>
        </div>
      </div>
    `;
    this.bindAppEvents();
  }

  renderRouteContent() {
    const r = this.currentRoute;
    try {
      switch (r) {
        case '/dashboard': case '/executive': return renderExecutiveDashboard();
        case '/diagnosis': return renderBusinessDiagnosisPage();
        case '/ai-analyst': return renderAIBusinessAnalystPage();
        case '/customers': return renderCustomerIntelligencePage();
        case '/retention': return renderRetentionIntelligencePage();
        case '/support': return renderCustomerSupportPage();
        case '/support/assistant': case '/ai-support': return renderAISupportAssistantPage();
        case '/stores': return renderStoreIntelligencePage();
        case '/inventory': return renderInventoryIntelligencePage();
        case '/delivery': return renderDeliveryOperationsPage(this.deliveryStatus);
        case '/live-map': window.location.hash = '#/delivery'; return '<div class="glass-card" style="padding:24px;">Redirecting…</div>';
        case '/delivery-prediction': case '/ai-delivery': return renderAIDeliveryPredictionPage();
        case '/cancellations': return renderCancellationIntelligencePage();
        case '/marketing': return renderMarketingIntelligencePage();
        case '/coupons': return renderCouponAnalyticsPage();
        case '/recommendations': return renderAIRecommendationsPage();
        case '/impact': case '/financial': return renderFinancialImpactPage();
        case '/simulator': return renderBusinessSimulatorPage();
        case '/analytics': return renderAnalyticsPage(this.analyticsTab);
        case '/alerts': return renderAlertsPage();
        default: return renderExecutiveDashboard();
      }
    } catch (e) {
      return '<div class="glass-card" style="padding:24px;"><h2>Page Error</h2><pre>' + e.message + '</pre></div>';
    }
  }

  bindStandaloneEvents() {
    document.querySelectorAll('[data-nav]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const after = el.getAttribute('data-after-login');
        if (after) localStorage.setItem('nova_cart_after_login', after);
        this.navigate(el.getAttribute('data-nav') || el.getAttribute('href'));
      });
    });
    document.querySelectorAll('a[href^="#/"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#/')) {
          e.preventDefault();
          const after = a.getAttribute('data-after-login');
          if (after) localStorage.setItem('nova_cart_after_login', after);
          this.navigate(href);
        }
      });
    });
    if (this.currentRoute === '/' || this.currentRoute === '') {
      try { initLandingN3D(); } catch (err) {}
    }
    document.querySelectorAll('.btn-demo-login').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const role = (e.currentTarget || e.target).getAttribute('data-role') || 'CEO';
        this.completeLogin({ name: 'Demo ' + role, email: 'demo@novacart.in', role, provider: 'demo' });
      });
    });
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('login-email') || {}).value || '';
        const password = (document.getElementById('login-password') || {}).value || '';
        const btn = document.getElementById('login-submit');
        if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
        const result = await auth.login({ email, password });
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In & Enter Command Center'; }
        if (result.ok) this.completeLogin(result.user);
        else showAuthMessage(result.message || 'Invalid credentials');
      });
    }
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (document.getElementById('signup-name') || {}).value || '';
        const email = (document.getElementById('signup-email') || {}).value || '';
        const password = (document.getElementById('signup-password') || {}).value || '';
        const role = (document.getElementById('signup-role') || {}).value || 'CEO';
        const btn = document.getElementById('signup-submit');
        if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
        const result = await auth.signup({ name, email, password, role });
        if (btn) { btn.disabled = false; btn.textContent = 'Create Account'; }
        if (result.ok) {
          if (result.needsConfirmation) showAuthMessage(result.message || 'Check your email to confirm, then sign in.', 'info');
          else this.completeLogin(result.user);
        } else showAuthMessage(result.message || 'Signup failed');
      });
    }
  }

  bindAppEvents() {
    document.querySelectorAll('[data-nav], a[href^="#/"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const dest = el.getAttribute('data-nav') || el.getAttribute('href');
        if (dest && dest.includes('#/')) { e.preventDefault(); this.navigate(dest); }
      });
    });
    const roleSel = document.getElementById('role-selector');
    if (roleSel) roleSel.addEventListener('change', (e) => this.setCurrentUserRole(e.target.value));
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.logout());

    const btnPdf = document.getElementById('btn-download-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', (e) => {
        e.preventDefault();
        const u = this.currentUser || {};
        downloadPdfReport('NOVA_CART_Report', `<h2>Session</h2><div class="card">User: <b>${u.name || ''}</b><br>Role: ${u.role || ''}</div>`);
      });
    }

    document.querySelectorAll('.cause-tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.cause-tab').forEach((b) => { b.classList.remove('btn-futuristic'); b.classList.add('btn-futuristic-secondary'); });
        btn.classList.remove('btn-futuristic-secondary');
        btn.classList.add('btn-futuristic');
        const cause = btn.getAttribute('data-cause') || 'retention';
        const panel = document.getElementById('cause-explorer-content');
        if (panel) panel.innerHTML = renderCausePanel(cause);
      });
    });

    const btnDiag = document.getElementById('btn-run-diagnosis');
    if (btnDiag) {
      btnDiag.addEventListener('click', async (e) => {
        e.preventDefault();
        const original = btnDiag.textContent;
        btnDiag.disabled = true;
        btnDiag.textContent = 'Running AI Diagnosis…';
        await runFullDiagnosis(document.getElementById('diagnosis-output-container'));
        btnDiag.disabled = false;
        btnDiag.textContent = 'Diagnosis Complete ✓';
        setTimeout(() => { btnDiag.textContent = original; }, 2500);
      });
    }

    const aiForm = document.getElementById('ai-analyst-form');
    if (aiForm) {
      aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('ai-query-input');
        const askBtn = document.getElementById('btn-ask-ai');
        if (askBtn) { askBtn.disabled = true; askBtn.textContent = 'Thinking…'; }
        await runAIQuery(input ? input.value : '');
        if (askBtn) { askBtn.disabled = false; askBtn.textContent = 'Ask AI →'; }
      });
    }
    document.querySelectorAll('.btn-preset-query').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const q = btn.getAttribute('data-question') || '';
        const input = document.getElementById('ai-query-input');
        if (input) input.value = q;
        await runAIQuery(q);
      });
    });

    document.querySelectorAll('.btn-trigger-retention').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        await triggerRescueAction(btn.getAttribute('data-custid') || '', btn);
      });
    });

    const supportForm = document.getElementById('support-lookup-form');
    if (supportForm) {
      supportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cust = (document.getElementById('supp-cust-input') || {}).value || '';
        const order = (document.getElementById('supp-order-input') || {}).value || '';
        const btn = document.getElementById('btn-support-synthesize');
        if (btn) { btn.disabled = true; btn.textContent = 'Synthesizing…'; }
        await runSupportSynthesis(cust, order);
        if (btn) { btn.disabled = false; btn.textContent = '🔍 Retrieve & Synthesize'; }
      });
    }

    // AI Delay Prediction — synchronous, reliable binding
    const btnPred = document.getElementById('btn-run-delivery-pred');
    if (btnPred) {
      btnPred.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          btnPred.disabled = true;
          const prev = btnPred.textContent;
          btnPred.textContent = 'Predicting…';
          runDeliveryPrediction();
          btnPred.disabled = false;
          btnPred.textContent = prev;
        } catch (err) {
          btnPred.disabled = false;
          btnPred.textContent = '⚡ Run AI Delay Prediction';
          const box = document.getElementById('delivery-pred-output');
          if (box) box.innerHTML = '<div style="color:#f87171;">' + (err.message || err) + '</div>';
        }
      };
    }

    const btnCancelPlan = document.getElementById('btn-gen-cancel-plan');
    if (btnCancelPlan) {
      btnCancelPlan.addEventListener('click', async (e) => {
        e.preventDefault();
        await generateCancelActionPlan();
      });
    }

    document.querySelectorAll('.btn-view-customer').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        viewCustomerDetail(btn.getAttribute('data-custid') || '');
      });
    });

    document.querySelectorAll('.btn-store-detail').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        viewStoreDetail(btn.getAttribute('data-storeid') || '');
      });
    });

    if (this.currentRoute === '/simulator') {
      try { initSimulatorControls(); } catch (e) {}
      const btnSim = document.getElementById('btn-run-sim');
      if (btnSim) {
        btnSim.addEventListener('click', (e) => {
          e.preventDefault();
          btnSim.disabled = true;
          const prev = btnSim.textContent;
          btnSim.textContent = 'Computing…';
          runBusinessSimulation();
          btnSim.disabled = false;
          btnSim.textContent = prev;
        });
      }
      const btnSave = document.getElementById('btn-save-sim-scenario');
      if (btnSave) {
        btnSave.addEventListener('click', (e) => {
          e.preventDefault();
          saveSimulationScenario();
        });
      }
    }

    document.querySelectorAll('.btn-analytics-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.analyticsTab = btn.getAttribute('data-tab') || 'Finance';
        this.render();
      });
    });

    const btnCsv = document.getElementById('btn-export-csv');
    if (btnCsv) {
      btnCsv.addEventListener('click', () => {
        downloadCsv('nova-analytics.csv', [['Metric','Value'],['Registered Users','120000'],['Monthly Orders','38500'],['Revenue','2610000'],['Repeat Rate','27%']]);
      });
    }

    document.querySelectorAll('.btn-rec-action').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.textContent = (btn.getAttribute('data-action') || 'Done') + ' ✓';
        btn.disabled = true;
      });
    });

    document.querySelectorAll('.btn-ack-alert').forEach((btn) => {
      btn.addEventListener('click', () => {
        try { if (db.acknowledgeAlert) db.acknowledgeAlert(btn.getAttribute('data-altid')); } catch (e) {}
        btn.textContent = 'Acknowledged';
        btn.disabled = true;
      });
    });
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => { window.novaApp = new App(); });
} else {
  window.novaApp = new App();
}
