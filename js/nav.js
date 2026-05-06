// ── NAVIGATION ──
// Multi-page navigation: each nav button links to its own HTML file.
function navigate(page) {
  const map = {
    'dashboard':    'index.html',
    'add-product':  'add-product.html',
    'inventory':    'inventory.html',
    'update-stock': 'update-stock.html',
    'low-stock':    'low-stock.html',
    'inv-value':    'value.html',
  };
  if (map[page]) window.location.href = map[page];
}
