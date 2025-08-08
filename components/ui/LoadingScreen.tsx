'use client';

import { Heart, Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="text-center fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-lg">
            <Heart className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">SGF Clube da Saúde</h1>
        <div className="flex items-center justify-center text-white/80">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Carregando...
        </div>
      </div>
    </div>
  );
}