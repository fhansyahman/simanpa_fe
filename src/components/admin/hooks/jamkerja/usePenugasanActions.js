// hooks/usePenugasanActions.js
import { useState } from 'react';
import Swal from "sweetalert2";
import { penugasanAPI } from '@/lib/api';

export const usePenugasanActions = (onRefresh) => {
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [monitoringDate, setMonitoringDate] = useState(new Date().toISOString().split('T')[0]);

  const handleViewMonitoring = async (penugasan) => {
    try {
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
    }
  };

  const handleDelete = async (id, nama_penugasan, tipe_penugasan, status, is_active) => {
    if (tipe_penugasan === 'default' && is_active === 1) {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Dihapus",
        text: "Penugasan default yang sedang aktif tidak dapat dihapus. Nonaktifkan terlebih dahulu.",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    if (tipe_penugasan === 'khusus' && status === 'aktif') {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Dihapus",
        text: "Penugasan khusus yang masih aktif tidak dapat dihapus. Selesaikan atau batalkan terlebih dahulu.",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    Swal.fire({
      title: 'Hapus Penugasan?',
      text: `Yakin ingin menghapus penugasan "${nama_penugasan}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await penugasanAPI.delete(id);
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Penugasan berhasil dihapus',
            confirmButtonColor: '#10B981'
          });
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error('Error deleting penugasan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal menghapus penugasan',
            confirmButtonColor: '#EF4444'
          });
        }
      }
    });
  };

  const handleSoftDelete = async (id, nama_penugasan, penugasanList) => {
    const penugasan = penugasanList.find(p => p.id === id);

    if (penugasan && penugasan.tipe_penugasan === 'default' && penugasan.is_active === 1) {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Dinonaktifkan",
        text: "Penugasan default yang sedang aktif tidak dapat dinonaktifkan. Buat penugasan default baru untuk menggantikannya.",
        confirmButtonColor: "#EF4444"
      });
      return;
    }

    Swal.fire({
      title: 'Nonaktifkan Penugasan?',
      text: `Yakin ingin menonaktifkan penugasan "${nama_penugasan}"?\n\nPenugasan yang dinonaktifkan tidak akan bisa digunakan lagi.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Nonaktifkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#F59E0B',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await penugasanAPI.softDelete(id);

          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil!',
              text: response.data.message || 'Penugasan berhasil dinonaktifkan',
              confirmButtonColor: '#10B981'
            });
            if (onRefresh) onRefresh();
          } else {
            throw new Error(response.data.message || 'Gagal menonaktifkan penugasan');
          }
        } catch (error) {
          console.error('Error soft deleting penugasan:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal menonaktifkan penugasan',
            confirmButtonColor: '#EF4444'
          });
        }
      }
    });
  };

  const handleUpdateStatus = async (id, status, nama_penugasan) => {
    const statusText = status === 'selesai' ? 'selesaikan' : 'batalkan';
    Swal.fire({
      title: `${status === 'selesai' ? 'Selesaikan' : 'Batalkan'} Penugasan?`,
      text: `Yakin ingin ${statusText} penugasan "${nama_penugasan}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Ya, ${statusText}`,
      cancelButtonText: 'Batal',
      confirmButtonColor: status === 'selesai' ? '#10B981' : '#EF4444',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await penugasanAPI.updateStatus(id, { status });
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Penugasan berhasil di${statusText}`,
            confirmButtonColor: '#10B981'
          });
          if (onRefresh) onRefresh();
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.response?.data?.message || 'Gagal mengubah status',
            confirmButtonColor: '#EF4444'
          });
        }
      }
    });
  };

  return {
    showMonitoringModal,
    setShowMonitoringModal,
    selectedPenugasan,
    monitoringData,
    monitoringDate,
    setMonitoringDate,
    handleViewMonitoring,
    handleDelete,
    handleSoftDelete,
    handleUpdateStatus
  };
};