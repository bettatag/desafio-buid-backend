'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo ao seu painel de controle. Gerencie suas instâncias e agentes de IA.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📱</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Criar Instância</CardTitle>
                  <CardDescription>
                    Nova instância Evolution API
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/instances">
                <Button className="w-full">
                  Criar Instância
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-xl">🤖</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Configurar IA</CardTitle>
                  <CardDescription>
                    Novo agente inteligente
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/ai-agents">
                <Button className="w-full">
                  Criar Agente
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 text-xl">💬</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Iniciar Chat</CardTitle>
                  <CardDescription>
                    Conversar com IA
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/conversations">
                <Button className="w-full">
                  Novo Chat
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Instâncias</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Agentes Ativos</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Conversas</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Mensagens Enviadas</CardDescription>
              <CardTitle className="text-2xl">0</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Getting started guide */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Primeiros Passos</CardTitle>
            <CardDescription>
              Siga estas etapas para começar a usar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium">Crie uma instância Evolution API</h4>
                  <p className="text-sm text-gray-600">
                    Configure uma nova instância para conectar com o WhatsApp
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium">Configure um agente de IA</h4>
                  <p className="text-sm text-gray-600">
                    Crie um bot inteligente com OpenAI para responder mensagens automaticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium">Teste sua configuração</h4>
                  <p className="text-sm text-gray-600">
                    Use a interface de chat para testar seu agente antes de colocar em produção
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
