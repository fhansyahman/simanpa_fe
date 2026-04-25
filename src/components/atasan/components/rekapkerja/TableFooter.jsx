// app/admin/rekapterja/components/TableFooter.jsx
"use client";

export function TableFooter({ daysInMonth, statistik }) {
  return (
    <tr className="bg-gray-50 font-bold">
      <td colSpan={3} className="border border-slate-300 p-3 text-right text-slate-700">
        TOTAL KESELURUHAN
      </td>
      
      {Array.from({length: daysInMonth}, (_, i) => (
        <td key={i} className="border border-slate-300 p-2 text-center text-slate-500">
          
        </td>
      ))}
      
      <td className="border border-slate-300 p-3 text-center bg-emerald-100 text-emerald-700">
        {statistik.totalLaporan || 0}
      </td>
      
      <td className="border border-slate-300 p-3 text-center bg-cyan-100 text-cyan-700">
        {statistik.totalKR?.toFixed(2) || 0}
      </td>
      
      <td className="border border-slate-300 p-3 text-center bg-blue-100 text-blue-700">
        {statistik.totalKN?.toFixed(2) || 0}
      </td>
      
      <td className="border border-slate-300 p-3 text-center bg-indigo-100 text-indigo-700 font-bold">
        {statistik.totalPanjang?.toFixed(2) || 0}
      </td>
      
      <td className="border border-slate-300 p-3 text-center bg-purple-100 text-purple-700">
        {statistik.persenKehadiran || 0}%
      </td>
    </tr>
  );
}