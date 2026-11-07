-- ============================================================
-- SafeHome - Perumnas Pesona Cirebon Regency
-- Skema Database MySQL (safehome)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `safehome` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `safehome`;

-- 1. Tabel Pengguna (Penghuni, Satpam, Owner, Direktur)
CREATE TABLE IF NOT EXISTS `pengguna` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_login` VARCHAR(50) NOT NULL UNIQUE,
  `nama` VARCHAR(100) NOT NULL,
  `jenis_kelamin` ENUM('L', 'P') NULL,
  `peran` ENUM('penghuni', 'satpam', 'owner', 'direktur') NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `no_hp` VARCHAR(25) DEFAULT '',
  `email` VARCHAR(100) DEFAULT '',
  `foto` VARCHAR(255) DEFAULT '',
  `blok` VARCHAR(10) DEFAULT '',
  `no_rumah` VARCHAR(20) DEFAULT '',
  `shift` VARCHAR(20) DEFAULT '',
  `shift_jam` VARCHAR(30) DEFAULT '',
  `pos_jaga` VARCHAR(100) DEFAULT '',
  `jabatan` VARCHAR(100) DEFAULT '',
  `status_akun` ENUM('aktif', 'menunggu', 'ditolak', 'nonaktif') DEFAULT 'aktif',
  `alasan_tolak` TEXT DEFAULT NULL,
  `aktif` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_peran` (`peran`),
  INDEX `idx_status_akun` (`status_akun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Laporan Kejadian
CREATE TABLE IF NOT EXISTS `laporan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode` VARCHAR(30) NOT NULL UNIQUE,
  `pelapor` VARCHAR(50) NOT NULL,
  `kategori` VARCHAR(50) NOT NULL,
  `blok` VARCHAR(10) NOT NULL,
  `lokasi` VARCHAR(255) NOT NULL,
  `waktu_kejadian` DATETIME NOT NULL,
  `deskripsi` TEXT NOT NULL,
  `foto_bukti` TEXT DEFAULT NULL,
  `urgensi` ENUM('Rendah', 'Sedang', 'Tinggi') DEFAULT 'Sedang',
  `status` ENUM('Baru', 'Diterima', 'Diproses', 'Selesai', 'Eskalasi') DEFAULT 'Baru',
  `petugas` VARCHAR(50) DEFAULT NULL,
  `catatan_penanganan` TEXT DEFAULT NULL,
  `catatan_eskalasi` TEXT DEFAULT NULL,
  `waktu_selesai` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_pelapor` (`pelapor`),
  INDEX `idx_status` (`status`),
  INDEX `idx_blok` (`blok`),
  INDEX `idx_waktu` (`waktu_kejadian`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabel Log Riwayat Status Laporan (Timeline)
CREATE TABLE IF NOT EXISTS `log_status` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_laporan` VARCHAR(30) NOT NULL,
  `status_sebelumnya` VARCHAR(30) DEFAULT NULL,
  `status_baru` VARCHAR(30) NOT NULL,
  `diubah_oleh` VARCHAR(50) NOT NULL,
  `catatan` TEXT DEFAULT NULL,
  `waktu` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_kode_laporan` (`kode_laporan`),
  INDEX `idx_waktu` (`waktu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tabel Sinyal Darurat (Panic Button)
CREATE TABLE IF NOT EXISTS `sinyal_darurat` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode` VARCHAR(30) NOT NULL UNIQUE,
  `pelapor` VARCHAR(50) NOT NULL,
  `jenis` VARCHAR(50) NOT NULL,
  `blok` VARCHAR(10) NOT NULL,
  `lokasi` VARCHAR(255) NOT NULL,
  `waktu` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('Darurat', 'Ditangani', 'Selesai') DEFAULT 'Darurat',
  `ditangani_oleh` VARCHAR(50) DEFAULT NULL,
  `aktif` TINYINT(1) DEFAULT 1,
  INDEX `idx_status_darurat` (`status`),
  INDEX `idx_aktif` (`aktif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tabel Catatan Pos Patroli Satpam
CREATE TABLE IF NOT EXISTS `patroli` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `tanggal` DATE NOT NULL,
  `id_pos` VARCHAR(20) NOT NULL,
  `nama_pos` VARCHAR(100) NOT NULL,
  `jam_rencana` VARCHAR(10) NOT NULL,
  `jam_catat` VARCHAR(10) DEFAULT NULL,
  `status` ENUM('Belum', 'Tercatat') DEFAULT 'Belum',
  `id_petugas` VARCHAR(50) DEFAULT NULL,
  `keterangan` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_tanggal` (`tanggal`),
  INDEX `idx_id_pos` (`id_pos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Notifikasi
CREATE TABLE IF NOT EXISTS `notifikasi` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `untuk_peran` VARCHAR(30) DEFAULT NULL,
  `untuk_pengguna` VARCHAR(50) DEFAULT NULL,
  `judul` VARCHAR(150) NOT NULL,
  `pesan` TEXT NOT NULL,
  `kode_laporan` VARCHAR(30) DEFAULT NULL,
  `dibaca` TINYINT(1) DEFAULT 0,
  `waktu` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_penerima` (`untuk_peran`, `untuk_pengguna`),
  INDEX `idx_dibaca` (`dibaca`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Tabel Percobaan Login (Rate Limiting: 5 kegagalan per menit)
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(45) NOT NULL,
  `login_id` VARCHAR(50) NOT NULL,
  `attempted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_rate_limit` (`ip_address`, `login_id`, `attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

