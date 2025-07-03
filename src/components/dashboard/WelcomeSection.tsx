
import { Sparkles, Star } from 'lucide-react';

interface WelcomeSectionProps {
  username?: string;
  disciplineScore: number;
  todayQuote: string;
}

export const WelcomeSection = ({ username, disciplineScore, todayQuote }: WelcomeSectionProps) => {
  return (
    <div className="mb-6">
      <div className="space-y-4">
        <div className="relative inline-block">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Halo, {username || 'Trader'}! 👋
          </h1>
          <Sparkles className="absolute -top-1 -right-4 h-5 w-5 text-amber-400 animate-pulse" />
        </div>
        
        <div className="bg-white border border-rose-200 rounded-xl p-4 shadow-sm">
          <p className="text-lg md:text-xl font-semibold text-emerald-600 mb-3">
            Kamu sudah {disciplineScore}% lebih disiplin hari ini! 🎯
          </p>
          
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
  );
};
