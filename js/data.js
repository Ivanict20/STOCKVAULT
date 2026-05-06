// ── DATA LAYER ──
const STORAGE_KEY = 'stockvault_products';
let pendingDelete = null;
let currentFilter = 'all';
let uploadedImageData = null;
let chartInstance = null;

const SAMPLE_EMOJIS = ['📱','💻','🎧','📷','🖨','⌚','🔌','💾','🖥','📺'];

function getProducts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2,5);
}

function getStatus(product) {
  const qty = product.qty;
  const thresh = product.threshold || 5;
  if (qty <= 0) return 'out';
  if (qty <= thresh) return 'low';
  if (qty <= thresh * 2) return 'medium';
  return 'in-stock';
}

function statusBadge(product) {
  const s = getStatus(product);
  if (s === 'out')     return '<span class="badge badge-red">Out of Stock</span>';
  if (s === 'low')     return '<span class="badge badge-red">Low</span>';
  if (s === 'medium')  return '<span class="badge badge-yellow">Medium</span>';
  return '<span class="badge badge-green">In Stock</span>';
}

function formatPrice(n) {
  return '₱' + parseFloat(n || 0).toLocaleString('en-PH', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function thumbHtml(product, size=40) {
  if (product.image) {
    return `<div class="product-thumb" style="width:${size}px;height:${size}px"><img src="${product.image}" alt="${product.name}"></div>`;
  }
  const emoji = product.emoji || '📦';
  return `<div class="product-thumb" style="width:${size}px;height:${size}px;font-size:${size*0.45}px">${emoji}</div>`;
}

// Globals shared across pages
