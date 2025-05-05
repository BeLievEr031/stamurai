module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.ts'], // <-- match files in test/
  setupFilesAfterEnv: ['./src/test/setup.ts'],
};
