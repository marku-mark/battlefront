/**
 * CategoryNav.js
 * Handles category card active state and filtering trigger.
 */

const CategoryNav = (() => {
  function init() {
    const cards = document.querySelectorAll('.cat-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Emit a custom event so ProductTabs can react
        const category = card.dataset.category || card.querySelector('.cat-name')?.textContent;
        document.dispatchEvent(new CustomEvent('bct:categoryChange', { detail: { category } }));
      });
    });
  }

  return { init };
})();
