// utils/penugasanHelpers.js

/**
 * Format status badge untuk tampilan UI
 * @param {string} status - Status penugasan ('aktif', 'selesai', 'dibatalkan')
 * @param {number} is_active - Status aktif (1 atau 0)
 * @returns {object} - Objek dengan text, bgColor, textColor
 */
export const getStatusBadgeConfig = (status, is_active) => {
  if (status === 'aktif' && is_active === 1) {
    return {
      text: 'Aktif',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800'
    };
  } else if (status === 'selesai') {
    return {
      text: 'Selesai',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800'
    };
  } else if (status === 'dibatalkan') {
    return {
      text: 'Dibatalkan',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800'
    };
  } else {
    return {
      text: 'Nonaktif',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800'
    };
  }
};

/**
 * Format tipe badge untuk tampilan UI
 * @param {string} tipe - Tipe penugasan ('default' atau 'khusus')
 * @returns {object} - Objek dengan text, bgColor, textColor
 */
export const getTipeBadgeConfig = (tipe) => {
  if (tipe === 'default') {
    return {
      text: 'Default System',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-800'
    };
  }
  return {
    text: 'Khusus',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800'
  };
};

/**
 * Format tanggal untuk ditampilkan
 * @param {string} dateString - String tanggal ISO
 * @param {string} locale - Locale (default: 'id-ID')
 * @returns {string} - Tanggal terformat
 */
export const formatTanggal = (dateString, locale = 'id-ID') => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString(locale);
};

/**
 * Format jam untuk ditampilkan (HH:MM)
 * @param {string} timeString - String waktu (HH:MM:SS)
 * @returns {string} - Jam terformat (HH:MM)
 */
export const formatJam = (timeString) => {
  if (!timeString) return '-';
  return timeString.substring(0, 5);
};

/**
 * Validasi form penugasan
 * @param {object} formData - Data form penugasan
 * @returns {object} - Objek dengan isValid dan errors
 */
