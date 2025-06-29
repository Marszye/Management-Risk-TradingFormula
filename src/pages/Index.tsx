
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';

const Index = () => {
  return (
    <AuthGuard
      fallback={<AuthScreen />}
    >
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </AuthGuard>
  );
};

export default Index;
