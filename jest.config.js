process.env.TZ = "Asia/Taipei";

module.exports = {
    preset: 'ts-jest',
    testTimeout: 30000,
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['./node_modules/'],
    moduleNameMapper: {
      "~/src/(.*)": "<rootDir>/src/$1",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
  };