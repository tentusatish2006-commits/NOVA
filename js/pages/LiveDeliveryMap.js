// NOVA CART - Full Live 3D Delivery Map Page (/live-map)
import { MAP_CITIES, MAP_STORES, MAP_VEHICLES, MAP_DEMAND_ZONES, getMapSummary } from '../services/mapData.js';
import { openModal } from '../components/Modal.js';

// Module-level persistent map & simulation state
let _mapInstance       = null;
let _tileLayerInstance = null;
let _simInterval        = null;
let _vehicleMarkers     = {};
let _vehicleLines       = {};
let _vehicleData        = {};
let _storeMarkers       = {};
let _pinMarkers         = [];
let _demandCircles      = [];
let _routeLines         = [];
let _simActive          = false;
let _currentCity        = 'Bengaluru';
let _currentTileTheme   = 'voyager';
let _currentApiKey      = (typeof localStorage !== 'undefined' && localStorage.getItem('nova_map_api_key')) || 'pk.eyJ1Ijoibm92YWNhcnQiLCJhIjoiY2x5eG5vd2FjYXJ0MDAwMSJ9.demo_token';
let _layers             = { stores: true, vehicles: true, routes: true, demand: true };

const TILE_THEMES = {
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB Voyager & OSM',
    subdomains: 'abcd',
    maxZoom: 20
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB Dark & OSM',
    subdomains: 'abcd',
    maxZoom: 20
  },
  mapbox: {
    getUrl: (key) => 'https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/tiles/{z}/{x}/{y}?access_token=' + key,
    attribution: '&copy; Mapbox & OpenStreetMap',
    maxZoom: 19
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    subdomains: 'abc',
    maxZoom: 19
  }
};

const GREEN_PIN_SVG = '<svg width="34" height="46" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.4));"><path d="M18 0C8.05887 0 0 8.05887 0 18C0 29.25 15.75 45.75 17.1562 47.2031C17.625 47.6875 18.375 47.6875 18.8438 47.2031C20.25 45.75 36 29.25 36 18C36 8.05887 27.9411 0 18 0Z" fill="#10B981" stroke="#047857" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="white"/></svg>';

const RED_PIN_SVG = '<svg width="34" height="46" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.4));"><path d="M18 0C8.05887 0 0 8.05887 0 18C0 29.25 15.75 45.75 17.1562 47.2031C17.625 47.6875 18.375 47.6875 18.8438 47.2031C20.25 45.75 36 29.25 36 18C36 8.05887 27.9411 0 18 0Z" fill="#F43F5E" stroke="#BE123C" stroke-width="2"/><circle cx="18" cy="18" r="8" fill="white"/></svg>';

export function renderLiveDeliveryMapPage() {
  const apiKeyTrunc = _currentApiKey ? _currentApiKey.substring(0, 10) + '...' : 'Configured';
  return '<div id="live-map-root" style="display:flex; width:100%; height:calc(100vh - 65px); min-height:calc(100vh - 65px); overflow:hidden; position:relative; background: #0b0f19;"><div id="live-leaflet-map" style="flex:1; height:100%;"></div><div id="map-right-sidebar" class="glass-panel" style="width: 290px; flex-shrink:0; height:100%; display:flex; flex-direction:column; border-radius:0; border-left:1px solid rgba(255,255,255,0.08); overflow:hidden; z-index:900; background:rgba(11,15,25,0.95);"><div style="padding:16px;"><div style="font-size:10px;font-family:var(--font-mono);color:var(--text-dim);">DELIVERY STATUS</div><div id="sidebar-status-counts"></div><div id="sidebar-orders-list"></div><button id="btn-sim-toggle" class="btn-futuristic" style="width:100%;margin-top:12px;">Start Simulation</button></div></div></div>';
}

export function initLiveMapLeaflet(city = 'Bengaluru') {
  _currentCity = city;
  if (_simInterval) { clearInterval(_simInterval); _simInterval = null; _simActive = false; }
  const rawVehicles = MAP_VEHICLES[city] || [];
  _vehicleData = {};
  rawVehicles.forEach(v => { _vehicleData[v.vehicleId] = JSON.parse(JSON.stringify(v)); });
  const mapEl = document.getElementById('live-leaflet-map');
  if (!mapEl) return;
  if (typeof L === 'undefined') {
    setTimeout(() => initLiveMapLeaflet(city), 200);
    return;
  }
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
  _mapInstance = L.map('live-leaflet-map', {
    center: cityConf.center,
    zoom: cityConf.zoom,
    zoomControl: false,
    scrollWheelZoom: true,
    attributionControl: true
  });
  _setMapTileTheme(_currentTileTheme);
  window._novaMap = _mapInstance;
  window._novaMapRecenter = () => _mapInstance.setView(cityConf.center, cityConf.zoom);
  try {
    _drawDemandZones(city);
    _drawStores(city);
    _drawVehiclesAndRoutes(city);
  } catch (e) { console.warn('Map draw error', e); }
}

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

function _drawDemandZones(city) {
  const zones = MAP_DEMAND_ZONES[city] || [];
  zones.forEach(z => {
    const c = L.circle(z.center, { radius: z.radius || 800, color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.15, weight: 1 }).addTo(_mapInstance);
    _demandCircles.push(c);
  });
}

function _drawStores(city) {
  const stores = MAP_STORES[city] || [];
  stores.forEach(s => {
    const m = L.marker(s.coords, {
      icon: L.divIcon({ className: '', html: '<div style="font-size:18px;">🏪</div>', iconSize: [28, 28], iconAnchor: [14, 14] })
    }).addTo(_mapInstance);
    m.bindPopup('<b>' + (s.name || 'Store') + '</b>');
    _storeMarkers[s.id || s.name] = m;
  });
}

function _drawVehiclesAndRoutes(city) {
  Object.values(_vehicleData).forEach(v => {
    if (!v.waypoints || !v.waypoints.length) return;
    const line = L.polyline(v.waypoints, { color: v.status === 'DELAYED' ? '#f43f5e' : '#00f3ff', weight: 3, opacity: 0.7 }).addTo(_mapInstance);
    _vehicleLines[v.vehicleId] = line;
    const pos = v.waypoints[0];
    const m = L.marker(pos, {
      icon: L.divIcon({ className: '', html: '<div style="font-size:16px;">🛵</div>', iconSize: [24, 24], iconAnchor: [12, 12] })
    }).addTo(_mapInstance);
    m.bindPopup('<b>' + v.vehicleId + '</b><br>ETA: ' + (v.eta || '-') + 'm');
    _vehicleMarkers[v.vehicleId] = m;
  });
}

function _popupWrap(innerHtml) {
  return '<div style="font-family:Outfit,sans-serif;background:rgba(11,15,25,0.97);color:var(--text-main);border-radius:10px;padding:4px;min-width:220px;">' + innerHtml + '</div>';
}
