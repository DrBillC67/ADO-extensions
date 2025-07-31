# OneClick Testing Guidelines

## Overview

This document provides comprehensive testing guidelines for the OneClick extension, ensuring quality and reliability across all automation features and scenarios.

## 🧪 **Testing Strategy**

### **Test Types**
- **Unit Tests**: Component and macro function testing
- **Integration Tests**: Work item form integration and rule execution
- **End-to-End Tests**: Complete automation workflows
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Performance Tests**: Bundle size and runtime performance
- **Cross-browser Tests**: Chrome, Firefox, Safari, Edge

### **Test Environment Setup**
- Azure DevOps 2020+ test environment
- Multiple work item types with different field configurations
- Various team configurations and rule groups
- Different user permission levels

## 📋 **Core Functionality Testing**

### **1. Rule Management**
**Test Cases:**
- ✅ Create new rules with multiple actions
- ✅ Edit existing rules
- ✅ Delete rules
- ✅ Reorder rules via drag and drop
- ✅ Configure rule colors
- ✅ Test rule validation
- ✅ Verify rule persistence

**Test Data:**
```typescript
const testRule = {
  id: "rule-123",
  name: "Test Rule",
  color: "#0078d4",
  actions: [
    {
      type: "SetFieldValue",
      fieldName: "System.State",
      fieldValue: "Active"
    },
    {
      type: "SaveWorkItem"
    }
  ],
  triggers: [
    {
      type: "NewWorkItemLoad"
    }
  ]
};
```

### **2. Rule Groups**
**Test Cases:**
- ✅ Create rule groups
- ✅ Subscribe to rule groups
- ✅ Manage rule group permissions
- ✅ Test rule group inheritance
- ✅ Verify rule group isolation
- ✅ Test personal vs global rule groups

**Test Scenarios:**
```typescript
const ruleGroup = {
  id: "group-123",
  name: "Development Team Rules",
  description: "Rules for development team",
  workItemType: "Bug",
  isPersonal: false,
  isGlobal: false,
  rules: []
};
```

### **3. Actions Testing**
**Test Cases:**
- ✅ Set field value action
- ✅ Mention someone action
- ✅ Save work item action
- ✅ Add comment action
- ✅ Add/Remove tags action
- ✅ Add new linked work item action
- ✅ Link to existing work item action

**Action Test Data:**
```typescript
const actions = {
  setFieldValue: {
    type: "SetFieldValue",
    fieldName: "System.AssignedTo",
    fieldValue: "@Me"
  },
  mention: {
    type: "Mention",
    users: "user@example.com",
    message: "Please review this work item"
  },
  addComment: {
    type: "AddComment",
    comment: "Automated comment from OneClick"
  },
  addTags: {
    type: "AddTags",
    tags: "Bug;HighPriority;Automated"
  }
};
```

### **4. Triggers Testing**
**Test Cases:**
- ✅ New work item load trigger
- ✅ Field changed trigger
- ✅ Test trigger conditions
- ✅ Verify trigger execution
- ✅ Test trigger validation

**Trigger Test Data:**
```typescript
const triggers = {
  newWorkItem: {
    type: "NewWorkItemLoad"
  },
  fieldChanged: {
    type: "FieldChanged",
    fieldName: "System.State",
    oldValue: "New",
    newValue: "Active"
  }
};
```

### **5. DevOps Macros Testing**
**Test Cases:**
- ✅ @CurrentIteration macro resolution
- ✅ @StartOfDay macro with arithmetic
- ✅ @StartOfMonth macro with arithmetic
- ✅ @StartOfYear macro with arithmetic
- ✅ @CurrentSprint macro resolution
- ✅ @Me macro resolution
- ✅ @Today macro with arithmetic
- ✅ @fieldValue macro resolution
- ✅ @any macro in triggers

**Macro Test Data:**
```typescript
const macros = {
  currentIteration: "@CurrentIteration",
  startOfDay: "@StartOfDay+1",
  startOfMonth: "@StartOfMonth-1",
  startOfYear: "@StartOfYear+1",
  currentSprint: "@CurrentSprint",
  me: "@Me",
  today: "@Today-2",
  fieldValue: "@fieldValue=System.CreatedBy"
};
```

## 🔧 **Configuration Testing**

### **Settings Management**
**Test Cases:**
- ✅ Access settings from work item form
- ✅ Configure rule groups per work item type
- ✅ Save and load settings
- ✅ Validate settings permissions
- ✅ Test settings migration

### **Work Item Type Configuration**
**Test Cases:**
- ✅ Configure rules for different work item types
- ✅ Test work item type-specific rules
- ✅ Validate configuration inheritance
- ✅ Test configuration validation

## 🎨 **UI/UX Testing**

### **Work Item Form Integration**
**Test Cases:**
- ✅ Display rule buttons in work item form
- ✅ Responsive design within form constraints
- ✅ Theme integration (light, dark, high contrast)
- ✅ Accessibility within form context
- ✅ Keyboard navigation support

### **Rule Editor**
**Test Cases:**
- ✅ Add actions to rules
- ✅ Remove actions from rules
- ✅ Configure action parameters
- ✅ Test action validation
- ✅ Verify rule preview

### **Settings Hub**
**Test Cases:**
- ✅ Access settings hub
- ✅ Manage rule groups
- ✅ Configure permissions
- ✅ Test settings validation
- ✅ Verify settings persistence

## 🔄 **State Management Testing**

### **Rule Execution**
**Test Cases:**
- ✅ Execute rules manually
- ✅ Execute rules via triggers
- ✅ Handle rule execution errors
- ✅ Test rule execution order
- ✅ Verify action execution results

