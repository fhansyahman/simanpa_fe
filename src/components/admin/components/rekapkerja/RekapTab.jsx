// app/admin/rekapkerja/components/RekapTab.jsx
"use client";

import { RefreshCw, TrendingUp, Ruler, MapPin } from "lucide-react";
import { RekapTable } from "./RekapTable";

export function RekapTab({
  processing,
  bulanFilter,
  tahunFilter,
  wilayahFilter,
  search,
  rekapBulanan,
  statistikBulanan,
  dates,
  periode,
  getBulanLabel,
  onRefresh,
  getDaysInMonth
}) {
  const safeRekapBulanan = Array.isArray(rekapBulanan) ? rekapBulanan : [];
  const safeStatistik = statistikBulanan || {
    totalPegawai: 0,
    totalLaporan: 0,
    totalKR: 0,
    totalKN: 0,
    totalPanjang: 0,
    persenKehadiran: 0
  };

  if (!bulanFilter || !tahunFilter) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp size={32} className="text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Silakan pilih bulan dan tahun terlebih dahulu</p>
        <p className="text-sm text-slate-400 mt-1">Data akan ditampilkan setelah filter dipilih</p>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <span className="mt-4 text-slate-600 font-medium">Memproses data laporan...</span>
      </div>
    );
  }

  if (safeRekapBulanan.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
          <MapPin size={32} className="text-amber-500" />
        </div>
        <p className="text-slate-600 font-medium">Tidak ada data laporan kerja</p>
        <p className="text-sm text-slate-400 mt-1">
          {getBulanLabel(bulanFilter)} {tahunFilter}
          {wilayahFilter && ` - Wilayah: ${wilayahFilter}`}
          {search && ` - Pencarian: ${search}`}
        </p>
        <button
          onClick={onRefresh}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-md"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header Info */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Rekap Laporan Kerja {getBulanLabel(bulanFilter)} {tahunFilter}
          </h3>
          <div className="flex flex-wrap gap-3 mt-2">
               <p className="text-sm text-gray-500 mt-1">
      Menampilkan {safeStatistik.totalPegawai} pegawai
      {wilayahFilter && ` - Wilayah: ${wilayahFilter}`}
      {search && ` - Pencarian: ${search}`}
    </p>
            <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              📄 {safeStatistik.totalLaporan} Laporan
            </span>
            <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              📏 {safeStatistik.totalPanjang?.toFixed(2)} m
            </span>
            {periode?.total_hari_kerja && (
              <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                📅 {periode.total_hari_kerja} Hari Kerja
              </span>
            )}
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="text-center bg-emerald-50 px-4 py-2 rounded-xl">
            <Ruler size={16} className="text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-emerald-600">Total KR</p>
            <p className="text-sm font-bold text-emerald-700">{safeStatistik.totalKR?.toFixed(2)} m</p>
          </div>
          <div className="text-center bg-blue-50 px-4 py-2 rounded-xl">
            <Ruler size={16} className="text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-600">Total KN</p>
            <p className="text-sm font-bold text-blue-700">{safeStatistik.totalKN?.toFixed(2)} m</p>
          </div>
          <div className="text-center bg-purple-50 px-4 py-2 rounded-xl">
            <TrendingUp size={16} className="text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-600">Kehadiran</p>
            <p className="text-sm font-bold text-purple-700">{safeStatistik.persenKehadiran}%</p>
          </div>
        </div>
      </div>
      
      <RekapTable 
        rekapBulanan={safeRekapBulanan}
        tahunFilter={tahunFilter}
        bulanFilter={bulanFilter}
        statistikBulanan={safeStatistik}
        dates={dates}
        getDaysInMonth={getDaysInMonth}
      />
    </div>
  );
}