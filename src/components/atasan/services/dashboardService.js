import api from '@/lib/api';

export const dashboardService = {
  // ==================== KEHADIRAN ====================
  // GET /admin/dashboard/kehadiran?tanggal=YYYY-MM-DD
  getKehadiranByDate: (tanggal) => 
    api.get(`/admin/dashboard/kehadiran`, { params: { tanggal } }),
  
  // GET /admin/dashboard/pegawai-belum-absen-filter?tanggal=YYYY-MM-DD
  getPegawaiBelumAbsenByDate: (tanggal) => 
    api.get(`/admin/dashboard/pegawai-belum-absen-filter`, { params: { tanggal } }),
  
  // GET /admin/presensi?tanggal=YYYY-MM-DD
  getPresensiByDate: (tanggal) =>
    api.get(`/admin/presensi`, { params: { tanggal } }),
  
  // ==================== KINERJA ====================
  // GET /admin/dashboard/kinerja?tanggal=YYYY-MM-DD
  getKinerjaByDate: (tanggal) => 
    api.get(`/admin/dashboard/kinerja`, { params: { tanggal } }),
  
  // ==================== GRAFIK & REKAP ====================
  getGrafikHadirBulanan: (params) =>
    api.get(`/admin/dashboard/kehadiran-bulanan`, { params }),
  
  getGrafikKinerjaBulanan: (params) =>
    api.get(`/admin/dashboard/kinerja-bulanan`, { params }),
  
  getRekapKinerjaBulanan: (bulan, tahun) =>
    api.get(`/admin/kinerja/rekap-bulanan`, { params: { bulan, tahun } }),
  
  getStatistikKinerja: (bulan, tahun) =>
    api.get(`/admin/kinerja/statistik`, { params: { bulan, tahun } }),
  
  // ==================== UTILITY ====================
  getDaftarWilayah: () =>
    api.get(`/admin/dashboard/daftar-wilayah`),
  
  // ==================== COMPATIBILITY (LEGACY) ====================
  // Untuk backward compatibility dengan kode lama
  getKehadiranHariIni: (tanggal) => 
    api.get(`/admin/dashboard/kehadiran`, { params: { tanggal } }),
  
  getKinerjaHariIni: (tanggal) => 
    api.get(`/admin/dashboard/kinerja`, { params: { tanggal } }),
  
  getPegawaiBelumAbsen: (tanggal) => 
    api.get(`/admin/dashboard/pegawai-belum-absen-filter`, { params: { tanggal } }),
  getPegawaiIzinByDate: (tanggal) => 
    api.get(`/admin/dashboard/pegawai-izin`, { params: { tanggal } }),
   getPresensiHarian: (tanggal) =>
    api.get(`/admin/presensi?tanggal=${tanggal}`),
};