/**
 * ProductTabs.js
 * Drives the tab bar on the New Arrivals / Products section (Featured / New / Best Sellers).
 */

const ProductTabs = (() => {
  function init() {
    const tabs = document.querySelectorAll('.tab-btn');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const target = tab.dataset.tab;
        document.querySelectorAll('.tab-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.tabPanel === target);
        });
      });
    });

    // Activate first tab by default
    if (tabs[0]) tabs[0].click();
  }

  return { init };
})();
