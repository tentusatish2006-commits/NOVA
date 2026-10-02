// NOVA CART - Full Live 3D Delivery Map Page (/live-map)
import { MAP_CITIES, MAP_STORES, MAP_VEHICLES, MAP_DEMAND_ZONES, getMapSummary } from '../services/mapData.js';
import { openModal } from '../components/Modal.js';

// ─── Module-level persistent map & simulation state ───
let _mapInstance       = null;
let _tileLayerInstance = null;
let _simInterval        = null;
let _vehicleMarkers     = {};    // vehicleId → Leaflet marker
let _vehicleLines       = {};    // vehicleId → Leaflet polyline
let _vehicleData        = {};    // vehicleId → live copy of vehicle object
let _storeMarkers       = {};
let _pinMarkers         = [];    // Start (Green) & End (Red) pins
let _demandCircles      = [];
let _routeLines         = [];
let _simActive          = false;
let _currentCity        = 'Bengaluru';
let _currentTileTheme   = 'voyager'; // 'voyager', 'dark', 'mapbox', 'osm'
let _currentApiKey      = localStorage.getItem('nova_map_api_key') || 'pk.eyJ1Ijoibm92YWNhcnQiLCJhIjoiY2x5eG5vd2FjYXJ0MDAwMSJ9.demo_token';
let _layers             = { stores: true, vehicles: true, routes: true, demand: true };

// Tile layer URL configurations
const TILE_THEMES = {
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CartoDB Voyager</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CartoDB Dark</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
    subdomains: 'abcd',
    maxZoom: 20
  },
  mapbox: {
    getUrl: (key) => `https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/tiles/{z}/{x}/{y}?access_token=${key}`,
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> &copy; OpenStreetMap',
    maxZoom: 19
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abc',
    maxZoom: 19
  }
};

// SVG Green Pin (Origin Store / Start location matching user image)
const GREEN_PIN_SVG = `
<svg width="34" height="46" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.4));">
  <path d="M18 0C8.05887 0 0 8.05887 0 18C0 29.25 15.75 45.75 17.1562 47.2031C17.625 47.6875 18.375 47.6875 18.8438 47.2031C20.25 45.75 36 29.25 36 18C36 8.05887 27.9411 0 18 0Z" fill="#10B981" stroke="#047857" stroke-width="2"/>
  <circle cx="18" cy="18" r="8" fill="white"/>
</svg>`;

// SVG Red Pin (Customer Dropoff Destination matching user image)
const RED_PIN_SVG = `
<svg width="34" height="46" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.4));">
  <path d="M18 0C8.05887 0 0 8.05887 0 18C0 29.25 15.75 45.75 17.1562 47.2031C17.625 47.6875 18.375 47.6875 18.8438 47.2031C20.25 45.75 36 29.25 36 18C36 8.05887 27.9411 0 18 0Z" fill="#F43F5E" stroke="#BE123C" stroke-width="2"/>
  <circle cx="18" cy="18" r="8" fill="white"/>
</svg>`;

