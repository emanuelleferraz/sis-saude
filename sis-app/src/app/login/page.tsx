'use client';
import { Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Image from "next/image";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-50 items-center justify-center p-12">
        <Image
          src="/login.png"
          alt="Monitoramento de Doenças"
          width={500}
          height={500}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Lado direito - Login */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Nome */}
          <div className="flex items-center justify-center gap-3">
              {/* Logo */}
              <img src="/logo.png" alt="Logo Vitalis" className="h-10 w-auto" />
          </div>

          {/* Bem-vindo */}
          <div className="text-center">
            <h1 className="text-3xl text-gray-800 mb-2">Bem-vindo</h1>
            <p className="text-gray-600">
              Faça login no sistema com sua conta Sistema de Saúde
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Login
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg"
              />
            </div>

            {/* Esqueceu a senha com linhas */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                Esqueceu a senha?
              </button>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Botão Entrar */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-6 text-lg"
            >
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}