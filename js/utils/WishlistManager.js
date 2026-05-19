/**
 * WishlistManager.js
 * Manages wishlist toggle state across product cards.
 */

const WishlistManager = (() => {
  let wishlist = new Set();

  function toggle(id) {
    if (wishlist.has(id)) {
      wishlist.delete(id);
      return false;
    } else {
      wishlist.add(id);
      return true;
    }
  }

  function has(id) {
    return wishlist.has(id);
  }

  function getAll() {
    return [...wishlist];
  }

  return { toggle, has, getAll };
})();

/**
 * Global shim: toggleWish(btn) — called by inline onclick on wishlist buttons.
 * Reads a data-product-id attribute if present; falls back to a generated key.
 */
function toggleWish(btn) {
  const card = btn.closest('[data-product-id]');
  const id = card ? card.dataset.productId : btn.dataset.id || btn.closest('.product-card-lg,  .product-card-sm')?.dataset?.productId || `wish-${Math.random()}`;

  btn.classList.toggle('active');
  const icon = btn.querySelector('i');
  if (btn.classList.contains('active')) {
    icon.className = 'ti ti-heart-filled';
    WishlistManager.toggle(id);
  } else {
    icon.className = 'ti ti-heart';
    WishlistManager.toggle(id);
  }
}
