const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/lib/(.*)$': '<rootDir>/lib/$1',
        '^@/types/(.*)$': '<rootDir>/types/$1',
        '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
        '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
}


module.exports = createJestConfig(customJestConfig);