import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SessionUseCase } from '../session-usecase';
import { ISessionRepository } from '../../../domain/repositories/session-repository.contract';
import { SESSION_REPOSITORY_TOKEN } from '../../../../../shared/constants/di-constants';
import {
  ICreateSessionInput,
  IChangeSessionStatusInput,
  IGetSessionsInput,
  IUpdateSessionContextInput,
} from '../../../domain/contracts/input/session-input.contract';
import {
  ISessionOutput,
  ISessionListOutput,
} from '../../../domain/contracts/output/session-output.contract';

describe('SessionUseCase', () => {
  let sessionUseCase: SessionUseCase;
  let mockSessionRepository: jest.Mocked<ISessionRepository>;

  const mockSessionOutput: ISessionOutput = {
    id: 'session-123',
    instanceName: 'test-instance',
    remoteJid: '5511999999999@s.whatsapp.net',
    status: 'opened',
    context: 'Test context',
    createdAt: 1640995200000,
    updatedAt: 1640995200000,
    messageCount: 5,
    lastMessageAt: 1640995200000,
  };

  const mockSessionListOutput: ISessionListOutput = {
    sessions: [mockSessionOutput],
    total: 1,
    page: 1,
    limit: 50,
  };

  beforeEach(async () => {
    const mockRepository = {
      createSession: jest.fn(),
      changeSessionStatus: jest.fn(),
      getSessions: jest.fn(),
      getSession: jest.fn(),
      updateSessionContext: jest.fn(),
      deleteSession: jest.fn(),
      incrementMessageCount: jest.fn(),
      updateLastMessageTimestamp: jest.fn(),
      getStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionUseCase,
        {
          provide: SESSION_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    sessionUseCase = module.get<SessionUseCase>(SessionUseCase);
    mockSessionRepository = module.get(SESSION_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    const validInput: ICreateSessionInput = {
      instanceName: 'test-instance',
      remoteJid: '5511999999999',
      status: 'opened',
      context: 'Test context',
    };

    it('should successfully create session with valid input', async () => {
      // Arrange
      mockSessionRepository.createSession.mockResolvedValue(mockSessionOutput);

      // Act
      const result = await sessionUseCase.createSession(validInput);

      // Assert
      expect(result).toEqual(mockSessionOutput);
      expect(mockSessionRepository.createSession).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.createSession).toHaveBeenCalledWith({
        ...validInput,
        remoteJid: '5511999999999@s.whatsapp.net',
      });
    });

    it('should normalize JID without @s.whatsapp.net suffix', async () => {
      // Arrange
      const inputWithoutSuffix = { ...validInput, remoteJid: '5511999999999' };
      mockSessionRepository.createSession.mockResolvedValue(mockSessionOutput);

      // Act
      await sessionUseCase.createSession(inputWithoutSuffix);

      // Assert
      expect(mockSessionRepository.createSession).toHaveBeenCalledWith({
        ...inputWithoutSuffix,
        remoteJid: '5511999999999@s.whatsapp.net',
      });
    });

    it('should add Brazil country code for 11-digit numbers', async () => {
      // Arrange
      const inputWithoutCountryCode = { ...validInput, remoteJid: '11999999999' };
      mockSessionRepository.createSession.mockResolvedValue(mockSessionOutput);

      // Act
      await sessionUseCase.createSession(inputWithoutCountryCode);

      // Assert
      expect(mockSessionRepository.createSession).toHaveBeenCalledWith({
        ...inputWithoutCountryCode,
        remoteJid: '5511999999999@s.whatsapp.net',
      });
    });

    it('should throw HttpException when instanceName is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, instanceName: '' };

      // Act & Assert
      await expect(sessionUseCase.createSession(invalidInput)).rejects.toThrow(
        new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST),
      );
      expect(mockSessionRepository.createSession).not.toHaveBeenCalled();
    });

    it('should throw HttpException when remoteJid is missing', async () => {
      // Arrange
      const invalidInput = { ...validInput, remoteJid: '' };

      // Act & Assert
      await expect(sessionUseCase.createSession(invalidInput)).rejects.toThrow(
        new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST),
      );
      expect(mockSessionRepository.createSession).not.toHaveBeenCalled();
    });

    it('should handle repository errors and throw internal server error', async () => {
      // Arrange
      const repositoryError = new Error('Repository connection failed');
      mockSessionRepository.createSession.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(sessionUseCase.createSession(validInput)).rejects.toThrow(
        new HttpException('Erro interno ao criar sessão', HttpStatus.INTERNAL_SERVER_ERROR),
      );
      expect(mockSessionRepository.createSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeSessionStatus', () => {
    const validInput: IChangeSessionStatusInput = {
      instanceName: 'test-instance',
      remoteJid: '5511999999999',
      status: 'paused',
    };

    it('should successfully change session status with valid input', async () => {
      // Arrange
      const updatedSession = { ...mockSessionOutput, status: 'paused' as const };
      mockSessionRepository.changeSessionStatus.mockResolvedValue(updatedSession);

      // Act
      const result = await sessionUseCase.changeSessionStatus(validInput);

      // Assert
      expect(result).toEqual(updatedSession);
      expect(mockSessionRepository.changeSessionStatus).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.changeSessionStatus).toHaveBeenCalledWith({
        ...validInput,
        remoteJid: '5511999999999@s.whatsapp.net',
      });
    });

    it('should accept all valid status values', async () => {
      // Arrange
      mockSessionRepository.changeSessionStatus.mockResolvedValue(mockSessionOutput);
      const validStatuses = ['opened', 'paused', 'closed'] as const;

      // Act & Assert
      for (const status of validStatuses) {
        const input = { ...validInput, status };
        await expect(sessionUseCase.changeSessionStatus(input)).resolves.toEqual(mockSessionOutput);
      }

      expect(mockSessionRepository.changeSessionStatus).toHaveBeenCalledTimes(3);
    });

    it('should throw HttpException for invalid status', async () => {
      // Arrange
      const invalidInput = { ...validInput, status: 'invalid' as any };

      // Act & Assert
      await expect(sessionUseCase.changeSessionStatus(invalidInput)).rejects.toThrow(
        new HttpException('Status inválido', HttpStatus.BAD_REQUEST),
      );
      expect(mockSessionRepository.changeSessionStatus).not.toHaveBeenCalled();
    });
  });

  describe('getSessions', () => {
    const validInput: IGetSessionsInput = {
      instanceName: 'test-instance',
      status: 'opened',
      limit: 10,
      offset: 0,
    };

    it('should successfully get sessions with valid input', async () => {
      // Arrange
      mockSessionRepository.getSessions.mockResolvedValue(mockSessionListOutput);

      // Act
      const result = await sessionUseCase.getSessions(validInput);

      // Assert
      expect(result).toEqual(mockSessionListOutput);
      expect(mockSessionRepository.getSessions).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.getSessions).toHaveBeenCalledWith(validInput);
    });

    it('should throw HttpException for invalid limit', async () => {
      // Arrange
      const invalidInput = { ...validInput, limit: 0 };

      // Act & Assert
      await expect(sessionUseCase.getSessions(invalidInput)).rejects.toThrow(
        new HttpException('Limite deve ser maior que 0', HttpStatus.BAD_REQUEST),
      );
      expect(mockSessionRepository.getSessions).not.toHaveBeenCalled();
    });

    it('should throw HttpException for negative offset', async () => {
      // Arrange
      const invalidInput = { ...validInput, offset: -1 };

      // Act & Assert
      await expect(sessionUseCase.getSessions(invalidInput)).rejects.toThrow(
        new HttpException('Offset deve ser maior ou igual a 0', HttpStatus.BAD_REQUEST),
      );
      expect(mockSessionRepository.getSessions).not.toHaveBeenCalled();
    });

    it('should accept undefined limit and offset', async () => {
      // Arrange
      const inputWithoutPagination = { instanceName: 'test-instance' };
      mockSessionRepository.getSessions.mockResolvedValue(mockSessionListOutput);

      // Act
      await sessionUseCase.getSessions(inputWithoutPagination);

      // Assert
      expect(mockSessionRepository.getSessions).toHaveBeenCalledWith(inputWithoutPagination);
    });
  });

  describe('getSession', () => {
    it('should successfully get session when it exists', async () => {
      // Arrange
      mockSessionRepository.getSession.mockResolvedValue(mockSessionOutput);

      // Act
      const result = await sessionUseCase.getSession('test-instance', '5511999999999');

      // Assert
      expect(result).toEqual(mockSessionOutput);
      expect(mockSessionRepository.getSession).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.getSession).toHaveBeenCalledWith(
        'test-instance',
        '5511999999999@s.whatsapp.net',
      );
    });

    it('should return null when session does not exist', async () => {
      // Arrange
      mockSessionRepository.getSession.mockResolvedValue(null);

      // Act
      const result = await sessionUseCase.getSession('test-instance', '5511999999999');

      // Assert
      expect(result).toBeNull();
      expect(mockSessionRepository.getSession).toHaveBeenCalledTimes(1);
    });

    it('should throw HttpException when parameters are missing', async () => {
      // Act & Assert
      await expect(sessionUseCase.getSession('', '5511999999999')).rejects.toThrow(
        new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST),
      );

      await expect(sessionUseCase.getSession('test-instance', '')).rejects.toThrow(
        new HttpException('JID do contato é obrigatório', HttpStatus.BAD_REQUEST),
      );

      expect(mockSessionRepository.getSession).not.toHaveBeenCalled();
    });
  });

  describe('updateSessionContext', () => {
    const validInput: IUpdateSessionContextInput = {
      instanceName: 'test-instance',
      remoteJid: '5511999999999',
      context: 'Updated context',
    };

    it('should successfully update session context', async () => {
      // Arrange
      const updatedSession = { ...mockSessionOutput, context: 'Updated context' };
      mockSessionRepository.updateSessionContext.mockResolvedValue(updatedSession);

      // Act
      const result = await sessionUseCase.updateSessionContext(validInput);

      // Assert
      expect(result).toEqual(updatedSession);
      expect(mockSessionRepository.updateSessionContext).toHaveBeenCalledTimes(1);
      expect(mockSessionRepository.updateSessionContext).toHaveBeenCalledWith({
        ...validInput,
        remoteJid: '5511999999999@s.whatsapp.net',
      });
    });

    it('should throw HttpException when context is empty', async () => {
      // Arrange
      const invalidInput = { ...validInput, context: '' };

      // Act & Assert
      await expect(sessionUseCase.updateSessionContext(invalidInput)).rejects.toThrow(
        new HttpException('Contexto é obrigatório', HttpStatus.BAD_REQUEST),
      );
      expect(mockSessionRepository.updateSessionContext).not.toHaveBeenCalled();
    });
  });

  describe('deleteSession', () => {
    it('should successfully delete session when it exists', async () => {
      // Arrange
      mockSessionRepository.getSession.mockResolvedValue(mockSessionOutput);
      mockSessionRepository.deleteSession.mockResolvedValue();

      // Act
      await sessionUseCase.deleteSession('test-instance', '5511999999999');

      // Assert
      expect(mockSessionRepository.getSession).toHaveBeenCalledWith(
        'test-instance',
        '5511999999999@s.whatsapp.net',
      );
      expect(mockSessionRepository.deleteSession).toHaveBeenCalledWith(
        'test-instance',
        '5511999999999@s.whatsapp.net',
      );
    });

    it('should throw HttpException when session does not exist', async () => {
      // Arrange
      mockSessionRepository.getSession.mockResolvedValue(null);

      // Act & Assert
      await expect(sessionUseCase.deleteSession('test-instance', '5511999999999')).rejects.toThrow(
        new HttpException('Sessão não encontrada', HttpStatus.NOT_FOUND),
      );
      expect(mockSessionRepository.deleteSession).not.toHaveBeenCalled();
    });
  });

  describe('getSessionStats', () => {
    const mockStats = {
      total: 10,
      opened: 5,
      paused: 3,
      closed: 2,
      totalMessages: 150,
    };

    it('should successfully get session stats using repository method', async () => {
      // Arrange
      (mockSessionRepository as any).getStats = jest.fn().mockReturnValue(mockStats);

      // Act
      const result = await sessionUseCase.getSessionStats('test-instance');

      // Assert
      expect(result).toEqual(mockStats);
      expect((mockSessionRepository as any).getStats).toHaveBeenCalledWith('test-instance');
    });

    it('should fallback to getSessions when getStats method is not available', async () => {
      // Arrange
      delete (mockSessionRepository as any).getStats;
      const sessionList = {
        sessions: [
          { ...mockSessionOutput, status: 'opened' as const, messageCount: 10 },
          { ...mockSessionOutput, status: 'paused' as const, messageCount: 20 },
          { ...mockSessionOutput, status: 'closed' as const, messageCount: 30 },
        ],
        total: 3,
      };
      mockSessionRepository.getSessions.mockResolvedValue(sessionList);

      // Act
      const result = await sessionUseCase.getSessionStats('test-instance');

      // Assert
      expect(result).toEqual({
        total: 3,
        opened: 1,
        paused: 1,
        closed: 1,
        totalMessages: 60,
      });
      expect(mockSessionRepository.getSessions).toHaveBeenCalledWith({
        instanceName: 'test-instance',
        status: 'all',
      });
    });

    it('should throw HttpException when instanceName is missing', async () => {
      // Act & Assert
      await expect(sessionUseCase.getSessionStats('')).rejects.toThrow(
        new HttpException('Nome da instância é obrigatório', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
