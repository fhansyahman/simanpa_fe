import { X } from "lucide-react";

export const MonitoringModal = ({
  showMonitoringModal,
  setShowMonitoringModal,
  selectedPenugasan,
  monitoringData,
  monitoringDate,
  setMonitoringDate,
  onRefresh
}) => {
  if (!showMonitoringModal || !monitoringData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#009688]">
            Monitoring Penugasan: {selectedPenugasan?.nama_penugasan}
          </h2>
          <button onClick={() => setShowMonitoringModal(false)} className="text-gray-500 hover:text-black transition">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-600 text-sm">Tanggal</p>
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="date" 
                value={monitoringDate} 
                onChange={(e) => { 
                  setMonitoringDate(e.target.value); 
                  onRefresh(); 
                }} 
                className="border border-gray-300 p-2 rounded-lg text-sm" 
              />
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-green-600 text-sm">Total Pekerja</p>
            <p className="text-2xl font-bold text-green-800">{monitoringData.total_pekerja}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-orange-600 text-sm">Total Hadir</p>
            <p className="text-2xl font-bold text-orange-800">{monitoringData.total_hadir}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Nama Pekerja</th>
                <th className="p-3 text-left">Jabatan</th>
                <th className="p-3 text-left">Wilayah</th>
                <th className="p-3 text-left">Status Presensi</th>
                <th className="p-3 text-left">Jam Masuk</th>
                <th className="p-3 text-left">Jam Pulang</th>
              </tr>
            </thead>
            <tbody>
              {monitoringData.monitoring?.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3 font-medium">{item.nama}</td>
                  <td className="p-3">{item.jabatan}</td>
                  <td className="p-3">{item.wilayah_penugasan || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status_presensi === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status_presensi}
                    </span>
                  </td>
                  <td className="p-3">{item.jam_masuk || '-'}</td>
                  <td className="p-3">{item.jam_pulang || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {monitoringData.monitoring?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Belum ada data presensi untuk tanggal ini
          </div>
        )}
      </div>
    </div>
  );
};