// app/admin/rekapterja/components/DistributionChart.jsx
"use client";

import { PieChart, TrendingUp, Ruler } from "lucide-react";

export function DistributionChart({ statistik }) {
  const totalPanjang = statistik.totalPanjang || 0;
  const totalKR = statistik.totalKR || 0;
  const totalKN = statistik.totalKN || 0;
  
  const krPercentage = totalPanjang > 0 ? (totalKR / totalPanjang) * 100 : 0;
  const knPercentage = totalPanjang > 0 ? (totalKN / totalPanjang) * 100 : 0;

  const distributionData = [
    { name: "Panjang KR", value: totalKR, percentage: krPercentage, color: "#06B6D4", lightColor: "#CFFAFE" },
    { name: "Panjang KN", value: totalKN, percentage: knPercentage, color: "#3B82F6", lightColor: "#DBEAFE" }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
          <PieChart size={16} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">Distribusi Pekerjaan</h3>
          <p className="text-xs text-slate-500">Perbandingan KR dan KN</p>
        </div>
      </div>
      
      {/* Donut Chart Visualization */}
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {(() => {
              let currentAngle = 0;
              return distributionData.map((item, idx) => {
                const angle = (item.percentage / 100) * 360;
                const startAngle = currentAngle;
                const endAngle = currentAngle + angle;
                currentAngle = endAngle;
                
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 50 + 40 * Math.cos(startRad);
                const y1 = 50 + 40 * Math.sin(startRad);
                const x2 = 50 + 40 * Math.cos(endRad);
                const y2 = 50 + 40 * Math.sin(endRad);
                
                const largeArc = angle > 180 ? 1 : 0;
                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={item.color}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-500 cursor-pointer hover:opacity-80"
                  />
                );
              });
            })()}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Ruler size={20} className="text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-sm font-bold text-slate-700">{totalPanjang.toFixed(2)} m</p>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex gap-6 mt-2">
          {distributionData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-slate-600">{item.name}</span>
              <span className="text-sm font-semibold text-slate-800">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
        
        {/* Detail Bars */}
        <div className="w-full mt-6 space-y-3">
          {distributionData.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{item.name}</span>
                <span className="font-medium text-slate-700">{item.value.toFixed(2)} m</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}