
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const checkoutSourcePath = path.resolve(
    __dirname,
    '..',
    'js',
    'views',
    'checkout.js'
);

const source = fs.readFileSync(checkoutSourcePath, 'utf8');

function createSpy() {
    const spy = (...args) => {
        spy.calls.push(args);
    };
    spy.calls = [];
    return spy;
}

function createElement(value = '') {
    return {
        value,
        textContent: '',
        innerHTML: '',
        classList: {
            added: [],
            removed: [],
            add(name) {
                this.added.push(name);
            },
            remove(name) {
                this.removed.push(name);
            }
        }
    };
}


function createCheckoutEnvironment(overrides = {}) {
    const elements = {
        'chk-name': createElement('Bisri'),
        'chk-phone': createElement('081234567890'),
        'chk-address': createElement('Jl. Merdeka No. 10'),
        'chk-name-err': createElement(),
        'chk-phone-err': createElement(),
        'chk-address-err': createElement(),
        'chk-shipping-cost': createElement(),
        'chk-grand-total': createElement()
    };

    const saveToStorage = createSpy();
    const showToast = createSpy();
    const navigateTo = createSpy();

    globalThis.state = {
        cart: [{ productId: 1, qty: 2 }],
        products: [
            {
                id: 1,
                name: 'Laptop',
                price: 1000000,
                stock: 10
            }
        ],
        appliedCoupon: null,
        orders: [],
        currentUser: null
    };

    globalThis.document = {
        getElementById(id) {
            return elements[id] || createElement();
        },
        querySelector(selector) {
            if (selector.includes('shipping-option')) {
                return { value: overrides.shipping || '10000' };
            }

            if (selector.includes('payment-method')) {
                return {
                    value: overrides.payment || 'Transfer Bank BCA'
                };
            }

            return null;
        }
    };

    globalThis.formatIDR = function(value) {
        return `Rp ${value}`;
    };

    globalThis.saveToStorage = saveToStorage;
    globalThis.showToast = showToast;
    globalThis.navigateTo = navigateTo;

    vm.runInThisContext(source, {
        filename: checkoutSourcePath
    });

    return {
        context: globalThis,
        elements,
        saveToStorage,
        showToast,
        navigateTo
    };
}


// TC-15: Checkout mengarahkan pengguna ke keranjang jika keranjang kosong
test('TC-15: keranjang kosong mengarahkan pengguna ke halaman keranjang', () => {
    const env = createCheckoutEnvironment();
    env.context.state.cart = [];

    const container = createElement();
    env.context.renderCheckoutView(container);

    assert.equal(env.navigateTo.calls.length, 1);
    assert.equal(env.navigateTo.calls[0][0], 'cart');
});

// TC-16: Halaman checkout menampilkan rincian pembayaran
test('TC-16: halaman checkout menampilkan rincian pembayaran', () => {
    const env = createCheckoutEnvironment();
    const container = createElement();

    env.context.renderCheckoutView(container);

    assert.match(container.innerHTML, /Checkout & Pengiriman/);
    assert.match(container.innerHTML, /Rp 2000000/);
    assert.match(container.innerHTML, /Rp 220000/);
    assert.match(container.innerHTML, /Rp 2230000/);
});

// TC-17: Total pembayaran berubah sesuai ongkos kirim
test('TC-17: total pembayaran dihitung berdasarkan ongkos kirim', () => {
    const env = createCheckoutEnvironment({
        shipping: '25000'
    });

    env.context.updateCheckoutTotal();

    assert.equal(
        env.elements['chk-shipping-cost'].textContent,
        'Rp 25000'
    );

    assert.equal(
        env.elements['chk-grand-total'].textContent,
        'Rp 2245000'
    );
});

// TC-18: Checkout menolak data penerima yang tidak lengkap
test('TC-18: pesanan ditolak jika data penerima tidak lengkap', () => {
    const env = createCheckoutEnvironment();

    env.elements['chk-name'].value = '';
    env.elements['chk-phone'].value = '0812';
    env.elements['chk-address'].value = '';

    let prevented = false;

    env.context.handlePlaceOrder({
        preventDefault() {
            prevented = true;
        }
    });

    assert.equal(prevented, true);
    assert.equal(env.context.state.orders.length, 0);
    assert.equal(env.context.state.cart.length, 1);

    assert.equal(
        env.elements['chk-name-err'].textContent,
        'Nama wajib diisi'
    );

    assert.equal(
        env.elements['chk-phone-err'].textContent,
        'Nomor HP tidak valid'
    );

    assert.equal(
        env.elements['chk-address-err'].textContent,
        'Alamat wajib diisi'
    );
});

// TC-19: Pesanan berhasil dibuat dengan data penerima valid
test('TC-19: pesanan berhasil dibuat dengan data penerima valid', () => {
    const env = createCheckoutEnvironment({
        shipping: '10000',
        payment: 'Transfer Bank BCA'
    });

    let prevented = false;

    env.context.handlePlaceOrder({
        preventDefault() {
            prevented = true;
        }
    });

    const order = env.context.state.orders[0];

    assert.equal(prevented, true);
    assert.equal(env.context.state.orders.length, 1);
    assert.equal(order.subtotal, 2000000);
    assert.equal(order.tax, 220000);
    assert.equal(order.shippingFee, 10000);
    assert.equal(order.total, 2230000);
    assert.equal(order.recipientName, 'Bisri');
    assert.equal(order.paymentMethod, 'Transfer Bank BCA');
    assert.equal(order.status, 'Menunggu Pembayaran');

    assert.equal(env.context.state.cart.length, 0);
    assert.equal(env.context.state.products[0].stock, 8);
    assert.equal(env.context.state.appliedCoupon, null);

    assert.equal(env.saveToStorage.calls.length, 1);
    assert.equal(env.showToast.calls.length, 1);
    assert.equal(env.navigateTo.calls[0][0], 'orders');
});

// TC-20: Diskon kupon diperhitungkan dalam total checkout
test('TC-20: total checkout memperhitungkan diskon kupon', () => {
    const env = createCheckoutEnvironment({
        shipping: '10000'
    });

    env.context.state.appliedCoupon = {
        code: 'DISCOUNT10',
        rate: 0.10
    };

    env.context.updateCheckoutTotal();

    // Subtotal 2.000.000 + pajak 220.000
    // + ongkir 10.000 - diskon 200.000
    assert.equal(
        env.elements['chk-grand-total'].textContent,
        'Rp 2030000'
    );
});
