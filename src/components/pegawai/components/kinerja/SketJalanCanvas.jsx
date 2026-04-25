// components/kinerja/SketJalanCanvas.jsx
"use client";

import { Palette } from "lucide-react";

export function SketJalanCanvas({
  canvasRef,
  selectedArea,
  color,
  sections,
  currentColors,
  onCanvasClick,
  onColorChange,
  onColorApply,
  onResetColors
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-3 md:p-4 bg-slate-50/50">
      <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
        <Palette className="w-4 h-4" />
        <span>Denah Pekerjaan Jalan</span>
      </label>

      {/* Perubahan: Layout vertical di mobile, horizontal di desktop */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        
        {/* Container canvas dengan scroll horizontal untuk mobile */}
        <div className="w-full lg:flex-1 overflow-x-auto overflow-y-hidden">
          <div className="border border-slate-300 rounded bg-white p-2 md:p-3 shadow-sm inline-block min-w-full lg:min-w-0">
            <canvas
              ref={canvasRef}
              className="cursor-pointer rounded max-w-none border border-slate-200"
              onClick={onCanvasClick}
              style={{
                width: 'auto',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
        
        {/* Panel kontrol - di bawah canvas di mobile, di samping di desktop */}
        <div className="w-full lg:w-auto lg:min-w-[200px] lg:max-w-[220px]">
          <div className="flex flex-row lg:flex-col gap-3">
            {/* Picker warna */}
            <div className="flex-1 lg:w-full">
              <label className="text-sm font-medium text-slate-600 mb-2 block">
                Pilih Warna
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full h-10 rounded border border-slate-300 cursor-pointer"
              />
            </div>
            
            {/* Tombol aksi - horizontal di mobile */}
            <div className="flex flex-row gap-2 lg:flex-col">
              <button
                type="button"
                onClick={onColorApply}
                disabled={selectedArea === null}
                className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                Terapkan
              </button>

              <button
                type="button"
                onClick={onResetColors}
                className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors font-medium whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Informasi area terpilih */}
          {selectedArea !== null && (
            <div className="mt-3 text-sm text-slate-600 p-3 bg-white rounded border border-slate-200">
              <p className="font-medium text-xs md:text-sm">Area Terpilih:</p>
              <p className="text-xs md:text-sm break-words">{sections[selectedArea].label}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-xs md:text-sm text-slate-600">
          Klik pada area denah untuk memilih, lalu pilih warna dan terapkan
        </p>
        <p className="text-xs text-slate-400 mt-1 block lg:hidden">
          * Geser canvas ke kanan/kiri untuk melihat seluruh denah
        </p>
      </div>
    </div>
  );
}