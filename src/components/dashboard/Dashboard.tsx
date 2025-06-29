
import { useProfile } from '@/hooks/useProfile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Target, BookOpen, Play, RotateCcw } from 'lucide-react';

const motivationalQuotes = [
  "Lebih baik gak entry daripada rugi. Semua tuh konfirmasi dulu, Bro.",
  "Disiplin adalah jembatan antara tujuan dan pencapaian.",
  "Trader yang sukses bukan yang selalu profit, tapi yang selalu belajar.",
  "Emosi adalah musuh terbesar trader. Kendalikan, jangan dikendalikan.",
  "Kamu sedang membentuk otak miliarder. Ini bukan soal cuan, tapi soal kendali.",
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useProfile();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get trades stats
      const { data: trades } = await supabase
        .from('trades')
        .select('discipline_score, profit_loss, result')
        .eq('user_id', user.id);

      // Get total trades
      const totalTrades = trades?.length || 0;
      
      // Calculate win rate
      const winTrades = trades?.filter(t => t.result === 'tp').length || 0;
      const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;

      // Calculate total P&L
      const totalPL = trades?.reduce((sum, trade) => sum + (trade.profit_loss || 0), 0) || 0;

      // Calculate average discipline score
      const disciplineScores = trades?.map(t => t.discipline_score) || [];
      const avgDiscipline = disciplineScores.length > 0 
        ? Math.round(disciplineScores.reduce((sum, score) => sum + score, 0) / disciplineScores.length)
        : 0;

      return {
        totalTrades,
        winRate,
        totalPL,
        avgDiscipline,
      };
    },
  });

  const todayQuote = motivationalQuotes[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % motivationalQuotes.length];

  if (profileLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">
          Halo, {profile?.username}! 
        </h1>
        <p className="text-xl text-green-400">
          Kamu sudah {stats?.avgDiscipline || 0}% lebih disiplin hari ini.
        </p>
        
        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-green-900/20 to-yellow-900/20 border border-green-500/20 rounded-lg p-4 mx-auto max-w-2xl">
          <p className="text-gray-300 italic text-center animate-pulse">
            "{todayQuote}"
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Saldo Sekarang</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${profile?.balance?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(stats?.totalPL || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${stats?.totalPL?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Performa Disiplin</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats?.avgDiscipline || 0}%
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Trade / Winrate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats?.totalTrades || 0} / {stats?.winRate || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => navigate('/trade')}
          className="h-20 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
        >
          <Play className="mr-2 h-6 w-6" />
          Start Trade
        </Button>
        
        <Button
          onClick={() => navigate('/journal')}
          className="h-20 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
        >
          <BookOpen className="mr-2 h-6 w-6" />
          Journal
        </Button>
        
        <Button
          onClick={() => navigate('/reiteration')}
          className="h-20 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold"
        >
          <RotateCcw className="mr-2 h-6 w-6" />
          Evaluation
        </Button>
      </div>
    </div>
  );
};
