'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ExerciseListForm } from './ExerciseListForm';
import { Plus, Search, Edit, Trash2, Activity, Users } from 'lucide-react';
import { toast } from 'sonner';

export function ExerciseManagement() {
  const { clients } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingList, setEditingList] = useState<string | null>(null);

  // Flatten all exercise lists from all clients
  const allExerciseLists = clients.flatMap(client => 
    client.exerciseLists.map(list => ({
      ...list,
      clientName: client.name,
      clientId: client.id
    }))
  );

  const filteredLists = allExerciseLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         list.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClient = selectedClient === 'all' || list.clientId === selectedClient;
    return matchesSearch && matchesClient;
  });

  const handleEdit = (listId: string) => {
    setEditingList(listId);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingList(null);
  };

  if (showForm) {
    return (
      <ExerciseListForm
        listId={editingList}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listas de Exercícios</h1>
          <p className="text-gray-600">Gerencie as listas de exercícios dos clientes</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar listas de exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Exercise Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLists.map((list) => (
          <Card key={list.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    {list.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {list.description}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(list.id)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{list.clientName}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Exercícios:</span>
                  <Badge variant="secondary">{list.exercises.length}</Badge>
                </div>
                
                {list.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="text-sm text-gray-600 flex items-center justify-between">
                    <span className="truncate">{exercise.name}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {exercise.sets}x{exercise.reps}
                    </span>
                  </div>
                ))}
                
                {list.exercises.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{list.exercises.length - 3} mais exercícios
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t">
                Atualizado em {new Date(list.updatedAt).toLocaleDateString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm || selectedClient !== 'all' 
              ? 'Nenhuma lista encontrada' 
              : 'Nenhuma lista de exercícios cadastrada'}
          </div>
          {!searchTerm && selectedClient === 'all' && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Lista
            </Button>
          )}
        </div>
      )}
    </div>
  );
}