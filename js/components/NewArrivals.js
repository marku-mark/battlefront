/**
 * NewArrivals.js
 * Handles Add-to-Cart and Quick View interactions in the New Arrivals product grid.
 */

const NewArrivals = (() => {
  function init() {
    // Add-to-cart buttons
    document.querySelectorAll('.products-grid .btn-cart-sm').forEach(btn => {
      btn.addEventListener('click', () => {
        const card  = btn.closest('.product-card-lg');
        const name  = card?.querySelector('.card-name-lg')?.textContent?.trim() || 'Product';
        const price = card?.querySelector('.price-current')?.textContent?.trim() || '';
        const brand = card?.querySelector('.card-brand')?.textContent?.trim() || '';
        CartManager.addItem({
          id: `new-${Date.now()}`,
          name: `${brand} ${name}`.trim(),
          price,
        });
      });
    });

    // Quick-view buttons — placeholder; expand into a modal later
    document.querySelectorAll('.products-grid .btn-quick').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card-lg');
        const name = card?.querySelector('.card-name-lg')?.textContent?.trim() || 'Product';
        // For now just open the auth modal with a note, swap for a real Quick View modal later
        console.info(`[QuickView] ${name}`);
      });
    });

    // Wishlist buttons
    document.querySelectorAll('.products-grid .wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleWish(btn));
    });
  }

  return { init };
})();
