'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Home, Users, Clock, Settings, ClipboardList, FileBarChart, Activity, List, Map, Check, UserCheck, BarChart3, TrendingUp, MapPin, Target, LogOut, Lock, Eye, Calendar, Briefcase, FileText, Award } from 'lucide-react';

const SidebarItem = ({ title, icon, submenu, path, onClick, isActive: propIsActive }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  // Cek apakah menu aktif
  const isActive = propIsActive !== undefined ? propIsActive : (path && pathname === path);
  
  // Cek apakah salah satu submenu aktif
  const isSubmenuActive = submenu?.some(item => item.path && pathname === item.path);
  
  // Jika ada submenu yang aktif, buka dropdown
  if (isSubmenuActive && !open) {
    setTimeout(() => setOpen(true), 0);
  }

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

  const handleSubmenuClick = (item) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <li className="text-gray-800">
      {/* Main Menu Item */}
      {path && !submenu ? (
        <Link 
          href={path} 
          onClick={handleMainClick}
          className={`block transition-colors duration-200 ${
            isActive ? 'bg-[#009688] text-white' : 'hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer">
            <div className="flex items-center gap-3">
              {icon && <span className={isActive ? 'text-white' : 'text-gray-600'}>{icon}</span>}
              <span className="text-sm md:text-base">{title}</span>
            </div>
            {submenu && (
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                } ${isActive ? 'text-white' : 'text-gray-600'}`}
              />
            )}
          </div>
        </Link>
      ) : (
        <div 
          onClick={handleMainClick}
          className={`flex items-center justify-between px-4 md:px-5 py-2.5 cursor-pointer transition-colors duration-200 ${
            isActive ? 'bg-[#009688] text-white' : 'hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {icon && <span className={isActive ? 'text-white' : 'text-gray-600'}>{icon}</span>}
            <span className="text-sm md:text-base">{title}</span>
          </div>
          {submenu && (
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              } ${isActive ? 'text-white' : 'text-gray-600'}`}
            />
          )}
        </div>
      )}

      {/* Submenu Items */}
      {submenu && open && (
        <ul className="ml-6 md:ml-8 mt-1 border-l border-gray-300 space-y-1">
          {submenu.map((item, index) => {
            const isSubActive = item.path && pathname === item.path;
            
            return (
              <li key={index}>
                {item.path ? (
                  <Link
                    href={item.path}
                    onClick={() => handleSubmenuClick(item)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 cursor-pointer text-xs md:text-sm rounded-r-lg transition-colors duration-200 ${
                      isSubActive 
                        ? 'bg-[#009688] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && <span className={isSubActive ? 'text-white' : 'text-gray-500'}>{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                ) : (
                  <div
                    onClick={() => handleSubmenuClick(item)}
                    className={`flex items-center gap-2 px-3 md:px-4 py-2 cursor-pointer text-xs md:text-sm rounded-r-lg transition-colors duration-200 ${
                      isSubActive 
                        ? 'bg-[#009688] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon && <span className={isSubActive ? 'text-white' : 'text-gray-500'}>{item.icon}</span>}
                    <span>{item.name}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

// Data menu sidebar yang sudah diurutkan ulang dan ditambah Rekap Kerja
export const sidebarMenuData = [
  { 
    title: "Dashboard", 
    icon: <Home size={18} />, 
    path: "/admin/dashboard",
  },
  {
    title: "Data Pekerja",
    icon: <Users size={18} />,
    submenu: [
      { 
        name: "Data Pekerja", 
        icon: <Users size={14} />, 
        path: "/admin/datapekerja",
      },
      { 
        name: "Status Kontrak", 
        icon: <UserCheck size={14} />, 
        path: "/admin/statuspekerja",
      },
      { 
        name: "Pembagian Wilayah", 
        icon: <Map size={14} />,
        path: "/admin/pembagianwilayah",
      },
    ],
  },
  {
    title: "Kehadiran",
    icon: <Clock size={18} />,
    submenu: [
      { 
        name: "Rekap Kehadiran", 
        icon: <FileBarChart size={14} />, 
        path: "/admin/rekappresensi",
      },
      { 
        name: "Presensi Hari Ini", 
        icon: <List size={14} />, 
        path: "/admin/presensi",
      },
      { 
        name: "Atur Waktu Kerja", 
        icon: <Settings size={14} />, 
        path: "/admin/aturwaktu",
      },
      { 
        name: "Pemutihan", 
        icon: <Check size={14} />, 
        path: "/admin/pemutihan",
      },
    ],
  },
  {
    title: "Kinerja",
    icon: <Activity size={18} />,
    submenu: [
      { 
        name: "Kinerja Harian", 
        icon: <ClipboardList size={14} />, 
        path: "/admin/kinerjaharian",
      },
      { 
        name: "Rekap Hasil Kerja", 
        icon: <Award size={14} />, 
        path: "/admin/rekapkerja",
      },
      { 
        name: "Statistik Kinerja", 
        icon: <BarChart3 size={14} />,
        path: "/admin/statistikkinerja",
      },
    ],
  },
  {
    title: "Kalender Kerja",
    icon: <Calendar size={18} />,
    submenu: [
      { 
        name: "Hari Kerja & Libur", 
        icon: <Calendar size={14} />,
        path: "/admin/kalender",
      },
      { 
        name: "Izin & Cuti", 
        icon: <Briefcase size={14} />,
        submenu: [
          { 
            name: "Persetujuan Izin", 
            icon: <Check size={12} />,
            path: "/admin/izin",
          },
          { 
            name: "Riwayat Izin", 
            icon: <Clock size={12} />,
            path: "/admin/riwayatizin",
          },
        ],
      },
    ],
  },
  {
    title: "Laporan",
    icon: <FileText size={18} />,
    submenu: [
      { 
        name: "Laporan Kehadiran", 
        icon: <Activity size={14} />, 
        path: "/admin/laporankehadiran",
      },
      { 
        name: "Laporan Kinerja", 
        icon: <FileBarChart size={14} />, 
        path: "/admin/laporankinerja",
      },
      { 
        name: "Laporan Aktivitas", 
        icon: <Activity size={14} />, 
        path: "/admin/laporanaktivitas",
      },
    ],
  },
  { 
    title: "Pengaturan", 
    icon: <Settings size={18} />, 
    path: "/admin/pengaturan",
  },
];

// Menu untuk user biasa (pegawai)
export const userMenuData = [
  { 
    title: "Dashboard", 
    icon: <Home size={18} />, 
    path: "/dashboard",
  },
  { 
    title: "Presensi", 
    icon: <Clock size={18} />, 
    path: "/presensi",
  },
  { 
    title: "Riwayat Presensi", 
    icon: <List size={18} />, 
    path: "/riwayat-presensi",
  },
  { 
    title: "Rekap Hasil Kerja", 
    icon: <Award size={18} />, 
    path: "/rekapkerja",
  },
  { 
    title: "Izin & Cuti", 
    icon: <ClipboardList size={18} />, 
    path: "/izin",
  },
  { 
    title: "Pengaturan", 
    icon: <Settings size={18} />, 
    path: "/pengaturan",
  },
];

// Menu untuk atasan
export const atasanMenuData = [
  { 
    title: "Dashboard", 
    icon: <Home size={18} />, 
    path: "/atasan/dashboard",
  },
  { 
    title: "Monitoring Presensi", 
    icon: <Activity size={18} />, 
    path: "/atasan/monitoring-presensi",
  },
  { 
    title: "Rekap Hasil Kerja", 
    icon: <Award size={18} />, 
    path: "/atasan/rekapkerja",
  },
  { 
    title: "Laporan", 
    icon: <FileBarChart size={18} />, 
    submenu: [
      { name: "Laporan Kehadiran", path: "/atasan/laporan-kehadiran" },
      { name: "Laporan Kinerja", path: "/atasan/laporan-kinerja" },
    ],
  },
  { 
    title: "Pengaturan", 
    icon: <Settings size={18} />, 
    path: "/atasan/pengaturan",
  },
];

export default SidebarItem;