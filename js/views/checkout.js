function renderCheckoutView(container) {
    if (state.cart.length === 0) {
        navigateTo('cart');
        return;
    }

    const user = state.currentUser || {};
    let subtotal = 0;
    state.cart.forEach(item => {
        const p = state.products.find(prod => prod.id === item.productId);
        if (p) subtotal += p.price * item.qty;
    });
    const tax = Math.round(subtotal * 0.11);
    let discount = state.appliedCoupon ? Math.round(subtotal * state.appliedCoupon.rate) : 0;

    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-slate-900">Checkout & Pengiriman</h2>
            <p class="text-xs text-slate-500">Lengkapi data penerima dan pilih metode pembayaran</p>
        </div>

        <form id="checkout-form" onsubmit="handlePlaceOrder(event)" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <i class="fa-solid fa-location-dot text-brand-600"></i> Alamat Pengiriman
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Penerima <span class="text-rose-500">*</span></label>
                            <input type="text" id="chk-name" value="${user.name || ''}" placeholder="Ahmad Pelanggan" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                            <span id="chk-name-err" class="text-[11px] text-rose-500 font-medium hidden"></span>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon <span class="text-rose-500">*</span></label>
                            <input type="text" id="chk-phone" value="${user.phone || ''}" placeholder="081234567890" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                            <span id="chk-phone-err" class="text-[11px] text-rose-500 font-medium hidden"></span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Alamat Lengkap <span class="text-rose-500">*</span></label>
                        <textarea id="chk-address" rows="2" placeholder="Jl. Merdeka No. 45, Bandung" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">${user.address || ''}</textarea>
                        <span id="chk-address-err" class="text-[11px] text-rose-500 font-medium hidden"></span>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <i class="fa-solid fa-truck-fast text-brand-600"></i> Kurir Pengiriman
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label class="border border-slate-200 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:border-brand-500 transition-colors">
                            <input type="radio" name="shipping-option" value="10000" checked onchange="updateCheckoutTotal()" class="accent-brand-600">
                            <div>
                                <span class="text-xs font-bold text-slate-800 block">Reguler</span>
                                <span class="text-[10px] text-slate-400 block">Rp 10.000 (2-3 hari)</span>
                            </div>
                        </label>
                        <label class="border border-slate-200 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:border-brand-500 transition-colors">
                            <input type="radio" name="shipping-option" value="25000" onchange="updateCheckoutTotal()" class="accent-brand-600">
                            <div>
                                <span class="text-xs font-bold text-slate-800 block">Ekspres</span>
                                <span class="text-[10px] text-slate-400 block">Rp 25.000 (1 hari)</span>
                            </div>
                        </label>
                        <label class="border border-slate-200 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:border-brand-500 transition-colors">
                            <input type="radio" name="shipping-option" value="40000" onchange="updateCheckoutTotal()" class="accent-brand-600">
                            <div>
                                <span class="text-xs font-bold text-slate-800 block">Instan</span>
                                <span class="text-[10px] text-slate-400 block">Rp 40.000 (3 jam)</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 class="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <i class="fa-solid fa-credit-card text-brand-600"></i> Metode Pembayaran
                    </h3>
                    <div class="space-y-2">
                        <label class="border border-slate-200 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-500 transition-colors">
                            <div class="flex items-center gap-3">
                                <input type="radio" name="payment-method" value="Transfer Bank BCA" checked class="accent-brand-600">
                                <span class="text-xs font-bold text-slate-800">Transfer Bank BCA</span>
                            </div>
                            <span class="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">8830-192-001</span>
                        </label>
                        <label class="border border-slate-200 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-500 transition-colors">
                            <div class="flex items-center gap-3">
                                <input type="radio" name="payment-method" value="E-Wallet GoPay" class="accent-brand-600">
                                <span class="text-xs font-bold text-slate-800">E-Wallet (GoPay / OVO)</span>
                            </div>
                            <span class="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">QRIS / Instant</span>
                        </label>
                        <label class="border border-slate-200 p-3.5 rounded-xl flex items-center justify-between cursor-pointer hover:border-brand-500 transition-colors">
                            <div class="flex items-center gap-3">
                                <input type="radio" name="payment-method" value="Kartu Kredit" class="accent-brand-600">
                                <span class="text-xs font-bold text-slate-800">Kartu Kredit / Debit</span>
                            </div>
                            <span class="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">Visa / Mastercard</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit sticky top-24">
                <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">Rincian Pembayaran</h4>
                <div class="flex justify-between text-xs text-slate-600">
                    <span>Subtotal Produk</span>
                    <span class="font-semibold">${formatIDR(subtotal)}</span>
                </div>
                <div class="flex justify-between text-xs text-slate-600">
                    <span>PPN (11%)</span>
                    <span class="font-semibold">${formatIDR(tax)}</span>
                </div>
                <div class="flex justify-between text-xs text-slate-600">
                    <span>Ongkos Kirim</span>
                    <span id="chk-shipping-cost" class="font-semibold">Rp 10.000</span>
                </div>
                ${discount > 0 ? `
                    <div class="flex justify-between text-xs text-emerald-600 font-semibold">
                        <span>Diskon Kupon</span>
                        <span>-${formatIDR(discount)}</span>
                    </div>
                ` : ''}
                
                <div class="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <span class="text-sm font-bold text-slate-900">Total Akhir</span>
                    <span id="chk-grand-total" class="text-xl font-bold text-brand-600">${formatIDR(subtotal + tax + 10000 - discount)}</span>
                </div>

                <button type="submit" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
                    <i class="fa-solid fa-lock"></i> Buat Pesanan Sekarang
                </button>
            </div>
        </form>
    `;
}

function updateCheckoutTotal() {
    const selectedShipping = parseInt(document.querySelector('input[name="shipping-option"]:checked').value);
    document.getElementById('chk-shipping-cost').textContent = formatIDR(selectedShipping);

    let subtotal = 0;
    state.cart.forEach(item => {
        const p = state.products.find(prod => prod.id === item.productId);
        if (p) subtotal += p.price * item.qty;
    });
    const tax = Math.round(subtotal * 0.11);
    let discount = state.appliedCoupon ? Math.round(subtotal * state.appliedCoupon.rate) : 0;
    
    const total = subtotal + tax + selectedShipping - discount;
    document.getElementById('chk-grand-total').textContent = formatIDR(total);
}

function handlePlaceOrder(e) {
    e.preventDefault();
    const name = document.getElementById('chk-name').value.trim();
    const phone = document.getElementById('chk-phone').value.trim();
    const address = document.getElementById('chk-address').value.trim();

    const nameErr = document.getElementById('chk-name-err');
    const phoneErr = document.getElementById('chk-phone-err');
    const addrErr = document.getElementById('chk-address-err');

    [nameErr, phoneErr, addrErr].forEach(el => el.classList.add('hidden'));

    let isValid = true;
    if (!name) { nameErr.textContent = 'Nama wajib diisi'; nameErr.classList.remove('hidden'); isValid = false; }
    if (!phone || phone.length < 9) { phoneErr.textContent = 'Nomor HP tidak valid'; phoneErr.classList.remove('hidden'); isValid = false; }
    if (!address) { addrErr.textContent = 'Alamat wajib diisi'; addrErr.classList.remove('hidden'); isValid = false; }

    if (!isValid) return;

    let subtotal = 0;
    const items = state.cart.map(item => {
        const p = state.products.find(prod => prod.id === item.productId);
        subtotal += p.price * item.qty;
        p.stock = Math.max(0, p.stock - item.qty);
        return { productId: p.id, name: p.name, price: p.price, qty: item.qty };
    });

    const shippingFee = parseInt(document.querySelector('input[name="shipping-option"]:checked').value);
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const tax = Math.round(subtotal * 0.11);
    const discount = state.appliedCoupon ? Math.round(subtotal * state.appliedCoupon.rate) : 0;
    const total = subtotal + tax + shippingFee - discount;

    const newOrder = {
        id: 'ORD-2026-' + Math.floor(100 + Math.random() * 900),
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        items,
        subtotal,
        shippingFee,
        tax,
        discount,
        total,
        status: 'Menunggu Pembayaran',
        recipientName: name,
        recipientPhone: phone,
        address,
        shippingMethod: shippingFee === 10000 ? 'Reguler' : (shippingFee === 25000 ? 'Ekspres' : 'Instan'),
        paymentMethod
    };

    state.orders.unshift(newOrder);
    state.cart = [];
    state.appliedCoupon = null;
    saveToStorage();

    showToast('Pesanan Berhasil', `Pesanan ${newOrder.id} berhasil dibuat!`, 'success');
    navigateTo('orders');
}