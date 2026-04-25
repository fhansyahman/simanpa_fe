import { useState } from "react";
import { 
  Home, Users, Clock, Clipboard, AlertCircle, CalendarDays,
  FileText, FileBarChart2, BarChart3, CheckSquare, MapPin,
  FileSpreadsheet, ClipboardCheck, ClipboardX, TrendingUp,
  Award, Briefcase, ClipboardList
} from "lucide-react";

export function useSidebar(setActiveTab) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarMenu = [
    { 
      title: "Dashboard", 
      icon: <Home size={20} />,
      href: "/atasan/dashboard",
    },
    {
      title: "Kehadiran",
      icon: <Clock size={20} />,
      submenu: [
        { name: "Presensi Hari Ini", icon: <FileText size={14} />, href: "/atasan/presensihariini" },
        { name: "Atur Waktu Kerja", icon: <Clock size={14} />, href: "/atasan/waktukerja" },
        { name: "Rekap Kehadiran", icon: <ClipboardCheck size={14} />, href: "/atasan/laporankehadiran" },
      ],
    },
    {
      title: "Hasil Kerja",
      icon: <Award size={20} />,
      submenu: [
        { name: "Kerja Hari Ini", icon: <ClipboardList size={14} />, href: "/atasan/datakinerja" },
        { name: "Rekap Kerja", icon: <Briefcase size={14} />, href: "/atasan/rekapkerja" },
      ],
    },
    {
      title: "Izin & Cuti",
      icon: <FileText size={20} />,
      href: "/atasan/izinataucuti"
    }, 
    {
      title: "Laporan",
      icon: <FileBarChart2 size={20} />,
      submenu: [
        { name: "Laporan Hasil Kerja", icon: <ClipboardCheck size={14} />, href: "/atasan/laporankinerja" },
      ],
    },
  ];

  return { sidebarOpen, setSidebarOpen, sidebarMenu };
}