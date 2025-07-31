# PRWorkItems Testing Guidelines

## Overview

This document provides comprehensive testing guidelines for the PRWorkItems extension, ensuring quality and reliability across all pull request work item creation and linking features and scenarios.

## 🧪 **Testing Strategy**

### **Test Types**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Pull request integration and work item creation
- **End-to-End Tests**: Complete work item creation workflows
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Performance Tests**: Bundle size and runtime performance
- **Cross-browser Tests**: Chrome, Firefox, Safari, Edge

### **Test Environment Setup**
- Azure DevOps 2020+ test environment
- Multiple pull request states and configurations
- Various work item types and templates
- Different user permission levels

## 📋 **Core Functionality Testing**

### **1. Pull Request Context Menu**
**Test Cases:**
- ✅ Display "Link to a new workitem" menu item
- ✅ Open work item dialog on menu click
- ✅ Handle menu item visibility based on permissions
- ✅ Test menu item accessibility
- ✅ Verify menu integration with pull request UI

**Test Data:**
```typescript
const pullRequestContext = {
  pullRequestId: 12345,
  repositoryId: "repo-123",
  projectId: "project-123",
  sourceBranch: "feature/new-feature",
  targetBranch: "main",
  status: "active"
};
```

### **2. Work Item Creation Dialog**
**Test Cases:**
- ✅ Open work item creation dialog
- ✅ Display available work item types
- ✅ Pre-populate fields based on pull request data
- ✅ Validate required fields
- ✅ Handle dialog cancellation
- ✅ Test dialog accessibility

**Test Scenarios:**
```typescript
const workItemDialog = {
  workItemTypes: ["Bug", "Task", "User Story"],
  prePopulatedFields: {
    title: "Work item for PR #12345",
    description: "Related to pull request changes",
    areaPath: "Project\\Team"
  },
  requiredFields: ["title", "workItemType"]
};
```

### **3. Work Item Creation**
**Test Cases:**
- ✅ Create work item with valid data
- ✅ Handle work item creation errors
- ✅ Validate work item type permissions
- ✅ Test field validation
- ✅ Verify work item creation success
- ✅ Handle network connectivity issues

**Test Data:**
```typescript
const workItemData = {
  workItemType: "Bug",
  title: "Bug found in PR #12345",
  description: "Issue discovered during code review",
  assignedTo: "current-user@example.com",
  areaPath: "Project\\Team\\Component",
  iterationPath: "Project\\Iteration\\Sprint 1"
};
```

### **4. Work Item Linking**
**Test Cases:**
- ✅ Automatically link created work item to pull request
- ✅ Verify link creation success
- ✅ Handle link creation errors
- ✅ Test link type selection
- ✅ Verify link visibility in pull request
- ✅ Handle duplicate link prevention

**Link Test Data:**
```typescript
const workItemLink = {
  sourceId: 12345, // Pull Request ID
  targetId: 67890, // Work Item ID
  linkType: "Related",
  comment: "Work item created from pull request"
};
```

### **5. Configuration Management**
**Test Cases:**
- ✅ Configure available work item types
- ✅ Save configuration per project
- ✅ Load configuration on extension startup
- ✅ Validate configuration data
- ✅ Test configuration migration
- ✅ Handle configuration errors

**Configuration Data:**
```typescript
const extensionConfig = {
  projectId: "project-123",
  availableWorkItemTypes: ["Bug", "Task", "User Story"],
  defaultWorkItemType: "Bug",
  autoLinkEnabled: true,
  linkType: "Related"
};
```

## 🔧 **Configuration Testing**

### **Settings Dialog**
**Test Cases:**
- ✅ Access configuration dialog
- ✅ Select work item types for availability
- ✅ Save configuration settings
- ✅ Load existing configuration
- ✅ Validate configuration permissions
- ✅ Test configuration persistence

### **Project-Level Configuration**
**Test Cases:**
- ✅ Configure settings per project
- ✅ Test configuration inheritance
- ✅ Validate project-specific settings
- ✅ Test configuration validation
- ✅ Handle configuration conflicts

## 🎨 **UI/UX Testing**

### **Pull Request Integration**
**Test Cases:**
- ✅ Display context menu in pull request view
- ✅ Responsive design within pull request UI
- ✅ Theme integration (light, dark, high contrast)
- ✅ Accessibility within pull request context
- ✅ Keyboard navigation support

### **Work Item Dialog**
**Test Cases:**
- ✅ Modal dialog display
- ✅ Form field layout and styling
- ✅ Validation error display
- ✅ Loading state indicators
- ✅ Success/error feedback
- ✅ Dialog accessibility

### **Visual States**
**Test Cases:**
- ✅ Loading states during work item creation
- ✅ Success state after work item creation
- ✅ Error state handling
- ✅ Disabled state for unavailable actions
- ✅ Hover and focus states

## 🔄 **State Management Testing**

### **Dialog State Management**
**Test Cases:**
- ✅ Dialog open/close state
- ✅ Form data persistence during dialog session
- ✅ Validation state management
- ✅ Loading state management
- ✅ Error state handling

### **Configuration State**
**Test Cases:**
- ✅ Configuration loading state
- ✅ Configuration save state
- ✅ Configuration validation state
- ✅ Configuration error handling
- ✅ Configuration synchronization

## 🚀 **Performance Testing**

### **Bundle Analysis**
**Test Cases:**
- ✅ Bundle size under 300KB
- ✅ Tree shaking effectiveness
- ✅ Code splitting validation
- ✅ Lazy loading implementation
- ✅ Asset optimization

