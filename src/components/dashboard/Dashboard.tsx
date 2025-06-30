
import { useProfile } from '@/hooks/useProfile';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Target, BookOpen, Play, RotateCcw, Sparkles, Star } from 'lucide-react';

const motivationalQuotes = [
  "Lebih baik gak entry daripada rugi. Semua tuh konfirmasi dulu, Bro! 💪",
  "Disiplin adalah jembatan antara tujuan dan pencapaian trading! 🌟",
  "Trader yang sukses bukan yang selalu profit, tapi yang selalu belajar! 📚",
  "Emosi adalah musuh terbesar trader. Kendalikan, jangan dikendalikan! 🧠",
  "Kamu sedang membentuk otak miliarder. Ini bukan soal cuan, tapi soal kendali! 💎",
  "Konsistensi mengalahkan keberuntungan dalam trading jangka panjang! ⚡",
  "Setiap loss adalah pelajaran, setiap profit adalah bonus! 🎯",
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, isLoading: profileLoading } = useProfile();

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Halo, {profile?.username}! 👋
          </h1>
          <Sparkles className="absolute -top-2 -right-4 h-6 w-6 text-yellow-400 animate-pulse" />
        </div>
        <p className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Kamu sudah {stats?.avgDiscipline || 0}% lebih disiplin hari ini! 🎯
        </p>
        
        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-cyan-900/20 border border-purple-500/30 rounded-xl p-6 mx-auto max-w-3xl backdrop-blur-sm">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-semibold">Quote of the Day</span>
            <Star className="h-5 w-5 text-yellow-400 ml-2" />
          </div>
          <p className="text-white text-lg italic text-center font-medium leading-relaxed">
            "{todayQuote}"
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-green-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-200">💰 Saldo Sekarang</CardTitle>
            <DollarSign className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              ${profile?.balance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-green-200 mt-1">Modal Trading Kamu</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/80 to-orange-900/80 border-yellow-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-200">📊 Total P&L</CardTitle>
            <TrendingUp className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${(stats?.totalPL || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats?.totalPL?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-yellow-200 mt-1">Profit & Loss Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-200">🎯 Performa Disiplin</CardTitle>
            <Target className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {stats?.avgDiscipline || 0}%
            </div>
            <p className="text-xs text-purple-200 mt-1">Tingkat Kedisiplinan</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-900/80 to-blue-900/80 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cyan-200">📈 Trade / Winrate</CardTitle>
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-cyan-400">
              {stats?.totalTrades || 0} / {stats?.winRate || 0}%
            </div>
            <p className="text-xs text-cyan-200 mt-1">Total & Persentase Win</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Button
          onClick={() => navigate('/trade')}
          className="h-24 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xl font-bold shadow-lg"
        >
          <Play className="mr-3 h-8 w-8" />
          🚀 Start Trade
        </Button>
        
        <Button
          onClick={() => navigate('/journal')}
          className="h-24 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xl font-bold shadow-lg"
        >
          <BookOpen className="mr-3 h-8 w-8" />
          📝 Journal
        </Button>
        
        <Button
          onClick={() => navigate('/reiteration')}
          className="h-24 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl font-bold shadow-lg"
        >
          <RotateCcw className="mr-3 h-8 w-8" />
          🔄 Evaluation
        </Button>
      </div>
    </div>
  );
};
