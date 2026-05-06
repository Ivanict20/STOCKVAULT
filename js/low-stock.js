// ── LOW STOCK PAGE ──
function renderLowStock() {
  const products = getProducts();
  const critical = products.filter(p => getStatus(p) === 'out' || (getStatus(p) === 'low' && p.qty <= (p.threshold||5)/2));
  const warning  = products.filter(p => getStatus(p) === 'low' && !critical.includes(p));
  const medium   = products.filter(p => getStatus(p) === 'medium');
  const ok       = products.filter(p => getStatus(p) === 'in-stock');

  const lowAll = [...critical, ...warning];
  document.getElementById('lowStockSubtitle').textContent =
    lowAll.length ? `${lowAll.length} product${lowAll.length>1?'s':''} need restocking — act before you run out` : 'All products are sufficiently stocked';

  document.getElementById('alertStats').innerHTML = `
    <div class="alert-stat critical">
      <div class="as-label">⛔ Critical</div>
      <div class="as-value">${critical.length}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Urgently restock</div>
    </div>
    <div class="alert-stat warning">
      <div class="as-label">⚠ Warning</div>
      <div class="as-value">${warning.length}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Order soon</div>
    </div>
    <div class="alert-stat ok">
      <div class="as-label">✓ Sufficient</div>
      <div class="as-value">${ok.length + medium.length}</div>
      <div style="font-size:12px;color:var(--text2);margin-top:4px">Well stocked</div>
    </div>
  `;

  const cards = document.getElementById('alertCards');
  if (!lowAll.length) {
    cards.innerHTML = `<div class="alert-stat ok" style="padding:24px;text-align:center"><div class="as-label">✓ All Good</div><div style="font-size:16px;color:var(--green);font-weight:600">All products are sufficiently stocked!</div></div>`;
    return;
  }

  cards.innerHTML = [
    ...critical.map(p => makeAlertCard(p,'critical')),
    ...warning.map(p  => makeAlertCard(p,'warning'))
  ].join('');
}

function makeAlertCard(p, level) {
  const label = level === 'critical' ? 'Critical' : 'Warning';
  const cls   = level === 'critical' ? 'badge-red' : 'badge-yellow';
  return `
    <div class="alert-card ${level}">
      <div class="ac-photo">${p.image ? `<img src="${p.image}" alt="${p.name}">` : (p.emoji||'📦')}</div>
      <div class="ac-info">
        <div class="ac-name">${p.name}</div>
        <div class="ac-sku">${p.sku}</div>
        <span class="badge ${cls}">${label}</span>
        <div class="ac-qty" style="margin-top:6px">Only <strong>${p.qty}</strong> ${p.uom||'pcs'} remaining · Threshold: ${p.threshold||5}</div>
        ${p.supplier ? `<div style="font-size:11px;color:var(--text3);margin-top:3px">Supplier: ${p.supplier}</div>` : ''}
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:var(--red);margin-bottom:8px">${p.qty}</div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:10px">${p.uom||'pcs'} left</div>
        <button class="restock-btn" onclick="navigate('update-stock')">Restock Now</button>
      </div>
    </div>
  `;
}
