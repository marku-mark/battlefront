/**
 * AdminApp
 * Bootstraps and orchestrates all admin modules.
 * OOP Principle: Composition — AdminApp owns instances of all feature classes.
 * Each module is independently instantiated and rendered into #adminContent.
 */
class AdminApp {
  #auth = new AdminAuth();
  #dashboard = new Dashboard();
  #inventoryMgr = new InventoryManager();
  #salesReport = new SalesReport();
  #forecastEngine = new ForecastEngine();

  #currentSection = 'dashboard';
  #sidebarBound = false; // guard: only bind sidebar listeners once

  init() {
    // Bind sidebar once up front — elements exist in HTML from page load
    this.#bindSidebar();

    this.#auth.onAuthChange = (isLoggedIn) => {
      if (isLoggedIn) this.#showAdmin();
      else this.#showLogin();
    };

    if (this.#auth.isAuthenticated()) {
      this.#showAdmin();
    } else {
      this.#showLogin();
    }
  }

  // ─── Login screen ────────────────────────────────────────
  #showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminShell').style.display = 'none';
    this.#bindLoginForm();
  }

  #bindLoginForm() {
    const form = document.getElementById('adminLoginForm');
    if (!form || form.dataset.bound) return; // prevent duplicate listeners
    form.dataset.bound = 'true';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('adminUser').value;
      const password = document.getElementById('adminPass').value;
      const errEl = document.getElementById('loginError');
      const result = this.#auth.login(username, password);
      if (!result.success) {
        errEl.textContent = result.error;
        errEl.style.display = 'block';
        document.getElementById('adminPass').value = '';
      }
    });

    document.getElementById('togglePass')?.addEventListener('click', () => {
      const inp = document.getElementById('adminPass');
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  }

  // ─── Admin shell ─────────────────────────────────────────
  #showAdmin() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminShell').style.display = 'flex';

    const session = this.#auth.getSession();
    if (session) {
      document.getElementById('adminUsername').textContent =
        session.username;
      document.getElementById('adminLoginTime').textContent =
        new Date(session.loginTime).toLocaleTimeString('en-PH', { timeStyle: 'short' });
    }

    this.#navigateTo('dashboard');
  }

  // ─── Sidebar (bound ONCE on init) ────────────────────────
  #bindSidebar() {
    if (this.#sidebarBound) return;
    this.#sidebarBound = true;

    // Use event delegation on the sidebar nav so it works
    // regardless of when #showAdmin() is called
    document.getElementById('adminShell').addEventListener('click', (e) => {
      // Nav items
      const navItem = e.target.closest('.nav-item[data-section]');
      if (navItem) {
        this.#navigateTo(navItem.dataset.section);
        return;
      }
      // Logout
      if (e.target.closest('#logoutBtn')) {
        this.#auth.logout();
        return;
      }
      // Sidebar collapse toggle
      if (e.target.closest('#sidebarToggle')) {
        document.getElementById('adminShell').classList.toggle('sidebar-collapsed');
      }
    });
  }

  // ─── Navigation ──────────────────────────────────────────
  #navigateTo(section) {
    this.#currentSection = section;

    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
      item.classList.toggle('active', item.dataset.section === section);
    });

    const content = document.getElementById('adminContent');
    content.innerHTML = '';

    switch (section) {
      case 'dashboard': this.#dashboard.render(content); break;
      case 'inventory': this.#inventoryMgr.render(content); break;
      case 'sales': this.#salesReport.render(content); break;
      case 'forecast': this.#forecastEngine.render(content); break;
      default:
        content.innerHTML = `<div class="empty-state"><i class="ti ti-tool"></i><p>Section coming soon.</p></div>`;
    }

    content.scrollTop = 0;
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AdminApp();
  app.init();
});