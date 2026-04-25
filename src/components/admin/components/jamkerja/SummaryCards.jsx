import { Briefcase, Check, Target, Radio } from "lucide-react";

export const SummaryCards = ({ penugasanList }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Total Penugasan</p>
            <p className="text-2xl font-bold text-blue-800">{penugasanList.length}</p>
          </div>
          <Briefcase className="text-blue-500" size={24} />
        </div>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Aktif</p>
            <p className="text-2xl font-bold text-green-800">{penugasanList.filter(p => p.status === 'aktif' && p.is_active === 1).length}</p>
          </div>
          <Check className="text-green-500" size={24} />
        </div>
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-600 text-sm font-medium">Penugasan Khusus</p>
            <p className="text-2xl font-bold text-orange-800">{penugasanList.filter(p => p.tipe_penugasan === 'khusus').length}</p>
          </div>
          <Target className="text-orange-500" size={24} />
        </div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-600 text-sm font-medium">Default System</p>
            <p className="text-2xl font-bold text-purple-800">{penugasanList.filter(p => p.tipe_penugasan === 'default').length}</p>
          </div>
          <Radio className="text-purple-500" size={24} />
        </div>
      </div>
    </div>
  );
};