// ─── Render: HTML Shell ──────────────────────────────────────────────────────
export function renderLiveDeliveryMapPage() {
  const apiKeyTrunc = _currentApiKey ? _currentApiKey.substring(0, 10) + '...' : 'Configured';

  return `
    <!-- Map root fills height strictly to viewport space -->
    <div id="live-map-root" style="display:flex; width:100%; height:calc(100vh - 65px); min-height:calc(100vh - 65px); overflow:hidden; position:relative; background: #0b0f19;">

      <!-- ══════════════════ LEFT CONTROL STRIP ══════════════════ -->
      <div id="map-controls-strip" class="glass-panel" style="
        width: 56px; flex-shrink:0; height:100%;
        display:flex; flex-direction:column; align-items:center;
        gap:8px; padding:14px 0; border-radius:0;
        border-right:1px solid rgba(255,255,255,0.08);
        z-index:900; overflow:hidden;">

        <!-- Zoom In -->
        <button class="map-ctrl-btn" id="btn-map-zoomin"  title="Zoom In"     onclick="window._novaMap && window._novaMap.zoomIn()">＋</button>
        <!-- Zoom Out -->
        <button class="map-ctrl-btn" id="btn-map-zoomout" title="Zoom Out"    onclick="window._novaMap && window._novaMap.zoomOut()">－</button>
        <!-- Recenter -->
        <button class="map-ctrl-btn" id="btn-map-recenter" title="Re-center"  onclick="window._novaMapRecenter && window._novaMapRecenter()">◎</button>

        <div style="width:32px;height:1px;background:rgba(255,255,255,0.1);margin:4px 0;"></div>

        <!-- Layer Toggles -->
        <button class="map-ctrl-btn map-layer-toggle" id="lyr-stores"  title="Stores"  data-layer="stores"  style="background:rgba(0,243,255,0.15);border-color:rgba(0,243,255,0.4);">🏪</button>
        <button class="map-ctrl-btn map-layer-toggle" id="lyr-vehicles"title="Vehicles"data-layer="vehicles"style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);">🛵</button>
        <button class="map-ctrl-btn map-layer-toggle" id="lyr-routes"  title="Routes"  data-layer="routes"  style="background:rgba(59,130,246,0.15);border-color:rgba(59,130,246,0.4);">📍</button>
        <button class="map-ctrl-btn map-layer-toggle" id="lyr-demand"  title="Demand Zones" data-layer="demand" style="background:rgba(139,92,246,0.15);border-color:rgba(139,92,246,0.4);">🟣</button>

        <div style="width:32px;height:1px;background:rgba(255,255,255,0.1);margin:4px 0;"></div>

        <!-- Simulation toggle -->
        <button class="map-ctrl-btn" id="btn-map-sim" title="Simulation Mode" style="font-size:10px;padding:6px 2px;line-height:1.2;color:var(--neon-amber);">⚡<br>SIM</button>
      </div>

      <!-- ══════════════════ MAP CONTAINER ══════════════════ -->
      <div style="flex:1; position:relative; height:100%; min-height:100%; overflow:hidden;">

        <!-- Top Floating Toolbar -->
        <div style="position:absolute; top:14px; left:16px; right:16px; z-index:800;
                    display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <div class="glass-panel" style="padding:8px 16px; border-radius:12px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; flex:1; background:rgba(11,15,25,0.92); border:1px solid rgba(255,255,255,0.12);">
            
            <!-- City Selector -->
            <select id="map-city-selector" class="input-futuristic" style="height:34px; font-size:12px; padding:4px 10px; width:210px; background:#0f172a; color:#fff; border-radius:8px; border:1px solid rgba(0,243,255,0.3);">
              <option value="Bengaluru">📍 Bengaluru (Koramangala / Indiranagar)</option>
              <option value="Mumbai">📍 Mumbai (Bandra / Andheri)</option>
              <option value="Delhi-NCR">📍 Delhi-NCR (CP / Gurgaon / Noida)</option>
            </select>

            <!-- Map Tile Theme Selector -->
            <select id="map-tile-theme-selector" class="input-futuristic" style="height:34px; font-size:12px; padding:4px 10px; width:180px; background:#0f172a; color:#fff; border-radius:8px; border:1px solid rgba(0,243,255,0.3);">
              <option value="voyager">🗺 Vector Street Map (Light)</option>
              <option value="dark">🌙 Futuristic Dark Map</option>
              <option value="mapbox">🗺 Mapbox Vector Navigation</option>
              <option value="osm">🛰 Standard OpenStreetMap</option>
            </select>

            <!-- Map API Key Config Button -->
            <button id="btn-map-api-key" class="btn-futuristic-secondary" style="height:34px; font-size:11px; padding:4px 12px; display:flex; align-items:center; gap:6px; background:rgba(0,243,255,0.08); border:1px solid rgba(0,243,255,0.3); color:var(--neon-cyan); cursor:pointer; border-radius:8px;">
              🔑 API Key: <span style="font-family:monospace; color:#fff;" id="apiKey-status-label">${apiKeyTrunc}</span>
            </button>

            <!-- Live indicator badge -->
            <div style="display:flex;align-items:center;gap:6px; background:rgba(16,185,129,0.1); padding:4px 10px; border-radius:20px; border:1px solid rgba(16,185,129,0.3);">
              <div class="map-live-dot"></div>
              <span style="font-size:11px;font-family:var(--font-mono);color:var(--neon-emerald);font-weight:700;">LIVE TELEMETRY</span>
            </div>

            <!-- Summary badges updated dynamically -->
            <div id="map-summary-badges" style="display:flex;gap:8px;flex-wrap:wrap;margin-left:auto;"></div>
          </div>

          <!-- Sim status chip -->
          <div id="sim-status-chip" style="display:none;" class="glass-panel glow-amber" style="padding:8px 14px; border-radius:12px; background:rgba(245,158,11,0.15); border:1px solid #f59e0b;">
            <span style="font-size:11px;font-family:var(--font-mono);color:var(--neon-amber);font-weight:700;">⚡ SIMULATION ACTIVE</span>
          </div>
        </div>

        <!-- Leaflet map element -->
        <div id="live-leaflet-map" style="width:100%; height:100%; min-height:100%; z-index:1; background:#0f172a;"></div>

        <!-- Bottom Legend Floating Bar -->
        <div class="glass-panel" style="
          position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
          z-index:800; padding:8px 22px; border-radius:30px;
          display:flex; align-items:center; gap:16px; flex-wrap:wrap;
          font-size:11px; font-family:var(--font-mono); white-space:nowrap;
          background:rgba(11,15,25,0.92); border:1px solid rgba(255,255,255,0.12);">
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;display:inline-block;"></span>🟢 Start (Store Pin)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:12px;height:12px;border-radius:50%;background:#f43f5e;box-shadow:0 0 8px #f43f5e;display:inline-block;"></span>🔴 End (Customer Pin)</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:#00f3ff;box-shadow:0 0 8px #00f3ff;display:inline-block;"></span>🛵 Vehicle</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:#f59e0b;box-shadow:0 0 8px #f59e0b;display:inline-block;"></span>At Risk</span>
          <span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:50%;background:#8b5cf6;box-shadow:0 0 8px #8b5cf6;display:inline-block;"></span>Demand Zone</span>
        </div>
      </div>

      <!-- ══════════════════ RIGHT SIDEBAR ══════════════════ -->
      <div id="map-right-sidebar" class="glass-panel" style="
        width: 290px; flex-shrink:0; height:100%;
        display:flex; flex-direction:column;
        border-radius:0; border-left:1px solid rgba(255,255,255,0.08);
        overflow:hidden; z-index:900; background:rgba(11,15,25,0.95);">

        <!-- Delivery Status Header -->
        <div style="padding:16px 16px 12px; border-bottom:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:10px;font-family:var(--font-mono);color:var(--text-dim);letter-spacing:1px;margin-bottom:8px;">DELIVERY STATUS AUDIT</div>
          <div id="sidebar-status-counts" style="display:flex;flex-direction:column;gap:6px;"></div>
        </div>

        <!-- Live Orders List -->
        <div style="flex:1; overflow-y:auto; padding:12px 10px;">
          <div style="font-size:10px;font-family:var(--font-mono);color:var(--text-dim);letter-spacing:1px;margin-bottom:10px;padding:0 6px;">ACTIVE DELIVERY ROUTES</div>
          <div id="sidebar-orders-list" style="display:flex;flex-direction:column;gap:6px;"></div>
        </div>

        <!-- Selected vehicle detail card -->
        <div id="sidebar-vehicle-detail" style="display:none; border-top:1px solid rgba(255,255,255,0.08); padding:14px; background:rgba(0,243,255,0.04);"></div>

        <!-- Sim toggle bottom -->
        <div style="padding:12px 14px; border-top:1px solid rgba(255,255,255,0.08);">
          <button id="btn-sim-toggle" class="btn-futuristic" style="width:100%;justify-content:center;font-size:12px;padding:10px;">
            ⚡ Start Simulation Mode
          </button>
        </div>
      </div>

    </div>
  `;
}

