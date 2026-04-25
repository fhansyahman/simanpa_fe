"use client";

import { FileSpreadsheet, BarChart3 } from "lucide-react";

export function TabNavigation({ activeTab, onTabChange, rekapCount }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <TabButton
          active={activeTab === 'rekap'}
          onClick={() => onTabChange('rekap')}
          icon={<FileSpreadsheet size={18} />}
          label="Rekap Bulanan"
          count={rekapCount}
        />
        
        
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
        active 
          ? 'border-blue-500 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
          active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}