export const validatePenugasanForm = (formData) => {
  const errors = {};

  if (!formData.nama_penugasan || formData.nama_penugasan.trim() === '') {
    errors.nama_penugasan = 'Nama penugasan wajib diisi';
  }

  if (!formData.jam_masuk) {
    errors.jam_masuk = 'Jam masuk wajib diisi';
  }

  if (!formData.jam_pulang) {
    errors.jam_pulang = 'Jam pulang wajib diisi';
  }

  if (formData.tipe_penugasan === 'khusus') {
    if (!formData.maps_link) {
      errors.maps_link = 'Link Google Maps wajib diisi untuk penugasan khusus';
    }
    if (!formData.tanggal_mulai) {
      errors.tanggal_mulai = 'Tanggal mulai wajib diisi untuk penugasan khusus';
    }
    if (!formData.tanggal_selesai) {
      errors.tanggal_selesai = 'Tanggal selesai wajib diisi untuk penugasan khusus';
    }
    if (formData.tanggal_mulai && formData.tanggal_selesai) {
      if (new Date(formData.tanggal_mulai) > new Date(formData.tanggal_selesai)) {
        errors.tanggal = 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai';
      }
    }
  }

  if (formData.tipe_penugasan === 'khusus') {
    if (formData.tipe_assign === 'per_wilayah' && formData.selected_wilayah.length === 0) {
      errors.selected_wilayah = 'Pilih minimal satu wilayah';
    }
    if (formData.tipe_assign === 'individu' && formData.selected_users.length === 0) {
      errors.selected_users = 'Pilih minimal satu pekerja';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Filter penugasan berdasarkan search query
 * @param {array} penugasanList - List penugasan
 * @param {string} searchQuery - Query pencarian
 * @returns {array} - List penugasan yang sudah difilter
 */
export const filterPenugasanBySearch = (penugasanList, searchQuery) => {
  if (!searchQuery || searchQuery.trim() === '') {
    return penugasanList;
  }

  const query = searchQuery.toLowerCase().trim();
  return penugasanList.filter((penugasan) =>
    penugasan.nama_penugasan?.toLowerCase().includes(query) ||
    penugasan.kode_penugasan?.toLowerCase().includes(query)
  );
};

/**
 * Hitung statistik penugasan
 * @param {array} penugasanList - List penugasan
 * @returns {object} - Objek statistik
 */
export const getPenugasanStats = (penugasanList) => {
  return {
    total: penugasanList.length,
    aktif: penugasanList.filter(p => p.status === 'aktif' && p.is_active === 1).length,
    khusus: penugasanList.filter(p => p.tipe_penugasan === 'khusus').length,
    default: penugasanList.filter(p => p.tipe_penugasan === 'default').length,
    selesai: penugasanList.filter(p => p.status === 'selesai').length,
    dibatalkan: penugasanList.filter(p => p.status === 'dibatalkan').length
  };
};

/**
 * Group penugasan berdasarkan tipe
 * @param {array} penugasanList - List penugasan
 * @returns {object} - Object dengan key tipe dan value array penugasan
 */
export const groupPenugasanByTipe = (penugasanList) => {
  return penugasanList.reduce((acc, penugasan) => {
    const tipe = penugasan.tipe_penugasan;
    if (!acc[tipe]) {
      acc[tipe] = [];
    }
    acc[tipe].push(penugasan);
    return acc;
  }, {});
};

/**
 * Cek apakah penugasan bisa dihapus
 * @param {object} penugasan - Objek penugasan
 * @returns {object} - Objek dengan canDelete, reason
 */
export const canDeletePenugasan = (penugasan) => {
  if (penugasan.tipe_penugasan === 'default' && penugasan.is_active === 1) {
    return {
      canDelete: false,
      reason: 'Penugasan default yang sedang aktif tidak dapat dihapus. Nonaktifkan terlebih dahulu.'
    };
  }

  if (penugasan.tipe_penugasan === 'khusus' && penugasan.status === 'aktif') {
    return {
      canDelete: false,
      reason: 'Penugasan khusus yang masih aktif tidak dapat dihapus. Selesaikan atau batalkan terlebih dahulu.'
    };
  }

  return { canDelete: true, reason: null };
};

/**
 * Cek apakah penugasan bisa dinonaktifkan
 * @param {object} penugasan - Objek penugasan
 * @returns {object} - Objek dengan canSoftDelete, reason
 */
export const canSoftDeletePenugasan = (penugasan) => {
  if (penugasan.tipe_penugasan === 'default' && penugasan.is_active === 1) {
    return {
      canSoftDelete: false,
      reason: 'Penugasan default yang sedang aktif tidak dapat dinonaktifkan. Buat penugasan default baru untuk menggantikannya.'
    };
  }

  return { canSoftDelete: true, reason: null };
};

/**
 * Generate pesan konfirmasi untuk aksi
 * @param {string} action - Jenis aksi ('delete', 'softDelete', 'selesai', 'dibatalkan')
 * @param {string} namaPenugasan - Nama penugasan
 * @returns {object} - Objek dengan title, text, icon
 */
export const getConfirmationMessage = (action, namaPenugasan) => {
  const messages = {
    delete: {
      title: 'Hapus Penugasan?',
      text: `Yakin ingin menghapus penugasan "${namaPenugasan}"?`,
      icon: 'warning',
      confirmText: 'Ya, Hapus',
      confirmColor: '#EF4444'
    },
    softDelete: {
      title: 'Nonaktifkan Penugasan?',
      text: `Yakin ingin menonaktifkan penugasan "${namaPenugasan}"?\n\nPenugasan yang dinonaktifkan tidak akan bisa digunakan lagi.`,
      icon: 'warning',
      confirmText: 'Ya, Nonaktifkan',
      confirmColor: '#F59E0B'
    },
    selesai: {
      title: 'Selesaikan Penugasan?',
      text: `Yakin ingin menyelesaikan penugasan "${namaPenugasan}"?`,
      icon: 'question',
      confirmText: 'Ya, Selesaikan',
      confirmColor: '#10B981'
    },
    dibatalkan: {
      title: 'Batalkan Penugasan?',
      text: `Yakin ingin membatalkan penugasan "${namaPenugasan}"?`,
      icon: 'question',
      confirmText: 'Ya, Batalkan',
      confirmColor: '#EF4444'
    }
  };

  return messages[action] || messages.delete;
};

/**
 * Generate kode penugasan (jika diperlukan dari frontend)
 * @param {string} prefix - Prefix kode (default: 'PNG')
 * @returns {string} - Kode penugasan
 */
export const generateKodePenugasan = (prefix = 'PNG') => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}/${year}${month}${day}/${random}`;
};

/**
 * Parse Google Maps link untuk mendapatkan embed URL
 * @param {string} mapsLink - Link Google Maps
 * @returns {string} - Embed URL atau link asli jika gagal parse
 */
export const parseMapsLink = (mapsLink) => {
  if (!mapsLink) return null;
  
  // Coba extract place ID atau koordinat dari link
  const placeMatch = mapsLink.match(/place\/([^\/]+)/);
  const coordMatch = mapsLink.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  
  if (placeMatch) {
    const placeName = placeMatch[1];
    return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(placeName)}`;
  }
  
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    return `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${lat},${lng}&zoom=15`;
  }
  
  return mapsLink;
};

