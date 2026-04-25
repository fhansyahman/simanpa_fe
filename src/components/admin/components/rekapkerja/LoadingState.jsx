// components/rekapkerja/LoadingState.jsx
"use client";

import { Ruler, Loader2 } from "lucide-react";

export function LoadingState({ message = "Memuat data..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="relative">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />
        
        {/* Icon Container */}
        <div className="relative w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-10" />
          <Ruler className="w-10 h-10 text-cyan-600 animate-bounce" />
        </div>
        
        {/* Loading Spinner */}
        <div className="absolute -bottom-2 -right-2">
          <div className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
          </div>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center mt-6">
        <p className="text-lg font-semibold text-slate-700">Loading...</p>
        <p className="text-sm text-slate-500 mt-1">{message}</p>
      </div>
      
      {/* Progress Bar */}
      <div className="w-48 mt-6">
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}