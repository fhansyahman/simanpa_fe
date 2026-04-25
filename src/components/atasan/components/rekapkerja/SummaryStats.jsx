// app/admin/rekapterja/components/SummaryStats.jsx
"use client";

import { TrendingUp, Target, Award, Calendar, Download, BarChart3 } from "lucide-react";

export function SummaryStats({ 
  statistik, 
  bulanFilter, 
  tahunFilter, 
  getBulanLabel,
  getDaysInMonth,
  onExport 
}) {
  const persenKehadiran = statistik.persenKehadiran || 0;
  const daysInMonth = bulanFilter && tahunFilter ? 
    getDaysInMonth(parseInt(tahunFilter), parseInt(bulanFilter)) : 0;
  
  const targetPerHari = 50; // Target 50 meter per hari
  const targetBulanan = daysInMonth * targetPerHari;
  const pencapaian = statistik.totalPanjang || 0;
  const persenPencapaian = targetBulanan > 0 ? (pencapaian / targetBulanan) * 100 : 0;

  const getStatusInfo = () => {
    if (persenKehadiran >= 90) return { label: 'Sangat Baik', color: 'emerald', icon: Award };
    if (persenKehadiran >= 80) return { label: 'Baik', color: 'green', icon: TrendingUp };
    if (persenKehadiran >= 70) return { label: 'Cukup', color: 'amber', icon: Target };
    return { label: 'Perlu Peningkatan', color: 'red', icon: TrendingUp };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <BarChart3 size={16} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Analisis Kinerja</h3>
          <p className="text-xs text-slate-500">Ringkasan statistik dan target</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Kehadiran Card */}
        <div className={`p-4 rounded-xl bg-${status.color}-50 border border-${status.color}-100`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <StatusIcon size={16} className={`text-${status.color}-600`} />
              <span className={`text-sm font-medium text-${status.color}-700`}>Tingkat Kehadiran</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${status.color}-100 text-${status.color}-700`}>
              {status.label}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-800">{persenKehadiran}%</span>
            <span className="text-sm text-slate-500">
              {statistik.totalLaporan || 0} / {statistik.totalPegawai * daysInMonth} laporan
            </span>
          </div>
          <div className="mt-2 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 bg-${status.color}-500`}
              style={{ width: `${persenKehadiran}%` }}
            />
          </div>
        </div>
        
        {/* Target Pencapaian */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">Target Pencapaian Bulanan</span>
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <p className="text-2xl font-bold text-indigo-700">{pencapaian.toFixed(2)} m</p>
              <p className="text-xs text-indigo-500">dari target {targetBulanan} m</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-700">{persenPencapaian.toFixed(1)}%</p>
              <p className="text-xs text-indigo-500">tercapai</p>
            </div>
          </div>
          <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(persenPencapaian, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-indigo-100">
            <div className="text-center">
              <p className="text-xs text-indigo-500">Rata-rata KR</p>
              <p className="text-sm font-bold text-indigo-700">{statistik.rataKR?.toFixed(2) || 0} m</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-indigo-500">Rata-rata KN</p>
              <p className="text-sm font-bold text-indigo-700">{statistik.rataKN?.toFixed(2) || 0} m</p>
            </div>
          </div>
        </div>
        
        {/* Export Button */}
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 text-sm font-medium shadow-md"
        >
          <Download size={16} />
          Export Data Statistik
        </button>
      </div>
    </div>
  );
}