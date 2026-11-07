<?php
/**
 * SafeHome - Endpoint Jadwal & Catatan Patroli Satpam
 * api/patroli.php?action=checkpoints|record
 */

require_once __DIR__ . '/config.php';

$user = requireAuth();
$action = $_GET['action'] ?? 'checkpoints';
$db = getDB();

$today = date('Y-m-d');

// Inisialisasi Pos Default Hari Ini Jika Belum Tersedia
$checkInit = $db->prepare('SELECT COUNT(*) AS total FROM patroli WHERE tanggal = :tgl');
$checkInit->execute(['tgl' => $today]);
if ((int)$checkInit->fetch()['total'] === 0) {
    $defaultPoints = [
        ['PT-1', 'Gerbang Utama', '14.00'],
        ['PT-2', 'Blok A', '14.12'],
        ['PT-3', 'Blok B', '14.25'],
        ['PT-4', 'Blok C', '14.38'],
        ['PT-5', 'Blok D', '14.50'],
        ['PT-6', 'Blok E dan F', '15.03'],
        ['PT-7', 'Taman dan fasilitas umum', '15.15'],
        ['PT-8', 'Pos belakang', '15.25'],
    ];

    $ins = $db->prepare('
        INSERT INTO patroli (tanggal, id_pos, nama_pos, jam_rencana, jam_catat, status, id_petugas)
        VALUES (:tgl, :id, :nama, :rencana, NULL, "Belum", NULL)
    ');
    foreach ($defaultPoints as $dp) {
        $ins->execute([
            'tgl'     => $today,
            'id'      => $dp[0],
            'nama'    => $dp[1],
            'rencana' => $dp[2],
        ]);
    }
}

switch ($action) {
    case 'checkpoints':
        $stmt = $db->prepare('SELECT * FROM patroli WHERE tanggal = :tgl ORDER BY id_pos ASC');
        $stmt->execute(['tgl' => $today]);
        $rows = $stmt->fetchAll();

        $checkpoints = [];
        $recordedCount = 0;
        foreach ($rows as $r) {
            if ($r['status'] === 'Tercatat') $recordedCount++;
            $checkpoints[] = [
                'id'           => $r['id_pos'],
                'name'         => $r['nama_pos'],
                'plannedTime'  => $r['jam_rencana'],
                'recordedTime' => $r['jam_catat'],
                'status'       => $r['status'],
                'idPetugas'    => $r['id_petugas'],
            ];
        }

        jsonSuccess([
            'date'          => $today,
            'total'         => count($checkpoints),
            'recordedCount' => $recordedCount,
            'checkpoints'   => $checkpoints,
        ]);
        break;

    case 'record':
        verifyCsrfToken();
        if ($user['peran'] !== 'satpam') {
            jsonError('Hanya petugas keamanan yang dapat mencatat pos patroli.', 403);
        }

        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $posId = trim($input['id'] ?? $input['id_pos'] ?? '');
        if ($posId === '') jsonError('ID Pos patroli wajib disertakan.', 400);

        $nowTime = date('H.i');

        $up = $db->prepare('
            UPDATE patroli 
            SET status = "Tercatat", jam_catat = :jam, id_petugas = :petugas 
            WHERE tanggal = :tgl AND id_pos = :id_pos
        ');
        $up->execute([
            'jam'     => $nowTime,
            'petugas' => $user['id_login'],
            'tgl'     => $today,
            'id_pos'  => $posId,
        ]);

        jsonSuccess([
            'id'           => $posId,
            'recordedTime' => $nowTime,
            'status'       => 'Tercatat',
        ], 'Pos patroli ' . $posId . ' berhasil dicatat!');
        break;

    default:
        jsonError('Aksi patroli tidak valid.', 404);
}

