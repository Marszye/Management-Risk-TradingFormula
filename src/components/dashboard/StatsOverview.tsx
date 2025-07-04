
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
  // Calculate total balance = initial balance + profit/loss
  const totalBalance = (balance || 0) + (totalPL || 0);
  const plPercentage = balance ? ((totalPL || 0) / balance) * 100 : 0;

  const stats = [
    {
      title: 'Total Balance',
      value: `$${totalBalance.toFixed(2)}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-50',
      emoji: '💰'
    },
    {
      title: 'P&L',
      value: `${plPercentage >= 0 ? '+' : ''}${plPercentage.toFixed(2)}%`,
      icon: TrendingUp,
      gradient: plPercentage >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-500 to-pink-600',
      bgGradient: plPercentage >= 0 ? 'from-blue-50 to-cyan-50' : 'from-red-50 to-pink-50',
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
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} border border-white/50 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`bg-gradient-to-r ${stat.gradient} p-2 md:p-3 rounded-full`}>
              <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl">{stat.emoji}</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-medium text-slate-600">{stat.title}</p>
            <p className="text-lg md:text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
