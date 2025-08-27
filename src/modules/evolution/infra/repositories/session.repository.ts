import { Injectable } from '@nestjs/common';
import { ISessionRepository } from '../../domain/repositories/session-repository.contract';
import { ICreateSessionInput, IChangeSessionStatusInput, IGetSessionsInput, IUpdateSessionContextInput } from '../../domain/contracts/input/session-input.contract';
import { ISessionOutput, ISessionListOutput } from '../../domain/contracts/output/session-output.contract';

@Injectable()
export class SessionRepository implements ISessionRepository {
  private sessions: ISessionOutput[] = [
    {
      id: 'session-1',
      instanceName: 'bot-ia-teste',
      remoteJid: '5511999999999@s.whatsapp.net',
      status: 'opened',
      context: 'Cliente interessado em produtos',
      createdAt: Date.now() - 7200000,
      updatedAt: Date.now() - 3600000,
      lastMessageAt: Date.now() - 1800000,
      messageCount: 8,
    },
    {
      id: 'session-2',
      instanceName: 'bot-ia-teste',
      remoteJid: '5511777777777@s.whatsapp.net',
      status: 'paused',
      context: 'Suporte técnico - aguardando informações',
      createdAt: Date.now() - 14400000,
      updatedAt: Date.now() - 7200000,
      lastMessageAt: Date.now() - 7200000,
      messageCount: 15,
    },
    {
      id: 'session-3',
      instanceName: 'bot-ia-teste',
      remoteJid: '5511888888888@s.whatsapp.net',
      status: 'closed',
      context: 'Vendas - pedido finalizado',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
      lastMessageAt: Date.now() - 3600000,
      messageCount: 25,
    },
  ];

  async createSession(input: ICreateSessionInput): Promise<ISessionOutput> {
    // Verificar se já existe sessão para este contato
    const existingSession = this.sessions.find(
      s => s.instanceName === input.instanceName && s.remoteJid === input.remoteJid
    );

    if (existingSession) {
      // Se existe, atualizar status
      return this.changeSessionStatus({
        instanceName: input.instanceName,
        remoteJid: input.remoteJid,
        status: input.status || 'opened',
      });
    }

    // Criar nova sessão
    const now = Date.now();
    const newSession: ISessionOutput = {
      id: `session_${now}_${Math.random().toString(36).substr(2, 9)}`,
      instanceName: input.instanceName,
      remoteJid: input.remoteJid,
      status: input.status || 'opened',
      context: input.context || '',
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    };

    this.sessions.push(newSession);
    return newSession;
  }

  async changeSessionStatus(input: IChangeSessionStatusInput): Promise<ISessionOutput> {
    const sessionIndex = this.sessions.findIndex(
      s => s.instanceName === input.instanceName && s.remoteJid === input.remoteJid
    );

    if (sessionIndex === -1) {
      // Se não existe, criar nova sessão
      return this.createSession({
        instanceName: input.instanceName,
        remoteJid: input.remoteJid,
        status: input.status,
      });
    }

    // Atualizar sessão existente
    const updatedSession: ISessionOutput = {
      ...this.sessions[sessionIndex],
      status: input.status,
      updatedAt: Date.now(),
    };

    this.sessions[sessionIndex] = updatedSession;
    return updatedSession;
  }

  async getSessions(input: IGetSessionsInput): Promise<ISessionListOutput> {
    let filteredSessions = this.sessions.filter(
      s => s.instanceName === input.instanceName
    );

    // Filtrar por status se especificado
    if (input.status && input.status !== 'all') {
      filteredSessions = filteredSessions.filter(s => s.status === input.status);
    }

    // Ordenar por última mensagem (mais recente primeiro)
    filteredSessions.sort((a, b) => {
      const aTime = a.lastMessageAt || a.updatedAt;
      const bTime = b.lastMessageAt || b.updatedAt;
      return bTime - aTime;
    });

    const total = filteredSessions.length;
    
    // Aplicar paginação
    if (input.offset !== undefined || input.limit !== undefined) {
      const offset = input.offset || 0;
      const limit = input.limit || 50;
      filteredSessions = filteredSessions.slice(offset, offset + limit);
    }

    return {
      sessions: filteredSessions,
      total,
      page: input.offset !== undefined && input.limit !== undefined 
        ? Math.floor(input.offset / input.limit) + 1 
        : undefined,
      limit: input.limit,
    };
  }

  async getSession(instanceName: string, remoteJid: string): Promise<ISessionOutput | null> {
    const session = this.sessions.find(
      s => s.instanceName === instanceName && s.remoteJid === remoteJid
    );

    return session || null;
  }

  async updateSessionContext(input: IUpdateSessionContextInput): Promise<ISessionOutput> {
    const sessionIndex = this.sessions.findIndex(
      s => s.instanceName === input.instanceName && s.remoteJid === input.remoteJid
    );

    if (sessionIndex === -1) {
      // Se não existe, criar nova sessão
      return this.createSession({
        instanceName: input.instanceName,
        remoteJid: input.remoteJid,
        context: input.context,
      });
    }

    // Atualizar contexto da sessão existente
    const updatedSession: ISessionOutput = {
      ...this.sessions[sessionIndex],
      context: input.context,
      updatedAt: Date.now(),
    };

    this.sessions[sessionIndex] = updatedSession;
    return updatedSession;
  }

  async deleteSession(instanceName: string, remoteJid: string): Promise<void> {
    const sessionIndex = this.sessions.findIndex(
      s => s.instanceName === instanceName && s.remoteJid === remoteJid
    );

    if (sessionIndex !== -1) {
      this.sessions.splice(sessionIndex, 1);
    }
  }

  async incrementMessageCount(instanceName: string, remoteJid: string): Promise<void> {
    const sessionIndex = this.sessions.findIndex(
      s => s.instanceName === instanceName && s.remoteJid === remoteJid
    );

    if (sessionIndex !== -1) {
      this.sessions[sessionIndex] = {
        ...this.sessions[sessionIndex],
        messageCount: this.sessions[sessionIndex].messageCount + 1,
        updatedAt: Date.now(),
      };
    }
  }

  async updateLastMessageTimestamp(instanceName: string, remoteJid: string): Promise<void> {
    const sessionIndex = this.sessions.findIndex(
      s => s.instanceName === instanceName && s.remoteJid === remoteJid
    );

    if (sessionIndex !== -1) {
      const now = Date.now();
      this.sessions[sessionIndex] = {
        ...this.sessions[sessionIndex],
        lastMessageAt: now,
        updatedAt: now,
      };
    }
  }

  // Método auxiliar para obter estatísticas
  getStats(instanceName: string) {
    const instanceSessions = this.sessions.filter(s => s.instanceName === instanceName);
    
    return {
      total: instanceSessions.length,
      opened: instanceSessions.filter(s => s.status === 'opened').length,
      paused: instanceSessions.filter(s => s.status === 'paused').length,
      closed: instanceSessions.filter(s => s.status === 'closed').length,
      totalMessages: instanceSessions.reduce((sum, s) => sum + s.messageCount, 0),
    };
  }
}
