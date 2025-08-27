'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createInstanceSchema, CreateInstanceFormData } from '@/lib/validations';
import api from '@/lib/api';

interface CreateInstanceFormProps {
  onSuccess?: (instance: any) => void;
}

const defaultEvents = [
  'MESSAGE_RECEIVED',
  'CONNECTION_UPDATE',
  'QRCODE_UPDATED',
  'MESSAGE_SENT',
  'PRESENCE_UPDATE'
];

export function CreateInstanceForm({ onSuccess }: CreateInstanceFormProps) {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateInstanceFormData>({
    resolver: zodResolver(createInstanceSchema),
    defaultValues: {
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
      webhook_by_events: true,
      events: defaultEvents,
      reject_call: false,
      groups_ignore: false,
      always_online: true,
      read_messages: true,
      read_status: true,
      websocket_enabled: false,
      websocket_events: [],
    },
  });

  const onSubmit = async (data: CreateInstanceFormData) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await api.post('/evolution/create-instance', data);
      
      reset();
      onSuccess?.(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar instância');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Criar Nova Instância Evolution API</CardTitle>
        <CardDescription>
          Configure uma nova instância para conectar com o WhatsApp Business
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
                <Label htmlFor="instanceName">Nome da Instância</Label>
                <Input
                  id="instanceName"
                  placeholder="minha-instancia"
                  {...register('instanceName')}
                  className={errors.instanceName ? 'border-red-500' : ''}
                />
                {errors.instanceName && (
                  <p className="text-sm text-red-600">{errors.instanceName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Token de Acesso</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Token com pelo menos 10 caracteres"
                  {...register('token')}
                  className={errors.token ? 'border-red-500' : ''}
                />
                {errors.token && (
                  <p className="text-sm text-red-600">{errors.token.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número do WhatsApp</Label>
                <Input
                  id="number"
                  placeholder="5511999999999"
                  {...register('number')}
                  className={errors.number ? 'border-red-500' : ''}
                />
                {errors.number && (
                  <p className="text-sm text-red-600">{errors.number.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Inclua o código do país (ex: 55 para Brasil)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook">URL do Webhook</Label>
                <Input
                  id="webhook"
                  type="url"
                  placeholder="https://seu-webhook.com/callback"
                  {...register('webhook')}
                  className={errors.webhook ? 'border-red-500' : ''}
                />
                {errors.webhook && (
                  <p className="text-sm text-red-600">{errors.webhook.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="qrcode"
                  type="checkbox"
                  {...register('qrcode')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="qrcode" className="text-sm">
                  Gerar QR Code
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="webhook_by_events"
                  type="checkbox"
                  {...register('webhook_by_events')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="webhook_by_events" className="text-sm">
                  Webhook por Eventos
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="always_online"
                  type="checkbox"
                  {...register('always_online')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="always_online" className="text-sm">
                  Sempre Online
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="read_messages"
                  type="checkbox"
                  {...register('read_messages')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="read_messages" className="text-sm">
                  Ler Mensagens
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="read_status"
                  type="checkbox"
                  {...register('read_status')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="read_status" className="text-sm">
                  Ler Status
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="groups_ignore"
                  type="checkbox"
                  {...register('groups_ignore')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <Label htmlFor="groups_ignore" className="text-sm">
                  Ignorar Grupos
                </Label>
              </div>
            </div>
          </div>

          {/* Call Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações de Chamadas</h3>
            
            <div className="flex items-center space-x-2">
              <input
                id="reject_call"
                type="checkbox"
                {...register('reject_call')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <Label htmlFor="reject_call" className="text-sm">
                Rejeitar Chamadas Automaticamente
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="msg_call">Mensagem de Chamada Rejeitada</Label>
              <Input
                id="msg_call"
                placeholder="Chamadas não são aceitas"
                {...register('msg_call')}
              />
              <p className="text-xs text-gray-500">
                Mensagem enviada quando uma chamada é rejeitada
              </p>
            </div>
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
              {isLoading ? 'Criando...' : 'Criar Instância'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
