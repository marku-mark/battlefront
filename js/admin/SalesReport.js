/**
 * SalesReport
 * Generates and renders sales & revenue reports with chart visualizations.
 * OOP Principle: Abstraction — complex data aggregation exposed via simple render().
 */
class SalesReport {
  #period = 'monthly';

  #salesData = {
    monthly: {
      labels: ['Dec','Jan','Feb','Mar','Apr','May'],
      revenue: [842000, 910000, 765000, 1050000, 988000, 1284950],
      orders:  [231,    267,    198,    312,      289,    384],
    },
    weekly: {
      labels: ['Wk 1','Wk 2','Wk 3','Wk 4'],
      revenue: [298000, 312000, 341000, 333950],
      orders:  [84, 91, 104, 105],
    },
    daily: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      revenue: [41000, 52000, 38000, 67000, 89000, 112000, 76000],
      orders:  [12, 15, 11, 19, 26, 34, 22],
    },
  };

  #topProducts = [
    { name:'ASUS TUF RTX 4070 Ti Super', category:'GPU',         units:47, revenue:2490765 },
    { name:'Intel Core i9-14900K',        category:'Processors', units:89, revenue:1957555 },
    { name:'ASUS ROG Strix G16 Laptop',   category:'Laptops',    units:21, revenue:1889895 },
    { name:'LG UltraGear 27" 4K 144Hz',   category:'Monitors',   units:54, revenue:1862730 },
    { name:'Lenovo Legion 5i Gen 9',      category:'Laptops',    units:26, revenue:1819870 },
    { name:'Samsung 990 Pro 2TB NVMe',    category:'Storage',    units:198,revenue:1681810 },
    { name:'MSI GeForce RTX 4060 8GB',    category:'GPU',        units:73, revenue:1678635 },
    { name:'Gigabyte Z790 AORUS Elite',   category:'Motherboards',units:98,revenue:1665510 },
  ];

  render(container) {
    container.innerHTML = `
      <div class="dash-section-title">
        <i class="ti ti-chart-bar"></i> Sales & Revenue Reports
        <span class="dash-subtitle">Transaction analysis and product performance</span>
      </div>
      <div class="report-toolbar">
        <div class="period-tabs">
          <button class="period-btn ${this.#period==='daily'?'active':''}"   data-period="daily">Daily</button>
          <button class="period-btn ${this.#period==='weekly'?'active':''}"  data-period="weekly">Weekly</button>
          <button class="period-btn ${this.#period==='monthly'?'active':''}" data-period="monthly">Monthly</button>
        </div>
        <button class="btn-export" id="salesExportBtn"><i class="ti ti-file-export"></i> Export CSV</button>
      </div>
      <div class="sales-summary-cards" id="salesSummary"></div>
      <div class="dash-row">
        <div class="dash-card wide">
          <div class="dash-card-header"><i class="ti ti-chart-line"></i> Revenue Trend</div>
          <canvas id="revenueChart" height="220"></canvas>
        </div>
      </div>
      <div class="dash-card" style="margin-top:24px;">
        <div class="dash-card-header"><i class="ti ti-trophy"></i> Top-Selling Products</div>
        ${this.#renderTopProducts()}
      </div>
    `;
    this.#renderSummary(container);
    this.#drawChart();
    this.#bindEvents(container);
  }

  #renderSummary(container) {
    const d = this.#salesData[this.#period];
    const totalRev = d.revenue.reduce((a,b) => a+b, 0);
    const totalOrd = d.orders.reduce((a,b) => a+b, 0);
    const avg = Math.round(totalRev / totalOrd);
    container.querySelector('#salesSummary').innerHTML = `
      <div class="summary-card"><div class="sum-val">₱${totalRev.toLocaleString()}</div><div class="sum-lbl">Total Revenue</div></div>
      <div class="summary-card"><div class="sum-val">${totalOrd.toLocaleString()}</div><div class="sum-lbl">Total Orders</div></div>
      <div class="summary-card"><div class="sum-val">₱${avg.toLocaleString()}</div><div class="sum-lbl">Avg Order Value</div></div>
      <div class="summary-card"><div class="sum-val">${d.labels.length}</div><div class="sum-lbl">${this.#period === 'daily' ? 'Days' : this.#period === 'weekly' ? 'Weeks' : 'Months'}</div></div>
    `;
  }

  #renderTopProducts() {
    return `
      <table class="inv-table">
        <thead><tr><th>Rank</th><th>Product</th><th>Category</th><th>Units Sold</th><th>Revenue</th><th>Revenue Share</th></tr></thead>
        <tbody>
          ${this.#topProducts.map((p, i) => {
            const maxRev = this.#topProducts[0].revenue;
            const pct = Math.round((p.revenue / maxRev) * 100);
            return `
              <tr>
                <td><span class="rank-badge rank-${i+1}">#${i+1}</span></td>
                <td class="td-name">${p.name}</td>
                <td><span class="cat-tag">${p.category}</span></td>
                <td>${p.units.toLocaleString()}</td>
                <td>₱${p.revenue.toLocaleString()}</td>
                <td>
                  <div class="stock-bar" style="width:120px">
                    <div class="stock-fill stock-fill-ok" style="width:${pct}%"></div>
                  </div>
                </td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>`;
  }

  #drawChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const d = this.#salesData[this.#period];
    const max = Math.max(...d.revenue);
    const W = canvas.offsetWidth || 700;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    const pad = { top:20, right:20, bottom:40, left:70 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const cols = d.labels.length;
    const barW = Math.min(40, (chartW / cols) * 0.5);

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      const val = Math.round(max - (max / 4) * i);
      ctx.fillStyle = '#8899aa';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('₱' + (val >= 1000 ? (val/1000).toFixed(0)+'K' : val), pad.left - 8, y + 4);
    }

    // Bars + line
    const points = [];
    d.revenue.forEach((rev, i) => {
      const x = pad.left + (chartW / cols) * i + (chartW / cols) * 0.5;
      const barH = (rev / max) * chartH;
      const y = pad.top + chartH - barH;

      // Bar
      const grad = ctx.createLinearGradient(0, y, 0, y + barH);
      grad.addColorStop(0, 'rgba(229,57,53,0.85)');
      grad.addColorStop(1, 'rgba(229,57,53,0.15)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x - barW/2, y, barW, barH, [4,4,0,0]);
      ctx.fill();

      points.push({ x, y });

      // X labels
      ctx.fillStyle = '#8899aa';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(d.labels[i], x, H - 8);
    });

    // Line overlay
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);
    ctx.beginPath();
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    // Dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = '#e53935';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  #bindEvents(container) {
    container.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.#period = btn.dataset.period;
        this.#renderSummary(container);
        this.#drawChart();
      });
    });

    container.querySelector('#salesExportBtn').addEventListener('click', () => this.#exportCSV());
  }

  #exportCSV() {
    const d = this.#salesData[this.#period];
    const rows = d.labels.map((l, i) => [l, d.revenue[i], d.orders[i]].join(','));
    const csv = ['Period,Revenue,Orders', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `battlefront_sales_${this.#period}_${Date.now()}.csv`;
    a.click();
  }
}
