
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 flex">
      <Navigation />
      <main className="flex-1">
        <div className="md:ml-72">
          {children}
        </div>
      </main>
    </div>
  );
};
