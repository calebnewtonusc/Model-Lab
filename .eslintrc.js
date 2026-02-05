/**
 * ESLint Configuration for ModelLab
 * Enforces code quality and consistency standards
 */

module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['node'],
  rules: {
    // Error prevention
    'no-console': 'off', // Allow console in Node.js
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    // Best practices
    'prefer-const': 'warn',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],

    // Node.js specific
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-require': 'error',
    'node/no-unpublished-require': 'off',
    'node/no-extraneous-require': 'error',

    // Code style (handled by Prettier mostly)
    'semi': ['error', 'always'],
    'quotes': ['warn', 'single', { avoidEscape: true }],
  },
  ignorePatterns: [
    'node_modules/',
    'frontend/',
    'python-sdk/',
    'ml/',
    'data/',
    'modellab-data/',
    'coverage/',
    '.vercel/',
    '*.min.js'
  ],
  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
      env: {
        jest: true,
      },
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
  ],
};
