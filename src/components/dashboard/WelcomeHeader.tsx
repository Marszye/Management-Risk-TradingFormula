
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
    <div className="text-center space-y-3 px-2">
      <div className="relative inline-block">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent leading-tight">
          Halo, {displayName}! 👋
        </h1>
        <Sparkles className="absolute -top-1 -right-4 sm:-right-6 h-4 w-4 sm:h-6 sm:w-6 text-amber-400 animate-pulse" />
      </div>
      
      <div className="max-w-full sm:max-w-lg mx-auto">
        <p className="text-base sm:text-lg md:text-xl font-semibold text-emerald-600 mb-3">
          Kamu sudah {disciplineScore}% lebih disiplin hari ini! 🎯
        </p>
        
        {/* Mobile-optimized quote card */}
        <div className="bg-white/90 backdrop-blur-sm border border-purple-200 rounded-xl p-4 sm:p-6 shadow-lg mx-2 sm:mx-0">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-amber-600 font-bold text-sm sm:text-base">Quote of the Day</span>
            <Star className="h-4 w-4 text-amber-500 ml-2" />
          </div>
          <p className="text-slate-700 text-sm sm:text-base italic font-medium leading-relaxed">
            "{todayQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};
