module.exports = {
    roots: ['<rootDir>/src'],
    moduleNameMapper: {
        "@root/(.*)$": "<rootDir>/src/$1",
    },
    setupFilesAfterEnv: [
        "<rootDir>/src/tests/setuptests.ts"
    ],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js|jsx)',
        '**/?(*.)+(spec|test).+(ts|tsx|js|jsx)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    }
};