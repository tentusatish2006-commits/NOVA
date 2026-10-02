// NOVA CART - Master Application Router & Event Manager
// Fixed 2026-10-02: LiveDeliveryMap nested-backtick SyntaxError
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
    // GitHub Pages project path
    if (raw.startsWith('/NOVA')) raw = raw.replace('/NOVA', '') || '/';
    this.currentRoute = raw;
  }

  init() {
    try {
      this.canvas = new Canvas3D('canvas-container');
    } catch (e) {
      console.warn("3D canvas init error fallback:", e);
    }

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

    const isStandalone = this.currentRoute === '/' || this.currentRoute === '/login' || this.currentRoute === '/signup';

    if (isStandalone) {
      if (this.currentRoute === '/login') root.innerHTML = renderLoginPage(this.currentUser.role);
      else if (this.currentRoute === '/signup') root.innerHTML = renderSignupPage();
      else root.innerHTML = renderLandingPage();
      this.bindEvents();
      return;
    }

    // Layout with sidebar + header
    root.innerHTML = `
      <div class="app-shell" style="display:flex; min-height:100vh;">
        ${renderSidebar(this.currentRoute, this.currentUser)}
        <div class="main-content" style="flex:1; display:flex; flex-direction:column; overflow:hidden;">
          ${renderHeader(this.currentUser)}
          <main id="page-content" style="flex:1; overflow:auto; padding:20px;">
            ${this.renderPage()}
          </main>
        </div>
      </div>
    `;

    // Post-render map init
    if (this.currentRoute === '/live-map') {
      setTimeout(() => initLiveMapLeaflet(this.storeCity !== 'All' ? this.storeCity : 'Bengaluru'), 100);
    }

    this.bindEvents();
  }

  renderPage() {
    const r = this.currentRoute;
    try {
      if (r === '/dashboard' || r === '/executive') return renderExecutiveDashboard();
      if (r === '/diagnosis') return renderBusinessDiagnosisPage();
      if (r === '/ai-analyst') return renderAIBusinessAnalystPage();
      if (r === '/customers') return renderCustomerIntelligencePage(this.custSegment, this.custSearch);
      if (r === '/retention') return renderRetentionIntelligencePage();
      if (r === '/support') return renderCustomerSupportPage();
      if (r === '/ai-support') return renderAISupportAssistantPage();
      if (r === '/stores') return renderStoreIntelligencePage(this.storeCity, this.storeSearch);
      if (r === '/inventory') return renderInventoryIntelligencePage();
      if (r === '/delivery') return renderDeliveryOperationsPage(this.deliveryStatus);
      if (r === '/live-map') return renderLiveDeliveryMapPage();
      if (r === '/ai-delivery') return renderAIDeliveryPredictionPage();
      if (r === '/cancellations') return renderCancellationIntelligencePage();
      if (r === '/marketing') return renderMarketingIntelligencePage();
      if (r === '/coupons') return renderCouponAnalyticsPage();
      if (r === '/recommendations') return renderAIRecommendationsPage();
      if (r === '/financial') return renderFinancialImpactPage();
      if (r === '/simulator') return renderBusinessSimulatorPage();
      if (r === '/analytics') return renderAnalyticsPage(this.analyticsTab);
      if (r === '/alerts') return renderAlertsPage();
      return renderExecutiveDashboard();
    } catch (e) {
      console.error('Page render error', e);
      return `<div class="glass-card" style="padding:24px;"><h2>Page Error</h2><pre>${e.message}</pre></div>`;
    }
  }

  bindEvents() {
    // Basic navigation already handled by hash links in sidebar
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = el.getAttribute('data-nav');
      });
    });

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());
  }
}

// Instantiate Master App
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    window.novaApp = new App();
  });
} else {
  window.novaApp = new App();
}
