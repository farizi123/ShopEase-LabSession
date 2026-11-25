// Initial Products List
const DEFAULT_PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Wireless Noise-Canceling Headphone X1',
        category: 'Elektronik',
        price: 1250000,
        rating: 4.8,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        description: 'Headphone nirkabel premium dengan active noise cancellation, daya tahan baterai hingga 30 jam, dan suara bass yang mendalam.',
        reviews: [
            { reviewer: 'Budi Santoso', rating: 5, comment: 'Suara jernih sekali dan sangat nyaman digunakan seharian!', date: '2026-02-10' },
            { reviewer: 'Siti Aminah', rating: 4, comment: 'Bagus, batrenya awet banget.', date: '2026-02-15' }
        ]
    },
    {
        id: 'prod-2',
        name: 'Smartwatch Sport FitPro GPS',
        category: 'Elektronik',
        price: 850000,
        rating: 4.5,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        description: 'Smartwatch olahraga dengan pelacak detak jantung, monitor tidur, GPS internal, dan ketahanan air hingga 50 meter.',
        reviews: [
            { reviewer: 'Rian Febrian', rating: 5, comment: 'Fitur GPS sangat akurat saat dipakai lari pagi.', date: '2026-02-18' }
        ]
    },
    {
        id: 'prod-3',
        name: 'Kemeja Casual Cotton Premium',
        category: 'Pakaian',
        price: 249000,
        rating: 4.2,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80',
        description: 'Kemeja katun ringan dan sejuk, cocok untuk gaya santai maupun kerja formal harian.',
        reviews: []
    },
    {
        id: 'prod-4',
        name: 'Jaket Denim Vintage Classic',
        category: 'Pakaian',
        price: 450000,
        rating: 4.7,
        stock: 0,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80',
        description: 'Jaket denim gaya klasik dengan potongan modern. Terbuat dari bahan denim tebal berkualitas tinggi.',
        reviews: [
            { reviewer: 'Dewi Lestari', rating: 5, comment: 'Bahan tebal dan warnanya tidak cepat pudar.', date: '2026-01-20' }
        ]
    },
    {
        id: 'prod-5',
        name: 'Ransel Canvas Laptop 15.6 Inch',
        category: 'Aksesori',
        price: 320000,
        rating: 4.6,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        description: 'Tas ransel kanvas anti air dilengkapi kompartemen khusus laptop terproteksi busa tebal dan USB charging port.',
        reviews: []
    },
    {
        id: 'prod-6',
        name: 'Kacamata Hitam Polarized UV400',
        category: 'Aksesori',
        price: 175000,
        rating: 4.3,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
        description: 'Kacamata gaya outdoor dengan lensa polarized melindung mata dari sinar UV400 secara optimal.',
        reviews: []
    },
    {
        id: 'prod-7',
        name: 'Mechanical Gaming Keyboard RGB',
        category: 'Elektronik',
        price: 680000,
        rating: 4.9,
        stock: 7,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
        description: 'Keyboard mekanikal dengan switch tactile blue, pencahayaan RGB dapat disesuaikan, dan kabel braided tahan lama.',
        reviews: []
    },
    {
        id: 'prod-8',
        name: 'Sepatu Sneakers Urban Comfort',
        category: 'Pakaian',
        price: 520000,
        rating: 4.4,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
        description: 'Sneakers kasual empuk dan fleksibel, dirancang untuk mendukung kenyamanan melangkah sepanjang hari.',
        reviews: []
    }
];

// Default Sample Registered User
const DEFAULT_USER = {
    id: 'usr-101',
    name: 'Ahmad Pelanggan',
    email: 'user@shopease.com',
    phone: '081234567890',
    password: 'password123',
    address: 'Jl. Merdeka No. 45, Kecamatan Sukajadi, Kota Bandung, Jawa Barat 40161'
};

// Preloaded Initial Orders
const DEFAULT_ORDERS = [
    {
        id: 'ORD-2026-001',
        date: '2026-03-01 10:30',
        items: [
            { productId: 'prod-1', name: 'Wireless Noise-Canceling Headphone X1', price: 1250000, qty: 1 }
        ],
        subtotal: 1250000,
        shippingFee: 10000,
        tax: 137500,
        discount: 0,
        total: 1397500,
        status: 'Selesai',
        recipientName: 'Ahmad Pelanggan',
        recipientPhone: '081234567890',
        address: 'Jl. Merdeka No. 45, Bandung',
        shippingMethod: 'Reguler (Rp 10.000)',
        paymentMethod: 'Transfer Bank BCA'
    },
    {
        id: 'ORD-2026-002',
        date: '2026-03-05 14:15',
        items: [
            { productId: 'prod-2', name: 'Smartwatch Sport FitPro GPS', price: 850000, qty: 1 }
        ],
        subtotal: 850000,
        shippingFee: 25000,
        tax: 93500,
        discount: 85000,
        total: 883500,
        status: 'Dikirim',
        recipientName: 'Ahmad Pelanggan',
        recipientPhone: '081234567890',
        address: 'Jl. Merdeka No. 45, Bandung',
        shippingMethod: 'Ekspres (Rp 25.000)',
        paymentMethod: 'E-Wallet GoPay'
    },
    {
        id: 'ORD-2026-003',
        date: '2026-03-07 09:00',
        items: [
            { productId: 'prod-3', name: 'Kemeja Casual Cotton Premium', price: 249000, qty: 2 }
        ],
        subtotal: 498000,
        shippingFee: 10000,
        tax: 54780,
        discount: 0,
        total: 562780,
        status: 'Menunggu Pembayaran',
        recipientName: 'Ahmad Pelanggan',
        recipientPhone: '081234567890',
        address: 'Jl. Merdeka No. 45, Bandung',
        shippingMethod: 'Reguler (Rp 10.000)',
        paymentMethod: 'Transfer Bank Mandiri'
    }
];