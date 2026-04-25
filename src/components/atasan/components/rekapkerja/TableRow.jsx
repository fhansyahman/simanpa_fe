// app/admin/rekapterja/components/TableRow.jsx
"use client";

import { memo } from "react";
import { CheckCircle, XCircle, Ruler } from "lucide-react";

export const TableRow = memo(function TableRow({ pegawai, index, daysInMonth }) {
  const getStatusIcon = (status) => {
    if (status === '✔️') {
      return <CheckCircle size={14} className="text-emerald-500" />;
    }
    if (status === '✘') {
      return <XCircle size={14} className="text-red-400" />;
    }
    return null;
  };

  const safePegawai = pegawai || {};
  const presensiHarian = Array.isArray(safePegawai.daily) ? safePegawai.daily : [];
  const dailyKR = Array.isArray(safePegawai.dailyKR) ? safePegawai.dailyKR : [];
  const dailyKN = Array.isArray(safePegawai.dailyKN) ? safePegawai.dailyKN : [];
  const totalLaporan = safePegawai.total_laporan || 0;
  const totalKR = safePegawai.total_kr || 0;
  const totalKN = safePegawai.total_kn || 0;
  const totalPanjang = safePegawai.total_panjang || 0;
  const persenKehadiran = safePegawai.persen_kehadiran || 0;
  const nama = safePegawai.nama || '-';
  const jabatan = safePegawai.jabatan || '-';
  const wilayah = safePegawai.wilayah || '-';

  const getKehadiranColor = () => {
    if (persenKehadiran >= 80) return 'text-emerald-600';
    if (persenKehadiran >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const safeDaysInMonth = daysInMonth && !isNaN(daysInMonth) && daysInMonth > 0 ? daysInMonth : 31;
  const daysArray = Array.from({ length: safeDaysInMonth }, (_, i) => i);

  return (
    <tr className="hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100">
      <td className="border border-gray-300 p-2 text-center font-medium bg-white">
        {index + 1}
      </td>
      
      <td className="border border-gray-300 p-2 text-sm md:text-base font-medium text-gray-800 bg-white sticky left-0 bg-white">
        {nama}
      </td>
      
      <td className="border border-gray-300 p-2 text-sm md:text-base text-gray-600">
        {jabatan}
      </td>
      

      
      {daysArray.map((_, dayIndex) => {
        const status = presensiHarian[dayIndex];
        const kr = dailyKR[dayIndex] || 0;
        const kn = dailyKN[dayIndex] || 0;
        const hasLaporan = status === '✔️';
        
        return (
          <td key={dayIndex} className="border border-slate-200 p-2 text-center align-middle">
            {hasLaporan ? (
              <div className="group relative">
                <div className="flex items-center justify-center gap-1">
                  {getStatusIcon(status)}

                </div>
                {kr > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10">
                    <span className="text-emerald-300">KR: {kr}m</span> | <span className="text-blue-300">KN: {kn}m</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-slate-300">{getStatusIcon(status)}</span>
            )}
          </td>
        );
      })}
      
      <td className="border border-slate-200 p-3 text-center font-bold bg-emerald-50 text-emerald-700">
        {totalLaporan}
      </td>
      
      <td className="border border-slate-200 p-3 text-center font-medium bg-cyan-50 text-cyan-700">
        {totalKR.toFixed(2)}
      </td>
      
      <td className="border border-slate-200 p-3 text-center font-medium bg-blue-50 text-blue-700">
        {totalKN.toFixed(2)}
      </td>
      
      <td className="border border-slate-200 p-3 text-center font-bold bg-indigo-50 text-indigo-700">
        {totalPanjang.toFixed(2)}
      </td>
      
      <td className="border border-slate-200 p-3 text-center bg-purple-50">
        <div className="flex flex-col items-center">
          <span className={`text-sm font-bold ${getKehadiranColor()}`}>
            {persenKehadiran}%
          </span>
          <div className="w-full max-w-[60px] h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                persenKehadiran >= 80 ? 'bg-emerald-500' : 
                persenKehadiran >= 60 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${persenKehadiran}%` }}
            />
          </div>
        </div>
      </td>
    </tr>
  );
});
    
TableRow.displayName = 'TableRow';