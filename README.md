# SafeHome - Perumnas Pesona Cirebon Regency
### Aplikasi Pelaporan Kejadian & Pemantauan Keamanan Lingkungan Berbasis Web (Full-Stack PHP & MySQL)

---

## 📌 Deskripsi Aplikasi

**SafeHome** adalah platform sistem informasi manajemen keamanan terpadu berbasis web yang dirancang khusus untuk kawasan permukiman **Perumnas Pesona Cirebon Regency**. Sistem ini menghubungkan warga penghuni, regu pengamanan (satpam), pemilik/pengelola kawasan (owner), dan jajaran pimpinan (direktur) dalam satu ekosistem digital yang responsif, transparan, dan akuntabel.

Tujuan utama SafeHome adalah:
1. **Mempercepat Respons Insiden Darurat**: Mengurangi waktu tanggap insiden dan darurat di lingkungan warga melalui fitur *Panic Button* (SOS) dan sistem tiket laporan otomatis.
2. **Transparansi Penanganan**: Memberikan kepastian status kepada pelapor melalui *timeline* audit trail penanganan dari saat laporan diterima, diproses di lokasi, hingga dinyatakan selesai.
3. **Akuntabilitas Kinerja Petugas**: Memfasilitasi pencatatan titik patroli keamanan per shift, monitoring waktu respons, dan pelaporan lapangan secara objektif.
4. **Analisis Berbasis Data untuk Keputusan**: Menyediakan dasbor matriks risiko kerawanan per blok pemukiman serta ringkasan eksekutif dan ekspor rekapitulasi data periodik (CSV) bagi pihak manajemen.

---

## 🆕 Pembaruan Terbaru

| Pembaruan | Keterangan |
|---|---|
| **Jenis kelamin pengguna** | Field `jenis_kelamin` (Laki-laki / Perempuan) ditambahkan pada pendaftaran penghuni, profil mandiri, serta form tambah dan edit pengguna oleh Owner. |
| **Sapaan personal Mas/Mbak** | Beranda menyapa pengguna sesuai jenis kelamin, misalnya *"Selamat malam, Mas Hadi Pratama"* atau *"Selamat malam, Mbak Ratna"*. Akun yang belum mengisi jenis kelamin disapa tanpa sebutan. |
| **Tombol mata pada kata sandi** | Setiap kolom kata sandi (login, pendaftaran, ubah kata sandi) memiliki tombol mata untuk menampilkan atau menyembunyikan kata sandi. Kolom otomatis tersembunyi lagi saat berpindah layar. |
| **Login tanpa autofill** | Kartu peran pada layar login hanya memilih peran. ID dan kata sandi harus diketik sendiri, lalu divalidasi oleh server. |
| **Mode demo dihapus** | Aplikasi berjalan sebagai sistem sungguhan dengan satu basis data (`safehome`). Tidak ada lagi jalan masuk tanpa kredensial. |
| **Perbaikan token CSRF** | Klien mengambil token baru secara otomatis sebelum request yang mengubah data, dan mengulang request satu kali bila token kedaluwarsa. Token juga direset saat logout. |
| **Perlindungan XSS** | Seluruh teks buatan pengguna (nama, lokasi, deskripsi laporan) di-*escape* sebelum ditampilkan pada tabel dan dialog. |
| **Validasi lebih ketat** | Nomor HP 10–13 digit, nomor rumah hanya angka, format email diperiksa, dan kata sandi minimal 8 karakter di sisi klien maupun server. |
| **Perbaikan keamanan backend** | Verifikasi kata sandi lama hanya lewat `password_verify()`, persetujuan/penolakan pendaftaran hanya berlaku pada akun berstatus *menunggu*, dan pencarian ID (`find_id`) dibatasi 5 percobaan per menit. |

---

## 🏗️ Penjelasan Arsitektur & Isi Aplikasi