/**
 * Format waktu untuk ditampilkan di tooltip
 * @param {string} timeString - String waktu
 * @returns {string} - Waktu terformat dengan keterangan
 */
export const formatTimeWithDescription = (timeString) => {
  if (!timeString) return '-';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  
  let period = '';
  if (hour < 12) period = 'Pagi';
  else if (hour < 15) period = 'Siang';
  else if (hour < 18) period = 'Sore';
  else period = 'Malam';
  
  return `${timeString.substring(0, 5)} (${period})`;
};

/**
 * Hitung durasi penugasan dalam hari
 * @param {string} tanggalMulai - Tanggal mulai
 * @param {string} tanggalSelesai - Tanggal selesai
 * @returns {number} - Durasi dalam hari
 */
export const getPenugasanDuration = (tanggalMulai, tanggalSelesai) => {
  if (!tanggalMulai || !tanggalSelesai) return 0;
  
  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // +1 karena termasuk hari mulai dan selesai
};

/**
 * Cek apakah penugasan sedang berlangsung
 * @param {object} penugasan - Objek penugasan
 * @returns {boolean} - True jika sedang berlangsung
 */
export const isPenugasanOngoing = (penugasan) => {
  if (penugasan.tipe_penugasan !== 'khusus') return false;
  if (penugasan.status !== 'aktif') return false;
  
  const today = new Date();
  const start = new Date(penugasan.tanggal_mulai);
  const end = new Date(penugasan.tanggal_selesai);
  
  return today >= start && today <= end;
};

/**
 * Sort penugasan berdasarkan tanggal
 * @param {array} penugasanList - List penugasan
 * @param {string} order - 'asc' atau 'desc'
 * @returns {array} - List penugasan yang sudah di-sort
 */
export const sortPenugasanByDate = (penugasanList, order = 'desc') => {
  return [...penugasanList].sort((a, b) => {
    const dateA = a.tanggal_mulai ? new Date(a.tanggal_mulai) : new Date(0);
    const dateB = b.tanggal_mulai ? new Date(b.tanggal_mulai) : new Date(0);
    
    if (order === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};

/**
 * Export data penugasan ke format CSV
 * @param {array} penugasanList - List penugasan
 * @returns {string} - String CSV
 */
export const exportPenugasanToCSV = (penugasanList) => {
  const headers = ['Kode', 'Nama Penugasan', 'Tipe', 'Status', 'Jam Masuk', 'Jam Pulang', 'Tanggal Mulai', 'Tanggal Selesai'];
  
  const rows = penugasanList.map(p => [
    p.kode_penugasan,
    p.nama_penugasan,
    p.tipe_penugasan === 'default' ? 'Default System' : 'Khusus',
    p.status,
    formatJam(p.jam_masuk),
    formatJam(p.jam_pulang),
    p.tanggal_mulai ? formatTanggal(p.tanggal_mulai) : '-',
    p.tanggal_selesai ? formatTanggal(p.tanggal_selesai) : '-'
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Download data penugasan sebagai file CSV
 * @param {array} penugasanList - List penugasan
 * @param {string} filename - Nama file (default: 'penugasan.csv')
 */
export const downloadPenugasanCSV = (penugasanList, filename = 'penugasan.csv') => {
  const csv = exportPenugasanToCSV(penugasanList);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};