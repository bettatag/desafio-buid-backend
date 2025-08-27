'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConversationMessage } from '@/types';
import api from '@/lib/api';

interface ChatInterfaceProps {
  conversationId?: string;
  onConversationCreated?: (conversationId: string) => void;
}

export function ChatInterface({ conversationId, onConversationCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages();
    }
  }, [currentConversationId]);

  const loadMessages = async () => {
    if (!currentConversationId) return;

    try {
      const response = await api.get(`/conversations/${currentConversationId}/messages`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const createConversation = async () => {
    try {
      const response = await api.post('/conversations', {
        title: 'Nova Conversa',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: 'Você é um assistente útil e prestativo.',
      });

      const newConversationId = response.data.conversation.id;
      setCurrentConversationId(newConversationId);
      onConversationCreated?.(newConversationId);
      return newConversationId;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Se não há conversa, criar uma nova
      let conversationIdToUse = currentConversationId;
      if (!conversationIdToUse) {
        conversationIdToUse = await createConversation();
      }

      // Adicionar mensagem do usuário imediatamente
      const userMessage: ConversationMessage = {
        id: Date.now().toString(),
        conversationId: conversationIdToUse!,
        content: messageText,
        role: 'user',
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Enviar para a API
      const response = await api.post(`/conversations/${conversationIdToUse}/messages`, {
        message: messageText,
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000,
      });

      // Adicionar resposta da IA
      if (response.data.message) {
        setMessages(prev => [...prev, response.data.message]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Remover mensagem do usuário se houve erro
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <span className="text-green-600">🤖</span>
          <span>Chat com IA</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">💬</div>
              <p>Inicie uma conversa com o agente de IA</p>
              <p className="text-sm mt-1">Digite sua mensagem abaixo para começar</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                }`}>
                  {formatTime(message.createdAt)}
                  {message.tokensUsed && (
                    <span className="ml-2">• {message.tokensUsed} tokens</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">IA está digitando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? '⏳' : '📤'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
