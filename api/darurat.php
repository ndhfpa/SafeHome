<?php
/**
 * SafeHome - Endpoint Sinyal Darurat (Panic Button)
 * api/darurat.php?action=send|list|resolve
 */

require_once __DIR__ . '/config.php';

$user = requireAuth();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'send' : 'list');
$db = getDB();

switch ($action) {
    case 'send':
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $type  = trim($input['type'] ?? $input['jenis'] ?? 'Kejahatan');
        $block = strtoupper(trim($input['block'] ?? $input['blok'] ?? ($user['blok'] ?: 'C')));
        $loc   = trim($input['location'] ?? $input['lokasi'] ?? '');

        if ($loc === '') {
            $loc = 'Blok ' . $block . (!empty($user['no_rumah']) ? ' No. ' . $user['no_rumah'] : '');
        }

        // Generate Kode Darurat EMG-YYMMDD-NN
        $prefix = 'EMG-' . date('ymd') . '-';
        $stmtSeq = $db->prepare('SELECT COUNT(*) AS total FROM sinyal_darurat WHERE kode LIKE :pref');
        $stmtSeq->execute(['pref' => $prefix . '%']);
        $seq = (int)$stmtSeq->fetch()['total'] + 1;
        $kodeDarurat = $prefix . str_pad($seq, 2, '0', STR_PAD_LEFT);

        $stmt = $db->prepare('
            INSERT INTO sinyal_darurat (kode, pelapor, jenis, blok, lokasi, waktu, status, aktif)
            VALUES (:kode, :pelapor, :jenis, :blok, :lokasi, NOW(), "Darurat", 1)
        ');
        $stmt->execute([
            'kode'    => $kodeDarurat,
            'pelapor' => $user['id_login'],
            'jenis'   => $type,
            'blok'    => $block,
            'lokasi'  => $loc,
        ]);

        // Buat Notifikasi Darurat Seketika untuk Satpam
        $notifSatpam = $db->prepare('
            INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu)
            VALUES ("satpam", "SINYAL DARURAT DIAKTIFKAN", :pesan, :kode, 0, NOW())
        ');
        $notifSatpam->execute([
            'pesan' => 'Peringatan Darurat: ' . $type . ' di ' . $loc . ' oleh ' . $user['nama'] . ' (' . $user['id_login'] . ')!',
            'kode'  => $kodeDarurat,
        ]);

        // Buat Notifikasi Darurat Seketika untuk Owner
        $notifOwner = $db->prepare('
            INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu)
            VALUES ("owner", "SINYAL DARURAT WARGA", :pesan, :kode, 0, NOW())
        ');
        $notifOwner->execute([
            'pesan' => 'Sinyal darurat ' . $type . ' berbunyi di ' . $loc . '!',
            'kode'  => $kodeDarurat,
        ]);

        jsonSuccess([
            'id'          => $kodeDarurat,
            'kode'        => $kodeDarurat,
            'type'        => $type,
            'block'       => $block,
            'location'    => $loc,
            'reporterId'  => $user['id_login'],
            'status'      => 'Darurat',
            'time'        => date('H.i'),
        ], 'Sinyal darurat berhasil dikirim! Satpam sedang menuju lokasi.');
        break;

    case 'list':
        $stmt = $db->prepare('
            SELECT s.*, p.nama AS reporter_name, p.no_hp AS reporter_phone 
            FROM sinyal_darurat s 
            LEFT JOIN pengguna p ON s.pelapor = p.id_login 
            WHERE s.aktif = 1 
            ORDER BY s.waktu DESC
        ');
        $stmt->execute();
        $rows = $stmt->fetchAll();

        $alerts = [];
        foreach ($rows as $r) {
            $dt = strtotime($r['waktu']);
            $alerts[] = [
                'id'            => $r['kode'],
                'type'          => $r['jenis'],
                'reporterId'    => $r['pelapor'],
                'reporterName'  => $r['reporter_name'] ?: $r['pelapor'],
                'reporterPhone' => $r['reporter_phone'] ?? '',
                'location'      => $r['lokasi'],
                'block'         => $r['blok'],
                'time'          => date('H.i', $dt),
                'fullTime'      => date('d M Y, H.i', $dt),
                'status'        => $r['status'],
                'active'        => (bool)$r['aktif'],
            ];
        }

        jsonSuccess($alerts);
        break;

    case 'resolve':
        verifyCsrfToken();
        if (!in_array($user['peran'], ['satpam', 'owner'], true)) {
            jsonError('Hanya petugas keamanan atau Owner yang dapat menyelesaikan sinyal darurat.', 403);
        }

        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $kode = trim($input['kode'] ?? $input['id'] ?? '');
        if ($kode === '') jsonError('Kode darurat wajib disertakan.', 400);

        $up = $db->prepare('UPDATE sinyal_darurat SET status = "Selesai", aktif = 0, ditangani_oleh = :petugas WHERE kode = :kode');
        $up->execute([
            'petugas' => $user['id_login'],
            'kode'    => $kode,
        ]);

        jsonSuccess(['kode' => $kode, 'status' => 'Selesai'], 'Sinyal darurat telah dinonaktifkan.');
        break;

    default:
        jsonError('Aksi darurat tidak valid.', 404);
}

