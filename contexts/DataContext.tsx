'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: string;
  medicalConditions: string;
  goals: string;
  createdAt: string;
  updatedAt: string;
  invoices: Invoice[];
  exerciseLists: ExerciseList[];
  paymentVouchers: PaymentVoucher[];
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  sets: number;
  reps: string;
  weight?: string;
  restTime: string;
  imageUrl?: string;
  videoUrl?: string;
  instructions: string;
}

export interface ExerciseList {
  id: string;
  clientId: string;
  name: string;
  description: string;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface PaymentVoucher {
  id: string;
  clientId: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  description: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface DataContextType {
  clients: ClientRecord[];
  addClient: (client: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt' | 'invoices' | 'exerciseLists' | 'paymentVouchers'>) => void;
  updateClient: (id: string, client: Partial<ClientRecord>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => ClientRecord | undefined;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  addExerciseList: (exerciseList: Omit<ExerciseList, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExerciseList: (id: string, exerciseList: Partial<ExerciseList>) => void;
  addPaymentVoucher: (voucher: Omit<PaymentVoucher, 'id' | 'createdAt'>) => void;
  updatePaymentVoucher: (id: string, voucher: Partial<PaymentVoucher>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data for demonstration
const mockClients: ClientRecord[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    dateOfBirth: '1990-05-15',
    emergencyContact: 'Maria Silva - (11) 88888-8888',
    medicalConditions: 'Nenhuma',
    goals: 'Perder peso e ganhar massa muscular',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    invoices: [
      {
        id: '1',
        clientId: '1',
        amount: 150.00,
        description: 'Plano Mensal - Janeiro 2024',
        dueDate: '2024-01-31',
        status: 'paid',
        createdAt: '2024-01-01T10:00:00Z',
      },
      {
        id: '2',
        clientId: '1',
        amount: 150.00,
        description: 'Plano Mensal - Fevereiro 2024',
        dueDate: '2024-02-29',
        status: 'pending',
        createdAt: '2024-02-01T10:00:00Z',
      },
    ],
    exerciseLists: [
      {
        id: '1',
        clientId: '1',
        name: 'Treino A - Peito e Tríceps',
        description: 'Treino focado em peito e tríceps para ganho de massa muscular',
        exercises: [
          {
            id: '1',
            name: 'Supino Reto',
            description: 'Exercício para peito com barra',
            sets: 4,
            reps: '8-12',
            weight: '80kg',
            restTime: '90s',
            instructions: 'Manter a barra controlada, descer até o peito e subir de forma explosiva',
            imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
          },
          {
            id: '2',
            name: 'Tríceps Pulley',
            description: 'Exercício para tríceps no cabo',
            sets: 3,
            reps: '12-15',
            restTime: '60s',
            instructions: 'Manter os cotovelos fixos e estender os braços completamente',
            imageUrl: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg',
          },
        ],
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z',
      },
    ],
    paymentVouchers: [
      {
        id: '1',
        clientId: '1',
        invoiceId: '1',
        amount: 150.00,
        paymentDate: '2024-01-30',
        description: 'Pagamento via PIX',
        fileUrl: 'mock-receipt.pdf',
        status: 'approved',
        createdAt: '2024-01-30T15:30:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 77777-7777',
    dateOfBirth: '1985-08-22',
    emergencyContact: 'Pedro Santos - (11) 66666-6666',
    medicalConditions: 'Hipertensão controlada',
    goals: 'Melhorar condicionamento físico e flexibilidade',
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z',
    invoices: [
      {
        id: '3',
        clientId: '2',
        amount: 150.00,
        description: 'Plano Mensal - Janeiro 2024',
        dueDate: '2024-01-31',
        status: 'overdue',
        createdAt: '2024-01-01T10:00:00Z',
      },
    ],
    exerciseLists: [],
    paymentVouchers: [],
  },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<ClientRecord[]>([]);

  useEffect(() => {
    // Load data from localStorage or use mock data
    const storedClients = localStorage.getItem('sgf_clients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      setClients(mockClients);
      localStorage.setItem('sgf_clients', JSON.stringify(mockClients));
    }
  }, []);

  const saveClients = (updatedClients: ClientRecord[]) => {
    setClients(updatedClients);
    localStorage.setItem('sgf_clients', JSON.stringify(updatedClients));
  };

  const addClient = (clientData: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt' | 'invoices' | 'exerciseLists' | 'paymentVouchers'>) => {
    const newClient: ClientRecord = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoices: [],
      exerciseLists: [],
      paymentVouchers: [],
    };
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
  };

  const updateClient = (id: string, clientData: Partial<ClientRecord>) => {
    const updatedClients = clients.map(client =>
      client.id === id
        ? { ...client, ...clientData, updatedAt: new Date().toISOString() }
        : client
    );
    saveClients(updatedClients);
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(client => client.id !== id);
    saveClients(updatedClients);
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedClients = clients.map(client =>
      client.id === invoiceData.clientId
        ? { ...client, invoices: [...client.invoices, newInvoice] }
        : client
    );
    saveClients(updatedClients);
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    const updatedClients = clients.map(client => ({
      ...client,
      invoices: client.invoices.map(invoice =>
        invoice.id === id ? { ...invoice, ...invoiceData } : invoice
      ),
    }));
    saveClients(updatedClients);
  };

  const addExerciseList = (exerciseListData: Omit<ExerciseList, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExerciseList: ExerciseList = {
      ...exerciseListData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedClients = clients.map(client =>
      client.id === exerciseListData.clientId
        ? { ...client, exerciseLists: [...client.exerciseLists, newExerciseList] }
        : client
    );
    saveClients(updatedClients);
  };

  const updateExerciseList = (id: string, exerciseListData: Partial<ExerciseList>) => {
    const updatedClients = clients.map(client => ({
      ...client,
      exerciseLists: client.exerciseLists.map(list =>
        list.id === id ? { ...list, ...exerciseListData, updatedAt: new Date().toISOString() } : list
      ),
    }));
    saveClients(updatedClients);
  };

  const addPaymentVoucher = (voucherData: Omit<PaymentVoucher, 'id' | 'createdAt'>) => {
    const newVoucher: PaymentVoucher = {
      ...voucherData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedClients = clients.map(client =>
      client.id === voucherData.clientId
        ? { ...client, paymentVouchers: [...client.paymentVouchers, newVoucher] }
        : client
    );
    saveClients(updatedClients);
  };

  const updatePaymentVoucher = (id: string, voucherData: Partial<PaymentVoucher>) => {
    const updatedClients = clients.map(client => ({
      ...client,
      paymentVouchers: client.paymentVouchers.map(voucher =>
        voucher.id === id ? { ...voucher, ...voucherData } : voucher
      ),
    }));
    saveClients(updatedClients);
  };

  return (
    <DataContext.Provider value={{
      clients,
      addClient,
      updateClient,
      deleteClient,
      getClientById,
      addInvoice,
      updateInvoice,
      addExerciseList,
      updateExerciseList,
      addPaymentVoucher,
      updatePaymentVoucher,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}