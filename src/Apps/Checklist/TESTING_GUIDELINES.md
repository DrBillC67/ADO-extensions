# Checklist Testing Guidelines

## Overview

This document provides comprehensive testing guidelines for the Checklist extension, ensuring quality and reliability across all features and scenarios.

## 🎯 **Current Test Status**

### ✅ **Test Implementation Complete**
- **7 Tests Passing**: Comprehensive test coverage implemented
- **Test File**: `src/Apps/Checklist/scripts/__tests__/Checklist.test.tsx`
- **Test Command**: `npm run test:checklist`
- **Coverage**: Component lifecycle, error states, loading states, data states, empty states

## 🧪 **Testing Strategy**

### **Test Types**
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Work item form integration and data persistence
- **End-to-End Tests**: Complete checklist workflows
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Performance Tests**: Bundle size and runtime performance
- **Cross-browser Tests**: Chrome, Firefox, Safari, Edge

### **Test Environment Setup**
- Azure DevOps 2020+ test environment
- Multiple work item types (Bug, Task, User Story, etc.)
- Different user permission levels
- Various team configurations

## 📋 **Core Functionality Testing**

### **1. Checklist Item Management**
**Test Cases:**
- ✅ Add new checklist items
- ✅ Edit existing checklist items
- ✅ Delete checklist items
- ✅ Mark items as checked/unchecked
- ✅ Reorder checklist items via drag and drop
- ✅ Validate item text length limits
- ✅ Test mandatory item functionality
- ✅ Verify item state persistence

**Test Data:**
```typescript
const checklistItem = {
  id: "item-123",
  text: "Test checklist item",
  isChecked: false,
  isMandatory: false,
  order: 1,
  state: "active"
};

const mandatoryItem = {
  id: "item-124",
  text: "Mandatory task",
  isChecked: false,
  isMandatory: true,
  order: 2,
  state: "active"
};
```

### **2. Personal vs Shared Checklists**
**Test Cases:**
- ✅ Create personal checklist items (user-specific)
- ✅ Create shared checklist items (account-wide)
- ✅ Switch between personal and shared views
- ✅ Verify data isolation between personal and shared
- ✅ Test user-specific data persistence
- ✅ Validate shared data accessibility

### **3. Default Checklist Items**
**Test Cases:**
- ✅ Configure default items for work item types
- ✅ Apply default items to new work items
- ✅ Edit default items via settings hub
- ✅ Remove default items
- ✅ Validate default item inheritance
- ✅ Test default item state management

**Test Scenarios:**
```typescript
// Default items configuration
const defaultItems = [
  {
    text: "Unit tests completed",
    isMandatory: true,
    workItemType: "Bug"
  },
  {
    text: "Code review completed",
    isMandatory: true,
    workItemType: "Task"
  }
];
```

### **4. Work Item Integration**
**Test Cases:**
- ✅ Load checklist for existing work items
- ✅ Create checklist for new work items
- ✅ Persist checklist data per work item
- ✅ Handle work item type changes
- ✅ Test work item form integration
- ✅ Verify data synchronization

## 🔧 **Configuration Testing**

### **Settings Hub**
**Test Cases:**
- ✅ Access settings hub from work item form
- ✅ Configure default items per work item type
- ✅ Save and load settings
- ✅ Validate settings permissions
- ✅ Test settings migration

### **Work Item Type Configuration**
**Test Cases:**
- ✅ Configure checklist for different work item types
- ✅ Test work item type-specific defaults
- ✅ Validate configuration inheritance
- ✅ Test configuration validation

## 🎨 **UI/UX Testing**

### **Work Item Form Integration**
**Test Cases:**
- ✅ Display checklist group in work item form
- ✅ Responsive design within form constraints
- ✅ Theme integration (light, dark, high contrast)
- ✅ Accessibility within form context
- ✅ Keyboard navigation support

### **Drag and Drop Functionality**
**Test Cases:**
- ✅ Drag handle visibility on hover
- ✅ Drag and drop reordering
- ✅ Visual feedback during drag
- ✅ Drop zone validation
- ✅ Touch device support
- ✅ Keyboard reordering alternative

