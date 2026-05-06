// ── INIT ──
// Loads shared partials, then boots the current page.

async function loadPartial(id, url) {
  const res = await fetch(url);
  document.getElementById(id).innerHTML = await res.text();
}

async function boot() {
  // Inject shared partials (nav, modal, toast container)
  await Promise.all([
    loadPartial('nav-slot',   'partials/nav.html'),
    loadPartial('modal-slot', 'partials/modal.html'),
    loadPartial('toast-slot', 'partials/toast.html'),
  ]);

  // Highlight active nav link based on current page
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach(b => {
    if (b.dataset.page === page) b.classList.add('active');
  });

  // Close modal on overlay click
  const modal = document.getElementById('confirmModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) closeModal();
    });
  }

  // Seed sample data on first visit
  seedData();

  // Page-specific renderers
  if (page === 'dashboard')    renderDashboard();
  if (page === 'inventory')    renderInventory();
  if (page === 'update-stock') renderStockGrid();
  if (page === 'low-stock')    renderLowStock();
  if (page === 'inv-value')    renderValuePage();
  if (page === 'add-product') {
    initAddProduct();
    // If user clicked "edit" on the inventory page, prefill the form here
    const editId = sessionStorage.getItem('editProductId');
    if (editId) {
      sessionStorage.removeItem('editProductId');
      const p = getProducts().find(x => x.id === editId);
      if (p) {
        document.getElementById('f-name').value = p.name;
        document.getElementById('f-sku').value = p.sku;
        document.getElementById('f-category').value = p.category || '';
        document.getElementById('f-desc').value = p.desc || '';
        document.getElementById('f-price').value = p.price;
        document.getElementById('f-cost').value = p.cost || '';
        document.getElementById('f-qty').value = p.qty;
        document.getElementById('f-threshold').value = p.threshold || 5;
        document.getElementById('f-supplier').value = p.supplier || '';
        document.getElementById('f-location').value = p.location || '';
        document.getElementById('f-uom').value = p.uom || 'pcs';
        if (p.image) {
          uploadedImageData = p.image;
          document.getElementById('previewImg').src = p.image;
          document.getElementById('previewImg').style.display = 'block';
          document.getElementById('uploadPlaceholder').style.display = 'none';
        }
        const btn = document.querySelector('.btn.primary');
        btn.textContent = '💾 Update Product';
        btn.onclick = () => {
          const products = getProducts().filter(x => x.id !== editId);
          saveProducts(products);
          saveProduct();
        };
        updatePreview();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', boot);
