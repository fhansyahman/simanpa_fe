import { useState } from 'react';
import { penugasanAPI } from '@/lib/api';
import Swal from "sweetalert2";

export const useFormPenugasan = (onSuccess) => {
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

  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    wilayah: {},
    individu: {}
  });
  const [selectAllWilayah, setSelectAllWilayah] = useState(false);
  const [selectAllIndividu, setSelectAllIndividu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);

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

  const setEditData = (penugasan) => {
    setFormData({
      id: penugasan.id,
      nama_penugasan: penugasan.nama_penugasan,
      tipe_penugasan: penugasan.tipe_penugasan || 'khusus',
      maps_link: penugasan.maps_link || '',
      alamat: penugasan.alamat || '',
      tanggal_mulai: penugasan.tanggal_mulai || '',
      tanggal_selesai: penugasan.tanggal_selesai || '',
      jam_masuk: penugasan.jam_masuk || '08:00:00',
      jam_pulang: penugasan.jam_pulang || '17:00:00',
      toleransi_keterlambatan: penugasan.toleransi_keterlambatan || '00:15:00',
      batas_terlambat: penugasan.batas_terlambat || '',
      radius: penugasan.radius || 100,
      tipe_assign: penugasan.tipe_assign || 'semua_pekerja',
      selected_users: penugasan.selected_users || [],
      selected_wilayah: penugasan.selected_wilayah || [],
      is_active: penugasan.is_active !== undefined ? penugasan.is_active : true
    });

    // Set checkbox states berdasarkan data yang ada
    const newWilayahState = {};
    (penugasan.selected_wilayah || []).forEach(id => {
      newWilayahState[id] = true;
    });
    
    const newIndividuState = {};
    (penugasan.selected_users || []).forEach(id => {
      newIndividuState[id] = true;
    });
    
    setSelectedCheckboxes({
      wilayah: newWilayahState,
      individu: newIndividuState
    });
    
    // Set select all states
    if (penugasan.selected_wilayah && penugasan.selected_wilayah.length > 0) {
      setSelectAllWilayah(true);
    }
    if (penugasan.selected_users && penugasan.selected_users.length > 0) {
      setSelectAllIndividu(true);
    }
    
    setIsEdit(true);
    setSelectedPenugasan(penugasan);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nama_penugasan || !formData.jam_masuk || !formData.jam_pulang) {
        Swal.fire({ icon: "warning", title: "Data Tidak Lengkap", text: "Nama penugasan, jam masuk, dan jam pulang wajib diisi", confirmButtonColor: "#F59E0B" });
        return;
      }

      if (formData.tipe_penugasan === 'khusus') {
        if (!formData.maps_link) {
          Swal.fire({ icon: "warning", title: "Link Maps Wajib", text: "Penugasan khusus wajib menyertakan link Google Maps", confirmButtonColor: "#F59E0B" });
          return;
        }
        if (!formData.tanggal_mulai || !formData.tanggal_selesai) {
          Swal.fire({ icon: "warning", title: "Tanggal Wajib", text: "Penugasan khusus wajib menyertakan tanggal mulai dan selesai", confirmButtonColor: "#F59E0B" });
          return;
        }
      }

      if (formData.tipe_penugasan === 'khusus') {
        if (formData.tipe_assign === 'per_wilayah' && formData.selected_wilayah.length === 0) {
          Swal.fire({ icon: "warning", title: "Pilih Wilayah", text: "Silakan pilih minimal satu wilayah", confirmButtonColor: "#F59E0B" });
          return;
        }
        if (formData.tipe_assign === 'individu' && formData.selected_users.length === 0) {
          Swal.fire({ icon: "warning", title: "Pilih Pekerja", text: "Silakan pilih minimal satu pekerja", confirmButtonColor: "#F59E0B" });
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
        
        resetForm();
        if (onSuccess) onSuccess();
        return true;
      }
    } catch (error) {
      console.error('Error saving penugasan:', error);
      Swal.fire({ 
        icon: "error", 
        title: "Oops...", 
        text: error.response?.data?.message || 'Gagal menyimpan penugasan', 
        confirmButtonColor: "#EF4444" 
      });
      return false;
    }
  };

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

  const handleSelectAllWilayah = (wilayahList) => {
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

  const handleSelectAllIndividu = (usersList) => {
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

  return {
    formData,
    setFormData,
    selectedCheckboxes,
    setSelectedCheckboxes,
    selectAllWilayah,
    setSelectAllWilayah,
    selectAllIndividu,
    setSelectAllIndividu,
    isEdit,
    setIsEdit,
    selectedPenugasan,
    setSelectedPenugasan,
    resetForm,
    setEditData,
    handleSubmit,
    handleWilayahCheckboxChange,
    handleSelectAllWilayah,
    handleIndividuCheckboxChange,
    handleSelectAllIndividu
  };
};