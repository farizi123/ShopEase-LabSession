
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { createInputStub, createSpy } = require('./doubles');

// Membaca source code asli ShopEase
const cartSourcePath = path.resolve(
    __dirname,
    '..',
    'js',
    'views',
    'cart.js'
);

const cartSource = fs.readFileSync(cartSourcePath, 'utf8');

// Menyiapkan lingkungan pengujian

function createApplyCouponEnvironment(inputValue, initialCoupon = null) {
    const inputStub = createInputStub(inputValue);
    const mainContainerStub = { innerHTML: '' };

    const showToastSpy = createSpy();
    const renderCartViewSpy = createSpy();

    // Menyiapkan state sesuai kebutuhan source code asli
    globalThis.state = {
        cart: [],
        products: [],
        appliedCoupon: initialCoupon
    };

    globalThis.document = {
        getElementById(id) {
            if (id === 'coupon-code-input') return inputStub;
            if (id === 'main-container') return mainContainerStub;
            return null;
        }
    };

    globalThis.showToast = showToastSpy;

    // Memuat seluruh source code asli
    vm.runInThisContext(cartSource, {
        filename: cartSourcePath
    });

    // Mengganti fungsi render dengan Spy setelah source dimuat
    globalThis.renderCartView = renderCartViewSpy;

    return {
        applyCoupon: globalThis.applyCoupon,
        state: globalThis.state,
        showToastSpy,
        renderCartViewSpy,
        inputStub,
        mainContainerStub
    };
}


// TC-01: Kupon valid
test('TC-01: kupon valid dinormalisasi dan diskon 10% diterapkan', () => {
    const env = createApplyCouponEnvironment(' discount10 ');

    env.applyCoupon();

    assert.deepEqual(
        JSON.parse(JSON.stringify(env.state.appliedCoupon)),
        {
            code: 'DISCOUNT10',
            rate: 0.10
        }
    );

    assert.equal(env.showToastSpy.calls.length, 1);

    assert.deepEqual(env.showToastSpy.calls[0], [
        'Kupon Berhasil',
        'Diskon 10% berhasil diterapkan!',
        'success'
    ]);

    assert.equal(env.renderCartViewSpy.calls.length, 1);

    assert.equal(
        env.renderCartViewSpy.calls[0][0],
        env.mainContainerStub
    );
});

// TC-02: Kupon tidak valid
test('TC-02: kupon tidak valid menampilkan notifikasi gagal dan tidak menerapkan kupon', () => {
    const env = createApplyCouponEnvironment('PROMO20', null);

    env.applyCoupon();

    assert.equal(env.state.appliedCoupon, null);

    assert.equal(env.showToastSpy.calls.length, 1);

    assert.deepEqual(env.showToastSpy.calls[0], [
        'Kupon Tidak Valid',
        'Kode kupon tidak ditemukan. Gunakan DISCOUNT10.',
        'error'
    ]);

    assert.equal(env.renderCartViewSpy.calls.length, 1);

    assert.equal(
        env.renderCartViewSpy.calls[0][0],
        env.mainContainerStub
    );
});
