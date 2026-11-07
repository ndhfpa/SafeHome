-- ============================================================
-- SafeHome - Perumnas Pesona Cirebon Regency
-- Data Awal / Seed Database (safehome & safehome_demo)
-- ============================================================

-- Kosongkan tabel (urutan aman)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `login_attempts`;
TRUNCATE TABLE `notifikasi`;
TRUNCATE TABLE `patroli`;
TRUNCATE TABLE `sinyal_darurat`;
TRUNCATE TABLE `log_status`;
TRUNCATE TABLE `laporan`;
TRUNCATE TABLE `pengguna`;
SET FOREIGN_KEY_CHECKS = 1;

-- Password hash untuk "safehome123"
-- $2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.

-- 1. SEED PENGGUNA
INSERT INTO `pengguna` 
(`id_login`, `nama`, `jenis_kelamin`, `peran`, `password_hash`, `no_hp`, `email`, `foto`, `blok`, `no_rumah`, `shift`, `shift_jam`, `pos_jaga`, `jabatan`, `status_akun`, `aktif`)
VALUES
-- Penghuni Aktif
('C-12', 'Bu Nadhif', 'P', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08123456789', 'nadhif@email.com', '', 'C', '12', '', '', '', '', 'aktif', 1),
('A-01', 'Bambang Wijaya', 'L', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08129876543', 'bambang@email.com', '', 'A', '01', '', '', '', '', 'aktif', 1),
('A-3', 'Andi Prasetyo', 'L', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08132234556', 'andi@email.com', '', 'A', '3', '', '', '', '', 'aktif', 1),
('D-8', 'Siti Aminah', 'P', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08189988776', 'siti@email.com', '', 'D', '8', '', '', '', '', 'aktif', 1),
('E-21', 'Joko Santoso', 'L', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08571122334', 'joko@email.com', '', 'E', '21', '', '', '', '', 'aktif', 1),
('B-5', 'Dewi Lestari', 'P', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08785544332', 'dewi@email.com', '', 'B', '5', '', '', '', '', 'aktif', 1),

-- Pendaftaran Penghuni Baru Menunggu Verifikasi
('F-7', 'Agus Setiawan', 'L', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08123001001', 'agus.s@email.com', '', 'F', '7', '', '', '', '', 'menunggu', 1),
('B-14', 'Sri Wahyuni', 'P', 'penghuni', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08129002002', 'sriwahyuni@email.com', '', 'B', '14', '', '', '', '', 'menunggu', 1),

-- Petugas Satpam
('SAT-01', 'Yusuf', 'L', 'satpam', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08127788990', '', '', '', '', 'Pagi', '06.00-14.00', 'Pos Barat', '', 'aktif', 1),
('SAT-02', 'Darmawan', 'L', 'satpam', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08214455667', '', '', '', '', 'Siang', '14.00-22.00', 'Pos Gerbang Utama', '', 'aktif', 1),
('SAT-03', 'Slamet', 'L', 'satpam', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08563322114', '', '', '', '', 'Malam', '22.00-06.00', 'Patroli Keliling', '', 'aktif', 1),
('SAT-04', 'Rudi', 'L', 'satpam', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08119900112', '', '', '', '', 'Cadangan', '', 'Cadangan', '', 'aktif', 1),
('SAT-10', 'Agus Prasetyo', 'L', 'satpam', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08138899001', '', '', '', '', 'Pagi', '06.00-14.00', 'Pos Gerbang Barat', '', 'aktif', 1),

-- Owner Perumnas
('OWN-01', 'Hendra Kusuma', 'L', 'owner', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08115566778', 'hendra@perumnas.id', '', '', '', '', '', '', 'Owner Perumnas', 'aktif', 1),

-- Direktur
('DIR-01', 'Rina Anggraini', 'P', 'direktur', '$2y$10$l8k7mkL6Nawq1htGNjwMNusi03VBGxo.Q2QTzTYPjzPhE417SbJ1.', '08119988776', 'rina@perumnas.id', '', '', '', '', '', '', 'Direktur Operasional', 'aktif', 1);

-- 2. SEED LAPORAN KEJADIAN (Periode 1-16 Oktober 2026)
INSERT INTO `laporan`
(`kode`, `pelapor`, `kategori`, `blok`, `lokasi`, `waktu_kejadian`, `deskripsi`, `foto_bukti`, `urgensi`, `status`, `petugas`, `catatan_penanganan`, `catatan_eskalasi`, `waktu_selesai`)
VALUES
('LP-261016-010', 'C-12', 'Orang mencurigakan', 'D', 'Blok D, depan No. 8', '2026-10-16 14:31:00', 'Seorang pria berdiri lama di depan rumah kosong dan mengamati pagar belakang.', '[\"https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80\"]', 'Sedang', 'Baru', 'SAT-02', NULL, NULL, NULL),

('LP-261016-009', 'C-12', 'Gangguan ketertiban', 'C', 'Blok C No. 5 depan tikungan', '2026-10-16 14:05:00', 'Ada mobil sedan putih parkir di tengah tikungan sehingga ambulans/mobil warga tidak bisa lewat.', '[\"https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80\"]', 'Rendah', 'Baru', 'SAT-02', NULL, NULL, NULL),

('LP-261016-007', 'C-12', 'Orang mencurigakan', 'D', 'Blok D, depan No. 8', '2026-10-16 14:02:00', 'Dua orang tidak dikenal berhenti di depan rumah kosong dan memotret rumah-rumah di sekitarnya.', '[\"https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80\"]', 'Sedang', 'Selesai', 'SAT-02', 'Keduanya kurir paket yang salah alamat dan sudah meninggalkan lokasi.', NULL, '2026-10-16 14:30:00'),

('LP-261016-008', 'E-21', 'Gangguan ketertiban', 'E', 'Blok E Lapangan Voli', '2026-10-16 13:20:00', 'Sekelompok remaja luar perumahan nongkrong dan menyalakan petasan.', '[]', 'Sedang', 'Selesai', 'SAT-01', 'Petugas memberi teguran dan kelompok membubarkan diri secara tertib.', NULL, '2026-10-16 13:35:00'),

('LP-261015-011', 'E-21', 'Pencurian', 'E', 'Blok E No. 14', '2026-10-15 22:40:00', 'Pembobolan gembok pagar rumah kosong. Pelaku melarikan diri saat diteriaki warga.', '[\"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80\"]', 'Tinggi', 'Eskalasi', 'SAT-03', NULL, 'Kejadian pencurian terindikasi sindikat luar, dieskalasi ke Owner Perumnas.', NULL),

('LP-261014-012', 'C-12', 'Lainnya', 'C', 'Blok C jalur utama No. 10', '2026-10-14 19:10:00', 'Lampu PJU padam di 3 tiang berturut-turut, area jalan sangat gelap rawan kecelakaan.', '[]', 'Rendah', 'Diproses', 'SAT-02', 'Petugas berkoordinasi, menunggu teknisi PLN/pengelola esok hari', NULL, NULL),

('LP-261009-003', 'C-12', 'Pencurian', 'C', 'Blok C Pos 2', '2026-10-09 22:40:00', 'Helm bogo hitam hilang saat ditinggal belanja di minimarket depan.', '[]', 'Rendah', 'Selesai', 'SAT-03', 'Cek rekaman CCTV, tertukar oleh warga Blok B dan sudah dikembalikan.', NULL, '2026-10-09 23:10:00'),

('LP-261003-006', 'C-12', 'Gangguan ketertiban', 'C', 'Blok C No. 2', '2026-10-03 23:50:00', 'Suara speaker sound system sangat keras mengganggu istirahat tetangga.', '[]', 'Rendah', 'Selesai', 'SAT-03', 'Warga ditegur secara santun dan volume segera dimatikan.', NULL, '2026-10-04 00:12:00'),

-- Data Tambahan Kejadian Minggu 1 & 2 Oktober 2026 untuk Rekap Direktur (Total 24 kejadian)
('LP-261001-001', 'A-01', 'Lainnya', 'A', 'Blok A No. 3', '2026-10-01 08:10:00', 'Pohon dahan patah menghalangi gerbang warga.', '[]', 'Rendah', 'Selesai', 'SAT-01', 'Dahan dipotong dan dibersihkan oleh petugas.', NULL, '2026-10-01 08:35:00'),
('LP-261002-002', 'B-5', 'Gangguan ketertiban', 'B', 'Blok B dekat pos', '2026-10-02 10:15:00', 'Kendaraan luar parkir sembarangan.', '[]', 'Rendah', 'Selesai', 'SAT-01', 'Ditegur dan dipindahkan ke area parkir tamu.', NULL, '2026-10-02 10:30:00'),
('LP-261004-004', 'D-8', 'Orang mencurigakan', 'D', 'Blok D No. 12', '2026-10-04 16:20:00', 'Sales keliling masuk tanpa izin pos.', '[]', 'Rendah', 'Selesai', 'SAT-02', 'Diantar keluar perumahan dengan sopan.', NULL, '2026-10-04 16:40:00'),
('LP-261005-005', 'A-3', 'Lainnya', 'A', 'Blok A jalur pipa', '2026-10-05 11:00:00', 'Pipa air bocor membasahi jalan.', '[]', 'Sedang', 'Selesai', 'SAT-02', 'Dilaporkan ke pengelola PDAM dan ditutup sementara.', NULL, '2026-10-05 11:45:00'),
('LP-261006-006', 'D-8', 'Orang mencurigakan', 'D', 'Blok D taman', '2026-10-06 20:30:00', 'Pengendara motor mondar-mandir tanpa plat nomor.', '[]', 'Sedang', 'Selesai', 'SAT-03', 'Patroli mendekati, pengendara meninggalkan area.', NULL, '2026-10-06 20:50:00'),
('LP-261007-007', 'E-21', 'Pencurian', 'E', 'Blok E No. 2', '2026-10-07 03:15:00', 'Spion motor hilang di teras rumah.', '[]', 'Sedang', 'Selesai', 'SAT-03', 'Pencatatan laporan dan koordinasi CCTV pos.', NULL, '2026-10-07 04:00:00'),
('LP-261008-008', 'B-5', 'Kecelakaan', 'B', 'Blok B persimpangan', '2026-10-08 09:40:00', 'Anak bersepeda terserempet motor kurir pelan.', '[]', 'Sedang', 'Selesai', 'SAT-01', 'Pertolongan pertama P3K, kedua pihak berdamai.', NULL, '2026-10-08 10:05:00'),
('LP-261010-010', 'A-01', 'Lainnya', 'A', 'Blok A No. 15', '2026-10-10 14:00:00', 'Kucing terjepit di selokan tertutup.', '[]', 'Rendah', 'Selesai', 'SAT-02', 'Penutup selokan dibuka dan kucing diselamatkan.', NULL, '2026-10-10 14:20:00'),
('LP-261011-011', 'D-8', 'Orang mencurigakan', 'D', 'Blok D No. 20', '2026-10-11 19:10:00', 'Pria tak dikenal mengetuk rumah-rumah malam hari.', '[]', 'Sedang', 'Selesai', 'SAT-02', 'Pemeriksaan identitas, ternyata mencari saudaranya.', NULL, '2026-10-11 19:25:00'),
('LP-261011-012', 'C-12', 'Gangguan ketertiban', 'C', 'Blok C dekat fasum', '2026-10-11 21:00:00', 'Anak-anak bermain bola menabrak pagar warga.', '[]', 'Rendah', 'Selesai', 'SAT-03', 'Diberi edukasi untuk bermain di lapangan.', NULL, '2026-10-11 21:15:00'),
('LP-261012-013', 'A-3', 'Lainnya', 'A', 'Blok A No. 8', '2026-10-12 18:20:00', 'Lampu jalan padam di Blok A.', '[]', 'Rendah', 'Selesai', 'SAT-03', 'Bohlam diganti oleh teknisi satpam.', NULL, '2026-10-12 18:50:00'),
('LP-261013-014', 'D-8', 'Orang mencurigakan', 'D', 'Blok D No. 5', '2026-10-13 13:40:00', 'Dua orang asing mengintip pagar rumah.', '[]', 'Sedang', 'Selesai', 'SAT-01', 'Satpam menghampiri dan memeriksa identitas.', NULL, '2026-10-13 13:58:00'),
('LP-261013-015', 'E-21', 'Gangguan ketertiban', 'E', 'Blok E No. 9', '2026-10-13 15:30:00', 'Pembakaran sampah menimbulkan asap pekat.', '[]', 'Rendah', 'Selesai', 'SAT-02', 'Api dipadamkan dan warga diingatkan.', NULL, '2026-10-13 15:45:00'),
('LP-261014-016', 'B-5', 'Lainnya', 'B', 'Blok B No. 1', '2026-10-14 07:30:00', 'Gerbang samping belum dibuka petugas.', '[]', 'Rendah', 'Selesai', 'SAT-01', 'Kunci gerbang dibuka tepat waktu.', NULL, '2026-10-14 07:40:00'),
('LP-261015-017', 'D-8', 'Orang mencurigakan', 'D', 'Blok D No. 17', '2026-10-15 16:15:00', 'Orang tak dikenal memotret garasi warga.', '[]', 'Sedang', 'Selesai', 'SAT-02', 'Ditegur dan diminta menghapus foto.', NULL, '2026-10-15 16:32:00'),
('LP-261016-018', 'F-7', 'Lainnya', 'F', 'Blok F No. 2', '2026-10-16 08:00:00', 'Hewan liar masuk pekarangan warga.', '[]', 'Rendah', 'Selesai', 'SAT-01', 'Hewan dievakuasi keluar perumahan.', NULL, '2026-10-16 08:25:00');

-- 3. SEED LOG STATUS (Timeline kejadian)
INSERT INTO `log_status` (`kode_laporan`, `status_sebelumnya`, `status_baru`, `diubah_oleh`, `catatan`, `waktu`)
VALUES
('LP-261016-010', NULL, 'Baru', 'C-12', 'Laporan masuk dari penghuni Blok C No. 12', '2026-10-16 14:31:00'),

('LP-261016-009', NULL, 'Baru', 'C-12', 'Laporan tercatat di sistem', '2026-10-16 14:05:00'),

('LP-261016-007', NULL, 'Baru', 'C-12', 'Laporan masuk', '2026-10-16 14:02:00'),
('LP-261016-007', 'Baru', 'Diterima', 'SAT-02', 'Petugas mengonfirmasi penerimaan tugas', '2026-10-16 14:05:00'),
('LP-261016-007', 'Diterima', 'Diproses', 'SAT-02', 'Petugas berangkat ke Blok D', '2026-10-16 14:08:00'),
('LP-261016-007', 'Diproses', 'Selesai', 'SAT-02', 'Keduanya kurir paket yang salah alamat dan sudah meninggalkan lokasi.', '2026-10-16 14:30:00'),

('LP-261016-008', NULL, 'Baru', 'E-21', 'Laporan masuk', '2026-10-16 13:20:00'),
('LP-261016-008', 'Baru', 'Selesai', 'SAT-01', 'Petugas memberi teguran dan kelompok membubarkan diri secara tertib.', '2026-10-16 13:35:00'),

('LP-261015-011', NULL, 'Baru', 'E-21', 'Laporan dari warga Blok E', '2026-10-15 22:40:00'),
('LP-261015-011', 'Baru', 'Eskalasi', 'SAT-03', 'Kejadian pencurian terindikasi sindikat luar, dieskalasi ke Owner Perumnas.', '2026-10-15 22:50:00'),

('LP-261014-012', NULL, 'Baru', 'C-12', 'Laporan masuk', '2026-10-14 19:10:00'),
('LP-261014-012', 'Baru', 'Diproses', 'SAT-02', 'Petugas berkoordinasi, menunggu teknisi PLN/pengelola esok hari', '2026-10-14 19:30:00'),

('LP-261009-003', NULL, 'Baru', 'C-12', 'Laporan masuk', '2026-10-09 22:40:00'),
('LP-261009-003', 'Baru', 'Selesai', 'SAT-03', 'Cek rekaman CCTV, tertukar oleh warga Blok B dan sudah dikembalikan.', '2026-10-09 23:10:00'),

('LP-261003-006', NULL, 'Baru', 'C-12', 'Laporan masuk', '2026-10-03 23:50:00'),
('LP-261003-006', 'Baru', 'Selesai', 'SAT-03', 'Warga ditegur secara santun dan volume segera dimatikan.', '2026-10-04 00:12:00');

-- 4. SEED SINYAL DARURAT
INSERT INTO `sinyal_darurat` (`kode`, `pelapor`, `jenis`, `blok`, `lokasi`, `waktu`, `status`, `aktif`)
VALUES
('EMG-261016-01', 'C-12', 'Kejahatan', 'C', 'Blok C No. 12', '2026-10-16 14:36:00', 'Darurat', 1);

-- 5. SEED PATROLI CHECKPOINTS HARI INI
INSERT INTO `patroli` (`tanggal`, `id_pos`, `nama_pos`, `jam_rencana`, `jam_catat`, `status`, `id_petugas`, `keterangan`)
VALUES
(CURRENT_DATE(), 'PT-1', 'Gerbang Utama', '14.00', '14.02', 'Tercatat', 'SAT-02', 'Kondisi gerbang aman dan tertib'),
(CURRENT_DATE(), 'PT-2', 'Blok A', '14.12', '14.14', 'Tercatat', 'SAT-02', 'Situasi kondusif'),
(CURRENT_DATE(), 'PT-3', 'Blok B', '14.25', '14.27', 'Tercatat', 'SAT-02', 'Penerangan cukup, aman'),
(CURRENT_DATE(), 'PT-4', 'Blok C', '14.38', NULL, 'Belum', NULL, NULL),
(CURRENT_DATE(), 'PT-5', 'Blok D', '14.50', NULL, 'Belum', NULL, NULL),
(CURRENT_DATE(), 'PT-6', 'Blok E dan F', '15.03', NULL, 'Belum', NULL, NULL),
(CURRENT_DATE(), 'PT-7', 'Taman dan fasilitas umum', '15.15', NULL, 'Belum', NULL, NULL),
(CURRENT_DATE(), 'PT-8', 'Pos belakang', '15.25', NULL, 'Belum', NULL, NULL);

-- 6. SEED NOTIFIKASI
INSERT INTO `notifikasi` (`untuk_peran`, `untuk_pengguna`, `judul`, `pesan`, `kode_laporan`, `dibaca`, `waktu`)
VALUES
('owner', NULL, 'Laporan Dieskalasi', 'Laporan LP-261015-011 (Pencurian Blok E No. 14) dieskalasi oleh Satpam ke Owner.', 'LP-261015-011', 0, '2026-10-15 22:50:00'),
('satpam', NULL, 'Sinyal Darurat Aktif', 'Peringatan darurat: Kejahatan di Blok C No. 12 dari Bu Nadhif.', NULL, 0, '2026-10-16 14:36:00'),
('satpam', NULL, 'Laporan Baru Masuk', 'Laporan LP-261016-010 (Orang mencurigakan) di Blok D.', 'LP-261016-010', 0, '2026-10-16 14:31:00');

