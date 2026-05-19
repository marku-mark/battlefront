/**
 * ForecastEngine
 * Predictive analytics: sales forecasting, demand per product,
 * restock prediction, revenue trend visualization, and accuracy monitoring.
 * OOP Principle: Inheritance-ready base structure + encapsulation of ML-sim logic.
 */
class ForecastEngine {
  #forecastData = {
    labels:    ['Jun','Jul','Aug','Sep','Oct','Nov'],
    predicted: [1340000, 1420000, 1510000, 1380000, 1650000, 1920000],
    actual:    [1284950, null,     null,     null,     null,     null   ],
  };

  #productDemand = [
    { name:'RTX 4070 Ti Super',    trend:+18, forecast:'High',   risk:'low',      icon:'ti-trending-up'   },
    { name:'Intel i9-14900K',      trend:+6,  forecast:'Stable', risk:'low',      icon:'ti-trending-up'   },
    { name:'Corsair DDR5 32GB',    trend:+24, forecast:'Surge',  risk:'critical', icon:'ti-trending-up'   },
    { name:'Samsung 990 Pro 2TB',  trend:-4,  forecast:'Stable', risk:'medium',   icon:'ti-trending-down' },
    { name:'ASUS ROG Strix G16',   trend:+31, forecast:'Surge',  risk:'critical', icon:'ti-trending-up'   },
    { name:'NZXT H7 Flow',         trend:-11, forecast:'Low',    risk:'low',      icon:'ti-trending-down' },
    { name:'DeepCool LT720 AIO',   trend:+9,  forecast:'Stable', risk:'medium',   icon:'ti-trending-up'   },
    { name:'Logitech G Pro X SL2', trend:+42, forecast:'Surge',  risk:'critical', icon:'ti-trending-up'   },
  ];

  #accuracyMetrics = [
    { model:'Sales Forecasting (Monthly)',  mae:'₱42,300', mape:'3.2%', accuracy:'96.8%', status:'good'    },
    { model:'Demand Forecast (Per Product)',mae:'4.1 units',mape:'6.7%',accuracy:'93.3%', status:'good'    },
    { model:'Restock Prediction',           mae:'2.8 days', mape:'9.1%',accuracy:'90.9%', status:'average' },
    { model:'Revenue Trend Model',          mae:'₱31,000',  mape:'2.4%',accuracy:'97.6%', status:'good'    },
  ];

  render(container) {
    container.innerHTML = `
      <div class="dash-section-title">
        <i class="ti ti-brain"></i> Predictive Analytics & Forecasting
        <span class="dash-subtitle">ML-powered demand and revenue projections</span>
      </div>
      <div class="dash-row">
        <div class="dash-card wide">
          <div class="dash-card-header">
            <i class="ti ti-chart-line"></i> 6-Month Revenue Forecast
            <span class="model-badge">AI Model v2.1</span>
          </div>
          <canvas id="forecastChart" height="220"></canvas>
          <div class="forecast-legend">
            <span class="legend-item"><span class="legend-dot" style="background:#e53935"></span>Predicted</span>
            <span class="legend-item"><span class="legend-dot" style="background:#4CAF50"></span>Actual</span>
            <span class="legend-item legend-note"><i class="ti ti-info-circle"></i> Null = future projection</span>
          </div>
        </div>
      </div>
      <div class="dash-section-title" style="margin-top:32px;">
        <i class="ti ti-packages"></i> Product Demand Forecast
        <span class="dash-subtitle">Next 30-day demand outlook per product</span>
      </div>
      <div class="demand-grid">
        ${this.#productDemand.map(p => this.#renderDemandCard(p)).join('')}
      </div>
      <div class="dash-section-title" style="margin-top:32px;">
        <i class="ti ti-target"></i> Forecast Accuracy Monitoring
        <span class="dash-subtitle">MAE and MAPE metrics per model</span>
      </div>
      <div class="accuracy-grid">
        ${this.#accuracyMetrics.map(m => this.#renderAccuracyCard(m)).join('')}
      </div>
    `;
    this.#drawForecastChart();
  }

  #renderDemandCard(p) {
    const riskColor = { low:'#4CAF50', medium:'#FF9800', critical:'#e53935' };
    const trendColor = p.trend > 0 ? '#4CAF50' : '#e53935';
    return `
      <div class="demand-card risk-border-${p.risk}">
        <div class="demand-header">
          <span class="demand-name">${p.name}</span>
          <span class="demand-trend" style="color:${trendColor}">
            <i class="ti ${p.icon}"></i> ${p.trend > 0 ? '+' : ''}${p.trend}%
          </span>
        </div>
        <div class="demand-forecast-label" style="color:${riskColor[p.risk]}">
          ${p.forecast} Demand
        </div>
        <div class="demand-risk">
          <span class="risk-pill risk-${p.risk}">${p.risk === 'critical' ? '⚠ Critical' : p.risk === 'medium' ? '◉ Medium' : '● Low'} Risk</span>
        </div>
      </div>`;
  }

  #renderAccuracyCard(m) {
    const statusColor = { good:'#4CAF50', average:'#FF9800', poor:'#e53935' };
    const pct = parseFloat(m.accuracy);
    return `
      <div class="accuracy-card">
        <div class="acc-model">${m.model}</div>
        <div class="acc-metrics">
          <div class="acc-metric"><span class="acc-label">MAE</span><span class="acc-val">${m.mae}</span></div>
          <div class="acc-metric"><span class="acc-label">MAPE</span><span class="acc-val">${m.mape}</span></div>
          <div class="acc-metric"><span class="acc-label">Accuracy</span>
            <span class="acc-val" style="color:${statusColor[m.status]}">${m.accuracy}</span>
          </div>
        </div>
        <div class="acc-bar-wrap">
          <div class="acc-bar"><div class="acc-fill" style="width:${pct}%;background:${statusColor[m.status]}"></div></div>
        </div>
      </div>`;
  }

  #drawForecastChart() {
    const canvas = document.getElementById('forecastChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const d = this.#forecastData;
    const allVals = [...d.predicted, ...d.actual.filter(v => v !== null)];
    const max = Math.max(...allVals) * 1.1;
    const W = canvas.offsetWidth || 700;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    const pad = { top:20, right:20, bottom:40, left:80 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;
    const cols = d.labels.length;

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
      const val = Math.round(max - (max / 4) * i);
      ctx.fillStyle = '#8899aa';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('₱' + (val/1000).toFixed(0) + 'K', pad.left - 8, y + 4);
    }

    const getX = i => pad.left + (chartW / (cols - 1)) * i;
    const getY = v => pad.top + chartH - (v / max) * chartH;

    // Predicted area fill
    const predPoints = d.predicted.map((v, i) => ({ x: getX(i), y: getY(v) }));
    ctx.beginPath();
    predPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.lineTo(getX(cols - 1), pad.top + chartH);
    ctx.lineTo(getX(0), pad.top + chartH);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    areaGrad.addColorStop(0, 'rgba(229,57,53,0.18)');
    areaGrad.addColorStop(1, 'rgba(229,57,53,0)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Predicted line
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    predPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.setLineDash([]);

    // Actual line
    const actualPoints = d.actual
      .map((v, i) => v !== null ? { x: getX(i), y: getY(v) } : null)
      .filter(Boolean);
    if (actualPoints.length > 0) {
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      ctx.beginPath();
      actualPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();

      actualPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#4CAF50';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }

    // Predicted dots
    predPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e53935';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // X labels
    d.labels.forEach((l, i) => {
      ctx.fillStyle = '#8899aa';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(l, getX(i), H - 8);
    });
  }
}
