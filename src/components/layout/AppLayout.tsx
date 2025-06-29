
import { Navigation } from './Navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation />
      <div className="md:ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
