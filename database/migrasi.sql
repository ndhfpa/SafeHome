-- ============================================================
-- SafeHome - Perumnas Pesona Cirebon Regency
-- Skrip Migrasi Penambahan Kolom jenis_kelamin
-- ============================================================

USE `safehome`;

-- 1. Tambah kolom jenis_kelamin ke tabel pengguna
ALTER TABLE `pengguna` 
ADD COLUMN `jenis_kelamin` ENUM('L', 'P') NULL AFTER `nama`;

-- 2. Perbarui jenis kelamin akun-akun awal
UPDATE `pengguna` SET `jenis_kelamin` = 'P' WHERE `id_login` = 'C-12';   -- Bu Nadhif
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'A-01';  -- Bambang Wijaya (Pak Bambang)
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'A-3';   -- Andi Prasetyo
UPDATE `pengguna` SET `jenis_kelamin` = 'P' WHERE `id_login` = 'D-8';   -- Siti Aminah (Ibu Ratna Dewi)
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'E-21';  -- Joko Santoso
UPDATE `pengguna` SET `jenis_kelamin` = 'P' WHERE `id_login` = 'B-5';   -- Dewi Lestari
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'F-7';   -- Agus Setiawan
UPDATE `pengguna` SET `jenis_kelamin` = 'P' WHERE `id_login` = 'B-14';  -- Sri Wahyuni (Ibu Maya Lestari)
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'SAT-01'; -- Yusuf
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'SAT-02'; -- Darmawan
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'SAT-03'; -- Slamet
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'SAT-04'; -- Rudi
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'SAT-10'; -- Agus Prasetyo
UPDATE `pengguna` SET `jenis_kelamin` = 'L' WHERE `id_login` = 'OWN-01'; -- Hendra Kusuma
UPDATE `pengguna` SET `jenis_kelamin` = 'P' WHERE `id_login` = 'DIR-01'; -- Rina Anggraini

