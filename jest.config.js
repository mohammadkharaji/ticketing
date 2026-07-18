// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babel.config.jest.cjs" },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom", "<rootDir>/jest.setup.js"],
  collectCoverage: false,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/__tests__/*",
    "!src/**/*.d.ts",
  ],
  coverageReporters: ["text", "lcov"],
};
