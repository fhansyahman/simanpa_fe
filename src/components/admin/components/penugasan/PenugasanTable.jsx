import { Eye, Edit, Trash2, Archive, X, Check, Radio,Briefcase  } from "lucide-react";

const getStatusBadge = (status, is_active) => {
  if (status === 'aktif' && is_active === 1) {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Aktif</span>;
  } else if (status === 'selesai') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Selesai</span>;
  } else if (status === 'dibatalkan') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">Dibatalkan</span>;
  } else {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Nonaktif</span>;
  }
};

const getTipeBadge = (tipe) => {
  if (tipe === 'default') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Default System</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Khusus</span>;
};

export const PenugasanTable = ({ 
  filteredPenugasan, 
  loading,
  onViewMonitoring,
  onEdit,
  onUpdateStatus,
  onSoftDelete,
  onDelete
}) => {
  if (filteredPenugasan.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">
          Belum ada data penugasan
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kode</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Penugasan</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipe</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jam Masuk</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jam Pulang</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal</th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredPenugasan.map((penugasan) => (
            <tr key={penugasan.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-6">
                <p className="font-mono text-xs text-gray-600">{penugasan.kode_penugasan}</p>
              </td>
              <td className="py-4 px-6">
                <p className="font-medium text-gray-900">{penugasan.nama_penugasan}</p>
              </td>
              <td className="py-4 px-6">{getTipeBadge(penugasan.tipe_penugasan)}</td>
              <td className="py-4 px-6 text-gray-700">{penugasan.jam_masuk?.substring(0, 5)}</td>
              <td className="py-4 px-6 text-gray-700">{penugasan.jam_pulang?.substring(0, 5)}</td>
              <td className="py-4 px-6">{getStatusBadge(penugasan.status, penugasan.is_active)}</td>
              <td className="py-4 px-6 text-gray-700 text-xs">
                {penugasan.tipe_penugasan === 'khusus' ? (
                  <>{new Date(penugasan.tanggal_mulai).toLocaleDateString('id-ID')} - {new Date(penugasan.tanggal_selesai).toLocaleDateString('id-ID')}</>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
               </td>
              <td className="py-4 px-6">
                <div className="flex gap-2 justify-center flex-wrap">

                  {penugasan.tipe_penugasan === 'khusus' && penugasan.status === 'aktif' && (
                    <>
                      <button onClick={() => onUpdateStatus(penugasan.id, 'selesai', penugasan.nama_penugasan)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Selesaikan">
                        <Check size={18} />
                      </button>
                      <button onClick={() => onUpdateStatus(penugasan.id, 'dibatalkan', penugasan.nama_penugasan)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Batalkan">
                        <X size={18} />
                      </button>
                    </>
                  )}
                  <button onClick={() => onEdit(penugasan)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(penugasan.id, penugasan.nama_penugasan, penugasan.tipe_penugasan, penugasan.status, penugasan.is_active)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 size={18} />
                  </button>
                </div>
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};