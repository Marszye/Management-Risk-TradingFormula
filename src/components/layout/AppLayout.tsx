
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-rose-50 text-slate-800">
      <Navigation />
      <div className="md:ml-72">
        <main className="min-h-screen p-2 md:p-3 lg:p-4">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
