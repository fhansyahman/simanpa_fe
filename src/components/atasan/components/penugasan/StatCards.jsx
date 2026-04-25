import { Briefcase, Check, Target, Radio } from "lucide-react";

export const StatCards = ({ penugasanList }) => {
  const stats = [
    {
      title: "Total Penugasan",
      value: penugasanList.length,
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      bgGradient: "from-blue-50 to-cyan-50",
      textColor: "text-gray-800"
    },
    {
      title: "Aktif",
      value: penugasanList.filter(p => p.status === 'aktif' && p.is_active === 1).length,
      icon: <Check className="w-6 h-6 text-emerald-600" />,
      bgGradient: "from-green-50 to-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      title: "Penugasan Khusus",
      value: penugasanList.filter(p => p.tipe_penugasan === 'khusus').length,
      icon: <Target className="w-6 h-6 text-amber-600" />,
      bgGradient: "from-amber-50 to-orange-50",
      textColor: "text-amber-600"
    },
    {
      title: "Default System",
      value: penugasanList.filter(p => p.tipe_penugasan === 'default').length,
      icon: <Radio className="w-6 h-6 text-purple-600" />,
      bgGradient: "from-purple-50 to-violet-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.bgGradient} rounded-xl flex items-center justify-center`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};