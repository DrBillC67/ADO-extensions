// Import testing library matchers
require('@testing-library/jest-dom');

// Mock global VSS object
global.VSS = {
  getWebContext: jest.fn(() => ({
    project: { id: 'test-project-id', name: 'TestProject' },
    team: { id: 'test-team-id', name: 'TestTeam' },
    collection: { id: 'test-collection-id', name: 'TestCollection' },
    user: { id: 'test-user-id', name: 'TestUser', email: 'test@example.com' }
  })),
  getService: jest.fn(),
  getClient: jest.fn(),
  ready: jest.fn(),
  notifyLoadSucceeded: jest.fn(),
  notifyLoadFailed: jest.fn()
};

// Mock global TFS object
global.TFS = {
  WorkItemTracking: {
    RestClient: jest.fn(),
    WorkItemFormService: jest.fn()
  },
  Core: {
    RestClient: jest.fn()
  }
};

// Mock global OfficeFabric object
global.OfficeFabric = {
  // Add any OfficeFabric mocks as needed
};

// Console error suppression for expected warnings
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Global test utilities
global.testUtils = {
  // Mock work item data
  createMockWorkItem: (overrides = {}) => ({
    id: 1,
    fields: {
      'System.Id': 1,
      'System.Title': 'Test Work Item',
      'System.WorkItemType': 'Bug',
      'System.State': 'Active',
      'System.AssignedTo': { displayName: 'Test User', email: 'test@example.com' },
      'System.AreaPath': 'Project\\Team',
      'System.IterationPath': 'Project\\Iteration\\Sprint 1',
      'System.CreatedDate': '2025-07-30T10:00:00Z',
      'System.ChangedDate': '2025-07-30T10:00:00Z',
      ...overrides.fields
    },
    ...overrides
  }),

  // Mock pull request data
  createMockPullRequest: (overrides = {}) => ({
    id: 12345,
    repositoryId: 'repo-123',
    projectId: 'project-123',
    sourceBranch: 'feature/new-feature',
    targetBranch: 'main',
    status: 'active',
    ...overrides
  }),

  // Mock user data
  createMockUser: (overrides = {}) => ({
    id: 'user-123',
    displayName: 'Test User',
    email: 'test@example.com',
    ...overrides
  }),

  // Mock team data
  createMockTeam: (overrides = {}) => ({
    id: 'team-123',
    name: 'Test Team',
    description: 'Test team description',
    ...overrides
  })
}; 