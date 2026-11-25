# ShopEase – White Box Testing (Lab Session Modul 4)

## 1. Deskripsi Proyek

ShopEase merupakan aplikasi e-commerce yang digunakan sebagai objek pengujian pada Lab Session Modul 4. Pengujian dilakukan menggunakan pendekatan White Box Testing dengan fokus pada pengujian unit terhadap fungsi-fungsi JavaScript pada aplikasi.

Pengujian bertujuan memeriksa alur eksekusi program, kondisi percabangan, hasil fungsi, serta interaksi antarfungsi pada fitur utama aplikasi.

## 2. Ruang Lingkup Pengujian

Pengujian mencakup tiga bagian utama aplikasi:

- **Keranjang Belanja:** penambahan produk, perubahan jumlah, penghapusan produk, penerapan kupon, dan perhitungan ringkasan belanja.
- **Katalog Produk:** filter kategori, filter harga, pengurutan produk, pencarian, tampilan katalog, dan detail produk.
- **Checkout:** validasi data penerima, perhitungan pembayaran, ongkos kirim, dan diskon kupon.

## 3. Teknologi dan Tools

- JavaScript
- Node.js v22.19.0
- Node.js Test Runner (`node:test`)
- Node.js Assertion (`node:assert/strict`)
- C8 untuk pengukuran Code Coverage
- Visual Studio Code
- Laragon
- Git dan GitHub

## 4. Struktur File Pengujian

```text
shopease-app-labsession/
├── js/
│   └── views/
│       ├── cart.js
│       ├── catalog.js
│       └── checkout.js
├── tests/
│   ├── cart.test.js
│   ├── cart-features.test.js
│   ├── catalog.test.js
│   ├── checkout.test.js
│   ├── doubles.js
│   
├── coverage/
├── package.json
├── package-lock.json
└── README.md
```

Folder `coverage/` dihasilkan secara otomatis ketika perintah coverage dijalankan.

## 5. Framework Pengujian

Pengujian menggunakan Node.js Test Runner (`node:test`) sebagai framework pengujian unit.

Modul `node:assert/strict` digunakan untuk memeriksa hasil aktual dengan hasil yang diharapkan.

C8 digunakan untuk mengukur Statement Coverage, Branch Coverage, Function Coverage, dan Line Coverage pada source code yang diuji.

## 6. Implementasi Test Double

Pengujian menggunakan dua jenis Test Double:

### A. Stub

Stub diimplementasikan melalui fungsi `createInputStub()` pada `tests/doubles.js`.

Stub menyediakan nilai input untuk elemen `coupon-code-input` tanpa memerlukan browser sungguhan.

### B. Spy

Spy diimplementasikan melalui fungsi `createSpy()` pada `tests/doubles.js`.

Spy mencatat pemanggilan fungsi beserta argumen yang diterima. Implementasi ini digunakan untuk memeriksa interaksi fungsi seperti `showToast()`, `renderCartView()`, dan `saveToStorage()`.

## 7. Rekapitulasi Test Case

Total terdapat **38 test case** yang dikelompokkan sebagai berikut:

| Kelompok Pengujian | Test Case | Jumlah |
|---|---|---:|
| Kupon | TC-01 sampai TC-02 | 2 |
| Keranjang Belanja | TC-03 sampai TC-09 dan TC-21 sampai TC-25 | 12 |
| Katalog Produk | TC-10 sampai TC-14 dan TC-26 sampai TC-38 | 18 |
| Checkout | TC-15 sampai TC-20 | 6 |
| **Total** | | **38** |

## 8. Cara Menjalankan Pengujian

Pastikan Node.js sudah terpasang.

Buka terminal pada folder utama proyek, kemudian jalankan:

```bash
npm install
```

Untuk menjalankan seluruh unit test:

```bash
npm test
```

Untuk menjalankan pengujian sekaligus menghasilkan laporan Code Coverage:

```bash
npm run coverage
```

Laporan HTML dapat dibuka melalui:

```text
coverage/index.html
```

## 9. Hasil Pengujian

Berdasarkan hasil pengujian terakhir:

- Total test case: 38
- Test berhasil: 38
- Test gagal: 0
- Test dilewati: 0

Seluruh test case berhasil dijalankan.

## 10. Hasil Code Coverage

Hasil pengukuran Code Coverage terakhir:

| File | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| cart.js | 100% | 86.11% | 100% | 100% |
| catalog.js | 100% | 92.30% | 100% | 100% |
| checkout.js | 98.12% | 86.20% | 100% | 98.12% |
| **All Files** | **99.30%** | **88.88%** | **100%** | **99.30%** |

Hasil tersebut menunjukkan bahwa sebagian besar statement dan line pada source code yang diuji telah tercakup dalam pengujian. Beberapa kondisi percabangan dan baris kode masih belum tercakup.

## 11. Kesimpulan

Implementasi White Box Testing pada ShopEase menghasilkan 38 test case dengan seluruh pengujian berhasil dijalankan.

Penggunaan Stub dan Spy membantu mengisolasi dependensi serta memeriksa interaksi fungsi selama pengujian. Pengukuran menggunakan C8 menghasilkan Statement Coverage sebesar 99.30%, Branch Coverage sebesar 88.88%, Function Coverage sebesar 100%, dan Line Coverage sebesar 99.30%.

Hasil pengujian ini menjadi bukti evaluasi terhadap fungsi-fungsi utama aplikasi ShopEase dalam pelaksanaan Lab Session Modul 4.

## 12. Repository dan Bukti Implementasi

Repository GitHub:
https://github.com/farizi123/ShopEase-LabSession

Branch:
main

Commit Implementasi White Box Testing:
https://github.com/farizi123/ShopEase-LabSession/commit/2669c73

Commit Message:
Add ShopEase white box testing implementation

Seluruh implementasi pengujian telah diunggah ke repository
GitHub khusus Lab Session Modul 4.