
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { createSpy } = require('./doubles');

const catalogSourcePath = path.resolve(
    __dirname,
    '..',
    'js',
    'views',
    'catalog.js'
);

const catalogSource = fs.readFileSync(catalogSourcePath, 'utf8');

function createCatalogEnvironment() {
    const products = [
        {
            id: 1,
            name: 'Laptop',
            description: 'Laptop untuk kerja',
            category: 'Elektronik',
            price: 1000000,
            rating: 4.5,
            stock: 10,
            image: 'laptop.jpg',
            reviews: []
        },
        {
            id: 2,
            name: 'Baju',
            description: 'Baju kasual',
            category: 'Pakaian',
            price: 200000,
            rating: 4.8,
            stock: 5,
            image: 'baju.jpg',
            reviews: []
        },
        {
            id: 3,
            name: 'Headphone',
            description: 'Headphone bluetooth',
            category: 'Elektronik',
            price: 500000,
            rating: 4.2,
            stock: 8,
            image: 'headphone.jpg',
            reviews: []
        }
    ];

    const gridStub = { innerHTML: '' };
    const priceLabelStub = { textContent: '' };
    const mainContainerStub = { innerHTML: '' };

    const renderCatalogViewSpy = createSpy();

    const context = vm.createContext({
        state: {
            products,
            catalogFilter: {
                search: '',
                category: 'Semua',
                maxPrice: 2000000,
                sort: 'default'
            }
        },
        document: {
            getElementById(id) {
                if (id === 'products-grid') return gridStub;
                if (id === 'price-filter-val') return priceLabelStub;
                if (id === 'main-container') return mainContainerStub;
                if (id === 'global-search-input') return null;
                return null;
            }
        },
        formatIDR: (value) => `Rp${Number(value).toLocaleString('id-ID')}`
    });

    vm.runInContext(catalogSource, context, {
        filename: catalogSourcePath
    });

    return {
        context,
        state: context.state,
        gridStub,
        priceLabelStub,
        mainContainerStub,
        renderCatalogViewSpy
    };
}

// TC-10: Filter kategori produk
test('TC-10: filter kategori hanya menampilkan produk sesuai kategori', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter.category = 'Elektronik';
    env.context.renderCatalogGrid();

    assert.match(env.gridStub.innerHTML, /Laptop/);
    assert.match(env.gridStub.innerHTML, /Headphone/);
    assert.doesNotMatch(env.gridStub.innerHTML, /Baju/);
});

// TC-11: Filter harga maksimum
test('TC-11: filter harga hanya menampilkan produk di bawah batas maksimum', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter.maxPrice = 500000;
    env.context.renderCatalogGrid();

    assert.match(env.gridStub.innerHTML, /Baju/);
    assert.match(env.gridStub.innerHTML, /Headphone/);
    assert.doesNotMatch(env.gridStub.innerHTML, /Laptop/);
});

// TC-12: Pengurutan harga terendah
test('TC-12: produk diurutkan dari harga terendah', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter.sort = 'price-low';
    env.context.renderCatalogGrid();

    const html = env.gridStub.innerHTML;

    assert.ok(html.indexOf('Baju') < html.indexOf('Headphone'));
    assert.ok(html.indexOf('Headphone') < html.indexOf('Laptop'));
});

// TC-13: Pengurutan rating tertinggi
test('TC-13: produk diurutkan berdasarkan rating tertinggi', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter.sort = 'rating';
    env.context.renderCatalogGrid();

    const html = env.gridStub.innerHTML;

    assert.ok(html.indexOf('Baju') < html.indexOf('Laptop'));
    assert.ok(html.indexOf('Laptop') < html.indexOf('Headphone'));
});

