let state = {
    activeView: 'catalog',
    currentUser: null,
    products: [],
    cart: [],
    orders: [],
    appliedCoupon: null,
    forgotPassState: { step: 1, email: '', otp: '' },
    catalogFilter: { search: '', category: 'Semua', maxPrice: 2000000, sort: 'default' },
    selectedOrderForDetail: null,
    selectedProductForReview: null
};

function initApp() {
    const savedUser = localStorage.getItem('shopease_user');
    const savedCart = localStorage.getItem('shopease_cart');
    const savedOrders = localStorage.getItem('shopease_orders');
    const savedProducts = localStorage.getItem('shopease_products');

    state.currentUser = savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
    state.cart = savedCart ? JSON.parse(savedCart) : [ { productId: 'prod-1', qty: 1 } ];
    state.orders = savedOrders ? JSON.parse(savedOrders) : DEFAULT_ORDERS;
    state.products = savedProducts ? JSON.parse(savedProducts) : DEFAULT_PRODUCTS;

    renderHeaderNav();
    navigateTo(state.activeView);
}

function saveToStorage() {
    localStorage.setItem('shopease_user', JSON.stringify(state.currentUser));
    localStorage.setItem('shopease_cart', JSON.stringify(state.cart));
    localStorage.setItem('shopease_orders', JSON.stringify(state.orders));
    localStorage.setItem('shopease_products', JSON.stringify(state.products));
    updateCartBadge();
}

function resetApplicationState() {
    localStorage.clear();
    state.currentUser = DEFAULT_USER;
    state.cart = [ { productId: 'prod-1', qty: 1 } ];
    state.orders = DEFAULT_ORDERS;
    state.products = DEFAULT_PRODUCTS;
    state.appliedCoupon = null;
    state.forgotPassState = { step: 1, email: '', otp: '' };
    saveToStorage();
    showToast('Reset Berhasil', 'Data aplikasi telah dikembalikan ke kondisi awal.', 'info');
    navigateTo('catalog');
}