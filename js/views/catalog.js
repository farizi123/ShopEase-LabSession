function renderCatalogView(container) {
    container.innerHTML = `
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Kategori:</span>
                ${['Semua', 'Elektronik', 'Pakaian', 'Aksesori'].map(cat => `
                    <button onclick="setCategoryFilter('${cat}')" 
                        class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${state.catalogFilter.category === cat ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
                        ${cat}
                    </button>
                `).join('')}
            </div>

            <div class="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div class="flex items-center gap-2">
                    <span class="text-xs text-slate-500 font-medium whitespace-nowrap">Maks Price:</span>
                    <input type="range" min="100000" max="2000000" step="100000" value="${state.catalogFilter.maxPrice}" 
                        oninput="handlePriceFilter(this.value)" 
                        class="w-24 sm:w-32 accent-brand-600">
                    <span id="price-filter-val" class="text-xs font-bold text-slate-700 min-w-[80px]">${formatIDR(state.catalogFilter.maxPrice)}</span>
                </div>

                <select onchange="handleSortChange(this.value)" class="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium">
                    <option value="default" ${state.catalogFilter.sort === 'default' ? 'selected' : ''}>Urutkan: Default</option>
                    <option value="price-low" ${state.catalogFilter.sort === 'price-low' ? 'selected' : ''}>Harga: Terendah</option>
                    <option value="price-high" ${state.catalogFilter.sort === 'price-high' ? 'selected' : ''}>Harga: Tertinggi</option>
                    <option value="rating" ${state.catalogFilter.sort === 'rating' ? 'selected' : ''}>Rating Tertinggi</option>
                </select>
            </div>
        </div>

        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>

        <div id="product-detail-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden"></div>
    `;

    renderCatalogGrid();
}

function renderCatalogGrid() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    let filtered = state.products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(state.catalogFilter.search.toLowerCase()) || 
                            p.description.toLowerCase().includes(state.catalogFilter.search.toLowerCase());
        const matchCat = state.catalogFilter.category === 'Semua' || p.category === state.catalogFilter.category;
        const matchPrice = p.price <= state.catalogFilter.maxPrice;
        return matchSearch && matchCat && matchPrice;
    });

    if (state.catalogFilter.sort === 'price-low') filtered.sort((a,b) => a.price - b.price);
    if (state.catalogFilter.sort === 'price-high') filtered.sort((a,b) => b.price - a.price);
    if (state.catalogFilter.sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200">
                <i class="fa-solid fa-box-open text-4xl text-slate-300 mb-3"></i>
                <h4 class="text-base font-bold text-slate-700">Produk Tidak Ditemukan</h4>
                <p class="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau sesuaikan filter harga Anda.</p>
                <button onclick="resetCatalogFilters()" class="mt-4 px-4 py-2 text-xs font-semibold bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-100">Reset Filter</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group">
            <div class="relative h-48 bg-slate-100 overflow-hidden cursor-pointer" onclick="openProductDetail('${p.id}')">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                    ${p.category}
                </span>
                ${p.stock === 0 ? `
                    <span class="absolute top-3 right-3 bg-rose-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm">Stok Habis</span>
                ` : `
                    <span class="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-sm">Stok: ${p.stock}</span>
                `}
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center gap-1 text-amber-400 text-xs mb-1">
                        <i class="fa-solid fa-star"></i>
                        <span class="font-bold text-slate-700">${p.rating}</span>
                        <span class="text-slate-400 text-[11px]">(${p.reviews.length} ulasan)</span>
                    </div>
                    <h3 onclick="openProductDetail('${p.id}')" class="text-sm font-bold text-slate-900 line-clamp-2 cursor-pointer hover:text-brand-600 transition-colors">
                        ${p.name}
                    </h3>
                </div>

                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                        <span class="text-xs text-slate-400 block">Harga</span>
                        <span class="text-base font-bold text-brand-600">${formatIDR(p.price)}</span>
                    </div>
                    <button onclick="addToCart('${p.id}')" ${p.stock === 0 ? 'disabled' : ''} 
                        class="px-3 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 transition-colors ${p.stock === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 active:scale-95'}">
                        <i class="fa-solid fa-cart-plus"></i>
                        <span>+ Keranjang</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setCategoryFilter(cat) {
    state.catalogFilter.category = cat;
    renderCatalogView(document.getElementById('main-container'));
}

function handlePriceFilter(val) {
    state.catalogFilter.maxPrice = parseInt(val);
    document.getElementById('price-filter-val').textContent = formatIDR(val);
    renderCatalogGrid();
}

function handleSortChange(val) {
    state.catalogFilter.sort = val;
    renderCatalogGrid();
}

function resetCatalogFilters() {
    state.catalogFilter = { search: '', category: 'Semua', maxPrice: 2000000, sort: 'default' };
    const input = document.getElementById('global-search-input');
    if (input) input.value = '';
    renderCatalogView(document.getElementById('main-container'));
}

function openProductDetail(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-detail-modal');
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onclick="closeProductDetail()" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <img src="${product.image}" alt="${product.name}" class="w-full h-60 object-cover rounded-xl border border-slate-200">
                <div class="flex flex-col justify-between">
                    <div>
                        <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">${product.category}</span>
                        <h2 class="text-lg font-bold text-slate-900 mt-2">${product.name}</h2>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-amber-400 font-bold text-sm"><i class="fa-solid fa-star"></i> ${product.rating}</span>
                            <span class="text-xs text-slate-400">| Stok: ${product.stock > 0 ? product.stock + ' unit' : 'Habis'}</span>
                        </div>
                        <p class="text-2xl font-bold text-brand-600 mt-3">${formatIDR(product.price)}</p>
                        <p class="text-xs text-slate-600 mt-3 leading-relaxed">${product.description}</p>
                    </div>

                    <button onclick="addToCart('${product.id}'); closeProductDetail();" ${product.stock === 0 ? 'disabled' : ''}
                        class="mt-6 w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                        <i class="fa-solid fa-cart-shopping"></i> Tambahkan ke Keranjang
                    </button>
                </div>
            </div>

            <div class="mt-8 pt-6 border-t border-slate-200">
                <h4 class="font-bold text-sm text-slate-900 mb-4">Ulasan Pembeli (${product.reviews.length})</h4>
                ${product.reviews.length === 0 ? `
                    <p class="text-xs text-slate-400 italic">Belum ada ulasan untuk produk ini.</p>
                ` : `
                    <div class="space-y-3">
                        ${product.reviews.map(r => `
                            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-slate-800">${r.reviewer}</span>
                                    <span class="text-[10px] text-slate-400">${r.date}</span>
                                </div>
                                <div class="text-amber-400 text-xs my-1">
                                    ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
                                </div>
                                <p class="text-xs text-slate-600">${r.comment}</p>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </div>
    `;
    modal.classList.remove('hidden');
}

function closeProductDetail() {
    document.getElementById('product-detail-modal').classList.add('hidden');
}