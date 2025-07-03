
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  colorScheme: 'emerald' | 'amber' | 'purple' | 'sky';
  emoji: string;
}

export const StatsCard = ({ title, value, subtitle, icon: Icon, colorScheme, emoji }: StatsCardProps) => {
  const colorClasses = {
    emerald: {
      border: 'border-emerald-200 hover:border-emerald-300',
      title: 'text-emerald-700',
      icon: 'text-emerald-500',
      value: 'text-emerald-600',
      subtitle: 'text-emerald-600/70'
    },
    amber: {
      border: 'border-amber-200 hover:border-amber-300',
      title: 'text-amber-700',
      icon: 'text-amber-500',
      value: 'text-amber-600',
      subtitle: 'text-amber-600/70'
    },
    purple: {
      border: 'border-purple-200 hover:border-purple-300',
      title: 'text-purple-700',
      icon: 'text-purple-500',
      value: 'text-purple-600',
      subtitle: 'text-purple-600/70'
    },
    sky: {
      border: 'border-sky-200 hover:border-sky-300',
      title: 'text-sky-700',
      icon: 'text-sky-500',
      value: 'text-sky-600',
      subtitle: 'text-sky-600/70'
    }
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`bg-white ${colors.border} transition-all duration-300 hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 pt-3">
        <CardTitle className={`text-xs font-medium ${colors.title}`}>
          {emoji} {title}
        </CardTitle>
        <Icon className={`h-3 w-3 ${colors.icon}`} />
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <div className={`text-lg font-bold ${colors.value}`}>
          {value}
        </div>
        <p className={`text-xs ${colors.subtitle}`}>{subtitle}</p>
      </CardContent>
    </Card>
  );
};
