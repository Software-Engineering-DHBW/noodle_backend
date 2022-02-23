/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/unit/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};