// ─── Main Map Initializer ────────────────────────────────────────────────────
export function initLiveMapLeaflet(city = 'Bengaluru') {
  _currentCity = city;

  // Stop existing simulation
  if (_simInterval) { clearInterval(_simInterval); _simInterval = null; _simActive = false; }

  // Deep-clone vehicle data so we can mutate ETAs / positions
  const rawVehicles = MAP_VEHICLES[city] || [];
  _vehicleData = {};
  rawVehicles.forEach(v => { _vehicleData[v.vehicleId] = JSON.parse(JSON.stringify(v)); });

  const mapEl = document.getElementById('live-leaflet-map');
  if (!mapEl) return;

  if (typeof L === 'undefined') {
    console.warn("Leaflet library not ready yet, retrying initialization in 200ms...");
    setTimeout(() => initLiveMapLeaflet(city), 200);
    return;
  }

  // Destroy previous Leaflet instance if present
  if (_mapInstance) {
    _mapInstance.remove();
    _mapInstance = null;
    _storeMarkers = {};
    _vehicleMarkers = {};
    _vehicleLines = {};
    _pinMarkers = [];
    _demandCircles = [];
    _routeLines = [];
  }

  const cityConf = MAP_CITIES[city] || MAP_CITIES['Bengaluru'];

  // Instantiate Leaflet map
  _mapInstance = L.map('live-leaflet-map', {
    center: cityConf.center,
    zoom: cityConf.zoom,
    zoomControl: false,
    scrollWheelZoom: true,
    attributionControl: true
  });

  // Attach Tile Layer
  _setMapTileTheme(_currentTileTheme);

  // Expose global helpers
  window._novaMap = _mapInstance;
  window._novaMapRecenter = () => _mapInstance.setView(cityConf.center, cityConf.zoom);

  // Draw Map Elements
  _drawDemandZones(city);
  _drawStores(city);
  _drawVehiclesAndRoutes(city);

  // Update UI components
  _updateSummaryBadges(city);
  _updateRightSidebar(city);

  // Bind dropdown controls
  const selCity = document.getElementById('map-city-selector');
  if (selCity) {
    selCity.value = city;
    selCity.onchange = e => initLiveMapLeaflet(e.target.value);
  }

  const selTheme = document.getElementById('map-tile-theme-selector');
  if (selTheme) {
    selTheme.value = _currentTileTheme;
    selTheme.onchange = e => {
      _currentTileTheme = e.target.value;
      _setMapTileTheme(_currentTileTheme);
    };
  }

  // Bind API Key Button
  const btnApiKey = document.getElementById('btn-map-api-key');
  if (btnApiKey) {
    btnApiKey.onclick = _openApiKeyModal;
  }

  // Bind layer toggle buttons
  document.querySelectorAll('.map-layer-toggle').forEach(btn => {
    btn.onclick = () => {
      const layer = btn.getAttribute('data-layer');
      _layers[layer] = !_layers[layer];
      btn.style.opacity = _layers[layer] ? '1' : '0.35';
      _applyLayerVisibility();
    };
  });

  // Bind simulation buttons
  ['btn-map-sim', 'btn-sim-toggle'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.onclick = _toggleSimulation;
  });

  // Ensure tile sizing resolves cleanly
  setTimeout(() => {
    if (_mapInstance) {
      _mapInstance.invalidateSize();
    }
  }, 250);
}

