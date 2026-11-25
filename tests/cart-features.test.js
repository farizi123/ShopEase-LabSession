
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { createSpy } = require('./doubles');

// Membaca source code asli cart.js
const cartSourcePath = path.resolve(
    __dirname,
    '..',
    'js',
    'views',
    'cart.js'
);

const cartSource = fs.readFileSync(cartSourcePath, 'utf8');

// Membuat lingkungan pengujian Add to Cart
function createAddToCartEnvironment(products, cart = []) {
    const showToastSpy = createSpy();
    const saveToStorageSpy = createSpy();

    const context = vm.createContext({
        state: {
            products,
            cart
        },
        showToast: showToastSpy,
        saveToStorage: saveToStorageSpy
    });

    vm.runInContext(cartSource, context, {
        filename: cartSourcePath
    });

    return {
        addToCart: context.addToCart,
        state: context.state,
        showToastSpy,
        saveToStorageSpy
    };
}

// TC-03: Menambahkan produk baru ke keranjang
test('TC-03: produk tersedia berhasil ditambahkan ke keranjang', () => {
    const env = createAddToCartEnvironment([
        { id: 1, name: 'Kemeja', price: 100000, stock: 10 }
    ]);

    env.addToCart(1);

    assert.equal(env.state.cart.length, 1);
    assert.equal(env.state.cart[0].productId, 1);
    assert.equal(env.state.cart[0].qty, 1);

    assert.equal(env.saveToStorageSpy.calls.length, 1);
    assert.equal(env.showToastSpy.calls.length, 1);
});

// TC-04: Menambahkan produk yang sudah ada
test('TC-04: jumlah produk bertambah ketika produk sudah ada di keranjang', () => {
    const env = createAddToCartEnvironment(
        [
            { id: 1, name: 'Kemeja', price: 100000, stock: 10 }
        ],
        [
            { productId: 1, qty: 1 }
        ]
    );

    env.addToCart(1);

    assert.equal(env.state.cart.length, 1);
    assert.equal(env.state.cart[0].qty, 2);

    assert.equal(env.saveToStorageSpy.calls.length, 1);
    assert.equal(env.showToastSpy.calls.length, 1);
});

// TC-05: Produk tidak tersedia atau stok habis
test('TC-05: produk dengan stok habis tidak ditambahkan ke keranjang', () => {
    const env = createAddToCartEnvironment([
        { id: 1, name: 'Kemeja', price: 100000, stock: 0 }
    ]);

    env.addToCart(1);

    assert.equal(env.state.cart.length, 0);
    assert.equal(env.saveToStorageSpy.calls.length, 0);
    assert.equal(env.showToastSpy.calls.length, 1);
});

function createUpdateCartQtyEnvironment(products, cart) {
    const showToastSpy = createSpy();
    const saveToStorageSpy = createSpy();
    const renderCartViewSpy = createSpy();

    const mainContainerStub = { innerHTML: '' };

    const context = vm.createContext({
        state: {
            products,
            cart
        },
        showToast: showToastSpy,
        saveToStorage: saveToStorageSpy,
        document: {
            getElementById(id) {
                if (id === 'main-container') {
                    return mainContainerStub;
                }
                return null;
            }
        }
    });

    vm.runInContext(cartSource, context, {
        filename: cartSourcePath
    });

    context.renderCartView = renderCartViewSpy;

    return {
        updateCartQty: context.updateCartQty,
        state: context.state,
        showToastSpy,
        saveToStorageSpy,
        renderCartViewSpy,
        mainContainerStub
    };
}

// TC-06: Memperbarui jumlah produk sesuai stok
test('TC-06: jumlah produk berhasil diperbarui sesuai stok', () => {
    const env = createUpdateCartQtyEnvironment(
        [
            { id: 1, name: 'Kemeja', price: 100000, stock: 10 }
        ],
        [
            { productId: 1, qty: 1 }
        ]
    );

    env.updateCartQty(1, 5);

    assert.equal(env.state.cart[0].qty, 5);
    assert.equal(env.saveToStorageSpy.calls.length, 1);
    assert.equal(env.renderCartViewSpy.calls.length, 1);
    assert.equal(
        env.renderCartViewSpy.calls[0][0],
        env.mainContainerStub
    );
});