### **Visual States**
**Test Cases:**
- ✅ Checked/unchecked item appearance
- ✅ Mandatory item indicators
- ✅ Loading states
- ✅ Error states
- ✅ Empty state handling

## 🔄 **State Management Testing**

### **Zustand Store**
**Test Cases:**
- ✅ Checklist data persistence
- ✅ Item state management
- ✅ Personal vs shared data separation
- ✅ Default items management
- ✅ Error state handling
- ✅ Loading state management

### **Data Synchronization**
**Test Cases:**
- ✅ Real-time updates
- ✅ Offline functionality
- ✅ Data conflict resolution
- ✅ Cache invalidation
- ✅ Background sync

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
- ✅ Component render time < 50ms
- ✅ Memory usage monitoring
- ✅ CPU usage optimization
- ✅ Network request optimization

## 🔒 **Security Testing**

### **Data Validation**
**Test Cases:**
- ✅ Input sanitization for item text
- ✅ XSS prevention
- ✅ CSRF protection
- ✅ Data isolation between users
- ✅ Permission validation

### **Authentication & Authorization**
**Test Cases:**
- ✅ User permission validation
- ✅ Work item access control
- ✅ Settings modification permissions
- ✅ Default item configuration permissions

## 🌐 **Integration Testing**

### **Azure DevOps Work Item Form**
**Test Cases:**
- ✅ Form group integration
- ✅ Field binding validation
- ✅ Form save/cancel handling
- ✅ Work item type detection
- ✅ Project context awareness

### **Data Storage**
**Test Cases:**
- ✅ Extension data storage
- ✅ Data persistence across sessions
- ✅ Data migration from previous versions
- ✅ Data cleanup and maintenance

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
describe('Checklist Component', () => {
  test('should add new checklist item', () => {
    // Test implementation
  });

  test('should toggle item checked state', () => {
    // Test implementation
  });

  test('should reorder items via drag and drop', () => {
    // Test implementation
  });

  test('should handle mandatory items', () => {
    // Test implementation
  });
});
```

### **Integration Tests**
```typescript
// Example integration test
describe('Checklist Integration', () => {
  test('should persist checklist data with work item', async () => {
    // Test complete workflow
  });

  test('should load default items for work item type', async () => {
    // Test default items integration
  });
});
```

### **E2E Tests**
```typescript
// Example Playwright test
test('complete checklist workflow', async ({ page }) => {
  await page.goto('/workitems/edit/123');
  await page.click('[data-testid="add-checklist-item"]');
  // Complete workflow test
});
```

## 📊 **Test Metrics**

### **Coverage Targets**
- **Unit Tests**: 85%+ code coverage
- **Integration Tests**: 75%+ API coverage
- **E2E Tests**: 100% critical path coverage
- **Accessibility Tests**: 100% WCAG compliance

### **Performance Benchmarks**
- **Bundle Size**: < 300KB gzipped
- **Load Time**: < 1 second
- **Render Time**: < 50ms per component
- **Memory Usage**: < 25MB baseline

## 🐛 **Bug Reporting**

### **Bug Report Template**
```markdown
**Bug Description:**
[Clear description of the issue]

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

### **Work Item Type Specific Testing**
```typescript
// Test different work item types
const workItemTypes = ['Bug', 'Task', 'User Story', 'Epic', 'Feature'];

workItemTypes.forEach(type => {
  test(`should handle checklist for ${type} work items`, () => {
    // Test implementation for each type
  });
});
```

### **User Permission Testing**
```typescript
// Test different user roles
const userRoles = ['Contributor', 'Project Administrator', 'Team Administrator'];

userRoles.forEach(role => {
  test(`should handle ${role} permissions correctly`, () => {
    // Test implementation for each role
  });
});
```

### **Data Migration Testing**
```typescript
// Test migration from previous versions
test('should migrate data from version 2.x', () => {
  // Test migration scenarios
});

test('should handle corrupted data gracefully', () => {
  // Test error handling
});
```

---

**Last Updated**: July 30, 2025  
**Version**: 3.0.0  
**Maintainer**: Bill Curtis 