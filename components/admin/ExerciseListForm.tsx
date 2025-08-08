'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Plus, Trash2, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Exercise, ExerciseList } from '@/contexts/DataContext';

interface ExerciseListFormProps {
  listId?: string | null;
  onClose: () => void;
}

export function ExerciseListForm({ listId, onClose }: ExerciseListFormProps) {
  const { clients, addExerciseList, updateExerciseList } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [listName, setListName] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const isEditing = !!listId;
  
  // Find the exercise list if editing
  const existingList = isEditing 
    ? clients.flatMap(c => c.exerciseLists).find(list => list.id === listId)
    : null;

  useEffect(() => {
    if (existingList) {
      setSelectedClientId(existingList.clientId);
      setListName(existingList.name);
      setListDescription(existingList.description);
      setExercises(existingList.exercises);
    } else {
      // Initialize with one empty exercise
      setExercises([createEmptyExercise()]);
    }
  }, [existingList]);

  function createEmptyExercise(): Exercise {
    return {
      id: Date.now().toString() + Math.random(),
      name: '',
      description: '',
      sets: 3,
      reps: '10-12',
      weight: '',
      restTime: '60s',
      imageUrl: '',
      videoUrl: '',
      instructions: '',
    };
  }

  const handleAddExercise = () => {
    setExercises([...exercises, createEmptyExercise()]);
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(ex => ex.id !== exerciseId));
    }
  };

  const handleExerciseChange = (exerciseId: string, field: keyof Exercise, value: string | number) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      toast.error('Selecione um cliente');
      return;
    }

    const validExercises = exercises.filter(ex => ex.name.trim() !== '');
    if (validExercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const listData = {
        clientId: selectedClientId,
        name: listName,
        description: listDescription,
        exercises: validExercises,
      };

      if (isEditing && listId) {
        updateExerciseList(listId, listData);
        toast.success('Lista de exercícios atualizada com sucesso!');
      } else {
        addExerciseList(listData);
        toast.success('Lista de exercícios criada com sucesso!');
      }

      onClose();
    } catch (error) {
      toast.error('Erro ao salvar lista de exercícios');
    } finally {
      setIsLoading(false);
    }
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
            {isEditing ? 'Editar Lista de Exercícios' : 'Nova Lista de Exercícios'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Atualize a lista de exercícios' : 'Crie uma nova lista personalizada para o cliente'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select 
                  value={selectedClientId} 
                  onValueChange={setSelectedClientId}
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
                <Label htmlFor="listName">Nome da Lista *</Label>
                <Input
                  id="listName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Ex: Treino A - Peito e Tríceps"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listDescription">Descrição</Label>
              <Textarea
                id="listDescription"
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="Descreva o objetivo desta lista de exercícios"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exercícios ({exercises.length})</CardTitle>
            <Button type="button" onClick={handleAddExercise} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Exercício
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {exercises.map((exercise, index) => (
              <div key={exercise.id}>
                {index > 0 && <Separator />}
                
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Exercício {index + 1}</h4>
                    {exercises.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExercise(exercise.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Exercício *</Label>
                      <Input
                        value={exercise.name}
                        onChange={(e) => handleExerciseChange(exercise.id, 'name', e.target.value)}
                        placeholder="Ex: Supino Reto"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Input
                        value={exercise.description}
                        onChange={(e) => handleExerciseChange(exercise.id, 'description', e.target.value)}
                        placeholder="Ex: Exercício para peito com barra"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Séries</Label>
                      <Input
                        type="number"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(exercise.id, 'sets', parseInt(e.target.value) || 3)}
                        min="1"
                        max="10"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Repetições</Label>
                      <Input
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(exercise.id, 'reps', e.target.value)}
                        placeholder="Ex: 8-12, 15, Máximo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Peso</Label>
                      <Input
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(exercise.id, 'weight', e.target.value)}
                        placeholder="Ex: 80kg, Peso corporal"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descanso</Label>
                      <Input
                        value={exercise.restTime}
                        onChange={(e) => handleExerciseChange(exercise.id, 'restTime', e.target.value)}
                        placeholder="Ex: 60s, 2min"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Instruções</Label>
                    <Textarea
                      value={exercise.instructions}
                      onChange={(e) => handleExerciseChange(exercise.id, 'instructions', e.target.value)}
                      placeholder="Instruções detalhadas sobre como executar o exercício"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>URL da Imagem</Label>
                      <Input
                        value={exercise.imageUrl}
                        onChange={(e) => handleExerciseChange(exercise.id, 'imageUrl', e.target.value)}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>URL do Vídeo</Label>
                      <Input
                        value={exercise.videoUrl}
                        onChange={(e) => handleExerciseChange(exercise.id, 'videoUrl', e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
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
                {isEditing ? 'Atualizar Lista' : 'Criar Lista'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}