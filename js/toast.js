// ── TOAST ──
function toast(msg, type='info') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icon = type==='success'?'✓':type==='error'?'✕':'ℹ';
  el.innerHTML = `<span style="font-size:16px">${icon}</span><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.style.opacity='0', 3000);
  setTimeout(() => el.remove(), 3300);
}
