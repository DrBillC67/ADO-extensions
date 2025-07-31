module.exports = {
  // Test environment
  testEnvironment: 'jsdom',
  
  // File extensions to test
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      diagnostics: {
        warnOnly: true
      }
    }],
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  // Module name mapping for path resolution
  moduleNameMapper: {
    // Specific module mocks (must come before general patterns)
    '^VSS/Service$': '<rootDir>/src/__mocks__/VSS_Service.js',
    '^TFS/Work/RestClient$': '<rootDir>/src/__mocks__/TFS_Work_RestClient.js',
    '^@fluentui/react-icons$': '<rootDir>/src/__mocks__/FluentUIIcons.js',
    // General module patterns
    '^Common/(.*)$': '<rootDir>/src/Common/$1',
    '^Apps/(.*)$': '<rootDir>/src/Apps/$1',
    '^VSS/(.*)$': '<rootDir>/src/types/vss.d.ts',
    '^TFS/(.*)$': '<rootDir>/src/types/tfs.d.ts',
    '^OfficeFabric/(.*)$': '<rootDir>/src/types/officefabric.d.ts',
    // Asset mocks
    '\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}'
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Module directories
  moduleDirectories: ['node_modules', 'src'],
  
  // Test path ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/(?!(@fluentui|azure-devops|vss|tfs)/)'
  ],
  
  // Test environment setup
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
}; 