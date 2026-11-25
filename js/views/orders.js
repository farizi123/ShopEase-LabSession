function renderOrdersView(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-slate-900">Riwayat Pesanan Saya</h2>
            <p class="text-xs text-slate-500">Pantau status pengiriman dan riwayat transaksi Anda</p>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
            ${['Semua', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map(st => `
                <button onclick="renderOrdersList('${st}')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                    ${st}
                </button>
            `).join('')}
        </div>

        <div id="orders-list-container" class="space-y-4"></div>

        <div id="order-detail-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden"></div>
    `;

    renderOrdersList('Semua');
}

function renderOrdersList(filterStatus) {
    const container = document.getElementById('orders-list-container');
    if (!container) return;

    let filtered = state.orders;
    if (filterStatus !== 'Semua') {
        filtered = state.orders.filter(o => o.status === filterStatus);
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="bg-white p-8 text-center rounded-2xl border border-slate-200">
                <i class="fa-solid fa-receipt text-3xl text-slate-300 mb-2"></i>
                <p class="text-xs font-bold text-slate-600">Tidak ada pesanan dengan status '${filterStatus}'</p>
            </div>
        `;
        return;
    }

    const statusColors = {
        'Menunggu Pembayaran': 'bg-amber-100 text-amber-800 border-amber-300',
        'Diproses': 'bg-blue-100 text-blue-800 border-blue-300',
        'Dikirim': 'bg-indigo-100 text-indigo-800 border-indigo-300',
        'Selesai': 'bg-emerald-100 text-emerald-800 border-emerald-300',
        'Dibatalkan': 'bg-rose-100 text-rose-800 border-rose-300'
    };

    container.innerHTML = filtered.map(o => `
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="space-y-1.5 flex-1">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-xs font-bold text-slate-900">${o.id}</span>
                    <span class="text-[10px] text-slate-400">• ${o.date}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[o.status]}">
                        ${o.status}
                    </span>
                </div>

                <div class="text-xs text-slate-600">
                    <strong>Daftar Item:</strong> ${o.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                </div>

                <div class="text-xs text-slate-500">
                    Pembayaran: <span class="font-semibold text-slate-700">${o.paymentMethod}</span>
                </div>
            </div>

            <div class="flex flex-col md:items-end gap-2 w-full md:w-auto border-t md:border-0 pt-3 md:pt-0 border-slate-100">
                <span class="text-xs text-slate-400">Total Belanja</span>
                <span class="text-base font-bold text-brand-600">${formatIDR(o.total)}</span>

                <div class="flex items-center gap-2 mt-1">
                    <button onclick="openOrderDetailModal('${o.id}')" class="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors">
                        <i class="fa-solid fa-circle-info mr-1"></i> Detail Tracking
                    </button>

                    ${(o.status === 'Menunggu Pembayaran' || o.status === 'Diproses') ? `
                        <button onclick="cancelOrder('${o.id}')" class="px-3 py-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors">
                            Batalkan
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function openOrderDetailModal(orderId) {
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('order-detail-modal');
    const steps = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'];
    let currentStepIdx = steps.indexOf(order.status);
    if (order.status === 'Dibatalkan') currentStepIdx = -1;

    modal.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onclick="document.getElementById('order-detail-modal').classList.add('hidden')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <h3 class="text-base font-bold text-slate-900 mb-1">Status Tracking Pesanan ${order.id}</h3>
            <p class="text-xs text-slate-500 mb-6">Informasi pengiriman dan rincian transaksi</p>

            ${order.status === 'Dibatalkan' ? `
                <div class="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center text-xs text-rose-700 font-semibold mb-6">
                    <i class="fa-solid fa-circle-xmark mr-1"></i> Pesanan ini telah dibatalkan.
                </div>
            ` : `
                <div class="flex items-center justify-between mb-8 relative px-2">
                    <div class="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
                    ${steps.map((st, idx) => {
                        const isPassed = idx <= currentStepIdx;
                        return `
                            <div class="relative z-10 flex flex-col items-center gap-1.5">
                                <div class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border-2 transition-colors ${isPassed ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-300 text-slate-400'}">
                                    ${idx + 1}
                                </div>
                                <span class="text-[10px] font-semibold ${isPassed ? 'text-brand-600' : 'text-slate-400'}">${st}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}

            <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div class="flex justify-between"><span>Penerima:</span> <strong class="text-slate-800">${order.recipientName} (${order.recipientPhone})</strong></div>
                <div class="flex justify-between"><span>Alamat:</span> <span class="text-slate-800 text-right max-w-[220px]">${order.address}</span></div>
                <div class="flex justify-between"><span>Metode Kurir:</span> <strong class="text-slate-800">${order.shippingMethod}</strong></div>
                <div class="flex justify-between"><span>Pembayaran:</span> <strong class="text-slate-800">${order.paymentMethod}</strong></div>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function cancelOrder(orderId) {
    openModal({
        title: 'Batalkan Pesanan',
        subtitle: 'Aksi Pengujian Order',
        body: `Apakah Anda yakin ingin membatalkan pesanan ${orderId}? Stok akan dikembalikan.`,
        icon: 'fa-ban',
        iconBg: 'bg-rose-100 text-rose-600',
        onConfirm: () => {
            const order = state.orders.find(o => o.id === orderId);
            if (order) {
                order.status = 'Dibatalkan';
                saveToStorage();
                showToast('Pesanan Dibatalkan', `Pesanan ${orderId} telah resmi dibatalkan.`, 'info');
                renderOrdersList('Semua');
            }
        }
    });
}