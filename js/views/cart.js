function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || product.stock === 0) {
        showToast('Gagal Tambah', 'Stok produk ini sedang habis.', 'error');
        return;
    }

    const existItem = state.cart.find(item => item.productId === productId);
    if (existItem) {
        if (existItem.qty >= product.stock) {
            showToast('Batas Stok', `Maksimal stok yang tersedia adalah ${product.stock}`, 'warning');
            return;
        }
        existItem.qty += 1;
    } else {
        state.cart.push({ productId, qty: 1 });
    }

    saveToStorage();
    showToast('Keranjang Diperbarui', `${product.name} telah ditambahkan ke keranjang!`, 'success');
}

function renderCartView(container) {
    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="max-w-2xl mx-auto my-12 bg-white p-12 text-center rounded-2xl border border-slate-200">
                <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                </div>
                <h3 class="text-lg font-bold text-slate-800">Keranjang Belanja Anda Kosong</h3>
                <p class="text-xs text-slate-500 mt-1 mb-6">Jelajahi katalog dan tambahkan produk yang Anda inginkan.</p>
                <button onclick="navigateTo('catalog')" class="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors">
                    Lihat Katalog Produk
                </button>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    const cartItems = state.cart.map(item => {
        const product = state.products.find(p => p.id === item.productId);
        const totalProductPrice = (product ? product.price : 0) * item.qty;
        subtotal += totalProductPrice;
        return { ...item, product, totalProductPrice };
    });

    const tax = Math.round(subtotal * 0.11);
    let discountAmount = state.appliedCoupon ? Math.round(subtotal * state.appliedCoupon.rate) : 0;
    const grandTotal = subtotal + tax - discountAmount;

    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-slate-900">Keranjang Belanja</h2>
            <p class="text-xs text-slate-500">Periksa item dan terapkan kupon sebelum checkout</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
                ${cartItems.map(item => `
                    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <img src="${item.product.image}" alt="${item.product.name}" class="w-20 h-20 object-cover rounded-xl border border-slate-100 shrink-0">
                        <div class="flex-1">
                            <h4 class="text-sm font-bold text-slate-900">${item.product.name}</h4>
                            <span class="text-xs text-brand-600 font-bold block mt-0.5">${formatIDR(item.product.price)}</span>
                        </div>
                        <div class="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                            <button onclick="updateCartQty('${item.productId}',${item.qty - 1})" class="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold">-</button>
                            <span class="px-3 text-xs font-bold text-slate-800">${item.qty}</span>
                            <button onclick="updateCartQty('${item.productId}',${item.qty + 1})" class="px-2.5 py-1 text-slate-600 hover:bg-slate-200 text-xs font-bold">+</button>
                        </div>
                        <div class="text-right min-w-[90px]">
                            <span class="text-sm font-bold text-slate-900 block">${formatIDR(item.totalProductPrice)}</span>
                            <button onclick="removeFromCart('${item.productId}')" class="text-[11px] text-rose-500 hover:underline mt-1">Hapus</button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="space-y-6">
                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Kode Promo / Kupon</h4>
                    <div class="flex gap-2">
                        <input type="text" id="coupon-code-input" placeholder="contoh: DISCOUNT10" 
                            class="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono uppercase"
                            value="${state.appliedCoupon ? state.appliedCoupon.code : ''}">
                        <button onclick="applyCoupon()" class="px-4 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors">
                            Terapkan
                        </button>
                    </div>
                    <span class="text-[10px] text-slate-400 mt-2 block">Gunakan kode <strong class="text-brand-600">DISCOUNT10</strong> untuk diskon 10%</span>
                    ${state.appliedCoupon ? `
                        <div class="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-700">
                            <span><i class="fa-solid fa-tag mr-1"></i> Kupon <strong>${state.appliedCoupon.code}</strong> aktif!</span>
                            <button onclick="removeCoupon()" class="text-rose-500 font-bold hover:underline text-[10px]">Lepas</button>
                        </div>
                    ` : ''}
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Ringkasan Belanja</h4>
                    <div class="flex justify-between text-xs text-slate-600">
                        <span>Subtotal Produk</span>
                        <span class="font-semibold text-slate-800">${formatIDR(subtotal)}</span>
                    </div>
                    <div class="flex justify-between text-xs text-slate-600">
                        <span>PPN (11%)</span>
                        <span class="font-semibold text-slate-800">${formatIDR(tax)}</span>
                    </div>
                    ${discountAmount > 0 ? `
                        <div class="flex justify-between text-xs text-emerald-600 font-semibold">
                            <span>Diskon Promo</span>
                            <span>-${formatIDR(discountAmount)}</span>
                        </div>
                    ` : ''}
                    <div class="border-t border-slate-100 pt-3 flex justify-between items-center">
                        <span class="text-sm font-bold text-slate-900">Total Sementara</span>
                        <span class="text-lg font-bold text-brand-600">${formatIDR(grandTotal)}</span>
                    </div>

                    <button onclick="navigateTo('checkout')" class="w-full py-3 mt-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                        Lanjut Ke Pembayaran <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateCartQty(productId, newQty) {
    if (newQty <= 0) {
        removeFromCart(productId);
        return;
    }
    const product = state.products.find(p => p.id === productId);
    if (newQty > product.stock) {
        showToast('Batas Stok', `Stok terbatas, hanya tersedia ${product.stock} unit.`, 'warning');
        return;
    }

    const item = state.cart.find(i => i.productId === productId);
    if (item) {
        item.qty = newQty;
        saveToStorage();
        renderCartView(document.getElementById('main-container'));
    }
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(i => i.productId !== productId);
    saveToStorage();
    showToast('Item Dihapus', 'Produk dikeluarkan dari keranjang belanja.', 'info');
    renderCartView(document.getElementById('main-container'));
}

function applyCoupon() {
    const code = document.getElementById('coupon-code-input').value.trim().toUpperCase();
    if (code === 'DISCOUNT10') {
        state.appliedCoupon = { code: 'DISCOUNT10', rate: 0.10 };
        showToast('Kupon Berhasil', 'Diskon 10% berhasil diterapkan!', 'success');
    } else {
        showToast('Kupon Tidak Valid', 'Kode kupon tidak ditemukan. Gunakan DISCOUNT10.', 'error');
    }
    renderCartView(document.getElementById('main-container'));
}

function removeCoupon() {
    state.appliedCoupon = null;
    showToast('Kupon Dilepas', 'Kupon promo telah dibatalkan.', 'info');
    renderCartView(document.getElementById('main-container'));
}