
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-rose-50 text-slate-800">
      <Navigation />
      <div className="md:ml-60">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
