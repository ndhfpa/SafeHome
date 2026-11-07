<?php
/**
 * SafeHome - Endpoint Manajemen Laporan Kejadian
 * api/laporan.php?action=list|detail|create|update_status|eskalasi|owner_arahan
 */

require_once __DIR__ . '/config.php';

$user = requireAuth();
$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'create' : 'list');
$db = getDB();

switch ($action) {
    case 'list':
        $block    = trim($_GET['block'] ?? '');
        $status   = trim($_GET['status'] ?? '');
        $category = trim($_GET['category'] ?? '');
        $search   = trim($_GET['search'] ?? '');

        $sql = '
            SELECT l.*, 
                   p_rep.nama AS reporter_name,
                   p_rep.no_hp AS reporter_phone,
                   p_pet.nama AS petugas_name
            FROM laporan l
            LEFT JOIN pengguna p_rep ON l.pelapor = p_rep.id_login
            LEFT JOIN pengguna p_pet ON l.petugas = p_pet.id_login
            WHERE 1=1
        ';
        $params = [];

        // Batasan peran: Penghuni hanya melihat laporannya sendiri
        if ($user['peran'] === 'penghuni') {
            $sql .= ' AND l.pelapor = :current_user';
            $params['current_user'] = $user['id_login'];
        }

        // Filter blok
        if ($block !== '' && $block !== 'Semua') {
            $sql .= ' AND l.blok = :blok';
            $params['blok'] = $block;
        }

        // Filter status
        if ($status !== '' && $status !== 'Semua') {
            if ($status === 'Aktif') {
                $sql .= ' AND l.status IN ("Baru", "Diterima", "Diproses", "Eskalasi")';
            } else {
                $sql .= ' AND l.status = :status';
                $params['status'] = $status;
            }
        }

        // Filter kategori
        if ($category !== '' && $category !== 'Semua') {
            $sql .= ' AND l.kategori = :kategori';
            $params['kategori'] = $category;
        }

        // Pencarian (kode, lokasi, deskripsi, pelapor)
        if ($search !== '') {
            $sql .= ' AND (l.kode LIKE :s1 OR l.lokasi LIKE :s2 OR l.deskripsi LIKE :s3 OR l.pelapor LIKE :s4)';
            $searchWild = '%' . $search . '%';
            $params['s1'] = $searchWild;
            $params['s2'] = $searchWild;
            $params['s3'] = $searchWild;
            $params['s4'] = $searchWild;
        }

        $sql .= ' ORDER BY l.waktu_kejadian DESC, l.id DESC';

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Format hasil agar selaras dengan kebutuhan front-end
        $reports = [];
        foreach ($rows as $row) {
            $reports[] = formatReportRow($row, $db);
        }

        jsonSuccess($reports);
        break;

    case 'detail':
        $kode = trim($_GET['id'] ?? $_GET['kode'] ?? '');
        if ($kode === '') {
            jsonError('Kode laporan wajib disertakan.', 400);
        }

        $sql = '
            SELECT l.*, 
                   p_rep.nama AS reporter_name,
                   p_rep.no_hp AS reporter_phone,
                   p_pet.nama AS petugas_name
            FROM laporan l
            LEFT JOIN pengguna p_rep ON l.pelapor = p_rep.id_login
            LEFT JOIN pengguna p_pet ON l.petugas = p_pet.id_login
            WHERE l.kode = :kode
            LIMIT 1
        ';
        $stmt = $db->prepare($sql);
        $stmt->execute(['kode' => $kode]);
        $row = $stmt->fetch();

        if (!$row) {
            jsonError('Laporan tidak ditemukan.', 404);
        }

        // Jika penghuni, pastikan milik sendiri
        if ($user['peran'] === 'penghuni' && $row['pelapor'] !== $user['id_login']) {
            jsonError('Anda tidak memiliki izin untuk melihat laporan ini.', 403);
        }

        $report = formatReportRow($row, $db, true);
        jsonSuccess($report);
        break;

    case 'create':
        verifyCsrfToken();
        $category = trim($_POST['category'] ?? $_POST['kategori'] ?? '');
        $block    = trim($_POST['block'] ?? $_POST['blok'] ?? '');
        $location = trim($_POST['location'] ?? $_POST['lokasi'] ?? '');
        $desc     = trim($_POST['description'] ?? $_POST['deskripsi'] ?? '');
        $urgency  = trim($_POST['urgency'] ?? $_POST['urgensi'] ?? 'Sedang');

        if ($category === '') {
            jsonError('Kategori kejadian wajib dipilih.', 400);
        }
        if ($block === '') {
            jsonError('Blok lokasi wajib dipilih.', 400);
        }
        if ($desc === '') {
            jsonError('Deskripsi kejadian wajib diisi.', 400);
        }

        // Format lokasi lengkap
        $lokasiLengkap = 'Blok ' . $block . ($location !== '' ? ', ' . $location : '');

        // Upload Foto Bukti (maksimal 2 MB, format JPG/PNG/WEBP)
        $photos = [];
        if (!empty($_FILES['foto_bukti']) && $_FILES['foto_bukti']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['foto_bukti'];
            $maxSize = 2 * 1024 * 1024; // 2 MB
            if ($file['size'] > $maxSize) {
                jsonError('Ukuran foto bukti maksimal 2 MB.', 400);
            }

            $allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowedExts, true)) {
                jsonError('Format foto harus berupa JPG, PNG, atau WEBP.', 400);
            }

            // Verifikasi MIME type asli
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = finfo_file($finfo, $file['tmp_name']);
            finfo_close($finfo);
            $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($mime, $allowedMimes, true)) {
                jsonError('Tipe berkas tidak valid, pastikan berupa gambar foto asli.', 400);
            }

            // Simpan berkas ke direktori uploads
            $uploadDir = __DIR__ . '/../uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $fileName = 'bukti_' . date('ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
            $destPath = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $destPath)) {
                $photos[] = 'uploads/' . $fileName;
            }
        } elseif (!empty($_POST['photo_url'])) {
            $photos[] = trim($_POST['photo_url']);
        }

        // Generate Kode Laporan LP-YYMMDD-NNN
        $prefix = 'LP-' . date('ymd') . '-';
        $stmtSeq = $db->prepare('SELECT COUNT(*) AS total FROM laporan WHERE kode LIKE :pref');
        $stmtSeq->execute(['pref' => $prefix . '%']);
        $seq = (int)$stmtSeq->fetch()['total'] + 1;
        $kodeLaporan = $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);

        // Pilih Satpam yang Sedang Bertugas (Shift Pagi/Siang/Malam)
        $hour = (int)date('H');
        $shiftName = 'Pagi';
        if ($hour >= 14 && $hour < 22) {
            $shiftName = 'Siang';
        } elseif ($hour >= 22 || $hour < 6) {
            $shiftName = 'Malam';
        }

        $stmtSatpam = $db->prepare('SELECT id_login FROM pengguna WHERE peran = "satpam" AND aktif = 1 AND shift = :shift LIMIT 1');
        $stmtSatpam->execute(['shift' => $shiftName]);
        $guard = $stmtSatpam->fetch();
        $assignedGuard = $guard ? $guard['id_login'] : 'SAT-02';

        // Simpan ke Tabel Laporan
        $stmtInsert = $db->prepare('
            INSERT INTO laporan 
            (kode, pelapor, kategori, blok, lokasi, waktu_kejadian, deskripsi, foto_bukti, urgensi, status, petugas)
            VALUES
            (:kode, :pelapor, :kategori, :blok, :lokasi, NOW(), :deskripsi, :foto_bukti, :urgensi, "Baru", :petugas)
        ');
        $stmtInsert->execute([
            'kode'        => $kodeLaporan,
            'pelapor'     => $user['id_login'],
            'kategori'    => $category,
            'blok'        => $block,
            'lokasi'      => $lokasiLengkap,
            'deskripsi'   => $desc,
            'foto_bukti'  => json_encode($photos),
            'urgensi'     => in_array($urgency, ['Rendah', 'Sedang', 'Tinggi'], true) ? $urgency : 'Sedang',
            'petugas'     => $assignedGuard,
        ]);

        // Simpan Catatan Pertama ke Log Status
        $stmtLog = $db->prepare('
            INSERT INTO log_status (kode_laporan, status_sebelumnya, status_baru, diubah_oleh, catatan, waktu)
            VALUES (:kode, NULL, "Baru", :oleh, :catatan, NOW())
        ');
        $descLog = 'Laporan masuk dari ' . ($user['nama'] ?? $user['id_login']) . ' (' . $lokasiLengkap . ')';
        $stmtLog->execute([
            'kode'    => $kodeLaporan,
            'oleh'    => $user['id_login'],
            'catatan' => $descLog,
        ]);

        // Buat Notifikasi untuk Petugas Satpam & Owner
        $notifSatpam = $db->prepare('
            INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu)
            VALUES ("satpam", "Laporan Baru Masuk", :pesan, :kode, 0, NOW())
        ');
        $notifSatpam->execute([
            'pesan' => 'Laporan ' . $kodeLaporan . ' (' . $category . ') di Blok ' . $block . '.',
            'kode'  => $kodeLaporan,
        ]);

        $notifOwner = $db->prepare('
            INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu)
            VALUES ("owner", "Laporan Baru Masuk", :pesan, :kode, 0, NOW())
        ');
        $notifOwner->execute([
            'pesan' => 'Penghuni ' . $user['id_login'] . ' melaporkan ' . $category . ' di Blok ' . $block . '.',
            'kode'  => $kodeLaporan,
        ]);

        // Ambil Data Laporan Baru yang telah dibuat
        $stmtNew = $db->prepare('
            SELECT l.*, p_rep.nama AS reporter_name, p_pet.nama AS petugas_name 
            FROM laporan l 
            LEFT JOIN pengguna p_rep ON l.pelapor = p_rep.id_login 
            LEFT JOIN pengguna p_pet ON l.petugas = p_pet.id_login 
            WHERE l.kode = :kode
        ');
        $stmtNew->execute(['kode' => $kodeLaporan]);
        $newRow = $stmtNew->fetch();

        jsonSuccess(formatReportRow($newRow, $db, true), 'Laporan ' . $kodeLaporan . ' berhasil dikirim!', 201);
        break;

    case 'update_status':
        verifyCsrfToken();
        // Hanya Satpam (atau Owner) yang boleh memperbarui status penanganan
        if (!in_array($user['peran'], ['satpam', 'owner'], true)) {
            jsonError('Hanya petugas keamanan atau Owner yang dapat memperbarui status laporan.', 403);
        }

        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $kode      = trim($input['kode'] ?? $input['id'] ?? '');
        $newStatus = trim($input['status'] ?? $input['status_baru'] ?? '');
        $catatan   = trim($input['catatan'] ?? $input['note'] ?? '');

        if ($kode === '') {
            jsonError('Kode laporan wajib disertakan.', 400);
        }

        $allowedStatuses = ['Baru', 'Diterima', 'Diproses', 'Selesai', 'Eskalasi'];
        if (!in_array($newStatus, $allowedStatuses, true)) {
            jsonError('Status penanganan tidak valid.', 400);
        }

        // Ambil laporan saat ini
        $stmtCurrent = $db->prepare('SELECT * FROM laporan WHERE kode = :kode LIMIT 1');
        $stmtCurrent->execute(['kode' => $kode]);
        $current = $stmtCurrent->fetch();
        if (!$current) {
            jsonError('Laporan tidak ditemukan.', 404);
        }

        $oldStatus = $current['status'];

        // Update laporan
        $sqlUpdate = 'UPDATE laporan SET status = :status, petugas = :petugas';
        $paramsUpdate = [
            'status'  => $newStatus,
            'petugas' => $user['id_login'],
            'kode'    => $kode,
        ];

        if ($catatan !== '') {
            $sqlUpdate .= ', catatan_penanganan = :catatan';
            $paramsUpdate['catatan'] = $catatan;
        }

        if ($newStatus === 'Selesai') {
            $sqlUpdate .= ', waktu_selesai = NOW()';
        }

        $sqlUpdate .= ' WHERE kode = :kode';
        $stmtUp = $db->prepare($sqlUpdate);
        $stmtUp->execute($paramsUpdate);

        // Catat ke Log Status
        $stmtLog = $db->prepare('
            INSERT INTO log_status (kode_laporan, status_sebelumnya, status_baru, diubah_oleh, catatan, waktu)
            VALUES (:kode, :old, :new, :oleh, :catatan, NOW())
        ');
        $noteLog = $catatan !== '' ? $catatan : ('Status diubah menjadi ' . $newStatus);
        $stmtLog->execute([
            'kode'    => $kode,
            'old'     => $oldStatus,
            'new'     => $newStatus,
            'oleh'    => $user['id_login'],
            'catatan' => $noteLog,
        ]);

        // Buat Notifikasi untuk Pelapor (Warga)
        $notifPelapor = $db->prepare('
            INSERT INTO notifikasi (untuk_pengguna, judul, pesan, kode_laporan, dibaca, waktu)
            VALUES (:pelapor, "Status Laporan Diperbarui", :pesan, :kode, 0, NOW())
        ');
        $notifPelapor->execute([
            'pelapor' => $current['pelapor'],
            'pesan'   => 'Laporan Anda (' . $kode . ') kini berstatus ' . $newStatus . ($catatan ? ': "' . $catatan . '"' : '.'),
            'kode'    => $kode,
        ]);

        // Jika status Eskalasi, buat notifikasi prioritas untuk Owner
        if ($newStatus === 'Eskalasi') {
            $notifOwner = $db->prepare('
                INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu)
                VALUES ("owner", "Laporan Dieskalasi", :pesan, :kode, 0, NOW())
            ');
            $notifOwner->execute([
                'pesan' => 'Petugas ' . $user['nama'] . ' mengeskalasikan laporan ' . $kode . ' (' . $current['kategori'] . ' Blok ' . $current['blok'] . ').',
                'kode'  => $kode,
            ]);
        }

        jsonSuccess(['kode' => $kode, 'status' => $newStatus], 'Status laporan berhasil diperbarui menjadi ' . $newStatus . '.');
        break;

    case 'eskalasi':
        verifyCsrfToken();
        if (!in_array($user['peran'], ['satpam'], true)) {
            jsonError('Hanya petugas keamanan yang dapat mengeskalasi laporan ke Owner.', 403);
        }

        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $kode = trim($input['kode'] ?? $input['id'] ?? '');
        $alasan = trim($input['catatan'] ?? $input['alasan'] ?? 'Dieskalasi ke Owner Perumnas untuk tindak lanjut.');

        if ($kode === '') jsonError('Kode laporan wajib disertakan.', 400);

        $stmtCurrent = $db->prepare('SELECT * FROM laporan WHERE kode = :kode LIMIT 1');
        $stmtCurrent->execute(['kode' => $kode]);
        $current = $stmtCurrent->fetch();
        if (!$current) jsonError('Laporan tidak ditemukan.', 404);

        $oldStatus = $current['status'];

        $up = $db->prepare('UPDATE laporan SET status = "Eskalasi", catatan_eskalasi = :alasan, petugas = :satpam WHERE kode = :kode');
        $up->execute(['alasan' => $alasan, 'satpam' => $user['id_login'], 'kode' => $kode]);

        $log = $db->prepare('INSERT INTO log_status (kode_laporan, status_sebelumnya, status_baru, diubah_oleh, catatan, waktu) VALUES (:kode, :old, "Eskalasi", :oleh, :catatan, NOW())');
        $log->execute(['kode' => $kode, 'old' => $oldStatus, 'oleh' => $user['id_login'], 'catatan' => $alasan]);

        $notif = $db->prepare('INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu) VALUES ("owner", "Laporan Dieskalasi", :pesan, :kode, 0, NOW())');
        $notif->execute([
            'pesan' => 'Laporan ' . $kode . ' (' . $current['kategori'] . ' Blok ' . $current['blok'] . ') dieskalasi oleh ' . $user['nama'] . '.',
            'kode'  => $kode,
        ]);

        jsonSuccess(['kode' => $kode, 'status' => 'Eskalasi'], 'Laporan ' . $kode . ' berhasil dieskalasi ke Owner.');
        break;

    case 'owner_arahan':
        verifyCsrfToken();
        if ($user['peran'] !== 'owner') {
            jsonError('Hanya Owner yang dapat memberikan arahan eskalasi.', 403);
        }

        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $kode   = trim($input['kode'] ?? $input['id'] ?? '');
        $arahan = trim($input['arahan'] ?? $input['catatan'] ?? '');

        if ($kode === '' || $arahan === '') {
            jsonError('Kode laporan dan arahan Owner wajib diisi.', 400);
        }

        $stmtCurrent = $db->prepare('SELECT * FROM laporan WHERE kode = :kode LIMIT 1');
        $stmtCurrent->execute(['kode' => $kode]);
        $current = $stmtCurrent->fetch();
        if (!$current) jsonError('Laporan tidak ditemukan.', 404);

        $up = $db->prepare('UPDATE laporan SET status = "Diproses", catatan_eskalasi = :arahan WHERE kode = :kode');
        $up->execute(['arahan' => $arahan, 'kode' => $kode]);

        $log = $db->prepare('INSERT INTO log_status (kode_laporan, status_sebelumnya, status_baru, diubah_oleh, catatan, waktu) VALUES (:kode, "Eskalasi", "Diproses", :oleh, :catatan, NOW())');
        $log->execute(['kode' => $kode, 'oleh' => $user['id_login'], 'catatan' => 'Arahan Owner: ' . $arahan]);

        $notif = $db->prepare('INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu) VALUES ("satpam", "Arahan Owner Laporan", :pesan, :kode, 0, NOW())');
        $notif->execute([
            'pesan' => 'Owner telah memberikan arahan untuk laporan ' . $kode . ': "' . $arahan . '"',
            'kode'  => $kode,
        ]);

        jsonSuccess(['kode' => $kode, 'status' => 'Diproses'], 'Arahan Owner berhasil disimpan dan diteruskan ke Satpam.');
        break;

    default:
        jsonError('Aksi laporan tidak valid.', 404);
}

/**
 * Format baris laporan ke struktur JSON yang diharapkan front-end
 */
function formatReportRow(array $row, PDO $db, bool $includeTimeline = true): array {
    $photos = [];
    if (!empty($row['foto_bukti'])) {
        $decoded = json_decode($row['foto_bukti'], true);
        if (is_array($decoded)) {
            $photos = $decoded;
        } else {
            $photos = [$row['foto_bukti']];
        }
    }

    $dt = strtotime($row['waktu_kejadian']);
    $today = date('Y-m-d');
    $reportDay = date('Y-m-d', $dt);

    $months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    $mName = $months[(int)date('n', $dt)];

    if ($today === $reportDay) {
        $timeStr = 'Hari ini ' . date('H.i', $dt);
    } else {
        $timeStr = date('j', $dt) . ' ' . $mName . ' ' . date('H.i', $dt);
    }
    $fullTimeStr = date('j', $dt) . ' ' . $mName . ' ' . date('Y', $dt) . ', ' . date('H.i', $dt);

    // Ambil timeline dari tabel log_status jika diminta
    $timeline = [];
    if ($includeTimeline) {
        $stmtLog = $db->prepare('SELECT * FROM log_status WHERE kode_laporan = :kode ORDER BY waktu ASC, id ASC');
        $stmtLog->execute(['kode' => $row['kode']]);
        $logs = $stmtLog->fetchAll();
        foreach ($logs as $log) {
            $logDt = strtotime($log['waktu']);
            $timeline[] = [
                'time'        => date('H.i', $logDt),
                'fullTime'    => date('j', $logDt) . ' ' . $months[(int)date('n', $logDt)] . ' ' . date('Y, H.i', $logDt),
                'title'       => getTimelineTitle($log['status_baru'], $log['status_sebelumnya']),
                'desc'        => $log['catatan'] ?: ('Status ' . $log['status_baru']),
                'isCompleted' => $log['status_baru'] === 'Selesai',
                'status'      => $log['status_baru'],
                'by'          => $log['diubah_oleh'],
            ];
        }
    }

    // Hitung resolutionTime jika selesai
    $resolutionTime = null;
    if ($row['status'] === 'Selesai' && !empty($row['waktu_selesai'])) {
        $endDt = strtotime($row['waktu_selesai']);
        $diffMins = max(1, round(($endDt - $dt) / 60));
        $resolutionTime = 'Tuntas dalam ' . $diffMins . ' menit';
    } elseif ($row['status'] === 'Selesai') {
        $resolutionTime = 'Selesai ditangani';
    }

    return [
        'id'                 => $row['kode'],
        'title'              => $row['kategori'],
        'category'           => $row['kategori'],
        'block'              => $row['blok'],
        'location'           => $row['lokasi'],
        'reporterId'         => $row['pelapor'],
        'reporterName'       => $row['reporter_name'] ?: $row['pelapor'],
        'reporterPhone'      => $row['reporter_phone'] ?? '',
        'time'               => $timeStr,
        'fullTime'           => $fullTimeStr,
        'desc'               => $row['deskripsi'],
        'urgency'            => $row['urgensi'],
        'status'             => $row['status'],
        'assignedTo'         => $row['petugas'] ?: '',
        'assignedToName'     => $row['petugas_name'] ?: ($row['petugas'] ?: 'Belum ditugaskan'),
        'photos'             => $photos,
        'catatanPenanganan'  => $row['catatan_penanganan'] ?? '',
        'catatanEskalasi'    => $row['catatan_eskalasi'] ?? '',
        'resolutionTime'     => $resolutionTime,
        'timeline'           => $timeline,
    ];
}

function getTimelineTitle(string $newStatus, ?string $oldStatus): string {
    switch ($newStatus) {
        case 'Baru':
            return 'Laporan dikirim';
        case 'Diterima':
            return 'Diterima petugas';
        case 'Diproses':
            return 'Diproses, petugas menuju lokasi';
        case 'Selesai':
            return 'Selesai';
        case 'Eskalasi':
            return 'Eskalasi ke Owner';
        default:
            return 'Status diperbarui: ' . $newStatus;
    }
}

