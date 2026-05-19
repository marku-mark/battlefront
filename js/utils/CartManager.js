/**
 * CartManager.js
 * Manages the shopping cart state and UI badge updates.
 */

const CartManager = (() => {
  let items = [];

  function getBadgeEl() {
    return document.getElementById('cartCount');
  }

  function updateBadge() {
    const badge = getBadgeEl();
    if (!badge) return;
    const total = items.reduce((sum, i) => sum + i.qty, 0);
    badge.textContent = total;
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
  }

  function addItem(product) {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }
    updateBadge();
    showToast(`${product.name || 'Item'} added to cart!`);
  }

  function removeItem(id) {
    items = items.filter(i => i.id !== id);
    updateBadge();
  }

  function getItems() {
    return [...items];
  }

  function getCount() {
    return items.reduce((sum, i) => sum + i.qty, 0);
  }

  function clear() {
    items = [];
    updateBadge();
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `<i class="ti ti-shopping-bag"></i> ${msg}`;
    document.body.appendChild(toast);
    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  }

  return { addItem, removeItem, getItems, getCount, clear, updateBadge };
})();

// Global shim so inline onclick="addToCart()" in existing HTML still works
function addToCart(name, price, id) {
  CartManager.addItem({
    id: id || `item-${Date.now()}`,
    name: name || 'Product',
    price: price || 0,
  });
}
