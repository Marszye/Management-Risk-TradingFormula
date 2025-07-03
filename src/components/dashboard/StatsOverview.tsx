
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
      title: 'Modal',
      value: `$${balance?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      emoji: '💰'
    },
    {
      title: 'P&L',
      value: `$${totalPL?.toFixed(2) || '0.00'}`,
      icon: TrendingUp,
      gradient: totalPL && totalPL >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-500 to-pink-600',
      bgGradient: totalPL && totalPL >= 0 ? 'from-blue-50 to-cyan-50' : 'from-red-50 to-pink-50',
      emoji: '📊'
    },
    {
      title: 'Disiplin',
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-0">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} border border-white/50 rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 touch-manipulation`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`bg-gradient-to-r ${stat.gradient} p-2 sm:p-2.5 rounded-full`}>
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl">{stat.emoji}</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-medium text-slate-600">{stat.title}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-tight">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
