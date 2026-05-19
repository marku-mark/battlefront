/**
 * Header.js
 * Handles sticky header shadow on scroll + account dropdown accessibility.
 */

const Header = (() => {
  function init() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    // Sticky shadow on scroll
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // Account dropdown — close when clicking outside
    const accountWrap = header.querySelector('.account-wrap');
    if (accountWrap) {
      document.addEventListener('click', (e) => {
        if (!accountWrap.contains(e.target)) {
          accountWrap.querySelector('.account-dropdown')?.classList.remove('force-open');
        }
      });

      // Also wire Auth modal triggers inside dropdown
      accountWrap.querySelectorAll('[data-auth-open]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const panel = link.dataset.authOpen;
          AuthModal?.open(panel);
        });
      });
    }

    // Language toggle
    document.querySelectorAll('.lang-toggle span').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.lang-toggle span').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
      });
    });

    // Disclaimer on first visit
    if (!sessionStorage.getItem('bct_disclaimer_seen')) {
      const modal = document.getElementById('disclaimerModal');
      if (modal) {
        modal.classList.add('open');
        document.getElementById('disclaimerOkBtn')?.addEventListener('click', () => {
          modal.classList.remove('open');
          sessionStorage.setItem('bct_disclaimer_seen', '1');
        });
      }
    }
  }

  return { init };
})();