### **Runtime Performance**
**Test Cases:**
- ✅ Initial load time < 1 second
- ✅ Dialog open time < 500ms
- ✅ Work item creation time < 2 seconds
- ✅ Memory usage monitoring
- ✅ Network request optimization

## 🔒 **Security Testing**

### **Permission Validation**
**Test Cases:**
- ✅ Validate pull request access permissions
- ✅ Test work item creation permissions
- ✅ Verify work item linking permissions
- ✅ Test configuration modification permissions
- ✅ Validate user authentication

### **Data Security**
**Test Cases:**
- ✅ Secure work item data transmission
- ✅ Validate input sanitization
- ✅ Test XSS prevention
- ✅ Verify CSRF protection
- ✅ Test data isolation

## 🌐 **Integration Testing**

### **Azure DevOps Pull Request API**
**Test Cases:**
- ✅ Pull request data retrieval
- ✅ Work item creation via API
- ✅ Work item linking via API
- ✅ Permission validation via API
- ✅ Error handling for API failures

### **Azure DevOps Work Item API**
**Test Cases:**
- ✅ Work item type retrieval
- ✅ Work item field validation
- ✅ Work item creation
- ✅ Work item linking
- ✅ Work item template application

## 📱 **Cross-browser Testing**

### **Browser Compatibility**
**Test Cases:**
- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Edge (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Feature Detection**
**Test Cases:**
- ✅ Modern JavaScript features
- ✅ CSS Grid and Flexbox
- ✅ Modal dialog support
- ✅ Local Storage API
- ✅ Progressive enhancement

## 🧪 **Test Implementation**

### **Unit Tests**
```typescript
// Example test structure
describe('PRWorkItems Component', () => {
  test('should display context menu item', () => {
    // Test implementation
  });

  test('should open work item dialog', () => {
    // Test implementation
  });

  test('should create work item successfully', () => {
    // Test implementation
  });
});

describe('Work Item Creation', () => {
  test('should validate required fields', () => {
    // Test implementation
  });

  test('should handle creation errors', () => {
    // Test implementation
  });
});
```

### **Integration Tests**
```typescript
// Example integration test
describe('PRWorkItems Integration', () => {
  test('should create and link work item end-to-end', async () => {
    // Test complete workflow
  });

  test('should handle configuration loading', async () => {
    // Test configuration integration
  });
});
```

### **E2E Tests**
```typescript
// Example Playwright test
test('complete work item creation workflow', async ({ page }) => {
  await page.goto('/pullrequest/12345');
  await page.click('[data-testid="link-workitem-menu"]');
  // Complete workflow test
});
```

## 📊 **Test Metrics**

### **Coverage Targets**
- **Unit Tests**: 90%+ code coverage
- **Integration Tests**: 85%+ API coverage
- **E2E Tests**: 100% critical path coverage
- **Accessibility Tests**: 100% WCAG compliance

### **Performance Benchmarks**
- **Bundle Size**: < 300KB gzipped
- **Load Time**: < 1 second
- **Dialog Open Time**: < 500ms
- **Work Item Creation**: < 2 seconds
- **Memory Usage**: < 25MB baseline

## 🐛 **Bug Reporting**

### **Bug Report Template**
```markdown
**Bug Description:**
[Clear description of the issue]

**Component:**
[Context Menu, Dialog, Work Item Creation, or Configuration]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Extension Version: [version]
- Azure DevOps Version: [version]
- Pull Request State: [state]
- Browser: [browser and version]
- OS: [operating system]

**Configuration:**
[Extension configuration details]

**Screenshots:**
[If applicable]

**Console Logs:**
[If applicable]
```

## 🔄 **Continuous Testing**

### **Automated Testing Pipeline**
- **Pre-commit**: Linting and unit tests
- **Pull Request**: Full test suite
- **Release**: Performance and security tests
- **Post-deployment**: Monitoring and alerting

### **Test Environment Management**
- **Development**: Local development setup
- **Staging**: Azure DevOps test environment
- **Production**: Live environment monitoring

## 📋 **Specific Test Scenarios**

### **Pull Request State Testing**
```typescript
// Test different pull request states
const pullRequestStates = ['active', 'completed', 'abandoned', 'draft'];

pullRequestStates.forEach(state => {
  test(`should handle ${state} pull request state`, () => {
    // Test implementation for each state
  });
});
```

### **Work Item Type Testing**
```typescript
// Test different work item types
const workItemTypes = ['Bug', 'Task', 'User Story', 'Epic', 'Feature'];

workItemTypes.forEach(type => {
  test(`should create ${type} work item correctly`, () => {
    // Test implementation for each type
  });
});
```

### **Permission Testing**
```typescript
// Test different user roles
const userRoles = ['Contributor', 'Project Administrator', 'Team Administrator'];

userRoles.forEach(role => {
  test(`should handle ${role} permissions correctly`, () => {
    // Test implementation for each role
  });
});
```

### **Error Handling Testing**
```typescript
// Test various error scenarios
const errorScenarios = [
  { name: 'Network Error', error: 'Network connectivity issue' },
  { name: 'Permission Error', error: 'Insufficient permissions' },
  { name: 'Validation Error', error: 'Invalid work item data' },
  { name: 'API Error', error: 'Azure DevOps API failure' }
];

errorScenarios.forEach(scenario => {
  test(`should handle ${scenario.name} gracefully`, () => {
    // Test error handling
  });
});
```

---

**Last Updated**: July 30, 2025  
**Version**: 3.0.0  
**Maintainer**: Bill Curtis 