
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';

export const AntiAmnesiaSection = () => {
  const navigate = useNavigate();

  return (
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
  );
};
