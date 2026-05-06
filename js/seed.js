// ── SEED DATA ──
function seedData() {
  if (getProducts().length > 0) return;
  const seed = [
    { name:'Wireless Bluetooth Headphones', sku:'WBH-001', category:'Electronics', price:2499, cost:1200, qty:24, threshold:5, supplier:'TechWorld', location:'Shelf A-1', uom:'pcs', emoji:'🎧', desc:'Premium wireless headphones with noise cancellation' },
    { name:'USB-C Charging Cable 2m', sku:'UCC-002', category:'Electronics', price:299, cost:80, qty:8, threshold:10, supplier:'CableCo', location:'Bin B-3', uom:'pcs', emoji:'🔌', desc:'Fast charging 100W USB-C cable' },
    { name:'Ergonomic Office Chair', sku:'EOC-003', category:'Furniture', price:8999, cost:4500, qty:3, threshold:2, supplier:'FurnishPH', location:'Floor C', uom:'pcs', emoji:'🪑', desc:'Lumbar support office chair' },
    { name:'Mechanical Keyboard TKL', sku:'MKT-004', category:'Electronics', price:3499, cost:1800, qty:12, threshold:5, supplier:'KeyMaster', location:'Shelf A-2', uom:'pcs', emoji:'⌨️', desc:'Tenkeyless mechanical keyboard' },
    { name:'Instant Coffee 200g', sku:'ICF-005', category:'Food & Beverages', price:189, cost:90, qty:2, threshold:15, supplier:'BrewCorp', location:'Pantry D', uom:'pcs', emoji:'☕', desc:'Premium instant coffee blend' },
    { name:'Running Shoes Size 42', sku:'RS-006', category:'Sports', price:3299, cost:1500, qty:7, threshold:5, supplier:'SportGear', location:'Shelf E-1', uom:'pcs', emoji:'👟', desc:'Lightweight running shoes' },
    { name:'Laptop Stand Aluminum', sku:'LSA-007', category:'Electronics', price:1299, cost:600, qty:18, threshold:5, supplier:'DeskPro', location:'Shelf A-3', uom:'pcs', emoji:'💻', desc:'Adjustable aluminum laptop stand' },
    { name:'Cotton T-Shirt White M', sku:'CTW-008', category:'Clothing', price:399, cost:120, qty:35, threshold:10, supplier:'FabricPH', location:'Rack F-2', uom:'pcs', emoji:'👕', desc:'100% cotton basic tee' },
  ];
  const products = seed.map(p => ({ ...p, id: generateId(), createdAt: new Date().toISOString(), image: null }));
  saveProducts(products);
}
