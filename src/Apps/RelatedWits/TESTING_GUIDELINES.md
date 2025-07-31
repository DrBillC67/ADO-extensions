# RelatedWits Testing Guidelines

## Overview

This document provides comprehensive testing guidelines for the RelatedWits extension, ensuring quality and reliability across all search and linking features and scenarios.

## 🧪 **Testing Strategy**

### **Test Types**
- **Unit Tests**: Component and search function testing
- **Integration Tests**: Work item form integration and search execution
- **End-to-End Tests**: Complete search and linking workflows
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Performance Tests**: Bundle size and runtime performance
- **Cross-browser Tests**: Chrome, Firefox, Safari, Edge

### **Test Environment Setup**
- Azure DevOps 2020+ test environment
- Multiple work item types with different field configurations
- Various search configurations and result sets
- Different user permission levels

## 📋 **Core Functionality Testing**

### **1. Search Configuration**
**Test Cases:**
- ✅ Configure search fields for related work items
- ✅ Set sort field and direction
- ✅ Configure result count limits
- ✅ Save and load search configurations
- ✅ Test configuration validation
- ✅ Verify configuration persistence

**Test Data:**
```typescript
const searchConfig = {
  id: "config-123",
  workItemType: "Bug",
  searchFields: ["System.WorkItemType", "System.State", "System.AreaPath"],
  sortField: "System.ChangedDate",
  sortDirection: "desc",
  resultCount: 20,
  isDefault: false
};
```

### **2. Related Work Item Search**
**Test Cases:**
- ✅ Execute search based on current work item field values
- ✅ Display search results in DetailsList
- ✅ Handle empty search results
- ✅ Test search performance with large result sets
- ✅ Verify search accuracy and relevance
- ✅ Test search error handling

**Test Scenarios:**
```typescript
const searchScenario = {
  currentWorkItem: {
    id: 12345,
    workItemType: "Bug",
    state: "Active",
    areaPath: "Project\\Team\\Component"
  },
  expectedResults: [
    { id: 12346, title: "Related Bug 1", workItemType: "Bug", state: "Active" },
    { id: 12347, title: "Related Bug 2", workItemType: "Bug", state: "Active" }
  ]
};
```

### **3. Work Item Linking**
**Test Cases:**
- ✅ Add links to related work items
- ✅ Remove links from work items
- ✅ Test link type selection
- ✅ Verify link creation and removal
- ✅ Test link validation
- ✅ Handle link errors gracefully

**Link Test Data:**
```typescript
const linkOperation = {
  sourceWorkItemId: 12345,
  targetWorkItemId: 12346,
  linkType: "Related",
  operation: "add" // or "remove"
};
```

### **4. Advanced Search Features**
**Test Cases:**
- ✅ Date range filtering
- ✅ Custom field filters
- ✅ Saved search configurations
- ✅ Export functionality (CSV, Excel)
- ✅ Search result caching
- ✅ Real-time search updates

**Advanced Search Data:**
```typescript
const advancedSearch = {
  dateRange: {
    startDate: "2025-01-01",
    endDate: "2025-12-31"
  },
  customFilters: [
    { field: "System.Priority", operator: "=", value: "High" },
    { field: "System.AssignedTo", operator: "=", value: "@Me" }
  ],
  savedSearch: "High Priority Bugs"
};
```

## 🔧 **Configuration Testing**

### **Settings Management**
**Test Cases:**
- ✅ Access settings from work item form page
- ✅ Configure search parameters per work item type
- ✅ Save and load settings
- ✅ Validate settings permissions
- ✅ Test settings migration

### **Work Item Type Configuration**
**Test Cases:**
- ✅ Configure searches for different work item types
- ✅ Test work item type-specific configurations
- ✅ Validate configuration inheritance
- ✅ Test configuration validation

## 🎨 **UI/UX Testing**

### **Work Item Form Page Integration**
**Test Cases:**
- ✅ Display related work items page in work item form
- ✅ Responsive design within form constraints
- ✅ Theme integration (light, dark, high contrast)
- ✅ Accessibility within form context
- ✅ Keyboard navigation support

### **DetailsList Component**
**Test Cases:**
- ✅ Display work items in table format
- ✅ Sort columns correctly
- ✅ Filter results
- ✅ Handle large datasets with virtualization
- ✅ Test context menu functionality
- ✅ Verify row selection

### **Search Interface**
**Test Cases:**
- ✅ Search field configuration UI
- ✅ Sort field selection
- ✅ Result count configuration
- ✅ Search execution feedback
- ✅ Error state display

## 🔄 **State Management Testing**

### **Search State Management**
**Test Cases:**
- ✅ Search configuration persistence
- ✅ Search results caching
- ✅ Loading state management
- ✅ Error state handling
- ✅ Real-time updates