// TC-14: Reset filter katalog
test('TC-14: reset filter mengembalikan pengaturan katalog ke default', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter = {
        search: 'Laptop',
        category: 'Elektronik',
        maxPrice: 500000,
        sort: 'price-low'
    };

    env.context.renderCatalogView = env.renderCatalogViewSpy;

    env.context.resetCatalogFilters();

    assert.deepEqual(
        JSON.parse(JSON.stringify(env.state.catalogFilter)),
        {
            search: '',
            category: 'Semua',
            maxPrice: 2000000,
            sort: 'default'
        }
    );

    assert.equal(env.renderCatalogViewSpy.calls.length, 1);
});

// TC-26: Tampilan katalog berhasil dirender
test('TC-26: tampilan katalog berhasil dirender', () => {
    const env = createCatalogEnvironment();

    env.context.renderCatalogView(env.mainContainerStub);

    assert.match(env.mainContainerStub.innerHTML, /Kategori:/);
    assert.match(env.mainContainerStub.innerHTML, /Elektronik/);
    assert.match(env.mainContainerStub.innerHTML, /Maks Price:/);
    assert.match(env.mainContainerStub.innerHTML, /products-grid/);
    assert.match(env.mainContainerStub.innerHTML, /product-detail-modal/);
    assert.match(env.gridStub.innerHTML, /Laptop/);
});

// TC-27: Fungsi filter kategori
test('TC-27: fungsi filter kategori mengubah kategori dan merender ulang katalog', () => {
    const env = createCatalogEnvironment();

    env.context.setCategoryFilter('Elektronik');

    assert.equal(env.state.catalogFilter.category, 'Elektronik');
    assert.match(env.gridStub.innerHTML, /Laptop/);
    assert.match(env.gridStub.innerHTML, /Headphone/);
    assert.doesNotMatch(env.gridStub.innerHTML, /Baju/);
});

// TC-28: Fungsi filter harga
test('TC-28: fungsi filter harga memperbarui batas harga dan tampilan produk', () => {
    const env = createCatalogEnvironment();

    env.context.handlePriceFilter('500000');

    assert.equal(env.state.catalogFilter.maxPrice, 500000);
    assert.notEqual(env.priceLabelStub.textContent, '');
    assert.match(env.gridStub.innerHTML, /Baju/);
    assert.match(env.gridStub.innerHTML, /Headphone/);
    assert.doesNotMatch(env.gridStub.innerHTML, /Laptop/);
});

// TC-29: Pengurutan harga tertinggi
test('TC-29: produk diurutkan dari harga tertinggi', () => {
    const env = createCatalogEnvironment();

    env.context.handleSortChange('price-high');

    const html = env.gridStub.innerHTML;

    assert.equal(env.state.catalogFilter.sort, 'price-high');
    assert.ok(html.indexOf('Laptop') < html.indexOf('Headphone'));
    assert.ok(html.indexOf('Headphone') < html.indexOf('Baju'));
});

// TC-30: Hasil pencarian kosong
test('TC-30: pesan produk tidak ditemukan ditampilkan ketika hasil kosong', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter.search = 'ProdukTidakAda';
    env.context.renderCatalogGrid();

    assert.match(env.gridStub.innerHTML, /Produk Tidak Ditemukan/);
    assert.match(env.gridStub.innerHTML, /Reset Filter/);
});

// TC-31: Grid produk tidak tersedia
test('TC-31: render katalog berhenti ketika elemen grid tidak tersedia', () => {
    const env = createCatalogEnvironment();

    env.context.document.getElementById = () => null;

    assert.doesNotThrow(() => {
        env.context.renderCatalogGrid();
    });
});

// TC-32: Reset filter mengosongkan pencarian
test('TC-32: reset filter mengosongkan input pencarian global', () => {
    const env = createCatalogEnvironment();
    const searchInputStub = { value: 'Laptop' };

    env.context.document.getElementById = (id) => {
        if (id === 'global-search-input') return searchInputStub;
        if (id === 'main-container') return env.mainContainerStub;
        if (id === 'products-grid') return env.gridStub;
        if (id === 'price-filter-val') return env.priceLabelStub;
        return null;
    };

    env.state.catalogFilter.search = 'Laptop';
    env.state.catalogFilter.category = 'Elektronik';

    env.context.resetCatalogFilters();

    assert.equal(searchInputStub.value, '');
    assert.equal(env.state.catalogFilter.search, '');
    assert.equal(env.state.catalogFilter.category, 'Semua');
    assert.equal(env.state.catalogFilter.maxPrice, 2000000);
    assert.equal(env.state.catalogFilter.sort, 'default');
});

