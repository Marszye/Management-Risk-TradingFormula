
import { DollarSign, TrendingUp, Target, Activity } from 'lucide-react';

interface StatsOverviewProps {
  balance?: number;
  totalPL?: number;
  avgDiscipline: number;
  totalTrades: number;
  winRate: number;
}

export const StatsOverview = ({ 
  balance, 
  totalPL, 
  avgDiscipline, 
  totalTrades, 
  winRate 
}: StatsOverviewProps) => {
  const stats = [
    {
      title: 'Modal Trading',
      value: `$${balance?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      emoji: '💰'
    },
    {
      title: 'Total P&L',
      value: `$${totalPL?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      gradient: totalPL && totalPL >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-500 to-pink-600',
      bgGradient: totalPL && totalPL >= 0 ? 'from-blue-50 to-cyan-50' : 'from-red-50 to-pink-50',
      emoji: '📊'
    },
    {
      title: 'Skor Disiplin',
      value: `${avgDiscipline}%`,
      icon: Target,
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50',
      emoji: '🎯'
    },
    {
      title: 'Win Rate',
      value: `${totalTrades} | ${winRate}%`,
      icon: Activity,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      emoji: '📈'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} border border-white/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-full`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl">{stat.emoji}</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600">{stat.title}</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
