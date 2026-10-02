// Force file download (no print popup required)
export function downloadPdfReport(title, sectionsHtml) {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('nova_cart_user') || '{}'); } catch { return {}; }
  })();
  const name = user.name || user.email || 'User';
  const safeTitle = String(title || 'NOVA-Report').replace(/[^\w\-]+/g, '_').slice(0, 60);
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body{font-family:system-ui,sans-serif;padding:32px;color:#111;max-width:800px;margin:0 auto;background:#fff}
  h1{font-size:22px;margin:0 0 8px} .meta{color:#666;font-size:12px;margin-bottom:24px}
  h2{font-size:16px;margin:20px 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px}
  p,li{font-size:13px;line-height:1.5} .card{border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:8px 0}
</style></head>
<body>
  <h1>${title}</h1>
  <div class="meta">NOVA CART · Generated for <strong>${name}</strong> · ${new Date().toLocaleString()}</div>
  ${sectionsHtml}
</body></html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeTitle + '.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((c) => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename || 'nova-export.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
