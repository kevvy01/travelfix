<div align="center">

# 🌏 Bantul Creative — Village Freelancer Trail

**Platform Digital Jembatan Freelancer Kreatif & Ekosistem UMKM Desa Wisata Bantul**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![localStorage](https://img.shields.io/badge/Mock_DB-localStorage-brightgreen?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

> _Prototype platform digital yang dirancang untuk menjembatani talenta freelancer lokal Gen-Z dengan UMKM kreatif berwarisan budaya dan desa wisata di Kabupaten Bantul, Daerah Istimewa Yogyakarta._

</div>

---

## 📋 Deskripsi Proyek

**Bantul Creative — Village Freelancer Trail** adalah sebuah prototipe platform web yang dikembangkan sebagai solusi inovatif untuk menjawab kesenjangan antara ekosistem talenta digital muda dengan pelaku Usaha Mikro, Kecil, dan Menengah (UMKM) berbasis warisan budaya serta desa-desa wisata di Kabupaten Bantul, Daerah Istimewa Yogyakarta.

Platform ini berperan sebagai **ekosistem digital terintegrasi** yang mempertemukan dua kelompok aktor utama:

1. **Freelancer Kreatif Gen-Z** — individu berbakat di bidang desain grafis, fotografi, pengembangan web, pemasaran digital, dan seni pertunjukan yang membutuhkan akses ke proyek bermakna guna membangun portofolio profesional.
2. **UMKM & Desa Wisata Bantul** — entitas ekonomi kreatif lokal seperti sentra kerajinan gerabah Kasongan, perajin batik tulis Imogiri, pusat kerajinan kulit Manding, dan komunitas seni Dlingo yang membutuhkan dukungan digital untuk bersaing di pasar modern dan internasional.

Dengan menggabungkan konsep _challenge marketplace_, pemetaan kreatif berbasis lokasi (_trail map_), pencocokan berbasis AI (_AI talent matching_), dan dokumentasi dampak nyata (_impact portfolio_), platform ini bertujuan mengakselerasi pertumbuhan ekonomi kreatif berbasis kearifan lokal secara berkelanjutan.

> **Konteks Akademis:** Proyek ini dikembangkan sebagai portofolio teknis dalam lingkup mata kuliah Rekayasa Perangkat Lunak / Pemrograman Web pada Program Studi Teknik Informatika, sebagai demonstrasi implementasi konsep-konsep arsitektur frontend modern tanpa ketergantungan terhadap backend server.

---

## 🏗️ Arsitektur & Teknologi (Tech Stack)

Seluruh sistem dibangun secara murni pada lapisan _frontend_, tanpa server-side rendering maupun komunikasi dengan API eksternal. Berikut adalah tumpukan teknologi yang digunakan:

### Frontend Core

| Teknologi      | Versi / Standar                                                               | Peran                                                         |
| -------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **HTML5**      | Semantik penuh (`<article>`, `<section>`, `<nav>`, `<footer>`)                | Struktur markup dan aksesibilitas (WAI-ARIA)                  |
| **CSS3**       | Custom Properties, Grid, Flexbox, Transitions                                 | Sistem desain visual, responsivitas, dan animasi              |
| **JavaScript** | ES6+ (Arrow Functions, Destructuring, Template Literals, IIFE, `const`/`let`) | Logika interaktivitas, rendering dinamis, dan manajemen state |

### Mock Database Layer

Sebagai pengganti backend server dan basis data relasional, sistem ini mengimplementasikan **Data Access Layer (DAL)** yang dibungkus di atas API bawaan browser:

- **`window.localStorage`** — Digunakan sebagai mekanisme penyimpanan data persisten antar sesi browser. Semua data pengguna (akun, sesi aktif, preferensi tema) disimpan dalam format JSON yang di-serialisasi.
- **`js/db.js`** — Modul yang mengenkapsulasi seluruh operasi CRUD (Create, Read, Update) terhadap `localStorage`, mengekspos antarmuka publik `window.db` yang dapat dipanggil oleh modul lain. Pendekatan ini mensimulasikan pola _Repository Pattern_ yang lazim digunakan pada sistem berbasis database nyata.
- **`js/data.js`** — Modul yang berisi seluruh data statis (_seed data_) dalam bentuk konstanta array JavaScript, mencakup data proyek marketplace, proyek AI Match, lokasi trail map, dan entri portofolio. Modul ini berfungsi layaknya _fixture_ atau _seed file_ pada kerangka kerja ORM modern.

### Prinsip Arsitektur Utama

- **Separation of Concerns** — Logika autentikasi, rendering UI, dan data dipisahkan ke dalam modul-modul JavaScript yang independen.
- **Progressive Enhancement** — Fitur seperti `IntersectionObserver` untuk animasi scroll-reveal dilengkapi dengan _fallback_ agar kompatibel dengan browser yang lebih lama.
- **Event Delegation** — Satu _event listener_ tunggal pada elemen induk (`document.body`) menangani interaksi pada semua elemen anak yang dirender secara dinamis, menghindari _memory leak_ dan konflik listener.
- **IIFE (Immediately Invoked Function Expression)** — Digunakan secara konsisten untuk menghindari polusi _global scope_ dan menciptakan enkapsulasi modul yang bersih.

---

## 📁 Struktur Folder (Project Tree)

```
Travelfix/                          ← Root direktori proyek
│
├── index.html                      ← Landing Page (Halaman publik utama)
├── login.html                      ← Halaman autentikasi pengguna
├── register.html                   ← Halaman pendaftaran akun baru
├── marketplace.html                ← Halaman Challenge Marketplace (Freelancer)
├── ai-match.html                   ← Halaman AI Talent Match (Freelancer)
├── trail-map.html                  ← Halaman Creative Trail Map (Freelancer)
├── portfolio.html                  ← Halaman Impact Portfolio (Freelancer)
├── admin-dashboard.html            ← Halaman Dasbor Manajemen (Admin)
│
├── css/                            ← Direktori seluruh lembar gaya (stylesheet)
│   ├── style.css                   ← Global stylesheet: CSS Variables, typography, komponen universal
│   ├── landing.css                 ← Gaya eksklusif untuk index.html (hero, features, CTA)
│   ├── components.css              ← Gaya komponen reusable: card, modal, badge, filter, notifikasi
│   ├── login.css                   ← Gaya eksklusif untuk halaman login & register
│   └── admin.css                   ← Gaya eksklusif untuk halaman admin-dashboard.html
│
└── js/                             ← Direktori seluruh modul JavaScript
    ├── db.js                       ← Data Access Layer: simulasi DB berbasis localStorage
    ├── data.js                     ← Mock data statis: proyek, lokasi trail, portofolio
    ├── auth.js                     ← Handler form registrasi dan login (memanggil db.js)
    ├── login.js                    ← Logika autentikasi & RBAC untuk halaman login
    ├── app.js                      ← Orchestrator utama: routing halaman, rendering dinamis,
    │                                  event delegation global, manajemen modal & notifikasi
    ├── edit-profile-modal.js       ← Logika penuh modal Edit Profil (baca/tulis localStorage)
    ├── profile-modal.js            ← Logika modal tampilan profil pengguna (read-only view)
    └── skill-modal.js              ← Modul pemilihan skill & minat (multi-step modal)
```

### Penjelasan File Kunci

| File                       | Peran Spesifik dalam Arsitektur Sistem                                                                                                                                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `index.html`               | Landing page publik berisi hero banner, grid fitur, split-screen value proposition, dan CTA final. Menggunakan inline `<script>` untuk navbar scroll behavior dan `IntersectionObserver` untuk scroll-reveal animation.              |
| `marketplace.html`         | Halaman utama freelancer. Menampilkan grid kartu proyek yang dirender secara dinamis dari `data.js`, dilengkapi fitur pencarian real-time dan filter multi-kriteria (status & kategori).                                             |
| `admin-dashboard.html`     | Halaman khusus administrator. Hanya dapat diakses setelah login dengan kredensial admin. Menampilkan statistik platform dan manajemen proyek.                                                                                        |
| `css/style.css`            | Mendefinisikan seluruh token desain global melalui CSS Custom Properties (`--color-*`, `--font-*`, `--radius-*`), termasuk dukungan tema gelap (_dark mode_) via `[data-theme="dark"]`.                                              |
| `css/components.css`       | Berisi kelas komponen yang paling kaya: `.card`, `.badge`, `.modal`, `.detail-backdrop`, `.epm-*` (edit profile modal), `.nd-*` (notification dropdown), dan `.dm-*` (detail modals).                                                |
| `js/db.js`                 | Inti dari simulasi backend. Mengekspos `window.db` dengan metode `initDB()`, `registerUser()`, `loginUser()`, dan `updateUserProfile()`. Auto-inisialisasi saat dimuat, menyuntikkan akun _seed_ default.                            |
| `js/app.js`                | File JavaScript terbesar dan terpenting. Mengorkestrasi seluruh inisialisasi halaman, routing berbasis `pathname`, rendering kartu dinamis, sistem modal bertingkat, toggle tema, dan pembaruan UI profil.                           |
| `js/edit-profile-modal.js` | Mengelola siklus hidup penuh modal edit profil: membuka, mengisi otomatis dari `localStorage`, menangani toggle pill skill/minat via _event delegation_, menyimpan perubahan melalui `window.db`, dan memperbarui UI secara reaktif. |
| `js/data.js`               | Sumber data tunggal (_single source of truth_) untuk semua konten halaman freelancer. Mendefinisikan `marketplaceProjects`, `aiMatchProjects`, `trailLocations`, dan `portfolioProjects` sebagai konstanta global.                   |

---

## 🔍 Penjelasan Modul & Cara Kerja Kode

### 1. Autentikasi & RBAC (Role-Based Access Control)

Sistem autentikasi diimplementasikan melalui kolaborasi tiga modul utama: `js/db.js`, `js/login.js`, dan `js/auth.js`.

**Mekanisme Kerja `js/db.js`:**

Saat modul pertama kali dimuat oleh browser, fungsi `initDB()` dipanggil secara otomatis. Fungsi ini memeriksa apakah kunci `bantul_users` sudah ada di `localStorage`. Jika belum (pertama kali diakses), sistem menyuntikkan dua akun _seed_ default:

```javascript
// Akun Freelancer (User Reguler)
{ name: "User Reguler", email: "user123@gmail.com", password: "user123", role: "freelancer" }

// Akun Administrator
{ name: "Admin System", email: "admin123@gmail.com", password: "admin123", role: "admin" }
```

Saat pengguna mencoba masuk, fungsi `loginUser(email, password)` memvalidasi kredensial dengan mencari kecocokan pada array pengguna yang tersimpan. Jika cocok, objek pengguna tersebut disimpan ke kunci `currentUser` di `localStorage` (sebagai penanda sesi aktif), dan fungsi mengembalikan objek `{ success: true, role: user.role }`.

**Mekanisme Routing RBAC di `js/auth.js`:**

Berdasarkan nilai `role` yang dikembalikan oleh `db.loginUser()`, `auth.js` mengarahkan pengguna ke halaman yang sesuai:

```
email: user123@gmail.com  →  role: "freelancer"  →  redirect: marketplace.html
email: admin123@gmail.com →  role: "admin"        →  redirect: admin-dashboard.html
```

Apabila kredensial tidak valid, input form diberi kelas CSS `.error` (menampilkan efek visual _shake_), nilai field password dikosongkan, dan pesan kesalahan ditampilkan kepada pengguna.

---

### 2. Manajemen Sesi & Profil (Edit Profile Modal)

Seluruh logika pengelolaan profil pengguna terenkapsulasi dalam `js/edit-profile-modal.js` menggunakan pola IIFE dengan `'use strict'`.

**Alur Buka Modal & Pre-populasi Data:**

Ketika pengguna mengklik tombol "Edit Profil", fungsi `openModal()` dipanggil. Fungsi ini:

1. Membaca data pengguna saat ini dari `localStorage.getItem('currentUser')`.
2. Mengisi otomatis field `Nama`, `Email` pada form (field password selalu dikosongkan demi keamanan).
3. Melakukan iterasi pada seluruh pill skill dan minat (`data-skill` / `data-interest`), membandingkannya dengan array yang tersimpan di profil pengguna, dan menandai pill yang sesuai dengan kelas `.selected`.

**Alur Simpan Perubahan:**

Fungsi `handleSave()` mengeksekusi urutan operasi berikut:

1. Mengumpulkan nilai terbaru dari field nama, email, dan password.
2. Melakukan validasi dasar: nama dan email tidak boleh kosong.
3. Mengumpulkan semua pill dengan kelas `.selected` untuk mendapatkan array skill dan minat baru.
4. Memanggil `window.db.updateUserProfile()` yang secara atomik memperbarui record pengguna di array `bantul_users` pada `localStorage` **sekaligus** memperbarui objek sesi `currentUser` agar perubahan langsung tercermin tanpa perlu login ulang.
5. Memanggil `updateProfileUI()` (dari `app.js`) untuk memperbarui tampilan nama dan avatar di navbar secara reaktif.
6. Memanggil `renderDropdownPills()` untuk memperbarui tampilan pill skill dan minat di dropdown profil.

**Persistensi Antar Akun yang Terisolasi:**

Setiap pengguna memiliki identitas yang sepenuhnya terisolasi dalam `localStorage`. Sistem menggunakan `email` lama sebagai kunci pencarian (_lookup key_) saat memperbarui profil, sehingga perubahan email pun dapat ditangani dengan benar tanpa data lintas pengguna.

---

### 3. Interaktivitas Halaman via Event Delegation (js/app.js)

Fungsi `initDetailModals()` dalam `app.js` mengimplementasikan pola _event delegation_ yang robust untuk menangani seluruh interaksi kartu di semua halaman.

**Masalah yang Dipecahkan:**

Karena kartu-kartu proyek, trail, dan portofolio dirender secara dinamis ke dalam DOM oleh JavaScript (bukan ditulis statis di HTML), pendekatan konvensional dengan `element.addEventListener()` per-kartu akan gagal — elemen tersebut belum ada saat `DOMContentLoaded` pertama kali terpicu.

**Solusi Event Delegation:**

Satu _event listener_ tunggal dipasang pada `document.body`:

```javascript
document.body.addEventListener('click', (e) => {
    // Klik pada kartu Marketplace atau AI Match
    const projectCard = e.target.closest('.card-marketplace, .card-aimatch');
    if (projectCard) { ... populateAndOpenProjectModal(data, openModal); return; }

    // Klik pada kartu Trail Map
    const trailCard = e.target.closest('.card-trail');
    if (trailCard) { ... populateAndOpenLocationModal(data, openModal); return; }

    // Klik pada kartu Portfolio
    const portfolioCard = e.target.closest('.card-portfolio');
    if (portfolioCard) { ... populateAndOpenPortfolioModal(data, openModal); return; }
});
```

Metode `e.target.closest()` digunakan untuk menemukan elemen kartu terdekat dari titik klik, bahkan jika pengguna mengklik elemen anak di dalam kartu (misalnya ikon atau teks). Sebelum mencari kartu, sistem terlebih dahulu memeriksa apakah klik berasal dari `<button>` atau `<a>` untuk mencegah konflik aksi.

**Aksi "Ambil Proyek":**

Tombol `#btn-ambil-proyek` di dalam modal detail juga ditangani melalui _event delegation_ pada `document.body`. Saat diklik, modal ditutup terlebih dahulu dengan efek transisi CSS, lalu setelah 300ms jeda (menunggu animasi selesai), notifikasi konfirmasi ditampilkan — mencegah tampilan modal dan dialog bertabrakan.

---

### 4. Sistem Notifikasi Toast Global

> **Catatan Arsitektur:** Berdasarkan analisis kode sumber, sistem validasi saat ini menggunakan `window.alert()` bawaan browser untuk menampilkan pesan kesalahan (misalnya, field kosong atau format email tidak valid). Ini adalah implementasi yang sederhana dan efektif untuk tahap prototipe.

Validasi form yang diimplementasikan mencakup:

- **`js/auth.js` — Validasi Registrasi:** Memeriksa kesamaan password dengan konfirmasi password, serta delegasi pengecekan email duplikat ke `db.registerUser()`.
- **`js/edit-profile-modal.js` — Validasi Edit Profil:** Memastikan field Nama dan Email tidak dibiarkan kosong sebelum data disimpan ke `localStorage`.
- **Umpan Balik Visual:** Input yang gagal validasi mendapatkan kelas CSS `.error` yang memberikan umpan balik visual langsung (misalnya, border merah) kepada pengguna, sementara `alert()` memberikan pesan deskriptif yang jelas.

Sistem notifikasi visual berbasis _toast_ (yang menyuntikkan elemen ke DOM dan _self-dismiss_ setelah beberapa detik) merupakan arah pengembangan natural berikutnya untuk menggantikan `alert()` pada iterasi produksi.

---

### 5. Fitur Tambahan: Toggle Tema & Scroll Reveal

**Dark Mode / Light Mode (`js/app.js` + `css/style.css`):**

Preferensi tema pengguna disimpan secara persisten di `localStorage` dengan kunci `'theme'`. Fungsi `initThemeToggle()` mengambil nilai ini saat halaman dimuat dan menerapkannya sebagai atribut `data-theme` pada elemen `<html>`. Seluruh perubahan warna dikendalikan oleh CSS Custom Properties yang terdefinisi di `style.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #1a1a2e;
}
[data-theme="dark"] {
  --bg-primary: #0d0f1a;
  --text-primary: #e8e8f0;
}
```

**Scroll Reveal Animation (`index.html`):**

Halaman landing menggunakan `IntersectionObserver` API untuk mendeteksi kapan elemen dengan atribut `data-reveal` memasuki _viewport_. Saat terdeteksi, kelas CSS `revealed` ditambahkan, memicu transisi animasi `opacity` dan `transform` yang didefinisikan di `landing.css`. Dukungan _fallback_ melalui blok `else` memastikan konten tetap terlihat di browser tanpa dukungan `IntersectionObserver`.

---

## 📄 Deskripsi Halaman Aplikasi

| Halaman                | Peran & Aksesibilitas                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `index.html`           | Landing page publik. Dapat diakses tanpa login. Berisi hero, grid fitur, value proposition, dan CTA pendaftaran.  |
| `login.html`           | Form autentikasi. Mendukung toggle visibilitas password. Mengarahkan ke halaman yang sesuai berdasarkan peran.    |
| `register.html`        | Form pendaftaran akun baru. Validasi kecocokan password dan pengecekan email duplikat via `db.js`.                |
| `marketplace.html`     | **[Freelancer]** Daftar proyek terbuka dari UMKM. Mendukung pencarian real-time dan filter status/kategori.       |
| `ai-match.html`        | **[Freelancer]** Daftar proyek terurut berdasarkan persentase kecocokan (_match score_) dengan profil pengguna.   |
| `trail-map.html`       | **[Freelancer]** Peta visual desa kreatif di Bantul dengan pin interaktif dan kartu lokasi yang dapat diklik.     |
| `portfolio.html`       | **[Freelancer]** Galeri proyek yang telah diselesaikan, menampilkan metrik dampak nyata, rating, dan kontributor. |
| `admin-dashboard.html` | **[Admin Only]** Dasbor manajemen platform. Hanya dapat diakses dengan akun berperan `admin`.                     |

---

## 🚀 Panduan Menjalankan Proyek

Proyek ini adalah aplikasi web murni berbasis HTML/CSS/JS yang tidak memerlukan proses _build_, instalasi paket `npm`, atau konfigurasi server. Berikut adalah dua metode yang direkomendasikan:

### Metode 1: VS Code Live Server _(Direkomendasikan)_

Pendekatan ini memastikan modul JavaScript dimuat dengan benar melalui protokol `http://`, menghindari pembatasan keamanan browser terkait protokol `file://`.

1. Buka folder proyek (`Travelfix/`) di **Visual Studio Code**.
2. Pastikan ekstensi **Live Server** (oleh Ritwick Dey) telah terpasang. Jika belum, instal dari _Extensions Marketplace_ (`Ctrl + Shift + X`).
3. Klik kanan pada file `index.html` di _Explorer_ panel, lalu pilih **"Open with Live Server"**.
4. Browser akan terbuka secara otomatis menuju `http://127.0.0.1:5500/index.html`.
5. Setiap perubahan yang disimpan pada file HTML, CSS, atau JS akan me-reload halaman secara otomatis (_hot reload_).

### Metode 2: Buka Langsung di Browser

Untuk penggunaan sederhana tanpa instalasi ekstensi apapun:

1. Navigasikan ke folder `Travelfix/` menggunakan File Explorer (Windows).
2. Klik dua kali pada file `index.html`.
3. Halaman akan terbuka langsung di browser default melalui protokol `file://`.

> **Catatan:** Fungsionalitas utama (localStorage, JavaScript) berjalan normal pada protokol `file://`. Namun, beberapa fitur terkait kebijakan CORS atau modul ES6 mungkin memerlukan protokol `http://` (Metode 1).

### Akun Uji Coba Bawaan

Sistem dilengkapi dengan dua akun yang telah di-_seed_ secara otomatis. Gunakan kredensial berikut untuk menguji:

| Peran             | Email                | Password   | Halaman Tujuan         |
| ----------------- | -------------------- | ---------- | ---------------------- |
| **Freelancer**    | `user123@gmail.com`  | `user123`  | `marketplace.html`     |
| **Administrator** | `admin123@gmail.com` | `admin123` | `admin-dashboard.html` |

> **Perhatian:** Karena seluruh data menggunakan `localStorage`, setiap perubahan (edit profil, registrasi akun baru) hanya bersifat lokal pada browser yang digunakan. Membersihkan data browser (_clear site data_) akan mereset semua data ke kondisi awal.

---

## 👥 Kontributor

Proyek ini dikembangkan sebagai karya portofolio akademis dalam Program Studi Teknik Informatika.

---

## 📜 Lisensi

Proyek ini dikembangkan untuk tujuan pendidikan dan demonstrasi portofolio akademis. Seluruh aset, konten, dan kode sumber bersifat _open for review_ dalam konteks penilaian akademis.

---

<div align="center">

**© 2026 Bantul Creative — Village Freelancer Trail**

_Dibangun dengan ❤️ untuk ekosistem kreatif Kabupaten Bantul, DI Yogyakarta._

</div>
