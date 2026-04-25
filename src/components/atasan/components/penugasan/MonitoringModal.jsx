'use client';
import { X, Radio } from "lucide-react";

export const MonitoringModal = ({
  selectedPenugasan,
  monitoringData,
  monitoringDate,
  setMonitoringDate,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Monitoring Penugasan: {selectedPenugasan?.nama_penugasan}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Tanggal</p>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="date"
                  value={monitoringDate}
                  onChange={(e) => setMonitoringDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4">
              <p className="text-sm text-blue-600">Total Pekerja</p>
              <p className="text-2xl font-bold text-blue-800 mt-1">{monitoringData.total_pekerja}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-4">
              <p className="text-sm text-emerald-600">Total Hadir</p>
              <p className="text-2xl font-bold text-emerald-800 mt-1">{monitoringData.total_hadir}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Pekerja</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jabatan</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Wilayah</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status Presensi</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jam Masuk</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Jam Pulang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monitoringData.monitoring?.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.nama}</td>
                    <td className="py-3 px-4 text-gray-700">{item.jabatan}</td>
                    <td className="py-3 px-4 text-gray-700">{item.wilayah_penugasan || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status_presensi === 'Hadir' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status_presensi}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{item.jam_masuk || '-'}</td>
                    <td className="py-3 px-4 text-gray-700">{item.jam_pulang || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {monitoringData.monitoring?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                <Radio className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Belum ada data presensi untuk tanggal ini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};