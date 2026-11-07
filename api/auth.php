<?php
/**
 * SafeHome - Endpoint Autentikasi
 * api/auth.php?action=login|logout|me|csrf
 */

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

switch ($action) {
    case 'login':
        verifyCsrfToken();
        $input = getJsonInput();
        if (empty($input)) {
            $input = $_POST;
        }

        $userId   = trim($input['user_id'] ?? $input['id'] ?? '');
        $password = trim($input['password'] ?? '');
        $role     = trim($input['role'] ?? '');

        // 1. Validasi Input Dasar
        if ($userId === '') {
            jsonError('Nomor rumah atau ID petugas wajib diisi.', 400);
        }
        if ($password === '') {
            jsonError('Kata sandi wajib diisi.', 400);
        }
        if ($role === '') {
            jsonError('Pilih salah satu peran terlebih dahulu.', 400);
        }

        // 2. Cek Rate Limiting (Maksimal 5 kali gagal per menit)
        checkLoginRateLimit($userId, $ip);

        // 3. Ambil Akun dari Database
        $db = getDB();
        $stmt = $db->prepare('SELECT * FROM pengguna WHERE id_login = :id_login LIMIT 1');
        $stmt->execute(['id_login' => $userId]);
        $account = $stmt->fetch();

        if (!$account) {
            recordFailedLoginAttempt($userId, $ip);
            jsonError('ID tidak terdaftar.', 404);
        }

        // 4. Verifikasi Kata Sandi (Bcrypt & upgrade bila legacy plain)
        $hash = $account['password_hash'];
        $pwdMatch = false;

        if (password_verify($password, $hash)) {
            $pwdMatch = true;
            // Upgrade hash jika algoritma diperbarui
            if (password_needs_rehash($hash, PASSWORD_BCRYPT)) {
                $newHash = password_hash($password, PASSWORD_BCRYPT);
                $up = $db->prepare('UPDATE pengguna SET password_hash = :hash WHERE id = :id');
                $up->execute(['hash' => $newHash, 'id' => $account['id']]);
            }
        } elseif ($hash === $password || $hash === 'safehome123') {
            // Kompatibilitas legacy seed jika belum di-hash
            $pwdMatch = true;
            $newHash = password_hash($password, PASSWORD_BCRYPT);
            $up = $db->prepare('UPDATE pengguna SET password_hash = :hash WHERE id = :id');
            $up->execute(['hash' => $newHash, 'id' => $account['id']]);
        }

        if (!$pwdMatch) {
            recordFailedLoginAttempt($userId, $ip);
            jsonError('Kata sandi salah.', 401);
        }

        // 5. Cek Kesesuaian Peran
        if ($account['peran'] !== $role) {
            recordFailedLoginAttempt($userId, $ip);
            jsonError('Peran yang dipilih tidak sesuai dengan akun.', 400);
        }

        // 6. Cek Status Akun
        $statusAkun = $account['status_akun'] ?? 'aktif';
        if ($statusAkun === 'menunggu') {
            jsonError('Akun Anda masih menunggu verifikasi Owner.', 403);
        }
        if ($statusAkun === 'ditolak') {
            $alasan = !empty($account['alasan_tolak']) ? ': ' . $account['alasan_tolak'] : '';
            jsonError('Pendaftaran ditolak' . $alasan . '. Hubungi Owner Perumnas.', 403);
        }
        if ((int)$account['aktif'] !== 1 || $statusAkun === 'nonaktif') {
            jsonError('Akun dinonaktifkan, hubungi Owner Perumnas.', 403);
        }

        // 7. Berhasil: Reset kegagalan login & set sesi aman
        resetLoginAttempts($userId, $ip);
        session_regenerate_id(true);

        $userData = [
            'id'            => $account['id'],
            'id_login'      => $account['id_login'],
            'nama'          => $account['nama'],
            'jenis_kelamin' => $account['jenis_kelamin'] ?? null,
            'peran'         => $account['peran'],
            'no_hp'         => $account['no_hp'],
            'email'         => $account['email'],
            'foto'          => $account['foto'],
            'blok'          => $account['blok'],
            'no_rumah'      => $account['no_rumah'],
            'shift'         => $account['shift'],
            'shift_jam'     => $account['shift_jam'],
            'pos_jaga'      => $account['pos_jaga'],
            'jabatan'       => $account['jabatan'],
            'status_akun'   => $account['status_akun'],
            'aktif'         => (bool)$account['aktif'],
        ];

        $_SESSION['user'] = $userData;

        jsonSuccess([
            'user'       => $userData,
            'csrf_token' => getCsrfToken(),
        ], 'Selamat datang, ' . $account['nama'] . '!');
        break;

    case 'logout':
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params['path'], $params['domain'],
                $params['secure'], $params['httponly']
            );
        }
        session_destroy();
        jsonSuccess([], 'Berhasil keluar.');
        break;

    case 'me':
        $user = getCurrentUser();
        if ($user) {
            // Ambil data terbaru dari database
            try {
                $db = getDB();
                $stmt = $db->prepare('SELECT id, id_login, nama, jenis_kelamin, peran, no_hp, email, foto, blok, no_rumah, shift, shift_jam, pos_jaga, jabatan, status_akun, aktif FROM pengguna WHERE id = :id LIMIT 1');
                $stmt->execute(['id' => $user['id']]);
                $fresh = $stmt->fetch();
                if ($fresh && (int)$fresh['aktif'] === 1 && $fresh['status_akun'] === 'aktif') {
                    $fresh['aktif'] = (bool)$fresh['aktif'];
                    $_SESSION['user'] = $fresh;
                    $user = $fresh;
                } else {
                    $_SESSION['user'] = null;
                    jsonSuccess(['authenticated' => false, 'user' => null, 'csrf_token' => getCsrfToken()]);
                }
            } catch (Exception $e) {}

            jsonSuccess([
                'authenticated' => true,
                'user'          => $user,
                'csrf_token'    => getCsrfToken(),
            ]);
        } else {
            jsonSuccess([
                'authenticated' => false,
                'user'          => null,
                'csrf_token'    => getCsrfToken(),
            ]);
        }
        break;

    case 'csrf':
        jsonSuccess(['csrf_token' => getCsrfToken()]);
        break;

    default:
        jsonError('Aksi autentikasi tidak valid.', 404);
}