### **Data Synchronization**
**Test Cases:**
- ✅ Real-time work item updates
- ✅ Search result refresh
- ✅ Cache invalidation
- ✅ Background sync
- ✅ Offline functionality

## 🚀 **Performance Testing**

### **Bundle Analysis**
**Test Cases:**
- ✅ Bundle size under 400KB
- ✅ Tree shaking effectiveness
- ✅ Code splitting validation
- ✅ Lazy loading implementation
- ✅ Asset optimization

### **Runtime Performance**
**Test Cases:**
- ✅ Initial load time < 1.5 seconds
- ✅ Search execution time < 2 seconds
- ✅ Memory usage monitoring
- ✅ CPU usage optimization
- ✅ Network request optimization

### **Large Dataset Handling**
**Test Cases:**
- ✅ Virtualization for large result sets
- ✅ Pagination implementation
- ✅ Memory usage with 1000+ items
- ✅ Search performance with complex filters
- ✅ Export performance for large datasets

## 🔒 **Security Testing**

### **Search Security**
**Test Cases:**
- ✅ Validate search permissions
- ✅ Test field access control
- ✅ Verify work item access permissions
- ✅ Test link creation permissions
- ✅ Validate data isolation

### **Authentication & Authorization**
**Test Cases:**
- ✅ User permission validation
- ✅ Work item access control
- ✅ Search configuration permissions
- ✅ Link management permissions

## 🌐 **Integration Testing**

### **Azure DevOps Work Item Form**
**Test Cases:**
- ✅ Form page integration
- ✅ Field value retrieval
- ✅ Work item context awareness
- ✅ Project context awareness
- ✅ Team context awareness

### **Azure DevOps API**
**Test Cases:**
- ✅ Work item search API
- ✅ Work item linking API
- ✅ Field value retrieval
- ✅ Permission validation
- ✅ Error handling for API failures

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
- ✅ Virtual scrolling support
- ✅ Local Storage API
- ✅ Progressive enhancement

## 🧪 **Test Implementation**

### **Unit Tests**
```typescript
// Example test structure
describe('RelatedWits Search', () => {
  test('should execute search with valid configuration', () => {
    // Test implementation
  });

  test('should handle empty search results', () => {
    // Test implementation
  });

  test('should validate search configuration', () => {
    // Test implementation
  });
});

describe('Work Item Linking', () => {
  test('should create link between work items', () => {
    // Test implementation
  });

  test('should remove link between work items', () => {
    // Test implementation
  });
});
```

### **Integration Tests**
```typescript
// Example integration test
describe('RelatedWits Integration', () => {
  test('should search and display related work items', async () => {
    // Test complete workflow
  });

  test('should handle work item linking workflow', async () => {
    // Test linking integration
  });
});
```

### **E2E Tests**
```typescript
// Example Playwright test
test('complete search and link workflow', async ({ page }) => {
  await page.goto('/workitems/edit/123');
  await page.click('[data-testid="related-wits-tab"]');
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
- **Bundle Size**: < 400KB gzipped
- **Load Time**: < 1.5 seconds
- **Search Execution**: < 2 seconds
- **Memory Usage**: < 35MB baseline

## 🐛 **Bug Reporting**

### **Bug Report Template**
```markdown
**Bug Description:**
[Clear description of the issue]

**Search/Link Type:**
[Search configuration, Link operation, or UI component]

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

**Search Configuration:**
[Search configuration details]

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

### **Search Configuration Testing**
```typescript
// Test different search configurations
const searchConfigs = [
  {
    name: 'Simple Search',
    searchFields: ['System.WorkItemType'],
    sortField: 'System.CreatedDate',
    resultCount: 10
  },
  {
    name: 'Complex Search',
    searchFields: ['System.WorkItemType', 'System.State', 'System.AreaPath', 'System.Tags'],
    sortField: 'System.ChangedDate',
    resultCount: 50
  }
];

searchConfigs.forEach(config => {
  test(`should handle ${config.name} configuration`, () => {
    // Test search configuration
  });
});
```

### **Work Item Type Testing**
```typescript
// Test different work item types
const workItemTypes = ['Bug', 'Task', 'User Story', 'Epic', 'Feature'];

workItemTypes.forEach(type => {
  test(`should handle ${type} work items correctly`, () => {
    // Test work item type scenarios
  });
});
```

### **Performance Testing Scenarios**
```typescript
// Test performance with different dataset sizes
const datasetSizes = [10, 100, 1000, 10000];

datasetSizes.forEach(size => {
  test(`should handle ${size} search results efficiently`, () => {
    // Test performance scenarios
  });
});
```

### **Export Functionality Testing**
```typescript
// Test export features
const exportFormats = ['CSV', 'Excel'];

exportFormats.forEach(format => {
  test(`should export search results to ${format}`, () => {
    // Test export functionality
  });
});
```

---

**Last Updated**: July 30, 2025  
**Version**: 3.0.0  
**Maintainer**: Bill Curtis 