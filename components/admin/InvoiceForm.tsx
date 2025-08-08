'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceFormProps {
  invoiceId?: string | null;
  onClose: () => void;
}

export function InvoiceForm({ invoiceId, onClose }: InvoiceFormProps) {
  const { clients, addInvoice, updateInvoice } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    description: '',
    dueDate: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue',
  });

  const isEditing = !!invoiceId;
  
  // Find the invoice if editing
  const existingInvoice = isEditing 
    ? clients.flatMap(c => c.invoices).find(inv => inv.id === invoiceId)
    : null;

  useEffect(() => {
    if (existingInvoice) {
      setFormData({
        clientId: existingInvoice.clientId,
        amount: existingInvoice.amount.toString(),
        description: existingInvoice.description,
        dueDate: existingInvoice.dueDate,
        status: existingInvoice.status,
      });
    }
  }, [existingInvoice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const invoiceData = {
        clientId: formData.clientId,
        amount: parseFloat(formData.amount),
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status,
      };

      if (isEditing && invoiceId) {
        updateInvoice(invoiceId, invoiceData);
        toast.success('Fatura atualizada com sucesso!');
      } else {
        addInvoice(invoiceData);
        toast.success('Fatura criada com sucesso!');
      }

      onClose();
    } catch (error) {
      toast.error('Erro ao salvar fatura');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Fatura' : 'Nova Fatura'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Atualize as informações da fatura' : 'Crie uma nova fatura para o cliente'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Fatura</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select 
                  value={formData.clientId} 
                  onValueChange={(value) => handleChange('clientId', value)}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="150.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Data de Vencimento *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Ex: Plano Mensal - Janeiro 2024"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? 'Atualizar' : 'Criar Fatura'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}