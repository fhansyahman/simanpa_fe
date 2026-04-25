"use client";

import { Search, Plus, RefreshCw, Filter } from "lucide-react";

export function ActionBar({ 
  search, 
  onSearchChange, 
  jenisFilter, 
  onJenisFilterChange,
  onAddDefault,
  onAddPenugasan,
  onRefresh 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama setting/penugasan..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={jenisFilter}
              onChange={(e) => onJenisFilterChange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="semua">Semua</option>
              <option value="default">Setting Default</option>
              <option value="penugasan">Penugasan</option>
            </select>
          </div>

          <button
            onClick={onRefresh}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onAddDefault}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Setting Default
          </button>
          <button
            onClick={onAddPenugasan}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Buat Penugasan
          </button>
        </div>
      </div>
    </div>
  );
}