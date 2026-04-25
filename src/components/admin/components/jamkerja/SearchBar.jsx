import { Search, RefreshCw, Plus } from "lucide-react";

export const SearchBar = ({ search, setSearch, onRefresh, onCreate }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari berdasarkan nama atau kode penugasan..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]" 
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button onClick={onRefresh} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <RefreshCw size={18} /> Refresh
        </button>
        <button onClick={onCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <Plus size={18} /> Buat Penugasan
        </button>
      </div>
    </div>
  );
};