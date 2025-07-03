
import { useProfile } from '@/hooks/useProfile';
import { useSettings } from '@/hooks/useSettings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

import { WelcomeHeader } from './WelcomeHeader';
import { StatsOverview } from './StatsOverview';
import { ActionButtons } from './ActionButtons';
import { ReflectionCard } from './ReflectionCard';

const motivationalQuotes = [
  "Lebih baik gak entry daripada rugi. Semua tuh konfirmasi dulu, Bro! 💪",
  "Disiplin adalah jembatan antara tujuan dan pencapaian trading! 🌟",
  "Trader yang sukses bukan yang selalu profit, tapi yang selalu belajar! 📚",
  "Emosi adalah musuh terbesar trader. Kendalikan, jangan dikendalikan! 🧠",
  "Kamu sedang membentuk otak miliarder. Ini bukan soal cuan, tapi soal kendali! 💎"
];

export const Dashboard = () => {
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { settings } = useSettings();

  // Update profile balance when settings change
  useEffect(() => {
    if (settings?.initial_balance && profile && settings.initial_balance !== profile.balance) {
      updateProfile({ balance: settings.initial_balance });
    }
  }, [settings, profile, updateProfile]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: trades } = await supabase
        .from('trades')
        .select('discipline_score, profit_loss, result')
        .eq('user_id', user.id);

      const totalTrades = trades?.length || 0;
      const winTrades = trades?.filter(t => t.result === 'tp').length || 0;
      const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
      const totalPL = trades?.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0) || 0;
      const disciplineScores = trades?.map(t => t.discipline_score) || [];
      const avgDiscipline = disciplineScores.length > 0 
        ? Math.round(disciplineScores.reduce((sum, score) => sum + score, 0) / disciplineScores.length)
        : 0;

      return { totalTrades, winRate, totalPL, avgDiscipline };
    },
  });

  const todayQuote = motivationalQuotes[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % motivationalQuotes.length];

  if (profileLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-300 border-t-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        {/* Welcome Section */}
        <WelcomeHeader
          username={profile?.username}
          disciplineScore={stats?.avgDiscipline || 0}
          todayQuote={todayQuote}
        />

        {/* Stats Overview */}
        <StatsOverview
          balance={profile?.balance}
          totalPL={stats?.totalPL}
          avgDiscipline={stats?.avgDiscipline || 0}
          totalTrades={stats?.totalTrades || 0}
          winRate={stats?.winRate || 0}
        />

        {/* Action Buttons */}
        <ActionButtons />

        {/* Reflection Card */}
        <ReflectionCard />
      </div>
    </div>
  );
};
