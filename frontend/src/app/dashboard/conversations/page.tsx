'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ChatInterface } from '@/components/features/ChatInterface';
import { Conversation } from '@/types';
import api from '@/lib/api';

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setShowChat(true);
  };

  const handleConversationCreated = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    loadConversations(); // Recarregar lista
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowChat(true);
  };

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conversa?')) return;

    try {
      await api.delete(`/conversations/${conversationId}`);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (selectedConversationId === conversationId) {
        setSelectedConversationId(null);
        setShowChat(false);
      }
    } catch (error) {
      console.error('Erro ao excluir conversa:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (showChat) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chat com IA</h1>
              <p className="text-gray-600 mt-2">
                Converse diretamente com agentes de inteligência artificial
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowChat(false)}
            >
              ← Voltar para conversas
            </Button>
          </div>

          <ChatInterface 
            conversationId={selectedConversationId || undefined}
            onConversationCreated={handleConversationCreated}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Conversações</h1>
            <p className="text-gray-600 mt-2">
              Gerencie suas conversas com agentes de IA
            </p>
          </div>
          <Button onClick={handleNewConversation}>
            Nova Conversa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Conversas</CardDescription>
              <CardTitle className="text-2xl">{conversations.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Mensagens Enviadas</CardDescription>
              <CardTitle className="text-2xl">
                {conversations.reduce((acc, conv) => acc + conv.messageCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tokens Utilizados</CardDescription>
              <CardTitle className="text-2xl">
                {conversations.reduce((acc, conv) => acc + conv.totalTokensUsed, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Conversas Ativas</CardDescription>
              <CardTitle className="text-2xl">
                {conversations.filter(c => c.isActive).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Conversations List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando conversas...</p>
                </div>
              </CardContent>
            </Card>
          ) : conversations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-400 text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma conversa encontrada
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Inicie sua primeira conversa com um agente de IA
                </p>
                <Button onClick={handleNewConversation}>
                  Iniciar Primeira Conversa
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conversations.map((conversation) => (
                <Card key={conversation.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">
                        {conversation.title}
                      </CardTitle>
                      <div className={`h-3 w-3 rounded-full ${
                        conversation.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <CardDescription>
                      {formatDate(conversation.lastMessageAt || conversation.updatedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Mensagens:</span>{' '}
                        <span className="text-gray-600">
                          {conversation.messageCount}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Tokens:</span>{' '}
                        <span className="text-gray-600">
                          {conversation.totalTokensUsed}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Modelo:</span>{' '}
                        <span className="text-gray-600">
                          {conversation.model}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleSelectConversation(conversation.id)}
                      >
                        Abrir Chat
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteConversation(conversation.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        🗑️
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
            <CardTitle>💡 Como usar o Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div>
                <strong>Nova Conversa:</strong> Clique em "Nova Conversa" para iniciar um chat com a IA
              </div>
              <div>
                <strong>Continuar Conversa:</strong> Clique em "Abrir Chat" em qualquer conversa existente
              </div>
              <div>
                <strong>Tokens:</strong> Cada mensagem consome tokens. Mensagens mais longas consomem mais tokens
              </div>
              <div>
                <strong>Modelos:</strong> Diferentes modelos têm diferentes capacidades e custos
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
