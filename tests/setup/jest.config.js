module.exports = {
    testEnvironment: "jsdom",
    rootDir: "../../",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/*.test.js"],
    moduleFileExtensions: ["js"],
    collectCoverage: true,
    coverageDirectory: "<rootDir>/coverage",
    collectCoverageFrom: ["src/**/*.js", "!src/**/index.js", "!src/**/*.d.ts"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup/setup.js"],
    testPathIgnorePatterns: ["/node_modules/"],
    verbose: true,
};
