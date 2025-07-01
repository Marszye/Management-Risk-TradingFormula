
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-300 border-t-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              Halo, {profile?.username || 'User'}! 👋
            </h1>
            <Sparkles className="absolute -top-1 -right-4 md:-top-2 md:-right-6 h-5 w-5 md:h-6 md:w-6 text-amber-400 animate-pulse" />
          </div>
          
          <div className="bg-white border border-rose-200 rounded-xl p-4 md:p-6 shadow-sm mx-auto max-w-4xl">
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-emerald-600 mb-3">
              Kamu sudah {stats?.avgDiscipline || 0}% lebih disiplin hari ini! 🎯
            </p>
            
            {/* Daily Quote */}
            <div className="bg-lavender-100 border border-lavender-200 rounded-lg p-3 md:p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-4 w-4 text-amber-500 mr-2" />
                <span className="text-amber-600 font-semibold text-sm">Quote of the Day</span>
                <Star className="h-4 w-4 text-amber-500 ml-2" />
              </div>
              <p className="text-slate-700 text-sm md:text-base italic text-center font-medium leading-relaxed">
                "{todayQuote}"
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-white border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium text-emerald-700">💰 Saldo Sekarang</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl md:text-2xl font-bold text-emerald-600">
                ${profile?.balance?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-emerald-600/70 mt-1">Modal Trading Kamu</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium text-amber-700">📊 Total P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className={`text-xl md:text-2xl font-bold ${(stats?.totalPL || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${stats?.totalPL?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-amber-600/70 mt-1">Profit & Loss Total</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium text-purple-700">🎯 Performa Disiplin</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl md:text-2xl font-bold text-purple-600">
                {stats?.avgDiscipline || 0}%
              </div>
              <p className="text-xs text-purple-600/70 mt-1">Tingkat Kedisiplinan</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-sky-200 hover:border-sky-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-medium text-sky-700">📈 Trade / Winrate</CardTitle>
              <TrendingUp className="h-4 w-4 text-sky-500" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl md:text-2xl font-bold text-sky-600">
                {stats?.totalTrades || 0} / {stats?.winRate || 0}%
              </div>
              <p className="text-xs text-sky-600/70 mt-1">Total & Persentase Win</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          <Button
            onClick={() => navigate('/trade')}
            className="h-16 md:h-20 bg-emerald-200 hover:bg-emerald-300 text-emerald-800 text-base md:text-lg font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            <Play className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
            🚀 Start Trade
          </Button>
          
          <Button
            onClick={() => navigate('/journal')}
            className="h-16 md:h-20 bg-sky-200 hover:bg-sky-300 text-sky-800 text-base md:text-lg font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            <BookOpen className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
            📝 Journal
          </Button>
          
          <Button
            onClick={() => navigate('/reiteration')}
            className="h-16 md:h-20 bg-purple-200 hover:bg-purple-300 text-purple-800 text-base md:text-lg font-bold shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
          >
            <RotateCcw className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
            🔄 Evaluation
          </Button>
        </div>
      </div>
    </div>
  );
};
