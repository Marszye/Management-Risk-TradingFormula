
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, RotateCcw } from 'lucide-react';

export const ReflectionCard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-200 rounded-2xl p-4 md:p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 md:p-4 rounded-full mb-3">
              <Brain className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 md:h-6 md:w-6 text-yellow-400 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🧠 SISTEM ANTI-AMNESIA TRADER
            </h2>
            <p className="text-purple-700 font-semibold text-sm md:text-base">
              Biar lu gak kebablasan pas cuan/floating/losing streak
            </p>
          </div>

          <Button
            onClick={() => navigate('/weekly-reflection')}
            className="w-full h-12 md:h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm md:text-base shadow-lg transition-all duration-300 border-0 rounded-xl"
          >
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="text-lg md:text-xl">🔁</span>
              <RotateCcw className="h-4 w-4 md:h-5 md:w-5" />
              <span>Weekly Reflection Ritual</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
