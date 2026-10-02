// NOVA CART - Database & Storage Service Layer
import { CASE_METRICS, CITIES, STORE_CATEGORIES } from '../types.js';

const DB_KEY = 'nova_cart_db_v1';

function generateInitialData() {
  // Generate 620 stores representation
  const stores = [];
  const cities = CITIES;
  const storeNames = [
    "Green Leaf Mart", "Express Grocery 24/7", "Urban Fresh Market", 
    "Daily Essentials Hub", "City Pantry", "Aroma Bakery & Dairy", 
    "HealthPlus Organics", "QuickCart Superette", "Metro Corner Store", "Prime Groceries"
  ];
  
  for (let i = 1; i <= 620; i++) {
    const city = cities[i % cities.length];
    const category = STORE_CATEGORIES[i % STORE_CATEGORIES.length];
    const name = `${storeNames[i % storeNames.length]} #${i}`;
    const orders = Math.floor(40 + Math.random() * 90);
    const rejectionRate = parseFloat((Math.random() * 12 + (i % 3 === 0 ? 8 : 2)).toFixed(1));
    const invAccuracy = parseFloat((82 + Math.random() * 16 - (rejectionRate > 10 ? 12 : 0)).toFixed(1));
    
    stores.push({
      id: `STR-${1000 + i}`,
      name,
      city,
      category,
      ordersPerDay: orders,
      monthlyRevenue: Math.floor(orders * 486 * 30),
      inventoryAccuracy: invAccuracy,
      rejectionRate,
      status: rejectionRate > 10 ? "at_risk" : "healthy",
      rating: parseFloat((4.1 + Math.random() * 0.8).toFixed(1)),
      openHours: "07:00 - 23:00",
      contact: `+91 98765 ${Math.floor(10000 + Math.random() * 90000)}`
    });
  }

  // Generate Customer Samples
  const customers = [
    { id: "CUST-901", name: "Aarav Sharma", city: "Bengaluru", orders: 18, totalSpend: 8920, avgOrder: 495, lastOrder: "2026-09-28", repeatStatus: "At Risk", retentionRisk: "HIGH", couponsUsed: 4, deliveryComplaints: 3 },
    { id: "CUST-902", name: "Priya Patel", city: "Mumbai", orders: 32, totalSpend: 16400, avgOrder: 512, lastOrder: "2026-10-01", repeatStatus: "Active Regular", retentionRisk: "LOW", couponsUsed: 8, deliveryComplaints: 0 },
    { id: "CUST-903", name: "Vikram Malhotra", city: "Delhi-NCR", orders: 2, totalSpend: 920, avgOrder: 460, lastOrder: "2026-08-15", repeatStatus: "Churned / Inactive", retentionRisk: "HIGH", couponsUsed: 1, deliveryComplaints: 2 },
    { id: "CUST-904", name: "Ananya Roy", city: "Bengaluru", orders: 12, totalSpend: 5640, avgOrder: 470, lastOrder: "2026-09-19", repeatStatus: "At Risk", retentionRisk: "HIGH", couponsUsed: 5, deliveryComplaints: 2 },
    { id: "CUST-905", name: "Rohan Verma", city: "Mumbai", orders: 45, totalSpend: 23100, avgOrder: 513, lastOrder: "2026-10-01", repeatStatus: "High Value VIP", retentionRisk: "LOW", couponsUsed: 12, deliveryComplaints: 1 },
    { id: "CUST-906", name: "Sneha Nair", city: "Delhi-NCR", orders: 5, totalSpend: 2250, avgOrder: 450, lastOrder: "2026-09-02", repeatStatus: "At Risk", retentionRisk: "MEDIUM", couponsUsed: 3, deliveryComplaints: 1 },
    { id: "CUST-907", name: "Kabir Das", city: "Bengaluru", orders: 1, totalSpend: 480, avgOrder: 480, lastOrder: "2026-07-10", repeatStatus: "First-Order Drop-off", retentionRisk: "HIGH", couponsUsed: 1, deliveryComplaints: 1 },
    { id: "CUST-908", name: "Meera Joshi", city: "Mumbai", orders: 22, totalSpend: 11200, avgOrder: 509, lastOrder: "2026-09-30", repeatStatus: "Active Regular", retentionRisk: "LOW", couponsUsed: 6, deliveryComplaints: 0 }
  ];

  // Active Live Orders & Delivery Partners
  const deliveries = [
    { id: "ORD-8821", store: "Urban Fresh Market #1", customer: "Aarav Sharma", driver: "Rajesh Kumar", city: "Bengaluru", distanceKm: 3.4, etaMin: 42, actualMin: null, status: "Delayed", delayRisk: "HIGH", lat: 12.9716, lng: 77.5946, storeLat: 12.9650, storeLng: 77.5850 },
    { id: "ORD-8822", store: "City Pantry #3", customer: "Priya Patel", driver: "Suresh Yadav", city: "Mumbai", distanceKm: 1.8, etaMin: 24, actualMin: 22, status: "On Time", delayRisk: "LOW", lat: 19.0760, lng: 72.8777, storeLat: 19.0700, storeLng: 72.8700 },
    { id: "ORD-8823", store: "Metro Corner Store #7", customer: "Vikram Malhotra", driver: "Amit Singh", city: "Delhi-NCR", distanceKm: 5.2, etaMin: 48, actualMin: null, status: "At Risk", delayRisk: "HIGH", lat: 28.6139, lng: 77.2090, storeLat: 28.6000, storeLng: 77.1950 },
    { id: "ORD-8824", store: "HealthPlus Organics #2", customer: "Ananya Roy", driver: "Sunil Verma", city: "Bengaluru", distanceKm: 2.1, etaMin: 36, actualMin: 35, status: "Delayed", delayRisk: "MEDIUM", lat: 12.9352, lng: 77.6245, storeLat: 12.9400, storeLng: 77.6180 },
    { id: "ORD-8825", store: "Express Grocery #12", customer: "Rohan Verma", driver: "Vijay Shinde", city: "Mumbai", distanceKm: 1.2, etaMin: 18, actualMin: 17, status: "Completed", delayRisk: "LOW", lat: 19.1197, lng: 72.8464, storeLat: 19.1150, storeLng: 72.8420 }
  ];

  // Inventory Risk Samples
  const inventoryItems = [
    { id: "INV-101", product: "Amul Taaza Milk 1L", store: "Green Leaf Mart #1", currentStock: 4, avgDailyDemand: 28, risk: "CRITICAL", predictedStockoutHours: 2.5, recommendation: "Urgent auto-restock dispatch from dark store hub." },
    { id: "INV-102", product: "Aashirvaad Atta 5kg", store: "Urban Fresh Market #3", currentStock: 2, avgDailyDemand: 14, risk: "HIGH", predictedStockoutHours: 4.0, recommendation: "Re-route buffer stock from Express Grocery #5." },
    { id: "INV-103", product: "Fortune Sunlite Oil 1L", store: "Daily Essentials Hub #8", currentStock: 0, avgDailyDemand: 18, risk: "CRITICAL", predictedStockoutHours: 0, recommendation: "Item unavailable - trigger smart substitution popup." },
    { id: "INV-104", product: "Britannia Bread 400g", store: "City Pantry #2", currentStock: 6, avgDailyDemand: 35, risk: "HIGH", predictedStockoutHours: 3.0, recommendation: "Initiate local baker top-up order." }
  ];

  // Support Tickets (Case figure: 5,900/mo)
  const tickets = [
    { id: "TCK-4091", customer: "Aarav Sharma", orderId: "ORD-8821", category: "Delivery Delay", priority: "HIGH", status: "OPEN", created: "2026-10-02 10:15", summary: "Order delayed by 18 mins past SLA. Customer frustrated.", suggestedResolution: "Issue ₹50 compensation credit + dispatch priority express driver." },
    { id: "TCK-4092", customer: "Ananya Roy", orderId: "ORD-8824", category: "Missing / Unavailable Item", priority: "MEDIUM", status: "OPEN", created: "2026-10-02 09:40", summary: "Milk carton missing from delivery bag.", suggestedResolution: "Instant refund of ₹72 to Nova Wallet." },
    { id: "TCK-4093", customer: "Kabir Das", orderId: "ORD-8710", category: "Coupon Unapplied", priority: "LOW", status: "RESOLVED", created: "2026-10-01 16:20", summary: "PROMO20 coupon code failed at checkout.", suggestedResolution: "Manually credit ₹96 promo discount." }
  ];

  // Marketing Campaigns & Coupons (Case signal: 44% unused coupons)
  const coupons = [
    { code: "RESCUE20", discount: "20% OFF", issued: 15000, redeemed: 8400, unusedRate: "44%", cost: 420000, status: "Active", recommendation: "Modify minimum order value from ₹300 to ₹400 to prevent margin erosion." },
    { code: "SUPER50", discount: "₹50 FLAT", issued: 22000, redeemed: 11880, unusedRate: "46%", cost: 594000, status: "Underperforming", recommendation: "Retire flat coupon. Replace with 2nd-order retention milestone unlock." },
    { code: "WELCOME100", discount: "₹100 OFF", issued: 18000, redeemed: 12600, unusedRate: "30%", cost: 1260000, status: "High Cost", recommendation: "Limit welcome coupon to high-margin basket sizes > ₹600." }
  ];

  // Pre-configured AI Business Recommendations
  const recommendations = [
    {
      id: "REC-01",
      title: "Second-Order Retention Intervention Program",
      problem: "Repeat purchase rate collapsed from 41% to 27% while registered users grew 46%.",
      evidence: "54% 1st-order conversion, but 30-day 2nd-order conversion dropped to 31%.",
      severity: "CRITICAL",
      recommendation: "Implement automated 2nd-order delivery SLA guarantee + personalized post-order cashback trigger within 48 hours.",
      expectedMetric: "Repeat purchase rate increase from 27% → 36% within 60 days.",
      assumptions: "Targeted ₹40 cashback per 1st-order customer costs less than unredeemed broad promos.",
      status: "PENDING_REVIEW"
    },
    {
      id: "REC-02",
      title: "Store Inventory Pre-allocation & Substitution Engine",
      problem: "Order cancellation rate surged from 6% to 11%, driven 42% by out-of-stock items post-acceptance.",
      evidence: "Inventory accuracy across 620 stores dropped to 84.2%.",
      severity: "HIGH",
      recommendation: "Deploy real-time POS stock sync for top 100 SKUs & instant 1-click substitute approval before store dispatch.",
      expectedMetric: "Cancellation rate reduction from 11% → 6.5%.",
      assumptions: "Store POS integration reduces ghost stock cancellations by 60%.",
      status: "ACCEPTED"
    },
    {
      id: "REC-03",
      title: "Hyperlocal Delivery Fleet Re-balancing",
      problem: "Average delivery time increased from 29 min to 37 min, generating 52% of support tickets.",
      evidence: "Support tickets surged from 3,100 to 5,900/month.",
      severity: "HIGH",
      recommendation: "Dynamic peak-hour partner assignment & store dispatch queuing.",
      expectedMetric: "Average delivery time reduction to 28 min.",
      assumptions: "Dynamic surge routing saves 6-8 mins per delivery trip.",
      status: "IN_PROGRESS"
    }
  ];

  // Real-time Alerts Center
  const alerts = [
    { id: "ALT-101", title: "Delivery SLA Breach Warning", category: "Delivery", severity: "CRITICAL", description: "Bengaluru Koramangala zone delivery times averaging 43 min (+14 min over target).", timestamp: "10 mins ago", status: "UNACKNOWLEDGED" },
    { id: "ALT-102", title: "High Store Rejection Rate", category: "Store", severity: "HIGH", description: "City Pantry #3 store rejection rate reached 14.2% today.", timestamp: "25 mins ago", status: "UNACKNOWLEDGED" },
    { id: "ALT-103", title: "Milk Stock Out Alert", category: "Inventory", severity: "HIGH", description: "12 partner stores in Delhi-NCR reporting zero stock for fresh dairy.", timestamp: "1 hour ago", status: "ACKNOWLEDGED" }
  ];

  // Saved Simulation Scenarios
  const simulationScenarios = [
    { id: "SIM-01", name: "Baseline Current State", repeatRate: 27, deliveryMin: 37, cancellationRate: 11, promoSpendLakhs: 17, projectedMonthlyRevenueLakhs: 26.1, netProfitMargin: "8.2%" },
    { id: "SIM-02", name: "Target Recovery Plan", repeatRate: 36, deliveryMin: 28, cancellationRate: 6, promoSpendLakhs: 12, projectedMonthlyRevenueLakhs: 34.8, netProfitMargin: "16.4%" }
  ];

  return {
    metrics: CASE_METRICS,
    stores,
    customers,
    deliveries,
    inventoryItems,
    tickets,
    coupons,
    recommendations,
    alerts,
    simulationScenarios
  };
}

