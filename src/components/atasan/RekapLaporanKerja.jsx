// app/admin/rekapterja/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./components/rekapkerja/Sidebar";
import { Header } from "./components/rekapkerja/Header";
import { FilterBar } from "./components/rekapkerja/FilterBar";
import { TabNavigation } from "./components/rekapkerja/TabNavigation";
import { RekapTab } from "./components/rekapkerja/RekapTab";
import { StatistikTab } from "./components/rekapkerja/StatistikTab";
import { LoadingState } from "./components/rekapkerja/LoadingState";
import { useKinerjaData } from "./hooks/rekapkerja/useKinerjaData";
import { useFilters } from "./hooks/rekapkerja/useFilters";
import { useRekapProcessor } from "./hooks/rekapkerja/useRekapProcessor";
import { useExport } from "./hooks/rekapkerja/useExport";

export default function RekapLaporanKerjaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('rekap');
  
  const {
    search,
    bulanFilter,
    tahunFilter,
    wilayahFilter,
    setSearch,
    setBulanFilter,
    setTahunFilter,
    setWilayahFilter,
    resetFilters,
    setToCurrentMonth,
    activeFilterCount,
    getBulanOptions,
    getTahunOptions,
    getBulanLabel
  } = useFilters();

  // Load data ketika bulan/tahun berubah
  const { 
    kinerjaData,
    rekapData,
    loading, 
    error, 
    loadData,
    refreshData,
    currentBulan,
    currentTahun
  } = useKinerjaData();

  const {
    rekapBulanan,
    statistikBulanan,
    dates,
    periode,
    processing,
    processRekap,
    getDaysInMonth
  } = useRekapProcessor(rekapData, bulanFilter, tahunFilter, wilayahFilter, search);

  const {
    exportToExcel,
    handlePrint
  } = useExport();

  // Load data ketika bulan/tahun filter berubah
  useEffect(() => {
    if (bulanFilter && tahunFilter) {
      loadData(bulanFilter, tahunFilter);
    }
  }, [bulanFilter, tahunFilter, loadData]);

  // Process rekap ketika data atau filter berubah
  useEffect(() => {
    if (rekapData && bulanFilter && tahunFilter) {
      processRekap();
    }
  }, [bulanFilter, tahunFilter, wilayahFilter, search, rekapData, processRekap]);

  // Set initial filter to current month
  useEffect(() => {
    const now = new Date();
    const currentBulan = (now.getMonth() + 1).toString();
    const currentTahun = now.getFullYear().toString();
    setBulanFilter(currentBulan);
    setTahunFilter(currentTahun);
  }, [setBulanFilter, setTahunFilter]);

  const safeRekapBulanan = Array.isArray(rekapBulanan) ? rekapBulanan : [];
  const safeStatistikBulanan = statistikBulanan || {
    totalPegawai: 0,
    totalLaporan: 0,
    totalHadir: 0,
    totalKR: 0,
    totalKN: 0,
    totalPanjang: 0,
    persenKehadiran: 0,
    rataKR: 0,
    rataKN: 0
  };

  if (loading) {
    return <LoadingState message="Memuat data laporan kerja..." />;
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Header 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title="Rekap Laporan Kerja Bulanan"
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6 text-red-700 shadow-lg">
              <p className="font-semibold text-lg">⚠️ Error memuat data:</p>
              <p className="text-sm mt-2">{error}</p>
              <button 
                onClick={() => loadData(bulanFilter, tahunFilter)}
                className="mt-4 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 text-sm font-medium shadow-md transition-all duration-200"
              >
                Coba Lagi
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          title="Rekap Laporan Kerja Bulanan"
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            bulanFilter={bulanFilter}
            onBulanChange={setBulanFilter}
            tahunFilter={tahunFilter}
            onTahunChange={setTahunFilter}
            wilayahFilter={wilayahFilter}
            onWilayahChange={setWilayahFilter}
            onReset={resetFilters}
            onSetCurrentMonth={setToCurrentMonth}
            activeFilterCount={activeFilterCount}
            bulanOptions={getBulanOptions()}
            tahunOptions={getTahunOptions()}
            wilayahOptions={["Cermee", "Prajekan", "Botolinggo", "Klabang", "Ijen"]}
            showExport={Boolean(bulanFilter && tahunFilter && safeRekapBulanan.length > 0)}
            onExport={() => exportToExcel(
              safeRekapBulanan, 
              safeStatistikBulanan, 
              bulanFilter, 
              tahunFilter, 
              wilayahFilter, 
              getBulanLabel,
              'kinerja'
            )}
            onPrint={() => handlePrint(
              bulanFilter, 
              tahunFilter, 
              wilayahFilter, 
              getBulanLabel,
              'kinerja'
            )}
          />

          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            rekapCount={safeRekapBulanan.length}
          />

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
            <div className="p-4 md:p-6">
              {activeTab === 'rekap' ? (
                <RekapTab
                  processing={processing}
                  bulanFilter={bulanFilter}
                  tahunFilter={tahunFilter}
                  wilayahFilter={wilayahFilter}
                  search={search}
                  rekapBulanan={safeRekapBulanan}
                  statistikBulanan={safeStatistikBulanan}
                  dates={dates}
                  periode={periode}
                  getBulanLabel={getBulanLabel}
                  onRefresh={() => loadData(bulanFilter, tahunFilter)}
                  getDaysInMonth={getDaysInMonth}
                />
              ) : (
                <StatistikTab
                  statistikBulanan={safeStatistikBulanan}
                  bulanFilter={bulanFilter}
                  tahunFilter={tahunFilter}
                  wilayahFilter={wilayahFilter}
                  getBulanLabel={getBulanLabel}
                  getDaysInMonth={getDaysInMonth}
                  onBackToRekap={() => setActiveTab('rekap')}
                  onExport={() => exportToExcel(
                    safeRekapBulanan, 
                    safeStatistikBulanan, 
                    bulanFilter, 
                    tahunFilter, 
                    wilayahFilter, 
                    getBulanLabel,
                    'kinerja'
                  )}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}