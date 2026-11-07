<?php
/**
 * SafeHome - Endpoint Manajemen Pengguna & Profil
 * api/pengguna.php?action=profile|change_password|list|add|edit|toggle_active|delete|reset_password|pending_registrations|approve_registration|reject_registration|register|find_id
 */

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? 'profile';
$db = getDB();

// ==========================================
// HELPER
// ==========================================

/**
 * Normalisasi nilai jenis kelamin ke 'L' / 'P'.
 * Menerima: L, P, Laki-laki, Perempuan, pria, wanita, male, female.
 * Mengembalikan '' jika tidak dikenali.
 */
function normalisasiJK($value) {
    $v = strtolower(trim((string)$value));
    if (in_array($v, ['l', 'laki-laki', 'laki', 'pria', 'male'], true)) return 'L';
    if (in_array($v, ['p', 'perempuan', 'wanita', 'female'], true)) return 'P';
    return '';
}

/**
 * Ambil nilai jenis kelamin dari input dengan beberapa kemungkinan nama kunci.
 */
function ambilJK(array $input) {
    foreach (['jenis_kelamin', 'jk', 'gender', 'reg_jk', 'reg-jk'] as $k) {
        if (isset($input[$k]) && trim((string)$input[$k]) !== '') {
            return $input[$k];
        }
    }
    return '';
}

/**
 * Validasi nomor HP: hanya digit, 10-13 digit.
 */
function nomorHpValid($phone) {
    return ctype_digit($phone) && strlen($phone) >= 10 && strlen($phone) <= 13;
}

/**
 * Pembatas percobaan sederhana berbasis sesi (untuk endpoint publik find_id).
 * Maksimal $max percobaan per $window detik.
 */
function batasiPercobaan($key, $max = 5, $window = 60) {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    $now = time();
    $attempts = $_SESSION[$key] ?? [];
    $attempts = array_values(array_filter($attempts, function ($t) use ($now, $window) {
        return ($now - $t) < $window;
    }));
    if (count($attempts) >= $max) {
        $_SESSION[$key] = $attempts;
        jsonError('Terlalu banyak percobaan. Coba lagi dalam 1 menit.', 429);
    }
    $attempts[] = $now;
    $_SESSION[$key] = $attempts;
}

