process.env.TZ = "Asia/Taipei";

module.exports = {
    preset: 'ts-jest',
    testTimeout: 30000,
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['./node_modules/'],
    moduleNameMapper: {
      "~/assets/(.*)": "<rootDir>/src/assets/$1",
      "~/utils/(.*)": "<rootDir>/src/utils/$1",
      "~/constants/(.*)": "<rootDir>/src/constants/$1",
      "~/enums/(.*)": "<rootDir>/src/enums/$1",
      "~/commands/(.*)": "<rootDir>/src/commands/$1",
      "~/database/(.*)": "<rootDir>/src/database/$1",
      "~/types/(.*)": "<rootDir>/src/@types/$1",
      "~/managers/(.*)": "<rootDir>/src/managers/$1",
      "~/configs/(.*)": "<rootDir>/src/configs/$1",
    },
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
  };