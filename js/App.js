/**
 * App.js
 * Battlefront Computer Trading — Main Bootstrap
 * Initialises all components in dependency order after DOM is ready.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Utilities (no DOM dependencies) ──────────────────────────────────────
  // CartManager, WishlistManager, CountdownTimer are self-initialising modules.
  // Sync badge on load
  CartManager.updateBadge();

  // ── Components ────────────────────────────────────────────────────────────
  MobileDrawer.init();
  Header.init();
  CategoryNav.init();
  FlashDeal.init();     // starts countdown timer internally
  NewArrivals.init();
  ProductTabs.init();
  StoreLocator.init();
  AuthModal.init();
  Chatbot.init();

  // ── Cart icon opens mini-cart (placeholder) ───────────────────────────────
  document.getElementById('cartIconBtn')?.addEventListener('click', () => {
    const count = CartManager.getCount();
    if (count === 0) {
      alert('Your cart is empty.\nBrowse our products and add something!');
    } else {
      const items = CartManager.getItems()
        .map(i => `• ${i.name} ×${i.qty}  ${i.price}`)
        .join('\n');
      alert(`🛒 Your cart (${count} item${count > 1 ? 's' : ''}):\n\n${items}\n\n(Full cart page coming soon)`);
    }
  });

  // ── Newsletter form ───────────────────────────────────────────────────────
  document.querySelector('.newsletter-wrap')?.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  document.querySelector('.newsletter-btn')?.addEventListener('click', () => {
    const email = document.querySelector('.newsletter-input')?.value;
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    alert(`✅ Thank you! ${email} has been subscribed to Battlefront deals.`);
    document.querySelector('.newsletter-input').value = '';
  });

  console.info('[BCT] App initialised ✔');
});
