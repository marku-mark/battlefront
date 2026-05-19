/**
 * InventoryManager
 * Manages inventory display, restock alerts, and stock-level filtering.
 * OOP Principle: Encapsulation + Abstraction — data operations hidden behind clean methods.
 */
class InventoryManager {
  #products = [
    { id:'P001', name:'Intel Core i9-14900K',             category:'Processors',    stock:23, reorder:10, price:21995, status:'ok'       },
    { id:'P002', name:'AMD Ryzen 9 7900X',                category:'Processors',    stock:4,  reorder:8,  price:19995, status:'low'      },
    { id:'P003', name:'ASUS TUF RTX 4070 Ti Super 16GB',  category:'GPU',           stock:11, reorder:6,  price:52995, status:'ok'       },
    { id:'P004', name:'MSI GeForce RTX 4060 8GB',         category:'GPU',           stock:6,  reorder:8,  price:22995, status:'low'      },
    { id:'P005', name:'Corsair Vengeance DDR5 32GB',       category:'Memory',        stock:0,  reorder:15, price:6995,  status:'out'      },
    { id:'P006', name:'Samsung 990 Pro 2TB NVMe',          category:'Storage',       stock:2,  reorder:10, price:8495,  status:'critical' },
    { id:'P007', name:'Gigabyte Z790 AORUS Elite AX DDR5', category:'Motherboards',  stock:9,  reorder:5,  price:16995, status:'ok'       },
    { id:'P008', name:'NZXT H7 Flow ATX Mid-Tower',        category:'PC Cases',      stock:14, reorder:6,  price:9495,  status:'ok'       },
    { id:'P009', name:'DeepCool LT720 360mm AIO',          category:'Cooling',       stock:5,  reorder:6,  price:5495,  status:'low'      },
    { id:'P010', name:'Seasonic Focus GX-850 80+ Gold',    category:'Power Supply',  stock:18, reorder:8,  price:7295,  status:'ok'       },
    { id:'P011', name:'LG UltraGear 27" 4K 144Hz',         category:'Monitors',      stock:7,  reorder:5,  price:34495, status:'ok'       },
    { id:'P012', name:'Logitech G Pro X Superlight 2 DEX', category:'Peripherals',   stock:0,  reorder:10, price:6995,  status:'out'      },
    { id:'P013', name:'RAKK Kimat TKL Mech Keyboard',      category:'Peripherals',   stock:31, reorder:12, price:1295,  status:'ok'       },
    { id:'P014', name:'ASUS ROG Strix G16 Gaming Laptop',  category:'Laptops',       stock:3,  reorder:4,  price:89995, status:'critical' },
    { id:'P015', name:'Lenovo Legion 5i Gen 9',            category:'Laptops',       stock:8,  reorder:4,  price:69995, status:'ok'       },
  ];

  #currentFilter = 'all';
  #searchTerm = '';

  render(container) {
    container.innerHTML = `
      <div class="dash-section-title">
        <i class="ti ti-packages"></i> Inventory Management
        <span class="dash-subtitle">Real-time stock levels & restock alerts</span>
      </div>
      ${this.#renderAlertBanner()}
      <div class="inv-toolbar">
        <div class="inv-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="low">Low Stock</button>
          <button class="filter-btn" data-filter="critical">Critical</button>
          <button class="filter-btn" data-filter="out">Out of Stock</button>
        </div>
        <input class="inv-search" type="text" placeholder="Search products…" id="invSearch">
        <button class="btn-export" id="invExportBtn"><i class="ti ti-file-export"></i> Export CSV</button>
      </div>
      <div class="table-wrap" id="invTableWrap">
        ${this.#renderTable(this.#products)}
      </div>
    `;
    this.#bindEvents(container);
  }

  #renderAlertBanner() {
    const critical = this.#products.filter(p => p.status === 'critical' || p.status === 'out');
    if (!critical.length) return '';
    return `
      <div class="alert-banner">
        <i class="ti ti-alert-triangle"></i>
        <strong>${critical.length} products</strong> require immediate attention — critically low or out of stock.
        <span class="alert-items">${critical.map(p => p.name).join(' · ')}</span>
      </div>`;
  }

  #renderTable(products) {
    if (!products.length) return `<div class="empty-state"><i class="ti ti-search-off"></i><p>No products found.</p></div>`;
    return `
      <table class="inv-table">
        <thead>
          <tr>
            <th>ID</th><th>Product</th><th>Category</th>
            <th>Stock</th><th>Reorder At</th><th>Unit Price</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => this.#renderRow(p)).join('')}
        </tbody>
      </table>`;
  }

  #renderRow(p) {
    const statusMap = { ok:'status-ok', low:'status-low', critical:'status-critical', out:'status-out' };
    const statusLabel = { ok:'OK', low:'Low', critical:'Critical', out:'Out of Stock' };
    const pct = p.stock === 0 ? 0 : Math.min(100, Math.round((p.stock / (p.reorder * 3)) * 100));
    return `
      <tr class="${p.status !== 'ok' ? 'row-alert' : ''}">
        <td class="td-id">${p.id}</td>
        <td class="td-name">${p.name}</td>
        <td><span class="cat-tag">${p.category}</span></td>
        <td>
          <div class="stock-cell">
            <span class="stock-num">${p.stock}</span>
            <div class="stock-bar"><div class="stock-fill stock-fill-${p.status}" style="width:${pct}%"></div></div>
          </div>
        </td>
        <td>${p.reorder}</td>
        <td>₱${p.price.toLocaleString()}</td>
        <td><span class="status-badge ${statusMap[p.status]}">${statusLabel[p.status]}</span></td>
        <td>
          <button class="btn-restock" data-id="${p.id}"><i class="ti ti-refresh"></i> Restock</button>
        </td>
      </tr>`;
  }

  #filterAndSearch() {
    return this.#products.filter(p => {
      const matchFilter = this.#currentFilter === 'all' || p.status === this.#currentFilter;
      const matchSearch = p.name.toLowerCase().includes(this.#searchTerm) ||
                          p.category.toLowerCase().includes(this.#searchTerm);
      return matchFilter && matchSearch;
    });
  }

  #bindEvents(container) {
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.#currentFilter = btn.dataset.filter;
        container.querySelector('#invTableWrap').innerHTML = this.#renderTable(this.#filterAndSearch());
        this.#bindRestockEvents(container);
      });
    });

    container.querySelector('#invSearch').addEventListener('input', e => {
      this.#searchTerm = e.target.value.toLowerCase();
      container.querySelector('#invTableWrap').innerHTML = this.#renderTable(this.#filterAndSearch());
      this.#bindRestockEvents(container);
    });

    container.querySelector('#invExportBtn').addEventListener('click', () => this.#exportCSV());
    this.#bindRestockEvents(container);
  }

  #bindRestockEvents(container) {
    container.querySelectorAll('.btn-restock').forEach(btn => {
      btn.addEventListener('click', () => {
        const product = this.#products.find(p => p.id === btn.dataset.id);
        if (product) {
          product.stock += 20;
          if (product.stock >= product.reorder) product.status = 'ok';
          container.querySelector('#invTableWrap').innerHTML = this.#renderTable(this.#filterAndSearch());
          this.#bindRestockEvents(container);
        }
      });
    });
  }

  #exportCSV() {
    const headers = ['ID','Product','Category','Stock','Reorder At','Unit Price','Status'];
    const rows = this.#products.map(p =>
      [p.id, `"${p.name}"`, p.category, p.stock, p.reorder, p.price, p.status].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `battlefront_inventory_${Date.now()}.csv`;
    a.click();
  }
}
