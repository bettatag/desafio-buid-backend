'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CreateInstanceForm } from '@/components/forms/CreateInstanceForm';

export default function InstancesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [instances, setInstances] = useState<any[]>([]);

  const handleInstanceCreated = (instance: any) => {
    setInstances(prev => [...prev, instance]);
    setShowCreateForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Instâncias Evolution API</h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas instâncias do WhatsApp Business
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6"
          >
            {showCreateForm ? 'Cancelar' : 'Nova Instância'}
          </Button>
        </div>

        {showCreateForm && (
          <CreateInstanceForm onSuccess={handleInstanceCreated} />
        )}

        {/* Instances List */}
        <div className="space-y-4">
          {instances.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-400 text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma instância criada
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Crie sua primeira instância Evolution API para começar a usar o WhatsApp Business
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  Criar Primeira Instância
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instances.map((instance, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {instance.instance?.instanceName || 'Instância'}
                      </CardTitle>
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                    </div>
                    <CardDescription>
                      Status: {instance.instance?.status || 'Ativo'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">ID:</span>{' '}
                        <span className="text-gray-600">
                          {instance.instance?.instanceId || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">API Key:</span>{' '}
                        <span className="text-gray-600 font-mono text-xs">
                          {instance.hash?.apikey ? 
                            `${instance.hash.apikey.substring(0, 8)}...` : 'N/A'
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Configurar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        QR Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Dicas para Instâncias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Nome da Instância:</strong> Use nomes descritivos como "vendas-loja1" ou "suporte-cliente"
              </div>
              <div>
                <strong>Token:</strong> Mantenha seu token seguro. Ele será usado para autenticar as requisições à API
              </div>
              <div>
                <strong>Webhook:</strong> Configure uma URL válida para receber eventos em tempo real
              </div>
              <div>
                <strong>QR Code:</strong> Após criar a instância, use o QR Code para conectar seu WhatsApp
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
