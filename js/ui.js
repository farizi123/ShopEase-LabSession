function formatIDR(num) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}

function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toastId = 'toast-' + Date.now();
    
    const colorMap = {
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800 icon-emerald-500 fa-circle-check text-emerald-500',
        error: 'bg-rose-50 border-rose-200 text-rose-800 icon-rose-500 fa-circle-xmark text-rose-500',
        warning: 'bg-amber-50 border-amber-200 text-amber-800 icon-amber-500 fa-triangle-exclamation text-amber-500',
        info: 'bg-blue-50 border-blue-200 text-blue-800 icon-blue-500 fa-circle-info text-blue-500'
    };

    const styles = colorMap[type] || colorMap.info;
    const iconClass = styles.split(' ')[4];

    const html = `
        <div id="${toastId}" class="toast-enter pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${styles.split(' ')[0]} ${styles.split(' ')[1]} transition-all">
            <i class="fa-solid ${iconClass} text-xl shrink-0 mt-0.5"></i>
            <div class="flex-1">
                <h5 class="text-sm font-bold ${styles.split(' ')[2]}">${title}</h5>
                <p class="text-xs ${styles.split(' ')[2]} opacity-90 mt-0.5">${message}</p>
            </div>
            <button onclick="removeToast('${toastId}')" class="text-slate-400 hover:text-slate-600">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', html);
    setTimeout(() => removeToast(toastId), 4500);
}

function removeToast(id) {
    const toast = document.getElementById(id);
    if (toast) {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }
}

function openModal({ title, subtitle, body, icon, iconBg, onConfirm }) {
    const modal = document.getElementById('global-modal');
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-subtitle').textContent = subtitle || '';
    document.getElementById('modal-body').textContent = body;
    
    const iconElem = document.getElementById('modal-icon');
    const iconBgElem = document.getElementById('modal-icon-bg');
    
    iconElem.className = `fa-solid ${icon || 'fa-circle-question'}`;
    iconBgElem.className = `w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${iconBg || 'bg-blue-100 text-blue-600'}`;

    const confirmBtn = document.getElementById('modal-confirm-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    confirmBtn.onclick = () => {
        modal.classList.add('hidden');
        if (onConfirm) onConfirm();
    };

    cancelBtn.onclick = () => modal.classList.add('hidden');
    modal.classList.remove('hidden');
}

function renderHeaderNav() {
    const container = document.getElementById('nav-user-container');
    updateCartBadge();

    if (state.currentUser) {
        container.innerHTML = `
            <div class="flex items-center gap-3">
                <button onclick="navigateTo('profile')" class="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors">
                    <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center border border-brand-200">
                        ${state.currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="text-sm font-semibold max-w-[120px] truncate hidden sm:inline-block">${state.currentUser.name}</span>
                </button>
                <button onclick="handleLogout()" title="Keluar Akun" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="flex items-center gap-2">
                <button onclick="navigateTo('login')" class="px-3.5 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                    Masuk
                </button>
                <button onclick="navigateTo('register')" class="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-colors">
                    Daftar
                </button>
            </div>
        `;
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge-count');
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function handleLogout() {
    openModal({
        title: 'Konfirmasi Logout',
        subtitle: 'Autentikasi Pengguna',
        body: 'Apakah Anda yakin ingin keluar dari akun?',
        icon: 'fa-right-from-bracket',
        iconBg: 'bg-rose-100 text-rose-600',
        onConfirm: () => {
            state.currentUser = null;
            saveToStorage();
            showToast('Logout Berhasil', 'Anda telah keluar dari akun.', 'info');
            navigateTo('login');
        }
    });
}

function handleGlobalSearch(event) {
    const query = event.target.value.trim();
    state.catalogFilter.search = query;
    if (state.activeView !== 'catalog') {
        navigateTo('catalog');
    } else {
        renderCatalogGrid();
    }
}

/* QA Helper Methods */
function toggleQAPanel() {
    const panel = document.getElementById('qa-panel');
    if (panel) panel.classList.toggle('hidden');
}

function updateQAAssistantContext() {
    const pageNameEl = document.getElementById('qa-active-page-name');
    const tipsEl = document.getElementById('qa-test-tips');
    if (!pageNameEl || !tipsEl) return;

    const contextMap = {
        'catalog': { name: 'Katalog & Search', tips: 'Tips: Gunakan pencarian atau filter kategori untuk menguji pencarian produk.' },
        'login': { name: 'Autentikasi - Login', tips: 'Tips: Uji login dengan kredensial valid (user@shopease.com / password123) atau invalid.' },
        'register': { name: 'Autentikasi - Register', tips: 'Tips: Uji registrasi dengan email baru atau email yang sudah terdaftar.' },
        'forgot-password': { name: 'Lupa Password', tips: 'Tips: Gunakan email user@shopease.com dan kode OTP 123456.' },
        'cart': { name: 'Keranjang Belanja', tips: 'Tips: Gunakan kode kupon DISCOUNT10 untuk pengujian diskon.' },
        'checkout': { name: 'Checkout & Pembayaran', tips: 'Tips: Pengisian otomatis formulir pengiriman dan metode pembayaran.' },
        'orders': { name: 'Riwayat Pesanan', tips: 'Tips: Uji fitur pembatalan pesanan dan pelacakan status.' },
        'profile': { name: 'Profil & Ulasan', tips: 'Tips: Uji pembaruan data pengguna dan pemberian ulasan produk.' }
    };

    const ctx = contextMap[state.activeView] || contextMap['catalog'];
    pageNameEl.innerHTML = `<i class="fa-solid fa-circle-dot text-[8px]"></i> ${ctx.name}`;
    tipsEl.textContent = ctx.tips;
}

function autoFillForm(type) {
    if (state.activeView === 'login') {
        document.getElementById('login-email').value = type === 'valid' ? 'user@shopease.com' : 'invalid@user.com';
        document.getElementById('login-password').value = type === 'valid' ? 'password123' : 'wrongpass';
    } else if (state.activeView === 'register') {
        document.getElementById('reg-name').value = type === 'valid' ? 'Budi QA Tester' : '';
        document.getElementById('reg-email').value = type === 'valid' ? `tester${Date.now()}@shopease.com` : 'invalid-email';
        document.getElementById('reg-phone').value = type === 'valid' ? '081299998888' : '123';
        document.getElementById('reg-pass').value = type === 'valid' ? 'password123' : '123';
        document.getElementById('reg-pass-confirm').value = type === 'valid' ? 'password123' : '456';
        document.getElementById('reg-terms').checked = type === 'valid';
    } else if (state.activeView === 'checkout') {
        document.getElementById('chk-name').value = type === 'valid' ? 'Ahmad Tester' : '';
        document.getElementById('chk-phone').value = type === 'valid' ? '081234567890' : '';
        document.getElementById('chk-address').value = type === 'valid' ? 'Jl. Pengujian No. 123, Jakarta' : '';
    }
    showToast('Auto-Fill', `Formulir diisi dengan data ${type.toUpperCase()}`, 'info');
}