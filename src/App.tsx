
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Index } from '@/pages/Index';
import { Settings } from '@/pages/Settings';
import { Trade } from '@/pages/Trade';
import { Journal } from '@/pages/Journal';
import { Reiteration } from '@/pages/Reiteration';
import { NotFound } from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthGuard>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/reiteration" element={<Reiteration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AuthGuard>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
