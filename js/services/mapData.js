// NOVA CART - Live Map Data Service Layer
// All geo data for stores, vehicles, customers, routes across 3 cities

export const MAP_CITIES = {
  "Bengaluru": { center: [12.9716, 77.5946], zoom: 13, label: "Bengaluru Hub (Koramangala / Indiranagar)" },
  "Mumbai":    { center: [19.0596, 72.8295], zoom: 13, label: "Mumbai Hub (Bandra / Andheri)" },
  "Delhi-NCR": { center: [28.6304, 77.2177], zoom: 13, label: "Delhi-NCR Hub (CP / Gurgaon)" }
};

export const MAP_STORES = {
  "Bengaluru": [
    { id: "STR-BLR-01", name: "Green Leaf Mart", area: "Koramangala 5th Block", lat: 12.9352, lng: 77.6245, ordersToday: 428, activeOrders: 17, inventoryRisk: "Medium", acceptanceRate: 91, status: "healthy" },
    { id: "STR-BLR-02", name: "Urban Fresh Market", area: "Indiranagar 100ft Rd", lat: 12.9784, lng: 77.6408, ordersToday: 312, activeOrders: 11, inventoryRisk: "High", acceptanceRate: 84, status: "at_risk" },
    { id: "STR-BLR-03", name: "Daily Essentials Hub", area: "HSR Layout Sec 2", lat: 12.9116, lng: 77.6446, ordersToday: 289, activeOrders: 9, inventoryRisk: "Low", acceptanceRate: 96, status: "healthy" },
    { id: "STR-BLR-04", name: "HealthPlus Organics", area: "Bellandur", lat: 12.9260, lng: 77.6762, ordersToday: 198, activeOrders: 6, inventoryRisk: "Low", acceptanceRate: 98, status: "healthy" },
    { id: "STR-BLR-05", name: "QuickCart Superette", area: "Whitefield", lat: 12.9698, lng: 77.7499, ordersToday: 341, activeOrders: 14, inventoryRisk: "Critical", acceptanceRate: 78, status: "at_risk" }
  ],
  "Mumbai": [
    { id: "STR-MUM-01", name: "City Pantry Bandra", area: "Bandra West Hill Rd", lat: 19.0596, lng: 72.8295, ordersToday: 502, activeOrders: 21, inventoryRisk: "Low", acceptanceRate: 94, status: "healthy" },
    { id: "STR-MUM-02", name: "Express Grocery Andheri", area: "Andheri West", lat: 19.1197, lng: 72.8464, ordersToday: 388, activeOrders: 15, inventoryRisk: "Medium", acceptanceRate: 89, status: "healthy" },
    { id: "STR-MUM-03", name: "Metro Corner Juhu", area: "Juhu Beach Rd", lat: 19.1003, lng: 72.8268, ordersToday: 211, activeOrders: 8, inventoryRisk: "High", acceptanceRate: 82, status: "at_risk" }
  ],
  "Delhi-NCR": [
    { id: "STR-DEL-01", name: "Prime Groceries CP", area: "Connaught Place Inner", lat: 28.6304, lng: 77.2177, ordersToday: 618, activeOrders: 26, inventoryRisk: "Medium", acceptanceRate: 90, status: "healthy" },
    { id: "STR-DEL-02", name: "Aroma Bakery Gurgaon", area: "DLF Phase 2 MG Road", lat: 28.4744, lng: 77.0966, ordersToday: 274, activeOrders: 10, inventoryRisk: "Low", acceptanceRate: 97, status: "healthy" },
    { id: "STR-DEL-03", name: "Metro Corner Noida", area: "Noida Sector 18", lat: 28.5706, lng: 77.3219, ordersToday: 333, activeOrders: 13, inventoryRisk: "High", acceptanceRate: 81, status: "at_risk" }
  ]
};

