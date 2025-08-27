import { SessionRepository } from '../session.repository';
import {
  ICreateSessionInput,
  IChangeSessionStatusInput,
  IGetSessionsInput,
  IUpdateSessionContextInput,
} from '../../../domain/contracts/input/session-input.contract';

describe('SessionRepository', () => {
  let sessionRepository: SessionRepository;

  beforeEach(() => {
    sessionRepository = new SessionRepository();
  });

  describe('createSession', () => {
    const validInput: ICreateSessionInput = {
      instanceName: 'test-instance',
      remoteJid: '5511999999999@s.whatsapp.net',
      status: 'opened',
      context: 'Test context',
    };

    it('should successfully create new session', async () => {
      // Act
      const result = await sessionRepository.createSession(validInput);

      // Assert
      expect(result).toEqual({
        id: expect.stringMatching(/^session_\d+_\w+$/),
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
        context: 'Test context',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        messageCount: 0,
      });
      expect(result.createdAt).toBeGreaterThan(Date.now() - 1000);
      expect(result.updatedAt).toBeGreaterThan(Date.now() - 1000);
    });

    it('should use default status "opened" when not provided', async () => {
      // Arrange
      const inputWithoutStatus = { ...validInput, status: undefined };

      // Act
      const result = await sessionRepository.createSession(inputWithoutStatus);

      // Assert
      expect(result.status).toBe('opened');
    });

    it('should use empty context when not provided', async () => {
      // Arrange
      const inputWithoutContext = { ...validInput, context: undefined };

      // Act
      const result = await sessionRepository.createSession(inputWithoutContext);

      // Assert
      expect(result.context).toBe('');
    });

    it('should update existing session instead of creating duplicate', async () => {
      // Arrange
      await sessionRepository.createSession(validInput);
      const updateInput = { ...validInput, status: 'paused' as const };

      // Act
      const result = await sessionRepository.createSession(updateInput);

      // Assert
      expect(result.status).toBe('paused');
      expect(result.remoteJid).toBe(validInput.remoteJid);
      expect(result.instanceName).toBe(validInput.instanceName);
    });

    it('should generate unique session IDs', async () => {
      // Act
      const session1 = await sessionRepository.createSession({
        ...validInput,
        remoteJid: '5511999999999@s.whatsapp.net',
      });
      const session2 = await sessionRepository.createSession({
        ...validInput,
        remoteJid: '5511888888888@s.whatsapp.net',
      });

      // Assert
      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe('changeSessionStatus', () => {
    const validInput: IChangeSessionStatusInput = {
      instanceName: 'test-instance',
      remoteJid: '5511999999999@s.whatsapp.net',
      status: 'paused',
    };

    it('should successfully change status of existing session', async () => {
      // Arrange
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
      });

      // Act
      const result = await sessionRepository.changeSessionStatus(validInput);

      // Assert
      expect(result.status).toBe('paused');
      expect(result.updatedAt).toBeGreaterThan(Date.now() - 1000);
    });

    it('should create new session if it does not exist', async () => {
      // Act
      const result = await sessionRepository.changeSessionStatus(validInput);

      // Assert
      expect(result).toEqual({
        id: expect.stringMatching(/^session_\d+_\w+$/),
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'paused',
        context: '',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        messageCount: 0,
      });
    });

    it('should handle all valid status values', async () => {
      // Arrange
      const statuses = ['opened', 'paused', 'closed'] as const;

      // Act & Assert
      for (const status of statuses) {
        const input = { ...validInput, status, remoteJid: `551199999999${status}@s.whatsapp.net` };
        const result = await sessionRepository.changeSessionStatus(input);
        expect(result.status).toBe(status);
      }
    });
  });

  describe('getSessions', () => {
    beforeEach(async () => {
      // Seed test data
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
        context: 'Active session',
      });
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511888888888@s.whatsapp.net',
        status: 'paused',
        context: 'Paused session',
      });
      await sessionRepository.createSession({
        instanceName: 'other-instance',
        remoteJid: '5511777777777@s.whatsapp.net',
        status: 'closed',
        context: 'Other instance session',
      });
    });

    it('should return sessions for specific instance', async () => {
      // Arrange
      const input: IGetSessionsInput = { instanceName: 'test-instance' };

      // Act
      const result = await sessionRepository.getSessions(input);

      // Assert
      expect(result.sessions).toBeInstanceOf(Array);
      expect(result.sessions.length).toBeGreaterThanOrEqual(2);
      expect(result.total).toBeGreaterThanOrEqual(2);
      expect(result.sessions.every(s => s.instanceName === 'test-instance')).toBe(true);
    });

    it('should filter sessions by status', async () => {
      // Arrange
      const input: IGetSessionsInput = {
        instanceName: 'test-instance',
        status: 'opened',
      };

      // Act
      const result = await sessionRepository.getSessions(input);

      // Assert
      expect(result.sessions.every(s => s.status === 'opened')).toBe(true);
      expect(result.sessions.length).toBeGreaterThan(0);
    });

    it('should return all sessions when status is "all"', async () => {
      // Arrange
      const input: IGetSessionsInput = {
        instanceName: 'test-instance',
        status: 'all',
      };

      // Act
      const result = await sessionRepository.getSessions(input);

      // Assert
      expect(result.sessions.length).toBeGreaterThanOrEqual(2);
      expect(result.sessions.some(s => s.status === 'opened')).toBe(true);
      expect(result.sessions.some(s => s.status === 'paused')).toBe(true);
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const input: IGetSessionsInput = {
        instanceName: 'test-instance',
        limit: 1,
        offset: 0,
      };

      // Act
      const result = await sessionRepository.getSessions(input);

      // Assert
      expect(result.sessions.length).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(1);
      expect(result.total).toBeGreaterThanOrEqual(2);
    });

    it('should sort sessions by last message timestamp', async () => {
      // Arrange
      const input: IGetSessionsInput = { instanceName: 'test-instance' };

      // Act
      const result = await sessionRepository.getSessions(input);

      // Assert
      expect(result.sessions.length).toBeGreaterThan(1);
      for (let i = 0; i < result.sessions.length - 1; i++) {
        const currentTime = result.sessions[i].lastMessageAt || result.sessions[i].updatedAt;
        const nextTime = result.sessions[i + 1].lastMessageAt || result.sessions[i + 1].updatedAt;
        expect(currentTime).toBeGreaterThanOrEqual(nextTime);
      }
    });

    it('should return empty result for non-existent instance', async () => {
      // Arrange
      const input: IGetSessionsInput = { instanceName: 'non-existent' };

      // Act
      const result = await sessionRepository.getSessions(input);

      // Assert
      expect(result.sessions).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('getSession', () => {
    beforeEach(async () => {
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
        context: 'Test session',
      });
    });

    it('should return session when it exists', async () => {
      // Act
      const result = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.instanceName).toBe('test-instance');
      expect(result!.remoteJid).toBe('5511999999999@s.whatsapp.net');
    });

    it('should return null when session does not exist', async () => {
      // Act
      const result = await sessionRepository.getSession('test-instance', '5511888888888@s.whatsapp.net');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for non-existent instance', async () => {
      // Act
      const result = await sessionRepository.getSession('non-existent', '5511999999999@s.whatsapp.net');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateSessionContext', () => {
    const validInput: IUpdateSessionContextInput = {
      instanceName: 'test-instance',
      remoteJid: '5511999999999@s.whatsapp.net',
      context: 'Updated context',
    };

    it('should update context of existing session', async () => {
      // Arrange
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
        context: 'Original context',
      });

      // Act
      const result = await sessionRepository.updateSessionContext(validInput);

      // Assert
      expect(result.context).toBe('Updated context');
      expect(result.updatedAt).toBeGreaterThan(Date.now() - 1000);
    });

    it('should create new session if it does not exist', async () => {
      // Act
      const result = await sessionRepository.updateSessionContext(validInput);

      // Assert
      expect(result).toEqual({
        id: expect.stringMatching(/^session_\d+_\w+$/),
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
        context: 'Updated context',
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        messageCount: 0,
      });
    });
  });

  describe('deleteSession', () => {
    beforeEach(async () => {
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
      });
    });

    it('should successfully delete existing session', async () => {
      // Arrange
      const sessionBefore = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');
      expect(sessionBefore).not.toBeNull();

      // Act
      await sessionRepository.deleteSession('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      const sessionAfter = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');
      expect(sessionAfter).toBeNull();
    });

    it('should handle deletion of non-existent session gracefully', async () => {
      // Act & Assert
      await expect(
        sessionRepository.deleteSession('test-instance', '5511888888888@s.whatsapp.net')
      ).resolves.not.toThrow();
    });
  });

  describe('incrementMessageCount', () => {
    beforeEach(async () => {
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
      });
    });

    it('should increment message count of existing session', async () => {
      // Arrange
      const sessionBefore = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');
      const initialCount = sessionBefore!.messageCount;

      // Add a small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1));

      // Act
      await sessionRepository.incrementMessageCount('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      const sessionAfter = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');
      expect(sessionAfter!.messageCount).toBe(initialCount + 1);
      expect(sessionAfter!.updatedAt).toBeGreaterThanOrEqual(sessionBefore!.updatedAt);
    });

    it('should handle non-existent session gracefully', async () => {
      // Act & Assert
      await expect(
        sessionRepository.incrementMessageCount('test-instance', '5511888888888@s.whatsapp.net')
      ).resolves.not.toThrow();
    });
  });

  describe('updateLastMessageTimestamp', () => {
    beforeEach(async () => {
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
      });
    });

    it('should update last message timestamp of existing session', async () => {
      // Arrange
      const sessionBefore = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');
      const beforeTimestamp = Date.now();

      // Act
      await new Promise(resolve => setTimeout(resolve, 1)); // Garante diferença no timestamp
      await sessionRepository.updateLastMessageTimestamp('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      const sessionAfter = await sessionRepository.getSession('test-instance', '5511999999999@s.whatsapp.net');
      expect(sessionAfter!.lastMessageAt).toBeGreaterThanOrEqual(beforeTimestamp);
      expect(sessionAfter!.updatedAt).toBeGreaterThanOrEqual(sessionBefore!.updatedAt);
    });

    it('should handle non-existent session gracefully', async () => {
      // Act & Assert
      await expect(
        sessionRepository.updateLastMessageTimestamp('test-instance', '5511888888888@s.whatsapp.net')
      ).resolves.not.toThrow();
    });
  });

  describe('getStats', () => {
    beforeEach(async () => {
      // Seed test data
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511999999999@s.whatsapp.net',
        status: 'opened',
      });
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511888888888@s.whatsapp.net',
        status: 'paused',
      });
      await sessionRepository.createSession({
        instanceName: 'test-instance',
        remoteJid: '5511777777777@s.whatsapp.net',
        status: 'closed',
      });

      // Increment message counts
      await sessionRepository.incrementMessageCount('test-instance', '5511999999999@s.whatsapp.net');
      await sessionRepository.incrementMessageCount('test-instance', '5511999999999@s.whatsapp.net');
      await sessionRepository.incrementMessageCount('test-instance', '5511888888888@s.whatsapp.net');
    });

    it('should return correct statistics for instance', () => {
      // Act
      const stats = sessionRepository.getStats('test-instance');

      // Assert
      expect(stats).toEqual({
        total: expect.any(Number),
        opened: expect.any(Number),
        paused: expect.any(Number),
        closed: expect.any(Number),
        totalMessages: expect.any(Number),
      });
      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.opened).toBeGreaterThanOrEqual(1);
      expect(stats.paused).toBeGreaterThanOrEqual(1);
      expect(stats.closed).toBeGreaterThanOrEqual(1);
      expect(stats.totalMessages).toBeGreaterThanOrEqual(3);
    });

    it('should return zero stats for non-existent instance', () => {
      // Act
      const stats = sessionRepository.getStats('non-existent');

      // Assert
      expect(stats).toEqual({
        total: 0,
        opened: 0,
        paused: 0,
        closed: 0,
        totalMessages: 0,
      });
    });

    it('should count sessions by status correctly', () => {
      // Act
      const stats = sessionRepository.getStats('test-instance');

      // Assert
      expect(stats.opened + stats.paused + stats.closed).toBe(stats.total);
    });
  });
});
