"use client";

import { X, Clock, CheckCircle, AlertCircle, Users, Calendar, MapPin, Navigation } from "lucide-react";

export function DetailModal({ 
  showModal, 
  onClose, 
  selectedJamKerja, 
  onEdit, 
  onUpdateStatus,
  formatTime, 
  calculateTotalHours,
  isPenugasan 
}) {
  if (!showModal || !selectedJamKerja) return null;

  const isPenugasanItem = isPenugasan(selectedJamKerja);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isPenugasanItem ? 'Detail Penugasan' : 'Detail Setting Jam Kerja'}
            </h2>
            {isPenugasanItem && selectedJamKerja.kode_penugasan && (
              <p className="text-sm text-gray-500 mt-1">{selectedJamKerja.kode_penugasan}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {/* Header Info */}
            <HeaderInfo 
              jamKerja={selectedJamKerja}
              formatTime={formatTime}
              isPenugasan={isPenugasanItem}
            />

            {/* Lokasi untuk Penugasan */}
            {isPenugasanItem && (selectedJamKerja.latitude || selectedJamKerja.maps_link) && (
              <LokasiCard jamKerja={selectedJamKerja} />
            )}

            {/* Grid Informasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WaktuKerjaCard
                jamKerja={selectedJamKerja}
                formatTime={formatTime}
                calculateTotalHours={calculateTotalHours}
              />
              
              <ToleransiCard
                jamKerja={selectedJamKerja}
                formatTime={formatTime}
              />
            </div>

            {/* Periode untuk Penugasan */}
            {isPenugasanItem && (selectedJamKerja.tanggal_mulai || selectedJamKerja.tanggal_selesai) && (
              <PeriodeCard jamKerja={selectedJamKerja} />
            )}

            {/* Informasi Tambahan */}
            <AdditionalInfo 
              jamKerja={selectedJamKerja}
              formatTime={formatTime}
              isPenugasan={isPenugasanItem}
            />
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Tutup
            </button>
            {!isPenugasanItem ? (
              <button
                onClick={() => {
                  onClose();
                  onEdit(selectedJamKerja);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600"
              >
                Edit Setting
              </button>
            ) : selectedJamKerja.status === 'aktif' && onUpdateStatus && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onUpdateStatus(selectedJamKerja.id, 'selesai');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700"
                >
                  Selesaikan
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onUpdateStatus(selectedJamKerja.id, 'dibatalkan');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:from-red-700 hover:to-pink-700"
                >
                  Batalkan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderInfo({ jamKerja, formatTime, isPenugasan }) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{jamKerja.nama_setting}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge 
              isActive={jamKerja.is_active} 
              status={jamKerja.status} 
              isPenugasan={isPenugasan} 
            />
            {jamKerja.is_active && !isPenugasan && (
              <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 font-medium">
                Default Setting
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        <p>Dibuat: {new Date(jamKerja.created_at).toLocaleDateString('id-ID')}</p>
      </div>
    </div>
  );
}

function StatusBadge({ isActive, status, isPenugasan }) {
  if (isPenugasan) {
    const statusConfig = {
      aktif: { bg: 'bg-green-100', text: 'text-green-800', label: '🟢 Aktif' },
      selesai: { bg: 'bg-blue-100', text: 'text-blue-800', label: '✅ Selesai' },
      dibatalkan: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Dibatalkan' }
    };
    const config = statusConfig[status] || statusConfig.aktif;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  }
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
    }`}>
      {isActive ? '🟢 Aktif' : '⚫ Nonaktif'}
    </span>
  );
}

function LokasiCard({ jamKerja }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
      <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
        <MapPin size={18} className="text-indigo-600" />
        Lokasi Penugasan
      </h4>
      {jamKerja.alamat && (
        <p className="text-sm text-gray-700 mb-2">{jamKerja.alamat}</p>
      )}
      {jamKerja.latitude && jamKerja.longitude && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Navigation size={14} />
          <span>Lat: {jamKerja.latitude}, Lng: {jamKerja.longitude}</span>
        </div>
      )}
      {jamKerja.radius && (
        <div className="mt-2 text-xs text-indigo-600">
          Radius: {jamKerja.radius} meter
        </div>
      )}
      {jamKerja.maps_link && (
        <a 
          href={jamKerja.maps_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-blue-600 hover:underline"
        >
          Buka di Google Maps →
        </a>
      )}
    </div>
  );
}

function PeriodeCard({ jamKerja }) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-green-50 p-4 rounded-xl border border-teal-100">
      <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
        <Calendar size={18} className="text-teal-600" />
        Periode Penugasan
      </h4>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-teal-600">Tanggal Mulai</p>
          <p className="font-bold text-teal-800">
            {jamKerja.tanggal_mulai ? new Date(jamKerja.tanggal_mulai).toLocaleDateString('id-ID') : '-'}
          </p>
        </div>
        <div>
          <p className="text-sm text-teal-600">Tanggal Selesai</p>
          <p className="font-bold text-teal-800">
            {jamKerja.tanggal_selesai ? new Date(jamKerja.tanggal_selesai).toLocaleDateString('id-ID') : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}

function WaktuKerjaCard({ jamKerja, formatTime, calculateTotalHours }) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
        <Clock size={18} className="text-green-600" />
        Waktu Kerja
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <TimeStat
          label="Masuk"
          value={formatTime(jamKerja.jam_masuk_standar)}
          bgColor="bg-green-100"
          textColor="text-green-800"
          borderColor="border-green-200"
        />
        <TimeStat
          label="Pulang"
          value={formatTime(jamKerja.jam_pulang_standar)}
          bgColor="bg-red-100"
          textColor="text-red-800"
          borderColor="border-red-200"
        />
      </div>
      <div className="mt-4 pt-3 border-t border-green-200 text-center">
        <p className="text-sm text-green-700 font-medium">
          Total Jam Kerja: {calculateTotalHours(jamKerja.jam_masuk_standar, jamKerja.jam_pulang_standar)}
        </p>
      </div>
    </div>
  );
}

function TimeStat({ label, value, bgColor, textColor, borderColor }) {
  return (
    <div className="text-center">
      <div className={`w-10 h-10 bg-white rounded-lg border ${borderColor} flex items-center justify-center mx-auto mb-2`}>
        <span className={`text-sm font-bold ${textColor}`}>{label[0]}</span>
      </div>
      <p className={`text-sm ${textColor.replace('800', '600')}`}>Jam {label}</p>
      <p className={`text-xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function ToleransiCard({ jamKerja, formatTime }) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-100">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-amber-600" />
          Toleransi Keterlambatan
        </h4>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-800 mb-1">
            {formatTime(jamKerja.toleransi_keterlambatan)}
          </p>
          <p className="text-sm text-amber-600">
            Waktu toleransi sebelum dianggap terlambat
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-100">
        <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-600" />
          Batas Terlambat
        </h4>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-800 mb-1">
            {formatTime(jamKerja.batas_terlambat)}
          </p>
          <p className="text-sm text-red-600">
            Batas maksimal untuk melakukan presensi masuk
          </p>
        </div>
      </div>
    </div>
  );
}

function AdditionalInfo({ jamKerja, formatTime, isPenugasan }) {
  const infoItems = isPenugasan ? [
    { icon: <Clock className="w-4 h-4 text-purple-600" />, label: "Jam Kerja", value: `${formatTime(jamKerja.jam_masuk_standar)} - ${formatTime(jamKerja.jam_pulang_standar)}` },
    { icon: <CheckCircle className="w-4 h-4 text-blue-600" />, label: "Status", value: jamKerja.status || 'aktif' },
    { icon: <Users className="w-4 h-4 text-green-600" />, label: "Radius", value: `${jamKerja.radius || 100} meter` },
    { icon: <Calendar className="w-4 h-4 text-cyan-600" />, label: "Update", value: new Date(jamKerja.updated_at).toLocaleDateString('id-ID') }
  ] : [
    { icon: <Clock className="w-4 h-4 text-purple-600" />, label: "Shift", value: "Normal" },
    { icon: <CheckCircle className="w-4 h-4 text-blue-600" />, label: "Status", value: jamKerja.is_active ? "Aktif" : "Nonaktif" },
    { icon: <Users className="w-4 h-4 text-green-600" />, label: "Pengguna", value: "Semua Karyawan" },
    { icon: <Calendar className="w-4 h-4 text-cyan-600" />, label: "Update", value: new Date(jamKerja.updated_at).toLocaleDateString('id-ID') }
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
      <h4 className="font-semibold text-purple-800 mb-3">
        Informasi Tambahan
      </h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {infoItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className="w-8 h-8 bg-white rounded-lg border border-purple-200 flex items-center justify-center mx-auto mb-1">
              {item.icon}
            </div>
            <p className="text-xs text-purple-600">{item.label}</p>
            <p className="text-sm font-medium text-purple-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}