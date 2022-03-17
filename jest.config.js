/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/integration/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
