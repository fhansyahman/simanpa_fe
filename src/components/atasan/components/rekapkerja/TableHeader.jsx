// app/admin/rekapkerja/components/TableHeader.jsx
"use client";

export function TableHeader({ daysInMonth, dates }) {
  return (
    <thead>
      <tr className="bg-gray-50">
        <th rowSpan={2} className="border border-gray-300 p-2 font-semibold text-center w-12">NO</th>
        <th rowSpan={2} className="border border-gray-300 p-2 font-semibold text-left min-w-[150px] md:min-w-[200px]">NAMA</th>
        <th rowSpan={2} className="border border-gray-300 p-2 font-semibold text-left min-w-[120px] md:min-w-[150px]">JABATAN</th>

        <th colSpan={daysInMonth} className="border border-gray-300 p-2 font-semibold text-center">
          TANGGAL
        </th>
        <th colSpan={5} className="border border-gray-300 p-2 font-semibold text-center">
          REKAPITULASI
        </th>
      </tr>
      <tr className="bg-gray-50">
        {dates && dates.length > 0 ? (
          dates.map((date, i) => (
            <th key={i} className="border border-gray-300 p-1 font-medium text-center text-xs w-10">
              <div className="flex flex-col items-center">
                <span>{date.date}</span>
                <span className="text-[10px] text-gray-500">{date.dayName?.substring(0, 3)}</span>
                {date.isWeekend && (
                  <span className="text-[8px] text-amber-600">Libur</span>
                )}
              </div>
            </th>
          ))
        ) : (
          Array.from({length: daysInMonth}, (_, i) => (
            <th key={i} className="border border-gray-300 p-1 font-medium text-center text-xs w-10">
              {i + 1}
            </th>
          ))
        )}
        <th className="border border-gray-300 p-1 font-medium text-center bg-emerald-50 w-12">Total</th>
        <th className="border border-gray-300 p-1 font-medium text-center bg-cyan-50 w-12">KR (m)</th>
        <th className="border border-gray-300 p-1 font-medium text-center bg-blue-50 w-12">KN (m)</th>
        <th className="border border-gray-300 p-1 font-medium text-center bg-indigo-50 w-12">Total (m)</th>
        <th className="border border-gray-300 p-1 font-medium text-center bg-purple-50 w-12">Kehadiran</th>
      </tr>
    </thead>
  );
}