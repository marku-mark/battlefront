/**
 * MobileDrawer.js
 * Controls the slide-in mobile navigation drawer.
 */

const MobileDrawer = (() => {
  function open() {
    document.getElementById('mobileDrawer')?.classList.add('open');
    document.getElementById('drawerOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    document.getElementById('mobileDrawer')?.classList.remove('open');
    document.getElementById('drawerOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function init() {
    document.getElementById('hamburgerBtn')?.addEventListener('click', open);
    document.getElementById('drawerOverlay')?.addEventListener('click', close);
    document.querySelector('.drawer-close')?.addEventListener('click', close);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  return { init, open, close };
})();

// Global shims for any remaining inline onclick attributes in HTML
function openDrawer()  { MobileDrawer.open(); }
function closeDrawer() { MobileDrawer.close(); }