// TC-07: Menolak jumlah produk melebihi stok
test('TC-07: jumlah produk ditolak jika melebihi stok', () => {
    const env = createUpdateCartQtyEnvironment(
        [
            { id: 1, name: 'Kemeja', price: 100000, stock: 5 }
        ],
        [
            { productId: 1, qty: 2 }
        ]
    );

    env.updateCartQty(1, 8);

    assert.equal(env.state.cart[0].qty, 2);
    assert.equal(env.saveToStorageSpy.calls.length, 0);
    assert.equal(env.renderCartViewSpy.calls.length, 0);
    assert.equal(env.showToastSpy.calls.length, 1);
});

function createRemoveFromCartEnvironment(products, cart) {
    const showToastSpy = createSpy();
    const saveToStorageSpy = createSpy();
    const renderCartViewSpy = createSpy();

    const mainContainerStub = { innerHTML: '' };

    const context = vm.createContext({
        state: {
            products,
            cart
        },
        showToast: showToastSpy,
        saveToStorage: saveToStorageSpy,
        document: {
            getElementById(id) {
                if (id === 'main-container') {
                    return mainContainerStub;
                }
                return null;
            }
        }
    });

    vm.runInContext(cartSource, context, {
        filename: cartSourcePath
    });

    context.renderCartView = renderCartViewSpy;

    return {
        removeFromCart: context.removeFromCart,
        state: context.state,
        showToastSpy,
        saveToStorageSpy,
        renderCartViewSpy,
        mainContainerStub
    };
}

// TC-08: Menghapus produk dari keranjang
test('TC-08: produk berhasil dihapus dari keranjang', () => {
    const env = createRemoveFromCartEnvironment(
        [
            { id: 1, name: 'Kemeja', price: 100000, stock: 10 },
            { id: 2, name: 'Celana', price: 150000, stock: 8 }
        ],
        [
            { productId: 1, qty: 2 },
            { productId: 2, qty: 1 }
        ]
    );

    env.removeFromCart(1);

    assert.equal(env.state.cart.length, 1);
    assert.equal(env.state.cart[0].productId, 2);

    assert.equal(env.saveToStorageSpy.calls.length, 1);
    assert.equal(env.showToastSpy.calls.length, 1);
    assert.equal(env.renderCartViewSpy.calls.length, 1);

    assert.equal(
        env.renderCartViewSpy.calls[0][0],
        env.mainContainerStub
    );
});

function createRemoveCouponEnvironment() {
    const showToastSpy = createSpy();
    const saveToStorageSpy = createSpy();
    const renderCartViewSpy = createSpy();

    const mainContainerStub = { innerHTML: '' };

    const context = vm.createContext({
        state: {
            products: [],
            cart: [],
            appliedCoupon: {
                code: 'DISCOUNT10',
                rate: 0.10
            }
        },
        showToast: showToastSpy,
        saveToStorage: saveToStorageSpy,
        document: {
            getElementById(id) {
                if (id === 'main-container') {
                    return mainContainerStub;
                }
                return null;
            }
        }
    });

    vm.runInContext(cartSource, context, {
        filename: cartSourcePath
    });

    context.renderCartView = renderCartViewSpy;

    return {
        removeCoupon: context.removeCoupon,
        state: context.state,
        showToastSpy,
        saveToStorageSpy,
        renderCartViewSpy,
        mainContainerStub
    };
}

// TC-09: Menghapus kupon yang sedang diterapkan
test('TC-09: kupon berhasil dihapus dari keranjang', () => {
    const env = createRemoveCouponEnvironment();

    env.removeCoupon();

    assert.equal(env.state.appliedCoupon, null);
    assert.equal(env.showToastSpy.calls.length, 1);
    assert.equal(env.renderCartViewSpy.calls.length, 1);

    assert.equal(
        env.renderCartViewSpy.calls[0][0],
        env.mainContainerStub
    );
});

