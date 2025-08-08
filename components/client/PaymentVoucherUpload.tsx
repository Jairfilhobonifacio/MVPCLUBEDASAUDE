'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Invoice } from '@/contexts/DataContext';

interface PaymentVoucherUploadProps {
  clientId: string;
  invoices: Invoice[];
}

export function PaymentVoucherUpload({ clientId, invoices }: PaymentVoucherUploadProps) {
  const { addPaymentVoucher } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    paymentDate: '',
    description: '',
  });

  // Only show unpaid invoices
  const unpaidInvoices = invoices.filter(inv => inv.status !== 'paid');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const voucherData = {
        clientId,
        invoiceId: formData.invoiceId,
        amount: parseFloat(formData.amount),
        paymentDate: formData.paymentDate,
        description: formData.description,
        fileUrl: 'mock-receipt-' + Date.now() + '.pdf', // Mock file URL
        status: 'pending' as const,
      };

      addPaymentVoucher(voucherData);
      
      // Reset form
      setFormData({
        invoiceId: '',
        amount: '',
        paymentDate: '',
        description: '',
      });

      toast.success('Comprovante enviado com sucesso!', {
        description: 'Aguarde a análise do administrador'
      });
    } catch (error) {
      toast.error('Erro ao enviar comprovante');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill amount when invoice is selected
    if (field === 'invoiceId' && value) {
      const selectedInvoice = unpaidInvoices.find(inv => inv.id === value);
      if (selectedInvoice) {
        setFormData(prev => ({ ...prev, amount: selectedInvoice.amount.toString() }));
      }
    }
  };

  if (unpaidInvoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Enviar Comprovante
          </CardTitle>
          <CardDescription>
            Todas as suas faturas estão em dia!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <p className="text-green-600 font-medium">Parabéns!</p>
          <p className="text-sm text-gray-500">Você não possui faturas pendentes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Enviar Comprovante
        </CardTitle>
        <CardDescription>
          Envie o comprovante de pagamento das suas faturas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoice">Fatura *</Label>
            <Select 
              value={formData.invoiceId} 
              onValueChange={(value) => handleChange('invoiceId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a fatura" />
              </SelectTrigger>
              <SelectContent>
                {unpaidInvoices.map((invoice) => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    {invoice.description} - R$ {invoice.amount.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor Pago (R$) *</Label>
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
              <Label htmlFor="paymentDate">Data do Pagamento *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleChange('paymentDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Ex: Pagamento via PIX, Transferência bancária, etc."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Comprovante *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Clique para selecionar ou arraste o arquivo aqui
              </p>
              <p className="text-xs text-gray-500">
                Formatos aceitos: PDF, JPG, PNG (máx. 5MB)
              </p>
              <Input
                id="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando Comprovante...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Comprovante
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}