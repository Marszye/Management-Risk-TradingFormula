
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, RotateCcw } from 'lucide-react';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: '🚀 Start Trade',
      path: '/trade',
      icon: Play,
      color: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-800'
    },
    {
      label: '📝 Journal',
      path: '/journal',
      icon: BookOpen,
      color: 'bg-sky-200 hover:bg-sky-300 text-sky-800'
    },
    {
      label: '🔄 Evaluation',
      path: '/reiteration',
      icon: RotateCcw,
      color: 'bg-purple-200 hover:bg-purple-300 text-purple-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {actions.map((action) => (
        <Button
          key={action.path}
          onClick={() => navigate(action.path)}
          className={`h-12 ${action.color} font-bold shadow-sm transition-all duration-300 hover:shadow-md`}
        >
          <action.icon className="mr-2 h-4 w-4" />
          {action.label}
        </Button>
      ))}
    </div>
  );
};