// TC-33: Produk tidak ditemukan pada detail
test('TC-33: detail produk tidak dibuka jika produk tidak ditemukan', () => {
    const env = createCatalogEnvironment();

    assert.doesNotThrow(() => {
        env.context.openProductDetail(999);
    });
});

// TC-34: Detail produk berhasil dibuka
test('TC-34: detail produk berhasil ditampilkan pada modal', () => {
    const env = createCatalogEnvironment();
    const modalStub = {
        innerHTML: '',
        classList: {
            remove(value) {
                assert.equal(value, 'hidden');
                this.wasOpened = true;
            },
            wasOpened: false
        }
    };

    env.state.products[0].stock = 0;

    env.context.document.getElementById = (id) => {
        if (id === 'product-detail-modal') return modalStub;
        return null;
    };

    env.context.openProductDetail(1);

    assert.match(modalStub.innerHTML, /Laptop/);
    assert.match(modalStub.innerHTML, /Habis/);
    assert.match(modalStub.innerHTML, /Belum ada ulasan/);
    assert.equal(modalStub.classList.wasOpened, true);
});

// TC-35: Menutup modal detail produk
test('TC-35: modal detail produk berhasil ditutup', () => {
    const env = createCatalogEnvironment();
    const modalStub = {
        classList: {
            add(value) {
                this.wasClosed = value === 'hidden';
            },
            wasClosed: false
        }
    };

    env.context.document.getElementById = (id) => {
        if (id === 'product-detail-modal') return modalStub;
        return null;
    };

    env.context.closeProductDetail();

    assert.equal(modalStub.classList.wasClosed, true);
});

// TC-36: Detail produk menampilkan ulasan
test('TC-36: detail produk menampilkan ulasan pembeli', () => {
    const env = createCatalogEnvironment();
    const modalStub = {
        innerHTML: '',
        classList: {
            remove() {}
        }
    };

    env.state.products[0].reviews = [
        {
            reviewer: 'Andi',
            date: '2026-11-20',
            rating: 4,
            comment: 'Produk bagus'
        }
    ];

    env.context.document.getElementById = (id) => {
        if (id === 'product-detail-modal') return modalStub;
        return null;
    };

    env.context.openProductDetail(1);

    assert.match(modalStub.innerHTML, /Ulasan Pembeli \(1\)/);
    assert.match(modalStub.innerHTML, /Andi/);
    assert.match(modalStub.innerHTML, /Produk bagus/);
});

// TC-37: Pencarian berdasarkan deskripsi produk
test('TC-37: pencarian menemukan produk berdasarkan deskripsi', () => {
    const env = createCatalogEnvironment();

    env.state.catalogFilter.search = 'kerja';
    env.context.renderCatalogGrid();

    assert.match(env.gridStub.innerHTML, /Laptop/);
    assert.doesNotMatch(env.gridStub.innerHTML, /Baju/);
    assert.doesNotMatch(env.gridStub.innerHTML, /Headphone/);
});
// TC-38: Produk dengan stok habis ditampilkan dengan benar
test('TC-38: produk stok habis menampilkan label dan tombol nonaktif', () => {
    const env = createCatalogEnvironment();

    env.state.products[0].stock = 0;

    env.context.renderCatalogGrid();

    assert.match(env.gridStub.innerHTML, /Stok Habis/);
    assert.match(env.gridStub.innerHTML, /disabled/);
    assert.match(env.gridStub.innerHTML, /Laptop/);
});