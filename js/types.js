// NOVA CART - Types & Domain Constants

export const CASE_METRICS = {
  registeredUsers: { initial: 82000, current: 120000, label: "Registered Users" },
  monthlyActiveUsers: { initial: 39000, current: 46000, label: "Monthly Active Users" },
  monthlyOrders: { initial: 31200, current: 38500, label: "Monthly Orders" },
  averageOrderValue: { initial: 452, current: 486, currency: "₹", label: "Average Order Value" },
  repeatPurchaseRate: { initial: 41, current: 27, unit: "%", label: "Repeat Purchase Rate", status: "critical_decline" },
  averageDeliveryMinutes: { initial: 29, current: 37, unit: "min", label: "Average Delivery Time", status: "delay_spike" },
  cancellationRate: { initial: 6, current: 11, unit: "%", label: "Cancellation Rate", status: "high_risk" },
  monthlySupportTickets: { initial: 3100, current: 5900, label: "Support Tickets / Month", status: "ticket_surge" },
  promotionalSpending: { initial: 950000, current: 1700000, currency: "₹", display: "₹17L/mo", status: "promo_waste" },
  monthlyRevenue: { initial: 2180000, current: 2610000, currency: "₹", display: "₹26.1L/mo", label: "Monthly Revenue" }
};

export const CITIES = ["Bengaluru", "Mumbai", "Delhi-NCR"];

export const STORE_CATEGORIES = [
  "Fresh Grocery & Produce",
  "Dairy & Bakery",
  "Pharma & Wellness",
  "Snacks & Beverages",
  "Personal Care",
  "Household Essentials"
];

export const USER_ROLES = [
  "CEO",
  "Operations Manager",
  "Marketing Manager",
  "Store Manager",
  "Analyst",
  "Admin"
];
