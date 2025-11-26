module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/*.test.js'],
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