// ─── Set Map Tile Theme ─────────────────────────────────────────────────────
function _setMapTileTheme(themeKey) {
  if (!_mapInstance) return;
  if (_tileLayerInstance) {
    _mapInstance.removeLayer(_tileLayerInstance);
  }
  const theme = TILE_THEMES[themeKey] || TILE_THEMES['voyager'];
  const tileUrl = theme.getUrl ? theme.getUrl(_currentApiKey) : theme.url;

  _tileLayerInstance = L.tileLayer(tileUrl, {
    attribution: theme.attribution,
    subdomains: theme.subdomains || 'abc',
    maxZoom: theme.maxZoom || 19
  }).addTo(_mapInstance);
}

// ─── Open API Key Modal ──────────────────────────────────────────────────────
function _openApiKeyModal() {
  openModal(
    '🔑 Leaflet Map Tile Provider & API Key Settings',
    `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
          Configure your <strong>Mapbox / Leaflet Access Token</strong> or custom Tile Server API Key for high-resolution vector map telemetry rendering.
        </p>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan);">SELECT MAP PROVIDER / TILE ENGINE</label>
          <select id="modal-api-provider-sel" class="input-futuristic" style="width: 100%; height: 38px; background: #0f172a; color: #fff; border-radius: 8px;">
            <option value="cartodb" selected>⚡ CartoDB Vector Streets (No Key Required / Pre-configured)</option>
            <option value="mapbox">🗺 Mapbox Vector Navigation (Requires Access Token)</option>
            <option value="thunderforest">🌲 Thunderforest Transport (Requires API Key)</option>
            <option value="custom">🌐 Custom Proxy Tile Server URL</option>
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 11px; font-family: var(--font-mono); color: var(--neon-cyan);">LEAFLET API ACCESS TOKEN / KEY</label>
          <input type="text" id="modal-api-key-input" class="input-futuristic" value="${_currentApiKey}" placeholder="pk.eyJ1Ijoibm92YWNhcnQi..." style="width: 100%; height: 38px; font-family: monospace; background: #0f172a; color: #fff; border-radius: 8px; padding: 0 10px;">
          <span style="font-size: 11px; color: var(--text-dim);">Stored locally in browser state (`localStorage.nova_map_api_key`)</span>
        </div>

        <div style="padding: 12px; background: rgba(16, 185, 129, 0.08); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.3); font-size: 12px; color: var(--neon-emerald);">
          ✓ <strong>Map Engine Status:</strong> Leaflet 1.9.4 engine loaded and active. Custom API Keys auto-append to Mapbox & vector tile requests.
        </div>
      </div>
    `,
    `
      <button id="modal-save-api-key" class="btn-futuristic glow-cyan" style="font-size: 12px; padding: 8px 18px;">
        💾 Save API Key & Reload Map
      </button>
      <button id="modal-btn-close-2" class="btn-futuristic-secondary" style="font-size: 12px; padding: 8px 18px;">
        Close
      </button>
    `
  );

  setTimeout(() => {
    const saveBtn = document.getElementById('modal-save-api-key');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const inputKey = document.getElementById('modal-api-key-input').value.trim();
        _currentApiKey = inputKey || 'pk.eyJ1Ijoibm92YWNhcnQiLCJhIjoiY2x5eG5vd2FjYXJ0MDAwMSJ9.demo_token';
        localStorage.setItem('nova_map_api_key', _currentApiKey);

        const provSel = document.getElementById('modal-api-provider-sel');
        if (provSel && provSel.value === 'mapbox') {
          _currentTileTheme = 'mapbox';
          const themeSel = document.getElementById('map-tile-theme-selector');
          if (themeSel) themeSel.value = 'mapbox';
        }

        const label = document.getElementById('apiKey-status-label');
        if (label) label.textContent = _currentApiKey.substring(0, 10) + '...';

        _setMapTileTheme(_currentTileTheme);
        alert("Leaflet Map API Key saved and tile layer reloaded!");
        const modal = document.getElementById('app-modal-overlay');
        if (modal) modal.style.display = 'none';
      };
    }
  }, 100);
}

