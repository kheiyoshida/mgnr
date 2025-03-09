import type { Config } from 'jest'

const RootConfig: Config = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/src/$1',
    "^mgnr-core": "<rootDir>/../mgnr-core/src/index.ts"
  },
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  prettierPath: require.resolve('prettier-2'),
  setupFiles: ['../../jest/globalSetup.ts'],
}

const JestConfig: Config = {
  globals: {
    'ts-jest': {
      isolatedModules: false,
    },
  },
  // even thoug it's on top level, this is for each project level
  // do not run --coverage from root dir
  collectCoverageFrom: [
    '<rootDir>/**/*.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/*.config.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 70,
      functions: 85,
      lines: 60,
    },
  },
  coverageDirectory: 'jest/coverage',
  projects: [
    {
      ...RootConfig,
      displayName: 'mgnr-core',
      rootDir: './pkgs/mgnr-core',
    },
    {
      ...RootConfig,
      displayName: 'mgnr-midi',
      rootDir: './pkgs/mgnr-midi',
    },
    {
      ...RootConfig,
      displayName: 'mgnr-tone',
      rootDir: './pkgs/mgnr-tone',
    },
    {
      ...RootConfig,
      displayName: 'utils',
      rootDir: './pkgs/utils',
    },
  ],
}
export default JestConfig
