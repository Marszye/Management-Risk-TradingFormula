
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
    <div className="text-center space-y-3">
      <div className="relative inline-block">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
          Halo, {displayName}! 👋
        </h1>
        <Sparkles className="absolute -top-1 -right-4 h-4 w-4 md:h-6 md:w-6 text-amber-400 animate-pulse" />
      </div>
      
      <div className="max-w-full mx-auto">
        <p className="text-base md:text-xl font-semibold text-emerald-600 mb-3">
          Kamu sudah {disciplineScore}% lebih disiplin hari ini! 🎯
        </p>
        
        {/* Quote card */}
        <div className="bg-white border border-purple-200 rounded-xl p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-center mb-2">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-amber-600 font-bold text-sm md:text-base">Quote of the Day</span>
            <Star className="h-4 w-4 text-amber-500 ml-2" />
          </div>
          <p className="text-slate-700 text-sm md:text-base italic font-medium leading-relaxed">
            "{todayQuote}"
          </p>
        </div>
      </div>
    </div>
  );
};
