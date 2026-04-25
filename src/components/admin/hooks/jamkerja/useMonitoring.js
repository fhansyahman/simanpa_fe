import { useState } from 'react';
import { penugasanAPI } from '@/lib/api';
import Swal from "sweetalert2";

export const useMonitoring = () => {
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [monitoringDate, setMonitoringDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleViewMonitoring = async (penugasan) => {
    try {
      setLoading(true);
      setSelectedPenugasan(penugasan);
      
      const params = { tanggal: monitoringDate };
      const response = await penugasanAPI.getMonitoring(penugasan.id, params);
      
      if (response.data.success) {
        setMonitoringData(response.data.data);
        setShowMonitoringModal(true);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data monitoring');
      }
    } catch (error) {
      console.error('Error loading monitoring:', error);
      Swal.fire({ 
        icon: "error", 
        title: "Oops...", 
        text: error.response?.data?.message || 'Gagal memuat data monitoring', 
        confirmButtonColor: "#EF4444" 
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshMonitoring = async (penugasan) => {
    if (penugasan) {
      await handleViewMonitoring(penugasan);
    } else if (selectedPenugasan) {
      await handleViewMonitoring(selectedPenugasan);
    }
  };

  return {
    showMonitoringModal,
    setShowMonitoringModal,
    selectedPenugasan,
    monitoringData,
    monitoringDate,
    setMonitoringDate,
    loading,
    handleViewMonitoring,
    refreshMonitoring
  };
};