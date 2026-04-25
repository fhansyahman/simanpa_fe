// app/admin/rekapterja/components/StatCards.jsx
"use client";

import { Users, FileText, Ruler, TrendingUp, Activity, Target } from "lucide-react";

export function StatCards({ statistik }) {
  const cards = [
    {
      label: "Total Pegawai",
      value: statistik.totalPegawai || 0,
      subLabel: "Pegawai aktif",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      label: "Total Laporan",
      value: statistik.totalLaporan || 0,
      subLabel: `${statistik.persenKehadiran || 0}% kehadiran`,
      icon: FileText,
      gradient: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      label: "Total Panjang",
      value: `${(statistik.totalPanjang || 0).toFixed(2)} m`,
      subLabel: `KR: ${(statistik.totalKR || 0).toFixed(2)}m | KN: ${(statistik.totalKN || 0).toFixed(2)}m`,
      icon: Ruler,
      gradient: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      label: "Rata-rata Harian",
      value: `${(statistik.rataKR || 0).toFixed(2)} / ${(statistik.rataKN || 0).toFixed(2)} m`,
      subLabel: "KR / KN per laporan",
      icon: Activity,
      gradient: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}

function StatCard({ label, value, subLabel, icon: Icon, gradient, iconBg, iconColor }) {
  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500`} />
      
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-2">{subLabel}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shadow-sm`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        
        <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={`w-1/3 h-full bg-gradient-to-r ${gradient} rounded-full group-hover:w-full transition-all duration-500`} />
        </div>
      </div>
    </div>
  );
}