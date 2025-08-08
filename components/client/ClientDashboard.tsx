'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PaymentVoucherUpload } from './PaymentVoucherUpload';
import { ExerciseViewer } from './ExerciseViewer';
import { 
  LogOut, 
  User, 
  FileText, 
  Activity, 
  CreditCard,
  Calendar,
  Target,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export function ClientDashboard() {
  const { user, logout } = useAuth();
  const { getClientById } = useData();

  const clientData = getClientById(user?.id || '');

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Dados do cliente não encontrados</p>
          <Button onClick={logout}>Voltar ao Login</Button>
        </div>
      </div>
    );
  }

  const pendingInvoices = clientData.invoices.filter(inv => inv.status === 'pending');
  const overdueInvoices = clientData.invoices.filter(inv => inv.status === 'overdue');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Bem-vindo, {clientData.name}!
                </h1>
                <p className="text-sm text-gray-500">Área do Cliente - SGF Clube da Saúde</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={logout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Alerts */}
          {(pendingInvoices.length > 0 || overdueInvoices.length > 0) && (
            <div className="space-y-4">
              {overdueInvoices.length > 0 && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">
                          Você tem {overdueInvoices.length} fatura(s) vencida(s)
                        </p>
                        <p className="text-sm text-red-600">
                          Regularize sua situação o quanto antes para evitar a suspensão dos serviços.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {pendingInvoices.length > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-yellow-800">
                          Você tem {pendingInvoices.length} fatura(s) pendente(s)
                        </p>
                        <p className="text-sm text-yellow-600">
                          Faça o pagamento até a data de vencimento para manter seus treinos em dia.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Info */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {clientData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{clientData.name}</CardTitle>
                  <CardDescription>Cliente SGF</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{clientData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{clientData.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Nascimento: {new Date(clientData.dateOfBirth).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Target className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Objetivos:</p>
                        <p className="text-sm text-gray-600">{clientData.goals}</p>
                      </div>
                    </div>
                  </div>

                  {clientData.medicalConditions && clientData.medicalConditions !== 'Nenhuma' && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Restrições Médicas:</p>
                            <p className="text-sm text-gray-600">{clientData.medicalConditions}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="text-xs text-gray-500 pt-2">
                    Cliente desde {new Date(clientData.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{clientData.exerciseLists.length}</p>
                    <p className="text-sm text-gray-600">Treinos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{clientData.invoices.length}</p>
                    <p className="text-sm text-gray-600">Faturas</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Middle Column - Exercise Lists */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Meus Treinos
                  </CardTitle>
                  <CardDescription>
                    Listas de exercícios personalizadas para você
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientData.exerciseLists.length > 0 ? (
                    <div className="space-y-4">
                      {clientData.exerciseLists.map((list) => (
                        <ExerciseViewer key={list.id} exerciseList={list} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhum treino disponível ainda</p>
                      <p className="text-sm">Aguarde seu personal trainer criar sua lista de exercícios</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Invoices & Payments */}
            <div className="space-y-6">
              {/* Invoices */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Minhas Faturas
                  </CardTitle>
                  <CardDescription>
                    Acompanhe seus pagamentos e vencimentos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {clientData.invoices.length > 0 ? (
                    <div className="space-y-4">
                      {clientData.invoices.slice(0, 5).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{invoice.description}</p>
                            <p className="text-xs text-gray-500">
                              Vence em {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">R$ {invoice.amount.toFixed(2)}</p>
                            <Badge variant={
                              invoice.status === 'paid' ? 'default' :
                              invoice.status === 'pending' ? 'secondary' :
                              'destructive'
                            } className="text-xs">
                              {invoice.status === 'paid' ? 'Pago' :
                               invoice.status === 'pending' ? 'Pendente' :
                               'Vencido'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Nenhuma fatura encontrada</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Upload */}
              <PaymentVoucherUpload clientId={clientData.id} invoices={clientData.invoices} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}