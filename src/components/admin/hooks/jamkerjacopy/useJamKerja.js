"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jamKerjaAPI } from "@/lib/api";
import Swal from "sweetalert2";

export function useJamKerja() {
  const [jamKerja, setJamKerja] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPenugasanModal, setShowPenugasanModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingJamKerja, setEditingJamKerja] = useState(null);
  const [selectedJamKerja, setSelectedJamKerja] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jenisFilter, setJenisFilter] = useState("semua"); // semua, default, penugasan
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const router = useRouter();

  // Load data
  const loadJamKerja = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jamKerjaAPI.getAll({ jenis: jenisFilter });
      
      let jamKerjaData = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        jamKerjaData = response.data.data;
      } else if (Array.isArray(response.data)) {
        jamKerjaData = response.data;
      } else {
        jamKerjaData = [];
      }
      
      setJamKerja(jamKerjaData);
    } catch (error) {
      console.error('Error loading jam kerja:', error);
      setError('Gagal memuat data jam kerja');
      setJamKerja([]);
    } finally {
      setLoading(false);
    }
  }, [jenisFilter]);

  useEffect(() => {
    loadJamKerja();
  }, [loadJamKerja, jenisFilter]);

  // Filter jam kerja
  const filteredJamKerja = useMemo(() => {
    return jamKerja.filter((jk) => {
      const matchesSearch = jk.nama_setting?.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [jamKerja, search]);

  // Pagination
  const totalPages = Math.ceil(filteredJamKerja.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJamKerja = useMemo(() => {
    return filteredJamKerja.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJamKerja, startIndex, itemsPerPage]);

  // Stats
  const stats = useMemo(() => ({
    total: jamKerja.length,
    default: jamKerja.filter(jk => !jk.kode_penugasan).length,
    penugasan: jamKerja.filter(jk => jk.kode_penugasan && jk.status === 'aktif').length,
    aktif: jamKerja.filter(jk => jk.is_active).length,
  }), [jamKerja]);

  // Format waktu
  const formatTime = useCallback((timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
  }, []);

  // Calculate total hours
  const calculateTotalHours = useCallback((jamMasuk, jamPulang) => {
    if (!jamMasuk || !jamPulang) return '0';
    const [masukHours, masukMinutes] = jamMasuk.split(':').map(Number);
    const [pulangHours, pulangMinutes] = jamPulang.split(':').map(Number);
    
    const totalMinutes = (pulangHours * 60 + pulangMinutes) - (masukHours * 60 + masukMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours} jam ${minutes > 0 ? `${minutes} menit` : ''}`;
  }, []);

  // Check if item is penugasan
  const isPenugasan = useCallback((item) => {
    return item.kode_penugasan !== null && item.kode_penugasan !== undefined;
  }, []);

  // Modal handlers
  const handleShowAddModal = useCallback(() => {
    setEditingJamKerja(null);
    setShowModal(true);
  }, []);

  const handleShowPenugasanModal = useCallback(() => {
    setShowPenugasanModal(true);
  }, []);

  const handleShowEditModal = useCallback((jk) => {
    if (isPenugasan(jk)) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Bisa Edit",
        text: "Penugasan tidak dapat diedit. Silakan buat penugasan baru jika perlu perubahan.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#10B981",
      });
      return;
    }
    setEditingJamKerja(jk);
    setShowModal(true);
  }, [isPenugasan]);

  const handleViewDetail = useCallback((jk) => {
    setSelectedJamKerja(jk);
    setShowDetailModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setShowPenugasanModal(false);
    setEditingJamKerja(null);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedJamKerja(null);
  }, []);

  // Delete handler (only for default)
  const handleDelete = useCallback(async (jk) => {
    if (isPenugasan(jk)) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Bisa Hapus",
        text: "Penugasan tidak dapat dihapus, hanya bisa diubah statusnya menjadi 'selesai' atau 'dibatalkan'.",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#10B981",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Yakin hapus data ini?",
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Iya, hapus!",
      cancelButtonText: "Tidak",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      try {
        await jamKerjaAPI.deleteDefault(jk.id);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data jam kerja berhasil dihapus.",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
        loadJamKerja();
      } catch (error) {
        console.error('Error deleting jam kerja:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || 'Gagal menghapus jam kerja',
          confirmButtonText: "Tutup",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  }, [loadJamKerja, isPenugasan]);

  // Update penugasan status
  const handleUpdatePenugasanStatus = useCallback(async (penugasanId, newStatus) => {
    const result = await Swal.fire({
      title: `Konfirmasi ${newStatus === 'selesai' ? 'Penyelesaian' : 'Pembatalan'}`,
      text: `Apakah Anda yakin ingin ${newStatus === 'selesai' ? 'menyelesaikan' : 'membatalkan'} penugasan ini?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Ya, ${newStatus === 'selesai' ? 'Selesaikan' : 'Batalkan'}`,
      cancelButtonText: "Tidak",
      confirmButtonColor: newStatus === 'selesai' ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      try {
        await jamKerjaAPI.updatePenugasanStatus(penugasanId, newStatus);
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Penugasan berhasil di${newStatus === 'selesai' ? 'selesaikan' : 'batalkan'}.`,
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
        loadJamKerja();
      } catch (error) {
        console.error('Error updating penugasan status:', error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || 'Gagal mengupdate status penugasan',
          confirmButtonText: "Tutup",
          confirmButtonColor: "#EF4444",
        });
      }
    }
  }, [loadJamKerja]);

  // Submit default jam kerja
  const handleSubmitDefault = useCallback(async (formData) => {
    try {
      const submitData = {
        ...formData,
        jam_masuk_standar: formData.jam_masuk_standar + ':00',
        jam_pulang_standar: formData.jam_pulang_standar + ':00',
        toleransi_keterlambatan: formData.toleransi_keterlambatan + ':00',
        batas_terlambat: formData.batas_terlambat + ':00',
        is_active: formData.is_active
      };

      if (editingJamKerja) {
        await jamKerjaAPI.updateDefault(editingJamKerja.id, submitData);
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data jam kerja berhasil diperbarui!",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      } else {
        await jamKerjaAPI.createDefault(submitData);
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Data jam kerja berhasil disimpan!",
          confirmButtonText: "Oke",
          confirmButtonColor: "#10B981",
        });
      }
      
      handleCloseModal();
      loadJamKerja();
    } catch (error) {
      console.error('Error saving jam kerja:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal menyimpan jam kerja',
        confirmButtonText: "Tutup",
        confirmButtonColor: "#EF4444",
      });
    }
  }, [editingJamKerja, handleCloseModal, loadJamKerja]);

  // Logout handler
  const handleLogout = useCallback(async () => {
    localStorage.removeItem('token');
    router.push("/login");
  }, [router]);

  return {
    // Data & States
    jamKerja,
    loading,
    error,
    search,
    jenisFilter,
    currentPage,
    itemsPerPage,
    showModal,
    showPenugasanModal,
    showDetailModal,
    editingJamKerja,
    selectedJamKerja,
    sidebarOpen,
    
    // Data hasil filter & pagination
    filteredJamKerja,
    paginatedJamKerja,
    totalPages,
    startIndex,
    stats,
    
    // Actions
    setSearch,
    setJenisFilter,
    setCurrentPage,
    setSidebarOpen,
    handleShowAddModal,
    handleShowPenugasanModal,
    handleShowEditModal,
    handleViewDetail,
    handleDelete,
    handleSubmitDefault,
    handleUpdatePenugasanStatus,
    handleCloseModal,
    handleCloseDetailModal,
    loadJamKerja,
    handleLogout,
    
    // Utilities
    formatTime,
    calculateTotalHours,
    isPenugasan
  };
}