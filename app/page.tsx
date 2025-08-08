'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ClientDashboard } from '@/components/client/ClientDashboard';
import { DataProvider } from '@/contexts/DataContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <DataProvider>
      {user.role === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
    </DataProvider>
  );
}