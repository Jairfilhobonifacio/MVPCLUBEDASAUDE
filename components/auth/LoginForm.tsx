'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Email ou senha inválidos');
      toast.error('Falha no login', {
        description: 'Verifique suas credenciais e tente novamente'
      });
    } else {
      toast.success('Login realizado com sucesso!');
    }
  };

  const handleDemoLogin = (userType: 'admin' | 'client') => {
    if (userType === 'admin') {
      setEmail('admin@sgf.com');
      setPassword('123456');
    } else {
      setEmail('joao@email.com');
      setPassword('123456');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SGF Clube da Saúde</h1>
          <p className="text-white/80">Sistema de Gerenciamento de Fichas</p>
        </div>

        <Card className="glass-effect border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-white">Entrar no Sistema</CardTitle>
            <CardDescription className="text-white/70">
              Digite suas credenciais para acessar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {error && (
                <Alert className="bg-red-500/20 border-red-500/30">
                  <AlertDescription className="text-white">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-2">
              <p className="text-white/70 text-sm text-center">Acesso de demonstração:</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => handleDemoLogin('admin')}
                >
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => handleDemoLogin('client')}
                >
                  Cliente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}