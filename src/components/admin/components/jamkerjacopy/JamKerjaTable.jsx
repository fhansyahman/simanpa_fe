"use client";

import { Clock, MapPin, Calendar, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

export function JamKerjaTable({ 
  paginatedJamKerja, 
  filteredJamKerja, 
  onViewDetail, 
  onEdit, 
  onDelete,
  onUpdateStatus,
  formatTime, 
  calculateTotalHours,
  isPenugasan 
}) {
  if (filteredJamKerja.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada data</h3>
        <p className="text-gray-500">Belum ada data jam kerja atau penugasan</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Kerja</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedJamKerja.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {/* Nama */}
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{item.nama_setting}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {isPenugasan(item) ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                          {item.kode_penugasan}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          Setting Default
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Jam Kerja */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {formatTime(item.jam_masuk_standar)} - {formatTime(item.jam_pulang_standar)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Total: {calculateTotalHours(item.jam_masuk_standar, item.jam_pulang_standar)}
                  </div>
                </td>

                {/* Lokasi (khusus penugasan) */}
                <td className="px-6 py-4">
                  {isPenugasan(item) && item.latitude ? (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Radius: {item.radius || 100}m
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {isPenugasan(item) ? (
                    <PenugasanStatusBadge status={item.status} />
                  ) : (
                    <DefaultStatusBadge isActive={item.is_active} />
                  )}
                </td>

                {/* Periode */}
                <td className="px-6 py-4">
                  {isPenugasan(item) && item.tanggal_mulai ? (
                    <div className="text-sm text-gray-600">
                      <div>{new Date(item.tanggal_mulai).toLocaleDateString('id-ID')}</div>
                      <div className="text-xs text-gray-400">s/d</div>
                      <div>{new Date(item.tanggal_selesai).toLocaleDateString('id-ID')}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewDetail(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Detail"
                    >
                      <Eye size={18} />
                    </button>
                    
                    {!isPenugasan(item) && (
                      <>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}

                    {isPenugasan(item) && item.status === 'aktif' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => onUpdateStatus(item.id, 'selesai')}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Selesai
                        </button>
                        <button
                          onClick={() => onUpdateStatus(item.id, 'dibatalkan')}
                          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DefaultStatusBadge({ isActive }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {isActive ? 'Aktif' : 'Nonaktif'}
    </span>
  );
}

function PenugasanStatusBadge({ status }) {
  const config = {
    aktif: { bg: 'bg-green-100', text: 'text-green-800', label: '🟢 Aktif' },
    selesai: { bg: 'bg-blue-100', text: 'text-blue-800', label: '✅ Selesai' },
    dibatalkan: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Dibatalkan' }
  };
  const { bg, text, label } = config[status] || config.aktif;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}