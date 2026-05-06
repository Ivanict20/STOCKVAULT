// Function to collect data and save the product
function saveProduct() {
  // 1. Grab values from the DOM using the IDs in your HTML
  const name = document.getElementById('f-name').value.trim();
  const sku = document.getElementById('f-sku').value.trim();
  const category = document.getElementById('f-category').value;
  const desc = document.getElementById('f-desc').value.trim();
  const price = parseFloat(document.getElementById('f-price').value);
  const cost = parseFloat(document.getElementById('f-cost').value) || 0;
  const qty = parseInt(document.getElementById('f-qty').value);
  const threshold = parseInt(document.getElementById('f-threshold').value) || 5;
  const supplier = document.getElementById('f-supplier').value.trim();
  const location = document.getElementById('f-location').value.trim();
  const uom = document.getElementById('f-uom').value;

  // 2. Basic Validation: Ensure required fields (*) are filled
  if (!name || !sku || isNaN(price) || isNaN(qty)) {
    showToast("Please fill in all required fields (*)", "error");
    return;
  }

  // 3. Create the Product Object
  const newProduct = {
    id: Date.now(), // Unique ID based on timestamp
    name,
    sku,
    category,
    description: desc,
    price,
    cost,
    quantity: qty,
    threshold,
    supplier,
    location,
    uom,
    image: document.getElementById('previewImg').src || null, // Captures uploaded image
    dateAdded: new Date().toISOString()
  };

  // 4. Save to the Global Array and LocalStorage
  // (Assuming 'products' is defined in data.js)
  products.push(newProduct);
  saveToLocalStorage(); 

  // 5. Feedback and Cleanup
  showToast("Product added successfully!", "success");
  
  // Optional: Redirect to inventory after a short delay
  setTimeout(() => {
    window.location.href = 'inventory.html';
  }, 1500);
}

// Function to update the Live Preview card
function updatePreview() {
  document.getElementById('previewName').innerText = document.getElementById('f-name').value || "Product Name";
  document.getElementById('previewSku').innerText = document.getElementById('f-sku').value || "SKU-000";
  
  const price = document.getElementById('f-price').value;
  document.getElementById('previewPrice').innerText = price ? `₱${parseFloat(price).toLocaleString()}` : "₱0.00";
  
  const desc = document.getElementById('f-desc').value;
  document.getElementById('previewDesc').innerText = desc || "Description will appear here...";
  
  // Update Stock Badge based on quantity
  const qty = parseInt(document.getElementById('f-qty').value) || 0;
  const badge = document.getElementById('previewBadge');
  if (qty <= 0) {
    badge.innerHTML = '<span class="badge badge-red">Out of Stock</span>';
  } else if (qty < 5) {
    badge.innerHTML = '<span class="badge badge-orange">Low Stock</span>';
  } else {
    badge.innerHTML = '<span class="badge badge-green">In Stock</span>';
  }
}
const fileInput = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const formThumb = document.getElementById('formThumb');

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // Set the source to the Base64 string
      const imageData = e.target.result;
      
      previewImg.src = imageData;
      previewImg.style.display = 'block';
      uploadPlaceholder.style.display = 'none';
      
      // Update the small preview icon in the "Preview" section
      formThumb.innerHTML = `<img src="${imageData}" style="width:100%;height:100%;object-fit:cover;border-radius:4px">`;
    };
    
    reader.readAsDataURL(file);
  }
});

function saveProduct() {
  // ... (keep your existing variable declarations for name, sku, etc.)

  const imageSrc = document.getElementById('previewImg').src;
  
  // If no image was uploaded, previewImg.src might be empty or the page URL
  // We check if it contains "data:image", which indicates a successful Base64 upload
  const finalImage = imageSrc.startsWith('data:image') ? imageSrc : null;

  const newProduct = {
    id: Date.now(),
    name: document.getElementById('f-name').value,
    sku: document.getElementById('f-sku').value,
    // ... other fields
    image: finalImage, // This now saves the actual image data string
    dateAdded: new Date().toISOString()
  };

  // Push to products and save to localStorage
  products.push(newProduct);
  localStorage.setItem('vault_products', JSON.stringify(products)); 
  
  showToast("Product saved with image!", "success");
}