export const MAP_DEMAND_ZONES = {
  "Bengaluru": [
    { lat: 12.9352, lng: 77.6245, radius: 800, label: "Koramangala High Demand", intensity: "HIGH" },
    { lat: 12.9784, lng: 77.6408, radius: 600, label: "Indiranagar Peak Zone", intensity: "MEDIUM" }
  ],
  "Mumbai": [
    { lat: 19.0596, lng: 72.8295, radius: 700, label: "Bandra Demand Hotspot", intensity: "HIGH" },
    { lat: 19.1197, lng: 72.8464, radius: 500, label: "Andheri Surge Zone", intensity: "MEDIUM" }
  ],
  "Delhi-NCR": [
    { lat: 28.6304, lng: 77.2177, radius: 900, label: "CP High Demand Zone", intensity: "HIGH" },
    { lat: 28.5706, lng: 77.3219, radius: 650, label: "Noida Sec-18 Demand", intensity: "MEDIUM" }
  ]
};

// Vehicle + Route data with waypoints for animation
export const MAP_VEHICLES = {
  "Bengaluru": [
    {
      vehicleId: "VH-BLR-01", orderId: "NC48291", driver: "Rajesh Kumar",
      storeId: "STR-BLR-01", storeName: "Green Leaf Mart",
      customerName: "Aarav Sharma", customerArea: "Koramangala 4th Block",
      status: "ON_TIME", eta: 14, delayReason: null,
      waypoints: [
        [12.9352, 77.6245], [12.9360, 77.6230], [12.9368, 77.6215],
        [12.9371, 77.6202], [12.9375, 77.6190], [12.9380, 77.6175],
        [12.9385, 77.6162], [12.9390, 77.6148]
      ],
      progress: 0.3
    },
    {
      vehicleId: "VH-BLR-02", orderId: "NC48292", driver: "Sunil Verma",
      storeId: "STR-BLR-02", storeName: "Urban Fresh Market",
      customerName: "Kavya Reddy", customerArea: "Indiranagar 12th Main",
      status: "AT_RISK", eta: 28, delayReason: "Heavy traffic on 100ft Road",
      waypoints: [
        [12.9784, 77.6408], [12.9776, 77.6395], [12.9768, 77.6380],
        [12.9760, 77.6365], [12.9752, 77.6350], [12.9744, 77.6335],
        [12.9736, 77.6320], [12.9728, 77.6305]
      ],
      progress: 0.15
    },
    {
      vehicleId: "VH-BLR-03", orderId: "NC48293", driver: "Mohan Das",
      storeId: "STR-BLR-03", storeName: "Daily Essentials Hub",
      customerName: "Ravi Shankar", customerArea: "BTM Layout",
      status: "DELAYED", eta: 41, delayReason: "Delivery congestion near Silk Board",
      waypoints: [
        [12.9116, 77.6446], [12.9124, 77.6430], [12.9132, 77.6415],
        [12.9140, 77.6400], [12.9148, 77.6384], [12.9156, 77.6369],
        [12.9164, 77.6353], [12.9172, 77.6338]
      ],
      progress: 0.6
    },
    {
      vehicleId: "VH-BLR-04", orderId: "NC48294", driver: "Kishore Babu",
      storeId: "STR-BLR-04", storeName: "HealthPlus Organics",
      customerName: "Ananya Roy", customerArea: "Sarjapur Road",
      status: "ON_TIME", eta: 11, delayReason: null,
      waypoints: [
        [12.9260, 77.6762], [12.9265, 77.6745], [12.9270, 77.6728],
        [12.9275, 77.6711], [12.9280, 77.6694], [12.9285, 77.6677],
        [12.9290, 77.6660], [12.9295, 77.6643]
      ],
      progress: 0.45
    },
    {
      vehicleId: "VH-BLR-05", orderId: "NC48295", driver: "Pradeep Kumar",
      storeId: "STR-BLR-05", storeName: "QuickCart Superette",
      customerName: "Pooja Singh", customerArea: "ITPL Road, Whitefield",
      status: "DELAYED", eta: 52, delayReason: "Store dispatch delayed – out of stock",
      waypoints: [
        [12.9698, 77.7499], [12.9705, 77.7480], [12.9712, 77.7461],
        [12.9719, 77.7442], [12.9726, 77.7423], [12.9733, 77.7404],
        [12.9740, 77.7385], [12.9747, 77.7366]
      ],
      progress: 0.05
    }
  ],
  "Mumbai": [
    {
      vehicleId: "VH-MUM-01", orderId: "NC48296", driver: "Vijay Shinde",
      storeId: "STR-MUM-01", storeName: "City Pantry Bandra",
      customerName: "Rohan Verma", customerArea: "Bandra Kurla Complex",
      status: "ON_TIME", eta: 9, delayReason: null,
      waypoints: [
        [19.0596, 72.8295], [19.0603, 72.8310], [19.0610, 72.8325],
        [19.0617, 72.8340], [19.0624, 72.8355], [19.0631, 72.8370],
        [19.0638, 72.8385], [19.0645, 72.8400]
      ],
      progress: 0.7
    },
    {
      vehicleId: "VH-MUM-02", orderId: "NC48297", driver: "Anil Patil",
      storeId: "STR-MUM-02", storeName: "Express Grocery Andheri",
      customerName: "Meera Joshi", customerArea: "Versova, Andheri West",
      status: "AT_RISK", eta: 24, delayReason: "Western Express Highway congestion",
      waypoints: [
        [19.1197, 72.8464], [19.1185, 72.8448], [19.1173, 72.8432],
        [19.1161, 72.8416], [19.1149, 72.8400], [19.1137, 72.8384],
        [19.1125, 72.8368], [19.1113, 72.8352]
      ],
      progress: 0.2
    },
    {
      vehicleId: "VH-MUM-03", orderId: "NC48298", driver: "Suresh Yadav",
      storeId: "STR-MUM-03", storeName: "Metro Corner Juhu",
      customerName: "Priya Patel", customerArea: "JVLR Andheri",
      status: "DELAYED", eta: 38, delayReason: "Vehicle breakdown – reassigning",
      waypoints: [
        [19.1003, 72.8268], [19.1010, 72.8283], [19.1017, 72.8298],
        [19.1024, 72.8313], [19.1031, 72.8328], [19.1038, 72.8343],
        [19.1045, 72.8358], [19.1052, 72.8373]
      ],
      progress: 0.1
    }
  ],
  "Delhi-NCR": [
    {
      vehicleId: "VH-DEL-01", orderId: "NC48299", driver: "Amit Singh",
      storeId: "STR-DEL-01", storeName: "Prime Groceries CP",
      customerName: "Vikram Malhotra", customerArea: "Lajpat Nagar",
      status: "ON_TIME", eta: 18, delayReason: null,
      waypoints: [
        [28.6304, 77.2177], [28.6290, 77.2192], [28.6276, 77.2207],
        [28.6262, 77.2222], [28.6248, 77.2237], [28.6234, 77.2252],
        [28.6220, 77.2267], [28.6206, 77.2282]
      ],
      progress: 0.4
    },
    {
      vehicleId: "VH-DEL-02", orderId: "NC48300", driver: "Deepak Sharma",
      storeId: "STR-DEL-02", storeName: "Aroma Bakery Gurgaon",
      customerName: "Sneha Nair", customerArea: "Sushant Lok, Gurgaon",
      status: "AT_RISK", eta: 31, delayReason: "NH-48 toll plaza backup",
      waypoints: [
        [28.4744, 77.0966], [28.4752, 77.0978], [28.4760, 77.0990],
        [28.4768, 77.1002], [28.4776, 77.1014], [28.4784, 77.1026],
        [28.4792, 77.1038], [28.4800, 77.1050]
      ],
      progress: 0.25
    },
    {
      vehicleId: "VH-DEL-03", orderId: "NC48301", driver: "Ravi Chauhan",
      storeId: "STR-DEL-03", storeName: "Metro Corner Noida",
      customerName: "Kabir Das", customerArea: "Noida Sector 62",
      status: "DELAYED", eta: 47, delayReason: "Road construction diversion",
      waypoints: [
        [28.5706, 77.3219], [28.5715, 77.3234], [28.5724, 77.3249],
        [28.5733, 77.3264], [28.5742, 77.3279], [28.5751, 77.3294],
        [28.5760, 77.3309], [28.5769, 77.3324]
      ],
      progress: 0.08
    }
  ]
};

export function getMapSummary(city) {
  const vehicles = MAP_VEHICLES[city] || [];
  return {
    total: vehicles.length,
    onTime:  vehicles.filter(v => v.status === 'ON_TIME').length,
    atRisk:  vehicles.filter(v => v.status === 'AT_RISK').length,
    delayed: vehicles.filter(v => v.status === 'DELAYED').length
  };
}
