/**
 * StoreLocator.js
 * Renders store location cards and links to Google Maps.
 */

const StoreLocator = (() => {
  const STORES = [
    {
      id: 1,
      name: 'Battlefront Computer & Piso-Wifi Store',
      branch: 'Sagay Branch',
      address: 'Infront of Western Union, Maria Lopez Elementary School, AE Marañon St, Unhan, Sagay City, 6122 Negros Occidental',
      landmark: 'Beside LBC Express',
      hours: 'Mon–Sat 8AM–6PM, Sun 10AM–5PM',
      phone: '(034) 400-0001',
      lat: 10.893563,
      lng: 123.413813,
    },
    {
      id: 2,
      name: 'Battlefront Computer Parts & Accessories',
      branch: 'Escalante Branch',
      address: 'Escalante City, Negros Occidental',
      landmark: '',
      hours: 'Mon–Sat 8AM–6PM',
      phone: '(034) 400-0002',
      lat: 10.842687,
      lng: 123.498562,
    },
    {
      id: 3,
      name: 'Battlefront Computer & Piso-Wifi Store',
      branch: 'San Carlos Branch',
      address: 'Infront of Metro Bank, Siroy Building, Carmona Street, Barangay 5, San Carlos City, 6127 Negros Occidental',
      landmark: 'Beside Pure Gold',
      hours: 'Mon–Sat 8AM–6PM',
      phone: '(034) 400-0003',
      lat: 10.482812,
      lng: 123.421187,
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
        <div class="store-card-detail" style="font-size:11px;font-weight:600;color:var(--color-cta);text-transform:uppercase;letter-spacing:0.05em;">
          <i class="ti ti-git-branch"></i> ${s.branch}
        </div>
        <div class="store-card-detail"><i class="ti ti-building"></i> ${s.address}</div>
        ${s.landmark ? `<div class="store-card-detail"><i class="ti ti-flag"></i> ${s.landmark}</div>` : ''}
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