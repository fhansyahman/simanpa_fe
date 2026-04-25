import { 
  Home, Users, Clock, ClipboardList, CalendarDays, FileBarChart,
  MapPin, FileText, ClipboardCheck, Briefcase, Award, CheckSquare
} from "lucide-react";

export const sidebarMenu = [
  { 
    title: "Dashboard", 
    icon: <Home size={20} />,
    href: "/admin/dashboard"
  },
  {
    title: "Manajemen Pekerja",
    icon: <Users size={20} />,
    submenu: [
      { 
        name: "Data Pekerja", 
        icon: <Users size={14} />,
        href: "/admin/datapekerja"
      },
      { 
        name: "Status Kontrak", 
        icon: <CheckSquare size={14} />,
        href: "/admin/statuskontrak"
      },
      { 
        name: "Pembagian Wilayah", 
        icon: <MapPin size={14} />,
        href: "/admin/pembagianwilayah"
      },
    ],
  },
  {
    title: "Kehadiran",
    icon: <Clock size={20} />,
    submenu: [
      { 
        name: "Presensi Hari Ini", 
        icon: <FileText size={14} />,
        href: "/admin/presensihariini"
      },
      { 
        name: "Atur Waktu Kerja", 
        icon: <Clock size={14} />,
        href: "/admin/waktukerja"
      },
      { 
        name: "Rekap Kehadiran", 
        icon: <ClipboardCheck size={14} />,
        href: "/admin/rekapkehadiran"
      },
    ],
  },
  {
    title: "Hasil Kerja",
    icon: <Award size={20} />,
    submenu: [
      { 
        name: "Kerja Hari Ini", 
        icon: <ClipboardList size={14} />,
        href: "/admin/datakinerja"
      },
      { 
        name: "Rekap Kerja", 
        icon: <Briefcase size={14} />,
        href: "/admin/rekapkerja"
      },
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
  {
    title: "Laporan",
    icon: <FileBarChart size={20} />,
    submenu: [
      { 
        name: "Laporan Hasil Kerja", 
        icon: <ClipboardCheck size={14} />,
        href: "/admin/laporankinerja"
      },
    ],
  },
];