### **Data Synchronization**
**Test Cases:**
- ✅ Real-time rule updates
- ✅ Offline functionality
- ✅ Data conflict resolution
- ✅ Cache invalidation
- ✅ Background sync

## 🚀 **Performance Testing**

### **Bundle Analysis**
**Test Cases:**
- ✅ Bundle size under 600KB
- ✅ Tree shaking effectiveness
- ✅ Code splitting validation
- ✅ Lazy loading implementation
- ✅ Asset optimization

### **Runtime Performance**
**Test Cases:**
- ✅ Initial load time < 2 seconds
- ✅ Rule execution time < 500ms
- ✅ Memory usage monitoring
- ✅ CPU usage optimization
- ✅ Network request optimization

## 🔒 **Security Testing**

### **Rule Validation**
**Test Cases:**
- ✅ Validate rule permissions
- ✅ Test action security
- ✅ Verify trigger security
- ✅ Test macro security
- ✅ Validate data access

### **Authentication & Authorization**
**Test Cases:**
- ✅ User permission validation
- ✅ Rule group access control
- ✅ Action execution permissions
- ✅ Settings modification permissions

## 🌐 **Integration Testing**

### **Azure DevOps Work Item Form**
**Test Cases:**
- ✅ Form group integration
- ✅ Field binding validation
- ✅ Form save/cancel handling
- ✅ Work item type detection
- ✅ Project context awareness

### **Azure DevOps API**
**Test Cases:**
- ✅ Work item updates
- ✅ Comment creation
- ✅ Tag management
- ✅ Work item linking
- ✅ Template application

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
- ✅ Drag and Drop API
- ✅ Local Storage API
- ✅ Progressive enhancement

## 🧪 **Test Implementation**

### **Unit Tests**
```typescript
// Example test structure
describe('OneClick Rules', () => {
  test('should create rule with actions', () => {
    // Test implementation
  });

  test('should execute rule actions', () => {
    // Test implementation
  });

  test('should handle macro resolution', () => {
    // Test implementation
  });
});

describe('DevOps Macros', () => {
  test('should resolve @CurrentIteration macro', () => {
    // Test implementation
  });

  test('should handle date arithmetic', () => {
    // Test implementation
  });
});
```

### **Integration Tests**
```typescript
// Example integration test
describe('OneClick Integration', () => {
  test('should execute rule on work item load', async () => {
    // Test complete workflow
  });

  test('should handle field change triggers', async () => {
    // Test trigger integration
  });
});
```

### **E2E Tests**
```typescript
// Example Playwright test
test('complete rule execution workflow', async ({ page }) => {
  await page.goto('/workitems/edit/123');
  await page.click('[data-testid="rule-button"]');
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
- **Bundle Size**: < 600KB gzipped
- **Load Time**: < 2 seconds
- **Rule Execution**: < 500ms
- **Memory Usage**: < 40MB baseline

## 🐛 **Bug Reporting**

### **Bug Report Template**
```markdown
**Bug Description:**
[Clear description of the issue]

**Rule/Action Type:**
[Rule type, Action type, or Macro type]

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
- Work Item Type: [type]
- Browser: [browser and version]
- OS: [operating system]

**Rule Configuration:**
[Rule configuration details]

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

### **Macro Testing Scenarios**
```typescript
// Test all macro types
const macroTests = [
  { macro: '@CurrentIteration', expected: 'Project\\Iteration\\Sprint 1' },
  { macro: '@StartOfDay+1', expected: '2025-07-31T00:00:00Z' },
  { macro: '@StartOfMonth-1', expected: '2025-06-01T00:00:00Z' },
  { macro: '@StartOfYear+1', expected: '2026-01-01T00:00:00Z' },
  { macro: '@CurrentSprint', expected: 'Sprint 1' },
  { macro: '@Me', expected: 'current-user@example.com' },
  { macro: '@Today-2', expected: '2025-07-28T00:00:00Z' }
];

macroTests.forEach(({ macro, expected }) => {
  test(`should resolve ${macro} correctly`, () => {
    // Test macro resolution
  });
});
```

### **Rule Execution Testing**
```typescript
// Test different rule scenarios
const ruleScenarios = [
  {
    name: 'State Change Rule',
    trigger: { type: 'FieldChanged', fieldName: 'System.State', oldValue: 'New', newValue: 'Active' },
    actions: [
      { type: 'SetFieldValue', fieldName: 'System.AssignedTo', fieldValue: '@Me' },
      { type: 'AddComment', comment: 'Automatically assigned when activated' }
    ]
  },
  {
    name: 'New Work Item Rule',
    trigger: { type: 'NewWorkItemLoad' },
    actions: [
      { type: 'SetFieldValue', fieldName: 'System.IterationPath', fieldValue: '@CurrentIteration' },
      { type: 'SetFieldValue', fieldName: 'System.AssignedTo', fieldValue: '@Me' }
    ]
  }
];

ruleScenarios.forEach(scenario => {
  test(`should execute ${scenario.name} correctly`, () => {
    // Test rule execution
  });
});
```

### **Permission Testing**
```typescript
// Test different user roles
const userRoles = ['Contributor', 'Project Administrator', 'Team Administrator'];

userRoles.forEach(role => {
  test(`should handle ${role} permissions correctly`, () => {
    // Test permission scenarios
  });
});
```

---

**Last Updated**: July 30, 2025  
**Version**: 3.0.0  
**Maintainer**: Bill Curtis 