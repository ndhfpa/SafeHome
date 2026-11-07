<?php
/**
 * SafeHome - Endpoint Ekspor Laporan Periodik ke CSV
 * api/export.php?period=mingguan|bulanan|all
 */

require_once __DIR__ . '/config.php';

$user = requireAuth(['owner', 'direktur', 'satpam']);
$db = getDB();

$period = $_GET['period'] ?? 'all';
$filename = 'Laporan_Keamanan_SafeHome_' . date('Ymd_His') . '.csv';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

// Buka output stream
$output = fopen('php://output', 'w');

// UTF-8 BOM untuk Microsoft Excel
fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

// Judul Dokumen
fputcsv($output, ['PERUMNAS PESONA CIREBON REGENCY']);
fputcsv($output, ['REKAP LAPORAN KEJADIAN DAN PEMANTAUAN KEAMANAN LINGKUNGAN']);
fputcsv($output, ['Tanggal Unduh:', date('d F Y, H:i') . ' WIB']);
fputcsv($output, ['Diunduh oleh:', $user['nama'] . ' (' . strtoupper($user['peran']) . ')']);
fputcsv($output, []); // Baris kosong

// Header Kolom
fputcsv($output, [
    'No',
    'Kode Laporan',
    'Waktu Kejadian',
    'Blok',
    'Titik Lokasi',
    'Kategori Kejadian',
    'Deskripsi Insiden',
    'Tingkat Urgensi',
    'Nama Pelapor (Warga)',
    'ID Pelapor',
    'Petugas Satpam',
    'Status Penanganan',
    'Waktu Selesai',
    'Catatan Hasil Penanganan',
]);

// Query Data Laporan
$where = '';
$params = [];
if ($period === 'mingguan') {
    $where = 'WHERE l.waktu_kejadian >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
} elseif ($period === 'bulanan') {
    $where = 'WHERE l.waktu_kejadian >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
}

$sql = "
    SELECT l.*, 
           p_rep.nama AS reporter_name,
           p_pet.nama AS petugas_name
    FROM laporan l
    LEFT JOIN pengguna p_rep ON l.pelapor = p_rep.id_login
    LEFT JOIN pengguna p_pet ON l.petugas = p_pet.id_login
    $where
    ORDER BY l.waktu_kejadian DESC, l.id DESC
";
$stmt = $db->prepare($sql);
$stmt->execute($params);
$no = 1;

while ($row = $stmt->fetch()) {
    fputcsv($output, [
        $no++,
        $row['kode'],
        date('d/m/Y H:i', strtotime($row['waktu_kejadian'])),
        'Blok ' . $row['blok'],
        $row['lokasi'],
        $row['kategori'],
        $row['deskripsi'],
        $row['urgensi'],
        $row['reporter_name'] ?: $row['pelapor'],
        $row['pelapor'],
        $row['petugas_name'] ?: ($row['petugas'] ?: '-'),
        $row['status'],
        $row['waktu_selesai'] ? date('d/m/Y H:i', strtotime($row['waktu_selesai'])) : '-',
        $row['catatan_penanganan'] ?: ($row['catatan_eskalasi'] ?: '-'),
    ]);
}

fclose($output);
exit;
