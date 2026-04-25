// app/admin/rekapterja/components/LegendKeterangan.jsx
"use client";

import { CheckCircle, XCircle, Ruler, TrendingUp } from "lucide-react";

export function LegendKeterangan() {
  const items = [
    { 
      icon: <CheckCircle size={14} className="text-emerald-500" />, 
      label: 'Lapor', 
      desc: 'Melaporkan pekerjaan harian',
      color: 'bg-emerald-50 text-emerald-700'
    },
    { 
      icon: <XCircle size={14} className="text-red-400" />, 
      label: 'Tidak Lapor', 
      desc: 'Tidak melaporkan pekerjaan',
      color: 'bg-red-50 text-red-700'
    },
    { 
      icon: <Ruler size={14} className="text-cyan-500" />, 
      label: 'KR / KN', 
      desc: 'Panjang pekerjaan Kanan / Kiri (meter)',
      color: 'bg-cyan-50 text-cyan-700'
    },
    { 
      icon: <TrendingUp size={14} className="text-purple-500" />, 
      label: 'Kehadiran', 
      desc: 'Persentase hari laporan vs hari kerja',
      color: 'bg-purple-50 text-purple-700'
    }
  ];

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-slate-700 mb-3 text-sm">Keterangan:</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}