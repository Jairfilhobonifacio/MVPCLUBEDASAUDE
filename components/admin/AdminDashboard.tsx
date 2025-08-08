'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ClientsOverview } from './ClientsOverview';
import { ClientManagement } from './ClientManagement';
import { ExerciseManagement } from './ExerciseManagement';
import { InvoiceManagement } from './InvoiceManagement';
import { PaymentVouchers } from './PaymentVouchers';

type AdminView = 'overview' | 'clients' | 'exercises' | 'invoices' | 'payments';

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <ClientsOverview />;
      case 'clients':
        return <ClientManagement />;
      case 'exercises':
        return <ExerciseManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'payments':
        return <PaymentVouchers />;
      default:
        return <ClientsOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="lg:ml-64">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="p-6">
          <div className="fade-in">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}