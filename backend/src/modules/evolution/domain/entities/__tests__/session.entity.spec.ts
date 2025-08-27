import { SessionEntity } from '../session.entity';

describe('SessionEntity', () => {
  const mockSessionData = {
    id: 'session-123',
    instanceName: 'test-instance',
    remoteJid: '5511999999999@s.whatsapp.net',
    status: 'opened' as const,
    context: 'Test context',
    createdAt: 1640995200000,
    updatedAt: 1640995800000,
    messageCount: 5,
    lastMessageAt: 1640995700000,
  };

  describe('constructor', () => {
    it('should create SessionEntity with all properties', () => {
      // Act
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        mockSessionData.status,
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
        mockSessionData.lastMessageAt,
      );

      // Assert
      expect(session.id).toBe(mockSessionData.id);
      expect(session.instanceName).toBe(mockSessionData.instanceName);
      expect(session.remoteJid).toBe(mockSessionData.remoteJid);
      expect(session.status).toBe(mockSessionData.status);
      expect(session.context).toBe(mockSessionData.context);
      expect(session.createdAt).toBe(mockSessionData.createdAt);
      expect(session.updatedAt).toBe(mockSessionData.updatedAt);
      expect(session.messageCount).toBe(mockSessionData.messageCount);
      expect(session.lastMessageAt).toBe(mockSessionData.lastMessageAt);
    });

    it('should create SessionEntity without lastMessageAt (optional)', () => {
      // Act
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        mockSessionData.status,
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Assert
      expect(session.lastMessageAt).toBeUndefined();
      expect(session.messageCount).toBe(mockSessionData.messageCount);
    });
  });

  describe('isActive', () => {
    it('should return true when status is "opened"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'opened',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isActive()).toBe(true);
    });

    it('should return false when status is "paused"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'paused',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isActive()).toBe(false);
    });

    it('should return false when status is "closed"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'closed',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isActive()).toBe(false);
    });
  });

  describe('isPaused', () => {
    it('should return true when status is "paused"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'paused',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isPaused()).toBe(true);
    });

    it('should return false when status is "opened"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'opened',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isPaused()).toBe(false);
    });

    it('should return false when status is "closed"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'closed',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isPaused()).toBe(false);
    });
  });

  describe('isClosed', () => {
    it('should return true when status is "closed"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'closed',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isClosed()).toBe(true);
    });

    it('should return false when status is "opened"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'opened',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isClosed()).toBe(false);
    });

    it('should return false when status is "paused"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'paused',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.isClosed()).toBe(false);
    });
  });

  describe('canReceiveMessages', () => {
    it('should return true when status is "opened"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'opened',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.canReceiveMessages()).toBe(true);
    });

    it('should return false when status is "paused"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'paused',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.canReceiveMessages()).toBe(false);
    });

    it('should return false when status is "closed"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'closed',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.canReceiveMessages()).toBe(false);
    });
  });

  describe('shouldProcessWithAI', () => {
    it('should return true when status is "opened"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'opened',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.shouldProcessWithAI()).toBe(true);
    });

    it('should return false when status is "paused"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'paused',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.shouldProcessWithAI()).toBe(false);
    });

    it('should return false when status is "closed"', () => {
      // Arrange
      const session = new SessionEntity(
        mockSessionData.id,
        mockSessionData.instanceName,
        mockSessionData.remoteJid,
        'closed',
        mockSessionData.context,
        mockSessionData.createdAt,
        mockSessionData.updatedAt,
        mockSessionData.messageCount,
      );

      // Act & Assert
      expect(session.shouldProcessWithAI()).toBe(false);
    });
  });

  describe('create (static method)', () => {
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(1640995200000);
      jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create SessionEntity with default values', () => {
      // Act
      const session = SessionEntity.create('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      expect(session.id).toMatch(/^session_\d+_\w+$/);
      expect(session.instanceName).toBe('test-instance');
      expect(session.remoteJid).toBe('5511999999999@s.whatsapp.net');
      expect(session.status).toBe('opened');
      expect(session.context).toBe('');
      expect(session.createdAt).toBe(1640995200000);
      expect(session.updatedAt).toBe(1640995200000);
      expect(session.messageCount).toBe(0);
      expect(session.lastMessageAt).toBeUndefined();
    });

    it('should create SessionEntity with custom status', () => {
      // Act
      const session = SessionEntity.create(
        'test-instance',
        '5511999999999@s.whatsapp.net',
        'paused',
      );

      // Assert
      expect(session.status).toBe('paused');
      expect(session.instanceName).toBe('test-instance');
      expect(session.remoteJid).toBe('5511999999999@s.whatsapp.net');
    });

    it('should create SessionEntity with custom context', () => {
      // Act
      const session = SessionEntity.create(
        'test-instance',
        '5511999999999@s.whatsapp.net',
        'opened',
        'Custom context',
      );

      // Assert
      expect(session.context).toBe('Custom context');
      expect(session.status).toBe('opened');
    });

    it('should create SessionEntity with all custom parameters', () => {
      // Act
      const session = SessionEntity.create(
        'custom-instance',
        '5511888888888@s.whatsapp.net',
        'closed',
        'Custom context for closed session',
      );

      // Assert
      expect(session.instanceName).toBe('custom-instance');
      expect(session.remoteJid).toBe('5511888888888@s.whatsapp.net');
      expect(session.status).toBe('closed');
      expect(session.context).toBe('Custom context for closed session');
      expect(session.messageCount).toBe(0);
      expect(session.createdAt).toBe(session.updatedAt);
    });

    it('should generate unique IDs for different sessions', () => {
      // Arrange
      jest.spyOn(Math, 'random')
        .mockReturnValueOnce(0.111111111)
        .mockReturnValueOnce(0.222222222)
        .mockReturnValueOnce(0.333333333);

      // Act
      const session1 = SessionEntity.create('instance1', '5511111111111@s.whatsapp.net');
      const session2 = SessionEntity.create('instance2', '5511222222222@s.whatsapp.net');
      const session3 = SessionEntity.create('instance3', '5511333333333@s.whatsapp.net');

      // Assert
      expect(session1.id).not.toBe(session2.id);
      expect(session2.id).not.toBe(session3.id);
      expect(session1.id).not.toBe(session3.id);
    });

    it('should use current timestamp for createdAt and updatedAt', () => {
      // Arrange
      const mockTimestamp = 1640995999999;
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

      // Act
      const session = SessionEntity.create('test-instance', '5511999999999@s.whatsapp.net');

      // Assert
      expect(session.createdAt).toBe(mockTimestamp);
      expect(session.updatedAt).toBe(mockTimestamp);
    });
  });

  describe('business logic consistency', () => {
    it('should have consistent behavior across all status-related methods', () => {
      // Arrange
      const statuses = ['opened', 'paused', 'closed'] as const;

      statuses.forEach(status => {
        // Act
        const session = new SessionEntity(
          'test-id',
          'test-instance',
          '5511999999999@s.whatsapp.net',
          status,
          'test-context',
          Date.now(),
          Date.now(),
          0,
        );

        // Assert
        const isActive = session.isActive();
        const isPaused = session.isPaused();
        const isClosed = session.isClosed();
        const canReceiveMessages = session.canReceiveMessages();
        const shouldProcessWithAI = session.shouldProcessWithAI();

        // Only one status should be true
        const statusCount = [isActive, isPaused, isClosed].filter(Boolean).length;
        expect(statusCount).toBe(1);

        // canReceiveMessages and shouldProcessWithAI should match isActive
        expect(canReceiveMessages).toBe(isActive);
        expect(shouldProcessWithAI).toBe(isActive);

        // Verify specific status behaviors
        if (status === 'opened') {
          expect(isActive).toBe(true);
          expect(isPaused).toBe(false);
          expect(isClosed).toBe(false);
        } else if (status === 'paused') {
          expect(isActive).toBe(false);
          expect(isPaused).toBe(true);
          expect(isClosed).toBe(false);
        } else if (status === 'closed') {
          expect(isActive).toBe(false);
          expect(isPaused).toBe(false);
          expect(isClosed).toBe(true);
        }
      });
    });
  });
});
