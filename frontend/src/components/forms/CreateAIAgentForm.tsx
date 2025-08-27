'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createOpenAIBotSchema, CreateOpenAIBotFormData } from '@/lib/validations';
import api from '@/lib/api';

interface CreateAIAgentFormProps {
  instanceName?: string;
  onSuccess?: (agent: any) => void;
}

export function CreateAIAgentForm({ instanceName, onSuccess }: CreateAIAgentFormProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateOpenAIBotFormData>({
    resolver: zodResolver(createOpenAIBotSchema),
    defaultValues: {
      enabled: true,
      botType: 'chatCompletion',
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
      triggerType: 'all',
      triggerOperator: 'contains',
      systemMessages: ['Você é um assistente útil e prestativo.'],
      assistantMessages: ['Olá! Como posso ajudá-lo hoje?'],
    },
  });

  const botType = watch('botType');

  const onSubmit = async (data: CreateOpenAIBotFormData) => {
    if (!instanceName) {
      setError('Nome da instância é obrigatório');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const response = await api.post(`/openai/create/${instanceName}`, data);
      
      reset();
      onSuccess?.(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar agente IA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Criar Agente IA</CardTitle>
        <CardDescription>
          Configure um bot inteligente com OpenAI para automatizar conversas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  placeholder="Assistente de Vendas"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="openaiCredsId">ID das Credenciais OpenAI</Label>
                <Input
                  id="openaiCredsId"
                  placeholder="creds-uuid-456"
                  {...register('openaiCredsId')}
                  className={errors.openaiCredsId ? 'border-red-500' : ''}
                />
                {errors.openaiCredsId && (
                  <p className="text-sm text-red-600">{errors.openaiCredsId.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="botType">Tipo do Bot</Label>
                <select
                  id="botType"
                  {...register('botType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="chatCompletion">Chat Completion</option>
                  <option value="assistant">Assistant</option>
                </select>
              </div>

              {botType === 'assistant' && (
                <div className="space-y-2">
                  <Label htmlFor="assistantId">ID do Assistente</Label>
                  <Input
                    id="assistantId"
                    placeholder="asst_abc123"
                    {...register('assistantId')}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="model">Modelo OpenAI</Label>
                <select
                  id="model"
                  {...register('model')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de IA</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperatura (0-2)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  {...register('temperature', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">
                  Controla a criatividade das respostas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Máximo de Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="4000"
                  {...register('maxTokens', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">
                  Limite de tokens por resposta
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topP">Top P (0-1)</Label>
                <Input
                  id="topP"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  {...register('topP', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500">
                  Controla a diversidade das respostas
                </p>
              </div>
            </div>
          </div>

          {/* Trigger Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Trigger</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="triggerType">Tipo de Trigger</Label>
                <select
                  id="triggerType"
                  {...register('triggerType')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="all">Todas as mensagens</option>
                  <option value="keyword">Palavra-chave</option>
                  <option value="none">Nenhum</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="triggerOperator">Operador</Label>
                <select
                  id="triggerOperator"
                  {...register('triggerOperator')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="contains">Contém</option>
                  <option value="equals">Igual</option>
                  <option value="startsWith">Começa com</option>
                  <option value="endsWith">Termina com</option>
                  <option value="regex">Regex</option>
                  <option value="none">Nenhum</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="triggerValue">Valor do Trigger</Label>
                <Input
                  id="triggerValue"
                  placeholder="olá, oi, ajuda"
                  {...register('triggerValue')}
                />
              </div>
            </div>
          </div>

          {/* System Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mensagens do Sistema</h3>
            
            <div className="space-y-2">
              <Label htmlFor="systemMessages">Instruções para o Agente</Label>
              <textarea
                id="systemMessages"
                rows={4}
                placeholder="Você é um assistente útil e prestativo..."
                {...register('systemMessages.0')}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-gray-500">
                Defina como o agente deve se comportar e responder
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assistantMessages">Mensagem de Boas-vindas</Label>
              <Input
                id="assistantMessages"
                placeholder="Olá! Como posso ajudá-lo hoje?"
                {...register('assistantMessages.0')}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <input
              id="enabled"
              type="checkbox"
              {...register('enabled')}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label htmlFor="enabled" className="text-sm">
              Ativar agente imediatamente
            </Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={isLoading}
            >
              Limpar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Agente'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
