function renderProfileView(container) {
    const user = state.currentUser || DEFAULT_USER;

    container.innerHTML = `
        <div class="max-w-3xl mx-auto my-6 space-y-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-brand-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                    ${user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 class="text-lg font-bold text-slate-900">${user.name}</h2>
                    <p class="text-xs text-slate-500">${user.email} • ${user.phone}</p>
                    <span class="inline-block px-2.5 py-0.5 bg-brand-50 text-brand-700 font-semibold rounded-md text-[10px] mt-1">Peran: Pelanggan (Customer)</span>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Perbarui Profil Pelanggan</h3>
                <form onsubmit="handleUpdateProfile(event)" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                            <input type="text" id="prof-name" value="${user.name}" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon</label>
                            <input type="text" id="prof-phone" value="${user.phone}" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Alamat Utama Pengiriman</label>
                        <textarea id="prof-address" rows="2" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">${user.address || ''}</textarea>
                    </div>
                    <button type="submit" class="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-colors">
                        Simpan Perubahan Profil
                    </button>
                </form>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 class="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Berikan Ulasan Produk</h3>
                <p class="text-xs text-slate-500">Pilih produk dari katalog untuk memberikan rating bintang 1-5 dan ulasan.</p>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    ${state.products.map(p => `
                        <div class="p-3 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2 overflow-hidden">
                                <img src="${p.image}" class="w-10 h-10 object-cover rounded-lg shrink-0">
                                <span class="text-xs font-bold text-slate-800 truncate">${p.name}</span>
                            </div>
                            <button onclick="openReviewModal('${p.id}')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-lg whitespace-nowrap">
                                <i class="fa-solid fa-star"></i> Ulas
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div id="review-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden"></div>
    `;
}

function handleUpdateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('prof-name').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const address = document.getElementById('prof-address').value.trim();

    if (!name || !phone) {
        showToast('Gagal Simpan', 'Nama dan Nomor Telepon wajib diisi.', 'error');
        return;
    }

    state.currentUser.name = name;
    state.currentUser.phone = phone;
    state.currentUser.address = address;
    saveToStorage();

    showToast('Profil Diperbarui', 'Data profil pelanggan berhasil disimpan.', 'success');
    renderProfileView(document.getElementById('main-container'));
}

function openReviewModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('review-modal');
    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button onclick="document.getElementById('review-modal').classList.add('hidden')" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <h3 class="text-base font-bold text-slate-900 mb-1">Ulas Produk</h3>
            <p class="text-xs text-slate-500 mb-4">${product.name}</p>

            <form onsubmit="submitProductReview(event, '${product.id}')" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Rating Bintang (1 - 5)</label>
                    <select id="rev-rating" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                        <option value="5">5 ★★★★★ (Sangat Bagus)</option>
                        <option value="4">4 ★★★★☆ (Bagus)</option>
                        <option value="3">3 ★★★☆☆ (Cukup)</option>
                        <option value="2">2 ★★☆☆☆ (Buruk)</option>
                        <option value="1">1 ★☆☆☆☆ (Sangat Buruk)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Ulasan Anda</label>
                    <textarea id="rev-comment" rows="3" placeholder="Tuliskan ulasan Anda..." class="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500"></textarea>
                </div>
                <button type="submit" class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition-colors">
                    Kirim Ulasan
                </button>
            </form>
        </div>
    `;
    modal.classList.remove('hidden');
}

function submitProductReview(e, productId) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('rev-rating').value);
    const comment = document.getElementById('rev-comment').value.trim();

    if (!comment) {
        showToast('Gagal', 'Silakan tulis ulasan Anda.', 'error');
        return;
    }

    const product = state.products.find(p => p.id === productId);
    if (product) {
        product.reviews.unshift({
            reviewer: state.currentUser ? state.currentUser.name : 'Pelanggan',
            rating,
            comment,
            date: new Date().toISOString().split('T')[0]
        });
        saveToStorage();
        showToast('Ulasan Berhasil', 'Terima kasih atas ulasan Anda!', 'success');
        document.getElementById('review-modal').classList.add('hidden');
        renderProfileView(document.getElementById('main-container'));
    }
}