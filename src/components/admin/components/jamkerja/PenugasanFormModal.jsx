import { X, Save, AlertCircle, CheckCircle, Info, MapPin, Target, Globe, Mail } from "lucide-react";

export const PenugasanFormModal = ({
  showFormModal,
  setShowFormModal,
  isEdit,
  formData,
  setFormData,
  selectedCheckboxes,
  selectAllWilayah,
  selectAllIndividu,
  wilayahList,
  usersList,
  handleWilayahCheckboxChange,
  handleSelectAllWilayah,
  handleIndividuCheckboxChange,
  handleSelectAllIndividu,
  handleSubmit,
  resetForm
}) => {
  if (!showFormModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#009688]">{isEdit ? 'Edit Penugasan' : 'Buat Penugasan Baru'}</h2>
          <button onClick={() => { setShowFormModal(false); resetForm(); }} className="text-gray-500 hover:text-black transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Penugasan <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.nama_penugasan} 
                onChange={(e) => setFormData({...formData, nama_penugasan: e.target.value})} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Penugasan</label>
              <select 
                value={formData.tipe_penugasan} 
                onChange={(e) => setFormData({...formData, tipe_penugasan: e.target.value})} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
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
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          {formData.tipe_penugasan === 'khusus' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Google Maps <span className="text-red-500">*</span></label>
                  <input 
                    type="url" 
                    value={formData.maps_link} 
                    onChange={(e) => setFormData({...formData, maps_link: e.target.value})} 
                    placeholder="https://maps.app.goo.gl/..." 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                    required 
                  />
                  <p className="text-xs text-gray-500 mt-1">Masukkan link Google Maps untuk menentukan lokasi penugasan</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
                  <textarea 
                    value={formData.alamat} 
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})} 
                    rows={2} 
                    placeholder="Alamat lengkap lokasi penugasan..." 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formData.tanggal_mulai} 
                    onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={formData.tanggal_selesai} 
                    onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})} 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
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
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                />
                <p className="text-xs text-gray-500 mt-1">Radius validasi lokasi presensi (default: 100 meter)</p>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jam Masuk <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                value={formData.jam_masuk.substring(0, 5)} 
                onChange={(e) => setFormData({...formData, jam_masuk: e.target.value + ':00'})} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jam Pulang <span className="text-red-500">*</span></label>
              <input 
                type="time" 
                value={formData.jam_pulang.substring(0, 5)} 
                onChange={(e) => setFormData({...formData, jam_pulang: e.target.value + ':00'})} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Toleransi Keterlambatan</label>
              <input 
                type="time" 
                value={formData.toleransi_keterlambatan.substring(0, 5)} 
                onChange={(e) => setFormData({...formData, toleransi_keterlambatan: e.target.value + ':00'})} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
              />
              <p className="text-xs text-gray-500 mt-1">Waktu toleransi setelah jam masuk (default: 15 menit)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Batas Terlambat</label>
              <input 
                type="time" 
                value={formData.batas_terlambat ? formData.batas_terlambat.substring(0, 5) : ''} 
                onChange={(e) => setFormData({...formData, batas_terlambat: e.target.value ? e.target.value + ':00' : ''})} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
              />
              <p className="text-xs text-gray-500 mt-1">Batas maksimal keterlambatan (kosongkan = sama dengan jam masuk)</p>
            </div>
          </div>

          {formData.tipe_penugasan === 'khusus' && (
            <div className="border-t pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">Assign Pekerja</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="tipe_assign" 
                    value="semua_pekerja" 
                    checked={formData.tipe_assign === 'semua_pekerja'} 
                    onChange={(e) => {
                      setFormData({...formData, tipe_assign: e.target.value, selected_users: [], selected_wilayah: []});
                    }} 
                    className="text-[#009688]" 
                  />
                  <span>Semua Pekerja</span>
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
                    className="text-[#009688]" 
                  />
                  <span>Per Wilayah</span>
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
                    className="text-[#009688]" 
                  />
                  <span>Individu</span>
                </label>
              </div>

              {formData.tipe_assign === 'per_wilayah' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Wilayah</label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-80 overflow-y-auto">
                    <div className="mb-2 pb-2 border-b border-gray-200 sticky top-0 bg-white">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1">
                        <input 
                          type="checkbox" 
                          checked={selectAllWilayah}
                          onChange={handleSelectAllWilayah}
                          className="text-[#009688] rounded"
                        />
                        <span className="font-medium text-gray-700">Pilih Semua Wilayah</span>
                      </label>
                    </div>
                    {wilayahList.map((wilayah) => (
                      <label key={wilayah.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded border-b border-gray-100">
                        <input 
                          type="checkbox" 
                          checked={selectedCheckboxes.wilayah[wilayah.id] || false}
                          onChange={() => handleWilayahCheckboxChange(wilayah.id)}
                          className="text-[#009688] rounded mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{wilayah.nama_wilayah}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">ID: {wilayah.id}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                            {wilayah.keterangan && (
                              <div className="flex items-center gap-1"><Info size={12} /><span>{wilayah.keterangan}</span></div>
                            )}
                            {wilayah.latitude && wilayah.longitude && (
                              <div className="flex items-center gap-1"><MapPin size={12} /><span>Koordinat: {wilayah.latitude}, {wilayah.longitude}</span></div>
                            )}
                            {wilayah.radius && (
                              <div className="flex items-center gap-1"><Target size={12} /><span>Radius: {wilayah.radius} meter</span></div>
                            )}
                            {wilayah.maps_link && (
                              <div className="flex items-center gap-1"><Globe size={12} /><a href={wilayah.maps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Maps</a></div>
                            )}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <AlertCircle size={12} className="inline mr-1" />
                    Centang checkbox untuk memilih wilayah yang akan mendapatkan penugasan ini
                  </p>
                </div>
              )}

              {formData.tipe_assign === 'individu' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pekerja</label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-80 overflow-y-auto">
                    <div className="mb-2 pb-2 border-b border-gray-200 sticky top-0 bg-white">
                      <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1">
                        <input 
                          type="checkbox" 
                          checked={selectAllIndividu}
                          onChange={handleSelectAllIndividu}
                          className="text-[#009688] rounded"
                        />
                        <span className="font-medium text-gray-700">Pilih Semua Pekerja</span>
                      </label>
                    </div>
                    {usersList.filter(user => user.roles === 'pegawai' && user.is_active).map((user) => (
                      <label key={user.id} className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded border-b border-gray-100">
                        <input 
                          type="checkbox" 
                          checked={selectedCheckboxes.individu[user.id] || false}
                          onChange={() => handleIndividuCheckboxChange(user.id)}
                          className="text-[#009688] rounded mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{user.nama}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{user.jabatan}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {user.wilayah_penugasan && (
                              <div className="flex items-center gap-1"><MapPin size={12} /><span>Wilayah: {user.wilayah_penugasan}</span></div>
                            )}
                            {user.email && (<div className="flex items-center gap-1"><Mail size={12} /><span>{user.email}</span></div>)}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <AlertCircle size={12} className="inline mr-1" />
                    Centang checkbox untuk memilih pekerja yang akan mendapatkan penugasan ini
                  </p>
                </div>
              )}

              {(formData.tipe_assign === 'per_wilayah' && formData.selected_wilayah.length > 0) && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <CheckCircle size={16} />
                    <strong>{formData.selected_wilayah.length} wilayah terpilih</strong>
                  </p>
                  <div className="text-xs text-blue-600 mt-1">
                    {formData.selected_wilayah.map(id => {
                      const wilayah = wilayahList.find(w => w.id === id);
                      return wilayah ? wilayah.nama_wilayah : '';
                    }).filter(Boolean).join(', ')}
                  </div>
                </div>
              )}

              {(formData.tipe_assign === 'individu' && formData.selected_users.length > 0) && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle size={16} />
                    <strong>{formData.selected_users.length} pekerja terpilih</strong>
                  </p>
                  <div className="text-xs text-green-600 mt-1">
                    {formData.selected_users.map(id => {
                      const user = usersList.find(u => u.id === id);
                      return user ? user.nama : '';
                    }).filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => { setShowFormModal(false); resetForm(); }} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
              Batal
            </button>
            <button type="submit" className="px-6 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#00796b] transition flex items-center gap-2">
              <Save size={18} /> {isEdit ? 'Edit' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};