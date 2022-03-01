/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  testMatch: ['<rootDir>/tests/integration/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
//  globalSetup: '<rootDir>/tests/unit/setup.ts',
  setupFilesAfterEnv: ['<rootDir>/tests/integration/cookies.ts'],
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  }
};
