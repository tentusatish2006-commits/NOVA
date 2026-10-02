// NOVA CART - Live Delivery Map (multi-color routes like city route map)
import { MAP_CITIES, MAP_STORES, MAP_VEHICLES, MAP_DEMAND_ZONES } from '../services/mapData.js';

let _mapInstance = null;
let _tileLayerInstance = null;
let _simInterval = null;
let _vehicleMarkers = {};
let _vehicleLines = {};
let _vehicleData = {};
let _storeMarkers = {};
let _simActive = false;
let _currentCity = 'Bengaluru';

const ROUTE_COLORS = ['#2563eb', '#ea580c', '#dc2626', '#7c3aed', '#059669', '#ca8a04', '#db2777'];

export function renderLiveDeliveryMapPage() {
  const cities = Object.keys(MAP_CITIES);
  return `
    <div id="live-map-root" style="display:flex;width:100%;height:calc(100vh - 65px);min-height:520px;overflow:hidden;position:relative;background:#0b0f19;">
      <div style="position:absolute;top:12px;left:12px;z-index:1000;display:flex;gap:8px;flex-wrap:wrap;">
        <select id="map-city-select" class="input-futuristic" style="height:36px;font-size:12px;min-width:140px;">
          ${cities.map((c) => `<option value="${c}" ${c === _currentCity ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <button id="btn-map-recenter" class="btn-futuristic-secondary" style="height:36px;font-size:12px;padding:0 12px;">Recenter</button>
        <button id="btn-sim-toggle" class="btn-futuristic" style="height:36px;font-size:12px;padding:0 14px;">Start Simulation</button>
      </div>
      <div id="live-leaflet-map" style="flex:1;height:100%;min-height:520px;"></div>
      <div id="map-right-sidebar" class="glass-panel" style="width:300px;flex-shrink:0;height:100%;display:flex;flex-direction:column;border-radius:0;border-left:1px solid rgba(255,255,255,0.08);overflow:auto;z-index:900;background:rgba(11,15,25,0.95);">
        <div style="padding:16px;">
          <div style="font-size:10px;font-family:var(--font-mono);color:var(--text-dim);letter-spacing:1px;">LIVE ROUTES</div>
          <div id="sidebar-status-counts" style="display:flex;gap:8px;margin:12px 0;flex-wrap:wrap;"></div>
          <div id="sidebar-orders-list" style="display:flex;flex-direction:column;gap:10px;"></div>
          <div style="margin-top:16px;font-size:11px;color:var(--text-dim);line-height:1.4;">
            Colored lines = active delivery routes. Pins = stores & destinations.
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initLiveMapLeaflet(city = 'Bengaluru') {
  _currentCity = city;
  if (_simInterval) { clearInterval(_simInterval); _simInterval = null; _simActive = false; }
  const rawVehicles = MAP_VEHICLES[city] || [];
  _vehicleData = {};
  rawVehicles.forEach((v) => { _vehicleData[v.vehicleId] = JSON.parse(JSON.stringify(v)); });

  const mapEl = document.getElementById('live-leaflet-map');
  if (!mapEl) return;
  if (typeof L === 'undefined') { setTimeout(() => initLiveMapLeaflet(city), 250); return; }

  if (_mapInstance) {
    try { _mapInstance.remove(); } catch (e) {}
    _mapInstance = null;
    _storeMarkers = {};
    _vehicleMarkers = {};
    _vehicleLines = {};
  }

  const cityConf = MAP_CITIES[city] || MAP_CITIES['Bengaluru'];
  _mapInstance = L.map('live-leaflet-map', {
    center: cityConf.center,
    zoom: cityConf.zoom,
    zoomControl: true,
    scrollWheelZoom: true,
  });

  _tileLayerInstance = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20,
  }).addTo(_mapInstance);

  window._novaMap = _mapInstance;
  window._novaMapRecenter = () => _mapInstance.setView(cityConf.center, cityConf.zoom);

  try {
    _drawDemandZones(city);
    _drawStores(city);
    _drawVehiclesAndRoutes();
    _updateSidebar();
  } catch (e) { console.warn('Map draw error', e); }

  const citySel = document.getElementById('map-city-select');
  if (citySel) citySel.onchange = () => initLiveMapLeaflet(citySel.value);
  const recenter = document.getElementById('btn-map-recenter');
  if (recenter) recenter.onclick = () => window._novaMapRecenter && window._novaMapRecenter();
  const simBtn = document.getElementById('btn-sim-toggle');
  if (simBtn) {
    simBtn.onclick = () => {
      if (_simActive) {
        clearInterval(_simInterval); _simInterval = null; _simActive = false;
        simBtn.textContent = 'Start Simulation';
      } else {
        _simActive = true;
        simBtn.textContent = 'Stop Simulation';
        _simInterval = setInterval(_tickSimulation, 800);
      }
    };
  }
  setTimeout(() => { if (_mapInstance) _mapInstance.invalidateSize(); }, 200);
}

