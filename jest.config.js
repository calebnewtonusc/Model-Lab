/**
 * Jest Configuration for ModelLab
 * Test configuration for backend API and library code
 */

module.exports = {
  // Use Node.js test environment
  testEnvironment: 'node',

  // Coverage directory
  coverageDirectory: 'coverage',

  // Collect coverage from these files
  collectCoverageFrom: [
    'lib/**/*.js',
    'routes/**/*.js',
    'server.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!**/coverage/**'
  ],

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/frontend/',
    '/python-sdk/',
    '/ml/',
    '/.vercel/',
    '/data/',
    '/modellab-data/',
    '/coverage/'
  ],

  // Module path ignore patterns (fixes Vercel collision)
  modulePathIgnorePatterns: [
    '<rootDir>/.vercel/',
    '<rootDir>/frontend/build/',
    '<rootDir>/data/',
    '<rootDir>/modellab-data/'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Reset mocks after each test
  resetMocks: true
};
