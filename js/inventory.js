// ── INVENTORY TABLE ──
function setFilter(f, btn) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderInventory();
}

function renderInventory() {
  let products = getProducts();
  const q = document.getElementById('invSearch').value.toLowerCase();
  if (q) products = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q) ||
    (p.category||'').toLowerCase().includes(q)
  );
  if (currentFilter !== 'all') {
    products = products.filter(p => {
      const s = getStatus(p);
      if (currentFilter === 'in-stock') return s === 'in-stock';
      if (currentFilter === 'medium')   return s === 'medium';
      if (currentFilter === 'low')      return s === 'low' || s === 'out';
      return true;
    });
  }

  const tbody = document.getElementById('inventoryBody');
  const empty = document.getElementById('inventoryEmpty');

  if (!products.length) {
    tbody.innerHTML = '';
    empty.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><h3>No products found</h3><p>Try adjusting your search or filter</p></div>`;
    return;
  }
  empty.innerHTML = '';

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          ${thumbHtml(p,36)}
          <div>
            <div style="font-weight:600;font-size:13px">${p.name}</div>
            ${p.desc ? `<div style="font-size:11px;color:var(--text3);max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.desc}</div>` : ''}
          </div>
        </div>
      </td>
      <td><span style="font-family:var(--font-mono);font-size:11px">${p.sku}</span></td>
      <td>${p.category || '—'}</td>
      <td style="font-weight:600">${formatPrice(p.price)}</td>
      <td style="color:var(--text2)">${p.cost ? formatPrice(p.cost) : '—'}</td>
      <td>
        <span style="font-family:var(--font-mono);font-weight:600">${p.qty}</span>
        <span style="color:var(--text3);font-size:11px"> ${p.uom||'pcs'}</span>
      </td>
      <td style="color:var(--text2);font-size:12px">${p.location || '—'}</td>
      <td>${statusBadge(p)}</td>
      <td>
        <div class="td-actions">
          <button class="icon-btn" title="Edit" onclick="editProduct('${p.id}')">✏️</button>
          <button class="icon-btn danger" title="Delete" onclick="confirmDelete('${p.id}','${p.name.replace(/'/g,"\\'")}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function editProduct(id) {
  // store edit-id and jump to add-product page
  sessionStorage.setItem('editProductId', id);
  window.location.href = 'add-product.html';
  return;
 
}

function confirmDelete(id, name) {
  pendingDelete = id;
  document.getElementById('confirmTitle').textContent = 'Delete Product';
  document.getElementById('confirmMsg').textContent = `Are you sure you want to delete "${name}"? This action cannot be undone.`;
  document.getElementById('confirmOk').onclick = () => {
    const products = getProducts().filter(p => p.id !== pendingDelete);
    saveProducts(products);
    closeModal();
    toast('Product deleted', 'info');
    renderInventory();
    renderDashboard();
  };
  document.getElementById('confirmModal').classList.add('open');
}

function closeModal() {
  document.getElementById('confirmModal').classList.remove('open');
}
// Example of how to render the saved image in a list
const imgHtml = product.image 
  ? `<img src="${product.image}" class="product-thumb">` 
  : `<div class="product-thumb">📦</div>`;