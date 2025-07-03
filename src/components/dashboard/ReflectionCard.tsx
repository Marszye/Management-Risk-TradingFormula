
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, RotateCcw } from 'lucide-react';

export const ReflectionCard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-full sm:max-w-lg mx-auto px-2 sm:px-0">
      <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-200 rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 sm:p-4 rounded-full mb-3">
              <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              🧠 SISTEM ANTI-AMNESIA TRADER
            </h2>
            <p className="text-purple-700 font-semibold text-sm sm:text-base">
              Biar lu gak kebablasan pas cuan/floating/losing streak
            </p>
          </div>

          <Button
            onClick={() => navigate('/weekly-reflection')}
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95 text-white font-bold text-sm sm:text-base shadow-lg transition-all duration-200 touch-manipulation border-0 rounded-xl"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-lg sm:text-xl">🔁</span>
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Weekly Reflection Ritual</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
