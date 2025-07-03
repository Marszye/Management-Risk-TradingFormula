
import { Sparkles, Star } from 'lucide-react';

interface WelcomeHeaderProps {
  username?: string;
  disciplineScore: number;
  todayQuote: string;
}

export const WelcomeHeader = ({ username, disciplineScore, todayQuote }: WelcomeHeaderProps) => {
  // Extract real name from username if it follows the pattern
  const displayName = username && !username.startsWith('user_') ? username : 'Trader';

  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          Halo, {displayName}! 👋
        </h1>
        <Sparkles className="absolute -top-2 -right-6 h-6 w-6 text-amber-400 animate-pulse" />
      </div>
      
      <div className="max-w-2xl mx-auto">
        <p className="text-lg md:text-xl font-semibold text-emerald-600 mb-4">
          Kamu sudah {disciplineScore}% lebih disiplin hari ini! 🎯
        </p>
        
        <div className="bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center mb-3">
            <Star className="h-5 w-5 text-amber-500 mr-2" />
            <span className="text-amber-600 font-bold text-lg">Quote of the Day</span>
            <Star className="h-5 w-5 text-amber-500 ml-2" />
          </div>
          <p className="text-slate-700 text-base md:text-lg italic font-medium leading-relaxed">
            "{todayQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};
