'use client';

import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

export function ClientsOverview() {
  const { clients } = useData();

  const totalClients = clients.length;
  const totalInvoices = clients.reduce((acc, client) => acc + client.invoices.length, 0);
  const totalRevenue = clients.reduce((acc, client) => 
    acc + client.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  , 0);
  const pendingPayments = clients.reduce((acc, client) => 
    acc + client.invoices.filter(inv => inv.status === 'pending').length
  , 0);

  const recentClients = clients.slice(-5);
  const recentInvoices = clients
    .flatMap(client => client.invoices.map(inv => ({ ...inv, clientName: client.name })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-600">Resumo das atividades do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> novos este mês
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Emitidas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">{pendingPayments}</span> pendentes
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">Crescimento</span> mensal médio
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Faturas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100' :
                      invoice.status === 'pending' ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      {invoice.status === 'paid' ? 
                        <CheckCircle className="h-4 w-4 text-green-600" /> :
                        invoice.status === 'pending' ?
                        <Clock className="h-4 w-4 text-yellow-600" /> :
                        <XCircle className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{invoice.clientName}</p>
                      <p className="text-sm text-gray-500">R$ {invoice.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  <Badge variant={
                    invoice.status === 'paid' ? 'default' :
                    invoice.status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {invoice.status === 'paid' ? 'Pago' :
                     invoice.status === 'pending' ? 'Pendente' :
                     'Vencido'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}