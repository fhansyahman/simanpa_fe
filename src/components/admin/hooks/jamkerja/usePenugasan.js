import { useState, useEffect } from 'react';
import { penugasanAPI, usersAPI, wilayahAPI } from '@/lib/api';
import Swal from "sweetalert2";

export const usePenugasan = () => {
  const [penugasanList, setPenugasanList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState('semua');
  const [activeTab, setActiveTab] = useState('semua');

  const loadPenugasanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await penugasanAPI.getAll({ jenis: jenisFilter });
      setPenugasanList(response.data.data || []);
    } catch (error) {
      console.error('Error loading penugasan:', error);
      setError('Gagal memuat data penugasan');
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsersList(response.data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadWilayahData = async () => {
    try {
      const response = await wilayahAPI.getAll();
      const wilayahData = response.data.data || [];
      setWilayahList(wilayahData);
    } catch (error) {
      console.error('Error loading wilayah:', error);
    }
  };

  const handleDelete = async (id, nama_penugasan, tipe_penugasan, status, is_active) => {
    if (tipe_penugasan === 'default' && is_active === 1) {
      Swal.fire({ icon: "error", title: "Tidak Dapat Dihapus", text: "Penugasan default yang sedang aktif tidak dapat dihapus. Nonaktifkan terlebih dahulu.", confirmButtonColor: "#EF4444" });
      return;
    }
    
    if (tipe_penugasan === 'khusus' && status === 'aktif') {
      Swal.fire({ icon: "error", title: "Tidak Dapat Dihapus", text: "Penugasan khusus yang masih aktif tidak dapat dihapus. Selesaikan atau batalkan terlebih dahulu.", confirmButtonColor: "#EF4444" });
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
          Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Penugasan berhasil dihapus', confirmButtonColor: '#10B981' });
          loadPenugasanData();
        } catch (error) {
          console.error('Error deleting penugasan:', error);
          Swal.fire({ icon: 'error', title: 'Oops...', text: error.response?.data?.message || 'Gagal menghapus penugasan', confirmButtonColor: '#EF4444' });
        }
      }
    });
  };

  const handleSoftDelete = async (id, nama_penugasan) => {
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
          setLoading(true);
          const response = await penugasanAPI.softDelete(id);
          
          if (response.data.success) {
            Swal.fire({ 
              icon: 'success', 
              title: 'Berhasil!', 
              text: response.data.message || 'Penugasan berhasil dinonaktifkan', 
              confirmButtonColor: '#10B981' 
            });
            loadPenugasanData();
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
        } finally {
          setLoading(false);
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
          Swal.fire({ icon: 'success', title: 'Berhasil!', text: `Penugasan berhasil di${statusText}`, confirmButtonColor: '#10B981' });
          loadPenugasanData();
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({ icon: 'error', title: 'Oops...', text: error.response?.data?.message || 'Gagal mengubah status', confirmButtonColor: '#EF4444' });
        }
      }
    });
  };

  const filteredPenugasan = penugasanList.filter((penugasan) =>
    penugasan.nama_penugasan?.toLowerCase().includes(search.toLowerCase()) ||
    penugasan.kode_penugasan?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadPenugasanData();
    loadUsersData();
    loadWilayahData();
  }, [jenisFilter]);

  return {
    penugasanList,
    usersList,
    wilayahList,
    loading,
    error,
    search,
    setSearch,
    jenisFilter,
    setJenisFilter,
    activeTab,
    setActiveTab,
    filteredPenugasan,
    loadPenugasanData,
    handleDelete,
    handleSoftDelete,
    handleUpdateStatus
  };
};