/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  testMatch: ['<rootDir>/tests/unit/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/unit/setup.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/cookies.ts']
};
