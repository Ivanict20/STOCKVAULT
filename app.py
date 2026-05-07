{% extends "base.html" %}
{% block title %}Inventory Value — StockVault{% endblock %}
{% block breadcrumb %}Inventory Value{% endblock %}

{% block content %}
<div class="page-header" style="display:flex;align-items:flex-end;justify-content:space-between">
  <div>
    <h1 class="page-title">Inventory Value</h1>
    <p class="page-subtitle">Total value computed from current price × quantity for each product</p>
  </div>
  <div style="text-align:right">
    <div style="font-family:var(--font-mono);font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:4px">Grand Total</div>
    <div style="font-size:2rem;font-weight:800;color:var(--accent);letter-spacing:-.03em">₱{{ "{:,.2f}".format(total) }}</div>
  </div>
</div>

<div class="table-wrap">
  <table class="data-table">
    <thead>
      <tr>
        <th>Product</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Stock Value</th>
        <th>% of Total</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {% for r, s, val, pct in products %}
      <tr>
        <td class="bold">
          <div style="display:flex;align-items:center;gap:12px">
            {% if r.photo %}
            <img src="data:image/jpeg;base64,{{ r.photo }}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0">
            {% else %}
            <div style="width:32px;height:32px;background:var(--surface2);border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center">
              <svg width="12" height="12" fill="none" stroke="var(--border2)" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
            </div>
            {% endif %}
            {{ r.name }}
          </div>
        </td>
        <td class="mono">{{ r.sku }}</td>
        <td class="mono">₱{{ "%.2f"|format(r.price) }}</td>
        <td class="mono">{{ r.quantity }}</td>
        <td class="mono bold">₱{{ "{:,.2f}".format(val) }}</td>
        <td>
          <div>
            <span style="font-family:var(--font-mono);font-size:.72rem;color:var(--muted)">{{ "%.1f"|format(pct) }}%</span>
            <div class="value-bar"><div class="value-bar-fill" style="width:{{ [pct,100]|min }}%"></div></div>
          </div>
        </td>
        <td><span class="badge badge-{{ s }}">{{ s.replace('_',' ') }}</span></td>
      </tr>
      {% endfor %}
      <tr class="grand-total-row">
        <td colspan="4" style="font-family:var(--font-mono);letter-spacing:.08em;text-transform:uppercase;font-size:.75rem">Grand Total</td>
        <td class="mono">₱{{ "{:,.2f}".format(total) }}</td>
        <td class="mono">100%</td>
        <td>—</td>
      </tr>
    </tbody>
  </table>
</div>
{% endblock %}
