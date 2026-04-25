'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, AlertCircle, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePenugasan } from './hooks/penugasan/usePenugasan';
import { useUsers } from './hooks/penugasan/useUsers';
import { useWilayah } from './hooks/penugasan/useWilayah';
import { useFormPenugasan } from './hooks/penugasan/useFormPenugasan';
import { Sidebar } from './components/penugasan/Sidebar';
import { Header } from './components/penugasan/Header';
import { StatCards } from './components/penugasan/StatCards';
import { TabButton } from './components/penugasan/TabButton';
import { PenugasanTable } from './components/penugasan/PenugasanTable';
import { PenugasanFormModal } from './components/penugasan/PenugasanFormModal';
import { MonitoringModal } from './components/penugasan/MonitoringModal';

export default function AdminManajemenPenugasan() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [monitoringDate, setMonitoringDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState("");
  
  const router = useRouter();
  const { penugasanList, loading, error, jenisFilter, setJenisFilter, loadPenugasanData, handleEdit, handleDelete, handleSoftDelete, handleUpdateStatus, handleViewMonitoring } = usePenugasan();
  const { usersList } = useUsers();
  const { wilayahList } = useWilayah();
  
  const formHook = useFormPenugasan(() => {
    setShowFormModal(false);
    loadPenugasanData();
  });

  useEffect(() => {
    loadPenugasanData();
  }, [jenisFilter, loadPenugasanData]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const filteredPenugasan = penugasanList.filter((penugasan) =>
    penugasan.nama_penugasan?.toLowerCase().includes(search.toLowerCase()) ||
    penugasan.kode_penugasan?.toLowerCase().includes(search.toLowerCase())
  );

  const onEditPenugasan = async (penugasan) => {
    const result = await handleEdit(penugasan.id, wilayahList, usersList);
    if (result) {
      // Gunakan fungsi setEditData dari formHook
      formHook.setEditData(result.data);
      setShowFormModal(true);
    }
  };

  const onViewMonitoring = (penugasan) => {
    handleViewMonitoring(penugasan, monitoringDate, setMonitoringData, setShowMonitoringModal, setSelectedPenugasan);
  };

  if (loading && penugasanList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-gray-600">Memuat data penugasan...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-black">
      <Sidebar sidebarOpen={sidebarOpen} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} handleLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600">{error}</p>
                </div>
                <button onClick={loadPenugasanData} className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          <StatCards penugasanList={penugasanList} />

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              <TabButton active={jenisFilter === 'semua'} onClick={() => setJenisFilter('semua')} label="Semua" />
              <TabButton active={jenisFilter === 'aktif'} onClick={() => setJenisFilter('aktif')} label="Aktif" />
              <TabButton active={jenisFilter === 'selesai'} onClick={() => setJenisFilter('selesai')} label="Selesai/Dibatalkan" />
              <TabButton active={jenisFilter === 'default'} onClick={() => setJenisFilter('default')} label="Default System" />
            </div>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama atau kode penugasan..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={loadPenugasanData} className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition">
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                  <button onClick={() => { formHook.resetForm(); setShowFormModal(true); }} className="flex items-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium shadow-sm transition">
                    <Plus size={16} />
                    Buat Penugasan
                  </button>
                </div>
              </div>

              <PenugasanTable 
                filteredPenugasan={filteredPenugasan}
                loading={loading}
                onViewMonitoring={onViewMonitoring}
                onEdit={onEditPenugasan}
                onUpdateStatus={(id, status, nama) => handleUpdateStatus(id, status, nama, loadPenugasanData)}
                onSoftDelete={(id, nama) => handleSoftDelete(id, nama, loadPenugasanData)}
                onDelete={(id, nama, tipe, status, is_active) => handleDelete(id, nama, tipe, status, is_active, loadPenugasanData)}
              />
            </div>
          </div>
        </main>

        {showFormModal && (
          <PenugasanFormModal
            isEdit={formHook.isEdit}
            formData={formHook.formData}
            setFormData={formHook.setFormData}
            selectedCheckboxes={formHook.selectedCheckboxes}
            selectAllWilayah={formHook.selectAllWilayah}
            selectAllIndividu={formHook.selectAllIndividu}
            wilayahList={wilayahList}
            usersList={usersList}
            onClose={() => {
              setShowFormModal(false);
              formHook.resetForm();
            }}
            onSubmit={formHook.handleSubmit}
            onWilayahCheckboxChange={formHook.handleWilayahCheckboxChange}
            onSelectAllWilayah={() => formHook.handleSelectAllWilayah(wilayahList)}
            onIndividuCheckboxChange={formHook.handleIndividuCheckboxChange}
            onSelectAllIndividu={() => formHook.handleSelectAllIndividu(usersList)}
          />
        )}

        {showMonitoringModal && monitoringData && (
          <MonitoringModal
            selectedPenugasan={selectedPenugasan}
            monitoringData={monitoringData}
            monitoringDate={monitoringDate}
            setMonitoringDate={(date) => {
              setMonitoringDate(date);
              handleViewMonitoring(selectedPenugasan, date, setMonitoringData, setShowMonitoringModal, setSelectedPenugasan);
            }}
            onClose={() => setShowMonitoringModal(false)}
          />
        )}
      </div>
    </div>
  );
}