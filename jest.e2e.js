/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  testMatch: ['<rootDir>/tests/unit/*.test.ts'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
