
import { StatsCard } from './StatsCard';
import { DollarSign, TrendingUp, Target } from 'lucide-react';

interface DashboardStatsProps {
  balance?: number;
  totalPL?: number;
  avgDiscipline: number;
  totalTrades: number;
  winRate: number;
}

export const DashboardStats = ({ 
  balance, 
  totalPL, 
  avgDiscipline, 
  totalTrades, 
  winRate 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Saldo"
        value={`$${balance?.toFixed(2) || '0.00'}`}
        subtitle="Modal Trading"
        icon={DollarSign}
        colorScheme="emerald"
        emoji="💰"
      />
      
      <StatsCard
        title="P&L"
        value={`$${totalPL?.toFixed(2) || '0.00'}`}
        subtitle="Total P&L"
        icon={TrendingUp}
        colorScheme="amber"
        emoji="📊"
      />
      
      <StatsCard
        title="Disiplin"
        value={`${avgDiscipline}%`}
        subtitle="Kedisiplinan"
        icon={Target}
        colorScheme="purple"
        emoji="🎯"
      />
      
      <StatsCard
        title="Winrate"
        value={`${totalTrades} / ${winRate}%`}
        subtitle="Trade/Win"
        icon={TrendingUp}
        colorScheme="sky"
        emoji="📈"
      />
    </div>
  );
};
