'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Users,
  Activity,
  FileText,
  CreditCard,
  BarChart3,
  LogOut,
  X,
  Heart
} from 'lucide-react';

type AdminView = 'overview' | 'clients' | 'exercises' | 'invoices' | 'payments';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const menuItems = [
  { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'exercises', label: 'Exercícios', icon: Activity },
  { id: 'invoices', label: 'Faturas', icon: FileText },
  { id: 'payments', label: 'Pagamentos', icon: CreditCard },
];

export function AdminSidebar({ currentView, onViewChange, sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 gradient-bg">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">SGF Admin</h1>
                <p className="text-sm text-white/80">Painel de Controle</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start space-x-3 hover-lift ${
                    isActive 
                      ? 'bg-primary text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    onViewChange(item.id as AdminView);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          <Separator />

          {/* Logout */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}