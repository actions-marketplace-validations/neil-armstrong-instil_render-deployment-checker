module.exports = {
  resetMocks: true,
  preset: "ts-jest/presets/js-with-ts",
  moduleFileExtensions: ["ts", "js"],
  testMatch: ["**/*.test.ts"],
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "/node_modules/"
  ],
  globals: {
    "ts-jest": {
      isolatedModules: true
    }
  }
};