class StorageEngine {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("LocalStorage access issue, using in-memory state:", e);
    }
    const init = generateInitialData();
    this.save(init);
    return init;
  }

  save(data = this.data) {
    this.data = data;
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist data:", e);
    }
  }

  reset() {
    localStorage.removeItem(DB_KEY);
    this.data = generateInitialData();
    this.save();
    return this.data;
  }

  // Getters
  getMetrics() { return this.data.metrics; }
  getStores(filterCity = null, search = null) {
    let list = this.data.stores;
    if (filterCity && filterCity !== 'All') {
      list = list.filter(s => s.city === filterCity);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return list;
  }

  getCustomers(segment = 'All', search = null) {
    let list = this.data.customers;
    if (segment !== 'All') {
      list = list.filter(c => c.repeatStatus.toLowerCase().includes(segment.toLowerCase()) || c.retentionRisk === segment);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    return list;
  }

  getDeliveries(status = 'All') {
    if (status === 'All') return this.data.deliveries;
    return this.data.deliveries.filter(d => d.status === status);
  }

  getInventory() { return this.data.inventoryItems; }
  getTickets() { return this.data.tickets; }
  getCoupons() { return this.data.coupons; }
  getRecommendations() { return this.data.recommendations; }
  getAlerts() { return this.data.alerts; }
  getSimulations() { return this.data.simulationScenarios; }

  // Mutations
  updateRecommendationStatus(id, newStatus) {
    const rec = this.data.recommendations.find(r => r.id === id);
    if (rec) {
      rec.status = newStatus;
      this.save();
    }
  }

  resolveTicket(id, resolutionText) {
    const t = this.data.tickets.find(tk => tk.id === id);
    if (t) {
      t.status = "RESOLVED";
      t.suggestedResolution = resolutionText;
      this.save();
    }
  }

  acknowledgeAlert(id) {
    const alt = this.data.alerts.find(a => a.id === id);
    if (alt) {
      alt.status = "ACKNOWLEDGED";
      this.save();
    }
  }

  saveSimulation(scenario) {
    this.data.simulationScenarios.push(scenario);
    this.save();
  }
}

export const db = new StorageEngine();
