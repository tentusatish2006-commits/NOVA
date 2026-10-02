// NOVA CART - Router with Supabase Auth
import { Canvas3D } from './components/3dCanvas.js';
import { renderSidebar } from './components/Sidebar.js';
import { renderHeader } from './components/TopBar.js';
import { db } from './services/db.js';
import { auth } from './services/auth.js';
import { renderLandingPage, initLandingN3D } from './pages/HomeLanding.js';
import { renderLoginPage, renderSignupPage, showAuthMessage } from './pages/AuthPages.js';
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

function defaultUser() {
  return { name: 'Dr. Satish Kumar', email: 'satish@novacart.in', role: 'CEO' };
}

class App {
  constructor() {
    this.currentUser = null;
    this.custSegment = 'All';
    this.custSearch = '';
    this.storeCity = 'All';
    this.storeSearch = '';
    this.deliveryStatus = 'All';
    this.analyticsTab = 'Finance';
    this.parseRoute();
    this.init();
  }

  async init() {
    try {
      this.canvas = new Canvas3D('canvas-container');
    } catch (e) {}
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
    window.addEventListener('hashchange', () => {
      this.parseRoute();
      this.render();
    });
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
    if (!this.currentUser) this.currentUser = defaultUser();
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
      if (this.currentRoute !== '/login') {
        window.location.hash = '#/login';
        return;
      }
    }

    if (isStandalone) {
      if (this.currentRoute === '/login') root.innerHTML = renderLoginPage((this.currentUser && this.currentUser.role) || 'CEO');
      else if (this.currentRoute === '/signup') root.innerHTML = renderSignupPage();
      else root.innerHTML = renderLandingPage();
      this.bindStandaloneEvents();
      return;
    }

    const mainPadding = this.currentRoute === '/live-map' ? '0' : '24px 32px';
    const user = this.currentUser || defaultUser();
    root.innerHTML = `
      <div style="display:flex; width:100vw; height:100vh; overflow:hidden;">
        ${renderSidebar(this.currentRoute)}
        <div style="flex:1; display:flex; flex-direction:column; min-width:0; height:100vh; overflow:hidden;">
          ${renderHeader(this.currentRoute, user, (role) => this.setCurrentUserRole(role), () => this.logout())}
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
        case '/dashboard':
        case '/executive':
          return renderExecutiveDashboard();
        case '/diagnosis':
          return renderBusinessDiagnosisPage();
        case '/ai-analyst':
          return renderAIBusinessAnalystPage();
        case '/customers':
          return renderCustomerIntelligencePage(this.custSegment, this.custSearch);
        case '/retention':
          return renderRetentionIntelligencePage();
        case '/support':
          return renderCustomerSupportPage();
        case '/support/assistant':
        case '/ai-support':
          return renderAISupportAssistantPage();
        case '/stores':
          return renderStoreIntelligencePage(this.storeCity, this.storeSearch);
        case '/inventory':
          return renderInventoryIntelligencePage();
        case '/delivery':
          return renderDeliveryOperationsPage(this.deliveryStatus);
        case '/live-map':
          return renderLiveDeliveryMapPage();
        case '/delivery-prediction':
        case '/ai-delivery':
          return renderAIDeliveryPredictionPage();
        case '/cancellations':
          return renderCancellationIntelligencePage();
        case '/marketing':
          return renderMarketingIntelligencePage();
        case '/coupons':
          return renderCouponAnalyticsPage();
        case '/recommendations':
          return renderAIRecommendationsPage();
        case '/impact':
        case '/financial':
          return renderFinancialImpactPage();
        case '/simulator':
          return renderBusinessSimulatorPage();
        case '/analytics':
          return renderAnalyticsPage(this.analyticsTab);
        case '/alerts':
          return renderAlertsPage();
        default:
          return renderExecutiveDashboard();
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
      try {
        initLandingN3D();
      } catch (err) {}
    }

    document.querySelectorAll('.btn-demo-login').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const role = (e.currentTarget || e.target).getAttribute('data-role') || 'CEO';
        this.completeLogin({ name: 'Dr. Satish Kumar', email: 'satish@novacart.in', role, provider: 'demo' });
      });
    });

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = (document.getElementById('login-email') || {}).value || '';
        const password = (document.getElementById('login-password') || {}).value || '';
        const btn = document.getElementById('login-submit');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Signing in…';
        }
        const result = await auth.login({ email, password });
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Sign In & Enter Command Center';
        }
        if (result.ok) {
          this.completeLogin(result.user);
        } else {
          showAuthMessage(result.message || 'Login failed');
        }
      });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = (document.getElementById('signup-name') || {}).value || 'User';
        const email = (document.getElementById('signup-email') || {}).value || '';
        const password = (document.getElementById('signup-password') || {}).value || '';
        const role = (document.getElementById('signup-role') || {}).value || 'CEO';
        const btn = document.getElementById('signup-submit');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Creating account…';
        }
        const result = await auth.signup({ name, email, password, role });
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Create Account';
        }
        if (result.ok) {
          if (result.needsConfirmation) {
            showAuthMessage(result.message || 'Check your email to confirm, then sign in.', 'info');
          } else {
            this.completeLogin(result.user);
          }
        } else {
          showAuthMessage(result.message || 'Signup failed');
        }
      });
    }
  }

  bindAppEvents() {
    document.querySelectorAll('[data-nav], a[href^="#/"]').forEach((el) => {
      el.addEventListener('click', (e) => {
        const dest = el.getAttribute('data-nav') || el.getAttribute('href');
        if (dest && dest.includes('#/')) {
          e.preventDefault();
          this.navigate(dest);
        }
      });
    });
    const roleSel = document.getElementById('role-selector');
    if (roleSel) roleSel.addEventListener('change', (e) => this.setCurrentUserRole(e.target.value));
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) btnLogout.addEventListener('click', () => this.logout());
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.novaApp = new App();
  });
} else {
  window.novaApp = new App();
}