function _latLng(obj) {
  if (!obj) return null;
  if (Array.isArray(obj) && obj.length >= 2) return [obj[0], obj[1]];
  if (obj.lat != null && obj.lng != null) return [obj.lat, obj.lng];
  if (obj.center) return _latLng(obj.center);
  if (obj.coords) return _latLng(obj.coords);
  return null;
}

function _drawDemandZones(city) {
  (MAP_DEMAND_ZONES[city] || []).forEach((z) => {
    const ll = _latLng(z);
    if (!ll) return;
    L.circle(ll, { radius: z.radius || 800, color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.12, weight: 1 }).addTo(_mapInstance);
  });
}

function _drawStores(city) {
  (MAP_STORES[city] || []).forEach((s) => {
    const ll = _latLng(s);
    if (!ll) return;
    const color = s.status === 'at_risk' ? '#f43f5e' : '#10b981';
    const m = L.circleMarker(ll, { radius: 9, color: '#fff', weight: 2, fillColor: color, fillOpacity: 0.95 }).addTo(_mapInstance);
    m.bindPopup('<b>' + s.name + '</b><br>' + (s.area || '') + '<br>Orders: ' + (s.ordersToday || '-') + '<br>Status: ' + (s.status || '-'));
    _storeMarkers[s.id || s.name] = m;
  });
}

function _drawVehiclesAndRoutes() {
  Object.values(_vehicleMarkers).forEach((m) => { try { _mapInstance.removeLayer(m); } catch (e) {} });
  Object.values(_vehicleLines).forEach((l) => { try { _mapInstance.removeLayer(l); } catch (e) {} });
  _vehicleMarkers = {};
  _vehicleLines = {};

  Object.values(_vehicleData).forEach((v, idx) => {
    if (!v.waypoints || !v.waypoints.length) return;
    const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];
    const line = L.polyline(v.waypoints, { color, weight: 5, opacity: 0.9, lineJoin: 'round', lineCap: 'round' }).addTo(_mapInstance);
    _vehicleLines[v.vehicleId] = line;

    L.circleMarker(v.waypoints[0], { radius: 6, color: '#fff', weight: 2, fillColor: color, fillOpacity: 1 }).addTo(_mapInstance);
    const end = v.waypoints[v.waypoints.length - 1];
    L.circleMarker(end, { radius: 7, color, weight: 3, fillColor: '#fff', fillOpacity: 1 }).addTo(_mapInstance)
      .bindPopup('<b>Drop-off</b><br>' + (v.customerName || '') + '<br>' + (v.customerArea || ''));

    const prog = Math.min(0.95, Math.max(0, v.progress || 0.2));
    const posIdx = Math.min(v.waypoints.length - 1, Math.floor(prog * (v.waypoints.length - 1)));
    const pos = v.waypoints[posIdx];
    const m = L.marker(pos, {
      icon: L.divIcon({
        className: '',
        html: '<div style="background:' + color + ';color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);">🛵</div>',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      }),
    }).addTo(_mapInstance);
    m.bindPopup('<b>' + v.vehicleId + '</b> · ' + v.status + '<br>Driver: ' + (v.driver || '-') + '<br>ETA: ' + (v.eta || '-') + ' min');
    _vehicleMarkers[v.vehicleId] = m;
  });
}

function _updateSidebar() {
  const counts = { ON_TIME: 0, AT_RISK: 0, DELAYED: 0 };
  const list = Object.values(_vehicleData);
  list.forEach((v) => { if (counts[v.status] != null) counts[v.status]++; else counts.ON_TIME++; });
  const countsEl = document.getElementById('sidebar-status-counts');
  if (countsEl) {
    countsEl.innerHTML = '<span class="badge badge-cyan" style="padding:4px 8px;">On time ' + counts.ON_TIME + '</span>'
      + '<span class="badge" style="padding:4px 8px;background:rgba(245,158,11,0.2);color:#fbbf24;">At risk ' + counts.AT_RISK + '</span>'
      + '<span class="badge" style="padding:4px 8px;background:rgba(244,63,94,0.2);color:#fb7185;">Delayed ' + counts.DELAYED + '</span>';
  }
  const listEl = document.getElementById('sidebar-orders-list');
  if (listEl) {
    listEl.innerHTML = list.map((v, idx) => {
      const color = ROUTE_COLORS[idx % ROUTE_COLORS.length];
      return '<div style="padding:10px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);border-left:4px solid ' + color + ';">' +
        '<div style="font-weight:600;font-size:13px;color:#fff;">' + (v.orderId || v.vehicleId) + '</div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' + (v.driver || '') + ' → ' + (v.customerName || '') + '</div>' +
        '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;">' + v.status + ' · ETA ' + (v.eta || '-') + 'm</div></div>';
    }).join('');
  }
}

function _tickSimulation() {
  Object.values(_vehicleData).forEach((v) => { v.progress = Math.min(0.98, (v.progress || 0) + 0.04); });
  _drawVehiclesAndRoutes();
  _updateSidebar();
}
