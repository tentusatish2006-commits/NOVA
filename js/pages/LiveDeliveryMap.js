// Live map page removed
export function renderLiveDeliveryMapPage() {
  setTimeout(() => { window.location.hash = '#/delivery'; }, 50);
  return `<div class="glass-card" style="padding:24px;color:var(--text-muted);">Live Delivery Map has been removed. Redirecting to Delivery Operations…</div>`;
}
export function initLiveMapLeaflet() {}
