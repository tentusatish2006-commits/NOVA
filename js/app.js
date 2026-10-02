// NOVA CART - Master Application Router & Event Manager
import { Canvas3D } from './components/3dCanvas.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderHeader } from './components/Header.js';
import { openModal } from './components/Modal.js';
import { db } from './services/db.js';
import { aiEngine } from './services/aiEngine.js';
import { renderLandingPage, initLandingN3D } from './pages/LandingPage.js';
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
      name: 'Dr. Satish Kumar',
      email: 'satish@novacart.in',
      role: 'CEO'
    };
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
    let raw = window.location.hash.replace(/^#/, '');
    if (!raw || raw === '') raw = '/';
    raw = raw.split('?')[0] || '/';
    if (raw === '/index.html' || raw === '/NOVA' || raw === '/NOVA/' || raw === '/NOVA/index.html') raw = '/';
    if (!raw.startsWith('/')) raw = '/' + raw;
    this.currentRoute = raw;
  }

  init() {
    try { this.canvas = new Canvas3D('canvas-container'); }
    catch (e) { console.warn('3D canvas init error fallback:', e); }
    window.addEventListener('hashchange', () => { this.parseRoute(); this.render(); });
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

  navigate(hash) {
    if (!hash) return;
    window.location.hash = hash.startsWith('#') ? hash : '#' + hash;
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    const isStandalone = this.currentRoute === '/' || this.currentRoute === '/login' || this.currentRoute === '/signup';

    if (isStandalone) {
      if (this.currentRoute === '/login') root.innerHTML = renderLoginPage(this.currentUser.role);
      else if (this.currentRoute === '/signup') root.innerHTML = renderSignupPage();
      else root.innerHTML = renderLandingPage();
      this.bindStandaloneEvents();
      return;
    }

    const mainPadding = this.currentRoute === '/live-map' ? '0' : '24px 32px';
    root.innerHTML = `
      <div style="display:flex; width:100vw; height:100vh; overflow:hidden;">
        ${renderSidebar(this.currentRoute)}
        <div style="flex:1; display:flex; flex-direction:column; min-width:0; height:100vh; overflow:hidden;">
          ${renderHeader(this.currentRoute, this.currentUser, (role) => this.setCurrentUserRole(role), () => this.logout())}
          <main id="page-main" style="flex:1; display:flex; flex-direction:column; padding:${mainPadding}; overflow-y:auto; overflow-x:hidden;">
            ${this.renderRouteContent()}
          </main>
        </div>
      </div>
    `;

    if (this.currentRoute === '/live-map') {
      setTimeout(() => initLiveMapLeaflet(this.storeCity !== 'All' ? this.storeCity : 'Bengaluru'), 120);
    }
    this.bindAppEvents();
  }

  renderRouteContent() {
    const r = this.currentRoute;
    try {
      switch (r) {
        case '/dashboard': case '/executive': return renderExecutiveDashboard();
        case '/diagnosis': return renderBusinessDiagnosisPage();
        case '/ai-analyst': return renderAIBusinessAnalystPage();
        case '/customers': return renderCustomerIntelligencePage(this.custSegment, this.custSearch);
        case '/retention': return renderRetentionIntelligencePage();
        case '/support': return renderCustomerSupportPage();
        case '/support/assistant': case '/ai-support': return renderAISupportAssistantPage();
        case '/stores': return renderStoreIntelligencePage(this.storeCity, this.storeSearch);
        case '/inventory': return renderInventoryIntelligencePage();
        case '/delivery': return renderDeliveryOperationsPage(this.deliveryStatus);
        case '/live-map': return renderLiveDeliveryMapPage();
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
      console.error('Page render error', e);
      return '<div class="glass-card" style="padding:24px;"><h2>Page Error</h2><pre>' + e.message + '</pre></div>';
    }
  }

  bindStandaloneEvents() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = el.getAttribute('data-nav') || el.getAttribute('href');
        this.navigate(dest);
      });
    });
    document.querySelectorAll('a[href^="#/"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#/')) {
          e.preventDefault();
          this.navigate(href);
        }
      });
    });

    if (this.currentRoute === '/' || this.currentRoute === '') {
      try { initLandingN3D(); } catch (err) { console.warn('N3D init', err); }
    }

    document.querySelectorAll('.btn-demo-login').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const role = (e.currentTarget || e.target).getAttribute('data-role') || 'CEO';
        this.currentUser = { name: 'Dr. Satish Kumar', email: 'satish@novacart.in', role };
        localStorage.setItem('nova_cart_user', JSON.stringify(this.currentUser));
        this.navigate('#/dashboard');
      });
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = (document.getElementById('login-email') || {}).value || 'satish@novacart.in';
        this.currentUser = { name: 'Dr. Satish Kumar', email, role: this.currentUser.role || 'CEO' };
        localStorage.setItem('nova_cart_user', JSON.stringify(this.currentUser));
        this.navigate('#/dashboard');
      });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('signup-name') || {}).value || 'New User';
        const email = (document.getElementById('signup-email') || {}).value || 'user@novacart.in';
        const role = (document.getElementById('signup-role') || {}).value || 'CEO';
        this.currentUser = { name, email, role };
        localStorage.setItem('nova_cart_user', JSON.stringify(this.currentUser));
        this.navigate('#/dashboard');
      });
    }
  }

  bindAppEvents() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(el.getAttribute('data-nav') || el.getAttribute('href'));
      });
    });
    document.querySelectorAll('a[href^="#/"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.startsWith('#/')) {
          e.preventDefault();
          this.navigate(href);
        }
      });
    });

    const roleSel = document.getElementById('role-selector');
    if (roleSel) roleSel.addEventListener('change', (e) => this.setCurrentUserRole(e.target.value));

    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.logout());

    const btnReset = document.getElementById('btn-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Reset Nova Cart demo telemetry dataset to case study baseline?')) {
          db.reset();
          alert('Demo dataset restored to baseline!');
          this.render();
        }
      });
    }
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => { window.novaApp = new App(); });
} else {
  window.novaApp = new App();
}
