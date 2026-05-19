/**
 * FlashDeal.js
 * Manages the Sulit Picks / Flash Deal section countdown and card interactions.
 */

const FlashDeal = (() => {
  function init() {
    // Start the countdown timer
    CountdownTimer.start('countdown');

    // Add-to-cart buttons inside flash deal cards
    document.querySelectorAll('.sulit-scroll .btn-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card-sm');
        const name  = card?.querySelector('.card-name')?.textContent?.trim() || 'Product';
        const price = card?.querySelector('.price-new')?.textContent?.trim() || '';
        CartManager.addItem({ id: `deal-${Date.now()}`, name, price });
      });
    });
  }

  return { init };
})();
