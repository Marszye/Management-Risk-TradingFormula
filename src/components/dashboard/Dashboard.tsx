
import { useProfile } from '@/hooks/useProfile';
import { useSettings } from '@/hooks/useSettings';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Target, BookOpen, Play, RotateCcw, Sparkles, Star } from 'lucide-react';
import { useEffect } from 'react';

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
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-300 border-t-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="space-y-4">
            <div className="relative inline-block">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Halo, {profile?.username || 'Trader'}! 👋
              </h1>
              <Sparkles className="absolute -top-1 -right-4 h-5 w-5 text-amber-400 animate-pulse" />
            </div>
            
            <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm">
              <p className="text-lg md:text-xl font-semibold text-emerald-600 mb-3">
                Kamu sudah {stats?.avgDiscipline || 0}% lebih disiplin hari ini! 🎯
              </p>
              
              {/* Daily Quote */}
              <div className="bg-lavender-100 border border-lavender-200 rounded-lg p-3">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-amber-600 font-semibold text-sm">Quote of the Day</span>
                  <Star className="h-4 w-4 text-amber-500 ml-2" />
                </div>
                <p className="text-slate-700 text-sm italic text-center font-medium leading-relaxed">
                  "{todayQuote}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-emerald-700">💰 Saldo</CardTitle>
              <DollarSign className="h-3 w-3 text-emerald-500" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold text-emerald-600">
                ${profile?.balance?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-emerald-600/70">Modal Trading</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-amber-700">📊 P&L</CardTitle>
              <TrendingUp className="h-3 w-3 text-amber-500" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className={`text-lg font-bold ${(stats?.totalPL || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${stats?.totalPL?.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-amber-600/70">Total P&L</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-purple-700">🎯 Disiplin</CardTitle>
              <Target className="h-3 w-3 text-purple-500" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold text-purple-600">
                {stats?.avgDiscipline || 0}%
              </div>
              <p className="text-xs text-purple-600/70">Kedisiplinan</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-sky-200 hover:border-sky-300 transition-all duration-300 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
              <CardTitle className="text-xs font-medium text-sky-700">📈 Winrate</CardTitle>
              <TrendingUp className="h-3 w-3 text-sky-500" />
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-lg font-bold text-sky-600">
                {stats?.totalTrades || 0} / {stats?.winRate || 0}%
              </div>
              <p className="text-xs text-sky-600/70">Trade/Win</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            onClick={() => navigate('/trade')}
            className="h-12 bg-emerald-200 hover:bg-emerald-300 text-emerald-800 font-bold shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <Play className="mr-2 h-4 w-4" />
            🚀 Start Trade
          </Button>
          
          <Button
            onClick={() => navigate('/journal')}
            className="h-12 bg-sky-200 hover:bg-sky-300 text-sky-800 font-bold shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            📝 Journal
          </Button>
          
          <Button
            onClick={() => navigate('/reiteration')}
            className="h-12 bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold shadow-sm transition-all duration-300 hover:shadow-md"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            🔄 Evaluation
          </Button>
        </div>

        {/* Anti-Amnesia Trader Section */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 shadow-lg">
          <div className="text-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-2">
              🧠 SISTEM ANTI-AMNESIA TRADER
            </h2>
            <p className="text-purple-600 font-medium text-sm">
              Biar lu gak kebablasan pas cuan/floating/losing streak
            </p>
          </div>

          <Button
            onClick={() => navigate('/weekly-reflection')}
            className="w-full h-12 bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            🔁 Weekly Reflection Ritual
          </Button>
        </div>
      </div>
    </div>
  );
};