Aplikasi SafeHome dibangun dengan arsitektur modern tanpa dependensi framework luar (Vanilla JS + Native PHP 8 PDO & MySQL), mengedepankan efisiensi, keamanan, dan kompatibilitas penuh dengan lingkungan XAMPP.

### 1. Struktur Modul & Lapisan Aplikasi

```
SafeHome/
├── index.html                 # Antarmuka SPA (Single Page Application) multi-layar
├── app.js                     # Logika klien, navigasi layar, polling 10 detik, state store, dan tombol mata kata sandi
├── config.js                  # Konfigurasi dan konstanta global
├── style.css                  # Desain CSS tema SafeHome Navy & sistem token warna
├── uploads/                   # Direktori penyimpanan foto bukti & foto profil
│   └── .htaccess              # Perlindungan keamanan (melarang eksekusi skrip PHP di folder upload)
├── database/
│   ├── schema.sql             # Skema DDL tabel MySQL (InnoDB, Foreign Keys, Indexing)
│   └── seed.sql               # Data awal akun bcrypt & rekap contoh laporan 1-16 Okt 2026
└── api/                       # RESTful JSON Backend (PHP 8 + PDO Prepared Statements)
    ├── config.php             # Koneksi DB, Sesi aman HttpOnly, Proteksi CSRF, Rate-Limiting login
    ├── auth.php               # Endpoint Login, Logout, Validasi Sesi (me), dan Token CSRF
    ├── laporan.php            # Endpoint Laporan (List, Detail, Create + Upload Foto, Update Status, Eskalasi)
    ├── pengguna.php           # Endpoint Profil, Ubah Sandi, Owner CRUD Akun, & Registrasi Warga
    ├── darurat.php            # Endpoint Pengiriman & Penanganan Sinyal SOS / Tombol Darurat
    ├── patroli.php            # Endpoint Daftar Titik Checkpoint & Catat Patroli Lapangan
    ├── notifikasi.php         # Endpoint Polling Notifikasi & Badge Belum Dibaca
    ├── statistik.php          # Endpoint Agregasi KPI, Matriks Risiko Blok, dan Performa Satpam
    └── export.php             # Endpoint Ekspor Rekap Laporan Periodik ke format CSV (UTF-8 BOM)
```

> Catatan: berkas `panduan-uji-coba.js` dan `api/demo_reset.php` milik mode demo sudah tidak dipakai. Jika masih ada di folder proyek, hapus saja.

### 2. Endpoint Manajemen Pengguna (`api/pengguna.php`)

| Aksi (`?action=`) | Akses | Fungsi |
|---|---|---|
| `register` | Publik | Pendaftaran mandiri penghuni (status awal *menunggu*) |
| `find_id` | Publik (dibatasi 5 percobaan/menit) | Mencari ID login lewat nama dan nomor HP |
| `profile` | Semua peran login | Melihat dan memperbarui profil (nama, jenis kelamin, HP, email, foto) |
| `change_password` | Semua peran login | Mengganti kata sandi sendiri |
| `list` | Owner, Direktur | Daftar pengguna, dapat difilter per peran |
| `add` | Owner | Menambah akun petugas keamanan |
| `edit` | Owner | Mengubah data pengguna |
| `toggle_active` | Owner | Mengaktifkan atau menonaktifkan akun |
| `delete` | Owner | Menghapus akun |
| `reset_password` | Owner | Mereset kata sandi ke sandi default |
| `pending_registrations` | Owner | Daftar pendaftaran yang menunggu verifikasi |
| `approve_registration` | Owner | Menyetujui pendaftaran (hanya akun penghuni berstatus *menunggu*) |
| `reject_registration` | Owner | Menolak pendaftaran beserta alasan |

### 3. Aturan Validasi Data

