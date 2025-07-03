
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, AlertTriangle, Target, TrendingUp, Lightbulb, Save, RotateCcw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WeeklyReflection {
  id: string;
  biggest_mistake: string;
  dominant_emotion: string;
  main_lesson: string;
  bad_habit_to_remove: string;
  good_habit_to_build: string;
  week_start: string;
  created_at: string;
}

export const WeeklyReflection = () => {
  const queryClient = useQueryClient();
  const [biggestMistake, setBiggestMistake] = useState('');
  const [dominantEmotion, setDominantEmotion] = useState('');
  const [mainLesson, setMainLesson] = useState('');
  const [badHabitToRemove, setBadHabitToRemove] = useState('');
  const [goodHabitToBuild, setGoodHabitToBuild] = useState('');

  const getWeekStart = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(now.setDate(diff)).toISOString().split('T')[0];
  };

  const { data: reflections, isLoading } = useQuery({
    queryKey: ['weekly-reflections'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weekly_reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WeeklyReflection[];
    },
  });

  const saveReflection = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weekly_reflections')
        .insert({
          user_id: user.id,
          biggest_mistake: biggestMistake,
          dominant_emotion: dominantEmotion,
          main_lesson: mainLesson,
          bad_habit_to_remove: badHabitToRemove,
          good_habit_to_build: goodHabitToBuild,
          week_start: getWeekStart()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekly-reflections'] });
      setBiggestMistake('');
      setDominantEmotion('');
      setMainLesson('');
      setBadHabitToRemove('');
      setGoodHabitToBuild('');
      toast.success("Refleksi Tersimpan! 🎯", {
        description: "Weekly reflection berhasil disimpan. Keep growing, trader!",
      });
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message || "Gagal menyimpan refleksi.",
      });
    },
  });

  const thisWeekReflection = reflections?.find(r => r.week_start === getWeekStart());
  const canSaveThisWeek = !thisWeekReflection;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300 border-t-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-purple-200">
            <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
              🧠 SISTEM ANTI-AMNESIA TRADER
            </h1>
            <p className="text-base md:text-lg text-purple-600 font-medium mb-3">
              Weekly Ritual - Biar lu gak kebablasan pas cuan/floating/losing streak
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              <Badge className="bg-amber-500 text-white text-sm">
                Week of {new Date(getWeekStart()).toLocaleDateString('id-ID')}
              </Badge>
            </div>
          </div>
        </div>

        {/* This Week's Reflection Form */}
        {canSaveThisWeek ? (
          <Card className="mb-6 bg-white border border-purple-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-purple-700 text-lg">
                <Brain className="mr-2 h-5 w-5" />
                📌 REFLEKSI MINGGUAN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-1">
                  1. Apa kesalahan terbesar gua minggu ini?
                </label>
                <Textarea
                  placeholder="Jujur sama diri sendiri..."
                  value={biggestMistake}
                  onChange={(e) => setBiggestMistake(e.target.value)}
                  className="border-purple-300 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-1">
                  2. Kenapa gua melakukan itu? Emosi yang dominan apa?
                </label>
                <Textarea
                  placeholder="Takut, serakah, FOMO, overconfident, dll..."
                  value={dominantEmotion}
                  onChange={(e) => setDominantEmotion(e.target.value)}
                  className="border-purple-300 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-1">
                  3. Pelajaran utama minggu ini?
                </label>
                <Textarea
                  placeholder="Apa yang lu pelajari dari kesalahan ini?"
                  value={mainLesson}
                  onChange={(e) => setMainLesson(e.target.value)}
                  className="border-purple-300 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-1">
                  4. Satu habit buruk yang harus gua hapus minggu depan?
                </label>
                <Textarea
                  placeholder="Habit yang harus dihentikan..."
                  value={badHabitToRemove}
                  onChange={(e) => setBadHabitToRemove(e.target.value)}
                  className="border-purple-300 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-700 mb-1">
                  5. Satu habit bagus yang gua mau bangun minggu depan?
                </label>
                <Textarea
                  placeholder="Habit baru yang mau dibangun..."
                  value={goodHabitToBuild}
                  onChange={(e) => setGoodHabitToBuild(e.target.value)}
                  className="border-purple-300 focus:border-purple-500 text-sm"
                  rows={3}
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <h4 className="font-semibold text-amber-700 mb-2 text-sm">
                  6. Reminder diri (tulis ulang tiap minggu):
                </h4>
                <p className="text-amber-800 italic font-medium text-sm">
                  "Gue bukan di sini buat tebak market. Gue di sini buat ikutin sistem dengan sabar dan disiplin."
                </p>
              </div>

              <Button
                onClick={() => saveReflection.mutate()}
                disabled={saveReflection.isPending || !biggestMistake || !dominantEmotion || !mainLesson}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2"
              >
                <Save className="mr-2 h-4 w-4" />
                {saveReflection.isPending ? 'Menyimpan...' : 'Simpan Refleksi Minggu Ini'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-green-50 border border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-green-600">
                <Target className="h-10 w-10 mx-auto mb-2" />
                <h3 className="text-lg font-bold">Refleksi Minggu Ini Sudah Selesai! ✅</h3>
                <p className="text-sm">Kamu sudah melakukan refleksi untuk minggu ini. Kembali lagi Minggu depan!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous Reflections */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-purple-700 mb-3">📖 Riwayat Refleksi</h2>
          
          {reflections && reflections.length > 0 ? (
            reflections.map((reflection) => (
              <Card key={reflection.id} className="bg-white border border-purple-200 shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-700 text-base">
                      Week of {new Date(reflection.week_start).toLocaleDateString('id-ID')}
                    </CardTitle>
                    <Badge className="bg-purple-500 text-white text-xs">
                      {new Date(reflection.created_at).toLocaleDateString('id-ID')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div>
                    <h4 className="font-semibold text-red-600 text-xs">❌ Kesalahan Terbesar:</h4>
                    <p className="text-xs text-gray-700 bg-red-50 p-2 rounded border border-red-200">
                      {reflection.biggest_mistake}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-600 text-xs">😤 Emosi Dominan:</h4>
                    <p className="text-xs text-gray-700 bg-orange-50 p-2 rounded border border-orange-200">
                      {reflection.dominant_emotion}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600 text-xs">💡 Pelajaran Utama:</h4>
                    <p className="text-xs text-gray-700 bg-blue-50 p-2 rounded border border-blue-200">
                      {reflection.main_lesson}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <h4 className="font-semibold text-red-600 text-xs">🚫 Habit Buruk:</h4>
                      <p className="text-xs text-gray-700 bg-red-50 p-2 rounded border border-red-200">
                        {reflection.bad_habit_to_remove}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-green-600 text-xs">✅ Habit Bagus:</h4>
                      <p className="text-xs text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                        {reflection.good_habit_to_build}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-50 border border-gray-200">
              <CardContent className="p-6 text-center">
                <Lightbulb className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Belum ada riwayat refleksi</p>
                <p className="text-sm text-gray-400">Mulai dengan refleksi pertama minggu ini!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tips Section */}
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 text-base">💡 Tips Ekstra</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-amber-800 font-medium text-sm mb-2">
              Lu bisa set alarm WA reminder tiap Minggu jam 19.00:
            </p>
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-2">
              <p className="text-amber-900 italic font-medium text-sm">
                "Saatnya refleksi dan reset mental, bro. Market minggu depan bukan tempat buat bawa emosi minggu lalu."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
