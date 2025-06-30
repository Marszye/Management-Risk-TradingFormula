
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-indigo-900 text-white">
      <Navigation />
      <div className="md:ml-72">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
