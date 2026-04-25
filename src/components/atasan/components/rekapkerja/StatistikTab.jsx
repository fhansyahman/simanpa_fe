// app/admin/rekapterja/components/StatistikTab.jsx
"use client";

import { CalendarDays, ArrowLeft, TrendingUp, Ruler, Users, FileText, Download, BarChart3, PieChart } from "lucide-react";
import { StatCards } from "./StatCards";
import { DistributionChart } from "./DistributionChart";
import { SummaryStats } from "./SummaryStats";

export function StatistikTab({
  statistikBulanan,
  bulanFilter,
  tahunFilter,
  wilayahFilter,
  getBulanLabel,
  getDaysInMonth,
  onBackToRekap,
  onExport
}) {
  const daysInMonth = bulanFilter && tahunFilter ? 
    getDaysInMonth(parseInt(tahunFilter), parseInt(bulanFilter)) : 0;

  return (
    <div className="space-y-6">
      {/* Informasi Periode - Modern Card */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-indigo-700">
                Periode Analisis
              </span>
              <h3 className="text-xl font-bold text-slate-800">
                {bulanFilter && tahunFilter ? 
                  `${getBulanLabel(bulanFilter)} ${tahunFilter}` : 
                  'Pilih Periode'}
              </h3>
              {wilayahFilter && (
                <p className="text-sm text-purple-600 mt-1">
                  📍 Wilayah: {wilayahFilter}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="text-center bg-white/60 backdrop-blur rounded-xl px-4 py-2">
              <p className="text-xs text-slate-500">Hari Kerja</p>
              <p className="text-lg font-bold text-indigo-600">{daysInMonth}</p>
            </div>
            <button
              onClick={onBackToRekap}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
            >
              <ArrowLeft size={16} />
              <span className="hidden md:inline">Kembali ke Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <StatCards statistik={statistikBulanan} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionChart statistik={statistikBulanan} />
        <SummaryStats 
          statistik={statistikBulanan}
          bulanFilter={bulanFilter}
          tahunFilter={tahunFilter}
          getBulanLabel={getBulanLabel}
          getDaysInMonth={getDaysInMonth}
          onExport={onExport}
        />
      </div>
    </div>
  );
}