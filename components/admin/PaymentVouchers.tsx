'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Check, X, Eye, User, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentVouchers() {
  const { clients, updatePaymentVoucher } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Flatten all payment vouchers from all clients
  const allVouchers = clients.flatMap(client => 
    client.paymentVouchers.map(voucher => ({
      ...voucher,
      clientName: client.name,
      invoice: client.invoices.find(inv => inv.id === voucher.invoiceId),
    }))
  );

  const filteredVouchers = allVouchers.filter(voucher => {
    const matchesSearch = voucher.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || voucher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (voucherId: string, status: 'approved' | 'rejected') => {
    updatePaymentVoucher(voucherId, { status });
    toast.success(`Comprovante ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comprovantes de Pagamento</h1>
        <p className="text-gray-600">Analise e aprove os comprovantes enviados pelos clientes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar comprovantes por cliente ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{allVouchers.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {allVouchers.filter(v => v.status === 'pending').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">
                  {allVouchers.filter(v => v.status === 'approved').length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">
                  {allVouchers.filter(v => v.status === 'rejected').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vouchers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVouchers.map((voucher) => (
          <Card key={voucher.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className={`h-5 w-5 ${getStatusIcon(voucher.status)}`} />
                    Comprovante de Pagamento
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {voucher.clientName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(voucher.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor:</span>
                  <span className="text-lg font-semibold">R$ {voucher.amount.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Data do Pagamento:</span>
                  <span className="text-sm font-medium">
                    {new Date(voucher.paymentDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fatura:</span>
                  <span className="text-sm text-gray-900">
                    {voucher.invoice?.description || 'Fatura não encontrada'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-gray-600">Descrição:</span>
                <p className="text-sm text-gray-900">{voucher.description}</p>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-gray-600">Arquivo:</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Visualizar Comprovante
                  </Button>
                </div>
              </div>

              {voucher.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(voucher.id, 'approved')}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => handleUpdateStatus(voucher.id, 'rejected')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-2 border-t">
                Enviado em {new Date(voucher.createdAt).toLocaleDateString('pt-BR')} às {new Date(voucher.createdAt).toLocaleTimeString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVouchers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Nenhum comprovante encontrado' 
              : 'Nenhum comprovante foi enviado ainda'}
          </div>
        </div>
      )}
    </div>
  );
}