| Data | Aturan |
|---|---|
| Nama lengkap | Minimal 3 karakter |
| Jenis kelamin | `L` (Laki-laki) atau `P` (Perempuan). Wajib saat pendaftaran penghuni dan tambah petugas |
| Blok | Salah satu dari A, B, C, D, E, F |
| Nomor rumah | Hanya angka. ID login penghuni dibentuk otomatis sebagai `Blok-Nomor` (contoh: `B-20`) |
| Nomor HP | Hanya angka, 10–13 digit |
| Email | Opsional, harus berformat email yang valid bila diisi |
| Kata sandi | Minimal 8 karakter |
| Foto profil | JPG, PNG, atau WEBP, maksimal 1 MB, isi berkas diperiksa sebagai gambar |
| Foto bukti laporan | JPG, PNG, atau WEBP, maksimal 2 MB |

---

## 👥 4 Peran Pengguna & Fitur-Fiturnya

Aplikasi menyediakan wewenang dan tampilan khusus sesuai peran (*Role-Based Access Control*):

### 1. 🏡 Penghuni (Warga Lingkungan)
- **Pendaftaran Mandiri**: Mengisi nama, jenis kelamin, blok, nomor rumah, nomor HP, email, dan kata sandi. Akun aktif setelah diverifikasi Owner, dan ID login ditampilkan beserta tombol salin setelah pendaftaran terkirim.
- **Beranda Personal**: Sapaan *Mas/Mbak* sesuai jenis kelamin, informasi nama dan status satpam yang bertugas, ringkasan laporan saya, dan aksi cepat.
- **Form Lapor Kejadian**: Pengiriman laporan insiden dengan kategori (Pencurian, Kebakaran, Orang Mencurigakan, Gangguan Ketertiban, Kecelakaan, Lainnya), pemilihan blok (A–F), lokasi spesifik, tingkat urgensi (Rendah, Sedang, Tinggi), serta unggah foto bukti langsung (maks. 2 MB: JPG, PNG, WEBP).
- **Riwayat & Detail Laporan**: Pemantauan status laporan (*Baru*, *Diproses*, *Selesai*, *Eskalasi*) dengan filter Semua/Aktif/Selesai, disertai lini masa interaktif penanganan waktu demi waktu.
- **Tombol Darurat (Panic Button)**: Pengiriman sinyal SOS darurat (Kejahatan, Kebakaran, Medis) dengan animasi sirene dan notifikasi instan langsung ke regu satpam.
- **Info Lingkungan**: Jadwal piket 3 shift satpam hari ini, nomor kontak darurat posko utama, dan pengumuman warga.
- **Profil Mandiri**: Mengubah data pribadi (nama, jenis kelamin, nomor HP, email), foto profil, dan mengganti kata sandi.

### 2. 👮 Satpam (Regu Pengamanan Kawasan)
- **Kotak Masuk (Inbox) Terpadu**: Pemantauan antrean insiden secara real-time dengan counter laporan baru, laporan sedang diproses, dan laporan selesai.
- **Peringatan Darurat Berkedip**: Banner khusus sinyal SOS merah yang otomatis muncul saat ada warga yang menekan tombol panik.
- **Alur Tindak Lanjut**: Menerima laporan warga (*status berubah menjadi Diproses*), menambahkan catatan perkembangan penanganan di lapangan, dan menyelesaikan laporan (*status Selesai*).
- **Eskalasi Insiden ke Owner**: Fasilitas pelimpahan kasus berat/kritis yang memerlukan persetujuan atau arahan dari Owner perumahan.
- **Pencatatan Patroli (Checkpoints)**: Pencatatan kunjungan patroli titik-titik pos pemeriksaan fisik (Gerbang Utama, Fasum, Blok A-F) dengan stempel waktu otomatis dan progres persentase.

