'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CreateAIAgentForm } from '@/components/forms/CreateAIAgentForm';
import api from '@/lib/api';

export default function AIAgentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [instances, setInstances] = useState<string[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>('');

  // Simular busca de instâncias (você pode implementar uma API para isso)
  useEffect(() => {
    // Por enquanto, vamos usar dados simulados
    setInstances(['minha-instancia', 'loja-principal', 'suporte-cliente']);
    setSelectedInstance('minha-instancia');
  }, []);

  const handleAgentCreated = (agent: any) => {
    setAgents(prev => [...prev, agent]);
    setShowCreateForm(false);
  };

  const toggleAgentStatus = async (instanceName: string, agentId: string, currentStatus: boolean) => {
    try {
      await api.put(`/openai/changeStatus/${instanceName}/${agentId}`, {
        enabled: !currentStatus
      });
      
      setAgents(prev => prev.map(agent => 
        agent.bot.id === agentId 
          ? { ...agent, bot: { ...agent.bot, enabled: !currentStatus } }
          : agent
      ));
    } catch (error) {
      console.error('Erro ao alterar status do agente:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agentes de IA</h1>
            <p className="text-gray-600 mt-2">
              Configure bots inteligentes com OpenAI para automatizar conversas
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6"
          >
            {showCreateForm ? 'Cancelar' : 'Novo Agente'}
          </Button>
        </div>

        {/* Instance Selector */}
        {instances.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selecionar Instância</CardTitle>
              <CardDescription>
                Escolha a instância para gerenciar os agentes de IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <select
                value={selectedInstance}
                onChange={(e) => setSelectedInstance(e.target.value)}
                className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                {instances.map(instance => (
                  <option key={instance} value={instance}>
                    {instance}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>
        )}

        {showCreateForm && selectedInstance && (
          <CreateAIAgentForm 
            instanceName={selectedInstance}
            onSuccess={handleAgentCreated} 
          />
        )}

        {/* Agents List */}
        <div className="space-y-4">
          {agents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-400 text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum agente criado
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Crie seu primeiro agente de IA para automatizar conversas no WhatsApp
                </p>
                {selectedInstance && (
                  <Button onClick={() => setShowCreateForm(true)}>
                    Criar Primeiro Agente
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {agent.bot?.name || 'Agente IA'}
                      </CardTitle>
                      <div className={`h-3 w-3 rounded-full ${
                        agent.bot?.enabled ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <CardDescription>
                      Tipo: {agent.bot?.botType || 'chatCompletion'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Modelo:</span>{' '}
                        <span className="text-gray-600">
                          {agent.bot?.model || 'gpt-3.5-turbo'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Temperatura:</span>{' '}
                        <span className="text-gray-600">
                          {agent.bot?.temperature || 0.7}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Max Tokens:</span>{' '}
                        <span className="text-gray-600">
                          {agent.bot?.maxTokens || 1000}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={`${
                          agent.bot?.enabled ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {agent.bot?.enabled ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => toggleAgentStatus(
                          selectedInstance, 
                          agent.bot.id, 
                          agent.bot.enabled
                        )}
                      >
                        {agent.bot?.enabled ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Editar
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
            <CardTitle>🧠 Dicas para Agentes de IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Mensagens do Sistema:</strong> Defina claramente o papel e comportamento do agente
              </div>
              <div>
                <strong>Temperatura:</strong> Valores baixos (0.1-0.3) para respostas mais precisas, valores altos (0.7-1.0) para mais criatividade
              </div>
              <div>
                <strong>Triggers:</strong> Configure palavras-chave para ativar o agente apenas quando necessário
              </div>
              <div>
                <strong>Tokens:</strong> Limite o número de tokens para controlar custos e tempo de resposta
              </div>
              <div>
                <strong>Teste:</strong> Use a interface de conversas para testar seu agente antes de ativá-lo
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
