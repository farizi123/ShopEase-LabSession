/* Login View */
function renderLoginView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto my-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-center mb-6">
                <div class="w-12 h-12 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    <i class="fa-solid fa-right-to-bracket"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-900">Masuk Akun</h2>
                <p class="text-xs text-slate-500 mt-1">Silakan masuk menggunakan kredensial pelanggan Anda</p>
            </div>

            <form id="login-form" onsubmit="handleLoginSubmit(event)" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Email Pelanggan <span class="text-rose-500">*</span></label>
                    <input type="text" id="login-email" placeholder="contoh: user@shopease.com" 
                        class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <span id="login-email-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1">
                        <label class="block text-xs font-bold text-slate-700">Password <span class="text-rose-500">*</span></label>
                        <button type="button" onclick="navigateTo('forgot-password')" class="text-xs text-brand-600 hover:underline font-semibold">Lupa Password?</button>
                    </div>
                    <div class="relative">
                        <input type="password" id="login-password" placeholder="Masukkan password Anda" 
                            class="w-full pl-3.5 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <button type="button" onclick="togglePasswordVisibility('login-password', 'login-pass-icon')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs">
                            <i id="login-pass-icon" class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                    <span id="login-password-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <button type="submit" class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm active:scale-98">
                    Masuk Ke Akun
                </button>
            </form>

            <div class="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Belum memiliki akun? 
                <button onclick="navigateTo('register')" class="text-brand-600 font-bold hover:underline">Daftar Sekarang</button>
            </div>
        </div>
    `;
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fa-solid fa-eye';
    }
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const emailErr = document.getElementById('login-email-err');
    const passErr = document.getElementById('login-password-err');

    emailErr.classList.add('hidden');
    passErr.classList.add('hidden');

    let isValid = true;

    if (!email) {
        emailErr.textContent = 'Email wajib diisi';
        emailErr.classList.remove('hidden');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailErr.textContent = 'Format email tidak valid';
        emailErr.classList.remove('hidden');
        isValid = false;
    }

    if (!password) {
        passErr.textContent = 'Password wajib diisi';
        passErr.classList.remove('hidden');
        isValid = false;
    }

    if (!isValid) return;

    if (email === DEFAULT_USER.email && password === DEFAULT_USER.password) {
        state.currentUser = DEFAULT_USER;
        saveToStorage();
        showToast('Login Berhasil', `Selamat datang kembali, ${state.currentUser.name}!`, 'success');
        navigateTo('catalog');
    } else {
        showToast('Login Gagal', 'Kredensial salah! Email atau password yang Anda masukkan tidak terdaftar.', 'error');
    }
}

/* Register View */
function renderRegisterView(container) {
    container.innerHTML = `
        <div class="max-w-md mx-auto my-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-center mb-6">
                <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                    <i class="fa-solid fa-user-plus"></i>
                </div>
                <h2 class="text-2xl font-bold text-slate-900">Registrasi Akun Baru</h2>
                <p class="text-xs text-slate-500 mt-1">Buat akun untuk memulai belanja di ShopEase</p>
            </div>

            <form id="register-form" onsubmit="handleRegisterSubmit(event)" class="space-y-3.5">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap <span class="text-rose-500">*</span></label>
                    <input type="text" id="reg-name" placeholder="Budi Santoso" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <span id="reg-name-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Email Pelanggan <span class="text-rose-500">*</span></label>
                    <input type="text" id="reg-email" placeholder="budi@example.com" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <span id="reg-email-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Nomor Telepon / WhatsApp <span class="text-rose-500">*</span></label>
                    <input type="text" id="reg-phone" placeholder="081234567890" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <span id="reg-phone-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Password (Minimal 6 karakter) <span class="text-rose-500">*</span></label>
                    <input type="password" id="reg-pass" placeholder="******" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <span id="reg-pass-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password <span class="text-rose-500">*</span></label>
                    <input type="password" id="reg-pass-confirm" placeholder="******" class="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <span id="reg-pass-confirm-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                </div>

                <div class="pt-1">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="reg-terms" class="rounded border-slate-300 text-brand-600 focus:ring-brand-500">
                        <span class="text-xs text-slate-600">Saya menyetujui <a href="#" class="text-brand-600 underline">Syarat & Ketentuan</a> ShopEase</span>
                    </label>
                    <span id="reg-terms-err" class="text-[11px] text-rose-500 font-medium hidden mt-1 block"></span>
                </div>

                <button type="submit" class="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">
                    Daftarkan Akun
                </button>
            </form>

            <div class="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Sudah punya akun? 
                <button onclick="navigateTo('login')" class="text-brand-600 font-bold hover:underline">Masuk Di Sini</button>
            </div>
        </div>
    `;
}

function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pass = document.getElementById('reg-pass').value;
    const passConfirm = document.getElementById('reg-pass-confirm').value;
    const terms = document.getElementById('reg-terms').checked;

    const nameErr = document.getElementById('reg-name-err');
    const emailErr = document.getElementById('reg-email-err');
    const phoneErr = document.getElementById('reg-phone-err');
    const passErr = document.getElementById('reg-pass-err');
    const passConfirmErr = document.getElementById('reg-pass-confirm-err');
    const termsErr = document.getElementById('reg-terms-err');

    [nameErr, emailErr, phoneErr, passErr, passConfirmErr, termsErr].forEach(el => el.classList.add('hidden'));

    let isValid = true;

    if (!name) { nameErr.textContent = 'Nama lengkap wajib diisi'; nameErr.classList.remove('hidden'); isValid = false; }
    if (!email) { 
        emailErr.textContent = 'Email wajib diisi'; emailErr.classList.remove('hidden'); isValid = false; 
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailErr.textContent = 'Format email tidak valid'; emailErr.classList.remove('hidden'); isValid = false;
    } else if (email === DEFAULT_USER.email) {
        emailErr.textContent = 'Email ini sudah terdaftar! Gunakan email lain.'; emailErr.classList.remove('hidden'); isValid = false;
    }

    if (!phone || phone.length < 9) { phoneErr.textContent = 'Nomor telepon minimal 9 digit'; phoneErr.classList.remove('hidden'); isValid = false; }
    if (!pass || pass.length < 6) { passErr.textContent = 'Password minimal 6 karakter'; passErr.classList.remove('hidden'); isValid = false; }
    if (pass !== passConfirm) { passConfirmErr.textContent = 'Konfirmasi password tidak cocok'; passConfirmErr.classList.remove('hidden'); isValid = false; }
    if (!terms) { termsErr.textContent = 'Anda wajib menyetujui Syarat & Ketentuan'; termsErr.classList.remove('hidden'); isValid = false; }

    if (!isValid) return;

    showToast('Registrasi Berhasil', 'Akun Anda berhasil dibuat! Silakan masuk.', 'success');
    navigateTo('login');
}

/* Forgot Password View */
function renderForgotPasswordView(container) {
    const step = state.forgotPassState.step;

    container.innerHTML = `
        <div class="max-w-md mx-auto my-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 class="text-base font-bold text-slate-800">Pemulihan Password</h3>
                <span class="text-xs font-semibold px-2.5 py-1 bg-brand-50 text-brand-600 rounded-lg">Langkah ${step} dari 3</span>
            </div>

            ${step === 1 ? `
                <div class="space-y-4">
                    <p class="text-xs text-slate-500">Masukkan email akun Anda. Kami akan mengirimkan kode OTP simulasi untuk verifikasi.</p>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Email Terdaftar</label>
                        <input type="text" id="forgot-email-input" value="${state.forgotPassState.email}" placeholder="user@shopease.com" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                        <span id="forgot-email-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                    </div>
                    <button onclick="handleForgotStep1()" class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors">
                        Kirim Kode OTP
                    </button>
                </div>
            ` : ''}

            ${step === 2 ? `
                <div class="space-y-4">
                    <div class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-800">
                        <i class="fa-solid fa-lightbulb text-amber-600 mr-1"></i>
                        Kode OTP simulasi dikirim ke <strong>${state.forgotPassState.email}</strong> adalah: <strong class="font-mono text-sm underline">123456</strong>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Kode OTP 6-Digit</label>
                        <input type="text" id="forgot-otp-input" maxlength="6" placeholder="123456" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 text-center font-mono text-lg tracking-widest">
                        <span id="forgot-otp-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                    </div>
                    <button onclick="handleForgotStep2()" class="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-colors">
                        Verifikasi OTP
                    </button>
                </div>
            ` : ''}

            ${step === 3 ? `
                <div class="space-y-4">
                    <p class="text-xs text-slate-500">Buat password baru yang kuat untuk akun Anda.</p>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Password Baru</label>
                        <input type="password" id="forgot-new-pass" placeholder="******" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                        <span id="forgot-new-pass-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">Konfirmasi Password Baru</label>
                        <input type="password" id="forgot-confirm-pass" placeholder="******" class="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500">
                        <span id="forgot-confirm-pass-err" class="text-[11px] text-rose-500 font-medium hidden mt-1"></span>
                    </div>
                    <button onclick="handleForgotStep3()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors">
                        Simpan Password Baru
                    </button>
                </div>
            ` : ''}

            <div class="mt-6 text-center">
                <button onclick="navigateTo('login')" class="text-xs text-slate-500 hover:text-slate-800 font-semibold">
                    <i class="fa-solid fa-arrow-left mr-1"></i> Kembali ke Login
                </button>
            </div>
        </div>
    `;
}

function handleForgotStep1() {
    const email = document.getElementById('forgot-email-input').value.trim();
    const err = document.getElementById('forgot-email-err');
    err.classList.add('hidden');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        err.textContent = 'Masukkan email yang valid';
        err.classList.remove('hidden');
        return;
    }

    if (email !== DEFAULT_USER.email) {
        err.textContent = 'Email tidak ditemukan dalam sistem';
        err.classList.remove('hidden');
        return;
    }

    state.forgotPassState.email = email;
    state.forgotPassState.step = 2;
    showToast('OTP Terkirim', 'Kode OTP 123456 telah dikirim.', 'info');
    renderForgotPasswordView(document.getElementById('main-container'));
}

function handleForgotStep2() {
    const otp = document.getElementById('forgot-otp-input').value.trim();
    const err = document.getElementById('forgot-otp-err');
    err.classList.add('hidden');

    if (otp !== '123456') {
        err.textContent = 'Kode OTP salah! Gunakan kode 123456.';
        err.classList.remove('hidden');
        return;
    }

    state.forgotPassState.otp = otp;
    state.forgotPassState.step = 3;
    showToast('Verifikasi Berhasil', 'OTP valid! Silakan masukkan password baru.', 'success');
    renderForgotPasswordView(document.getElementById('main-container'));
}

function handleForgotStep3() {
    const pass = document.getElementById('forgot-new-pass').value;
    const confirm = document.getElementById('forgot-confirm-pass').value;
    const passErr = document.getElementById('forgot-new-pass-err');
    const confirmErr = document.getElementById('forgot-confirm-pass-err');

    passErr.classList.add('hidden');
    confirmErr.classList.add('hidden');

    if (!pass || pass.length < 6) {
        passErr.textContent = 'Password minimal 6 karakter';
        passErr.classList.remove('hidden');
        return;
    }

    if (pass !== confirm) {
        confirmErr.textContent = 'Konfirmasi password tidak sesuai';
        confirmErr.classList.remove('hidden');
        return;
    }

    DEFAULT_USER.password = pass;
    showToast('Password Diperbarui', 'Password berhasil diubah. Silakan login.', 'success');
    state.forgotPassState = { step: 1, email: '', otp: '' };
    navigateTo('login');
}