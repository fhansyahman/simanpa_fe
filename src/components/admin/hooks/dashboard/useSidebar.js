// sidebar-menu.js (atau di dalam hook useSidebar)

import { act, useState } from "react";
import { 
  Home, Users, Clock, Clipboard, CalendarDays,
  FileText, FileBarChart2, CheckSquare, MapPin,
  ClipboardCheck, ClipboardX, TrendingUp,
  Briefcase, Calendar, Award, Target
} from "lucide-react";

export function useSidebar(setActiveTab) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: <Home size={20} />,
      href: "/admin/dashboard",
      active: true,
    },
    {
      title: "Manajemen Pekerja",
      icon: <Users size={20} />,
      submenu: [
        { name: "Data Pekerja", icon: <Users size={14} />, href: "/admin/datapekerja" },
        { name: "Status Kontrak", icon: <CheckSquare size={14} />, href: "/admin/statuskontrak" },
        { name: "Pembagian Wilayah", icon: <MapPin size={14} />, href: "/admin/pembagianwilayah" },
        { name: "Atur Waktu Kerja", icon: <Clock size={14} />, href: "/admin/waktukerja" },
      ],
    },
    {
      title: "Manajemen Kehadiran",
      icon: <Clock size={20} />,
      submenu: [
        { name: "Riwayat Kehadiran", icon: <FileText size={14} />, href: "/admin/presensihariini" },
        { name: "Rekap Kehadiran", icon: <ClipboardCheck size={14} />, href: "/admin/laporankehadiran" },
      ],
    },
    {
      title: "Manajemen Hasil Kerja",  // ← NAMA GRUP BARU (ganti dari "Kinerja")
      icon: <Award size={20} />,  // Icon award/target lebih menggambarkan hasil
      submenu: [
        { name: "Riwayat Hasil Kerja", icon: <Clipboard size={14} />, href: "/admin/datakinerja" },
        { name: "Rekap Hasil Kerja", icon: <Briefcase size={14} />, href: "/admin/rekapkerja" }, // ← route /admin/rekapkerja
        { name: "Laporan Hasil Kerja", icon: <ClipboardX size={14} />, href: "/admin/laporankinerja" },

      ],
    },
    {
      title: "Kalender Kerja",
      icon: <CalendarDays size={20} />,
      href: "/admin/harikerjadanlibur",
    },
    {
      title: "Izin & Cuti",
      icon: <FileText size={20} />,
      href: "/admin/izinataucuti"
    }, 
  ];

  return { sidebarOpen, setSidebarOpen, sidebarMenu };
}