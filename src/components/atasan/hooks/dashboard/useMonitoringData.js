"use client";

import { useState, useCallback, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import Swal from "sweetalert2";
import { formatDate } from "../../utils/dashboard/formatters";
import { useAuth } from "@/context/AuthContext";

export function useMonitoringData() {
  const { user } = useAuth();
  const [state, setState] = useState({
    selectedDate: new Date().toISOString().split('T')[0],
    dataBelumAbsen: [],
    dataBelumLapor: [],
    dataIzin: [],
    dataSakit: [],
    dataCuti: [],
    dataSudahLapor: [],
    semuaPegawai: [],
    presensiData: [],
    kinerjaData: [],
    loading: {
      data: false,
      stats: false
    },
    stats: {
      totalPegawai: 0,
      hadir: 0,
      terlambat: 0,
      tepatWaktu: 0,
      izin: 0,
      sakit: 0,
      cuti: 0,
      belumAbsen: 0,
      belumLapor: 0,
      sudahLapor: 0,
      tanpaKeterangan: 0
    },
    lastUpdated: null,
    filteredByWilayah: false
  });

  const isAdmin = user?.roles === 'admin' || user?.roles === 'superadmin';
  const isAtasan = user?.roles === 'atasan';
  const userWilayah = user?.wilayah_penugasan;

  // ==================== FILTER DATA BERDASARKAN WILAYAH ====================

  const filterDataByWilayah = useCallback((data) => {
    // Jika admin, tampilkan semua data
    if (isAdmin || !userWilayah) return data;
    
    // Jika atasan, filter berdasarkan wilayah user
    if (!data || !Array.isArray(data)) return [];
    return data.filter(item => 
      item.wilayah_penugasan === userWilayah
    );
  }, [isAdmin, userWilayah]);

  const filterPegawaiByWilayah = useCallback((pegawaiList) => {
    // Jika admin, tampilkan semua pegawai
    if (isAdmin || !userWilayah) return pegawaiList;
    
    // Jika atasan, filter berdasarkan wilayah user
    if (!pegawaiList || !Array.isArray(pegawaiList)) return [];
    return pegawaiList.filter(pegawai => 
      pegawai.wilayah_penugasan === userWilayah
    );
  }, [isAdmin, userWilayah]);

  // ==================== FUNGSI UNTUK MENDAPATKAN TOTAL PEGAWAI PER WILAYAH ====================
  
  const getTotalPegawaiByWilayah = useCallback(async (wilayah) => {
    try {
      // Coba ambil dari master pegawai terlebih dahulu
      const masterPegawaiRes = await dashboardService.getAllPegawai?.();
      const masterPegawaiData = masterPegawaiRes?.data?.data || masterPegawaiRes?.data || [];
      
      if (masterPegawaiData.length > 0) {
        const filtered = masterPegawaiData.filter(p => p.wilayah_penugasan === wilayah);
        console.log(`📊 Total pegawai wilayah ${wilayah} dari master:`, filtered.length);
        return filtered.length;
      }
    } catch (err) {
      console.warn('⚠️ Gagal mengambil master pegawai:', err);
    }
    
    // Fallback: data statis berdasarkan wilayah
    const wilayahCount = {
      'Prajekan': 7,
      'Klabang': 4,
      'Cermee': 7,
      'Botolinggo': 4,
      'Ijen': 1
    };
    
    const count = wilayahCount[wilayah] || 0;
    console.log(`📊 Total pegawai wilayah ${wilayah} dari fallback:`, count);
    return count;
  }, []);

  // ==================== FETCH DATA - LANGSUNG DARI BACKEND ====================

  const fetchMonitoringData = useCallback(async (tanggal) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: { data: true, stats: true },
        selectedDate: tanggal
      }));
      
      console.log('🔄 Fetching monitoring data untuk tanggal:', tanggal);
      console.log('👤 User:', user?.nama, 'Roles:', user?.roles, 'Wilayah:', userWilayah);
      
      // 🔥 AMBIL SEMUA DATA TERMASUK DATA IZIN
      const [kehadiranRes, belumAbsenRes, kinerjaRes, izinRes] = await Promise.all([
        dashboardService.getKehadiranByDate(tanggal),
        dashboardService.getPegawaiBelumAbsenByDate(tanggal),
        dashboardService.getKinerjaByDate(tanggal),
        dashboardService.getPegawaiIzinByDate(tanggal)
      ]);
      
      let kehadiranData = kehadiranRes?.data?.data || kehadiranRes?.data || {};
      let kinerjaData = kinerjaRes?.data?.data || kinerjaRes?.data || {};
      let belumAbsenData = belumAbsenRes?.data?.data || belumAbsenRes?.data || [];
      let izinData = izinRes?.data?.data || { izin: [], sakit: [], cuti: [] };
      
      // Pastikan data berbentuk array
      belumAbsenData = Array.isArray(belumAbsenData) ? belumAbsenData : [];
      izinData = {
        izin: Array.isArray(izinData.izin) ? izinData.izin : [],
        sakit: Array.isArray(izinData.sakit) ? izinData.sakit : [],
        cuti: Array.isArray(izinData.cuti) ? izinData.cuti : []
      };
      
      // 🔥 FILTER DATA BERDASARKAN WILAYAH USER
      const filteredBelumAbsen = filterDataByWilayah(belumAbsenData);
      const filteredIzin = filterDataByWilayah(izinData.izin);
      const filteredSakit = filterDataByWilayah(izinData.sakit);
      const filteredCuti = filterDataByWilayah(izinData.cuti);
      
      // Filter daftar belum lapor berdasarkan wilayah
      let belumLaporOriginal = kinerjaData.daftar_belum_lapor || [];
      belumLaporOriginal = Array.isArray(belumLaporOriginal) ? filterDataByWilayah(belumLaporOriginal) : [];
      
      let sudahLaporData = kinerjaData.top_performers || [];
      sudahLaporData = Array.isArray(sudahLaporData) ? filterDataByWilayah(sudahLaporData) : [];
      
      console.log('✅ Data setelah filter wilayah:', {
        belumAbsen: filteredBelumAbsen.length,
        izin: filteredIzin.length,
        sakit: filteredSakit.length,
        cuti: filteredCuti.length,
        belumLapor: belumLaporOriginal.length,
        sudahLapor: sudahLaporData.length
      });
      
      // 🔥 HITUNG TOTAL PEGAWAI BERDASARKAN WILAYAH USER
      let totalPegawai = 0;
      
      if (!isAdmin && userWilayah) {
        // Untuk atasan, ambil total pegawai dari master data atau fallback
        totalPegawai = await getTotalPegawaiByWilayah(userWilayah);
        
        // Alternatif: hitung dari kombinasi data yang ada
        const hitungDariData = filteredBelumAbsen.length + 
                               (kehadiranData.hadir || 0) + 
                               filteredIzin.length + 
                               filteredSakit.length + 
                               filteredCuti.length;
        
        // Jika total dari master lebih besar, gunakan yang lebih besar
        if (hitungDariData > totalPegawai) {
          console.log(`📊 Menggunakan total dari data (${hitungDariData}) karena lebih besar dari master (${totalPegawai})`);
          totalPegawai = hitungDariData;
        }
      } else {
        // Untuk admin, gunakan dari response backend
        totalPegawai = kehadiranData.total_pegawai || kinerjaData.total_pegawai || 0;
      }
      
      console.log('📊 Total pegawai final:', totalPegawai);
      
      // 🔥 HITUNG STATISTIK
      const finalStats = {
        totalPegawai: totalPegawai,
        hadir: kehadiranData.hadir || 0,
        terlambat: parseInt(kehadiranData.terlambat) || 0,
        tepatWaktu: parseInt(kehadiranData.hadir_tepat_waktu) || 0,
        izin: filteredIzin.length,
        sakit: filteredSakit.length,
        cuti: filteredCuti.length,
        belumAbsen: filteredBelumAbsen.length,
        belumLapor: belumLaporOriginal.length,
        sudahLapor: kinerjaData.sudah_lapor || 0,
        tanpaKeterangan: Math.max(0, totalPegawai - (
          (kehadiranData.hadir || 0) + 
          filteredIzin.length + 
          filteredSakit.length + 
          filteredCuti.length + 
          filteredBelumAbsen.length
        ))
      };
      
      console.log('📊 Statistik final (filtered):', finalStats);
      
      setState(prev => ({
        ...prev,
        semuaPegawai: [],
        presensiData: [],
        kinerjaData: kinerjaData,
        dataBelumAbsen: filteredBelumAbsen,
        dataBelumLapor: belumLaporOriginal,
        dataSudahLapor: sudahLaporData,
        dataIzin: filteredIzin,
        dataSakit: filteredSakit,
        dataCuti: filteredCuti,
        stats: finalStats,
        lastUpdated: new Date().toISOString(),
        loading: { data: false, stats: false },
        filteredByWilayah: !isAdmin && !!userWilayah
      }));
      
      return {
        success: true,
        data: {
          belumAbsen: filteredBelumAbsen,
          belumLapor: belumLaporOriginal,
          sudahLapor: sudahLaporData,
          izin: { izin: filteredIzin, sakit: filteredSakit, cuti: filteredCuti },
          stats: finalStats,
          kehadiran: kehadiranData,
          kinerja: kinerjaData
        }
      };
      
    } catch (err) {
      console.error('❌ Error fetching monitoring data:', err);
      
      // FALLBACK - DATA SIMULASI BERDASARKAN WILAYAH
      console.log('🔄 Menggunakan data fallback...');
      
      // Data statis pegawai per wilayah
      const dataPegawaiPerWilayah = {
        'Prajekan': [
          { id: 101, nama: 'HERUL RAHMAN', wilayah_penugasan: 'Prajekan', nip: '001', jabatan: 'Staff' },
          { id: 107, nama: 'MUHAMMAD ILZEM M', wilayah_penugasan: 'Prajekan', nip: '007', jabatan: 'Staff' },
          { id: 108, nama: 'NUR HASAN', wilayah_penugasan: 'Prajekan', nip: '008', jabatan: 'Staff' },
          { id: 111, nama: 'Rudi Sucipto', wilayah_penugasan: 'Prajekan', nip: '011', jabatan: 'Staff' },
          { id: 114, nama: 'SAIFURRAHMAN', wilayah_penugasan: 'Prajekan', nip: '014', jabatan: 'Staff' },
          { id: 119, nama: 'ZAENUR RACHMAN', wilayah_penugasan: 'Prajekan', nip: '019', jabatan: 'Staff' },
          { id: 120, nama: 'ZAKKI AMIN', wilayah_penugasan: 'Prajekan', nip: '020', jabatan: 'Staff' }
        ],
        'Klabang': [
          { id: 102, nama: 'IWAN SETIAWAN', wilayah_penugasan: 'Klabang', nip: '002', jabatan: 'Staff' },
          { id: 103, nama: 'JEVIL ASTARA', wilayah_penugasan: 'Klabang', nip: '003', jabatan: 'Staff' },
          { id: 117, nama: 'YOFAN AFANDI A', wilayah_penugasan: 'Klabang', nip: '017', jabatan: 'Staff' }
        ],
        'Cermee': [
          { id: 106, nama: 'MUHAKKI', wilayah_penugasan: 'Cermee', nip: '006', jabatan: 'Staff' },
          { id: 109, nama: 'NURUL HAMDI', wilayah_penugasan: 'Cermee', nip: '009', jabatan: 'Staff' },
          { id: 113, nama: 'SAEFULLAH', wilayah_penugasan: 'Cermee', nip: '013', jabatan: 'Staff' },
          { id: 115, nama: 'SOFYAN ISLAMI', wilayah_penugasan: 'Cermee', nip: '015', jabatan: 'Staff' },
          { id: 116, nama: 'SUBUR DUNIA', wilayah_penugasan: 'Cermee', nip: '016', jabatan: 'Staff' },
          { id: 121, nama: 'HERIK SWANDI', wilayah_penugasan: 'Cermee', nip: '021', jabatan: 'Staff' }
        ],
        'Botolinggo': [
          { id: 105, nama: 'MUH. FATHONI', wilayah_penugasan: 'Botolinggo', nip: '005', jabatan: 'Staff' },
          { id: 110, nama: 'RANDY PRAYOGA', wilayah_penugasan: 'Botolinggo', nip: '010', jabatan: 'Staff' },
          { id: 112, nama: 'RUDIANTO', wilayah_penugasan: 'Botolinggo', nip: '012', jabatan: 'Staff' },
          { id: 118, nama: 'YULIUS EDAR M', wilayah_penugasan: 'Botolinggo', nip: '018', jabatan: 'Staff' }
        ],
        'Ijen': [
          { id: 104, nama: 'MUH. ANAS', wilayah_penugasan: 'Ijen', nip: '004', jabatan: 'Staff' }
        ]
      };
      
      // Pilih data berdasarkan wilayah user atau semua jika admin
      let filteredFallbackPegawai = [];
      let totalPegawai = 0;
      
      if (!isAdmin && userWilayah) {
        filteredFallbackPegawai = dataPegawaiPerWilayah[userWilayah] || [];
        totalPegawai = filteredFallbackPegawai.length;
        console.log(`📊 Fallback untuk wilayah ${userWilayah}: ${totalPegawai} pegawai`);
      } else {
        // Untuk admin, gabungkan semua wilayah
        filteredFallbackPegawai = Object.values(dataPegawaiPerWilayah).flat();
        totalPegawai = filteredFallbackPegawai.length;
        console.log(`📊 Fallback untuk admin: ${totalPegawai} pegawai`);
      }
      
      const fallbackStats = {
        totalPegawai: totalPegawai,
        hadir: 0,
        terlambat: 0,
        tepatWaktu: 0,
        izin: 0,
        sakit: 0,
        cuti: 0,
        belumAbsen: filteredFallbackPegawai.length,
        belumLapor: 0,
        sudahLapor: 0,
        tanpaKeterangan: 0
      };
      
      setState(prev => ({
        ...prev,
        semuaPegawai: filteredFallbackPegawai,
        dataBelumAbsen: filteredFallbackPegawai,
        dataBelumLapor: [],
        dataSudahLapor: [],
        dataIzin: [],
        dataSakit: [],
        dataCuti: [],
        stats: fallbackStats,
        lastUpdated: new Date().toISOString(),
        loading: { data: false, stats: false },
        filteredByWilayah: !isAdmin && !!userWilayah
      }));
      
      Swal.fire({
        icon: 'warning',
        title: 'Menggunakan Data Simulasi',
        text: `Menampilkan data simulasi untuk ${totalPegawai} pegawai${!isAdmin && userWilayah ? ` di wilayah ${userWilayah}` : ''}`,
        confirmButtonText: 'Oke',
        confirmButtonColor: '#F59E0B',
      });
      
      return { success: false, error: err.message };
    }
  }, [user, isAdmin, userWilayah, filterDataByWilayah, getTotalPegawaiByWilayah]);

  // ==================== HANDLE DATE CHANGE ====================

  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    setState(prev => ({ ...prev, selectedDate: newDate }));
    fetchMonitoringData(newDate);
  }, [fetchMonitoringData]);

  // ==================== REFRESH DATA ====================

  const refreshData = useCallback(() => {
    fetchMonitoringData(state.selectedDate);
  }, [fetchMonitoringData, state.selectedDate]);

  // ==================== EXPORT DATA ====================

  const handleExportData = useCallback(() => {
    const { 
      dataBelumAbsen, 
      dataBelumLapor, 
      dataSudahLapor,
      dataIzin,
      dataSakit,
      dataCuti,
      selectedDate,
      stats,
      filteredByWilayah
    } = state;
    
    const semuaData = [
      ...dataBelumAbsen.map(item => ({...item, status: 'Belum Absen', keterangan: 'Belum melakukan absensi'})),
      ...dataBelumLapor.map(item => ({...item, status: 'Belum Lapor Kinerja', keterangan: item.keterangan || 'Belum lapor kinerja'})),
      ...dataSudahLapor.map(item => ({...item, status: 'Sudah Lapor Kinerja', keterangan: `Total kinerja: ${item.total_kinerja}`})),
      ...dataIzin.map(item => ({...item, status: 'Izin', keterangan: item.keterangan || 'Izin'})),
      ...dataSakit.map(item => ({...item, status: 'Sakit', keterangan: item.keterangan || 'Sakit'})),
      ...dataCuti.map(item => ({...item, status: 'Cuti', keterangan: item.keterangan || 'Cuti'}))
    ];
    
    // Tambahkan ringkasan dari stats
    const wilayahInfo = filteredByWilayah ? ` (Wilayah: ${userWilayah})` : '';
    const ringkasan = [
      { nama: '=== RINGKASAN HARIAN' + wilayahInfo + ' ===', status: '', keterangan: '' },
      { nama: `Tanggal: ${formatDate(selectedDate)}`, status: '', keterangan: '' },
      { nama: `Total Pegawai: ${stats.totalPegawai}`, status: '', keterangan: '' },
      { nama: `Hadir / Tepat Waktu: ${stats.tepatWaktu}`, status: '', keterangan: '' },
      { nama: `Terlambat: ${stats.terlambat}`, status: '', keterangan: '' },
      { nama: `Izin: ${stats.izin}`, status: '', keterangan: '' },
      { nama: `Sakit: ${stats.sakit}`, status: '', keterangan: '' },
      { nama: `Cuti: ${stats.cuti}`, status: '', keterangan: '' },
      { nama: `Belum Absen: ${stats.belumAbsen}`, status: '', keterangan: '' },
      { nama: `Belum Lapor: ${stats.belumLapor}`, status: '', keterangan: '' },
      { nama: `Sudah Lapor: ${stats.sudahLapor}`, status: '', keterangan: '' },
      { nama: `Tanpa Keterangan: ${stats.tanpaKeterangan}`, status: '', keterangan: '' },
    ];
    
    const semuaDataExport = [...semuaData, ...ringkasan];
    
    if (semuaDataExport.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Tidak Ada Data',
        text: 'Tidak ada data untuk diekspor',
        confirmButtonText: 'Oke'
      });
      return;
    }
    
    const headers = ['Nama', 'NIP', 'Jabatan', 'Wilayah', 'Status', 'Keterangan'];
    const csvData = semuaDataExport.map(item => [
      item.nama || '',
      item.nip || '',
      item.jabatan || '',
      item.wilayah_penugasan || '',
      item.status || item.type || '',
      item.keterangan || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = filteredByWilayah 
      ? `monitoring_${userWilayah}_${selectedDate}.csv`
      : `monitoring_${selectedDate}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: `Data berhasil diekspor (${semuaData.length} data pegawai + ringkasan)`,
      confirmButtonText: 'Oke',
      confirmButtonColor: '#10B981',
      timer: 2000
    });
  }, [state, userWilayah]);

  // ==================== GET STATISTIK DETAIL ====================

  const getStatistikDetail = useCallback(() => {
    const { stats } = state;
    
    return [
      { label: 'Total Pegawai', value: stats.totalPegawai, color: 'blue' },
      { label: 'Hadir Tepat Waktu', value: stats.tepatWaktu, color: 'green' },
      { label: 'Terlambat', value: stats.terlambat, color: 'orange' },
      { label: 'Izin', value: stats.izin, color: 'purple' },
      { label: 'Sakit', value: stats.sakit, color: 'pink' },
      { label: 'Cuti', value: stats.cuti, color: 'indigo' },
      { label: 'Belum Absen', value: stats.belumAbsen, color: 'yellow' },
      { label: 'Belum Lapor', value: stats.belumLapor, color: 'red' },
      { label: 'Sudah Lapor', value: stats.sudahLapor, color: 'green' },
    ];
  }, [state.stats]);

  // ==================== GET PERSENTASE ====================

  const getPersentase = useCallback((value) => {
    const total = state.stats.totalPegawai;
    if (!total || total === 0) return '0%';
    // Batasi maksimal 100%
    const persentase = Math.min(100, Math.round((value / total) * 100));
    return `${persentase}%`;
  }, [state.stats.totalPegawai]);

  // ==================== EFFECT UNTUK INITIAL FETCH ====================

  useEffect(() => {
    if (user) {
      console.log('👤 User loaded, fetching monitoring data...');
      fetchMonitoringData(state.selectedDate);
    }
    
    // Auto refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('🔄 Auto refresh monitoring data');
      if (user) {
        fetchMonitoringData(state.selectedDate);
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== RETURN ====================

  return {
    selectedDate: state.selectedDate,
    dataBelumAbsen: state.dataBelumAbsen,
    dataBelumLapor: state.dataBelumLapor,
    dataSudahLapor: state.dataSudahLapor,
    dataIzin: state.dataIzin,
    dataSakit: state.dataSakit,
    dataCuti: state.dataCuti,
    semuaPegawai: state.semuaPegawai,
    presensiData: state.presensiData,
    kinerjaData: state.kinerjaData,
    loading: state.loading,
    stats: state.stats,
    lastUpdated: state.lastUpdated,
    filteredByWilayah: state.filteredByWilayah,
    userWilayah,
    isAtasan,
    isAdmin,
    
    handleDateChange,
    fetchMonitoringData,
    refreshData,
    handleExportData,
    getStatistikDetail,
    getPersentase,
    
    formatDate
  };
}