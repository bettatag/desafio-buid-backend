import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { SESSION_REPOSITORY_TOKEN } from '../../../../shared/constants/di-constants';
import { ISessionRepository } from '../../domain/repositories/session-repository.contract';
import { ISessionUseCase } from '../contracts/Services/session-usecase.contract';
import { ICreateSessionInput, IChangeSessionStatusInput, IGetSessionsInput, IUpdateSessionContextInput } from '../../domain/contracts/input/session-input.contract';
import { ISessionOutput, ISessionListOutput } from '../../domain/contracts/output/session-output.contract';

@Injectable()
export class SessionUseCase implements ISessionUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY_TOKEN)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async createSession(input: ICreateSessionInput): Promise<ISessionOutput> {
    try {
      // Validações
      if (!input.instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!input.remoteJid) {
        throw new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST);
      }

      // Normalizar JID
      const normalizedJid = this.normalizeJid(input.remoteJid);
      const normalizedInput = {
        ...input,
        remoteJid: normalizedJid,
      };

      return await this.sessionRepository.createSession(normalizedInput);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao criar sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changeSessionStatus(input: IChangeSessionStatusInput): Promise<ISessionOutput> {
    try {
      // Validações
      if (!input.instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!input.remoteJid) {
        throw new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!['opened', 'paused', 'closed'].includes(input.status)) {
        throw new HttpException('Status inválido', HttpStatus.BAD_REQUEST);
      }

      // Normalizar JID
      const normalizedJid = this.normalizeJid(input.remoteJid);
      const normalizedInput = {
        ...input,
        remoteJid: normalizedJid,
      };

      return await this.sessionRepository.changeSessionStatus(normalizedInput);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao alterar status da sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSessions(input: IGetSessionsInput): Promise<ISessionListOutput> {
    try {
      // Validações
      if (!input.instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      // Validar parâmetros de paginação
      if (input.limit !== undefined && input.limit < 1) {
        throw new HttpException('Limite deve ser maior que 0', HttpStatus.BAD_REQUEST);
      }

      if (input.offset !== undefined && input.offset < 0) {
        throw new HttpException('Offset deve ser maior ou igual a 0', HttpStatus.BAD_REQUEST);
      }

      return await this.sessionRepository.getSessions(input);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar sessões',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSession(instanceName: string, remoteJid: string): Promise<ISessionOutput | null> {
    try {
      // Validações
      if (!instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!remoteJid) {
        throw new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST);
      }

      // Normalizar JID
      const normalizedJid = this.normalizeJid(remoteJid);

      return await this.sessionRepository.getSession(instanceName, normalizedJid);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao buscar sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSessionContext(input: IUpdateSessionContextInput): Promise<ISessionOutput> {
    try {
      // Validações
      if (!input.instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!input.remoteJid) {
        throw new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!input.context) {
        throw new HttpException('Contexto é obrigatório', HttpStatus.BAD_REQUEST);
      }

      // Normalizar JID
      const normalizedJid = this.normalizeJid(input.remoteJid);
      const normalizedInput = {
        ...input,
        remoteJid: normalizedJid,
      };

      return await this.sessionRepository.updateSessionContext(normalizedInput);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao atualizar contexto da sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSession(instanceName: string, remoteJid: string): Promise<void> {
    try {
      // Validações
      if (!instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      if (!remoteJid) {
        throw new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST);
      }

      // Verificar se sessão existe
      const session = await this.getSession(instanceName, remoteJid);
      if (!session) {
        throw new HttpException('Sessão não encontrada', HttpStatus.NOT_FOUND);
      }

      // Normalizar JID
      const normalizedJid = this.normalizeJid(remoteJid);

      await this.sessionRepository.deleteSession(instanceName, normalizedJid);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao excluir sessão',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSessionStats(instanceName: string): Promise<{
    total: number;
    opened: number;
    paused: number;
    closed: number;
    totalMessages: number;
  }> {
    try {
      // Validações
      if (!instanceName) {
        throw new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST);
      }

      // Para repositório mock, usar método específico
      if ('getStats' in this.sessionRepository) {
        return (this.sessionRepository as any).getStats(instanceName);
      }

      // Para implementação real, fazer query direta
      const sessions = await this.sessionRepository.getSessions({
        instanceName,
        status: 'all',
      });

      return {
        total: sessions.total,
        opened: sessions.sessions.filter(s => s.status === 'opened').length,
        paused: sessions.sessions.filter(s => s.status === 'paused').length,
        closed: sessions.sessions.filter(s => s.status === 'closed').length,
        totalMessages: sessions.sessions.reduce((sum, s) => sum + s.messageCount, 0),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno ao obter estatísticas das sessões',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private normalizeJid(jid: string): string {
    // Remove caracteres especiais e espaços
    let normalized = jid.trim();

    // Se já tem @, retorna como está
    if (normalized.includes('@')) {
      return normalized;
    }

    // Remove caracteres não numéricos
    normalized = normalized.replace(/[^\d]/g, '');

    // Se não começar com código do país, assume Brasil (55)
    if (normalized.length === 11 && !normalized.startsWith('55')) {
      normalized = '55' + normalized;
    }

    // Adiciona sufixo do WhatsApp
    return normalized + '@s.whatsapp.net';
  }
}
