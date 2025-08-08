'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Play, Image, Clock, Weight, RotateCcw } from 'lucide-react';
import type { ExerciseList } from '@/contexts/DataContext';

interface ExerciseViewerProps {
  exerciseList: ExerciseList;
}

export function ExerciseViewer({ exerciseList }: ExerciseViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="hover-lift">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{exerciseList.name}</CardTitle>
                <CardDescription className="mt-1">
                  {exerciseList.description}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {exerciseList.exercises.length} exercícios
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {exerciseList.exercises.map((exercise, index) => (
                <div key={exercise.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{exercise.name}</h4>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                      )}
                    </div>
                    <Badge variant="outline" className="ml-2">
                      #{index + 1}
                    </Badge>
                  </div>

                  {/* Exercise Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <RotateCcw className="h-4 w-4 text-primary" />
                      <span><strong>{exercise.sets}</strong> séries</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                        {exercise.reps} reps
                      </span>
                    </div>
                    {exercise.weight && (
                      <div className="flex items-center gap-2 text-sm">
                        <Weight className="h-4 w-4 text-primary" />
                        <span>{exercise.weight}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{exercise.restTime}</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  {exercise.instructions && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h5 className="font-medium text-blue-900 mb-1">Instruções:</h5>
                      <p className="text-sm text-blue-800">{exercise.instructions}</p>
                    </div>
                  )}

                  {/* Media */}
                  {(exercise.imageUrl || exercise.videoUrl) && (
                    <div className="flex gap-2">
                      {exercise.imageUrl && (
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Image className="h-4 w-4" />
                          Ver Imagem
                        </Button>
                      )}
                      {exercise.videoUrl && (
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          Ver Vídeo
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Image Preview */}
                  {exercise.imageUrl && (
                    <div className="mt-3">
                      <img
                        src={exercise.imageUrl}
                        alt={exercise.name}
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t text-xs text-gray-500">
              Última atualização: {new Date(exerciseList.updatedAt).toLocaleDateString('pt-BR')} às {new Date(exerciseList.updatedAt).toLocaleTimeString('pt-BR')}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}