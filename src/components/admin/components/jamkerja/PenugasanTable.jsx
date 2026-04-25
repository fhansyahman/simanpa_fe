import { Radio, Check, X, Edit, Archive, Trash2 } from "lucide-react";

export const PenugasanTable = ({ 
  filteredPenugasan, 
  onViewMonitoring, 
  onUpdateStatus, 
  onEdit, 
  onSoftDelete, 
  onDelete,
  getStatusBadge,
  getTipeBadge
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-[#009688] text-white">
          <tr>
            <th className="p-3 text-left text-sm font-medium">Kode</th>
            <th className="p-3 text-left text-sm font-medium">Nama Penugasan</th>
            <th className="p-3 text-left text-sm font-medium">Tipe</th>
            <th className="p-3 text-left text-sm font-medium">Jam Masuk</th>
            <th className="p-3 text-left text-sm font-medium">Jam Pulang</th>
            <th className="p-3 text-left text-sm font-medium">Status</th>
            <th className="p-3 text-left text-sm font-medium">Tanggal</th>
            <th className="p-3 text-center text-sm font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredPenugasan.map((penugasan) => (
            <tr key={penugasan.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="p-3">
                <p className="font-mono text-xs text-gray-600">{penugasan.kode_penugasan}</p>
              </td>
              <td className="p-3">
                <p className="font-medium text-gray-800">{penugasan.nama_penugasan}</p>
              </td>
              <td className="p-3">{getTipeBadge(penugasan.tipe_penugasan)}</td>
              <td className="p-3 text-gray-700">{penugasan.jam_masuk?.substring(0, 5)}</td>
              <td className="p-3 text-gray-700">{penugasan.jam_pulang?.substring(0, 5)}</td>
              <td className="p-3">{getStatusBadge(penugasan.status, penugasan.is_active)}</td>
              <td className="p-3 text-gray-700 text-xs">
                {penugasan.tipe_penugasan === 'khusus' ? (
                  <>{new Date(penugasan.tanggal_mulai).toLocaleDateString('id-ID')} - {new Date(penugasan.tanggal_selesai).toLocaleDateString('id-ID')}</>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-3">
                <div className="flex gap-2 justify-center flex-wrap">
                  {penugasan.tipe_penugasan === 'khusus' && (
                    <button onClick={() => onViewMonitoring(penugasan)} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition" title="Monitoring">
                      <Radio size={14} />
                    </button>
                  )}
                  {penugasan.tipe_penugasan === 'khusus' && penugasan.status === 'aktif' && (
                    <>
                      <button onClick={() => onUpdateStatus(penugasan.id, 'selesai', penugasan.nama_penugasan)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition" title="Selesaikan">
                        <Check size={14} />
                      </button>
                      <button onClick={() => onUpdateStatus(penugasan.id, 'dibatalkan', penugasan.nama_penugasan)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition" title="Batalkan">
                        <X size={14} />
                      </button>
                    </>
                  )}
                  <button onClick={() => onEdit(penugasan)} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition" title="Edit">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => onSoftDelete(penugasan.id, penugasan.nama_penugasan)} className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded transition" title="Nonaktifkan">
                    <Archive size={14} />
                  </button>
                  <button onClick={() => onDelete(penugasan.id, penugasan.nama_penugasan, penugasan.tipe_penugasan, penugasan.status, penugasan.is_active)} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition" title="Hapus">
                    <Trash2 size={14} />
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