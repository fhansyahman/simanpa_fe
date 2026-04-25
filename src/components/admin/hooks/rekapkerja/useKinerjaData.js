// hooks/rekapkerja/useKinerjaData.js
"use client";

import { useState, useCallback } from "react";
import { kinerjaAPI } from "@/lib/api";

export function useKinerjaData() {
  const [kinerjaData, setKinerjaData] = useState([]);
  const [rekapData, setRekapData] = useState(null); // Store full rekap response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBulan, setCurrentBulan] = useState(null);
  const [currentTahun, setCurrentTahun] = useState(null);

  const loadData = useCallback(async (bulan, tahun) => {
    try {
      setLoading(true);
      setError(null);
      
      // Gunakan API getRekapBulanan dengan parameter bulan dan tahun
      const response = await kinerjaAPI.getRekapBulanan({
        bulan: bulan,
        tahun: tahun
      });
      
      if (response.data.success) {
        const data = response.data.data;
        setRekapData(data);
        setKinerjaData(data.rekap || []); // rekap array dari response
        setCurrentBulan(data.periode?.bulan);
        setCurrentTahun(data.periode?.tahun);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data');
      }
      
    } catch (error) {
      console.error('Error loading rekap data:', error);
      setError(error.response?.data?.message || error.message || 'Gagal memuat data rekap laporan kerja');
      setKinerjaData([]);
      setRekapData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback((bulan, tahun) => {
    loadData(bulan, tahun);
  }, [loadData]);

  return {
    kinerjaData,
    rekapData, // Full rekap response with periode, summary, dates
    loading,
    error,
    currentBulan,
    currentTahun,
    loadData,
    refreshData
  };
}