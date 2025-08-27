// Global test setup
import 'reflect-metadata';

// Mock console methods in test environment to reduce noise
if (process.env.NODE_ENV === 'test') {
  // Only suppress console.log and console.debug in tests
  // Keep console.warn and console.error for important messages
  global.console.log = jest.fn();
  global.console.debug = jest.fn();
}

// Global test timeout
jest.setTimeout(10000);

// Global mocks for common dependencies
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock UUID generation for consistent testing
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    isActive: true,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
    ...overrides,
  }),

  createMockToken: (type: 'ACCESS' | 'REFRESH', overrides = {}) => ({
    id: `test-token-${type.toLowerCase()}`,
    value: `test-${type.toLowerCase()}-token`,
    userId: 'test-user-123',
    type,
    expiresAt: new Date(Date.now() + (type === 'ACCESS' ? 900000 : 86400000)),
    createdAt: new Date(),
    isExpired: () => false,
    ...overrides,
  }),

  mockDate: new Date('2024-01-01T12:00:00.000Z'),
};

// Extend global types
declare global {
  var testUtils: {
    createMockUser: (overrides?: any) => any;
    createMockToken: (type: 'ACCESS' | 'REFRESH', overrides?: any) => any;
    mockDate: Date;
  };
}