// ─── Demand Zone Circles ─────────────────────────────────────────────────────
function _drawDemandZones(city) {
  _demandCircles = [];
  const zones = MAP_DEMAND_ZONES[city] || [];
  zones.forEach(z => {
    const color = z.intensity === 'HIGH' ? '#8b5cf6' : '#6d28d9';
    const circle = L.circle([z.lat, z.lng], {
      radius: z.radius,
      color: color,
      fillColor: color,
      fillOpacity: 0.14,
      weight: 1.5,
      dashArray: '6,6'
    }).addTo(_mapInstance);

    const popupHtml = _popupWrap(`
      <div style="font-size:11px;color:var(--neon-violet);font-family:monospace;letter-spacing:1px;margin-bottom:4px;">🟣 DEMAND ZONE</div>
      <div style="font-weight:700;color:#fff;font-size:14px;margin-bottom:6px;">${z.label}</div>
      <div style="font-size:12px;color:#ccc;">Demand Intensity: <strong style="color:${color};">${z.intensity}</strong></div>
    `);
    circle.bindPopup(popupHtml, { maxWidth: 240 });
    _demandCircles.push(circle);
  });
}

// ─── Store Hub Markers ───────────────────────────────────────────────────────
function _drawStores(city) {
  _storeMarkers = {};
  const stores = MAP_STORES[city] || [];
  stores.forEach(s => {
    const riskColor = s.status === 'at_risk' ? '#f59e0b' : '#00f3ff';
    const icon = L.divIcon({
      className: '',
      html: `<div class="nova-store-marker" style="
        width:34px;height:34px;border-radius:50%;
        background:${riskColor};
        border:2px solid #ffffff;
        box-shadow:0 0 14px ${riskColor},0 0 28px ${riskColor}40;
        display:flex;align-items:center;justify-content:center;
        font-size:15px;cursor:pointer;">🏪</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker([s.lat, s.lng], { icon }).addTo(_mapInstance);

    const popupHtml = _popupWrap(`
      <div style="font-size:10px;color:var(--neon-cyan);font-family:monospace;letter-spacing:1px;margin-bottom:4px;">🏪 STORE HUB — ${s.id}</div>
      <div style="font-weight:700;color:#fff;font-size:15px;margin-bottom:2px;">${s.name}</div>
      <div style="font-size:12px;color:#94a3b8;margin-bottom:10px;">${s.area}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px;">
        <div>Orders Today<br><strong style="color:#fff;font-size:16px;">${s.ordersToday}</strong></div>
        <div>Active Orders<br><strong style="color:var(--neon-cyan);font-size:16px;">${s.activeOrders}</strong></div>
        <div>Inventory Risk<br><strong style="color:${s.inventoryRisk === 'Critical' ? '#f43f5e' : s.inventoryRisk === 'High' ? '#f59e0b' : '#10b981'};font-size:14px;">${s.inventoryRisk}</strong></div>
        <div>Acceptance Rate<br><strong style="color:${s.acceptanceRate < 85 ? '#f43f5e' : '#10b981'};font-size:14px;">${s.acceptanceRate}%</strong></div>
      </div>
    `);
    marker.bindPopup(popupHtml, { maxWidth: 280 });
    _storeMarkers[s.id] = marker;
  });
}

// ─── Vehicle Markers + Green/Red Pins + Dotted Route Lines ──────────────────
function _drawVehiclesAndRoutes(city) {
  _vehicleMarkers = {};
  _vehicleLines   = {};
  _routeLines     = [];
  _pinMarkers     = [];

  const vehicles = Object.values(_vehicleData);
  vehicles.forEach(v => {
    const wp = v.waypoints;
    if (!wp || wp.length < 2) return;

    const progress = v.progress;
    const pos = _interpolateWaypoints(wp, progress);

    const routeColor = v.status === 'DELAYED' ? '#f43f5e' : v.status === 'AT_RISK' ? '#f59e0b' : '#10b981';

    // Base Polyline Path
    const baseLine = L.polyline(wp, {
      color: '#1e293b',
      weight: 6,
      opacity: 0.6
    }).addTo(_mapInstance);
    _routeLines.push(baseLine);

    // Dotted Colored Path Line (matching user reference image)
    const dottedLine = L.polyline(wp, {
      color: routeColor,
      weight: 3.5,
      opacity: 0.95,
      dashArray: '6, 9'
    }).addTo(_mapInstance);
    _routeLines.push(dottedLine);
    _vehicleLines[v.vehicleId] = dottedLine;

    // 🟢 START PIN (Green Teardrop Pin at Store Pickup)
    const startPinIcon = L.divIcon({
      className: '',
      html: GREEN_PIN_SVG,
      iconSize: [34, 46],
      iconAnchor: [17, 46]
    });
    const startMarker = L.marker(wp[0], { icon: startPinIcon, zIndexOffset: 500 }).addTo(_mapInstance);
    startMarker.bindPopup(_popupWrap(`
      <div style="font-size:10px;color:#10b981;font-family:monospace;letter-spacing:1px;margin-bottom:4px;">🟢 PICKUP STORE ORIGIN</div>
      <div style="font-weight:700;color:#fff;font-size:14px;">${v.storeName}</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Assigned Order: <strong>${v.orderId}</strong></div>
    `), { maxWidth: 240 });
    _pinMarkers.push(startMarker);

    // 🔴 END PIN (Red Teardrop Pin at Customer Dropoff)
    const endPinIcon = L.divIcon({
      className: '',
      html: RED_PIN_SVG,
      iconSize: [34, 46],
      iconAnchor: [17, 46]
    });
    const endMarker = L.marker(wp[wp.length - 1], { icon: endPinIcon, zIndexOffset: 500 }).addTo(_mapInstance);
    endMarker.bindPopup(_popupWrap(`
      <div style="font-size:10px;color:#f43f5e;font-family:monospace;letter-spacing:1px;margin-bottom:4px;">🔴 CUSTOMER DROPOFF DESTINATION</div>
      <div style="font-weight:700;color:#fff;font-size:14px;">${v.customerName}</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:4px;">Area: <strong>${v.customerArea}</strong> · Order ${v.orderId}</div>
    `), { maxWidth: 240 });
    _pinMarkers.push(endMarker);

    // 🛵 Vehicle Marker moving along route
    const vIcon = _buildVehicleIcon(v);
    const vMarker = L.marker(pos, { icon: vIcon, zIndexOffset: 1200 }).addTo(_mapInstance);
    _vehicleMarkers[v.vehicleId] = vMarker;

    // Vehicle Popup
    vMarker.bindPopup(_buildVehiclePopup(v), { maxWidth: 280 });
    vMarker.on('click', () => {
      _showVehicleDetail(v);
      _mapInstance.setView(pos, 15, { animate: true, duration: 0.8 });
    });
  });
}

function _buildVehicleIcon(v) {
  const color = v.status === 'DELAYED' ? '#f43f5e' : v.status === 'AT_RISK' ? '#f59e0b' : '#10b981';
  const pulse = v.status === 'DELAYED' ? 'nova-pulse-rose' : v.status === 'AT_RISK' ? 'nova-pulse-amber' : '';
  return L.divIcon({
    className: '',
    html: `<div class="nova-vehicle-marker ${pulse}" style="
      width:38px;height:38px;border-radius:50%;
      background:${color};
      border:2px solid #ffffff;
      box-shadow:0 0 16px ${color},0 0 32px ${color}60;
      display:flex;align-items:center;justify-content:center;
      font-size:17px;cursor:pointer;position:relative;">🛵
      <div style="position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);
        background:rgba(0,0,0,0.85);color:#fff;font-size:9px;font-family:monospace;
        padding:1px 6px;border-radius:4px;white-space:nowrap;border:1px solid ${color};">${v.eta}m</div>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}

function _buildVehiclePopup(v) {
  const color = v.status === 'DELAYED' ? '#f43f5e' : v.status === 'AT_RISK' ? '#f59e0b' : '#10b981';
  const label = v.status === 'DELAYED' ? 'DELAYED' : v.status === 'AT_RISK' ? 'AT RISK' : 'ON TIME';
  return _popupWrap(`
    <div style="font-size:10px;color:${color};font-family:monospace;letter-spacing:1px;margin-bottom:4px;">🛵 ${label} — ${v.vehicleId}</div>
    <div style="font-weight:700;color:#fff;font-size:15px;margin-bottom:8px;">Order ${v.orderId}</div>
    <div style="display:flex;flex-direction:column;gap:5px;font-size:12px;color:#94a3b8;">
      <div>📦 Pickup: <strong style="color:#fff;">${v.storeName}</strong></div>
      <div>👤 Customer: <strong style="color:#fff;">${v.customerName}</strong> (${v.customerArea})</div>
      <div>🚗 Driver: <strong style="color:#fff;">${v.driver}</strong></div>
      <div>⏱ SLA ETA: <strong style="color:${color};font-size:15px;">${v.eta} min</strong></div>
      ${v.delayReason ? `<div style="margin-top:6px;padding:6px 8px;background:rgba(244,63,94,0.12);border-radius:6px;border:1px solid rgba(244,63,94,0.3);color:#f43f5e;font-size:11px;">⚠ ${v.delayReason}</div>` : ''}
    </div>
  `);
}

// ─── Summary Badges & Sidebar ───────────────────────────────────────────────
function _updateSummaryBadges(city) {
  const s = getMapSummary(city);
  const el = document.getElementById('map-summary-badges');
  if (!el) return;
  el.innerHTML = `
    <span class="badge badge-emerald" style="font-size:11px;">🟢 ${s.onTime} On Time</span>
    <span class="badge badge-amber"   style="font-size:11px;">🟡 ${s.atRisk} At Risk</span>
    <span class="badge badge-rose"    style="font-size:11px;">🔴 ${s.delayed} Delayed</span>
  `;
}

function _updateRightSidebar(city) {
  const s = getMapSummary(city);
  const countsEl = document.getElementById('sidebar-status-counts');
  if (countsEl) {
    countsEl.innerHTML = `
      <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:6px;">${s.total} Active Deliveries</div>
      <div style="display:flex;flex-direction:column;gap:5px;font-size:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--neon-emerald);">🟢 On Time</span>
          <span style="font-weight:700;color:#fff;">${s.onTime}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--neon-amber);">🟡 At Risk</span>
          <span style="font-weight:700;color:#fff;">${s.atRisk}</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="color:var(--neon-rose);">🔴 Delayed</span>
          <span style="font-weight:700;color:#fff;">${s.delayed}</span>
        </div>
      </div>
    `;
  }

  const listEl = document.getElementById('sidebar-orders-list');
  if (!listEl) return;
  const vehicles = Object.values(_vehicleData);
  listEl.innerHTML = vehicles.map(v => {
    const color = v.status === 'DELAYED' ? 'var(--neon-rose)' : v.status === 'AT_RISK' ? 'var(--neon-amber)' : 'var(--neon-emerald)';
    const dot   = v.status === 'DELAYED' ? '🔴' : v.status === 'AT_RISK' ? '🟡' : '🟢';
    return `
      <div class="sidebar-order-item glass-card" data-vid="${v.vehicleId}" style="
        padding:10px 12px; cursor:pointer; border-radius:10px;
        border-left:3px solid ${color}; background:rgba(15,23,42,0.6);">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:12px;font-weight:700;color:#fff;font-family:monospace;">${v.orderId}</span>
          <span id="eta-${v.vehicleId}" style="font-size:11px;font-weight:700;color:${color};">ETA ${v.eta}m</span>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">${dot} ${v.customerName} · ${v.vehicleId}</div>
        ${v.delayReason ? `<div style="font-size:10px;color:var(--neon-rose);margin-top:3px;opacity:0.85;">⚠ ${v.delayReason}</div>` : ''}
      </div>
    `;
  }).join('');

  // Click handler to zoom and focus vehicle on map
  document.querySelectorAll('.sidebar-order-item').forEach(item => {
    item.onclick = () => {
      const vid = item.getAttribute('data-vid');
      const v = _vehicleData[vid];
      if (!v || !_mapInstance) return;
      const pos = _interpolateWaypoints(v.waypoints, v.progress);
      _mapInstance.setView(pos, 16, { animate: true, duration: 0.9 });
      const marker = _vehicleMarkers[vid];
      if (marker) marker.openPopup();
      _showVehicleDetail(v);
    };
  });
}

function _showVehicleDetail(v) {
  const el = document.getElementById('sidebar-vehicle-detail');
  if (!el) return;
  const color = v.status === 'DELAYED' ? '#f43f5e' : v.status === 'AT_RISK' ? '#f59e0b' : '#10b981';
  el.style.display = 'block';
  el.innerHTML = `
    <div style="font-size:10px;font-family:monospace;letter-spacing:1px;color:${color};margin-bottom:6px;">${v.vehicleId} · SELECTED</div>
    <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;">${v.orderId}</div>
    <div style="font-size:11px;color:var(--text-muted);display:flex;flex-direction:column;gap:4px;">
      <div>Pickup Store: <strong style="color:#fff;">${v.storeName}</strong></div>
      <div>Driver: <strong style="color:#fff;">${v.driver}</strong></div>
      <div>Customer: <strong style="color:#fff;">${v.customerName}</strong></div>
      <div>ETA: <strong id="detail-eta-${v.vehicleId}" style="color:${color};">${v.eta} min</strong></div>
      ${v.delayReason ? `<div style="color:var(--neon-rose);margin-top:4px;">⚠ ${v.delayReason}</div>` : ''}
    </div>
    <button onclick="document.getElementById('sidebar-vehicle-detail').style.display='none'" 
      style="margin-top:10px;width:100%;background:transparent;border:1px solid rgba(255,255,255,0.15);
             color:var(--text-dim);padding:5px;border-radius:6px;cursor:pointer;font-size:11px;">
      Close ✕
    </button>
  `;
}

// ─── Layer Visibility Control ──────────────────────────────────────────────
function _applyLayerVisibility() {
  if (!_mapInstance) return;

  Object.values(_storeMarkers).forEach(m => {
    _layers.stores ? m.addTo(_mapInstance) : _mapInstance.removeLayer(m);
  });
  Object.values(_vehicleMarkers).forEach(m => {
    _layers.vehicles ? m.addTo(_mapInstance) : _mapInstance.removeLayer(m);
  });
  _pinMarkers.forEach(p => {
    _layers.routes ? p.addTo(_mapInstance) : _mapInstance.removeLayer(p);
  });
  _routeLines.forEach(l => {
    _layers.routes ? l.addTo(_mapInstance) : _mapInstance.removeLayer(l);
  });
  _demandCircles.forEach(c => {
    _layers.demand ? c.addTo(_mapInstance) : _mapInstance.removeLayer(c);
  });
}

// ─── Simulation Engine ──────────────────────────────────────────────────────
function _toggleSimulation() {
  _simActive = !_simActive;
  const chip = document.getElementById('sim-status-chip');
  const btn1 = document.getElementById('btn-sim-toggle');
  const btn2 = document.getElementById('btn-map-sim');

  if (_simActive) {
    if (chip) chip.style.display = 'block';
    if (btn1) btn1.innerHTML = '⏹ Stop Simulation';
    if (btn2) btn2.style.color = 'var(--neon-rose)';
    _simInterval = setInterval(_simulationTick, 1200);
  } else {
    if (chip) chip.style.display = 'none';
    if (btn1) btn1.innerHTML = '⚡ Start Simulation Mode';
    if (btn2) btn2.style.color = 'var(--neon-amber)';
    clearInterval(_simInterval);
    _simInterval = null;
  }
}

function _simulationTick() {
  const vehicles = Object.values(_vehicleData);
  vehicles.forEach(v => {
    const speed = v.status === 'DELAYED' ? 0.012 : v.status === 'AT_RISK' ? 0.018 : 0.025;
    v.progress = Math.min(1, v.progress + speed);

    if (v.eta > 1) {
      v.eta = Math.max(1, v.eta - 1);
      if (v.eta <= 5 && v.status !== 'COMPLETED') {
        v.status = 'ON_TIME';
        v.delayReason = null;
      }
    }

    if (v.progress >= 1) {
      v.status = 'COMPLETED';
      v.eta = 0;
    }

    if (_vehicleMarkers[v.vehicleId]) {
      const newPos = _interpolateWaypoints(v.waypoints, v.progress);
      _vehicleMarkers[v.vehicleId].setLatLng(newPos);
      _vehicleMarkers[v.vehicleId].setIcon(_buildVehicleIcon(v));
    }

    const etaEl = document.getElementById(`eta-${v.vehicleId}`);
    if (etaEl) {
      const color = v.status === 'DELAYED' ? 'var(--neon-rose)' : v.status === 'AT_RISK' ? 'var(--neon-amber)' : 'var(--neon-emerald)';
      etaEl.style.color = color;
      etaEl.textContent = v.status === 'COMPLETED' ? 'Delivered ✓' : `ETA ${v.eta}m`;
    }

    const detailEta = document.getElementById(`detail-eta-${v.vehicleId}`);
    if (detailEta) detailEta.textContent = v.status === 'COMPLETED' ? 'Delivered ✓' : `${v.eta} min`;
  });

  _updateSummaryBadges(_currentCity);

  const s = getMapSummary(_currentCity);
  s.onTime  = vehicles.filter(v => v.status === 'ON_TIME').length;
  s.atRisk  = vehicles.filter(v => v.status === 'AT_RISK').length;
  s.delayed = vehicles.filter(v => v.status === 'DELAYED').length;
  const badgesEl = document.getElementById('map-summary-badges');
  if (badgesEl) {
    badgesEl.innerHTML = `
      <span class="badge badge-emerald" style="font-size:11px;">🟢 ${s.onTime} On Time</span>
      <span class="badge badge-amber"   style="font-size:11px;">🟡 ${s.atRisk} At Risk</span>
      <span class="badge badge-rose"    style="font-size:11px;">🔴 ${s.delayed} Delayed</span>
    `;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function _interpolateWaypoints(waypoints, progress) {
  if (!waypoints || waypoints.length === 0) return [0, 0];
  if (progress <= 0) return waypoints[0];
  if (progress >= 1) return waypoints[waypoints.length - 1];

  const totalSegments = waypoints.length - 1;
  const scaledProgress = progress * totalSegments;
  const segmentIndex = Math.floor(scaledProgress);
  const segmentProgress = scaledProgress - segmentIndex;

  const p1 = waypoints[Math.min(segmentIndex, totalSegments - 1)];
  const p2 = waypoints[Math.min(segmentIndex + 1, totalSegments)];

  return [
    p1[0] + (p2[0] - p1[0]) * segmentProgress,
    p1[1] + (p2[1] - p1[1]) * segmentProgress
  ];
}

function _popupWrap(innerHtml) {
  return `<div style="
    font-family:'Outfit',sans-serif;
    background:rgba(11,15,25,0.97);
    color:var(--text-main);
    border-radius:10px;
    padding:4px;
    min-width:220px;
  ">${innerHtml}</div>`;
}
