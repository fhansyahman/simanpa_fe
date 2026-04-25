'use client';
import { X, Save, CheckCircle } from "lucide-react";

export const PenugasanFormModal = ({
  isEdit,
  formData,
  setFormData,
  selectedCheckboxes,
  selectAllWilayah,
  selectAllIndividu,
  wilayahList,
  usersList,
  onClose,
  onSubmit,
  onWilayahCheckboxChange,
  onSelectAllWilayah,
  onIndividuCheckboxChange,
  onSelectAllIndividu
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit Penugasan' : 'Buat Penugasan Baru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Penugasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama_penugasan}
                  onChange={(e) => setFormData({...formData, nama_penugasan: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Penugasan</label>
                <select
                  value={formData.tipe_penugasan}
                  onChange={(e) => setFormData({...formData, tipe_penugasan: e.target.value})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="khusus">Khusus (Lokasi Tertentu)</option>
                  <option value="default">Default System (Seluruh Kantor)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Aktif</label>
                <select
                  value={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
            </div>

            {formData.tipe_penugasan === 'khusus' && (
              <>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Google Maps <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formData.maps_link}
                      onChange={(e) => setFormData({...formData, maps_link: e.target.value})}
                      placeholder="https://maps.app.goo.gl/..."
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Masukkan link Google Maps untuk menentukan lokasi penugasan</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                    <textarea
                      value={formData.alamat}
                      onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                      rows={2}
                      placeholder="Alamat lengkap lokasi penugasan..."
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Mulai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_mulai}
                      onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Selesai <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.tanggal_selesai}
                      onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Radius (meter)</label>
                  <input
                    type="number"
                    value={formData.radius}
                    onChange={(e) => setFormData({...formData, radius: parseInt(e.target.value)})}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Radius validasi lokasi presensi (default: 100 meter)</p>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Masuk <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.jam_masuk.substring(0, 5)}
                  onChange={(e) => setFormData({...formData, jam_masuk: e.target.value + ':00'})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Pulang <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.jam_pulang.substring(0, 5)}
                  onChange={(e) => setFormData({...formData, jam_pulang: e.target.value + ':00'})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Toleransi Keterlambatan</label>
                <input
                  type="time"
                  value={formData.toleransi_keterlambatan.substring(0, 5)}
                  onChange={(e) => setFormData({...formData, toleransi_keterlambatan: e.target.value + ':00'})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Waktu toleransi setelah jam masuk (default: 15 menit)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batas Terlambat</label>
                <input
                  type="time"
                  value={formData.batas_terlambat ? formData.batas_terlambat.substring(0, 5) : ''}
                  onChange={(e) => setFormData({...formData, batas_terlambat: e.target.value ? e.target.value + ':00' : ''})}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Batas maksimal keterlambatan (kosongkan = sama dengan jam masuk)</p>
              </div>
            </div>

            {formData.tipe_penugasan === 'khusus' && (
              <div className="border-t pt-6 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-4">Assign Pekerja</label>
                <div className="flex flex-wrap gap-6 mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipe_assign"
                      value="semua_pekerja"
                      checked={formData.tipe_assign === 'semua_pekerja'}
                      onChange={(e) => {
                        setFormData({...formData, tipe_assign: e.target.value, selected_users: [], selected_wilayah: []});
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Semua Pekerja</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipe_assign"
                      value="per_wilayah"
                      checked={formData.tipe_assign === 'per_wilayah'}
                      onChange={(e) => {
                        setFormData({...formData, tipe_assign: e.target.value, selected_users: []});
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Per Wilayah</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tipe_assign"
                      value="individu"
                      checked={formData.tipe_assign === 'individu'}
                      onChange={(e) => {
                        setFormData({...formData, tipe_assign: e.target.value, selected_wilayah: []});
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm">Individu</span>
                  </label>
                </div>

                {formData.tipe_assign === 'per_wilayah' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Wilayah</label>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto">
                      <div className="mb-3 pb-2 border-b border-gray-200 sticky top-0 bg-white">
                        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1">
                          <input
                            type="checkbox"
                            checked={selectAllWilayah}
                            onChange={onSelectAllWilayah}
                            className="text-blue-600 rounded"
                          />
                          <span className="font-medium text-gray-700 text-sm">Pilih Semua Wilayah</span>
                        </label>
                      </div>
                      {wilayahList.map((wilayah) => (
                        <label key={wilayah.id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-b border-gray-100">
                          <input
                            type="checkbox"
                            checked={selectedCheckboxes.wilayah[wilayah.id] || false}
                            onChange={() => onWilayahCheckboxChange(wilayah.id)}
                            className="text-blue-600 rounded mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{wilayah.nama_wilayah}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">ID: {wilayah.id}</span>
                            </div>
                            {wilayah.keterangan && (
                              <p className="text-xs text-gray-500 mt-1">{wilayah.keterangan}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tipe_assign === 'individu' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pekerja</label>
                    <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto">
                      <div className="mb-3 pb-2 border-b border-gray-200 sticky top-0 bg-white">
                        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1">
                          <input
                            type="checkbox"
                            checked={selectAllIndividu}
                            onChange={onSelectAllIndividu}
                            className="text-blue-600 rounded"
                          />
                          <span className="font-medium text-gray-700 text-sm">Pilih Semua Pekerja</span>
                        </label>
                      </div>
                      {usersList.filter(user => user.roles === 'pegawai' && user.is_active).map((user) => (
                        <label key={user.id} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg border-b border-gray-100">
                          <input
                            type="checkbox"
                            checked={selectedCheckboxes.individu[user.id] || false}
                            onChange={() => onIndividuCheckboxChange(user.id)}
                            className="text-blue-600 rounded mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800">{user.nama}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{user.jabatan}</span>
                            </div>
                            {user.wilayah_penugasan && (
                              <p className="text-xs text-gray-500 mt-1">Wilayah: {user.wilayah_penugasan}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {(formData.tipe_assign === 'per_wilayah' && formData.selected_wilayah.length > 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                      <CheckCircle size={16} />
                      <strong>{formData.selected_wilayah.length} wilayah terpilih</strong>
                    </p>
                  </div>
                )}

                {(formData.tipe_assign === 'individu' && formData.selected_users.length > 0) && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                    <p className="text-sm text-emerald-700 flex items-center gap-2">
                      <CheckCircle size={16} />
                      <strong>{formData.selected_users.length} pekerja terpilih</strong>
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-green-700 transition flex items-center gap-2 shadow-sm"
              >
                <Save size={16} />
                {isEdit ? 'Update' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};