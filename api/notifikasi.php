<?php
/**
 * SafeHome - Endpoint Notifikasi
 * api/notifikasi.php?action=list|unread_count|mark_read
 */

require_once __DIR__ . '/config.php';

$user = requireAuth();
$action = $_GET['action'] ?? 'list';
$db = getDB();

switch ($action) {
    case 'list':
        $stmt = $db->prepare('
            SELECT * FROM notifikasi 
            WHERE untuk_peran = :peran 
               OR untuk_pengguna = :id_login 
               OR (untuk_peran IS NULL AND untuk_pengguna IS NULL)
            ORDER BY waktu DESC, id DESC 
            LIMIT 50
        ');
        $stmt->execute([
            'peran'    => $user['peran'],
            'id_login' => $user['id_login'],
        ]);
        $rows = $stmt->fetchAll();

        $notifs = [];
        $unreadCount = 0;
        foreach ($rows as $r) {
            $isUnread = (int)$r['dibaca'] === 0;
            if ($isUnread) $unreadCount++;
            $dt = strtotime($r['waktu']);
            $notifs[] = [
                'id'          => $r['id'],
                'title'       => $r['judul'],
                'message'     => $r['pesan'],
                'reportCode'  => $r['kode_laporan'],
                'isRead'      => !$isUnread,
                'time'        => date('d M H.i', $dt),
                'fullTime'    => date('d M Y, H.i', $dt),
            ];
        }

        jsonSuccess([
            'unreadCount'   => $unreadCount,
            'notifications' => $notifs,
        ]);
        break;

    case 'unread_count':
        $stmt = $db->prepare('
            SELECT COUNT(*) AS total FROM notifikasi 
            WHERE dibaca = 0 
              AND (untuk_peran = :peran OR untuk_pengguna = :id_login OR (untuk_peran IS NULL AND untuk_pengguna IS NULL))
        ');
        $stmt->execute([
            'peran'    => $user['peran'],
            'id_login' => $user['id_login'],
        ]);
        $count = (int)$stmt->fetch()['total'];

        // Cek juga sinyal darurat aktif jika peran satpam atau owner
        $activeEmergency = 0;
        if (in_array($user['peran'], ['satpam', 'owner'], true)) {
            $emgStmt = $db->query('SELECT COUNT(*) AS total FROM sinyal_darurat WHERE aktif = 1');
            $activeEmergency = (int)$emgStmt->fetch()['total'];
        }

        jsonSuccess([
            'unreadCount'     => $count,
            'activeEmergency' => $activeEmergency,
        ]);
        break;

    case 'mark_read':
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $notifId = trim($input['id'] ?? '');

        if ($notifId !== '' && $notifId !== 'all') {
            $up = $db->prepare('UPDATE notifikasi SET dibaca = 1 WHERE id = :id');
            $up->execute(['id' => $notifId]);
        } else {
            // Tandai semua dibaca untuk peran/pengguna ini
            $up = $db->prepare('
                UPDATE notifikasi 
                SET dibaca = 1 
                WHERE untuk_peran = :peran OR untuk_pengguna = :id_login
            ');
            $up->execute([
                'peran'    => $user['peran'],
                'id_login' => $user['id_login'],
            ]);
        }

        jsonSuccess([], 'Notifikasi telah ditandai sudah dibaca.');
        break;

    default:
        jsonError('Aksi notifikasi tidak valid.', 404);
}

