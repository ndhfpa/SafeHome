/**
 * SafeHome - Perumnas Pesona Cirebon Regency
 * Web Application Engine (Connected to PHP 8 & MySQL Backend)
 * - Zero Emojis (All Stroke SVG Icons)
 * - Exact User Color Palette via CSS Variables
 * - Database via PDO Prepared Statements
 * - PHP Session & HttpOnly Cookie Authentication
 * - Server-side Role Check & CSRF Protection
 * - Real Photo Upload (JPG/PNG/WebP)
 * - 10-Second Polling for Notifications & Emergencies
 */

// Custom SVG Icons Library (Stroke-only, currentColor)
const ICONS = {
  home: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  shield: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  pin: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  chart: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  bell: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  alert: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  clipboard: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  info: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  flag: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
  users: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  plus: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  camera: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  clock: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  phone: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  fire: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
  medical: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  crime: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2"/><line x1="18" y1="6" x2="22" y2="10"/><line x1="22" y1="6" x2="18" y2="10"/></svg>`,
  download: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  chevronRight: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevronLeft: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>`,
  check: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
  close: `<svg class="svg-icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  logout: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  fileText: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  search: `<svg class="svg-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  user: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  edit: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg class="svg-icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  lock: `<svg class="svg-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  eye: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg class="svg-icon" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
};

// ============================================================
//  STORAGE NAMESPACE
// ============================================================
const StorageNamespace = {
  prefix() {
    return 'safehome_';
  },

  getKey(base) {
    return `${this.prefix()}${base}`;
  }
};
window.StorageNamespace = StorageNamespace;

