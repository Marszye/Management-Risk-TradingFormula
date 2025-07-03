
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, RotateCcw } from 'lucide-react';

export const ActionButtons = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Start Trade',
      path: '/trade',
      icon: Play,
      gradient: 'from-emerald-500 to-green-600',
      emoji: '🚀'
    },
    {
      label: 'Journal Entry',
      path: '/journal',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-600',
      emoji: '📝'
    },
    {
      label: 'Evaluation',
      path: '/reiteration',
      icon: RotateCcw,
      gradient: 'from-purple-500 to-violet-600',
      emoji: '🔄'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {actions.map((action) => (
        <Button
          key={action.path}
          onClick={() => navigate(action.path)}
          className={`h-16 md:h-20 bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-0`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{action.emoji}</span>
            <action.icon className="h-6 w-6" />
            <span>{action.label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};
