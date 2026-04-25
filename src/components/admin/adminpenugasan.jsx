'use client';
import { useState, useEffect } from 'react';
import { adminPenugasanAPI, usersAPI } from '@/lib/api';
import Swal from "sweetalert2";
import { 
  Search, Plus, Edit, Trash2, X, Eye, Home, Menu, LogOut, Lock, ChevronDown, 
  Users, Calendar, Clock, Settings, ClipboardList, FileBarChart, Activity, 
  List, Map, Check, AlertCircle, RefreshCw, Save, Calendar as CalendarIcon, 
  FileText, Download, Filter, BarChart3, Users as UsersIcon, TrendingUp, 
  Database, UserCheck, UserX, Building2, Navigation, Locate, MapPin,
  Play, Square, Timer, BarChart, PieChart, LineChart, DownloadCloud,
  Select, CheckSquare, SquareStack, Archive, MapPin as MapPinIcon,
  Globe, Target, Radio, AlertTriangle, UserPlus, UserMinus
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';

export default function AdminManajemenPenugasan() {
  const [penugasanList, setPenugasanList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsersList, setFilteredUsersList] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMonitoringModal, setShowMonitoringModal] = useState(false);
  const [selectedPenugasan, setSelectedPenugasan] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('data');
  const [isEdit, setIsEdit] = useState(false);
  const [searchPekerja, setSearchPekerja] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const pathname = usePathname();
  const [filters, setFilters] = useState({
    status: '',
    start_date: '',
    end_date: '',
    page: 1,
    limit: 20
  });

  const router = useRouter();

  // Form data
  const [formData, setFormData] = useState({
    nama_penugasan: '',
    maps_link: '',
    alamat: '',
    tanggal_mulai: new Date().toISOString().split('T')[0],
    tanggal_selesai: new Date().toISOString().split('T')[0],
    jam_masuk: '08:00:00',
    jam_pulang: '17:00:00',
    batas_terlambat: '08:15:00',
    toleransi_keterlambatan: '00:15:00',
    radius: 100,
    tipe_assign: 'individu',
    selected_users: [],
    selected_wilayah: []
  });

  // Sidebar menu items
  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: <Home size={16} />, 
      path: "/admin/dashboard",
      onClick: () => router.push("/admin/dashboard")
    },
    {
      title: "Manajemen Pekerja",
      icon: <Users size={16} />,
      submenu: [
        { name: "Data Pekerja", icon: <Users size={14} />, path: "/admin/datapekerja", onClick: () => router.push("/admin/datapekerja") },
        { name: "Status Pegawai", icon: <UserCheck size={14} />, path: "/admin/statuspekerja", onClick: () => router.push("/admin/statuspekerja") },
        { name: "Pembagian Wilayah", icon: <Map size={14} />, path: "/admin/pembagianwilayah", onClick: () => router.push("/admin/pembagianwilayah") },
      ],
    },
    {
      title: "Presensi",
      icon: <Clock size={16} />,
      submenu: [
        { name: "Rekap Presensi", icon: <FileBarChart size={14} />, path: "/admin/rekappresensi", onClick: () => router.push("/admin/rekappresensi") },
        { name: "Data Presensi", icon: <List size={14} />, path: "/admin/presensi", onClick: () => router.push("/admin/presensi") },
        { name: "Pemutihan", icon: <Check size={14} />, path: "/admin/pemutihan", onClick: () => router.push("/admin/pemutihan") },
      ],
    },
    {
      title: "Penugasan Kerja",
      icon: <Target size={16} />,
      submenu: [
        { name: "Data Penugasan", icon: <List size={14} />, path: "/admin/penugasan", onClick: () => router.push("/admin/penugasan") },
        { name: "Monitoring", icon: <Activity size={14} />, path: "/admin/monitoringpenugasan", onClick: () => router.push("/admin/monitoringpenugasan") },
      ],
    },
    {
      title: "Aktivitas Pekerja",
      icon: <Activity size={16} />,
      submenu: [
        { name: "Data Aktivitas", icon: <List size={14} />, path: "/admin/aktivitaspekerja", onClick: () => router.push("/admin/aktivitaspekerja") },
        { name: "Statistik Aktivitas", icon: <BarChart3 size={14} />, path: "/admin/statistikaktivitas", onClick: () => router.push("/admin/statistikaktivitas") },
      ],
    },
    {
      title: "Kinerja Harian",
      icon: <ClipboardList size={16} />,
      submenu: [
        { name: "Data Kinerja", icon: <List size={14} />, path: "/admin/kinerjaharian", onClick: () => router.push("/admin/kinerjaharian") },
        { name: "Statistik Kinerja", icon: <BarChart3 size={14} />, path: "/admin/statistikkinerja", onClick: () => router.push("/admin/statistikkinerja") },
      ],
    },
    {
      title: "Manajemen Wilayah",
      icon: <MapPin size={16} />,
      submenu: [
        { name: "Penugasan Wilayah", icon: <UserCheck size={14} />, path: "/admin/manajemenwilayah", onClick: () => router.push("/admin/manajemenwilayah") },
        { name: "Statistik Wilayah", icon: <TrendingUp size={14} />, path: "/admin/statistikwilayah", onClick: () => router.push("/admin/statistikwilayah") },
      ],
    },
    {
      title: "Izin & Cuti",
      icon: <ClipboardList size={16} />,
      submenu: [
        { name: "Persetujuan Izin", icon: <Check size={14} />, path: "/admin/izin", onClick: () => router.push("/admin/izin") },
        { name: "Riwayat Izin", icon: <Clock size={14} />, path: "/admin/riwayatizin", onClick: () => router.push("/admin/riwayatizin") },
      ],
    },
    {
      title: "Laporan",
      icon: <FileBarChart size={16} />,
      submenu: [
        { name: "Laporan Kehadiran", icon: <Activity size={14} />, path: "/admin/laporankehadiran", onClick: () => router.push("/admin/laporankehadiran") },
        { name: "Laporan Kinerja", icon: <FileText size={14} />, path: "/admin/laporankinerja", onClick: () => router.push("/admin/laporankinerja") },
        { name: "Laporan Aktivitas", icon: <Activity size={14} />, path: "/admin/laporanaktivitas", onClick: () => router.push("/admin/laporanaktivitas") },
      ],
    },
    { 
      title: "Pengaturan", 
      icon: <Settings size={16} />, 
      path: "/admin/pengaturan",
      onClick: () => router.push("/admin/pengaturan")
    },
  ];

  const SidebarItem = ({ title, icon, submenu, active, path, onClick }) => {
    const [open, setOpen] = useState(false);
    const isActive = pathname === path;
    
    const handleMainClick = (e) => {
      if (submenu) {
        e.preventDefault();
        setOpen(!open);
      } else if (onClick) {
        onClick();
      } else if (path) {
        router.push(path);
      }
    };

    return (
      <li className="text-gray-800 text-black">
        {path && !submenu ? (
          <Link href={path} onClick={(e) => submenu && handleMainClick(e)} className={`block ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''}`}>
            <div className="flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer hover:bg-gray-200 transition">
              <div className="flex items-center gap-3">
                {icon && <span>{icon}</span>}
                <span className="text-sm md:text-base">{title}</span>
              </div>
              {submenu && <ChevronDown size={14} className={`text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />}
            </div>
          </Link>
        ) : (
          <div onClick={handleMainClick} className="flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer hover:bg-gray-200 transition">
            <div className="flex items-center gap-3">
              {icon && <span>{icon}</span>}
              <span className="text-sm md:text-base">{title}</span>
            </div>
            {submenu && <ChevronDown size={14} className={`text-gray-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />}
          </div>
        )}
        {submenu && open && (
          <ul className="ml-8 md:ml-10 mt-1 border-l border-gray-300">
            {submenu.map((item, index) => (
              <li key={index}>
                {item.path ? (
                  <Link href={item.path} className={`flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 cursor-pointer text-xs md:text-sm hover:bg-gray-100 rounded-r-lg transition ${pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}>
                    {item.icon && <span className="text-gray-600">{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <div onClick={() => item.onClick && item.onClick()} className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 cursor-pointer text-xs md:text-sm text-gray-700 hover:bg-gray-100 rounded-r-lg transition">
                    {item.icon && <span className="text-gray-600">{item.icon}</span>}
                    <span>{item.name}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  useEffect(() => {
    loadPenugasanData();
    loadUsersData();
    loadWilayahData();
  }, [activeTab, filters]);

  // Filter users berdasarkan search
  useEffect(() => {
    if (searchPekerja) {
      const filtered = usersList.filter(user => 
        user.roles === 'pegawai' && (
          user.nama?.toLowerCase().includes(searchPekerja.toLowerCase()) ||
          user.jabatan?.toLowerCase().includes(searchPekerja.toLowerCase()) ||
          user.wilayah_penugasan?.toLowerCase().includes(searchPekerja.toLowerCase())
        )
      );
      setFilteredUsersList(filtered);
    } else {
      setFilteredUsersList(usersList.filter(user => user.roles === 'pegawai'));
    }
  }, [searchPekerja, usersList]);

  const loadPenugasanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminPenugasanAPI.getAllPenugasan(filters);
      setPenugasanList(response.data.data || []);
      setPagination(response.data.pagination || {});
    } catch (error) {
      console.error('Error loading penugasan:', error);
      setError('Gagal memuat data penugasan');
      setPenugasanList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsersList(response.data.data || []);
      setFilteredUsersList(response.data.data?.filter(user => user.roles === 'pegawai') || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadWilayahData = async () => {
    try {
      const response = await adminPenugasanAPI.getWilayahForDropdown();
      setWilayahList(response.data.data || []);
    } catch (error) {
      console.error('Error loading wilayah:', error);
    }
  };

  const loadMonitoring = async (id, tanggal) => {
    try {
      setLoading(true);
      const response = await adminPenugasanAPI.getMonitoringPenugasan(id, { tanggal });
      setMonitoringData(response.data.data);
      setShowMonitoringModal(true);
    } catch (error) {
      console.error('Error loading monitoring:', error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || 'Gagal memuat data monitoring',
        confirmButtonText: "Tutup",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.nama_penugasan || !formData.maps_link || !formData.tanggal_mulai || !formData.tanggal_selesai) {
        Swal.fire({ icon: "warning", title: "Data Tidak Lengkap", text: "Nama penugasan, link maps, tanggal mulai, dan tanggal selesai wajib diisi", confirmButtonText: "Oke" });
        return;
      }

      if (isEdit) {
        await adminPenugasanAPI.updatePenugasan(selectedPenugasan.id, formData);
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Data penugasan berhasil diupdate", confirmButtonText: "Oke" });
      } else {
        await adminPenugasanAPI.createPenugasan(formData);
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Penugasan berhasil dibuat", confirmButtonText: "Oke" });
      }

      setShowFormModal(false);
      resetForm();
      loadPenugasanData();
    } catch (error) {
      console.error('Error saving penugasan:', error);
      Swal.fire({ icon: "error", title: "Oops...", text: error.response?.data?.message || 'Gagal menyimpan data penugasan', confirmButtonText: "Tutup" });
    }
  };

  const handleEdit = (penugasan) => {
  // Format tanggal dengan benar untuk input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    // Jika sudah dalam format YYYY-MM-DD, langsung return
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;
    // Jika dalam format ISO, ambil bagian tanggalnya
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  setSelectedPenugasan(penugasan);
  setFormData({
    nama_penugasan: penugasan.nama_penugasan || '',
    maps_link: penugasan.maps_link || '',
    alamat: penugasan.alamat || '',
    tanggal_mulai: formatDateForInput(penugasan.tanggal_mulai),
    tanggal_selesai: formatDateForInput(penugasan.tanggal_selesai),
    jam_masuk: penugasan.jam_masuk || '08:00:00',
    jam_pulang: penugasan.jam_pulang || '17:00:00',
    batas_terlambat: penugasan.batas_terlambat || '08:15:00',
    toleransi_keterlambatan: penugasan.toleransi_keterlambatan || '00:15:00',
    radius: penugasan.radius || 100,
    tipe_assign: 'individu',
    selected_users: [],
    selected_wilayah: []
  });
  setSearchPekerja("");
  setIsEdit(true);
  setShowFormModal(true);
};

  const handleViewDetail = async (id) => {
    try {
      const response = await adminPenugasanAPI.getPenugasanById(id);
      setSelectedPenugasan(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error loading detail:', error);
      Swal.fire({ icon: "error", title: "Oops...", text: 'Gagal memuat detail penugasan', confirmButtonText: "Tutup" });
    }
  };

  const handleDelete = async (id, nama_penugasan) => {
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
          await adminPenugasanAPI.deletePenugasan(id);
          Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Penugasan berhasil dihapus', confirmButtonText: 'Oke' });
          loadPenugasanData();
        } catch (error) {
          console.error('Error deleting penugasan:', error);
          Swal.fire({ icon: 'error', title: 'Oops...', text: error.response?.data?.message || 'Gagal menghapus penugasan', confirmButtonText: 'Tutup' });
        }
      }
    });
  };

  const toggleUserSelection = (userId) => {
    setFormData(prev => ({
      ...prev,
      selected_users: prev.selected_users.includes(userId)
        ? prev.selected_users.filter(id => id !== userId)
        : [...prev.selected_users, userId]
    }));
  };

  const handleSelectAllUsers = () => {
    const pegawaiIds = filteredUsersList.map(user => user.id);
    if (formData.selected_users.length === pegawaiIds.length) {
      setFormData(prev => ({ ...prev, selected_users: [] }));
    } else {
      setFormData(prev => ({ ...prev, selected_users: pegawaiIds }));
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'aktif' ? 'selesai' : 'aktif';
    Swal.fire({
      title: `${newStatus === 'aktif' ? 'Aktifkan' : 'Selesaikan'} Penugasan?`,
      text: `Yakin ingin mengubah status penugasan menjadi "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminPenugasanAPI.updatePenugasan(id, { status: newStatus });
          Swal.fire({ icon: 'success', title: 'Berhasil!', text: `Status penugasan diubah menjadi ${newStatus}`, confirmButtonText: 'Oke' });
          loadPenugasanData();
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'Gagal mengubah status', confirmButtonText: 'Tutup' });
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      nama_penugasan: '',
      maps_link: '',
      alamat: '',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      tanggal_selesai: new Date().toISOString().split('T')[0],
      jam_masuk: '08:00:00',
      jam_pulang: '17:00:00',
      batas_terlambat: '08:15:00',
      toleransi_keterlambatan: '00:15:00',
      radius: 100,
      tipe_assign: 'individu',
      selected_users: [],
      selected_wilayah: []
    });
    setSearchPekerja("");
    setIsEdit(false);
    setSelectedPenugasan(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ status: '', start_date: '', end_date: '', page: 1, limit: 20 });
    setSearch("");
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      aktif: { color: 'green', text: 'Aktif' },
      selesai: { color: 'blue', text: 'Selesai' },
      dibatalkan: { color: 'red', text: 'Dibatalkan' }
    };
    const s = statusMap[status] || { color: 'gray', text: status };
    return <span className={`bg-${s.color}-100 text-${s.color}-800 px-2 py-1 rounded-full text-xs font-medium`}>{s.text}</span>;
  };

  if (loading && activeTab === 'data') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009688]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans bg-gray-100 text-black">
      {/* Sidebar */}
      <aside className={`fixed z-40 top-0 left-0 h-full bg-[#f3f3f3] border-r flex flex-col shadow transition-all duration-300 ease-in-out ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} md:translate-x-0 md:static md:z-auto`}>
        <div className="h-14 flex items-center justify-center px-4 border-b bg-white">
          <h1 className="font-bold text-lg"><span className="text-black">SIK</span><span className="text-green-600">OPNAS</span> <span className="text-xs text-gray-500">v1.0</span></h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="text-sm text-gray-800 space-y-1">
            {sidebarMenu.map((item, index) => (
              <SidebarItem key={index} title={item.title} icon={item.icon} submenu={item.submenu} path={item.path} onClick={item.onClick} active={pathname === item.path} />
            ))}
          </ul>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out md:ml-0 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Header */}
        <header className={`bg-[#009688] text-white flex items-center justify-between h-14 px-4 shadow fixed top-0 transition-all duration-300 ease-in-out w-full z-20 md:relative md:top-auto md:z-auto`}>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md hover:bg-[#00796b] transition-transform duration-300 md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-medium">Admin - Manajemen Penugasan Kerja</h2>
          </div>
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#00796b] transition">
              <img src="/images/profile.jpg" alt="Foto Profil" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-2xl border border-gray-200 z-50">
                <div className="flex flex-col items-center p-4 border-b border-gray-100">
                  <img src="/images/profile.jpg" alt="Foto Profil" className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover" />
                  <p className="mt-2 font-semibold text-gray-800">Admin</p>
                  <p className="text-sm text-gray-500">admin@sikopnas.com</p>
                </div>
                <ul className="py-2">
                  <li><button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><Eye className="w-4 h-4 mr-2" /> Lihat Profilku</button></li>
                  <li><button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><Lock className="w-4 h-4 mr-2" /> Ubah Password</button></li>
                  <li><button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"><LogOut className="w-4 h-4 mr-2" /> Logout</button></li>
                </ul>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 bg-white p-3 md:p-6 overflow-y-auto md:mt-0 mt-14">
          <div className="bg-white border rounded-xl shadow p-4 md:p-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button onClick={() => setActiveTab('data')} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === 'data' ? 'border-[#009688] text-[#009688]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <List size={16} className="inline mr-2" />
                Data Penugasan
              </button>
              <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 font-medium text-sm border-b-2 transition ${activeTab === 'stats' ? 'border-[#009688] text-[#009688]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <BarChart3 size={16} className="inline mr-2" />
                Statistik
              </button>
            </div>

            {/* Data Penugasan */}
            {activeTab === 'data' && (
              <div>
                {/* Filter Section */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Filter Data</h3>
                    <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"><X size={14} /> Hapus Filter</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]">
                        <option value="">Semua Status</option>
                        <option value="aktif">Aktif</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                      <input type="date" value={filters.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                      <input type="date" value={filters.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" />
                    </div>
                    <div className="flex items-end">
                      <button onClick={loadPenugasanData} className="bg-[#009688] text-white px-4 py-2 rounded-lg flex items-center gap-2"><RefreshCw size={16} /> Refresh</button>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input type="text" placeholder="Cari berdasarkan nama penugasan..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => { resetForm(); setShowFormModal(true); }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
                      <Plus size={18} /> Tambah Penugasan
                    </button>
                  </div>
                </div>

                {/* Table Penugasan */}
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-[#009688] text-white">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">Kode</th>
                        <th className="p-3 text-left text-sm font-medium">Nama Penugasan</th>
                        <th className="p-3 text-left text-sm font-medium">Lokasi</th>
                        <th className="p-3 text-left text-sm font-medium">Periode</th>
                        <th className="p-3 text-left text-sm font-medium">Jam Kerja</th>
                        <th className="p-3 text-left text-sm font-medium">Pekerja</th>
                        <th className="p-3 text-left text-sm font-medium">Status</th>
                        <th className="p-3 text-center text-sm font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {penugasanList.filter(p => p.nama_penugasan?.toLowerCase().includes(search.toLowerCase())).map((penugasan) => (
                        <tr key={penugasan.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                          <td className="p-3"><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{penugasan.kode_penugasan}</span></td>
                          <td className="p-3 font-medium text-gray-800">{penugasan.nama_penugasan}</td>
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPinIcon size={12} className="text-gray-400" />
                              <span className="truncate max-w-[150px]" title={penugasan.alamat}>{penugasan.alamat || '-'}</span>
                            </div>
                          </td>
                          <td className="p-3 text-gray-700">
                            <div>{new Date(penugasan.tanggal_mulai).toLocaleDateString('id-ID')}</div>
                            <div className="text-xs text-gray-500">s.d {new Date(penugasan.tanggal_selesai).toLocaleDateString('id-ID')}</div>
                          </td>
                          <td className="p-3 text-gray-700">
                            <div>{penugasan.jam_masuk?.substring(0,5)} - {penugasan.jam_pulang?.substring(0,5)}</div>
                            <div className="text-xs text-gray-500">Radius: {penugasan.radius}m</div>
                          </td>
                          <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{penugasan.total_pekerja || 0} pekerja</span></td>
                          <td className="p-3">{getStatusBadge(penugasan.status)}</td>
                          <td className="p-3">
                            <div className="flex gap-2 justify-center flex-wrap">
                              <button onClick={() => loadMonitoring(penugasan.id, new Date().toISOString().split('T')[0])} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition" title="Monitoring"><Activity size={14} /></button>
                              <button onClick={() => handleViewDetail(penugasan.id)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition" title="Detail"><Eye size={14} /></button>
                              <button onClick={() => handleEdit(penugasan)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition" title="Edit"><Edit size={14} /></button>
                              <button onClick={() => handleUpdateStatus(penugasan.id, penugasan.status)} className={`${penugasan.status === 'aktif' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2 rounded transition`} title={penugasan.status === 'aktif' ? 'Selesaikan' : 'Aktifkan'}>
                                {penugasan.status === 'aktif' ? <Check size={14} /> : <Play size={14} />}
                              </button>
                              <button onClick={() => handleDelete(penugasan.id, penugasan.nama_penugasan)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition" title="Hapus"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {penugasanList.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-500">
                    <Target size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Belum ada data penugasan</p>
                  </div>
                )}
              </div>
            )}

            {/* Statistik */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-blue-600 text-sm font-medium">Total Penugasan</p><p className="text-2xl font-bold text-blue-800">{penugasanList.length}</p></div>
                      <Target className="text-blue-500" size={32} />
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-green-600 text-sm font-medium">Aktif</p><p className="text-2xl font-bold text-green-800">{penugasanList.filter(p => p.status === 'aktif').length}</p></div>
                      <Play className="text-green-500" size={32} />
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-blue-600 text-sm font-medium">Selesai</p><p className="text-2xl font-bold text-blue-800">{penugasanList.filter(p => p.status === 'selesai').length}</p></div>
                      <Check className="text-blue-500" size={32} />
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-orange-600 text-sm font-medium">Total Pekerja</p><p className="text-2xl font-bold text-orange-800">{penugasanList.reduce((sum, p) => sum + (p.total_pekerja || 0), 0)}</p></div>
                      <Users className="text-orange-500" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Modal Form Penugasan - Dengan Fitur Pencarian Pekerja */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#009688]">{isEdit ? 'Edit Penugasan' : 'Tambah Penugasan'}</h2>
                <button onClick={() => { setShowFormModal(false); resetForm(); }} className="text-gray-500 hover:text-black"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informasi Dasar Penugasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Penugasan <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.nama_penugasan} onChange={(e) => setFormData({...formData, nama_penugasan: e.target.value})} placeholder="Contoh: Proyek Jalan Cermee" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Google Maps <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.maps_link} onChange={(e) => setFormData({...formData, maps_link: e.target.value})} placeholder="https://maps.app.goo.gl/..." className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" required />
                    <p className="text-xs text-gray-500 mt-1">Salin link lokasi dari Google Maps (share location via WhatsApp)</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                    <textarea value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} rows={2} placeholder="Alamat lengkap lokasi penugasan" className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"></textarea>
                  </div>
                </div>

                {/* Periode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<input 
  type="date" 
  value={formData.tanggal_mulai} 
  onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})} 
  className="w-full border border-gray-300 p-3 rounded-lg" 
  required 
/>                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label><input type="date" value={formData.tanggal_selesai} onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg" required /></div>
                </div>

                {/* Jam Kerja */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Jam Masuk</label><input type="time" value={formData.jam_masuk} onChange={(e) => setFormData({...formData, jam_masuk: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Jam Pulang</label><input type="time" value={formData.jam_pulang} onChange={(e) => setFormData({...formData, jam_pulang: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Radius (meter)</label><input type="number" value={formData.radius} onChange={(e) => setFormData({...formData, radius: parseInt(e.target.value)})} className="w-full border border-gray-300 p-3 rounded-lg" /></div>
                </div>

                {/* Tipe Assign dan Pemilihan Pekerja */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Assign</label>
                    <select 
                      value={formData.tipe_assign} 
                      onChange={(e) => setFormData({
                        ...formData, 
                        tipe_assign: e.target.value, 
                        selected_users: [], 
                        selected_wilayah: [],
                        searchPekerja: ''
                      })} 
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
                    >
                      <option value="individu">Individu (Pilih pekerja secara manual)</option>
                      <option value="per_wilayah">Per Wilayah (Pilih berdasarkan wilayah)</option>
                      <option value="semua">Semua Pegawai</option>
                    </select>
                  </div>

                  {/* Pilih Pekerja (untuk tipe individu) */}
                  {formData.tipe_assign === 'individu' && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-medium text-gray-700">Daftar Pekerja</label>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={handleSelectAllUsers}
                            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition"
                          >
                            {formData.selected_users.length === filteredUsersList.length && filteredUsersList.length > 0 ? 'Batal Pilih Semua' : 'Pilih Semua'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Search Input */}
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Cari pekerja berdasarkan nama, jabatan, atau wilayah..."
                          value={searchPekerja}
                          onChange={(e) => setSearchPekerja(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] text-sm"
                        />
                      </div>
                      
                      {/* Selected Count Info */}
                      <div className="mb-3 text-sm">
                        <span className={`px-2 py-1 rounded-full ${formData.selected_users.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {formData.selected_users.length} pekerja dipilih
                        </span>
                      </div>
                      
                      {/* List Pekerja */}
                      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                        {filteredUsersList.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            {searchPekerja ? 'Tidak ada pekerja yang sesuai dengan pencarian' : 'Belum ada data pekerja'}
                          </div>
                        ) : (
                          filteredUsersList.map((user) => (
                            <div 
                              key={user.id}
                              onClick={() => toggleUserSelection(user.id)}
                              className={`flex items-center justify-between p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                                formData.selected_users.includes(user.id) ? 'bg-green-50' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                  formData.selected_users.includes(user.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                                }`}>
                                  {formData.selected_users.includes(user.id) && <Check size={12} className="text-white" />}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-800">{user.nama}</p>
                                  <p className="text-xs text-gray-500">{user.jabatan} • {user.wilayah_penugasan || 'Tidak ada wilayah'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`text-xs px-2 py-1 rounded-full ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                  {user.is_active ? 'Aktif' : 'Nonaktif'}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-2">* Klik pada baris pekerja untuk memilih/membatalkan</p>
                    </div>
                  )}

                  {/* Pilih Wilayah (untuk tipe per_wilayah) */}
                  {formData.tipe_assign === 'per_wilayah' && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Wilayah</label>
                      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                        {wilayahList.map(wilayah => (
                          <div 
                            key={wilayah.id}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                selected_wilayah: prev.selected_wilayah.includes(wilayah.nama_wilayah)
                                  ? prev.selected_wilayah.filter(w => w !== wilayah.nama_wilayah)
                                  : [...prev.selected_wilayah, wilayah.nama_wilayah]
                              }))
                            }}
                            className={`flex items-center gap-3 p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                              formData.selected_wilayah.includes(wilayah.nama_wilayah) ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              formData.selected_wilayah.includes(wilayah.nama_wilayah) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                              {formData.selected_wilayah.includes(wilayah.nama_wilayah) && <Check size={12} className="text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{wilayah.nama_wilayah}</p>
                              <p className="text-xs text-gray-500">
                                Koordinat: {wilayah.latitude}, {wilayah.longitude}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">* Semua pegawai dengan wilayah terpilih akan diassign</p>
                    </div>
                  )}

                  {/* Info untuk tipe semua */}
                  {formData.tipe_assign === 'semua' && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Info size={18} className="text-blue-500" />
                        <p className="text-sm text-blue-700">Semua pegawai aktif akan diassign ke penugasan ini</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                  <button type="button" onClick={() => { setShowFormModal(false); resetForm(); }} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
                  <button type="submit" className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2"><Save size={18} /> {isEdit ? 'Update' : 'Simpan'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detail Penugasan */}
        {showDetailModal && selectedPenugasan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-[#009688]">Detail Penugasan</h2><button onClick={() => setShowDetailModal(false)} className="text-gray-500 hover:text-black"><X size={24} /></button></div>
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Informasi Umum</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-gray-600">Kode Penugasan</label><p className="font-medium font-mono">{selectedPenugasan.kode_penugasan}</p></div>
                    <div><label className="text-sm text-gray-600">Nama Penugasan</label><p className="font-medium">{selectedPenugasan.nama_penugasan}</p></div>
                    <div><label className="text-sm text-gray-600">Status</label><p>{getStatusBadge(selectedPenugasan.status)}</p></div>
                    <div><label className="text-sm text-gray-600">Dibuat Oleh</label><p className="font-medium">{selectedPenugasan.created_by_name || '-'}</p></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Lokasi & Koordinat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-gray-600">Alamat</label><p className="font-medium">{selectedPenugasan.alamat || '-'}</p></div>
                    <div><label className="text-sm text-gray-600">Radius</label><p className="font-medium">{selectedPenugasan.radius} meter</p></div>
                    <div><label className="text-sm text-gray-600">Latitude</label><p className="font-medium font-mono">{selectedPenugasan.latitude}</p></div>
                    <div><label className="text-sm text-gray-600">Longitude</label><p className="font-medium font-mono">{selectedPenugasan.longitude}</p></div>
                    <div className="md:col-span-2"><label className="text-sm text-gray-600">Link Maps</label><a href={selectedPenugasan.maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{selectedPenugasan.maps_link}</a></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">Periode & Jam Kerja</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-sm text-gray-600">Tanggal Mulai</label><p className="font-medium">{new Date(selectedPenugasan.tanggal_mulai).toLocaleDateString('id-ID')}</p></div>
                    <div><label className="text-sm text-gray-600">Tanggal Selesai</label><p className="font-medium">{new Date(selectedPenugasan.tanggal_selesai).toLocaleDateString('id-ID')}</p></div>
                    <div><label className="text-sm text-gray-600">Jam Masuk</label><p className="font-medium">{selectedPenugasan.jam_masuk?.substring(0,5)} WIB</p></div>
                    <div><label className="text-sm text-gray-600">Jam Pulang</label><p className="font-medium">{selectedPenugasan.jam_pulang?.substring(0,5)} WIB</p></div>
                  </div>
                </div>

                {selectedPenugasan.assigned_users && selectedPenugasan.assigned_users.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Users size={16} /> Pekerja yang Ditugaskan ({selectedPenugasan.assigned_users.length})</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedPenugasan.assigned_users.map((user, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div><p className="font-medium">{user.nama}</p><p className="text-xs text-gray-500">{user.jabatan} - {user.wilayah_penugasan}</p></div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{user.tipe_assign}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button onClick={() => setShowDetailModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Tutup</button>
                <button onClick={() => { setShowDetailModal(false); handleEdit(selectedPenugasan); }} className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2"><Edit size={16} /> Edit</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Monitoring */}
        {showMonitoringModal && monitoringData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#009688]">Monitoring Penugasan</h2>
                <button onClick={() => setShowMonitoringModal(false)} className="text-gray-500 hover:text-black"><X size={24} /></button>
              </div>

              {/* Alert */}
              {monitoringData.alert && (
                <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex items-center">
                    <AlertTriangle className="text-yellow-400 mr-3" size={20} />
                    <div><p className="font-medium text-yellow-800">{monitoringData.alert.title}</p></div>
                  </div>
                  {monitoringData.alert.by_wilayah && (
                    <div className="mt-3 space-y-2">
                      {monitoringData.alert.by_wilayah.map((wil, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border">
                          <p className="font-medium text-gray-800">{wil.wilayah} ({wil.jumlah} pekerja)</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {wil.workers.map((w, i) => (<span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded">{w.no}. {w.nama}</span>))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-blue-600">{monitoringData.stats?.total_pekerja || 0}</p><p className="text-xs text-gray-600">Total Pekerja</p></div>
                <div className="bg-green-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-green-600">{monitoringData.stats?.total_hadir || 0}</p><p className="text-xs text-gray-600">Hadir</p></div>
                <div className="bg-red-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-red-600">{monitoringData.stats?.total_belum_presensi || 0}</p><p className="text-xs text-gray-600">Belum Presensi</p></div>
                <div className="bg-purple-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-purple-600">{monitoringData.stats?.total_izin || 0}</p><p className="text-xs text-gray-600">Izin</p></div>
                <div className="bg-orange-50 p-3 rounded-lg text-center"><p className="text-2xl font-bold text-orange-600">{monitoringData.stats?.total_lokasi_valid || 0}</p><p className="text-xs text-gray-600">Lokasi Valid</p></div>
              </div>

              {/* Monitoring Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr><th className="p-3 text-left">Pegawai</th><th className="p-3 text-left">Wilayah</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Jam Masuk</th><th className="p-3 text-left">Jam Pulang</th><th className="p-3 text-left">Lokasi</th></tr>
                  </thead>
                  <tbody>
                    {monitoringData.monitoring?.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3"><div className="font-medium">{item.nama}</div><div className="text-xs text-gray-500">{item.jabatan}</div></td>
                        <td className="p-3">{item.wilayah_penugasan || '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status_presensi === 'Hadir' || item.status_presensi === 'Hadir & Pulang' ? 'bg-green-100 text-green-800' : item.status_presensi === 'Izin' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'}`}>
                            {item.status_presensi}
                          </span>
                        </td>
                        <td className="p-3">{item.jam_masuk?.substring(0,5) || '-'}</td>
                        <td className="p-3">{item.jam_pulang?.substring(0,5) || '-'}</td>
                        <td className="p-3">{item.lokasi_valid === true ? <span className="text-green-600">✓ Valid</span> : item.lokasi_valid === false ? <span className="text-red-600">✗ Tidak Valid</span> : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <button onClick={() => setShowMonitoringModal(false)} className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b]">Tutup</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}