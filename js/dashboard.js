// ── DASHBOARD ──
function renderDashboard() {
  const products = getProducts();
  const total = products.length;
  const totalValue = products.reduce((s,p) => s + (p.price * p.qty), 0);
  const lowItems = products.filter(p => ['low','out'].includes(getStatus(p)));
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))].length;

  document.getElementById('statsGrid').innerHTML = `
    <div class="stat-card">
      <div class="label">Total Products</div>
      <div class="value">${total}</div>
      <div class="sub">SKUs tracked</div>
    </div>
    <div class="stat-card">
      <div class="label">Total Value</div>
      <div class="value" style="font-size:22px">${formatPrice(totalValue)}</div>
      <div class="sub">Current stock value</div>
    </div>
    <div class="stat-card">
      <div class="label">Low Stock</div>
      <div class="value" style="color:${lowItems.length > 0 ? 'var(--red)' : 'var(--green)'}">${lowItems.length}</div>
      <div class="sub">Items need attention</div>
    </div>
    <div class="stat-card">
      <div class="label">Categories</div>
      <div class="value">${categories}</div>
      <div class="sub">Product categories</div>
    </div>
  `;

  const recent = [...products].reverse().slice(0,6);
  const rp = document.getElementById('recentProducts');
  if (!recent.length) {
    rp.innerHTML = `<div class="empty-state"><div class="emoji">📦</div><h3>No products yet</h3><p>Add your first product to get started</p></div>`;
  } else {
    rp.innerHTML = recent.map(p => `
      <div class="product-row" onclick="navigate('inventory')">
        ${thumbHtml(p)}
        <div class="product-info">
          <div class="name">${p.name}</div>
          <div class="sku">${p.sku}</div>
        </div>
        <div style="text-align:right">
          ${statusBadge(p)}
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--text2);margin-top:3px">Qty: ${p.qty}</div>
        </div>
      </div>
    `).join('');
  }

  const low = products.filter(p => ['low','out'].includes(getStatus(p))).slice(0,3);
  const lw = document.getElementById('lowStockWidgetItems');
  if (!low.length) {
    lw.innerHTML = `<div class="low-stock-item" style="color:var(--green)">✓ All items sufficiently stocked</div>`;
  } else {
    lw.innerHTML = low.map(p => `
      <div class="low-stock-item">
        ${thumbHtml(p, 28)}
        <div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div></div>
        <div class="qty">${p.qty} left</div>
      </div>
    `).join('');
  }
}
