# 🚀 Template 6 - Modern Portfolio & Dynamic Admin Studio

Website portofolio modern, elegan, dan responsif yang dibangun dengan **Next.js 15**, **React 19**, **Tailwind CSS v4**, dan **Firebase**. Dilengkapi dengan **Admin Studio (CMS)** mandiri untuk mengelola seluruh konten, tautan, tema warna, statistik pengunjung, dan portofolio secara dinamis dan *real-time*.

---

## 📌 Atribusi & Informasi Proyek Modifikasi

> [!NOTE]  
> **Project Modification Notice**:  
> Proyek ini merupakan **karya modifikasi dan pengembangan lanjutan** yang dibangun ulang dari dasar menjadi aplikasi full-stack modern menggunakan arsitektur **Next.js 15 (App Router)**, **React 19**, dan **Firebase Cloud Firestore & Authentication**.  
>  
> Konsep visual dan tata letak dasar antarmuka diadaptasi dari template HTML yang aslinya didesain oleh **[BootstrapMade](https://bootstrapmade.com/)** dan didistribusikan oleh **[ThemeWagon](https://themewagon.com/)** (sebagaimana tercantum dan tetap dipertahankan pada lisensi/atribusi di footer website). Seluruh hak cipta desain asli tetap dimiliki oleh pembuat aslinya.

---

## 🛠️ Framework & Teknologi yang Digunakan

Proyek ini menggunakan kombinasi teknologi modern performa tinggi:

| Komponen / Fitur | Framework / Teknologi | Kegunaan |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (App Router)** | Framework React modern dengan performa tinggi dan static HTML export (`output: "export"`). |
| **UI Library** | **React 19** | Pustaka antarmuka pengguna berbasis komponen reaktif. |
| **Bahasa Pemrograman** | **TypeScript 5** | Menjamin keamanan tipe data (*type safety*) dan skalabilitas kode. |
| **Styling & CSS** | **Tailwind CSS v4 & PostCSS** | Utility-first CSS framework versi terbaru untuk desain modern dan responsif. |
| **Animasi & Interaktivitas** | **Framer Motion** | Animasi halus untuk interaksi elemen, modal, hero section, dan *scroll-to-top indicator*. |
| **Set Ikon** | **Lucide React** | Ikon modern, clean, dan konsisten di seluruh halaman web dan panel admin. |
| **Backend & Cloud DB** | **Google Firebase (v12 SDK)** | - **Firebase Authentication**: Login aman akun admin (Email & Password).<br>- **Cloud Firestore**: Database NoSQL real-time untuk data web dan statistik kunjungan.<br>- **Firebase Hosting**: Hosting web statis dengan performa CDN global. |
| **Media & CDN Helper** | **Google Drive Direct Parser** | Otomatis mengonversi tautan *share link* Google Drive menjadi URL gambar langsung (CDN) tanpa perlu kuota storage berbayar. |
| **Formulir Kontak** | **Formspree** | Pengiriman pesan langsung dari form kontak ke email pribadi tanpa backend server tambahan. |

---

## ✨ Fitur-Fitur Utama

1. **Desain Modern & Responsif**: Tampilan optimal di perangkat smartphone, tablet, maupun layar desktop.
2. **Dynamic Admin Studio (`/admin`)**:
   - Kelola informasi Hero, About, Skills, Resume, Portfolio, Certificates, dan Kontak tanpa perlu mengedit kode sumber.
   - *Live Color Palette Generator* (Primary Accent, Background, Text, Card colors) yang berubah seketika (*live update*).
   - Fitur *Reset to Sample Defaults* dan *Clear All Sample Data* dengan 1 klik.
3. **Real-time Traffic & Visitor Analytics**:
   - Pelacakan kunjungan halaman (*page views*), pengunjung unik (*unique visitors*), dan perkiraan bandwidth data.
4. **Google Drive Direct Image Integration**:
   - Cukup tempel link share Google Drive, sistem otomatis mengonversinya menjadi URL gambar langsung.
5. **Keamanan Admin Panel**:
   - Dilindungi Firebase Auth dengan kemudahan mengganti password langsung dari panel admin.

---

## 📋 Prasyarat Sistem (Prerequisites)

Sebelum menjalankan proyek ini di komputer lokal, pastikan Anda telah menyiapkan:
- **Node.js**: Versi `18.18.0` atau yang lebih baru (Disarankan versi `20 LTS` atau `22 LTS`). Cek dengan `node -v`.
- **npm** (bawaan Node.js), **pnpm**, atau **yarn**.
- **Akun Google Firebase** (Gratis / Spark Plan).
- **Git**: Terpasang di komputer Anda.

---

## 🚀 Panduan Kloning & Menjalankan di Komputer Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di komputer Anda:

### 1. Kloning Repository
Buka terminal dan jalankan perintah:
```bash
git clone https://github.com/USERNAME/NAMA-REPO-ANDA.git
cd NAMA-REPO-ANDA
```

### 2. Install Dependensi
Install seluruh paket dependensi yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Firebase SDK
Proyek ini membutuhkan koneksi ke proyek Firebase Anda sendiri:

1. Buat project baru di [Firebase Console](https://console.firebase.google.com/).
2. Daftarkan aplikasi web baru (**Web App / `</>`**) di dashboard Firebase.
3. Salin kredensial Firebase SDK yang diberikan.
4. Anda dapat mengonfigurasikannya melalui **salah satu dari 2 cara**:
   - **Opsi A (Menggunakan `.env.local` - Direkomendasikan)**:
     Salin file `.env.example` menjadi `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
     Lalu isi dengan kredensial Firebase Anda:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=proyek-anda.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=proyek-anda
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=proyek-anda.firebasestorage.app
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
     NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
     NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
     ```
   - **Opsi B (Langsung di file `lib/firebase.ts`)**:
     Buka file `lib/firebase.ts` dan ganti nilai template `YOUR_FIREBASE_...` dengan kredensial konfigurasi Firebase Anda.

5. **Aktifkan Layanan di Firebase Console**:
   - **Firebase Authentication**: Buka menu *Authentication* -> *Sign-in method* -> Aktifkan provider **Email/Password**. Lalu buat akun admin Anda di tab *Users*.
   - **Cloud Firestore**: Buka menu *Firestore Database* -> Klik **Create database** -> Pilih mode **Start in test mode** (atau konfigurasikan rules sesuai kebutuhan keamanan Anda).

### 4. Jalankan Local Development Server
Jalankan server lokal:
```bash
npm run dev
```

Buka browser dan buka alamat:
- **Halaman Portfolio Utama**: [http://localhost:3000](http://localhost:3000)
- **Halaman Admin Studio**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📖 Panduan Penggunaan Admin Studio & Tips Praktis

### A. Menginput Gambar dari Google Drive
Website ini mendukung pembacaan link Google Drive secara langsung tanpa perlu mengunggah file ke hosting:
1. Unggah foto ke Google Drive Anda.
2. Klik kanan foto -> pilih **Bagikan (Share)** -> **Bagikan**.
3. Ubah opsi *Akses Umum (General Access)* menjadi **Siapa saja yang memiliki link (Anyone with the link)**.
4. Klik **Salin link (Copy link)**.
5. Tempelkan (*paste*) link tersebut ke kolom gambar di Admin Studio (Hero, About, Portfolio, atau Certificate). Foto akan langsung tampil otomatis.

### B. Mengubah Password Admin
1. Masuk ke halaman `/admin`.
2. Buka tab **Security & Account** di bilah navigasi kiri.
3. Masukkan password saat ini, masukkan password baru, dan klik **Update Admin Password**.

### C. Menghubungkan Formulir Kontak (Formspree)
1. Buat form gratis di [Formspree](https://formspree.io/).
2. Salin Endpoint URL Formspree Anda.
3. Masuk ke Admin Studio -> Tab **Contact** -> Tempelkan URL Formspree pada kolom *Formspree Form URL / ID*.
4. Klik **Save All Changes**. Sekarang setiap pesan dari pengunjung website akan langsung terkirim ke email Anda.

---

## 📂 Struktur Direktori Proyek

```plaintext
├── app/
│   ├── admin/           # Halaman Admin Studio (CMS Dashboard & Login)
│   ├── globals.css      # Styling global Tailwind CSS & CSS Variables tema
│   ├── layout.tsx       # Root layout, metadata SEO, & Google Fonts
│   └── page.tsx         # Halaman utama portofolio
├── components/          # Komponen UI modular (Header, Hero, About, Resume, Portfolio, Footer, dll)
├── context/
│   └── SiteDataContext.tsx  # Context API untuk sinkronisasi state data Firestore secara real-time
├── lib/
│   ├── analytics.ts     # Pelacakan statistik & pemakaian bandwidth
│   ├── defaultSiteData.ts   # Data fallback default jika Firestore kosong
│   ├── firebase.ts      # Template inisialisasi Firebase App, Auth, dan Firestore SDK
│   └── utils/
│       └── drive.ts     # Utilitas otomatis konversi tautan gambar Google Drive
├── public/              # Berkas statis (gambar sampel, ikon, favicon)
├── .env.example         # Template contoh konfigurasi Environment Variables
├── firebase.json        # Konfigurasi deployment Firebase Hosting
├── package.json         # Dependensi proyek dan skrip npm
└── README.md            # Dokumentasi lengkap proyek
```

---

## 📄 Lisensi & Atribusi Kredit

- Proyek ini bebas digunakan dan dimodifikasi untuk kebutuhan portofolio pribadi.
- Desain antarmuka dasar mengacu pada template yang didesain oleh **[BootstrapMade](https://bootstrapmade.com/)** dan didistribusikan oleh **[ThemeWagon](https://themewagon.com/)**.
- Seluruh teks atribusi lisensi asli tetap dipertahankan pada bagian footer website.