### 3. 🏢 Owner (Pemilik / Pengelola Paguyuban Perumnas)
- **Matriks Pemantauan per Blok**: Peta pemantauan tingkat kerawanan Blok A hingga F (*Aman, Perhatian, Waspada*) yang dihitung dinamis dari akumulasi insiden di database.
- **Manajemen Kasus Eskalasi**: Peninjauan laporan bermasalah tinggi dari satpam dan pemberian instruksi arahan resmi Owner yang tercatat di lini masa laporan.
- **Manajemen Pengguna (User Management)**:
  - Verifikasi dan persetujuan/penolakan pendaftaran akun warga baru yang mendaftar online.
  - Tambah petugas keamanan baru (lengkap dengan jenis kelamin, shift, dan pos jaga), edit data, aktifkan/nonaktifkan, dan hapus akun warga maupun satpam.
  - Reset kata sandi pengguna ke sandi default secara instan.
  - Fitur **Cari ID Akun**: Membantu warga yang lupa ID login dengan pencarian nama dan nomor HP.
- **Evaluasi Kinerja Satpam**: Monitoring waktu tanggap rata-rata pos (target < 10 menit), persentase penyelesaian patroli, serta kartu nilai per personil.

### 4. 📊 Direktur (Pimpinan Eksekutif Pengelola Kawasan)
- **Dashboard Ringkasan Eksekutif (KPI)**:
  - Total akumulasi kejadian tercatat.
  - Persentase tingkat keberhasilan penyelesaian insiden.
  - Rata-rata waktu tanggap satpam dalam hitungan menit.
  - Jumlah kasus yang dieskalasikan ke manajemen.
- **Visualisasi Tren Keamanan**: Grafik tren mingguan volume insiden dan distribusi jenis insiden lingkungan.
- **Ekspor Rekap Laporan Periodik (CSV)**: Pengunduhan file rekap data resmi lengkap (format CSV kompatibel Excel) dengan opsi filter mingguan, bulanan, atau seluruh waktu, serta pratinjau dokumen berkop resmi.

---

## 🔒 Fitur Keamanan Sistem

1. **Autentikasi & Penyimpanan Kata Sandi**: Menggunakan algoritma hash satu arah `password_hash()` (Bcrypt). Kata sandi lama diverifikasi hanya melalui `password_verify()`.
2. **Prepared Statements (PDO)**: Seluruh query SQL 100% menggunakan parameter binding untuk mencegah serangan *SQL Injection*.
3. **Proteksi CSRF (Cross-Site Request Forgery)**: Setiap permintaan API pengubah data (POST) wajib menyertakan token CSRF (header `X-CSRF-Token`) yang diverifikasi di server. Klien memperbarui token secara otomatis bila sesi berganti.
4. **Pembatasan Percobaan (Rate-Limiting)**: Maksimal 5 kegagalan login per IP/ID dalam 1 menit guna mencegah serangan *Brute Force*. Pencarian ID akun (`find_id`) juga dibatasi 5 percobaan per menit.
5. **Cookie Sesi Aman**: Cookie sesi dikonfigurasi dengan flag `HttpOnly` (mencegah pencurian cookie via JavaScript) dan `SameSite=Lax`.
6. **Kontrol Akses Berbasis Peran (RBAC)**: Setiap endpoint memeriksa sesi dan peran di server (`requireAuth`), sehingga pengguna tidak bisa mengakses fitur peran lain hanya dengan mengubah tampilan di sisi klien.
7. **Perlindungan XSS**: Seluruh teks yang berasal dari pengguna di-*escape* sebelum dirender ke halaman.
8. **Perlindungan Berkas Unggahan**: Folder `uploads/` dilindungi berkas `.htaccess` yang mematikan parser engine PHP dan melarang eksekusi skrip berbahaya. Isi berkas foto juga diperiksa sebagai gambar (`getimagesize`) dan nama berkas dibersihkan.
9. **Verifikasi Pendaftaran oleh Owner**: Akun penghuni baru berstatus *menunggu* dan tidak bisa dipakai login sampai disetujui Owner.

---

## 🔑 Kredensial Akun Contoh

Seluruh akun berikut menggunakan kata sandi awal: **`safehome123`**

