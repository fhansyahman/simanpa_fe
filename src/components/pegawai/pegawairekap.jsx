// app/pegawai/dashboard-kinerja/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  RefreshCw,
  Users,
  Target,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  MapPin,
  FileText,
  ArrowLeft,
  ChevronDown,
  Clock,
  Award,
  Activity,
  AlertCircle,
  UserCheck,
  UserX,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";
import { pegawaiAPI } from "@/lib/api";

// Warna untuk charts
const COLORS = {
  KR: '#10B981',
  KN: '#3B82F6',
  TARGET: '#F59E0B',
  HADIR: '#10B981',
  TERLAMBAT: '#F59E0B',
  IZIN: '#3B82F6',
  SAKIT: '#8B5CF6',
  CUTI: '#EC4899',
  TANPA_KETERANGAN: '#EF4444'
};

const KEHADIRAN_COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444'];

export default function PegawaiDashboardKinerjaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [periode, setPeriode] = useState({
    bulan: new Date().getMonth() + 1,
    tahun: new Date().getFullYear()
  });
  const [showFilter, setShowFilter] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    profil_pegawai: {
      nama: "",
      jabatan: "",
      wilayah: ""
    },
    periode_info: {
      nama_bulan: "",
      tahun: 0,
      total_hari_kerja: 0,
      hari_kerja_berlalu: 0
    },
    ringkasan_kinerja: {
      total_hari_lapor: 0,
      total_kr: 0,
      total_kn: 0,
      total_panjang: 0,
      target_kr_bulanan: 0,
      target_kn_bulanan: 0,
      pencapaian_kr: 0,
      pencapaian_kn: 0,
      pencapaian_total: 0,
      rata_harian_kr: 0,
      rata_harian_kn: 0,
      status: "",
      warna_status: ""
    },
    ringkasan_kehadiran: {
      total_hadir: 0,
      total_hadir_tepat_waktu: 0,
      total_terlambat: 0,
      total_izin: 0,
      total_sakit: 0,
      total_cuti: 0,
      total_tanpa_keterangan: 0,
      persen_kehadiran: 0,
      status: "",
      warna_status: ""
    },
    grafik_performa_harian: [],
    grafik_kehadiran: [],
    target_vs_realisasi: {
      kr: { realisasi: 0, target: 0, persen: 0 },
      kn: { realisasi: 0, target: 0, persen: 0 },
      total: { realisasi: 0, target: 0, persen: 0 }
    },
    detail_laporan_harian: [],
    detail_kehadiran_harian: [],
    rekomendasi: []
  });
  const [activeTab, setActiveTab] = useState("kinerja");
  const [grafikType, setGrafikType] = useState("bar");

  const bulanNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [periode]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pegawaiAPI.getDashboardKinerja({
        bulan: periode.bulan,
        tahun: periode.tahun
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data dashboard');
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError(error.response?.data?.message || error.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
  };

  const StatusBadge = ({ status, value, type = "kinerja" }) => {
    let colorClass = "bg-gray-100 text-gray-600";
    
    if (type === "kinerja") {
      if (value >= 100 || status === "Excellent! ") colorClass = "bg-green-100 text-green-700";
      else if (value >= 80 || status === "Baik ") colorClass = "bg-blue-100 text-blue-700";
      else if (value >= 60 || status === "Cukup ") colorClass = "bg-yellow-100 text-yellow-700";
      else colorClass = "bg-orange-100 text-orange-700";
    } else if (type === "kehadiran") {
      if (status === "Sangat Baik" || value >= 90) colorClass = "bg-green-100 text-green-700";
      else if (status === "Baik" || value >= 75) colorClass = "bg-blue-100 text-blue-700";
      else if (status === "Cukup" || value >= 60) colorClass = "bg-yellow-100 text-yellow-700";
      else colorClass = "bg-red-100 text-red-700";
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  const ProgressBar = ({ value, target, label, color = "blue" }) => {
    const percentage = target > 0 ? Math.min(100, Math.max(0, (value / target) * 100)) : 0;
    const colorClass = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      red: "bg-red-500",
      pink: "bg-pink-500"
    }[color];
    
    return (
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">{label}</span>
          <span className="font-medium text-gray-700">{formatNumber(value)} / {formatNumber(target)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`${colorClass} h-2 rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% tercapai</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-6 shadow-lg max-w-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Gagal Memuat Data</h2>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="w-full  bg-gradient-to-b from-slate-700 to-slate-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/pegawai/dashboard')}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Rekap Pegawai</h1>
                <p className="text-slate-300 mt-1">Monitoring kinerja pribadi Anda</p>
              </div>
            </div>
            <div className=" rounded-full p-3">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Profil Pegawai Card */}
      <div className="max-w-6xl mx-auto px-6 -mt-4 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{dashboardData.profil_pegawai.nama}</h2>
                  <p className="text-sm text-gray-500">{dashboardData.profil_pegawai.jabatan}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">{dashboardData.profil_pegawai.wilayah}</span>
              </div>
            </div>
            
            {/* Periode Selector */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {dashboardData.periode_info.nama_bulan || bulanNames[periode.bulan - 1]} {dashboardData.periode_info.tahun || periode.tahun}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilter ? "rotate-180" : ""}`} />
              </button>

              {showFilter && (
                <div className="mt-3 bg-white rounded-xl p-4 space-y-3 border border-gray-200 shadow-lg text-black">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                    <select
                      value={periode.bulan}
                      onChange={(e) => setPeriode({ ...periode, bulan: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {bulanNames.map((bulan, idx) => (
                        <option key={idx} value={idx + 1}>{bulan}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                    <select
                      value={periode.tahun}
                      onChange={(e) => setPeriode({ ...periode, tahun: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setShowFilter(false);
                      fetchDashboardData();
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto px-6 pb-12">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("kinerja")}
              className={`flex items-center justify-center space-x-2 flex-1 py-4 font-medium text-sm transition-colors ${
                activeTab === "kinerja"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Kinerja</span>
            </button>
            <button
              onClick={() => setActiveTab("kehadiran")}
              className={`flex items-center justify-center space-x-2 flex-1 py-4 font-medium text-sm transition-colors ${
                activeTab === "kehadiran"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Kehadiran</span>
            </button>
          </div>

          {/* TAB KINERJA */}
          {activeTab === "kinerja" && (
            <div className="p-6 space-y-6">
              {/* Status Card */}
              <div className={`rounded-2xl p-5 text-white shadow-lg ${
                dashboardData.ringkasan_kinerja.warna_status === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                dashboardData.ringkasan_kinerja.warna_status === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                dashboardData.ringkasan_kinerja.warna_status === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-orange-500 to-orange-600'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Status Kinerja Bulan Ini</p>
                    <p className="text-2xl font-bold mt-1">{dashboardData.ringkasan_kinerja.status || "Belum Ada Data"}</p>
                  </div>
                  <Award className="w-12 h-12 opacity-80" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs opacity-80">Pencapaian Total</p>
                    <p className="text-xl font-bold">{dashboardData.ringkasan_kinerja.pencapaian_total?.toFixed(1) || 0}%</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Hari Lapor</p>
                    <p className="text-xl font-bold">{dashboardData.ringkasan_kinerja.total_hari_lapor || 0}/{dashboardData.periode_info.total_hari_kerja || 22}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-80">Total Kinerja</p>
                    <p className="text-xl font-bold">{formatNumber(dashboardData.ringkasan_kinerja.total_panjang)}m</p>
                  </div>
                </div>
              </div>

              {/* Statistik Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Total KR</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{formatNumber(dashboardData.ringkasan_kinerja.total_kr)}m</p>
                  <p className="text-xs text-gray-500">Target: {formatNumber(dashboardData.ringkasan_kinerja.target_kr_bulanan)}m</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, dashboardData.ringkasan_kinerja.pencapaian_kr || 0)}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Total KN</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{formatNumber(dashboardData.ringkasan_kinerja.total_kn)}m</p>
                  <p className="text-xs text-gray-500">Target: {formatNumber(dashboardData.ringkasan_kinerja.target_kn_bulanan)}m</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, dashboardData.ringkasan_kinerja.pencapaian_kn || 0)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rata-rata Harian */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
                <div className="flex items-center space-x-2 mb-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Rata-rata Kinerja Harian</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{dashboardData.ringkasan_kinerja.rata_harian_kr?.toFixed(1) || 0}</p>
                    <p className="text-xs text-gray-500">KR (m)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{dashboardData.ringkasan_kinerja.rata_harian_kn?.toFixed(1) || 0}</p>
                    <p className="text-xs text-gray-500">KN (m)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{(dashboardData.ringkasan_kinerja.rata_harian_kr + dashboardData.ringkasan_kinerja.rata_harian_kn || 0).toFixed(1)}</p>
                    <p className="text-xs text-gray-500">Total (m)</p>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-3">Target harian: 50m KR + 50m KN</p>
              </div>

              {/* Grafik Performa Harian */}
              {dashboardData.grafik_performa_harian && dashboardData.grafik_performa_harian.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold text-gray-800">Grafik Performa Harian</h2>
                        <p className="text-xs text-gray-500 mt-1">Perbandingan KR dan KN vs Target</p>
                      </div>
                      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setGrafikType("bar")}
                          className={`p-1.5 rounded ${grafikType === "bar" ? "bg-white shadow" : ""}`}
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setGrafikType("line")}
                          className={`p-1.5 rounded ${grafikType === "line" ? "bg-white shadow" : ""}`}
                        >
                          <LineChart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      {grafikType === "bar" ? (
                        <BarChart data={dashboardData.grafik_performa_harian} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hari_ke" angle={-45} textAnchor="end" height={50} tick={{ fontSize: 10 }} />
                          <YAxis tickFormatter={(value) => `${value}m`} />
                          <Tooltip formatter={(value) => `${value} meter`} />
                          <Legend />
                          <Bar dataKey="kr" name="KR (m)" fill={COLORS.KR} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="kn" name="KN (m)" fill={COLORS.KN} radius={[4, 4, 0, 0]} />
                          <Line type="monotone" dataKey="target" name="Target (m)" stroke={COLORS.TARGET} strokeWidth={2} strokeDasharray="5 5" />
                        </BarChart>
                      ) : (
                        <ReLineChart data={dashboardData.grafik_performa_harian} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hari_ke" angle={-45} textAnchor="end" height={50} tick={{ fontSize: 10 }} />
                          <YAxis tickFormatter={(value) => `${value}m`} />
                          <Tooltip formatter={(value) => `${value} meter`} />
                          <Legend />
                          <Line type="monotone" dataKey="kr" name="KR (m)" stroke={COLORS.KR} strokeWidth={2} />
                          <Line type="monotone" dataKey="kn" name="KN (m)" stroke={COLORS.KN} strokeWidth={2} />
                          <Line type="monotone" dataKey="target" name="Target (m)" stroke={COLORS.TARGET} strokeWidth={2} strokeDasharray="5 5" />
                        </ReLineChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Target vs Realisasi */}
              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-4">Target vs Realisasi</h2>
                <div className="space-y-4">
                  <ProgressBar 
                    value={dashboardData.target_vs_realisasi?.kr?.realisasi || 0}
                    target={dashboardData.target_vs_realisasi?.kr?.target || 1}
                    label="KR (Konstruksi)"
                    color="green"
                  />
                  <ProgressBar 
                    value={dashboardData.target_vs_realisasi?.kn?.realisasi || 0}
                    target={dashboardData.target_vs_realisasi?.kn?.target || 1}
                    label="KN (Pemeliharaan)"
                    color="blue"
                  />
                  <ProgressBar 
                    value={dashboardData.target_vs_realisasi?.total?.realisasi || 0}
                    target={dashboardData.target_vs_realisasi?.total?.target || 1}
                    label="Total Kinerja"
                    color="purple"
                  />
                </div>
              </div>

              {/* Rekomendasi */}
              {dashboardData.rekomendasi && dashboardData.rekomendasi.length > 0 && (
  <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
    <h3 className="font-semibold text-amber-800 mb-3 flex items-center space-x-2">
      <TrendingUp className="w-5 h-5" />
      <span>Rekomendasi Peningkatan</span>
    </h3>
    <div className="space-y-3">
      {dashboardData.rekomendasi.map((rek, idx) => (
        <div key={idx} className="flex items-start space-x-3">
          {/* Icon dihilangkan - komentar atau hapus baris berikut */}
          {/* <span className="text-xl">{rek.icon}</span> */}
          <div className="flex-1">
            <p className="text-sm text-amber-800">{rek.pesan}</p>
            {rek.target && rek.target > 0 && (
              <div className="mt-1">
                <div className="w-full bg-amber-200 rounded-full h-1.5">
                  <div 
                    className="bg-amber-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, ((rek.current || dashboardData.ringkasan_kinerja.pencapaian_total || 0) / rek.target) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-amber-600 mt-0.5">
                  {rek.current || dashboardData.ringkasan_kinerja.pencapaian_total?.toFixed(1) || 0}% / Target: {rek.target}%
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
            </div>
          )}

          {/* TAB KEHADIRAN */}
          {activeTab === "kehadiran" && (
            <div className="p-6 space-y-6 text-black">
              {/* Status Kehadiran Card */}
{/* Status Kehadiran Card */}
<div className={`rounded-2xl p-5 text-white shadow-lg ${
  dashboardData.ringkasan_kehadiran.warna_status === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
  dashboardData.ringkasan_kehadiran.warna_status === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
  dashboardData.ringkasan_kehadiran.warna_status === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
  'bg-gradient-to-r from-orange-500 to-orange-600'  // Sama seperti kinerja, pakai orange
}`}>
  <div className="flex items-center justify-between mb-4">
    <div>
      <p className="text-sm opacity-90">Status Kehadiran Bulan Ini</p>
      <p className="text-2xl font-bold mt-1">{dashboardData.ringkasan_kehadiran.status || "Belum Ada Data"}</p>
    </div>
    <UserCheck className="w-12 h-12 opacity-80" />
  </div>
  <div className="grid grid-cols-3 gap-4">
    <div>
      <p className="text-xs opacity-80">Tingkat Kehadiran</p>
      <p className="text-xl font-bold">{dashboardData.ringkasan_kehadiran.persen_kehadiran || 0}%</p>
    </div>
    <div>
      <p className="text-xs opacity-80">Hadir</p>
      <p className="text-xl font-bold">{dashboardData.ringkasan_kehadiran.total_hadir || 0} hari</p>
    </div>
    <div>
      <p className="text-xs opacity-80">Terlambat</p>
      <p className="text-xl font-bold">{dashboardData.ringkasan_kehadiran.total_terlambat || 0} hari</p>
    </div>
  </div>
</div>
              {/* Statistik Kehadiran Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <UserCheck className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-green-700">{dashboardData.ringkasan_kehadiran.total_hadir || 0}</p>
                  <p className="text-xs text-gray-600">Hadir</p>
                  <p className="text-xs text-green-600 mt-1">{dashboardData.ringkasan_kehadiran.total_hadir_tepat_waktu || 0} tepat waktu</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center">
                  <ClockIcon className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-yellow-700">{dashboardData.ringkasan_kehadiran.total_terlambat || 0}</p>
                  <p className="text-xs text-gray-600">Terlambat</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3 text-center">
                  <CalendarIcon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-blue-700">{dashboardData.ringkasan_kehadiran.total_izin || 0}</p>
                  <p className="text-xs text-gray-600">Izin</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <Activity className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-purple-700">{dashboardData.ringkasan_kehadiran.total_sakit || 0}</p>
                  <p className="text-xs text-gray-600">Sakit</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-pink-700">{dashboardData.ringkasan_kehadiran.total_cuti || 0}</p>
                  <p className="text-xs text-gray-600">Cuti</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <UserX className="w-5 h-5 text-red-600 mx-auto mb-1" />
                  <p className="text-xl font-bold text-red-700">{dashboardData.ringkasan_kehadiran.total_tanpa_keterangan || 0}</p>
                  <p className="text-xs text-gray-600">Tanpa Keterangan</p>
                </div>
              </div>

              {/* Pie Chart Kehadiran */}
              {dashboardData.grafik_kehadiran && dashboardData.grafik_kehadiran.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                  <h2 className="font-semibold text-gray-800 mb-4">Distribusi Kehadiran</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <RePieChart>
                      <Pie
                        data={dashboardData.grafik_kehadiran}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.grafik_kehadiran.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || KEHADIRAN_COLORS[index % KEHADIRAN_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Rekomendasi Kehadiran */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Rekomendasi Kehadiran</span>
                </h3>
                <div className="space-y-3">
                  {(dashboardData.ringkasan_kehadiran.persen_kehadiran || 0) < 80 && (
                    <div className="flex items-start space-x-3">
                      <span className="text-xl"></span>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">Tingkatkan konsistensi kehadiran Anda</p>
                        <div className="mt-2">
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${dashboardData.ringkasan_kehadiran.persen_kehadiran || 0}%` }}
                            />
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            Kehadiran: {dashboardData.ringkasan_kehadiran.persen_kehadiran || 0}% / Target: 80%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {(dashboardData.ringkasan_kehadiran.total_terlambat || 0) > 3 && (
                    <div className="flex items-start space-x-3">
                      <span className="text-xl"></span>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">Usahakan datang tepat waktu untuk menghindari keterlambatan</p>
                        <p className="text-xs text-blue-600 mt-1">Anda telah terlambat {dashboardData.ringkasan_kehadiran.total_terlambat} kali bulan ini</p>
                      </div>
                    </div>
                  )}
                  {(dashboardData.ringkasan_kehadiran.persen_kehadiran || 0) >= 90 && (
                    <div className="flex items-start space-x-3">
                      <span className="text-xl"></span>
                      <div className="flex-1">
                        <p className="text-sm text-blue-800">Pertahankan kedisiplinan kehadiran Anda!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}