// ============================================================
//  UTILITY PASSWORD & XSS ESCAPING
// ============================================================
const PasswordUtil = {
  escape(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
window.PasswordUtil = PasswordUtil;

// Singkatan untuk escape output HTML (mencegah XSS dari data buatan pengguna)
const esc = (s) => PasswordUtil.escape(s);

// ============================================================
//  BACKEND API CLIENT (PHP 8 + MySQL)
// ============================================================
const ApiClient = {
  csrfToken: null,

  // Ambil token CSRF baru dari server (terikat ke sesi saat ini)
  async refreshCsrf() {
    try {
      const res = await fetch('api/auth.php?action=csrf', { credentials: 'include' });
      const json = await res.json();
      const token = (json && json.csrf_token) || (json && json.data && json.data.csrf_token) || null;
      if (token) this.csrfToken = token;
    } catch (e) {}
    return this.csrfToken;
  },

  async request(url, options = {}) {
    options.credentials = 'include';
    options.headers = options.headers || {};

    const method = (options.method || 'GET').toUpperCase();
    const needsCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method);

    if (needsCsrf) {
      if (!this.csrfToken) await this.refreshCsrf();
      if (this.csrfToken) {
        options.headers['X-CSRF-Token'] = this.csrfToken;
      }
    }

    try {
      const res = await fetch(url, options);
      const json = await res.json();

      if (json && json.csrf_token) {
        this.csrfToken = json.csrf_token;
      } else if (json && json.data && json.data.csrf_token) {
        this.csrfToken = json.data.csrf_token;
      }

      // Token basi / sesi berganti: ambil token baru lalu ulangi sekali
      if (needsCsrf && json && json.success === false && /csrf/i.test(json.message || '') && !options._retried) {
        options._retried = true;
        this.csrfToken = null;
        await this.refreshCsrf();
        return this.request(url, options);
      }

      return json;
    } catch (err) {
      console.warn('ApiClient request error:', url, err);
      return { success: false, message: 'Gagal menghubungi server SafeHome. Pastikan Apache & MySQL di XAMPP aktif.' };
    }
  },

  // Autentikasi
  async login(userId, password, role) {
    return this.request('api/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password, role })
    });
  },

  async logout() {
    return this.request('api/auth.php?action=logout', { method: 'POST' });
  },

  async me() {
    return this.request('api/auth.php?action=me');
  },

  async getCsrf() {
    return this.request('api/auth.php?action=csrf');
  },

  // Laporan
  async getLaporan(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`api/laporan.php?action=list&${q}`);
  },

  async getLaporanDetail(kode) {
    return this.request(`api/laporan.php?action=detail&kode=${encodeURIComponent(kode)}`);
  },

  async createLaporan(formData) {
    return this.request('api/laporan.php?action=create', {
      method: 'POST',
      body: formData // Mengirim FormData (foto multipart)
    });
  },

  async updateLaporanStatus(kode, status, catatan) {
    return this.request('api/laporan.php?action=update_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode, status, catatan })
    });
  },

  async eskalasiLaporan(kode, catatan) {
    return this.request('api/laporan.php?action=eskalasi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode, catatan })
    });
  },

  async ownerArahanLaporan(kode, arahan) {
    return this.request('api/laporan.php?action=owner_arahan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode, arahan })
    });
  },

  // Pengguna & Profil
  async getProfile() {
    return this.request('api/pengguna.php?action=profile');
  },

  async updateProfile(formData) {
    return this.request('api/pengguna.php?action=profile', {
      method: 'POST',
      body: formData
    });
  },

  async changePassword(oldPwd, newPwd, confirmPwd) {
    return this.request('api/pengguna.php?action=change_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_password: oldPwd, new_password: newPwd, confirm_password: confirmPwd })
    });
  },

  async getUsers(role = 'semua') {
    return this.request(`api/pengguna.php?action=list&role=${encodeURIComponent(role)}`);
  },

  async addSatpam(data) {
    return this.request('api/pengguna.php?action=add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async editUser(data) {
    return this.request('api/pengguna.php?action=edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async toggleUserActive(idLogin) {
    return this.request('api/pengguna.php?action=toggle_active', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_login: idLogin })
    });
  },

  async deleteUser(idLogin) {
    return this.request('api/pengguna.php?action=delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_login: idLogin })
    });
  },

  async resetUserPassword(idLogin) {
    return this.request('api/pengguna.php?action=reset_password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_login: idLogin })
    });
  },

  async getPendingRegistrations() {
    return this.request('api/pengguna.php?action=pending_registrations');
  },

  async approveRegistration(idLogin) {
    return this.request('api/pengguna.php?action=approve_registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_login: idLogin })
    });
  },

  async rejectRegistration(idLogin, alasan) {
    return this.request('api/pengguna.php?action=reject_registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_login: idLogin, alasan })
    });
  },

  async registerResident(data) {
    return this.request('api/pengguna.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async findId(name, phone) {
    return this.request(`api/pengguna.php?action=find_id&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
  },

  // Sinyal Darurat
  async sendEmergency(data) {
    return this.request('api/darurat.php?action=send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getEmergencies() {
    return this.request('api/darurat.php?action=list');
  },

  async resolveEmergency(kode) {
    return this.request('api/darurat.php?action=resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode })
    });
  },

  // Patroli
  async getPatrolCheckpoints() {
    return this.request('api/patroli.php?action=checkpoints');
  },

  async recordPatrol(idPos) {
    return this.request('api/patroli.php?action=record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_pos: idPos })
    });
  },

  // Notifikasi
  async getNotifications() {
    return this.request('api/notifikasi.php?action=list');
  },

  async getUnreadCount() {
    return this.request('api/notifikasi.php?action=unread_count');
  },

  async markNotificationsRead(id = 'all') {
    return this.request('api/notifikasi.php?action=mark_read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  },

  // Statistik
  async getStatistics() {
    return this.request('api/statistik.php');
  }
};
window.ApiClient = ApiClient;

// ============================================================
//  NORMALISASI DATA & STATE STORES (TERHUBUNG KE API)
// ============================================================
const SessionStore = {
  _user: null,

  set(user) {
    this._user = user;
    try {
      localStorage.setItem('safehome_session_user', JSON.stringify(user));
    } catch (e) {}
  },

  get() {
    if (this._user) return this._user;
    try {
      const raw = localStorage.getItem('safehome_session_user');
      if (raw) this._user = JSON.parse(raw);
    } catch (e) {}
    return this._user;
  },

  clear() {
    this._user = null;
    try {
      localStorage.removeItem('safehome_session_user');
    } catch (e) {}
  },

  getCurrentUser() {
    const u = this.get();
    if (!u) return null;
    return {
      ...u,
      id: u.id_login || u.id,
      name: u.nama || u.name,
      role: u.peran || u.role,
      phone: u.no_hp || u.phone || '',
      email: u.email || '',
      photo: u.foto || u.photo || '',
      blok: u.blok || '',
      nomorRumah: u.no_rumah || u.nomorRumah || '',
      shift: u.shift || '',
      shiftJam: u.shift_jam || u.shiftJam || '',
      pos: u.pos_jaga || u.pos || '',
      jabatan: u.jabatan || '',
      jenis_kelamin: u.jenis_kelamin || u.jk || '',
      active: u.aktif !== false
    };
  }
};

const AccountStore = {
  _accounts: [],

  getAll() {
    if (this._accounts.length === 0) {
      return this.getSeedAccounts();
    }
    return this._accounts;
  },

  setAll(accounts) {
    this._accounts = Array.isArray(accounts) ? accounts.map(a => ({
      ...a,
      id: a.id_login || a.id,
      name: a.nama || a.name,
      role: a.peran || a.role,
      phone: a.no_hp || a.phone || '',
      email: a.email || '',
      photo: a.foto || a.photo || '',
      blok: a.blok || '',
      nomorRumah: a.no_rumah || a.nomorRumah || '',
      shift: a.shift || '',
      shiftJam: a.shift_jam || a.shiftJam || '',
      pos: a.pos_jaga || a.pos || '',
      jabatan: a.jabatan || '',
      jenis_kelamin: a.jenis_kelamin || a.jk || '',
      accountStatus: a.status_akun || a.accountStatus || 'aktif',
      active: a.aktif !== 0 && a.aktif !== false
    })) : [];
  },

  getById(id) {
    const list = this.getAll();
    return list.find(a => (a.id === id || a.id_login === id)) || null;
  },

  getByRole(role) {
    return this.getAll().filter(a => (a.role === role || a.peran === role));
  },

  getSeedAccounts() {
    return [
      { id: 'C-12', role: 'penghuni', name: 'Bu Nadhif', phone: '08123456789', email: 'nadhif@email.com', blok: 'C', nomorRumah: '12', active: true, accountStatus: 'aktif' },
      { id: 'A-01', role: 'penghuni', name: 'Bambang Wijaya', phone: '08129876543', email: 'bambang@email.com', blok: 'A', nomorRumah: '01', active: true, accountStatus: 'aktif' },
      { id: 'A-3', role: 'penghuni', name: 'Andi Prasetyo', phone: '08132234556', email: 'andi@email.com', blok: 'A', nomorRumah: '3', active: true, accountStatus: 'aktif' },
      { id: 'D-8', role: 'penghuni', name: 'Siti Aminah', phone: '08189988776', email: 'siti@email.com', blok: 'D', nomorRumah: '8', active: true, accountStatus: 'aktif' },
      { id: 'E-21', role: 'penghuni', name: 'Joko Santoso', phone: '08571122334', email: 'joko@email.com', blok: 'E', nomorRumah: '21', active: true, accountStatus: 'aktif' },
      { id: 'B-5', role: 'penghuni', name: 'Dewi Lestari', phone: '08785544332', email: 'dewi@email.com', blok: 'B', nomorRumah: '5', active: true, accountStatus: 'aktif' },
      { id: 'SAT-01', role: 'satpam', name: 'Yusuf', phone: '08127788990', shift: 'Pagi', shiftJam: '06.00-14.00', pos: 'Pos Barat', active: true, accountStatus: 'aktif' },
      { id: 'SAT-02', role: 'satpam', name: 'Darmawan', phone: '08214455667', shift: 'Siang', shiftJam: '14.00-22.00', pos: 'Pos Gerbang Utama', active: true, accountStatus: 'aktif' },
      { id: 'SAT-03', role: 'satpam', name: 'Slamet', phone: '08563322114', shift: 'Malam', shiftJam: '22.00-06.00', pos: 'Patroli Keliling', active: true, accountStatus: 'aktif' },
      { id: 'SAT-04', role: 'satpam', name: 'Rudi', phone: '08119900112', shift: 'Cadangan', shiftJam: '', pos: 'Cadangan', active: true, accountStatus: 'aktif' },
      { id: 'SAT-10', role: 'satpam', name: 'Agus Prasetyo', phone: '08138899001', shift: 'Pagi', shiftJam: '06.00-14.00', pos: 'Pos Gerbang Barat', active: true, accountStatus: 'aktif' },
      { id: 'OWN-01', role: 'owner', name: 'Hendra Kusuma', phone: '08115566778', email: 'hendra@perumnas.id', jabatan: 'Owner Perumnas', active: true, accountStatus: 'aktif' },
      { id: 'DIR-01', role: 'direktur', name: 'Rina Anggraini', phone: '08119988776', email: 'rina@perumnas.id', jabatan: 'Direktur Operasional', active: true, accountStatus: 'aktif' }
    ];
  }
};

const ReportStore = {
  _reports: [],

  getAll() {
    return this._reports;
  },

  getById(id) {
    return this._reports.find(r => r.id === id) || null;
  },

  save(reports) {
    this._reports = Array.isArray(reports) ? reports : [];
  },

  add(report) {
    this._reports.unshift(report);
  },

  setAll(reports) {
    this._reports = Array.isArray(reports) ? reports : [];
  }
};

const RegistrationStore = {
  _pending: [],

  getAll() {
    return this._pending;
  },

  getPending() {
    return this._pending;
  },

  setAll(regs) {
    this._pending = Array.isArray(regs) ? regs : [];
  }
};

const NotificationStore = {
  _notifications: [],

  getAll() {
    return this._notifications;
  },

  setAll(notifs) {
    this._notifications = Array.isArray(notifs) ? notifs : [];
  },

  countUnread() {
    return this._notifications.filter(n => !n.isRead).length;
  }
};

const store = {
  data: {
    emergencyAlerts: [],
    patrolCheckpoints: [],
    blocks: [
      { id: 'A', name: 'Blok A', count: 3, status: 'Aman', topIncident: 'Lampu jalan mati', lastTime: '12 Okt 2026, 18.20' },
      { id: 'B', name: 'Blok B', count: 2, status: 'Aman', topIncident: 'Kendaraan salah parkir', lastTime: '11 Okt 2026, 09.15' },
      { id: 'C', name: 'Blok C', count: 4, status: 'Perhatian', topIncident: 'Gangguan ketertiban', lastTime: '16 Okt 2026, 14.05' },
      { id: 'D', name: 'Blok D', count: 8, status: 'Waspada', topIncident: 'Orang mencurigakan', lastTime: '16 Okt 2026, 14.31' },
      { id: 'E', name: 'Blok E', count: 5, status: 'Perhatian', topIncident: 'Pencurian', lastTime: '15 Okt 2026, 22.40' },
      { id: 'F', name: 'Blok F', count: 2, status: 'Aman', topIncident: 'Kucing masuk rumah', lastTime: '08 Okt 2026, 16.00' }
    ]
  },
  saveState() {}
};

// ============================================================
//  UI HELPERS
// ============================================================
function getInitial(name) {
  if (!name) return 'U';
  const clean = name.replace(/^(Pak|Bu|Bpk|Ibu|Mas|Mbak)\s+/i, '').trim();
  return clean ? clean.charAt(0).toUpperCase() : name.charAt(0).toUpperCase();
}

function avatarHtml(user, size = 32, font = 13) {
  if (!user) return '';
  if (user.photo || user.foto) {
    return `<img src="${esc(user.photo || user.foto)}" class="avatar-img" style="width:${size}px; height:${size}px; border-radius:var(--card-radius); object-fit:cover;">`;
  }
  const init = esc(getInitial(user.name || user.nama));
  let bg = 'var(--action-main)';
  if (user.role === 'satpam') bg = 'var(--status-diproses-text)';
  else if (user.role === 'owner') bg = 'var(--status-eskalasi-text)';
  else if (user.role === 'direktur') bg = '#5D3E8E';
  return `<div class="avatar-initial" style="width:${size}px; height:${size}px; border-radius:var(--card-radius); background:${bg}; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:${font}px;">${init}</div>`;
}

function getReporterName(reporterId) {
  const acc = AccountStore.getById(reporterId);
  return acc ? acc.name : reporterId;
}

function getAssigneeName(assignedToId) {
  const acc = AccountStore.getById(assignedToId);
  return acc ? acc.name : assignedToId;
}

function getGreetingTime() {
  const hr = new Date().getHours();
  if (hr >= 4 && hr < 11) return 'Selamat pagi';
  if (hr >= 11 && hr < 15) return 'Selamat siang';
  if (hr >= 15 && hr < 18) return 'Selamat sore';
  return 'Selamat malam';
}

// Sapaan berdasarkan jenis kelamin: L -> "Mas Nama", P -> "Mbak Nama", kosong -> "Nama"
function sapaanNama(user) {
  if (!user) return '';
  const nama = String(user.name || user.nama || '').replace(/^(Pak|Bu|Bpk|Ibu|Mas|Mbak)\s+/i, '').trim();
  const jk = user.jenis_kelamin || user.jk;
  const prefix = jk === 'L' ? 'Mas ' : (jk === 'P' ? 'Mbak ' : '');
  return prefix + nama;
}

function getCurrentShiftName() {
  const hr = new Date().getHours();
  if (hr >= 6 && hr < 14) return 'Pagi';
  if (hr >= 14 && hr < 22) return 'Siang';
  return 'Malam';
}

function getOnDutyGuard() {
  const shiftName = getCurrentShiftName();
  const guards = AccountStore.getByRole('satpam').filter(g => g.active && g.shift === shiftName);
  return guards.length > 0 ? guards[0] : null;
}

function formatDate() {
  const d = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function showFieldError(elId, msg) {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function clearFieldError(elId) {
  const el = document.getElementById(elId);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}

// Audio Synthesizer (Web Audio API)
const audioFeedback = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playChime() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  },
  playSiren() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.25);
      osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.7);
    } catch (e) {}
  }
};

// ============================================================
//  MAIN APPLICATION CONTROLLER
// ============================================================
const App = {
  activeRole: 'login',
  activeScreenId: 'screen-login',
  selectedLoginRole: null,
  selectedReportId: null,
  selectedBlockId: 'D',
  historyFilter: 'Semua',
  ownerFilter: 'Semua',
  userTab: 'penghuni',
  reportPeriodTab: 'mingguan',
  _previousScreen: null,
  _profilePhotoData: null,
  _removeProfilePhoto: false,
  _registeredId: null,
  _pollingInterval: null,

  async init() {
    this.setupEventListeners();
    this.setupPasswordToggles();

    // Cek Sesi Aktif dari Backend PHP
    try {
      const meRes = await ApiClient.me();
      if (meRes && meRes.success && meRes.data && meRes.data.authenticated && meRes.data.user) {
        const user = meRes.data.user;
        SessionStore.set(user);
        this.activeRole = user.peran;
        this.syncCurrentRole();

        const homeScreens = {
          penghuni: 'screen-penghuni-home',
          satpam: 'screen-satpam-inbox',
          owner: 'screen-owner-pantau',
          direktur: 'screen-direktur-summary'
        };
        this.navigateTo(homeScreens[user.peran] || 'screen-login');
      } else {
        SessionStore.clear();
        this.activeRole = 'login';
        this.syncCurrentRole();
        this.navigateTo('screen-login');

        // Kosongkan input login untuk mencegah autofill browser liar (kecuali sedang difokus)
        const clearLoginInputsIfNotFocused = () => {
          const idInput = document.getElementById('login-user-id');
          const passInput = document.getElementById('login-password');
          if (idInput && document.activeElement !== idInput) {
            idInput.value = '';
          }
          if (passInput && document.activeElement !== passInput) {
            passInput.value = '';
          }
        };

        setTimeout(clearLoginInputsIfNotFocused, 0);
        setTimeout(clearLoginInputsIfNotFocused, 300);
        setTimeout(clearLoginInputsIfNotFocused, 1000);
      }
    } catch (err) {
      console.warn('Init auth check error:', err);
    }

    // Ambil Data Laporan Awal
    await this.fetchReports();

    // Mulai Polling Tiap 10 Detik
    this.startPolling();

    this.updateClock();
    setInterval(() => this.updateClock(), 30000);
  },

  // Polling Tiap 10 Detik untuk Notifikasi & Sinyal Darurat
  startPolling() {
    if (this._pollingInterval) clearInterval(this._pollingInterval);
    this._pollingInterval = setInterval(async () => {
      if (this.activeRole === 'login') return;
      try {
        const res = await ApiClient.getUnreadCount();
        if (res && res.success && res.data) {
          const count = res.data.unreadCount || 0;
          const emergencyCount = res.data.activeEmergency || 0;

          // Update Badge Notifikasi Topbar / Sidebar
          const notifBadges = document.querySelectorAll('.notification-badge-count, #badge-pendaftaran');
          notifBadges.forEach(b => {
            if (count > 0) {
              b.textContent = count;
              b.style.display = 'inline-flex';
            } else {
              b.style.display = 'none';
            }
          });

          // Peringatan Darurat Aktif untuk Satpam & Owner
          if (emergencyCount > 0 && ['satpam', 'owner'].includes(this.activeRole)) {
            const emgBanner = document.getElementById('satpam-emergency-banner');
            if (emgBanner && emgBanner.style.display === 'none') {
              this.renderSatpamInbox();
              audioFeedback.playSiren();
            }
          }
        }
      } catch (e) {}
    }, 10000);
  },

  async fetchReports(params = {}) {
    try {
      const res = await ApiClient.getLaporan(params);
      if (res && res.success && Array.isArray(res.data)) {
        ReportStore.setAll(res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('fetchReports error:', e);
    }
    return ReportStore.getAll();
  },

  async fetchUsers(role = 'semua') {
    try {
      const res = await ApiClient.getUsers(role);
      if (res && res.success && Array.isArray(res.data)) {
        AccountStore.setAll(res.data);
        return res.data;
      }
    } catch (e) {
      console.warn('fetchUsers error:', e);
    }
    return AccountStore.getAll();
  },

  updateClock() {
    const d = new Date();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${mins}`;
    document.querySelectorAll('.clock-live-time').forEach(el => el.textContent = timeStr);
  },

  showToast(message) {
    const toast = document.getElementById('global-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    audioFeedback.playChime();
    setTimeout(() => toast.classList.remove('show'), 2800);
  },

  getStatusChipHtml(status) {
    let chipClass = 'chip-baru';
    if (status === 'Diproses') chipClass = 'chip-diproses';
    else if (status === 'Eskalasi') chipClass = 'chip-eskalasi';
    else if (status === 'Selesai') chipClass = 'chip-selesai';
    else if (status === 'Diterima') chipClass = 'chip-diterima';
    else if (status === 'Darurat') chipClass = 'chip-darurat';
    else if (status === 'menunggu' || status === 'Menunggu') chipClass = 'chip-menunggu';
    else if (status === 'ditolak' || status === 'Ditolak') chipClass = 'chip-ditolak';
    return `<span class="chip-status ${chipClass}">${esc(status)}</span>`;
  },

  // ============ ROLE & NAVIGATION ============
  switchRole(role) {
    this.activeRole = role;
    this.syncCurrentRole();

    if (role === 'login') {
      this.navigateTo('screen-login');
      return;
    }

    const homeScreens = {
      penghuni: 'screen-penghuni-home',
      satpam: 'screen-satpam-inbox',
      owner: 'screen-owner-pantau',
      direktur: 'screen-direktur-summary'
    };
    this.navigateTo(homeScreens[role] || 'screen-login');
    this.render();
  },

  async logout() {
    try {
      await ApiClient.logout();
    } catch (e) {}

    SessionStore.clear();
    // Sesi server dihancurkan saat logout, jadi token CSRF lama tidak berlaku lagi
    ApiClient.csrfToken = null;
    this.selectedLoginRole = null;
    this._profilePhotoData = null;

    document.querySelectorAll('.login-role-choice').forEach(c => c.classList.remove('selected'));
    const errorEl = document.getElementById('login-error-msg');
    if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
    const userIdInput = document.getElementById('login-user-id');
    const passInput = document.getElementById('login-password');
    if (userIdInput) userIdInput.value = '';
    if (passInput) passInput.value = '';

    this.switchRole('login');
    this.showToast('Anda telah keluar dari aplikasi.');
  },

  syncCurrentRole() {
    const isLogin = this.activeRole === 'login';
    const sidebar = document.getElementById('app-sidebar');
    const topbar = document.getElementById('app-topbar');

    if (sidebar) sidebar.style.display = isLogin ? 'none' : 'flex';
    if (topbar) topbar.style.display = isLogin ? 'none' : 'flex';

    if (isLogin) {
      return;
    }

    const user = SessionStore.getCurrentUser();
    if (!user) return;

    // Sidebar user info
    const nameEl = document.getElementById('sidebar-user-name');
    const idEl = document.getElementById('sidebar-user-id');
    const roleEl = document.getElementById('sidebar-user-role');
    const initialEl = document.getElementById('sidebar-user-initial');

    if (nameEl) nameEl.textContent = user.name;
    if (idEl) idEl.textContent = `ID: ${user.id}`;

    let roleText = '';
    if (user.role === 'penghuni') roleText = `Penghuni \u00b7 Blok ${user.blok} No. ${user.nomorRumah}`;
    else if (user.role === 'satpam') roleText = `Satpam \u00b7 ${user.id}`;
    else if (user.role === 'owner') roleText = user.jabatan || 'Owner Perumnas';
    else if (user.role === 'direktur') roleText = user.jabatan || 'Direktur';
    if (roleEl) roleEl.textContent = roleText;

    if (initialEl) {
      if (user.photo) {
        initialEl.innerHTML = `<img src="${esc(user.photo)}" class="avatar-img" style="width:100%;height:100%;border-radius:inherit;object-fit:cover;">`;
      } else {
        initialEl.textContent = getInitial(user.name);
      }
    }

    // Topbar user info
    const topAvatarEl = document.getElementById('topbar-user-avatar');
    const topNameEl = document.getElementById('topbar-user-name');
    if (topNameEl) topNameEl.textContent = user.name;
    if (topAvatarEl) {
      if (user.photo) {
        topAvatarEl.innerHTML = `<img src="${esc(user.photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
      } else {
        topAvatarEl.textContent = getInitial(user.name);
      }
    }

    this.renderNavigationLinks();
  },

  renderNavigationLinks() {
    const sidebarNav = document.getElementById('sidebar-nav-links');
    const mobileNav = document.getElementById('mobile-bottom-nav');
    if (!sidebarNav) return;

    let links = [];

    if (this.activeRole === 'penghuni') {
      links = [
        { screen: 'screen-penghuni-home', label: 'Beranda', icon: ICONS.home },
        { screen: 'screen-penghuni-lapor', label: 'Lapor Kejadian', icon: ICONS.plus },
        { screen: 'screen-penghuni-riwayat', label: 'Riwayat Laporan', icon: ICONS.clipboard },
        { screen: 'screen-penghuni-info', label: 'Info Lingkungan', icon: ICONS.info },
        { screen: 'screen-penghuni-darurat', label: 'Darurat', icon: ICONS.alert, isEmergency: true },
        { screen: 'screen-profil', label: 'Profil Saya', icon: ICONS.user }
      ];
    } else if (this.activeRole === 'satpam') {
      links = [
        { screen: 'screen-satpam-inbox', label: 'Laporan Masuk', icon: ICONS.bell },
        { screen: 'screen-satpam-patroli', label: 'Jadwal Patroli', icon: ICONS.flag },
        { screen: 'screen-profil', label: 'Profil Saya', icon: ICONS.user }
      ];
    } else if (this.activeRole === 'owner') {
      links = [
        { screen: 'screen-owner-pantau', label: 'Pemantauan Blok', icon: ICONS.pin },
        { screen: 'screen-owner-laporan', label: 'Semua Laporan', icon: ICONS.clipboard },
        { screen: 'screen-owner-satpam', label: 'Kinerja Satpam', icon: ICONS.shield },
        { screen: 'screen-owner-pengguna', label: 'Kelola Pengguna', icon: ICONS.users },
        { screen: 'screen-profil', label: 'Profil Saya', icon: ICONS.user }
      ];
    } else if (this.activeRole === 'direktur') {
      links = [
        { screen: 'screen-direktur-summary', label: 'Ringkasan', icon: ICONS.chart },
        { screen: 'screen-direktur-laporan', label: 'Laporan Periodik', icon: ICONS.fileText },
        { screen: 'screen-profil', label: 'Profil Saya', icon: ICONS.user }
      ];
    }

    sidebarNav.innerHTML = links.map(item => `
      <button class="sidebar-link ${item.isEmergency ? 'link-emergency' : ''} ${item.screen === this.activeScreenId ? 'active' : ''}" onclick="App.navigateTo('${item.screen}')">
        ${item.icon}
        <span>${item.label}</span>
      </button>
    `).join('');

    if (mobileNav) {
      mobileNav.innerHTML = links.map(item => `
        <button class="mobile-nav-item ${item.screen === this.activeScreenId ? 'active' : ''}" onclick="App.navigateTo('${item.screen}')">
          ${item.icon}
          <span>${item.label}</span>
        </button>
      `).join('');
    }
  },

  navigateTo(screenId, params = {}) {
    if (screenId !== 'screen-profil') {
      this._previousScreen = this.activeScreenId;
    }
    this.activeScreenId = screenId;

    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (params.reportId) this.selectedReportId = params.reportId;

    // Sembunyikan kembali semua kata sandi saat pindah layar
    this.resetPasswordToggles();

    const titleEl = document.getElementById('topbar-page-title');
    if (titleEl) {
      const titles = {
        'screen-login': 'Masuk ke SafeHome',
        'screen-register': 'Pendaftaran Penghuni',
        'screen-profil': 'Profil Saya',
        'screen-penghuni-home': 'Beranda Penghuni',
        'screen-penghuni-lapor': 'Formulir Lapor Kejadian',
        'screen-penghuni-riwayat': 'Riwayat Laporan Warga',
        'screen-penghuni-detail': 'Detail Penanganan Laporan',
        'screen-penghuni-info': 'Info Keamanan Lingkungan',
        'screen-penghuni-darurat': 'Sinyal Darurat Cepat',
        'screen-satpam-inbox': 'Laporan Masuk & Antrean',
        'screen-satpam-detail': 'Tindak Lanjut Satpam',
        'screen-satpam-patroli': 'Jadwal & Catatan Patroli',
        'screen-owner-pantau': 'Pemantauan Keamanan per Blok',
        'screen-owner-laporan': 'Daftar Seluruh Laporan',
        'screen-owner-satpam': 'Evaluasi Kinerja Satpam',
        'screen-owner-pengguna': 'Manajemen Akun Pengguna',
        'screen-direktur-summary': 'Dashboard Ringkasan Eksekutif',
        'screen-direktur-laporan': 'Laporan Periodik & Arsip'
      };
      titleEl.textContent = titles[screenId] || 'SafeHome';
    }

    if (screenId === 'screen-owner-pengguna') {
      this._updatePendaftaranBadge();
    }

    if (screenId === 'screen-register') {
      const formPanel = document.getElementById('register-form-panel');
      const successPanel = document.getElementById('register-success-panel');
      if (formPanel) formPanel.style.display = 'block';
      if (successPanel) successPanel.style.display = 'none';
      ['reg-name','reg-nomor','reg-phone','reg-email','reg-password','reg-password2'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      document.querySelectorAll('input[name="reg-jk"]').forEach(r => { r.checked = false; });
      document.querySelectorAll('#reg-blok-picker button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.field-error-msg').forEach(el => { el.textContent = ''; el.style.display = 'none'; });
      const regErr = document.getElementById('register-error-msg');
      if (regErr) { regErr.textContent = ''; regErr.style.display = 'none'; }
    }

    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    this.renderNavigationLinks();
    this.render();
  },

  navigateBackFromProfile() {
    const prev = this._previousScreen;
    if (prev && prev !== 'screen-profil') {
      this.navigateTo(prev);
    } else {
      const homeScreens = {
        penghuni: 'screen-penghuni-home',
        satpam: 'screen-satpam-inbox',
        owner: 'screen-owner-pantau',
        direktur: 'screen-direktur-summary'
      };
      this.navigateTo(homeScreens[this.activeRole] || 'screen-login');
    }
  },

  toggleMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
  },

  // ============ TOMBOL MATA (LIHAT / SEMBUNYIKAN KATA SANDI) ============
  setupPasswordToggles() {
    // Gaya tombol mata (disisipkan sekali dari sini, tidak perlu mengubah style.css)
    if (!document.getElementById('password-toggle-style')) {
      const style = document.createElement('style');
      style.id = 'password-toggle-style';
      style.textContent = `
        .password-field { position: relative; display: block; width: 100%; }
        .password-field > input { width: 100%; padding-right: 46px; box-sizing: border-box; }
        .password-toggle-btn {
          position: absolute; top: 50%; right: 8px; transform: translateY(-50%);
          width: 32px; height: 32px; padding: 0; border: none; background: transparent;
          color: var(--action-text); cursor: pointer; border-radius: var(--card-radius);
          display: inline-flex; align-items: center; justify-content: center;
        }
        .password-toggle-btn:hover { background: var(--bg-page); color: var(--action-main); }
        .password-toggle-btn:focus-visible { outline: 2px solid var(--action-main); outline-offset: 1px; }
        .password-toggle-btn .svg-icon { width: 18px; height: 18px; }
      `;
      document.head.appendChild(style);
    }

    document.querySelectorAll('input[type="password"]').forEach(input => {
      if (input.dataset.eyeReady) return;
      input.dataset.eyeReady = '1';

      // Bungkus input agar tombol mata bisa diletakkan di dalam kolom
      const wrapper = document.createElement('div');
      wrapper.className = 'password-field';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'password-toggle-btn';
      btn.setAttribute('aria-label', 'Tampilkan kata sandi');
      btn.title = 'Tampilkan kata sandi';
      btn.innerHTML = ICONS.eye;
      wrapper.appendChild(btn);

      btn.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
        const label = show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi';
        btn.setAttribute('aria-label', label);
        btn.title = label;
        // Kolom login memakai readonly sampai difokus; buka agar bisa langsung diketik
        input.removeAttribute('readonly');
        input.focus();
      });
    });
  },

  resetPasswordToggles() {
    document.querySelectorAll('.password-field').forEach(wrapper => {
      const input = wrapper.querySelector('input');
      const btn = wrapper.querySelector('.password-toggle-btn');
      if (input && input.type !== 'password') {
        input.type = 'password';
        if (btn) {
          btn.innerHTML = ICONS.eye;
          btn.setAttribute('aria-label', 'Tampilkan kata sandi');
          btn.title = 'Tampilkan kata sandi';
        }
      }
    });
  },

  // ============ EVENT LISTENERS ============
  setupEventListeners() {
    const errorEl = document.getElementById('login-error-msg');
    const showLoginError = (msg) => {
      if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
    };
    const hideLoginError = () => {
      if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
    };

    document.getElementById('login-user-id')?.addEventListener('input', hideLoginError);
    document.getElementById('login-password')?.addEventListener('input', hideLoginError);

    // Kartu pemilihan peran "Masuk sebagai"
    document.querySelectorAll('.login-role-choice').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.login-role-choice').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedLoginRole = card.dataset.role;
        hideLoginError();
      });
    });

    // Form Submit Login (Autentikasi ke Backend PHP & Rate Limiter)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideLoginError();

        const userId = (document.getElementById('login-user-id').value || '').trim();
        const password = (document.getElementById('login-password').value || '').trim();

        if (!userId) {
          showLoginError('Nomor rumah atau ID petugas wajib diisi.');
          document.getElementById('login-user-id').focus();
          return;
        }

        if (!password) {
          showLoginError('Kata sandi wajib diisi.');
          document.getElementById('login-password').focus();
          return;
        }

        if (!this.selectedLoginRole) {
          showLoginError('Pilih salah satu peran terlebih dahulu.');
          return;
        }

        // Panggil endpoint autentikasi PHP
        const res = await ApiClient.login(userId, password, this.selectedLoginRole);
        if (!res || !res.success) {
          showLoginError((res && res.message) || 'Gagal masuk ke aplikasi.');
          return;
        }

        const user = res.data.user;
        SessionStore.set(user);
        this.switchRole(user.peran);
        this.showToast(`Selamat datang, ${sapaanNama(user)}!`);
        await this.fetchReports();
      });
    }

    // Blok picker pada pendaftaran
    document.querySelectorAll('#reg-blok-picker button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#reg-blok-picker button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        clearFieldError('err-reg-blok');
      });
    });

    // Hapus pesan error jenis kelamin begitu radio dipilih
    document.querySelectorAll('input[name="reg-jk"]').forEach(r => {
      r.addEventListener('change', () => clearFieldError('err-reg-jk'));
    });

    // Form Submit Pendaftaran Penghuni
    const regForm = document.getElementById('form-register');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }

    // Form Submit Lapor Kejadian
    const laporForm = document.getElementById('form-lapor');
    if (laporForm) {
      laporForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateReport();
      });
    }

    // Chip & Blok Picker di Form Lapor
    document.querySelectorAll('#form-lapor .chip-choice-btn:not(.urgency-choice-btn)').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#form-lapor .chip-choice-btn:not(.urgency-choice-btn)').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.querySelectorAll('#form-lapor .block-picker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#form-lapor .block-picker-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    document.querySelectorAll('#form-lapor .urgency-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#form-lapor .urgency-choice-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Upload Foto Bukti Laporan
    const photoBox = document.getElementById('photo-uploader-box');
    const photoInput = document.getElementById('photo-file-input');
    if (photoBox && photoInput) {
      photoBox.addEventListener('click', () => photoInput.click());
      photoInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        const container = document.getElementById('photo-previews-list');
        if (!container) return;
        container.innerHTML = '';
        files.forEach(file => {
          if (file.size > 2 * 1024 * 1024) {
            this.showToast('Foto ' + file.name + ' melebihi 2 MB.');
            return;
          }
          const reader = new FileReader();
          reader.onload = (ev) => {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'position:relative; width:64px; height:64px; border-radius:var(--card-radius); overflow:hidden; border:1px solid var(--card-border);';
            wrap.innerHTML = `<img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
            container.appendChild(wrap);
          };
          reader.readAsDataURL(file);
        });
      });
    }

    // Form Profil & Ubah Kata Sandi
    document.getElementById('form-profile')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSaveProfile();
    });

    document.getElementById('form-change-password')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleChangePassword();
    });

    // Upload Foto Profil (maksimal 1 MB, sesuai teks di halaman & batas server)
    document.getElementById('profile-photo-input')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 1 * 1024 * 1024) {
        showFieldError('err-profile-photo', 'Ukuran foto profil maksimal 1 MB.');
        e.target.value = '';
        return;
      }
      clearFieldError('err-profile-photo');
      const reader = new FileReader();
      reader.onload = (ev) => {
        this._profilePhotoData = ev.target.result;
        this._removeProfilePhoto = false;
        const avatar = document.getElementById('profile-avatar-display');
        if (avatar) avatar.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
        const btnRemove = document.getElementById('btn-remove-profile-photo');
        if (btnRemove) btnRemove.style.display = 'inline-flex';
      };
      reader.readAsDataURL(file);
    });

    // Catatan: tab Riwayat (Penghuni) dan tab Semua Laporan (Owner) memakai onclick
    // di index.html (setHistoryFilter / setOwnerReportFilter), jadi tidak ada listener ganda di sini.

    // Tabs Owner Pengguna
    document.querySelectorAll('.owner-user-tab').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.owner-user-tab').forEach(tab => tab.classList.remove('active'));
        t.classList.add('active');
        this.userTab = t.dataset.tab;
        this.renderOwnerUsers();
      });
    });

    // Search Owner Laporan
    document.getElementById('owner-search-reports')?.addEventListener('input', () => {
      this.renderOwnerReports();
    });

    // Tabs Periode Laporan Direktur
    document.querySelectorAll('.period-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.reportPeriodTab = btn.dataset.period;
        this.renderDirectorReports();
      });
    });

    // Pilihan jenis darurat (Layar 7) & tombol kirim sinyal darurat
    document.querySelectorAll('.emergency-type-box').forEach(box => {
      box.addEventListener('click', () => {
        document.querySelectorAll('.emergency-type-box').forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = '';
        });
        box.classList.add('selected');
        box.style.borderColor = 'var(--emergency)';
      });
    });

    document.getElementById('btn-send-emergency')?.addEventListener('click', () => {
      const selected = document.querySelector('.emergency-type-box.selected');
      const type = selected ? selected.dataset.type : 'Kejahatan';
      this.handleEmergencyAlert(type);
    });
  },

  // ============ PROFIL & PASSWORD ============
  renderProfile() {
    const user = SessionStore.getCurrentUser();
    if (!user) return;

    const idInput = document.getElementById('profile-login-id');
    const nameInput = document.getElementById('profile-name');
    const phoneInput = document.getElementById('profile-phone');
    const emailInput = document.getElementById('profile-email');
    const avatar = document.getElementById('profile-avatar-display');
    const btnRemove = document.getElementById('btn-remove-profile-photo');

    if (idInput) idInput.value = user.id;
    if (nameInput) nameInput.value = user.name;
    if (phoneInput) phoneInput.value = user.phone;
    if (emailInput) emailInput.value = user.email || '';

    // Jenis kelamin
    const radioL = document.getElementById('profile-jk-l');
    const radioP = document.getElementById('profile-jk-p');
    if (radioL) radioL.checked = user.jenis_kelamin === 'L';
    if (radioP) radioP.checked = user.jenis_kelamin === 'P';

    if (avatar) {
      if (user.photo) {
        avatar.innerHTML = `<img src="${esc(user.photo)}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
        if (btnRemove) btnRemove.style.display = 'inline-flex';
      } else {
        avatar.textContent = getInitial(user.name);
        if (btnRemove) btnRemove.style.display = 'none';
      }
    }
  },

  removeProfilePhoto() {
    this._profilePhotoData = null;
    this._removeProfilePhoto = true;
    const user = SessionStore.getCurrentUser();
    const avatar = document.getElementById('profile-avatar-display');
    if (avatar) avatar.textContent = getInitial(user ? user.name : 'U');
    const btnRemove = document.getElementById('btn-remove-profile-photo');
    if (btnRemove) btnRemove.style.display = 'none';
    const photoInput = document.getElementById('profile-photo-input');
    if (photoInput) photoInput.value = '';
  },

  async handleSaveProfile() {
    clearFieldError('err-profile-name');
    clearFieldError('err-profile-phone');
    clearFieldError('err-profile-email');

    const name = (document.getElementById('profile-name')?.value || '').trim();
    const phone = (document.getElementById('profile-phone')?.value || '').trim();
    const email = (document.getElementById('profile-email')?.value || '').trim();

    let hasError = false;
    if (!name || name.length < 3) {
      showFieldError('err-profile-name', 'Nama lengkap minimal 3 karakter.');
      hasError = true;
    }

    if (phone && !/^\d{10,13}$/.test(phone.replace(/\D/g, ''))) {
      showFieldError('err-profile-phone', 'Nomor HP harus 10-13 digit angka (contoh: 08123456789).');
      hasError = true;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('err-profile-email', 'Format email tidak valid.');
      hasError = true;
    }

    if (hasError) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    const jkEl = document.querySelector('input[name="profile-jk"]:checked');
    if (jkEl) formData.append('jenis_kelamin', jkEl.value);

    const fileInput = document.getElementById('profile-photo-input');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append('foto', fileInput.files[0]);
    } else if (this._removeProfilePhoto) {
      formData.append('remove_photo', '1');
    }

    const res = await ApiClient.updateProfile(formData);
    if (res && res.success) {
      SessionStore.set(res.data);
      this._removeProfilePhoto = false;
      this.syncCurrentRole();
      this.render();
      this.showToast('Profil berhasil diperbarui');
    } else {
      this.showToast((res && res.message) || 'Gagal memperbarui profil.');
    }
  },

  async handleChangePassword() {
    clearFieldError('err-pwd-old');
    clearFieldError('err-pwd-new');
    clearFieldError('err-pwd-confirm');

    const oldPwd = (document.getElementById('pwd-old')?.value || '').trim();
    const newPwd = (document.getElementById('pwd-new')?.value || '').trim();
    const confirmPwd = (document.getElementById('pwd-confirm')?.value || '').trim();

    let hasError = false;
    if (!oldPwd) {
      showFieldError('err-pwd-old', 'Kata sandi lama wajib diisi.');
      hasError = true;
    }
    if (!newPwd) {
      showFieldError('err-pwd-new', 'Kata sandi baru wajib diisi.');
      hasError = true;
    } else if (newPwd.length < 8) {
      showFieldError('err-pwd-new', 'Kata sandi baru minimal 8 karakter.');
      hasError = true;
    }
    if (!confirmPwd) {
      showFieldError('err-pwd-confirm', 'Konfirmasi kata sandi wajib diisi.');
      hasError = true;
    } else if (newPwd !== confirmPwd) {
      showFieldError('err-pwd-confirm', 'Konfirmasi tidak sama dengan kata sandi baru.');
      hasError = true;
    }

    if (hasError) return;

    const res = await ApiClient.changePassword(oldPwd, newPwd, confirmPwd);
    if (res && res.success) {
      document.getElementById('pwd-old').value = '';
      document.getElementById('pwd-new').value = '';
      document.getElementById('pwd-confirm').value = '';
      this.showToast('Kata sandi berhasil diperbarui');
    } else {
      showFieldError('err-pwd-old', (res && res.message) || 'Gagal memperbarui kata sandi.');
    }
  },

  copyProfileId() {
    const idInput = document.getElementById('profile-login-id');
    if (idInput && idInput.value) {
      navigator.clipboard?.writeText(idInput.value);
      this.showToast('ID Login disalin ke papan klip.');
    }
  },

  copyRegisteredId() {
    if (this._registeredId) {
      navigator.clipboard?.writeText(this._registeredId);
      this.showToast('ID Login disalin ke papan klip.');
    }
  },

  // ============ REPORT HANDLERS ============
  async handleCreateReport() {
    const activeCat = document.querySelector('#form-lapor .chip-choice-btn.active');
    const category = activeCat ? activeCat.dataset.val : 'Lainnya';

    const activeBlock = document.querySelector('#form-lapor .block-picker-btn.active');
    const block = activeBlock ? activeBlock.dataset.val : 'D';

    const locationDetail = (document.getElementById('lapor-titik-lokasi')?.value || '').trim() || `Blok ${block}`;
    const desc = (document.getElementById('lapor-deskripsi')?.value || '').trim();

    if (!desc) {
      this.showToast('Ceritakan apa yang terjadi terlebih dahulu.');
      document.getElementById('lapor-deskripsi')?.focus();
      return;
    }

    const activeUrgency = document.querySelector('#form-lapor .urgency-choice-btn.active');
    const urgency = activeUrgency ? activeUrgency.dataset.val : 'Sedang';

    const formData = new FormData();
    formData.append('category', category);
    formData.append('block', block);
    formData.append('location', locationDetail);
    formData.append('description', desc);
    formData.append('urgency', urgency);

    const fileInput = document.getElementById('photo-file-input');
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append('foto_bukti', fileInput.files[0]);
    }

    const res = await ApiClient.createLaporan(formData);
    if (res && res.success) {
      document.getElementById('lapor-titik-lokasi').value = '';
      document.getElementById('lapor-deskripsi').value = '';
      if (document.getElementById('photo-previews-list')) {
        document.getElementById('photo-previews-list').innerHTML = '';
      }
      if (fileInput) fileInput.value = '';

      audioFeedback.playChime();
      this.showToast(`Laporan ${res.data.id} berhasil dikirim!`);
      await this.fetchReports();
      this.navigateTo('screen-penghuni-riwayat');
    } else {
      this.showToast((res && res.message) || 'Gagal mengirim laporan.');
    }
  },

  // ============ DARURAT HANDLER ============
  async handleEmergencyAlert(type) {
    const user = SessionStore.getCurrentUser();
    const block = user && user.blok ? user.blok : 'C';
    const location = user ? `Blok ${block} No. ${user.nomorRumah || '12'}` : 'Blok C';

    const res = await ApiClient.sendEmergency({ type, block, location });
    if (res && res.success) {
      audioFeedback.playSiren();
      this.showToast(`Sinyal darurat ${type} dikirim ke satpam!`);
      this.closeModal();
      this.render();
    } else {
      this.showToast((res && res.message) || 'Gagal mengirim sinyal darurat.');
    }
  },

  // ============ SATPAM HANDLERS ============
  async satpamAcceptReport(reportId) {
    const res = await ApiClient.updateLaporanStatus(reportId, 'Diproses', 'Petugas menerima tugas dan langsung menuju lokasi.');
    if (res && res.success) {
      audioFeedback.playChime();
      this.showToast(`Laporan ${reportId} diterima! Menuju lokasi.`);
      await this.fetchReports();
      this.render();
    } else {
      this.showToast((res && res.message) || 'Gagal memperbarui status.');
    }
  },

  async satpamEscalateReport(reportId) {
    const res = await ApiClient.eskalasiLaporan(reportId, 'Kejadian berisiko tinggi diteruskan langsung ke Owner Perumnas untuk arahan lanjutan.');
    if (res && res.success) {
      audioFeedback.playChime();
      this.showToast(`Laporan ${reportId} dieskalasi ke Owner Perumnas!`);
      await this.fetchReports();
      this.render();
    } else {
      this.showToast((res && res.message) || 'Gagal eskalasi.');
    }
  },

  satpamResolveReport(reportId) {
    this.openModal('Selesaikan Penanganan Laporan', `
      <div class="form-group">
        <label class="form-label">Catatan Hasil Penanganan</label>
        <textarea id="modal-resolution-notes" class="form-textarea" placeholder="Contoh: Petugas telah memeriksa lokasi, situasi kondusif dan aman."></textarea>
      </div>
    `, async () => {
      const note = (document.getElementById('modal-resolution-notes')?.value || '').trim() || 'Penanganan selesai dan kondisi aman terkendali.';
      const res = await ApiClient.updateLaporanStatus(reportId, 'Selesai', note);
      if (res && res.success) {
        this.closeModal();
        this.showToast(`Laporan ${reportId} berhasil diselesaikan!`);
        await this.fetchReports();
        this.render();
      } else {
        this.showToast((res && res.message) || 'Gagal menyelesaikan laporan.');
      }
    }, 'Simpan & Selesaikan');
  },

  async checkinPatrol(checkpointId) {
    const res = await ApiClient.recordPatrol(checkpointId);
    if (res && res.success) {
      audioFeedback.playChime();
      this.showToast(`Titik patroli ${checkpointId} berhasil dicatat.`);
      this.renderSatpamPatroli();
    } else {
      this.showToast((res && res.message) || 'Gagal mencatat pos patroli.');
    }
  },

  // ============ PENDAFTARAN PENGHUNI ============
  async handleRegister() {
    const name = (document.getElementById('reg-name')?.value || '').trim();
    const jkEl = document.querySelector('input[name="reg-jk"]:checked');
    const jenisKelamin = jkEl ? jkEl.value : '';
    const activeBlok = document.querySelector('#reg-blok-picker button.active');
    const blok = activeBlok ? activeBlok.dataset.val : '';
    const nomor = (document.getElementById('reg-nomor')?.value || '').trim();
    const phone = (document.getElementById('reg-phone')?.value || '').replace(/\D/g, '');
    const email = (document.getElementById('reg-email')?.value || '').trim();
    const password = document.getElementById('reg-password')?.value || '';
    const password2 = document.getElementById('reg-password2')?.value || '';

    ['err-reg-name', 'err-reg-jk', 'err-reg-blok', 'err-reg-nomor', 'err-reg-phone',
     'err-reg-email', 'err-reg-password', 'err-reg-password2'].forEach(clearFieldError);
    const regErr = document.getElementById('register-error-msg');
    if (regErr) { regErr.textContent = ''; regErr.style.display = 'none'; }

    let valid = true;
    if (!name || name.length < 3) {
      showFieldError('err-reg-name', 'Nama lengkap minimal 3 karakter.');
      valid = false;
    }
    if (!jenisKelamin) {
      showFieldError('err-reg-jk', 'Pilih jenis kelamin (Laki-laki / Perempuan).');
      valid = false;
    }
    if (!blok) {
      showFieldError('err-reg-blok', 'Pilih salah satu blok.');
      valid = false;
    }
    if (!nomor || !/^\d+$/.test(nomor)) {
      showFieldError('err-reg-nomor', 'Nomor rumah wajib berupa angka.');
      valid = false;
    }
    if (!/^\d{10,13}$/.test(phone)) {
      showFieldError('err-reg-phone', 'Nomor HP harus 10-13 digit angka.');
      valid = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError('err-reg-email', 'Format email tidak valid.');
      valid = false;
    }
    if (!password || password.length < 8) {
      showFieldError('err-reg-password', 'Kata sandi minimal 8 karakter.');
      valid = false;
    }
    if (password !== password2) {
      showFieldError('err-reg-password2', 'Konfirmasi kata sandi tidak cocok.');
      valid = false;
    }

    if (!valid) return;

    const res = await ApiClient.registerResident({
      name,
      jenis_kelamin: jenisKelamin,
      blok,
      nomor,
      phone,
      email,
      password
    });

    if (res && res.success) {
      const loginId = `${blok}-${nomor}`;
      this._registeredId = loginId;

      document.getElementById('register-form-panel').style.display = 'none';
      document.getElementById('register-success-panel').style.display = 'block';

      const idDisplay = document.getElementById('register-success-id');
      if (idDisplay) idDisplay.textContent = loginId;
      this.showToast('Pendaftaran berhasil dikirim!');
    } else if (regErr) {
      regErr.textContent = (res && res.message) || 'Pendaftaran gagal.';
      regErr.style.display = 'block';
    }
  },

  // ============ LUPA ID & PASSWORD MODAL ============
  openForgotModal() {
    const ownerName = 'Hendra Kusuma';
    const ownerPhone = '08115566778';

    const bodyHtml = `
      <div>
        <p style="font-size:13.5px; color:var(--text-main); margin-bottom:12px; line-height:1.5;">
          Masukkan nama lengkap dan nomor WhatsApp yang terdaftar untuk mencari ID login Anda:
        </p>
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" id="forgot-name-input" class="form-input" placeholder="Nama sesuai akun">
        </div>
        <div class="form-group">
          <label class="form-label">Nomor WhatsApp</label>
          <input type="tel" id="forgot-phone-input" class="form-input" placeholder="Contoh: 08123456789">
        </div>
        <div id="forgot-error-msg" class="field-error-msg" style="display:none; margin-bottom:10px;"></div>
        <div id="forgot-result-box" style="display:none; padding:12px; border-radius:var(--card-radius); background:var(--status-baru-bg); border:1px solid var(--action-main); margin-bottom:12px;"></div>
        <div style="font-size:12px; color:var(--action-text); line-height:1.5; padding:10px; background:var(--bg-page); border-radius:var(--card-radius);">
          Jika lupa kata sandi atau butuh bantuan reset, hubungi <strong>Owner Perumnas</strong>:
          <div style="margin-top:6px; font-weight:700; color:var(--text-main);">${ownerName} (${ownerPhone})</div>
        </div>
      </div>
    `;

    this.openModal('Bantuan Akun & Lupa ID', bodyHtml, async () => {
      const name = (document.getElementById('forgot-name-input')?.value || '').trim();
      const phone = (document.getElementById('forgot-phone-input')?.value || '').trim();
      const errEl = document.getElementById('forgot-error-msg');
      const resEl = document.getElementById('forgot-result-box');

      if (!name || !phone) {
        if (errEl) { errEl.textContent = 'Nama dan nomor WhatsApp wajib diisi.'; errEl.style.display = 'block'; }
        return;
      }
      if (errEl) errEl.style.display = 'none';

      const res = await ApiClient.findId(name, phone);
      if (res && res.success && res.data && res.data.length > 0) {
        if (resEl) {
          resEl.innerHTML = res.data.map(a => `
            <div style="font-size:13px; line-height:1.5; margin-bottom:4px;">
              Ditemukan akun <strong>${esc(a.nama)}</strong>:<br>
              ID Login: <code style="background:#FFF; padding:2px 6px; border-radius:4px; font-weight:700; color:var(--action-main);">${esc(a.id_login)}</code> (Peran: ${esc(a.peran)})
            </div>
          `).join('');
          resEl.style.display = 'block';
        }
      } else {
        if (errEl) { errEl.textContent = (res && res.message) || 'Akun tidak ditemukan.'; errEl.style.display = 'block'; }
      }
    }, 'Cari ID Saya');
  },

  // ============ OWNER USER MANAGEMENT ============
  openAddUserModal() {
    this.openModal('Tambah Petugas Keamanan', `
      <div class="form-layout" style="gap:14px;">
        <div class="form-group">
          <label class="form-label">ID Petugas</label>
          <input type="text" id="new-user-id" class="form-input" placeholder="Contoh: SAT-05">
          <div id="err-new-user-id" class="field-error-msg"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" id="new-user-name" class="form-input" placeholder="Nama petugas">
          <div id="err-new-user-name" class="field-error-msg"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Jenis Kelamin</label>
          <select id="new-user-jk" class="form-select">
            <option value="">Pilih jenis kelamin</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <div id="err-new-user-jk" class="field-error-msg"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Nomor Telepon</label>
          <input type="text" id="new-user-phone" class="form-input" placeholder="0812xxxxxxxx">
        </div>
        <div class="form-group">
          <label class="form-label">Shift</label>
          <select id="new-user-shift" class="form-select">
            <option value="Pagi">Pagi (06.00-14.00)</option>
            <option value="Siang">Siang (14.00-22.00)</option>
            <option value="Malam">Malam (22.00-06.00)</option>
            <option value="Cadangan">Cadangan</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Pos Jaga</label>
          <input type="text" id="new-user-pos" class="form-input" placeholder="Contoh: Pos Gerbang Utama">
        </div>
        <div class="form-group">
          <label class="form-label">Kata Sandi Awal</label>
          <input type="text" id="new-user-password" class="form-input" value="safehome123" placeholder="Minimal 8 karakter">
        </div>
      </div>
    `, () => {
      this._handleAddSatpam();
    }, 'Simpan Petugas');
  },

  async _handleAddSatpam() {
    clearFieldError('err-new-user-id');
    clearFieldError('err-new-user-name');
    clearFieldError('err-new-user-jk');

    const id = (document.getElementById('new-user-id')?.value || '').trim();
    const name = (document.getElementById('new-user-name')?.value || '').trim();
    const jk = document.getElementById('new-user-jk')?.value || '';
    const phone = (document.getElementById('new-user-phone')?.value || '').trim();
    const shift = document.getElementById('new-user-shift')?.value || 'Pagi';
    const pos = (document.getElementById('new-user-pos')?.value || '').trim() || 'Pos Utama';
    const rawPwd = (document.getElementById('new-user-password')?.value || '').trim() || 'safehome123';

    if (!id) { showFieldError('err-new-user-id', 'ID petugas wajib diisi.'); return; }
    if (!name || name.length < 3) { showFieldError('err-new-user-name', 'Nama wajib diisi, minimal 3 karakter.'); return; }
    if (!jk) { showFieldError('err-new-user-jk', 'Pilih jenis kelamin.'); return; }

    const res = await ApiClient.addSatpam({
      id_login: id,
      nama: name,
      jenis_kelamin: jk,
      no_hp: phone,
      shift,
      pos_jaga: pos,
      password: rawPwd
    });

    if (res && res.success) {
      this.closeModal();
      this.showToast(`Petugas ${name} berhasil didaftarkan!`);
      this.renderOwnerUsers();
    } else {
      showFieldError('err-new-user-id', (res && res.message) || 'Gagal mendaftarkan petugas.');
    }
  },

  openEditUserModal(userId) {
    const acc = AccountStore.getById(userId);
    if (!acc) return;

    const isPenghuni = acc.role === 'penghuni';
    const jkNow = acc.jenis_kelamin || '';

    this.openModal(`Edit Pengguna: ${acc.name}`, `
      <div class="form-layout" style="gap:14px;">
        <div class="form-group">
          <label class="form-label">ID Login</label>
          <input type="text" class="form-input" value="${esc(acc.id)}" disabled style="background:var(--bg-page);cursor:not-allowed;">
        </div>
        <div class="form-group">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" id="edit-user-name" class="form-input" value="${esc(acc.name)}">
          <div id="err-edit-user-name" class="field-error-msg"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Jenis Kelamin</label>
          <select id="edit-user-jk" class="form-select">
            <option value="" ${jkNow === '' ? 'selected' : ''}>Belum diisi</option>
            <option value="L" ${jkNow === 'L' ? 'selected' : ''}>Laki-laki</option>
            <option value="P" ${jkNow === 'P' ? 'selected' : ''}>Perempuan</option>
          </select>
        </div>
        ${isPenghuni ? `
          <div class="form-group">
            <label class="form-label">Blok</label>
            <select id="edit-user-blok" class="form-select">
              ${['A','B','C','D','E','F'].map(b => `<option value="${b}" ${acc.blok === b ? 'selected' : ''}>Blok ${b}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Nomor Rumah</label>
            <input type="text" id="edit-user-nomor" class="form-input" value="${esc(acc.nomorRumah || '')}">
          </div>
        ` : `
          <div class="form-group">
            <label class="form-label">Shift</label>
            <select id="edit-user-shift" class="form-select">
              <option value="Pagi" ${acc.shift === 'Pagi' ? 'selected' : ''}>Pagi (06.00-14.00)</option>
              <option value="Siang" ${acc.shift === 'Siang' ? 'selected' : ''}>Siang (14.00-22.00)</option>
              <option value="Malam" ${acc.shift === 'Malam' ? 'selected' : ''}>Malam (22.00-06.00)</option>
              <option value="Cadangan" ${acc.shift === 'Cadangan' ? 'selected' : ''}>Cadangan</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Pos Jaga</label>
            <input type="text" id="edit-user-pos" class="form-input" value="${esc(acc.pos || '')}">
          </div>
        `}
        <div class="form-group">
          <label class="form-label">Nomor Telepon</label>
          <input type="text" id="edit-user-phone" class="form-input" value="${esc(acc.phone || '')}">
        </div>
      </div>
    `, async () => {
      clearFieldError('err-edit-user-name');
      const name = (document.getElementById('edit-user-name')?.value || '').trim();
      if (!name || name.length < 3) { showFieldError('err-edit-user-name', 'Nama wajib diisi, minimal 3 karakter.'); return; }

      const payload = {
        id_login: userId,
        nama: name,
        jenis_kelamin: document.getElementById('edit-user-jk')?.value || '',
        no_hp: (document.getElementById('edit-user-phone')?.value || '').trim()
      };

      if (isPenghuni) {
        payload.blok = document.getElementById('edit-user-blok')?.value || acc.blok;
        payload.no_rumah = (document.getElementById('edit-user-nomor')?.value || '').trim();
      } else {
        payload.shift = document.getElementById('edit-user-shift')?.value || acc.shift;
        payload.pos_jaga = (document.getElementById('edit-user-pos')?.value || '').trim();
      }

      const res = await ApiClient.editUser(payload);
      if (res && res.success) {
        this.closeModal();
        this.showToast(res.message);
        this.renderOwnerUsers();
      } else {
        this.showToast((res && res.message) || 'Gagal memperbarui pengguna.');
      }
    }, 'Simpan Perubahan');
  },

  async toggleUserActive(userId) {
    const res = await ApiClient.toggleUserActive(userId);
    if (res && res.success) {
      this.showToast(res.message);
      this.renderOwnerUsers();
    } else {
      this.showToast((res && res.message) || 'Gagal mengubah status akun.');
    }
  },

  async deleteUser(userId) {
    if (confirm(`Hapus akun "${userId}"? Tindakan ini tidak dapat dibatalkan.`)) {
      const res = await ApiClient.deleteUser(userId);
      if (res && res.success) {
        this.showToast(res.message);
        this.renderOwnerUsers();
      } else {
        this.showToast((res && res.message) || 'Gagal menghapus akun.');
      }
    }
  },

  async resetUserPassword(userId) {
    if (confirm(`Reset kata sandi akun ${userId} ke "safehome123"?`)) {
      const res = await ApiClient.resetUserPassword(userId);
      if (res && res.success) {
        this.showToast(res.message);
      } else {
        this.showToast((res && res.message) || 'Gagal mereset kata sandi.');
      }
    }
  },

  async _updatePendaftaranBadge() {
    try {
      const res = await ApiClient.getPendingRegistrations();
      const badge = document.getElementById('tab-pendaftaran-badge');
      if (badge) {
        const count = (res && res.success && Array.isArray(res.data)) ? res.data.length : 0;
        if (count > 0) {
          badge.textContent = count;
          badge.style.display = 'inline-flex';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (e) {}
  },

  async approveRegistration(regId) {
    const res = await ApiClient.approveRegistration(regId);
    if (res && res.success) {
      this.showToast(res.message);
      this.renderOwnerUsers();
      this._updatePendaftaranBadge();
    } else {
      this.showToast((res && res.message) || 'Gagal menyetujui pendaftaran.');
    }
  },

  rejectRegistration(regId) {
    this.openModal('Tolak Pendaftaran Penghuni', `
      <div class="form-group">
        <label class="form-label">Alasan Penolakan</label>
        <input type="text" id="reject-reason" class="form-input" placeholder="Contoh: Nomor rumah tidak valid" maxlength="100">
        <div id="err-reject-reason" class="field-error-msg"></div>
      </div>
    `, async () => {
      const reason = (document.getElementById('reject-reason')?.value || '').trim();
      if (!reason) {
        showFieldError('err-reject-reason', 'Alasan wajib diisi.');
        return;
      }
      const res = await ApiClient.rejectRegistration(regId, reason);
      if (res && res.success) {
        this.closeModal();
        this.showToast(res.message);
        this.renderOwnerUsers();
        this._updatePendaftaranBadge();
      } else {
        this.showToast((res && res.message) || 'Gagal menolak pendaftaran.');
      }
    }, 'Konfirmasi Tolak');
  },

  openPdfModal(periodTitle, statsSummary) {
    const owner = AccountStore.getByRole('owner')[0];
    const direktur = AccountStore.getByRole('direktur')[0];
    const ownerName = owner ? owner.name : 'Hendra Kusuma';
    const dirName = direktur ? direktur.name : 'Rina Anggraini';

    this.openModal('Pratinjau Dokumen Rekap Keamanan', `
      <div style="border: 1px solid var(--card-border); padding: 24px; background: #FFFFFF; color: var(--text-main); font-family: 'Times New Roman', serif;">
        <div style="text-align: center; border-bottom: 2px solid var(--text-main); padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 15px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">PERUMNAS PESONA CIREBON REGENCY</h2>
          <p style="font-size: 12px; margin: 2px 0;">DIVISI PENGELOLAAN KEAMANAN & KETERTIBAN LINGKUNGAN</p>
          <p style="font-size: 11px; font-style: italic;">Jl. Raya Pesona Regency Blok A, Cirebon, Jawa Barat</p>
        </div>
        <div style="text-align: center; margin-bottom: 16px;">
          <h3 style="font-size: 13px; text-decoration: underline; font-weight: bold;">LAPORAN PERIODIK EVALUASI KEAMANAN</h3>
          <p style="font-size: 12px; font-weight: bold;">Periode: ${esc(periodTitle)}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px;">
          <tr style="background: var(--bg-page);"><th style="border: 1px solid var(--card-border); padding: 6px; text-align: left;">Indikator</th><th style="border: 1px solid var(--card-border); padding: 6px; text-align: right;">Capaian</th></tr>
          <tr><td style="border: 1px solid var(--card-border); padding: 6px;">Total Kejadian</td><td style="border: 1px solid var(--card-border); padding: 6px; text-align: right;">${statsSummary.total || 24}</td></tr>
          <tr><td style="border: 1px solid var(--card-border); padding: 6px;">Tingkat Penyelesaian</td><td style="border: 1px solid var(--card-border); padding: 6px; text-align: right;">${statsSummary.selesai || 21} (${statsSummary.rate || '88%'})</td></tr>
          <tr><td style="border: 1px solid var(--card-border); padding: 6px;">Eskalasi</td><td style="border: 1px solid var(--card-border); padding: 6px; text-align: right;">${statsSummary.eskalasi || 1}</td></tr>
          <tr><td style="border: 1px solid var(--card-border); padding: 6px;">Rata-rata Waktu Tanggap</td><td style="border: 1px solid var(--card-border); padding: 6px; text-align: right;">6 Menit</td></tr>
          <tr><td style="border: 1px solid var(--card-border); padding: 6px;">Kepatuhan Patroli</td><td style="border: 1px solid var(--card-border); padding: 6px; text-align: right;">95%</td></tr>
        </table>
        <p style="font-size: 11px; line-height: 1.5; margin-bottom: 20px;"><strong>Kesimpulan:</strong> Kondisi lingkungan aman terkendali. Pengawasan Blok D dan E ditingkatkan.</p>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 24px;">
          <div style="text-align: center;"><p>Mengetahui,</p><p><strong>Owner Perumnas</strong></p><div style="height: 35px;"></div><p><strong>(${esc(ownerName)})</strong></p></div>
          <div style="text-align: center;"><p>Cirebon, 16 Oktober 2026</p><p><strong>Direktur Operasional</strong></p><div style="height: 35px;"></div><p><strong>(${esc(dirName)})</strong></p></div>
        </div>
        <div style="text-align:center; margin-top:20px; border-top:1px dashed var(--card-border); padding-top:12px;">
          <a href="api/export.php" class="btn-main" style="display:inline-flex; align-items:center; gap:6px; text-decoration:none;" download>
            ${ICONS.download} Unduh Rekap Data (CSV)
          </a>
        </div>
      </div>
    `, () => { window.print(); }, 'Cetak Halaman');
  },

  // ============ MAIN RENDER ============
  render() {
    switch (this.activeScreenId) {
      case 'screen-penghuni-home': this.renderPenghuniHome(); break;
      case 'screen-penghuni-riwayat': this.renderPenghuniRiwayat(); break;
      case 'screen-penghuni-detail': this.renderPenghuniDetail(); break;
      case 'screen-penghuni-info': this.renderPenghuniInfo(); break;
      case 'screen-penghuni-darurat': this.renderPenghuniDarurat(); break;
      case 'screen-satpam-inbox': this.renderSatpamInbox(); break;
      case 'screen-satpam-detail': this.renderSatpamDetail(); break;
      case 'screen-satpam-patroli': this.renderSatpamPatroli(); break;
      case 'screen-owner-pantau': this.renderOwnerPantau(); break;
      case 'screen-owner-laporan': this.renderOwnerReports(); break;
      case 'screen-owner-satpam': this.renderOwnerSatpam(); break;
      case 'screen-owner-pengguna': this.renderOwnerUsers(); break;
      case 'screen-direktur-summary': this.renderDirekturSummary(); break;
      case 'screen-direktur-laporan': this.renderDirectorReports(); break;
      case 'screen-profil': this.renderProfile(); break;
    }
  },

  // ============ PENGHUNI SCREENS ============
  async renderPenghuniHome() {
    const user = SessionStore.getCurrentUser();
    if (!user) return;

    // Greeting (dengan Mas/Mbak sesuai jenis kelamin)
    const greetEl = document.getElementById('penghuni-home-greeting');
    const subEl = document.getElementById('penghuni-home-subtitle');
    if (greetEl) greetEl.textContent = `${getGreetingTime()}, ${sapaanNama(user)}`;
    if (subEl) subEl.textContent = `Blok ${user.blok} No. ${user.nomorRumah} \u00b7 ${formatDate()}`;

    // Satpam bertugas
    const guard = getOnDutyGuard();
    const guardHeaderEl = document.getElementById('home-guard-header');
    const guardNameEl = document.getElementById('home-guard-name');
    const guardSubEl = document.getElementById('home-guard-sub');
    const guardStatusEl = document.getElementById('home-guard-status');

    if (guard) {
      if (guardHeaderEl) guardHeaderEl.textContent = `SATPAM BERTUGAS \u00b7 SHIFT ${guard.shift.toUpperCase()}`;
      if (guardNameEl) guardNameEl.textContent = guard.name;
      if (guardSubEl) guardSubEl.textContent = `${guard.pos} \u00b7 ${guard.shiftJam}`;
      if (guardStatusEl) { guardStatusEl.textContent = 'Siaga'; guardStatusEl.className = 'chip-status chip-selesai'; }
    }

    // Ambil laporan terbaru
    await this.fetchReports();
    const listContainer = document.getElementById('penghuni-recent-reports');
    if (!listContainer) return;

    const reports = ReportStore.getAll();
    const myReports = reports.filter(r => r.reporterId === user.id).slice(0, 2);

    if (myReports.length === 0) {
      listContainer.innerHTML = '<div style="padding:14px; text-align:center; color:var(--action-text); font-size:13px;">Belum ada laporan dari Anda.</div>';
      return;
    }

    listContainer.innerHTML = myReports.map(rep => `
      <div class="card" style="padding: 14px; cursor: pointer; margin-bottom: 8px;" onclick="App.navigateTo('screen-penghuni-detail', { reportId: '${rep.id}' })">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="report-id" style="font-size: 12px; color: var(--action-text); font-weight: 600;">${esc(rep.id)}</span>
          ${this.getStatusChipHtml(rep.status)}
        </div>
        <div style="font-weight: 700; font-size: 15px; color: var(--text-main);">${esc(rep.title)}</div>
        <div style="font-size: 12.5px; color: var(--action-text); margin-top: 2px;">Blok ${esc(rep.block)} \u00b7 ${esc(rep.time)}</div>
      </div>
    `).join('');
  },

  async renderPenghuniRiwayat() {
    const user = SessionStore.getCurrentUser();
    if (!user) return;
    const container = document.getElementById('penghuni-history-table-container');
    if (!container) return;

    await this.fetchReports();
    const reports = ReportStore.getAll();
    const myReports = reports.filter(r => r.reporterId === user.id);

    const subEl = document.getElementById('penghuni-riwayat-subtitle');
    if (subEl) subEl.textContent = `Blok ${user.blok} No. ${user.nomorRumah} \u00b7 ${myReports.length} laporan`;

    let filtered = myReports;
    if (this.historyFilter === 'Aktif') {
      filtered = myReports.filter(r => r.status === 'Baru' || r.status === 'Diproses' || r.status === 'Eskalasi');
    } else if (this.historyFilter === 'Selesai') {
      filtered = myReports.filter(r => r.status === 'Selesai');
    }

    const tSemua = document.getElementById('hist-tab-semua');
    const tAktif = document.getElementById('hist-tab-aktif');
    const tSelesai = document.getElementById('hist-tab-selesai');
    if (tSemua) tSemua.textContent = `Semua (${myReports.length})`;
    if (tAktif) tAktif.textContent = `Aktif (${myReports.filter(r => r.status !== 'Selesai').length})`;
    if (tSelesai) tSelesai.textContent = `Selesai (${myReports.filter(r => r.status === 'Selesai').length})`;

    if (filtered.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--action-text);">Belum ada laporan di kategori ini.</div>';
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>ID Laporan</th><th>Waktu</th><th>Kategori / Judul</th><th>Lokasi</th><th>Urgensi</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            ${filtered.map(r => `
              <tr onclick="App.navigateTo('screen-penghuni-detail', { reportId: '${r.id}' })">
                <td class="table-id-cell">${esc(r.id)}</td>
                <td class="table-time-cell">${esc(r.time)}</td>
                <td><strong>${esc(r.title)}</strong><div style="font-size: 11.5px; color: var(--action-text);">${esc(r.category)}</div></td>
                <td>Blok ${esc(r.block)}</td>
                <td>${esc(r.urgency)}</td>
                <td>${this.getStatusChipHtml(r.status)}</td>
                <td><button class="btn-outline-main" style="padding: 4px 10px; font-size: 12px;">Lihat Detail ${ICONS.chevronRight}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  setHistoryFilter(filter) {
    this.historyFilter = filter;
    const tabIds = { Semua: 'hist-tab-semua', Aktif: 'hist-tab-aktif', Selesai: 'hist-tab-selesai' };
    Object.entries(tabIds).forEach(([name, id]) => {
      document.getElementById(id)?.classList.toggle('active', name === filter);
    });
    this.renderPenghuniRiwayat();
  },

  async renderPenghuniDetail() {
    const reportId = this.selectedReportId || 'LP-261016-007';
    let rep = ReportStore.getById(reportId);

    try {
      const res = await ApiClient.getLaporanDetail(reportId);
      if (res && res.success && res.data) {
        rep = res.data;
      }
    } catch (e) {}

    if (!rep) return;

    document.getElementById('p-detail-id').textContent = rep.id;
    document.getElementById('p-detail-title').textContent = rep.title;
    document.getElementById('p-detail-location').textContent = rep.location;
    document.getElementById('p-detail-time').textContent = rep.fullTime || rep.time;
    document.getElementById('p-detail-urgency').textContent = rep.urgency;
    document.getElementById('p-detail-handler').textContent = rep.assignedToName || getAssigneeName(rep.assignedTo);
    document.getElementById('p-detail-desc').textContent = rep.desc;

    const badgeContainer = document.getElementById('p-detail-status-badge');
    if (badgeContainer) badgeContainer.innerHTML = this.getStatusChipHtml(rep.status);

    const photosContainer = document.getElementById('p-detail-photos');
    if (rep.photos && rep.photos.length > 0) {
      photosContainer.innerHTML = rep.photos.map((p, idx) => `
        <div class="card" style="padding: 10px; cursor: pointer; display: flex; align-items:center; gap: 8px; font-size: 13px; font-weight:600; color: var(--action-text);" onclick="App.openPhotoModal('${p}')">
          ${ICONS.camera} Foto bukti ${idx + 1}
        </div>
      `).join('');
    } else {
      photosContainer.innerHTML = '<span style="font-size:12px; color:var(--action-text);">Tidak ada foto bukti dilampirkan.</span>';
    }

    const timelineContainer = document.getElementById('p-detail-timeline');
    const respTimeEl = document.getElementById('p-detail-resptime');
    if (respTimeEl) respTimeEl.textContent = rep.resolutionTime || 'Respons 3 menit';

    timelineContainer.innerHTML = (rep.timeline || []).map(node => `
      <div class="timeline-entry ${node.isCompleted ? 'completed' : ''}">
        <div class="timeline-entry-title">${esc(node.title)}</div>
        <div class="timeline-entry-time">${esc(node.time)}</div>
        ${node.desc ? `<div class="timeline-entry-desc">${esc(node.desc)}</div>` : ''}
      </div>
    `).join('');
  },

  renderPenghuniInfo() {
    const container = document.getElementById('info-guards-list');
    if (!container) return;

    const guards = AccountStore.getByRole('satpam').filter(g => g.active && g.shift !== 'Cadangan');
    const currentShift = getCurrentShiftName();

    const shiftOrder = ['Pagi', 'Siang', 'Malam'];
    const sortedGuards = [...guards].sort((a, b) => shiftOrder.indexOf(a.shift) - shiftOrder.indexOf(b.shift));

    if (sortedGuards.length === 0) {
      container.innerHTML = '<div style="padding:16px;text-align:center;color:var(--action-text);">Belum ada petugas terdaftar</div>';
      return;
    }

    container.innerHTML = sortedGuards.map(g => {
      const isOnDuty = g.shift === currentShift;
      let chipText = 'Nanti';
      let chipClass = 'chip-baru';
      if (isOnDuty) { chipText = 'Bertugas'; chipClass = 'chip-selesai'; }

      return `
        <div class="card" style="padding:10px; display:flex; justify-content:space-between; align-items:center;${isOnDuty ? ' border-left:3px solid var(--action-main);' : ''}">
          <div>
            <div class="table-mono" style="font-size:11px;">${esc(g.shiftJam || 'Cadangan')}</div>
            <div style="font-weight:700;">${esc(g.name)}</div>
            <div style="font-size:12px; color:var(--action-text);">Shift ${esc(g.shift.toLowerCase())}${g.pos ? ' \u00b7 ' + esc(g.pos) : ''}</div>
          </div>
          <span class="chip-status ${chipClass}">${chipText}</span>
        </div>
      `;
    }).join('');
  },

  renderPenghuniDarurat() {
    const user = SessionStore.getCurrentUser();
    if (!user) return;
    const locEl = document.getElementById('penghuni-darurat-loc');
    if (locEl) locEl.textContent = `Blok ${user.blok} No. ${user.nomorRumah}`;
  },

  openPhotoModal(src) {
    this.openModal('Foto Bukti Kejadian', `
      <div style="text-align: center;">
        <img src="${esc(src)}" style="max-width: 100%; border-radius: var(--card-radius); max-height: 400px; object-fit: contain;">
      </div>
    `);
  },

  // ============ SATPAM SCREENS ============
  async renderSatpamInbox() {
    const user = SessionStore.getCurrentUser();
    const tableContainer = document.getElementById('satpam-reports-table-container');
    const completedContainer = document.getElementById('satpam-completed-table-container');
    if (!tableContainer) return;

    const subEl = document.getElementById('satpam-inbox-subtitle');
    if (subEl && user) subEl.textContent = `${user.name} \u00b7 Shift ${user.shift ? user.shift.toLowerCase() : ''} ${user.shiftJam || ''}`;

    await this.fetchReports();
    const reports = ReportStore.getAll();
    const baruCount = reports.filter(r => r.status === 'Baru').length;
    const diprosesCount = reports.filter(r => r.status === 'Diproses').length;
    const selesaiCount = reports.filter(r => r.status === 'Selesai').length;

    document.getElementById('satpam-count-baru').textContent = baruCount;
    document.getElementById('satpam-count-diproses').textContent = diprosesCount;
    document.getElementById('satpam-count-selesai').textContent = selesaiCount;

    // Sinyal Darurat dari database
    try {
      const emgRes = await ApiClient.getEmergencies();
      const emergencyList = (emgRes && emgRes.success && Array.isArray(emgRes.data)) ? emgRes.data : [];
      const emgBanner = document.getElementById('satpam-emergency-banner');
      if (emgBanner) {
        if (emergencyList.length > 0) {
          const emg = emergencyList[0];
          emgBanner.style.display = 'block';
          emgBanner.innerHTML = `
            <div class="card" style="border: 2px solid var(--emergency); background: var(--status-eskalasi-bg); margin-bottom: 16px; cursor: pointer;" onclick="App.openEmergencyModal('${emg.id}')">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="color:var(--emergency);">${ICONS.alert}</div>
                  <div>
                    <div style="font-family:var(--font-mono); font-size:12px; color:var(--emergency-text); font-weight:700;">SINYAL DARURAT \u00b7 ${esc(emg.time)} WIB</div>
                    <div style="font-size:16px; font-weight:700; color:var(--emergency-text);">${esc(emg.type)}, ${esc(emg.reporterName)}</div>
                    <div style="font-size:13px; color:var(--text-main);">${esc(emg.location)}</div>
                  </div>
                </div>
                <span class="chip-status chip-darurat">Darurat</span>
              </div>
            </div>
          `;
        } else {
          emgBanner.style.display = 'none';
        }
      }
    } catch (e) {}

    const pending = reports.filter(r => r.status === 'Baru' || r.status === 'Diproses');
    tableContainer.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>ID Laporan</th><th>Waktu</th><th>Kategori / Judul</th><th>Lokasi</th><th>Pelapor</th><th>Urgensi</th><th>Status</th><th>Tindak Lanjut</th></tr></thead>
          <tbody>
            ${pending.map(r => `
              <tr onclick="App.navigateTo('screen-satpam-detail', { reportId: '${r.id}' })">
                <td class="table-id-cell">${esc(r.id)}</td>
                <td class="table-time-cell">${esc(String(r.time).replace('Hari ini ', ''))}</td>
                <td><strong>${esc(r.title)}</strong></td>
                <td>Blok ${esc(r.block)}</td>
                <td>${esc(r.reporterName || r.reporterId)}</td>
                <td>${esc(r.urgency)}</td>
                <td>${this.getStatusChipHtml(r.status)}</td>
                <td><button class="btn-main" style="padding: 4px 10px; font-size: 12px;">Tangani ${ICONS.chevronRight}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    const completed = reports.filter(r => r.status === 'Selesai').slice(0, 5);
    if (completedContainer) {
      completedContainer.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th>ID Laporan</th><th>Waktu</th><th>Kategori / Judul</th><th>Lokasi</th><th>Hasil Penanganan</th><th>Status</th></tr></thead>
            <tbody>
              ${completed.map(r => `
                <tr onclick="App.navigateTo('screen-satpam-detail', { reportId: '${r.id}' })">
                  <td class="table-id-cell">${esc(r.id)}</td>
                  <td class="table-time-cell">${esc(String(r.time).replace('Hari ini ', ''))}</td>
                  <td><strong>${esc(r.title)}</strong></td>
                  <td>Blok ${esc(r.block)}</td>
                  <td>${esc(r.resolutionTime || 'Tuntas')}</td>
                  <td>${this.getStatusChipHtml('Selesai')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  async openEmergencyModal(emgId) {
    this.openModal('SINYAL DARURAT DITERIMA', `
      <div style="background: var(--status-eskalasi-bg); border: 1px solid var(--emergency); padding: 16px; border-radius: var(--card-radius);">
        <h4 style="color: var(--emergency-text); font-size: 16px; margin-bottom: 6px;">Keadaan Darurat</h4>
        <p style="font-size: 14px; margin-bottom: 4px;"><strong>Kode:</strong> ${esc(emgId)}</p>
        <p style="font-size: 14px; color:var(--text-main);">Petugas diwajibkan segera menuju titik koordinat lokasi kejadian.</p>
      </div>
    `, async () => {
      const res = await ApiClient.resolveEmergency(emgId);
      if (res && res.success) {
        this.closeModal();
        this.showToast('Sinyal darurat telah ditangani!');
        this.renderSatpamInbox();
      }
    }, 'Merespons ke Lokasi Sekarang');
  },

  async renderSatpamDetail() {
    const reportId = this.selectedReportId || 'LP-261016-010';
    let rep = ReportStore.getById(reportId);

    try {
      const res = await ApiClient.getLaporanDetail(reportId);
      if (res && res.success && res.data) {
        rep = res.data;
      }
    } catch (e) {}

    if (!rep) return;

    document.getElementById('s-detail-id').textContent = rep.id;
    document.getElementById('s-detail-title').textContent = rep.title;
    document.getElementById('s-detail-reporter').textContent = rep.reporterName || rep.reporterId;
    document.getElementById('s-detail-time').textContent = rep.fullTime || rep.time;
    document.getElementById('s-detail-location').textContent = rep.location;
    document.getElementById('s-detail-urgency').textContent = rep.urgency;
    document.getElementById('s-detail-desc').textContent = rep.desc;

    const badgeContainer = document.getElementById('s-detail-status-badge');
    if (badgeContainer) badgeContainer.innerHTML = this.getStatusChipHtml(rep.status);

    const actionsBox = document.getElementById('satpam-action-buttons');
    if (rep.status === 'Baru') {
      actionsBox.innerHTML = `
        <button class="btn-main" onclick="App.satpamAcceptReport('${rep.id}')">Terima laporan</button>
        <button class="btn-outline-emergency" onclick="App.satpamEscalateReport('${rep.id}')">Eskalasi ke Owner</button>
      `;
    } else if (rep.status === 'Diproses') {
      actionsBox.innerHTML = `
        <button class="btn-main" onclick="App.satpamResolveReport('${rep.id}')">Selesaikan Laporan</button>
        <button class="btn-outline-emergency" onclick="App.satpamEscalateReport('${rep.id}')">Eskalasi ke Owner</button>
      `;
    } else {
      actionsBox.innerHTML = `
        <div style="text-align:center; padding:10px; background:var(--bg-page); border-radius:var(--card-radius); font-weight:600; color:var(--text-main);">
          Status Laporan: ${esc(rep.status)}
        </div>
      `;
    }

    const timeLogContainer = document.getElementById('s-detail-timelog');
    timeLogContainer.innerHTML = (rep.timeline || []).map(node => `
      <div style="font-size: 13px; color: var(--text-main); margin-bottom: 6px;">
        <span class="table-time-cell" style="font-weight:700;">${esc(node.time)}</span> ${esc(node.desc || node.title)}
      </div>
    `).join('');
  },

  async renderSatpamPatroli() {
    const user = SessionStore.getCurrentUser();
    const listContainer = document.getElementById('satpam-patrol-list');
    if (!listContainer) return;

    const subEl = document.getElementById('satpam-patrol-subtitle');
    if (subEl && user) subEl.textContent = `Putaran 1 \u00b7 ${user.shiftJam || ''} \u00b7 ${user.name}`;

    try {
      const res = await ApiClient.getPatrolCheckpoints();
      if (res && res.success && res.data) {
        const list = res.data.checkpoints || [];
        const recordedCount = res.data.recordedCount || 0;
        const progressPercent = list.length ? Math.round((recordedCount / list.length) * 100) : 0;

        document.getElementById('patrol-progress-text').textContent = `Titik terdata ${recordedCount} dari ${list.length}`;
        document.getElementById('patrol-progress-fill').style.width = `${progressPercent}%`;

        listContainer.innerHTML = list.map(cp => {
          const isChecked = cp.status === 'Tercatat';
          return `
            <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding:14px 18px; margin-bottom:8px;">
              <div style="display:flex; align-items:center; gap:14px;">
                <div style="width:28px; height:28px; border-radius:50%; border:1.5px solid ${isChecked ? 'var(--status-selesai-text)' : 'var(--card-border)'}; display:flex; align-items:center; justify-content:center; color:${isChecked ? 'var(--status-selesai-text)' : 'transparent'};">
                  ${ICONS.check}
                </div>
                <div>
                  <div style="font-size: 15px; font-weight: 700; color: var(--text-main);">${esc(cp.name)}</div>
                  <div style="font-size: 12.5px; color: var(--action-text);">
                    Rencana ${esc(cp.plannedTime)} ${isChecked ? `\u00b7 tercatat ${esc(cp.recordedTime)}` : ''}
                  </div>
                </div>
              </div>
              <div>
                ${isChecked ? `<span class="chip-status chip-selesai">Tercatat</span>` :
                  `<button class="btn-main" style="padding:6px 14px; font-size:13px;" onclick="App.checkinPatrol('${cp.id}')">Catat</button>`}
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (e) {}
  },

  // ============ OWNER SCREENS ============
  async renderOwnerPantau() {
    const grid = document.getElementById('owner-blocks-grid');
    if (!grid) return;

    try {
      const res = await ApiClient.getStatistics();
      if (res && res.success && res.data && res.data.blocks) {
        store.data.blocks = res.data.blocks;
      }
    } catch (e) {}

    grid.innerHTML = store.data.blocks.map(b => {
      const isSelected = b.id === this.selectedBlockId;
      const pct = Math.min(100, (b.count / 10) * 100);
      let statusChip = 'chip-selesai';
      if (b.status === 'Perhatian') statusChip = 'chip-diterima';
      else if (b.status === 'Waspada') statusChip = 'chip-eskalasi';

      return `
        <div class="block-status-card ${isSelected ? 'selected' : ''}" onclick="App.selectOwnerBlock('${b.id}')">
          <div class="block-card-header">
            <span class="block-card-letter">${esc(b.id)}</span>
            <span class="block-card-count">${esc(b.count)} kejadian</span>
          </div>
          <div class="block-progress-track"><div class="block-progress-fill" style="width: ${pct}%;"></div></div>
          <span class="chip-status ${statusChip}" style="font-size:11px;">${esc(b.status)}</span>
        </div>
      `;
    }).join('');

    const curBlock = store.data.blocks.find(b => b.id === this.selectedBlockId) || store.data.blocks[3];
    document.getElementById('owner-sel-block-name').textContent = `Blok ${curBlock.id}`;
    document.getElementById('owner-sel-block-count').textContent = `${curBlock.count} kejadian`;
    document.getElementById('owner-sel-block-top').textContent = curBlock.topIncident;
    document.getElementById('owner-sel-block-time').textContent = curBlock.lastTime;
  },

  selectOwnerBlock(blockId) {
    this.selectedBlockId = blockId;
    this.renderOwnerPantau();
  },

  viewOwnerBlockReports() {
    this.navigateTo('screen-owner-laporan');
    const search = document.getElementById('owner-search-reports');
    if (search) search.value = `Blok ${this.selectedBlockId}`;
    this.setOwnerReportFilter('Semua');
  },

  async renderOwnerReports() {
    const container = document.getElementById('owner-reports-table-container');
    if (!container) return;

    const searchTerm = (document.getElementById('owner-search-reports')?.value || '').toLowerCase();
    await this.fetchReports();
    let list = ReportStore.getAll();
    if (this.ownerFilter !== 'Semua') list = list.filter(r => r.status === this.ownerFilter);
    if (searchTerm) {
      list = list.filter(r =>
        r.id.toLowerCase().includes(searchTerm) ||
        r.title.toLowerCase().includes(searchTerm) ||
        String(r.block).toLowerCase().includes(searchTerm) ||
        String(r.location).toLowerCase().includes(searchTerm)
      );
    }

    if (list.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--action-text);">Tidak ada laporan ditemukan.</div>';
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>ID Laporan</th><th>Waktu</th><th>Kategori / Judul</th><th>Blok & Lokasi</th><th>Pelapor</th><th>Petugas</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            ${list.map(r => `
              <tr onclick="App.openOwnerReportDetailModal('${r.id}')">
                <td class="table-id-cell">${esc(r.id)}</td>
                <td class="table-time-cell">${esc(r.time)}</td>
                <td><strong>${esc(r.title)}</strong></td>
                <td>Blok ${esc(r.block)}</td>
                <td>${esc(r.reporterName || r.reporterId)}</td>
                <td>${esc(r.assignedToName || r.assignedTo)}</td>
                <td>${this.getStatusChipHtml(r.status)}</td>
                <td><button class="btn-outline-main" style="padding: 4px 10px; font-size: 12px;">Rincian ${ICONS.chevronRight}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  setOwnerReportFilter(filter) {
    this.ownerFilter = filter;
    document.querySelectorAll('.owner-rep-tab').forEach(t => {
      t.classList.toggle('active', t.textContent.trim() === filter);
    });
    this.renderOwnerReports();
  },

  openOwnerReportDetailModal(reportId) {
    const rep = ReportStore.getById(reportId);
    if (!rep) return;

    const isEscalated = rep.status === 'Eskalasi';

    this.openModal(`Laporan ${rep.id}`, `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:16px; color:var(--text-main);">${esc(rep.title)}</h3>
          ${this.getStatusChipHtml(rep.status)}
        </div>
        <div style="font-size:13.5px; line-height:1.6; color:var(--text-main); margin-bottom:12px;">
          <p><strong>Lokasi:</strong> ${esc(rep.location)}</p>
          <p><strong>Waktu:</strong> ${esc(rep.fullTime)}</p>
          <p><strong>Pelapor:</strong> ${esc(rep.reporterName || rep.reporterId)}</p>
          <p><strong>Petugas:</strong> ${esc(rep.assignedToName || rep.assignedTo)}</p>
          <p><strong>Urgensi:</strong> ${esc(rep.urgency)}</p>
        </div>
        <div style="background:var(--bg-page); padding:12px; border-radius:var(--card-radius); font-size:13px; border-left:3px solid var(--action-main);">
          <strong>Deskripsi Kejadian:</strong><br>${esc(rep.desc)}
        </div>
        ${isEscalated ? `
          <div style="margin-top:14px; background:var(--status-eskalasi-bg); padding:12px; border-radius:var(--card-radius); border:1px solid var(--emergency);">
            <strong style="color:var(--emergency-text);">Status Eskalasi Owner:</strong>
            <p style="font-size:12.5px; color:var(--emergency-text); margin-top:4px;">Kasus ini memerlukan arahan pimpinan.</p>
            <textarea id="modal-owner-arahan" class="form-textarea" placeholder="Tuliskan arahan Owner untuk Satpam..." style="margin-top:8px;">Tingkatkan patroli dan berikan pengawasan khusus di area terkait.</textarea>
          </div>
        ` : ''}
      </div>
    `, async () => {
      if (isEscalated) {
        const arahan = (document.getElementById('modal-owner-arahan')?.value || '').trim() || 'Owner menyetujui penanganan dan koordinasi satpam.';
        const res = await ApiClient.ownerArahanLaporan(reportId, arahan);
        if (res && res.success) {
          this.closeModal();
          this.showToast('Arahan Owner berhasil dikirimkan ke Satpam!');
          await this.fetchReports();
          this.render();
        }
      } else {
        this.closeModal();
      }
    }, isEscalated ? 'Keluarkan Arahan & Lanjutkan' : 'Tutup');
  },

  async renderOwnerSatpam() {
    const container = document.getElementById('owner-satpam-cards');
    if (!container) return;

    try {
      const res = await ApiClient.getStatistics();
      if (res && res.success && res.data && res.data.guards) {
        const guards = res.data.guards;
        const subEl = document.getElementById('owner-satpam-subtitle');
        if (subEl) subEl.textContent = `${formatDate()} \u00b7 ${guards.length} petugas aktif`;

        container.innerHTML = guards.map(g => {
          return `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:12px;">
                <div>
                  <h3 style="font-size:17px;">${esc(g.name)}</h3>
                  <div style="font-size:12px; color:var(--action-text);">Shift ${esc(String(g.shift).toLowerCase())} \u00b7 ${esc(g.shiftJam || '')}</div>
                </div>
                <span class="table-mono" style="font-size:13px; font-weight:700;">${esc(g.assigned)} laporan</span>
              </div>
              <div style="margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                  <span>Tingkat Penyelesaian</span><strong>${esc(g.rate)}</strong>
                </div>
                <div class="block-progress-track"><div class="block-progress-fill" style="width:${esc(g.rate)};"></div></div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                  <span>Respons rata-rata</span><strong>${esc(g.avgResponse)}</strong>
                </div>
                <div class="block-progress-track"><div class="block-progress-fill" style="width:75%; background-color:var(--status-selesai-text);"></div></div>
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (e) {}
  },

  async renderOwnerUsers() {
    const container = document.getElementById('owner-users-table-container');
    if (!container) return;

    if (this.userTab === 'pendaftaran') {
      try {
        const res = await ApiClient.getPendingRegistrations();
        const list = (res && res.success && Array.isArray(res.data)) ? res.data : [];
        if (list.length === 0) {
          container.innerHTML = '<div style="text-align:center; padding:32px; color:var(--action-text);">Tidak ada pendaftaran penghuni baru yang menunggu verifikasi.</div>';
          return;
        }
        container.innerHTML = `
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Nama Warga</th><th>ID Diajukan</th><th>Nomor Rumah</th><th>Kontak</th><th>Waktu Daftar</th><th>Aksi</th></tr></thead>
              <tbody>
                ${list.map(r => `
                  <tr>
                    <td><strong>${esc(r.nama)}</strong></td>
                    <td class="table-id-cell">${esc(r.id_login)}</td>
                    <td>Blok ${esc(r.blok)} No. ${esc(r.no_rumah)}</td>
                    <td class="table-time-cell">${esc(r.no_hp || '-')}</td>
                    <td>${esc(r.created_at)}</td>
                    <td>
                      <div class="table-actions-cell">
                        <button class="btn-table-action" style="background:var(--action-main); color:#FFF;" onclick="App.approveRegistration('${r.id_login}')">${ICONS.check} Setujui</button>
                        <button class="btn-table-action action-danger" onclick="App.rejectRegistration('${r.id_login}')">${ICONS.close} Tolak</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        return;
      } catch (e) {}
    }

    await this.fetchUsers(this.userTab);

    if (this.userTab === 'penghuni') {
      const users = AccountStore.getByRole('penghuni');
      container.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th></th><th>Nama Warga</th><th>ID</th><th>Nomor Rumah</th><th>Kontak</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${avatarHtml(u, 30, 12)}</td>
                  <td><strong>${esc(u.name)}</strong></td>
                  <td class="table-id-cell">${esc(u.id)}</td>
                  <td>Blok ${esc(u.blok)} No. ${esc(u.nomorRumah)}</td>
                  <td class="table-time-cell">${esc(u.phone || '-')}</td>
                  <td>${this.getStatusChipHtml(u.active ? 'Selesai' : 'Baru')}</td>
                  <td>
                    <div class="table-actions-cell">
                      <button class="btn-table-action" onclick="App.openEditUserModal('${u.id}')">${ICONS.edit} Edit</button>
                      <button class="btn-table-action" onclick="App.resetUserPassword('${u.id}')" title="Reset kata sandi ke safehome123">${ICONS.lock} Reset kata sandi</button>
                      <button class="btn-table-action ${u.active ? 'action-danger' : ''}" onclick="App.toggleUserActive('${u.id}')">${u.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                      <button class="btn-table-action action-danger" onclick="App.deleteUser('${u.id}')">${ICONS.trash} Hapus</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      const users = AccountStore.getByRole('satpam');
      container.innerHTML = `
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr><th></th><th>Nama Petugas</th><th>ID</th><th>Shift & Penugasan</th><th>Kontak</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${avatarHtml(u, 30, 12)}</td>
                  <td><strong>${esc(u.name)}</strong></td>
                  <td class="table-id-cell">${esc(u.id)}</td>
                  <td>Shift ${esc(u.shift)} (${esc(u.shiftJam || '-')}) \u00b7 ${esc(u.pos || '-')}</td>
                  <td class="table-time-cell">${esc(u.phone || '-')}</td>
                  <td>${this.getStatusChipHtml(u.active ? 'Selesai' : 'Baru')}</td>
                  <td>
                    <div class="table-actions-cell">
                      <button class="btn-table-action" onclick="App.openEditUserModal('${u.id}')">${ICONS.edit} Edit</button>
                      <button class="btn-table-action" onclick="App.resetUserPassword('${u.id}')" title="Reset kata sandi ke safehome123">${ICONS.lock} Reset kata sandi</button>
                      <button class="btn-table-action ${u.active ? 'action-danger' : ''}" onclick="App.toggleUserActive('${u.id}')">${u.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                      <button class="btn-table-action action-danger" onclick="App.deleteUser('${u.id}')">${ICONS.trash} Hapus</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  },

  // ============ DIREKTUR SCREENS ============
  async renderDirekturSummary() {
    try {
      const res = await ApiClient.getStatistics();
      if (res && res.success && res.data) {
        const stats = res.data;
        const kpi = stats.kpi;

        const totalEl = document.getElementById('dir-kpi-total');
        if (totalEl) totalEl.textContent = kpi.totalReports;

        const rateEl = document.getElementById('dir-kpi-rate');
        if (rateEl) rateEl.textContent = kpi.completedRate + '%';

        const respEl = document.getElementById('dir-kpi-resp');
        if (respEl) respEl.textContent = kpi.avgResponseStr;

        const escEl = document.getElementById('dir-kpi-eskalasi');
        if (escEl) escEl.textContent = kpi.escalation;

        // Render Grafik Mingguan
        const weeklyBars = document.getElementById('dir-weekly-bars');
        if (weeklyBars && stats.weekly) {
          const maxW = Math.max(...stats.weekly.map(w => w.total), 10);
          weeklyBars.innerHTML = stats.weekly.map(w => {
            const hPct = Math.round((w.total / maxW) * 100);
            return `
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:1;">
                <div style="font-size:11px; font-weight:700; color:var(--text-main);">${esc(w.total)}</div>
                <div style="width:100%; max-width:38px; height:100px; display:flex; align-items:flex-end; background:var(--bg-page); border-radius:4px; overflow:hidden;">
                  <div style="width:100%; height:${hPct}%; background:var(--action-main); border-radius:4px 4px 0 0;"></div>
                </div>
                <div style="font-size:11px; color:var(--action-text); text-align:center;">${esc(w.label)}<br><span style="font-size:9.5px;">${esc(w.period)}</span></div>
              </div>
            `;
          }).join('');
        }

        // Render Grafik Kategori
        const catContainer = document.getElementById('dir-category-bars');
        if (catContainer && stats.categories) {
          const catEntries = Object.entries(stats.categories);
          const maxCat = Math.max(...Object.values(stats.categories), 8);
          catContainer.innerHTML = catEntries.map(([cat, cnt]) => {
            const pct = Math.round((cnt / maxCat) * 100);
            return `
              <div style="margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:3px;">
                  <span style="font-weight:600;">${esc(cat)}</span>
                  <span style="font-weight:700; color:var(--action-main);">${esc(cnt)}</span>
                </div>
                <div class="block-progress-track"><div class="block-progress-fill" style="width:${pct}%;"></div></div>
              </div>
            `;
          }).join('');
        }
      }
    } catch (e) {}
  },

  renderDirectorReports() {
    const listContainer = document.getElementById('direktur-periodic-reports-list');
    if (!listContainer) return;

    if (this.reportPeriodTab === 'mingguan') {
      const weekly = [
        { period: 'Minggu 8-14 Okt 2026', total: 11, selesai: 10, rate: '91%', eskalasi: 1 },
        { period: 'Minggu 1-7 Okt 2026', total: 9, selesai: 9, rate: '100%', eskalasi: 0 },
        { period: 'Minggu 24-30 Sep 2026', total: 8, selesai: 8, rate: '100%', eskalasi: 0 },
        { period: 'Minggu 17-23 Sep 2026', total: 7, selesai: 7, rate: '100%', eskalasi: 0 }
      ];
      listContainer.innerHTML = weekly.map(w => `
        <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding: 16px 20px; margin-bottom: 8px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="color:var(--action-text);">${ICONS.fileText}</div>
            <div>
              <div style="font-size:15px; font-weight:700; color:var(--text-main);">${w.period}</div>
              <div style="font-size:12.5px; color:var(--action-text);">${w.total} kejadian \u00b7 ${w.selesai} selesai</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <a href="api/export.php?period=mingguan" class="btn-outline-main" style="text-decoration:none;" download>
              ${ICONS.download} Unduh CSV
            </a>
            <button class="btn-outline-main" onclick="App.openPdfModal('${w.period}', { total: ${w.total}, selesai: ${w.selesai}, rate: '${w.rate}', eskalasi: ${w.eskalasi} })">
              Pratinjau PDF
            </button>
          </div>
        </div>
      `).join('');
    } else {
      const monthly = [
        { period: 'September 2026', total: 32, selesai: 32, rate: '100%', eskalasi: 1 },
        { period: 'Agustus 2026', total: 28, selesai: 28, rate: '100%', eskalasi: 0 },
        { period: 'Juli 2026', total: 30, selesai: 29, rate: '97%', eskalasi: 1 }
      ];
      listContainer.innerHTML = monthly.map(m => `
        <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding: 16px 20px; margin-bottom: 8px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="color:var(--action-text);">${ICONS.chart}</div>
            <div>
              <div style="font-size:15px; font-weight:700; color:var(--text-main);">Bulan ${m.period}</div>
              <div style="font-size:12.5px; color:var(--action-text);">${m.total} kejadian \u00b7 ${m.selesai} selesai</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <a href="api/export.php?period=bulanan" class="btn-outline-main" style="text-decoration:none;" download>
              ${ICONS.download} Unduh CSV
            </a>
            <button class="btn-outline-main" onclick="App.openPdfModal('Bulan ${m.period}', { total: ${m.total}, selesai: ${m.selesai}, rate: '${m.rate}', eskalasi: ${m.eskalasi} })">
              Pratinjau PDF
            </button>
          </div>
        </div>
      `).join('');
    }
  },

  // ============ MODAL SYSTEM ============
  openModal(title, bodyHtml, confirmCallback = null, confirmText = 'Simpan') {
    const modal = document.getElementById('global-modal');
    if (!modal) return;
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    const footer = document.getElementById('modal-footer');
    if (confirmCallback) {
      footer.innerHTML = `
        <button class="btn-outline-main" onclick="App.closeModal()">Batal</button>
        <button id="btn-modal-confirm" class="btn-main">${confirmText}</button>
      `;
      document.getElementById('btn-modal-confirm').addEventListener('click', confirmCallback);
    } else {
      footer.innerHTML = `<button class="btn-main" onclick="App.closeModal()">Tutup</button>`;
    }
    modal.classList.add('active');
  },

  closeModal() {
    const modal = document.getElementById('global-modal');
    if (modal) modal.classList.remove('active');
  }
};

window.App = App;
window.AccountStore = AccountStore;
window.ReportStore = ReportStore;
window.SessionStore = SessionStore;

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});