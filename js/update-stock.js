// ── UPDATE STOCK ──
function renderStockGrid() {
  let products = getProducts();
  const q = (document.getElementById('stockSearch').value||'').toLowerCase();
  if (q) products = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q)
  );

  const grid = document.getElementById('stockGrid');
  const empty = document.getElementById('stockEmpty');

  if (!products.length) {
    grid.innerHTML = '';
    empty.innerHTML = `<div class="empty-state"><div class="emoji">📦</div><h3>No products found</h3></div>`;
    return;
  }
  empty.innerHTML = '';

  grid.innerHTML = products.map(p => {
    const s = getStatus(p);
    let badgeCls = 'badge-green', badgeTxt = 'OK';
    if (s==='medium') { badgeCls='badge-yellow'; badgeTxt='MED'; }
    if (s==='low'||s==='out') { badgeCls='badge-red'; badgeTxt='LOW'; }
    return `
      <div class="stock-card" id="sc-${p.id}">
        <div class="sc-badge"><span class="badge ${badgeCls}">${badgeTxt}</span></div>
        <div class="sc-content">
          <div class="sc-photo">${p.image ? `<img src="${p.image}" alt="${p.name}">` : (p.emoji||'📦')}</div>
          <div class="sc-info">
            <div class="sc-name">${p.name}</div>
            <div class="sc-sku">${p.sku}</div>
            <div class="sc-cat">${p.category||'General'} · ${formatPrice(p.price)}</div>
          </div>
        </div>
        <div class="sc-controls">
          <button class="qty-btn" onclick="changeQty('${p.id}',-1)">−</button>
          <input class="qty-display" type="number" id="qty-${p.id}" value="${p.qty}" min="0" onchange="setQty('${p.id}',this.value)">
          <button class="qty-btn" onclick="changeQty('${p.id}',1)">+</button>
        </div>
        <button class="save-stock-btn" onclick="saveStock('${p.id}')">Save Stock</button>
      </div>
    `;
  }).join('');
}

function changeQty(id, delta) {
  const input = document.getElementById('qty-' + id);
  const newVal = Math.max(0, parseInt(input.value || 0) + delta);
  input.value = newVal;
}

function setQty(id, val) {
  const v = Math.max(0, parseInt(val) || 0);
  document.getElementById('qty-' + id).value = v;
}

function saveStock(id) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) return;
  const newQty = parseInt(document.getElementById('qty-' + id).value) || 0;
  products[idx].qty = newQty;
  saveProducts(products);
  toast(`Stock updated to ${newQty} for "${products[idx].name}"`, 'success');
  renderStockGrid();
}
