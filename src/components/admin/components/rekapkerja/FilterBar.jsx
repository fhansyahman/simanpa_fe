// app/admin/rekapterja/components/FilterBar.jsx
"use client";

import { Search, Filter, RefreshCw, FileSpreadsheet, Printer, X } from "lucide-react";

export function FilterBar({
  search,
  onSearchChange,
  bulanFilter,
  onBulanChange,
  tahunFilter,
  onTahunChange,
  wilayahFilter,
  onWilayahChange,
  onReset,
  onSetCurrentMonth,
  activeFilterCount,
  bulanOptions,
  tahunOptions,
  wilayahOptions,
  showExport,
  onExport,
  onPrint
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6 shadow-sm">
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama pegawai atau jabatan..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 placeholder:text-gray-400 transition-all"
          />
        </div>
        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <select
              value={bulanFilter}
              onChange={(e) => onBulanChange(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 cursor-pointer"
            >
              <option value="">Pilih Bulan</option>
              {bulanOptions.map(bulan => (
                <option key={bulan.value} value={bulan.value}>
                  {bulan.label}
                </option>
              ))}
            </select>
            
            <select
              value={tahunFilter}
              onChange={(e) => onTahunChange(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 cursor-pointer"
            >
              <option value="">Pilih Tahun</option>
              {tahunOptions.map(tahun => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
            
            <select
              value={wilayahFilter}
              onChange={(e) => onWilayahChange(e.target.value)}
              className="w-full md:w-auto px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 cursor-pointer"
            >
              <option value="">Semua Wilayah</option>
              {wilayahOptions.map(wilayah => (
                <option key={wilayah} value={wilayah}>
                  {wilayah}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onSetCurrentMonth}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 border border-gray-300 text-white rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm flex-1 md:flex-none"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            {showExport && (
              <>
                <button
                  onClick={onExport}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-sm flex-1 md:flex-none"
                >
                  <FileSpreadsheet size={16} />
                  <span className="hidden sm:inline">Excel</span>
                </button>
                
                <button
                  onClick={onPrint}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium shadow-sm flex-1 md:flex-none"
                >
                  <Printer size={16} />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
              </>
            )}
            
            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <X size={16} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Chips */}
        <FilterChips
          bulanFilter={bulanFilter}
          tahunFilter={tahunFilter}
          wilayahFilter={wilayahFilter}
          search={search}
          onClearBulan={() => onBulanChange('')}
          onClearTahun={() => onTahunChange('')}
          onClearWilayah={() => onWilayahChange('')}
          onClearSearch={() => onSearchChange('')}
          getBulanLabel={(val) => bulanOptions.find(b => b.value === val)?.label}
          activeFilterCount={activeFilterCount}
        />
      </div>
    </div>
  );
}

function FilterChips({
  bulanFilter,
  tahunFilter,
  wilayahFilter,
  search,
  onClearBulan,
  onClearTahun,
  onClearWilayah,
  onClearSearch,
  getBulanLabel,
  activeFilterCount
}) {
  if (activeFilterCount === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <span className="text-xs text-gray-500">Filter aktif:</span>

      {bulanFilter && (
        <FilterChip 
          label={`Bulan: ${getBulanLabel(bulanFilter)}`} 
          onClear={onClearBulan} 
          color="blue" 
        />
      )}
      {tahunFilter && (
        <FilterChip 
          label={`Tahun: ${tahunFilter}`} 
          onClear={onClearTahun} 
          color="green" 
        />
      )}
      {wilayahFilter && (
        <FilterChip 
          label={`Wilayah: ${wilayahFilter}`} 
          onClear={onClearWilayah} 
          color="purple" 
        />
      )}
      {search && (
        <FilterChip 
          label={`Pencarian: ${search}`} 
          onClear={onClearSearch} 
          color="orange" 
        />
      )}
    </div>
  );
}

function FilterChip({ label, onClear, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    purple: "bg-purple-100 text-purple-800",
    amber: "bg-amber-100 text-amber-800"
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${colorClasses[color]}`}>
      {label}
      <button onClick={onClear} className="ml-1 hover:opacity-70">
        <X size={10} />
      </button>
    </span>
  );
}