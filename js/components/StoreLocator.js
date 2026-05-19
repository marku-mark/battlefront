/**
 * StoreLocator.js
 * Renders store location cards and links to Google Maps.
 */

const StoreLocator = (() => {
  const STORES = [
    {
      id: 1,
      name: 'Battlefront – Bacolod Main',
      address: 'Lacson St, Bacolod City, Negros Occidental',
      hours: 'Mon–Sat 8AM–6PM, Sun 10AM–5PM',
      phone: '(034) 434-8888',
      lat: 10.6407,
      lng: 122.9623,
    },
    {
      id: 2,
      name: 'Battlefront – SM Bacolod',
      address: 'SM City Bacolod, Circumferential Rd, Bacolod City',
      hours: 'Daily 10AM–9PM',
      phone: '(034) 434-9999',
      lat: 10.6753,
      lng: 122.9449,
    },
    {
      id: 3,
      name: 'Battlefront – Iloilo Branch',
      address: 'Iznart St, Iloilo City, Iloilo',
      hours: 'Mon–Sat 9AM–7PM',
      phone: '(033) 337-7777',
      lat: 10.6970,
      lng: 122.5644,
    },
  ];

  function mapsUrl(store) {
    return `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
  }

  function renderCards(container) {
    container.innerHTML = STORES.map(s => `
      <div class="store-card" data-store-id="${s.id}">
        <div class="store-card-name">
          <i class="ti ti-map-pin"></i> ${s.name}
        </div>
        <div class="store-card-detail"><i class="ti ti-building"></i> ${s.address}</div>
        <div class="store-card-detail"><i class="ti ti-clock"></i> ${s.hours}</div>
        <div class="store-card-detail"><i class="ti ti-phone"></i> ${s.phone}</div>
        <a class="store-directions-btn" href="${mapsUrl(s)}" target="_blank" rel="noopener">
          <i class="ti ti-directions"></i> Get Directions
        </a>
      </div>
    `).join('');
  }

  function init() {
    const container = document.getElementById('storeCardsContainer');
    if (!container) return;
    renderCards(container);
  }

  return { init, STORES };
})();
