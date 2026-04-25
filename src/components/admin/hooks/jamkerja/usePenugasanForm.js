import { useState } from 'react';
import { penugasanAPI } from '@/lib/api';
import Swal from "sweetalert2";

export const usePenugasanForm = (wilayahList, usersList, onSuccess) => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [formLoading, setFormLoading] = useState(false); // Ganti dari loading ke formLoading
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    wilayah: {},
    individu: {}
  });
  const [selectAllWilayah, setSelectAllWilayah] = useState(false);
  const [selectAllIndividu, setSelectAllIndividu] = useState(false);

  const [formData, setFormData] = useState({
    nama_penugasan: '',
    tipe_penugasan: 'khusus',
    maps_link: '',
    alamat: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    jam_masuk: '08:00:00',
    jam_pulang: '17:00:00',
    toleransi_keterlambatan: '00:15:00',
    batas_terlambat: '',
    radius: 100,
    tipe_assign: 'semua_pekerja',
    selected_users: [],
    selected_wilayah: [],
    is_active: true
  });

  const handleWilayahCheckboxChange = (wilayahId) => {
    setSelectedCheckboxes(prev => ({
      ...prev,
      wilayah: {
        ...prev.wilayah,
        [wilayahId]: !prev.wilayah[wilayahId]
      }
    }));
    
    const newSelectedWilayah = { ...selectedCheckboxes.wilayah };
    newSelectedWilayah[wilayahId] = !newSelectedWilayah[wilayahId];
    
    const wilayahIds = Object.keys(newSelectedWilayah).filter(
      id => newSelectedWilayah[id]
    ).map(id => parseInt(id));
    
    setFormData(prev => ({
      ...prev,
      selected_wilayah: wilayahIds
    }));
  };

  const handleSelectAllWilayah = () => {
    const newSelectAll = !selectAllWilayah;
    setSelectAllWilayah(newSelectAll);
    
    const newWilayahState = {};
    wilayahList.forEach(wilayah => {
      newWilayahState[wilayah.id] = newSelectAll;
    });
    
    setSelectedCheckboxes(prev => ({
      ...prev,
      wilayah: newWilayahState
    }));
    
    if (newSelectAll) {
      setFormData(prev => ({
        ...prev,
        selected_wilayah: wilayahList.map(w => w.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selected_wilayah: []
      }));
    }
  };

  const handleIndividuCheckboxChange = (userId) => {
    setSelectedCheckboxes(prev => ({
      ...prev,
      individu: {
        ...prev.individu,
        [userId]: !prev.individu[userId]
      }
    }));
    
    const newSelectedUsers = { ...selectedCheckboxes.individu };
    newSelectedUsers[userId] = !newSelectedUsers[userId];
    
    const userIds = Object.keys(newSelectedUsers).filter(
      id => newSelectedUsers[id]
    ).map(id => parseInt(id));
    
    setFormData(prev => ({
      ...prev,
      selected_users: userIds
    }));
  };

  const handleSelectAllIndividu = () => {
    const newSelectAll = !selectAllIndividu;
    setSelectAllIndividu(newSelectAll);
    
    const filteredUsers = usersList.filter(user => user.roles === 'pegawai' && user.is_active);
    const newIndividuState = {};
    filteredUsers.forEach(user => {
      newIndividuState[user.id] = newSelectAll;
    });
    
    setSelectedCheckboxes(prev => ({
      ...prev,
      individu: newIndividuState
    }));
    
    if (newSelectAll) {
      setFormData(prev => ({
        ...prev,
        selected_users: filteredUsers.map(u => u.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selected_users: []
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); // Set loading true
    try {
      if (!formData.nama_penugasan || !formData.jam_masuk || !formData.jam_pulang) {
        Swal.fire({ icon: "warning", title: "Data Tidak Lengkap", text: "Nama penugasan, jam masuk, dan jam pulang wajib diisi", confirmButtonColor: "#F59E0B" });
        setFormLoading(false);
        return;
      }

      if (formData.tipe_penugasan === 'khusus') {
        if (!formData.maps_link) {
          Swal.fire({ icon: "warning", title: "Link Maps Wajib", text: "Penugasan khusus wajib menyertakan link Google Maps", confirmButtonColor: "#F59E0B" });
          setFormLoading(false);
          return;
        }
        if (!formData.tanggal_mulai || !formData.tanggal_selesai) {
          Swal.fire({ icon: "warning", title: "Tanggal Wajib", text: "Penugasan khusus wajib menyertakan tanggal mulai dan selesai", confirmButtonColor: "#F59E0B" });
          setFormLoading(false);
          return;
        }
      }

      if (formData.tipe_penugasan === 'khusus') {
        if (formData.tipe_assign === 'per_wilayah' && formData.selected_wilayah.length === 0) {
          Swal.fire({ icon: "warning", title: "Pilih Wilayah", text: "Silakan pilih minimal satu wilayah", confirmButtonColor: "#F59E0B" });
          setFormLoading(false);
          return;
        }
        if (formData.tipe_assign === 'individu' && formData.selected_users.length === 0) {
          Swal.fire({ icon: "warning", title: "Pilih Pekerja", text: "Silakan pilih minimal satu pekerja", confirmButtonColor: "#F59E0B" });
          setFormLoading(false);
          return;
        }
      }

      let response;
      if (isEdit) {
        if (formData.tipe_penugasan === 'default') {
          response = await penugasanAPI.updateDefault(formData.id, formData);
        } else {
          response = await penugasanAPI.update(formData.id, formData);
        }
      } else {
        response = await penugasanAPI.create(formData);
      }
      
      if (response.data.success) {
        Swal.fire({ 
          icon: "success", 
          title: "Berhasil!", 
          text: response.data.message || (isEdit ? 'Penugasan berhasil diupdate' : 'Penugasan berhasil dibuat'),
          confirmButtonColor: "#10B981" 
        });
        
        setShowFormModal(false);
        resetForm();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error saving penugasan:', error);
      Swal.fire({ 
        icon: "error", 
        title: "Oops...", 
        text: error.response?.data?.message || 'Gagal menyimpan penugasan', 
        confirmButtonColor: "#EF4444" 
      });
    } finally {
      setFormLoading(false); // Set loading false
    }
  };

  const handleEdit = async (penugasan) => {
    try {
      setFormLoading(true);
      const response = await penugasanAPI.getById(penugasan.id);
      const data = response.data.data;
      
      setSelectedPenugasan(data);
      
      const selectedUsers = data.assigned_users?.map(u => u.id) || [];
      const selectedWilayah = data.selected_wilayah || [];
      
      const wilayahCheckboxState = {};
      selectedWilayah.forEach(id => { wilayahCheckboxState[id] = true; });
      
      const individuCheckboxState = {};
      selectedUsers.forEach(id => { individuCheckboxState[id] = true; });
      
      setSelectedCheckboxes({
        wilayah: wilayahCheckboxState,
        individu: individuCheckboxState
      });
      
      setSelectAllWilayah(selectedWilayah.length === wilayahList.length && wilayahList.length > 0);
      setSelectAllIndividu(selectedUsers.length === usersList.filter(u => u.roles === 'pegawai' && u.is_active).length);
      
      setFormData({
        id: data.id,
        nama_penugasan: data.nama_penugasan,
        tipe_penugasan: data.tipe_penugasan,
        maps_link: data.maps_link || '',
        alamat: data.alamat || '',
        tanggal_mulai: data.tanggal_mulai?.split('T')[0] || '',
        tanggal_selesai: data.tanggal_selesai?.split('T')[0] || '',
        jam_masuk: data.jam_masuk,
        jam_pulang: data.jam_pulang,
        toleransi_keterlambatan: data.toleransi_keterlambatan || '00:15:00',
        batas_terlambat: data.batas_terlambat || '',
        radius: data.radius || 100,
        tipe_assign: data.tipe_assign || (selectedUsers.length > 0 ? (selectedWilayah.length > 0 ? 'per_wilayah' : 'individu') : 'semua_pekerja'),
        selected_users: selectedUsers,
        selected_wilayah: selectedWilayah,
        is_active: data.is_active === 1
      });
      
      setIsEdit(true);
      setShowFormModal(true);
    } catch (error) {
      console.error('Error loading penugasan detail:', error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: error.response?.data?.message || 'Gagal memuat detail penugasan',
        confirmButtonColor: "#EF4444"
      });
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nama_penugasan: '',
      tipe_penugasan: 'khusus',
      maps_link: '',
      alamat: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      jam_masuk: '08:00:00',
      jam_pulang: '17:00:00',
      toleransi_keterlambatan: '00:15:00',
      batas_terlambat: '',
      radius: 100,
      tipe_assign: 'semua_pekerja',
      selected_users: [],
      selected_wilayah: [],
      is_active: true
    });
    setSelectedCheckboxes({ wilayah: {}, individu: {} });
    setSelectAllWilayah(false);
    setSelectAllIndividu(false);
    setIsEdit(false);
    setSelectedPenugasan(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  return {
    showFormModal,
    setShowFormModal,
    selectedPenugasan,
    isEdit,
    formData,
    setFormData,
    selectedCheckboxes,
    selectAllWilayah,
    selectAllIndividu,
    formLoading, // Ganti dari loading ke formLoading
    handleWilayahCheckboxChange,
    handleSelectAllWilayah,
    handleIndividuCheckboxChange,
    handleSelectAllIndividu,
    handleSubmit,
    handleEdit,
    openCreateModal,
    resetForm
  };
};