// ── INVENTORY VALUE ──
function renderValuePage() {
  const products = getProducts();
  const totalValue = products.reduce((s,p) => s + p.price * p.qty, 0);
  const totalCost  = products.reduce((s,p) => s + (p.cost||0) * p.qty, 0);
  const totalItems = products.reduce((s,p) => s + p.qty, 0);

  document.getElementById('valueSummary').innerHTML = `
    <div>
      <div class="total-label">Total Inventory Value</div>
      <div class="total-value">${formatPrice(totalValue)}</div>
    </div>
    <div class="value-stats">
      <div class="vs-item">
        <div class="vs-label">Total Cost</div>
        <div class="vs-val">${formatPrice(totalCost)}</div>
      </div>
      <div class="vs-item">
        <div class="vs-label">Gross Margin</div>
        <div class="vs-val" style="color:var(--green)">${totalValue>0?((totalValue-totalCost)/totalValue*100).toFixed(1):0}%</div>
      </div>
      <div class="vs-item">
        <div class="vs-label">Total Items</div>
        <div class="vs-val">${totalItems.toLocaleString()}</div>
      </div>
    </div>
  `;

  // Category chart
  const catMap = {};
  products.forEach(p => {
    const cat = p.category || 'Other';
    catMap[cat] = (catMap[cat] || 0) + p.price * p.qty;
  });
  const cats = Object.keys(catMap).sort((a,b) => catMap[b]-catMap[a]);
  const vals = cats.map(c => catMap[c]);
  renderChart(cats, vals);

  // Value table
  const sorted = [...products].sort((a,b) => (b.price*b.qty)-(a.price*a.qty));
  document.getElementById('valueBody').innerHTML = sorted.map(p => {
    const val = p.price * p.qty;
    const pct = totalValue > 0 ? (val/totalValue*100) : 0;
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            ${thumbHtml(p,32)}
            <span style="font-weight:600">${p.name}</span>
          </div>
        </td>
        <td><span style="font-family:var(--font-mono);font-size:11px">${p.sku}</span></td>
        <td>${formatPrice(p.price)}</td>
        <td style="font-family:var(--font-mono)">${p.qty}</td>
        <td style="font-weight:700;color:var(--accent)">${formatPrice(val)}</td>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <div class="pct-bar-bg"><div class="pct-bar" style="width:${pct}%"></div></div>
            <span style="font-family:var(--font-mono);font-size:11px;min-width:36px">${pct.toFixed(1)}%</span>
          </div>
        </td>
        <td>${statusBadge(p)}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('grandTotal').textContent = formatPrice(totalValue);
}

function renderChart(labels, values) {
  const canvas = document.getElementById('valueChart');
  const ctx = canvas.getContext('2d');
  const W = canvas.parentElement.offsetWidth - 40;
  canvas.width = W;
  canvas.height = 200;

  ctx.clearRect(0,0,W,200);
  if (!labels.length) { ctx.fillStyle='#5a5a72'; ctx.font='14px IBM Plex Mono'; ctx.fillText('No data',W/2-30,100); return; }

  const max = Math.max(...values);
  const barW = Math.min(60, (W-60) / labels.length - 12);
  const gap  = (W - 60 - barW * labels.length) / (labels.length + 1);
  const colors = ['#f0a500','#44c87a','#4488e8','#e84444','#a044e8','#e84488','#44e8c8','#e8a444'];

  labels.forEach((label, i) => {
    const x = 60 + gap + i * (barW + gap);
    const barH = max > 0 ? (values[i] / max) * 140 : 0;
    const y = 160 - barH;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4,4,0,0]);
    ctx.fill();

    ctx.fillStyle = '#9898b0';
    ctx.font = '10px IBM Plex Mono';
    ctx.textAlign = 'center';
    ctx.fillText(label.length > 10 ? label.slice(0,10)+'…' : label, x + barW/2, 180);

    ctx.fillStyle = '#e8e8f0';
    ctx.font = '600 11px Barlow';
    ctx.fillText('₱' + (values[i]/1000).toFixed(1)+'k', x + barW/2, y-6);
  });

  // Y-axis
  ctx.fillStyle='#3a3a46'; ctx.fillRect(54,10,1,155);
  ctx.fillStyle='#5a5a72'; ctx.font='10px IBM Plex Mono'; ctx.textAlign='right';
  [0,.5,1].forEach(t => {
    const y = 165 - t*140;
    ctx.fillText(formatPrice(max*t), 50, y+4);
  });
}
