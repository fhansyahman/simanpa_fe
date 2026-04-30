"use client";

import { Users, Briefcase, Shield, UserCheck, Clock, Settings } from "lucide-react";

export function TableHeader({ isAllSelected, onToggleSelectAll }) {
  const headers = [
    { icon: <Users size={14} />, label: "Pegawai" },
    { icon: <Briefcase size={14} />, label: "Jabatan & Wilayah" },
    { icon: <Shield size={14} />, label: "Status" },
    { icon: <UserCheck size={14} />, label: "Aktivasi" },
    { icon: <Clock size={14} />, label: "Bergabung" },
    { icon: <Settings size={14} />, label: "Aksi" },
  ];

  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>

        {headers.map((header, index) => (
          <th key={index} className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">{header.icon}</span>
              <span>{header.label}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}