module.exports = {
  displayName: 'Auth Module Tests',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/modules/auth/**/*.ts',
    '!src/modules/auth/**/*.spec.ts',
    '!src/modules/auth/**/__tests__/**',
    '!src/modules/auth/**/index.ts',
    '!src/modules/auth/**/*.contract.ts',
    '!src/modules/auth/**/*.interface.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  verbose: true,
  testTimeout: 10000,
  maxWorkers: '50%',
};
