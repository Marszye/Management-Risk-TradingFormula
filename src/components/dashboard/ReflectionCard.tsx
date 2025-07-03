
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles } from 'lucide-react';

export const ReflectionCard = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🧠 SISTEM ANTI-AMNESIA TRADER
            </h2>
            <p className="text-purple-700 font-semibold text-lg">
              Biar lu gak kebablasan pas cuan/floating/losing streak
            </p>
          </div>

          <Button
            onClick={() => navigate('/weekly-reflection')}
            className="w-full md:w-auto px-8 py-4 h-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">🔁</span>
              <RotateCcw className="h-5 w-5" />
              <span>Weekly Reflection Ritual</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
