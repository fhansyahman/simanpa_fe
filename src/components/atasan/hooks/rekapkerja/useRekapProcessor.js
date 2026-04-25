// hooks/rekapkerja/useRekapProcessor.js
"use client";

import { useState, useCallback, useEffect } from "react";

export function useRekapProcessor(rekapData, bulanFilter, tahunFilter, wilayahFilter, search) {
  const [rekapBulanan, setRekapBulanan] = useState([]);
  const [statistikBulanan, setStatistikBulanan] = useState(null);
  const [dates, setDates] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [processing, setProcessing] = useState(false);

  const getDaysInMonth = useCallback((tahun, bulan) => {
    return new Date(tahun, bulan, 0).getDate();
  }, []);

  const processRekap = useCallback(async () => {
    if (!bulanFilter || !tahunFilter) {
      setRekapBulanan([]);
      setStatistikBulanan(null);
      setDates([]);
      setPeriode(null);
      return;
    }
    
    setProcessing(true);
    
    try {
      // Jika rekapData sudah ada dari API, gunakan langsung
      if (rekapData && rekapData.rekap && Array.isArray(rekapData.rekap)) {
        let filteredRekap = [...rekapData.rekap];
        
        // Filter berdasarkan wilayah
        if (wilayahFilter && wilayahFilter !== '') {
          filteredRekap = filteredRekap.filter(item => item.wilayah === wilayahFilter);
        }
        
        // Filter berdasarkan search (nama atau jabatan)
        if (search && search !== '') {
          const searchLower = search.toLowerCase();
          filteredRekap = filteredRekap.filter(item => 
            item.nama?.toLowerCase().includes(searchLower) ||
            item.jabatan?.toLowerCase().includes(searchLower)
          );
        }
        
        // Gunakan statistik dari API
        let apiStatistik = rekapData.summary || {};
        
        // Hitung ulang statistik berdasarkan filter
        let totalLaporan = 0;
        let totalKR = 0;
        let totalKN = 0;
        let totalHadir = 0;
        
        filteredRekap.forEach(item => {
          totalLaporan += item.total_laporan || 0;
          totalHadir += item.total_hadir || 0;
          totalKR += item.total_kr || 0;
          totalKN += item.total_kn || 0;
        });
        
        const totalPanjang = totalKR + totalKN;
        const totalPegawai = filteredRekap.length;
        const totalHariKerja = rekapData.periode?.total_hari_kerja || 0;
        const persenKehadiran = totalPegawai > 0 && totalHariKerja > 0 
          ? Math.round((totalHadir / (totalPegawai * totalHariKerja)) * 100) 
          : 0;
        
        setStatistikBulanan({
          totalPegawai,
          totalLaporan,
          totalHadir,
          totalKR: parseFloat(totalKR.toFixed(2)),
          totalKN: parseFloat(totalKN.toFixed(2)),
          totalPanjang: parseFloat(totalPanjang.toFixed(2)),
          persenKehadiran,
          rataKR: totalLaporan > 0 ? parseFloat((totalKR / totalLaporan).toFixed(2)) : 0,
          rataKN: totalLaporan > 0 ? parseFloat((totalKN / totalLaporan).toFixed(2)) : 0
        });
        
        setRekapBulanan(filteredRekap);
        setDates(rekapData.dates || []);
        setPeriode(rekapData.periode || null);
      } else {
        // Fallback: data kosong
        setRekapBulanan([]);
        setStatistikBulanan({
          totalPegawai: 0,
          totalLaporan: 0,
          totalHadir: 0,
          totalKR: 0,
          totalKN: 0,
          totalPanjang: 0,
          persenKehadiran: 0,
          rataKR: 0,
          rataKN: 0
        });
        setDates([]);
        setPeriode(null);
      }
      
    } catch (error) {
      console.error('Error processing rekap:', error);
    } finally {
      setProcessing(false);
    }
  }, [rekapData, bulanFilter, tahunFilter, wilayahFilter, search]);
  
  return {
    rekapBulanan,
    statistikBulanan,
    dates,
    periode,
    processing,
    processRekap,
    getDaysInMonth
  };
}