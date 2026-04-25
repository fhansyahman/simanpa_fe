export const FilterTabs = ({ jenisFilter, setJenisFilter, activeTab, setActiveTab }) => {
  const handleFilterChange = (filter, tab) => {
    setJenisFilter(filter);
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-wrap border-b border-gray-200 mb-6 gap-2">
      <button 
        onClick={() => handleFilterChange('semua', 'semua')} 
        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${jenisFilter === 'semua' ? 'bg-[#009688] text-white' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Semua
      </button>
      <button 
        onClick={() => handleFilterChange('aktif', 'aktif')} 
        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${jenisFilter === 'aktif' ? 'bg-[#009688] text-white' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Aktif
      </button>
      <button 
        onClick={() => handleFilterChange('selesai', 'selesai')} 
        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${jenisFilter === 'selesai' ? 'bg-[#009688] text-white' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Selesai/Dibatalkan
      </button>
      <button 
        onClick={() => handleFilterChange('default', 'default')} 
        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition ${jenisFilter === 'default' ? 'bg-[#009688] text-white' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Default System
      </button>
    </div>
  );
};