function createRenderCartEnvironment(products, cart, appliedCoupon = null) {
    const mainContainerStub = { innerHTML: '' };
    const showToastSpy = createSpy();
    const saveToStorageSpy = createSpy();
    const navigateToSpy = createSpy();

    const context = vm.createContext({
        state: {
            products,
            cart,
            appliedCoupon
        },
        showToast: showToastSpy,
        saveToStorage: saveToStorageSpy,
        formatIDR(value) {
            return `Rp ${value}`;
        },
        navigateTo: navigateToSpy,
        document: {
            getElementById(id) {
                return id === 'main-container' ? mainContainerStub : null;
            }
        }
    });

    vm.runInContext(cartSource, context, {
        filename: cartSourcePath
    });

    return {
        context,
        mainContainerStub,
        showToastSpy,
        saveToStorageSpy,
        navigateToSpy
    };
}

// TC-21: Produk tidak ditemukan
test('TC-21: produk yang tidak ditemukan tidak ditambahkan ke keranjang', () => {
    const env = createAddToCartEnvironment([]);

    env.addToCart(999);

    assert.equal(env.state.cart.length, 0);
    assert.equal(env.saveToStorageSpy.calls.length, 0);
    assert.equal(env.showToastSpy.calls.length, 1);
});

// TC-22: Jumlah produk sudah mencapai batas stok
test('TC-22: penambahan produk ditolak ketika jumlah mencapai batas stok', () => {
    const env = createAddToCartEnvironment(
        [{ id: 1, name: 'Kemeja', price: 100000, stock: 2 }],
        [{ productId: 1, qty: 2 }]
    );

    env.addToCart(1);

    assert.equal(env.state.cart[0].qty, 2);
    assert.equal(env.saveToStorageSpy.calls.length, 0);
    assert.equal(env.showToastSpy.calls.length, 1);
});

// TC-23: Jumlah produk diubah menjadi nol
test('TC-23: jumlah nol menghapus produk dari keranjang', () => {
    const env = createRemoveFromCartEnvironment(
        [{ id: 1, name: 'Kemeja', price: 100000, stock: 10 }],
        [{ productId: 1, qty: 2 }]
    );

    // Menguji jalur jumlah nol melalui updateCartQty asli.
    const context = vm.createContext({
        state: env.state,
        showToast: env.showToastSpy,
        saveToStorage: env.saveToStorageSpy,
        document: {
            getElementById() {
                return env.mainContainerStub;
            }
        }
    });

    vm.runInContext(cartSource, context, {
        filename: cartSourcePath
    });

    context.updateCartQty(1, 0);

    assert.equal(context.state.cart.length, 0);
    assert.equal(env.saveToStorageSpy.calls.length, 1);
    assert.equal(env.showToastSpy.calls.length, 1);
});
// TC-24: Menampilkan kondisi keranjang kosong
test('TC-24: tampilan keranjang kosong menampilkan pesan keranjang kosong', () => {
    const env = createRenderCartEnvironment([], []);

    env.context.renderCartView(env.mainContainerStub);

    assert.match(
        env.mainContainerStub.innerHTML,
        /Keranjang Belanja Anda Kosong/
    );
    assert.match(
        env.mainContainerStub.innerHTML,
        /Lihat Katalog Produk/
    );
});

// TC-25: Menampilkan ringkasan belanja dengan diskon
test('TC-25: ringkasan belanja menampilkan subtotal pajak dan diskon', () => {
    const env = createRenderCartEnvironment(
        [
            {
                id: 1,
                name: 'Kemeja',
                price: 100000,
                stock: 10,
                image: 'kemeja.jpg'
            }
        ],
        [{ productId: 1, qty: 2 }],
        { code: 'DISCOUNT10', rate: 0.10 }
    );

    env.context.renderCartView(env.mainContainerStub);

    assert.match(env.mainContainerStub.innerHTML, /Kemeja/);
    assert.match(env.mainContainerStub.innerHTML, /Subtotal Produk/);
    assert.match(env.mainContainerStub.innerHTML, /PPN \(11%\)/);
    assert.match(env.mainContainerStub.innerHTML, /Diskon Promo/);
    assert.match(env.mainContainerStub.innerHTML, /Rp 202000/);
});
