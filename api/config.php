<?php
/**
 * SafeHome - Perumnas Pesona Cirebon Regency
 * Konfigurasi Database PDO, Sesi, dan Helper API
 */

// Aktifkan error reporting untuk logging internal (namun output JSON tetap bersih)
error_reporting(E_ALL);
ini_set('display_errors', '0');

// Header default untuk semua endpoint API
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');

// Pengaturan Sesi Aman (HttpOnly, SameSite Lax)
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.use_only_cookies', '1');
    session_start();
}

// Konfigurasi Database
define('DB_HOST', '127.0.0.1');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'safehome');

/**
 * Mendapatkan koneksi PDO ke database safehome
 */
function getDB(): PDO {
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        jsonError('Gagal terhubung ke database SafeHome. Pastikan database "' . DB_NAME . '" sudah diimpor dan MySQL di XAMPP aktif: ' . $e->getMessage(), 500);
    }
}

/**
 * Helper Output JSON Sukses
 */
function jsonSuccess($data = [], ?string $message = null, int $statusCode = 200, array $extra = []): void {
    http_response_code($statusCode);
    $response = array_merge([
        'success' => true,
        'message' => $message,
        'data'    => $data,
    ], $extra);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Helper Output JSON Error
 */
function jsonError(string $message, int $statusCode = 400, array $extra = []): void {
    http_response_code($statusCode);
    $response = array_merge([
        'success' => false,
        'message' => $message,
    ], $extra);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Mendapatkan token CSRF
 */
function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verifikasi token CSRF untuk request pengubah data (POST, PUT, DELETE)
 */
function verifyCsrfToken(): void {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (in_array(strtoupper($method), ['GET', 'HEAD', 'OPTIONS'], true)) {
        return;
    }

    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? $_POST['csrf_token'] ?? null;
    $sessionToken = $_SESSION['csrf_token'] ?? null;

    if (!$sessionToken || !$token || !hash_equals($sessionToken, $token)) {
        jsonError('Token keamanan CSRF tidak valid atau sesi kadaluarsa. Silakan refresh halaman.', 403);
    }
}

/**
 * Mendapatkan pengguna yang sedang login
 */
function getCurrentUser(): ?array {
    return $_SESSION['user'] ?? null;
}

/**
 * Mengharuskan autentikasi (dan cek peran)
 */
function requireAuth(array $allowedRoles = []): array {
    $user = getCurrentUser();
    if (!$user) {
        jsonError('Sesi berakhir, silakan masuk kembali ke aplikasi.', 401);
    }

    if (!empty($allowedRoles) && !in_array($user['peran'], $allowedRoles, true)) {
        jsonError('Akses ditolak: Anda tidak memiliki wewenang untuk tindakan ini.', 403);
    }

    return $user;
}

/**
 * Rate limiting untuk login gagal (maksimal 5 kali dalam 1 menit)
 */
function checkLoginRateLimit(string $loginId, string $ip): void {
    try {
        $db = getDB();
        $stmt = $db->prepare('
            SELECT COUNT(*) AS total 
            FROM login_attempts 
            WHERE (ip_address = :ip OR login_id = :login_id) 
              AND attempted_at > (NOW() - INTERVAL 1 MINUTE)
        ');
        $stmt->execute(['ip' => $ip, 'login_id' => $loginId]);
        $res = $stmt->fetch();
        if ($res && (int)$res['total'] >= 5) {
            jsonError('Terlalu banyak percobaan login gagal. Mohon tunggu 1 menit sebelum mencoba kembali.', 429);
        }
    } catch (Exception $e) {
        // Lanjutkan jika tabel belum siap
    }
}

function recordFailedLoginAttempt(string $loginId, string $ip): void {
    try {
        $db = getDB();
        $stmt = $db->prepare('INSERT INTO login_attempts (ip_address, login_id, attempted_at) VALUES (:ip, :login_id, NOW())');
        $stmt->execute(['ip' => $ip, 'login_id' => $loginId]);
    } catch (Exception $e) {}
}

function resetLoginAttempts(string $loginId, string $ip): void {
    try {
        $db = getDB();
        $stmt = $db->prepare('DELETE FROM login_attempts WHERE ip_address = :ip OR login_id = :login_id');
        $stmt->execute(['ip' => $ip, 'login_id' => $loginId]);
    } catch (Exception $e) {}
}

/**
 * Membaca JSON Body dari php://input
 */
function getJsonInput(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Helper sanitasi output HTML (mencegah XSS)
 */
function escapeHtml(?string $str): string {
    return htmlspecialchars($str ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