switch ($action) {
    // ==========================================
    // 1. PENDAFTARAN MANDIRI PENGHUNI (PUBLIK)
    // ==========================================
    case 'register':
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $name     = trim($input['name'] ?? $input['nama'] ?? '');
        $jk       = normalisasiJK(ambilJK($input));
        $blok     = strtoupper(trim($input['blok'] ?? ''));
        $nomor    = trim($input['nomor'] ?? $input['no_rumah'] ?? '');
        $phone    = preg_replace('/\D/', '', $input['phone'] ?? $input['no_hp'] ?? '');
        $email    = trim($input['email'] ?? '');
        $password = trim($input['password'] ?? '');

        if ($name === '' || strlen($name) < 3) {
            jsonError('Nama lengkap wajib diisi, minimal 3 karakter.', 400);
        }
        if (!in_array($jk, ['L', 'P'], true)) {
            jsonError('Jenis kelamin wajib dipilih (Laki-laki / Perempuan).', 400);
        }
        if (!in_array($blok, ['A', 'B', 'C', 'D', 'E', 'F'], true)) {
            jsonError('Pilih blok yang valid (A–F).', 400);
        }
        if ($nomor === '' || !ctype_digit($nomor)) {
            jsonError('Nomor rumah wajib berupa angka.', 400);
        }
        if (!nomorHpValid($phone)) {
            jsonError('Nomor HP wajib valid (10-13 digit angka).', 400);
        }
        if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonError('Format alamat email tidak valid.', 400);
        }
        if ($password === '' || strlen($password) < 8) {
            jsonError('Kata sandi minimal 8 karakter.', 400);
        }

        $loginId = $blok . '-' . $nomor;

        // Cek apakah ID sudah terdaftar
        $check = $db->prepare('SELECT id, status_akun FROM pengguna WHERE id_login = :login_id LIMIT 1');
        $check->execute(['login_id' => $loginId]);
        $existing = $check->fetch();

        if ($existing) {
            if ($existing['status_akun'] === 'menunggu') {
                jsonError('Pendaftaran untuk rumah ' . $loginId . ' sudah ada dan sedang menunggu persetujuan Owner.', 400);
            }
            jsonError('Nomor rumah ' . $loginId . ' sudah terdaftar. Silakan login atau hubungi pengelola.', 400);
        }

        $pwdHash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $db->prepare('
            INSERT INTO pengguna 
            (id_login, nama, jenis_kelamin, peran, password_hash, no_hp, email, blok, no_rumah, status_akun, aktif)
            VALUES
            (:id_login, :nama, :jenis_kelamin, "penghuni", :hash, :no_hp, :email, :blok, :no_rumah, "menunggu", 1)
        ');
        $stmt->execute([
            'id_login'      => $loginId,
            'nama'          => $name,
            'jenis_kelamin' => $jk,
            'hash'          => $pwdHash,
            'no_hp'         => $phone,
            'email'         => $email,
            'blok'          => $blok,
            'no_rumah'      => $nomor,
        ]);

        // Buat Notifikasi untuk Owner
        $notif = $db->prepare('
            INSERT INTO notifikasi (untuk_peran, judul, pesan, kode_laporan, dibaca, waktu)
            VALUES ("owner", "Pendaftaran Penghuni Baru", :pesan, NULL, 0, NOW())
        ');
        $notif->execute([
            'pesan' => 'Warga baru ' . $name . ' (' . $loginId . ') mendaftar, menunggu verifikasi berkas.',
        ]);

        jsonSuccess([
            'login_id' => $loginId,
            'nama'     => $name,
            'status'   => 'menunggu',
        ], 'Pendaftaran berhasil dikirim! Akun Anda akan aktif setelah diverifikasi oleh Owner Perumnas.');
        break;

    // ==========================================
    // 2. LUPA ID / KATA SANDI (CARI ID)
    // ==========================================
    case 'find_id':
        // Endpoint publik: batasi percobaan agar tidak bisa ditebak berulang
        batasiPercobaan('find_id_attempts', 5, 60);

        $nameInput  = trim($_GET['name'] ?? $_GET['nama'] ?? '');
        $phoneInput = preg_replace('/\D/', '', $_GET['phone'] ?? $_GET['no_hp'] ?? '');

        if ($nameInput === '' || $phoneInput === '') {
            jsonError('Nama lengkap dan nomor WhatsApp wajib diisi.', 400);
        }

        $stmt = $db->prepare('
            SELECT id_login, nama, peran, no_hp, blok, no_rumah, status_akun 
            FROM pengguna 
            WHERE aktif = 1 AND LOWER(nama) = LOWER(:name)
        ');
        $stmt->execute(['name' => $nameInput]);
        $rows = $stmt->fetchAll();

        $matched = [];
        foreach ($rows as $r) {
            $dbPhone = preg_replace('/\D/', '', $r['no_hp'] ?? '');
            if ($dbPhone === $phoneInput || substr($dbPhone, -8) === substr($phoneInput, -8)) {
                $matched[] = [
                    'id_login' => $r['id_login'],
                    'nama'     => $r['nama'],
                    'peran'    => $r['peran'],
                    'blok'     => $r['blok'],
                    'no_rumah' => $r['no_rumah'],
                ];
            }
        }

        if (empty($matched)) {
            jsonError('Data tidak ditemukan. Pastikan nama lengkap dan nomor HP sesuai saat pendaftaran.', 404);
        }

        jsonSuccess($matched, 'Akun ditemukan.');
        break;

    // ==========================================
    // 3. PROFIL PENGGUNA SENDIRI
    // ==========================================
    case 'profile':
        $user = requireAuth();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            verifyCsrfToken();
            $name  = trim($_POST['name'] ?? $_POST['nama'] ?? $user['nama']);
            $phone = preg_replace('/\D/', '', $_POST['phone'] ?? $_POST['no_hp'] ?? ($user['no_hp'] ?? ''));
            $email = trim($_POST['email'] ?? ($user['email'] ?? ''));
            $jkInput = ambilJK($_POST);
            $jk = $user['jenis_kelamin'] ?? null;

            if ($name === '' || strlen($name) < 3) {
                jsonError('Nama lengkap minimal 3 karakter.', 400);
            }
            if ($phone !== '' && !nomorHpValid($phone)) {
                jsonError('Nomor HP wajib valid (10-13 digit angka).', 400);
            }
            if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                jsonError('Format alamat email tidak valid.', 400);
            }
            if (trim((string)$jkInput) !== '') {
                $jkNorm = normalisasiJK($jkInput);
                if (!in_array($jkNorm, ['L', 'P'], true)) {
                    jsonError('Pilihan jenis kelamin harus Laki-laki atau Perempuan.', 400);
                }
                $jk = $jkNorm;
            }

            $fotoPath = $user['foto'] ?? '';

            // Handle Upload Foto Profil
            if (!empty($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
                $file = $_FILES['foto'];
                if ($file['size'] > 1 * 1024 * 1024) {
                    jsonError('Ukuran foto profil maksimal 1 MB.', 400);
                }
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
                    jsonError('Format foto harus JPG, PNG, atau WEBP.', 400);
                }
                // Pastikan isi berkas benar-benar gambar, bukan hanya ekstensinya
                if (@getimagesize($file['tmp_name']) === false) {
                    jsonError('Berkas yang diunggah bukan gambar yang valid.', 400);
                }

                $uploadDir = __DIR__ . '/../uploads/';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
                $safeId   = preg_replace('/[^A-Za-z0-9_-]/', '', $user['id_login']);
                $fileName = 'avatar_' . $safeId . '_' . time() . '.' . $ext;
                $destPath = $uploadDir . $fileName;

                if (move_uploaded_file($file['tmp_name'], $destPath)) {
                    $fotoPath = 'uploads/' . $fileName;
                }
            } elseif (!empty($_POST['remove_photo']) && $_POST['remove_photo'] === '1') {
                $fotoPath = '';
            }

            $stmt = $db->prepare('
                UPDATE pengguna 
                SET nama = :nama, jenis_kelamin = :jenis_kelamin, no_hp = :no_hp, email = :email, foto = :foto 
                WHERE id = :id
            ');
            $stmt->execute([
                'nama'          => $name,
                'jenis_kelamin' => $jk,
                'no_hp'         => $phone,
                'email'         => $email,
                'foto'          => $fotoPath,
                'id'            => $user['id'],
            ]);

            // Refresh sesi
            $_SESSION['user']['nama']          = $name;
            $_SESSION['user']['jenis_kelamin'] = $jk;
            $_SESSION['user']['no_hp']         = $phone;
            $_SESSION['user']['email']         = $email;
            $_SESSION['user']['foto']          = $fotoPath;

            jsonSuccess($_SESSION['user'], 'Profil berhasil diperbarui.');
        } else {
            // GET profile
            $stmt = $db->prepare('SELECT id, id_login, nama, jenis_kelamin, peran, no_hp, email, foto, blok, no_rumah, shift, shift_jam, pos_jaga, jabatan, status_akun FROM pengguna WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $user['id']]);
            $current = $stmt->fetch();
            jsonSuccess($current);
        }
        break;

    // ==========================================
    // 4. UBAH KATA SANDI SENDIRI
    // ==========================================
    case 'change_password':
        $user = requireAuth();
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $oldPwd  = trim($input['old_password'] ?? $input['pwd_old'] ?? '');
        $newPwd  = trim($input['new_password'] ?? $input['pwd_new'] ?? '');
        $confirm = trim($input['confirm_password'] ?? $input['pwd_confirm'] ?? '');

        if ($oldPwd === '') jsonError('Kata sandi saat ini wajib diisi.', 400);
        if ($newPwd === '' || strlen($newPwd) < 8) jsonError('Kata sandi baru minimal 8 karakter.', 400);
        if ($newPwd !== $confirm) jsonError('Konfirmasi kata sandi baru tidak cocok.', 400);

        $stmt = $db->prepare('SELECT password_hash FROM pengguna WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $user['id']]);
        $row = $stmt->fetch();

        // Hanya verifikasi lewat password_verify (tidak boleh membandingkan dengan hash mentah)
        if (!$row || !password_verify($oldPwd, $row['password_hash'])) {
            jsonError('Kata sandi saat ini salah.', 400);
        }

        $newHash = password_hash($newPwd, PASSWORD_BCRYPT);
        $up = $db->prepare('UPDATE pengguna SET password_hash = :hash WHERE id = :id');
        $up->execute(['hash' => $newHash, 'id' => $user['id']]);

        jsonSuccess([], 'Kata sandi berhasil diperbarui.');
        break;

    // ==========================================
    // 5. KELOLA PENGGUNA (KHUSUS OWNER)
    // ==========================================
    case 'list':
        $user = requireAuth(['owner', 'direktur']);
        $role = trim($_GET['role'] ?? '');

        $sql = 'SELECT id, id_login, nama, jenis_kelamin, peran, no_hp, email, foto, blok, no_rumah, shift, shift_jam, pos_jaga, jabatan, status_akun, alasan_tolak, aktif, created_at FROM pengguna WHERE 1=1';
        $params = [];

        if ($role !== '' && $role !== 'semua') {
            $sql .= ' AND peran = :role';
            $params['role'] = $role;
        }

        $sql .= ' ORDER BY id_login ASC';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();

        jsonSuccess($users);
        break;

    case 'add':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin  = trim($input['id'] ?? $input['id_login'] ?? '');
        $name     = trim($input['name'] ?? $input['nama'] ?? '');
        $jkRaw    = ambilJK($input);
        $phone    = preg_replace('/\D/', '', $input['phone'] ?? $input['no_hp'] ?? '');
        $shift    = trim($input['shift'] ?? 'Pagi');
        $posJaga  = trim($input['pos'] ?? $input['pos_jaga'] ?? 'Pos Gerbang Utama');
        $rawPwd   = trim($input['password'] ?? 'safehome123');

        if ($idLogin === '') jsonError('ID petugas wajib diisi.', 400);
        if ($name === '' || strlen($name) < 3) jsonError('Nama lengkap minimal 3 karakter.', 400);

        // Jenis kelamin opsional di sini; jika diisi harus valid
        $jk = null;
        if (trim((string)$jkRaw) !== '') {
            $jk = normalisasiJK($jkRaw);
            if (!in_array($jk, ['L', 'P'], true)) {
                jsonError('Pilih jenis kelamin yang valid (Laki-laki atau Perempuan).', 400);
            }
        }

        if ($phone !== '' && !nomorHpValid($phone)) {
            jsonError('Nomor HP wajib valid (10-13 digit angka).', 400);
        }
        if (strlen($rawPwd) < 8) {
            jsonError('Kata sandi minimal 8 karakter.', 400);
        }

        // Cek ID duplikat
        $check = $db->prepare('SELECT id FROM pengguna WHERE id_login = :id LIMIT 1');
        $check->execute(['id' => $idLogin]);
        if ($check->fetch()) {
            jsonError('ID petugas ' . $idLogin . ' sudah digunakan.', 400);
        }

        $shiftMap = ['Pagi' => '06.00-14.00', 'Siang' => '14.00-22.00', 'Malam' => '22.00-06.00', 'Cadangan' => ''];
        $shiftJam = $shiftMap[$shift] ?? '';
        $hash = password_hash($rawPwd, PASSWORD_BCRYPT);

        $stmt = $db->prepare('
            INSERT INTO pengguna 
            (id_login, nama, jenis_kelamin, peran, password_hash, no_hp, shift, shift_jam, pos_jaga, status_akun, aktif)
            VALUES
            (:id_login, :nama, :jenis_kelamin, "satpam", :hash, :no_hp, :shift, :shift_jam, :pos_jaga, "aktif", 1)
        ');
        $stmt->execute([
            'id_login'      => $idLogin,
            'nama'          => $name,
            'jenis_kelamin' => $jk,
            'hash'          => $hash,
            'no_hp'         => $phone,
            'shift'         => $shift,
            'shift_jam'     => $shiftJam,
            'pos_jaga'      => $posJaga,
        ]);

        jsonSuccess(['id_login' => $idLogin, 'nama' => $name], 'Petugas ' . $name . ' berhasil ditambahkan.');
        break;

    case 'edit':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin = trim($input['id_login'] ?? $input['id'] ?? '');
        $name    = trim($input['nama'] ?? $input['name'] ?? '');
        $phone   = preg_replace('/\D/', '', $input['no_hp'] ?? $input['phone'] ?? '');
        $jkInput = ambilJK($input);

        if ($idLogin === '') jsonError('ID pengguna wajib disertakan.', 400);
        if ($name === '' || strlen($name) < 3) jsonError('Nama lengkap minimal 3 karakter.', 400);
        if ($phone !== '' && !nomorHpValid($phone)) {
            jsonError('Nomor HP wajib valid (10-13 digit angka).', 400);
        }

        $stmtUser = $db->prepare('SELECT * FROM pengguna WHERE id_login = :id LIMIT 1');
        $stmtUser->execute(['id' => $idLogin]);
        $targetUser = $stmtUser->fetch();
        if (!$targetUser) jsonError('Pengguna tidak ditemukan.', 404);

        $jk = $targetUser['jenis_kelamin'] ?? null;
        if (trim((string)$jkInput) !== '') {
            $jkNorm = normalisasiJK($jkInput);
            if (!in_array($jkNorm, ['L', 'P'], true)) {
                jsonError('Pilih jenis kelamin yang valid (Laki-laki atau Perempuan).', 400);
            }
            $jk = $jkNorm;
        }

        if ($targetUser['peran'] === 'penghuni') {
            $blok  = strtoupper(trim($input['blok'] ?? $targetUser['blok']));
            $nomor = trim($input['no_rumah'] ?? $targetUser['no_rumah']);

            if (!in_array($blok, ['A', 'B', 'C', 'D', 'E', 'F'], true)) {
                jsonError('Pilih blok yang valid (A–F).', 400);
            }
            if ($nomor === '' || !ctype_digit((string)$nomor)) {
                jsonError('Nomor rumah wajib berupa angka.', 400);
            }

            $up = $db->prepare('UPDATE pengguna SET nama = :nama, jenis_kelamin = :jk, no_hp = :no_hp, blok = :blok, no_rumah = :no_rumah WHERE id_login = :id');
            $up->execute([
                'nama'     => $name,
                'jk'       => $jk,
                'no_hp'    => $phone,
                'blok'     => $blok,
                'no_rumah' => $nomor,
                'id'       => $idLogin,
            ]);
        } else {
            // Satpam / Lainnya
            $shift   = trim($input['shift'] ?? $targetUser['shift']);
            $posJaga = trim($input['pos_jaga'] ?? $targetUser['pos_jaga']);
            $shiftMap = ['Pagi' => '06.00-14.00', 'Siang' => '14.00-22.00', 'Malam' => '22.00-06.00', 'Cadangan' => ''];
            $shiftJam = $shiftMap[$shift] ?? '';

            $up = $db->prepare('UPDATE pengguna SET nama = :nama, jenis_kelamin = :jk, no_hp = :no_hp, shift = :shift, shift_jam = :shift_jam, pos_jaga = :pos WHERE id_login = :id');
            $up->execute([
                'nama'      => $name,
                'jk'        => $jk,
                'no_hp'     => $phone,
                'shift'     => $shift,
                'shift_jam' => $shiftJam,
                'pos'       => $posJaga,
                'id'        => $idLogin,
            ]);
        }

        jsonSuccess([], 'Data pengguna ' . $name . ' berhasil diperbarui.');
        break;

    case 'toggle_active':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin = trim($input['id_login'] ?? $input['id'] ?? '');
        if ($idLogin === '') jsonError('ID pengguna wajib disertakan.', 400);

        if ($idLogin === $user['id_login']) {
            jsonError('Anda tidak dapat menonaktifkan akun Anda sendiri.', 400);
        }

        $stmt = $db->prepare('SELECT id, nama, aktif FROM pengguna WHERE id_login = :id LIMIT 1');
        $stmt->execute(['id' => $idLogin]);
        $target = $stmt->fetch();
        if (!$target) jsonError('Pengguna tidak ditemukan.', 404);

        $newActive = ((int)$target['aktif'] === 1) ? 0 : 1;
        $newStatus = ($newActive === 1) ? 'aktif' : 'nonaktif';

        $up = $db->prepare('UPDATE pengguna SET aktif = :aktif, status_akun = :status WHERE id_login = :id');
        $up->execute(['aktif' => $newActive, 'status' => $newStatus, 'id' => $idLogin]);

        $statusText = $newActive === 1 ? 'diaktifkan kembali' : 'dinonaktifkan';
        jsonSuccess(['aktif' => (bool)$newActive], 'Akun ' . $target['nama'] . ' berhasil ' . $statusText . '.');
        break;

    case 'delete':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin = trim($input['id_login'] ?? $input['id'] ?? '');
        if ($idLogin === '') jsonError('ID pengguna wajib disertakan.', 400);

        if ($idLogin === $user['id_login']) {
            jsonError('Anda tidak dapat menghapus akun Anda sendiri.', 400);
        }

        $stmt = $db->prepare('DELETE FROM pengguna WHERE id_login = :id');
        $stmt->execute(['id' => $idLogin]);

        if ($stmt->rowCount() === 0) {
            jsonError('Pengguna tidak ditemukan.', 404);
        }

        jsonSuccess([], 'Akun ' . $idLogin . ' berhasil dihapus.');
        break;

    case 'reset_password':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin = trim($input['id_login'] ?? $input['id'] ?? '');
        if ($idLogin === '') jsonError('ID pengguna wajib disertakan.', 400);

        $hash = password_hash('safehome123', PASSWORD_BCRYPT);
        $stmt = $db->prepare('UPDATE pengguna SET password_hash = :hash WHERE id_login = :id');
        $stmt->execute(['hash' => $hash, 'id' => $idLogin]);

        if ($stmt->rowCount() === 0) {
            jsonError('Pengguna tidak ditemukan.', 404);
        }

        jsonSuccess([], 'Kata sandi akun ' . $idLogin . ' berhasil direset ke "safehome123".');
        break;

    // ==========================================
    // 6. PERSETUJUAN PENDAFTARAN OLEH OWNER
    // ==========================================
    case 'pending_registrations':
        $user = requireAuth(['owner']);
        $stmt = $db->prepare('SELECT id, id_login, nama, jenis_kelamin, peran, no_hp, email, blok, no_rumah, status_akun, created_at FROM pengguna WHERE peran = "penghuni" AND status_akun = "menunggu" ORDER BY created_at DESC');
        $stmt->execute();
        $rows = $stmt->fetchAll();
        jsonSuccess($rows);
        break;

    case 'approve_registration':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin = trim($input['id_login'] ?? $input['id'] ?? '');
        if ($idLogin === '') jsonError('ID login wajib disertakan.', 400);

        // Hanya akun penghuni yang masih berstatus "menunggu"
        $up = $db->prepare('UPDATE pengguna SET status_akun = "aktif", aktif = 1 WHERE id_login = :id AND peran = "penghuni" AND status_akun = "menunggu"');
        $up->execute(['id' => $idLogin]);

        if ($up->rowCount() === 0) {
            jsonError('Pendaftaran tidak ditemukan atau sudah diproses.', 404);
        }

        // Buat notifikasi sambutan untuk warga
        $notif = $db->prepare('INSERT INTO notifikasi (untuk_pengguna, judul, pesan, dibaca, waktu) VALUES (:id, "Akun Disetujui", "Selamat! Pendaftaran akun penghuni Anda telah disetujui oleh Owner Perumnas.", 0, NOW())');
        $notif->execute(['id' => $idLogin]);

        jsonSuccess([], 'Pendaftaran akun ' . $idLogin . ' berhasil disetujui.');
        break;

    case 'reject_registration':
        $user = requireAuth(['owner']);
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) $input = $_POST;

        $idLogin = trim($input['id_login'] ?? $input['id'] ?? '');
        $alasan  = trim($input['alasan'] ?? 'Nomor rumah tidak valid atau data KTP tidak sesuai.');

        if ($idLogin === '') jsonError('ID login wajib disertakan.', 400);

        // Hanya akun penghuni yang masih berstatus "menunggu"
        $up = $db->prepare('UPDATE pengguna SET status_akun = "ditolak", alasan_tolak = :alasan WHERE id_login = :id AND peran = "penghuni" AND status_akun = "menunggu"');
        $up->execute(['alasan' => $alasan, 'id' => $idLogin]);

        if ($up->rowCount() === 0) {
            jsonError('Pendaftaran tidak ditemukan atau sudah diproses.', 404);
        }

        jsonSuccess([], 'Pendaftaran akun ' . $idLogin . ' ditolak.');
        break;

    default:
        jsonError('Aksi pengguna tidak valid.', 404);
}