| Peran | ID Pengguna | Nama Pengguna | Blok / Shift / Jabatan |
|---|---|---|---|
| **Penghuni** | `C-12` | Bu Nadhif | Blok C No. 12 |
| **Penghuni** | `A-01` | Pak Bambang | Blok A No. 01 |
| **Penghuni** | `D-8` | Ibu Ratna Dewi | Blok D No. 08 |
| **Satpam** | `SAT-02` | Darmawan | Shift Siang (Pos Utama) |
| **Satpam** | `SAT-01` | Yusuf Supriyadi | Shift Pagi (Pos Utama) |
| **Satpam** | `SAT-03` | Slamet Riyadi | Shift Malam (Pos Barat) |
| **Owner** | `OWN-01` | Hendra Kusuma | Ketua Paguyuban / Owner |
| **Direktur** | `DIR-01` | Rina Anggraini | Direktur Pengelola Kawasan |

> ⚠️ Kata sandi ini hanya untuk pengembangan dan pengujian lokal. Ganti kata sandi semua akun sebelum aplikasi didemokan di jaringan lain atau dikumpulkan.
>
> Akun yang jenis kelaminnya belum diisi akan disapa tanpa sebutan *Mas/Mbak*. Isi lewat menu **Profil Saya** (oleh pemilik akun) atau **Edit Pengguna** (oleh Owner).

---

## 🚀 Cara Menjalankan

1. Nyalakan service **Apache** dan **MySQL** di XAMPP Control Panel.
2. Letakkan folder proyek di `C:\xampp\htdocs\SafeHome`.
3. Buka **phpMyAdmin** (`http://localhost/phpmyadmin/`) dan buat database `safehome`.
4. Impor [`database/schema.sql`](database/schema.sql) lalu [`database/seed.sql`](database/seed.sql) ke database `safehome`.
5. Periksa pengaturan koneksi database (host, nama database, username, password) di `api/config.php`. Bawaan XAMPP biasanya `localhost`, user `root`, tanpa password.
6. Buka aplikasi di peramban: **[http://localhost/SafeHome/](http://localhost/SafeHome/)**. Gunakan satu alamat yang konsisten (`localhost`, bukan campuran dengan `127.0.0.1`) agar cookie sesi dan token CSRF tidak terputus.

### Memperbarui Database yang Sudah Berjalan

Jika database `safehome` dibuat sebelum fitur jenis kelamin ditambahkan, jalankan perintah berikut di tab **SQL** phpMyAdmin (cukup sekali):

```sql
ALTER TABLE pengguna
  ADD COLUMN jenis_kelamin ENUM('L','P') NULL AFTER nama;
```

Setelah itu, isi jenis kelamin akun lama melalui menu **Edit Pengguna** (Owner) atau **Profil Saya** (pemilik akun). Database `safehome_demo` dari versi sebelumnya sudah tidak dipakai dan boleh dihapus.

---

## 🧭 Alur Pengujian Singkat

1. **Pendaftaran warga**: buka halaman login, pilih *Belum punya akun?*, isi form lengkap termasuk jenis kelamin, lalu kirim. Catat ID login yang tampil.
2. **Verifikasi Owner**: masuk sebagai Owner (`OWN-01`), buka **Kelola Pengguna → Pendaftaran**, lalu setujui akun baru tersebut.
3. **Sapaan personal**: masuk sebagai warga yang baru disetujui dan periksa sapaan di beranda (*Mas* untuk laki-laki, *Mbak* untuk perempuan).
4. **Tombol mata**: pada layar login, klik ikon mata di kolom kata sandi untuk menampilkan dan menyembunyikan isinya.
5. **Lapor dan tindak lanjut**: kirim laporan sebagai penghuni, lalu masuk sebagai Satpam untuk menerima, mengeskalasi, atau menyelesaikannya.
6. **Kontrol akses**: saat login sebagai penghuni, coba akses endpoint milik Owner (misalnya `api/pengguna.php?action=list`) dan pastikan ditolak.
7. **Rate-limit**: coba login dengan kata sandi salah berulang kali dan pastikan percobaan dibatasi.