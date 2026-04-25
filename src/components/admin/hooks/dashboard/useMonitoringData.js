"use client";

import { useState, useCallback, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import Swal from "sweetalert2";
import { formatDate } from "../../utils/dashboard/formatters";

export function useMonitoringData() {
  const [state, setState] = useState({
    selectedDate: new Date().toISOString().split('T')[0],
    dataBelumAbsen: [],
    dataBelumLapor: [],
    dataIzin: [],
    dataSakit: [],
    dataCuti: [],
    dataSudahLapor: [], // Tambahkan untuk yang sudah lapor
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
    lastUpdated: null
  });

  // ==================== FETCH DATA - LANGSUNG DARI BACKEND ====================

  const fetchMonitoringData = useCallback(async (tanggal) => {
  try {
    setState(prev => ({ 
      ...prev, 
      loading: { data: true, stats: true },
      selectedDate: tanggal
    }));
    
    console.log('🔄 Fetching monitoring data untuk tanggal:', tanggal);
    
    // 🔥 AMBIL SEMUA DATA TERMASUK DATA IZIN
    const [kehadiranRes, belumAbsenRes, kinerjaRes, izinRes] = await Promise.all([
      dashboardService.getKehadiranByDate(tanggal),
      dashboardService.getPegawaiBelumAbsenByDate(tanggal),
      dashboardService.getKinerjaByDate(tanggal),
      dashboardService.getPegawaiIzinByDate(tanggal)  // TAMBAHKAN
    ]);
    
    const kehadiranData = kehadiranRes?.data?.data || kehadiranRes?.data || {};
    const kinerjaData = kinerjaRes?.data?.data || kinerjaRes?.data || {};
    const belumAbsenData = belumAbsenRes?.data?.data || belumAbsenRes?.data || [];
    const izinData = izinRes?.data?.data || { izin: [], sakit: [], cuti: [] };
    
    console.log('✅ Data dari backend:', {
      kehadiran: kehadiranData,
      belumAbsen: belumAbsenData.length,
      kinerja: {
        total_pegawai: kinerjaData.total_pegawai,
        sudah_lapor: kinerjaData.sudah_lapor,
        belum_lapor: kinerjaData.daftar_belum_lapor?.length
      },
      izin: {
        izin: izinData.izin?.length,
        sakit: izinData.sakit?.length,
        cuti: izinData.cuti?.length
      }
    });
    
    const totalPegawai = kehadiranData.total_pegawai || kinerjaData.total_pegawai || 0;
    const belumLaporOriginal = kinerjaData.daftar_belum_lapor || [];
    const sudahLapor = kinerjaData.sudah_lapor || 0;
    const sudahLaporData = kinerjaData.top_performers || [];
    
    // 🔥 HITUNG STATISTIK
    const finalStats = {
      totalPegawai: totalPegawai,
      hadir: kehadiranData.hadir || 0,
      terlambat: parseInt(kehadiranData.terlambat) || 0,
      tepatWaktu: parseInt(kehadiranData.hadir_tepat_waktu) || 0,
      izin: kehadiranData.izin || 0,
      sakit: kehadiranData.sakit || 0,
      cuti: kehadiranData.cuti || 0,
      belumAbsen: belumAbsenData.length,
      belumLapor: belumLaporOriginal.length,
      sudahLapor: sudahLapor,
      tanpaKeterangan: Math.max(0, totalPegawai - (
        (kehadiranData.hadir || 0) + 
        (kehadiranData.izin || 0) + 
        (kehadiranData.sakit || 0) + 
        (kehadiranData.cuti || 0) + 
        belumAbsenData.length
      ))
    };
    
    console.log('📊 Statistik final:', finalStats);
    
    setState(prev => ({
      ...prev,
      semuaPegawai: [],
      presensiData: [],
      kinerjaData: kinerjaData,
      dataBelumAbsen: belumAbsenData,      // SEKARANG HANYA YANG BENAR-BENAR BELUM ABSEN
      dataBelumLapor: belumLaporOriginal,
      dataSudahLapor: sudahLaporData,
      dataIzin: izinData.izin || [],        // TAMBAHKAN
      dataSakit: izinData.sakit || [],      // TAMBAHKAN
      dataCuti: izinData.cuti || [],        // TAMBAHKAN
      stats: finalStats,
      lastUpdated: new Date().toISOString(),
      loading: { data: false, stats: false }
    }));
    
    return {
      success: true,
      data: {
        belumAbsen: belumAbsenData,
        belumLapor: belumLaporOriginal,
        sudahLapor: sudahLaporData,
        izin: izinData,
        stats: finalStats,
        kehadiran: kehadiranData,
        kinerja: kinerjaData
      }
    };
    
  } catch (err) {
    console.error('❌ Error fetching monitoring data:', err);
    
    // FALLBACK - coba gunakan endpoint legacy jika ada error
    try {
      console.log('🔄 Mencoba endpoint legacy...');
      const [kehadiranRes, belumAbsenRes, kinerjaRes] = await Promise.all([
        dashboardService.getKehadiranHariIni(tanggal),
        dashboardService.getPegawaiBelumAbsen(tanggal),
        dashboardService.getKinerjaHariIni(tanggal)
      ]);
      
      const kehadiranData = kehadiranRes?.data?.data || kehadiranRes?.data || {};
      const kinerjaData = kinerjaRes?.data?.data || kinerjaRes?.data || {};
      const belumAbsenData = belumAbsenRes?.data?.data || belumAbsenRes?.data || [];
      
      const totalPegawai = kehadiranData.total_pegawai || 30;
      
      const fallbackStats = {
        totalPegawai: totalPegawai,
        hadir: kehadiranData.hadir || 0,
        terlambat: kehadiranData.terlambat || 0,
        tepatWaktu: kehadiranData.hadir_tepat_waktu || 0,
        izin: kehadiranData.izin || 0,
        sakit: kehadiranData.sakit || 0,
        cuti: kehadiranData.cuti || 0,
        belumAbsen: belumAbsenData.length,
        belumLapor: kinerjaData.daftar_belum_lapor?.length || 0,
        sudahLapor: kinerjaData.sudah_lapor || 0,
        tanpaKeterangan: 0
      };
      
      setState(prev => ({
        ...prev,
        dataBelumAbsen: belumAbsenData,
        dataBelumLapor: kinerjaData.daftar_belum_lapor || [],
        dataSudahLapor: kinerjaData.top_performers || [],
        stats: fallbackStats,
        lastUpdated: new Date().toISOString(),
        loading: { data: false, stats: false }
      }));
      
      Swal.fire({
        icon: 'warning',
        title: 'Menggunakan Endpoint Legacy',
        text: 'Endpoint baru tidak tersedia, menggunakan endpoint lama',
        confirmButtonText: 'Oke',
      });
      
      return { success: true, data: { stats: fallbackStats } };
      
    } catch (fallbackErr) {
      console.error('❌ Fallback juga gagal:', fallbackErr);
      
      const fallbackStats = {
        totalPegawai: 30,
        hadir: 0,
        terlambat: 0,
        tepatWaktu: 0,
        izin: 0,
        sakit: 0,
        cuti: 0,
        belumAbsen: 0,
        belumLapor: 0,
        sudahLapor: 0,
        tanpaKeterangan: 30
      };
      
      setState(prev => ({
        ...prev,
        dataBelumAbsen: [],
        dataBelumLapor: [],
        dataSudahLapor: [],
        stats: fallbackStats,
        lastUpdated: new Date().toISOString(),
        loading: { data: false, stats: false }
      }));
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: `Error: ${err.message}`,
        confirmButtonText: 'Coba Lagi',
      });
      
      return { success: false, error: err.message };
    }
  }
}, []);

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
      selectedDate,
      stats
    } = state;
    
    const semuaData = [
      ...dataBelumAbsen.map(item => ({...item, status: 'Belum Absen', keterangan: 'Belum melakukan absensi'})),
      ...dataBelumLapor.map(item => ({...item, status: 'Belum Lapor Kinerja', keterangan: item.keterangan || 'Belum lapor kinerja'})),
      ...dataSudahLapor.map(item => ({...item, status: 'Sudah Lapor Kinerja', keterangan: `Total kinerja: ${item.total_kinerja}`}))
    ];
    
    // Tambahkan ringkasan dari stats
    const ringkasan = [
      { nama: '=== RINGKASAN HARIAN ===', status: '', keterangan: '' },
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
    
    link.setAttribute('href', url);
    link.setAttribute('download', `monitoring_${selectedDate}.csv`);
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
  }, [state]);

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
    fetchMonitoringData(state.selectedDate);
    
    // Auto refresh every 5 minutes
    const interval = setInterval(() => {
      console.log('🔄 Auto refresh monitoring data');
      fetchMonitoringData(state.selectedDate);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    
    handleDateChange,
    fetchMonitoringData,
    refreshData,
    handleExportData,
    getStatistikDetail,
    getPersentase,
    
    formatDate
  };
}