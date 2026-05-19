/**
 * Dashboard
 * Renders the top-level KPI overview cards for the admin panel.
 * OOP Principle: Encapsulation — data and render logic are self-contained.
 */
class Dashboard {
  #data = {
    totalRevenue:    { value: '₱1,284,950', delta: '+12.4%', up: true,  label: 'Total Revenue',       icon: 'ti-currency-peso' },
    totalOrders:     { value: '3,847',       delta: '+8.1%',  up: true,  label: 'Total Orders',        icon: 'ti-shopping-bag'  },
    lowStockItems:   { value: '14',          delta: '-3',     up: false, label: 'Low Stock Items',     icon: 'ti-alert-triangle' },
    chatbotHandled:  { value: '924',         delta: '+5.7%',  up: true,  label: 'Chatbot Inquiries',   icon: 'ti-message-chatbot' },
    avgOrderValue:   { value: '₱33,400',     delta: '+2.3%',  up: true,  label: 'Avg Order Value',     icon: 'ti-chart-bar'     },
    outOfStock:      { value: '6',           delta: '+2',     up: false, label: 'Out of Stock',        icon: 'ti-package-off'   },
  };

  render(container) {
    container.innerHTML = `
      <div class="dash-section-title">
        <i class="ti ti-layout-dashboard"></i> Overview
        <span class="dash-subtitle">As of ${new Date().toLocaleDateString('en-PH', { dateStyle: 'long' })}</span>
      </div>
      <div class="kpi-grid">
        ${Object.entries(this.#data).map(([, d]) => this.#renderKPI(d)).join('')}
      </div>
      <div class="dash-row">
        ${this.#renderRecentActivity()}
        ${this.#renderAlertsFeed()}
      </div>
    `;
  }

  #renderKPI({ value, delta, up, label, icon }) {
    return `
      <div class="kpi-card">
        <div class="kpi-icon-wrap"><i class="ti ${icon}"></i></div>
        <div class="kpi-body">
          <div class="kpi-value">${value}</div>
          <div class="kpi-label">${label}</div>
          <div class="kpi-delta ${up ? 'up' : 'down'}">
            <i class="ti ${up ? 'ti-trending-up' : 'ti-trending-down'}"></i> ${delta} vs last month
          </div>
        </div>
      </div>`;
  }

  #renderRecentActivity() {
    const activities = [
      { icon: 'ti-shopping-cart', text: 'Order #8821 placed — RTX 4080 Super', time: '2 min ago' },
      { icon: 'ti-package',       text: 'Restock alert triggered — Ryzen 9 7900X', time: '14 min ago' },
      { icon: 'ti-message',       text: 'Chatbot escalation — Build inquiry', time: '31 min ago' },
      { icon: 'ti-user-plus',     text: 'New customer registered', time: '1 hr ago' },
      { icon: 'ti-currency-peso', text: 'Revenue milestone: ₱1.2M this month', time: '3 hr ago' },
    ];
    return `
      <div class="dash-card">
        <div class="dash-card-header"><i class="ti ti-activity"></i> Recent Activity</div>
        <ul class="activity-list">
          ${activities.map(a => `
            <li class="activity-item">
              <span class="activity-icon"><i class="ti ${a.icon}"></i></span>
              <span class="activity-text">${a.text}</span>
              <span class="activity-time">${a.time}</span>
            </li>`).join('')}
        </ul>
      </div>`;
  }

  #renderAlertsFeed() {
    const alerts = [
      { level: 'critical', text: 'Samsung 990 Pro 1TB — 2 units left' },
      { level: 'critical', text: 'Corsair DDR5 32GB Kit — Out of stock' },
      { level: 'warning',  text: 'RTX 4060 Ti 16GB — 5 units left' },
      { level: 'warning',  text: 'DeepCool LT720 — Reorder in 3 days' },
      { level: 'info',     text: 'Forecast: GPU demand +18% next week' },
    ];
    return `
      <div class="dash-card">
        <div class="dash-card-header"><i class="ti ti-bell-ringing"></i> Live Alerts</div>
        <ul class="alerts-list">
          ${alerts.map(a => `
            <li class="alert-item alert-${a.level}">
              <span class="alert-dot"></span>
              <span>${a.text}</span>
            </li>`).join('')}
        </ul>
      </div>`;
  }
}
