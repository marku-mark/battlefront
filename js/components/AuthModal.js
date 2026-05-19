/**
 * AuthModal.js
 * Login / Register modal with tab switching and password visibility toggle.
 */

const AuthModal = (() => {
  let modal, overlay;

  function open(panel = 'login') {
    modal   = document.getElementById('authModal');
    overlay = document.getElementById('authOverlay');
    if (!modal) return;

    modal.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchPanel(panel);
  }

  function close() {
    document.getElementById('authModal')?.classList.remove('open');
    document.getElementById('authOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function switchPanel(name) {
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.authTab === name);
    });
    document.querySelectorAll('.auth-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.authPanel === name);
    });
  }

  function init() {
    // Tab buttons
    document.querySelectorAll('.auth-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.authTab));
    });

    // Open triggers (Login / Register links in header dropdown)
    document.querySelectorAll('[data-auth-open]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        open(el.dataset.authOpen);
      });
    });

    // Close on overlay click or X button
    document.getElementById('authOverlay')?.addEventListener('click', close);
    document.querySelectorAll('[data-auth-close]').forEach(btn => {
      btn.addEventListener('click', close);
    });

    // ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    // Password visibility toggle
    document.querySelectorAll('.input-eye').forEach(icon => {
      icon.addEventListener('click', () => {
        const input = icon.closest('.form-input-wrap')?.querySelector('input');
        if (!input) return;
        const visible = input.type === 'text';
        input.type = visible ? 'password' : 'text';
        icon.className = visible ? 'ti ti-eye input-eye' : 'ti ti-eye-off input-eye';
      });
    });

    // Login form submit (demo)
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.querySelector('[name="email"]')?.value;
      // Placeholder: swap for real API call
      alert(`Demo login: ${email}\n(Connect your backend here.)`);
      close();
    });

    // Register form submit (demo)
    document.getElementById('registerForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const first = e.target.querySelector('[name="first_name"]')?.value;
      alert(`Account created for ${first}!\n(Connect your backend here.)`);
      close();
    });
  }

  return { init, open, close };
})();
