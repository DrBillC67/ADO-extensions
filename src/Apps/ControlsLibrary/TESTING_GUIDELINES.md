# ControlsLibrary Testing Guidelines

## Overview

This document provides comprehensive testing guidelines for the ControlsLibrary extension, ensuring quality and reliability across all custom controls and scenarios.

## 🧪 **Testing Strategy**

### **Test Types**
- **Unit Tests**: Individual control component testing
- **Integration Tests**: Work item form integration and field binding
- **End-to-End Tests**: Complete control workflows
- **Accessibility Tests**: WCAG 2.1 AA compliance
- **Performance Tests**: Bundle size and runtime performance
- **Cross-browser Tests**: Chrome, Firefox, Safari, Edge

### **Test Environment Setup**
- Azure DevOps 2020+ test environment
- Multiple work item types with different field configurations
- Various field types (String, Integer, DateTime, etc.)
- Different user permission levels

## 📋 **Core Controls Testing**

### **1. DateTime Control**
**Test Cases:**
- ✅ Display current field value correctly
- ✅ Open calendar picker on icon click
- ✅ Select date from calendar
- ✅ Select time from time picker
- ✅ Validate date/time format
- ✅ Handle invalid date inputs
- ✅ Test field binding and updates
- ✅ Verify timezone handling

**Test Data:**
```typescript
const dateTimeField = {
  fieldName: "System.CreatedDate",
  value: "2025-07-30T10:30:00Z",
  format: "YYYY-MM-DDTHH:mm:ssZ"
};

const invalidDateTime = {
  fieldName: "System.CreatedDate",
  value: "invalid-date",
  expectedError: "Invalid date format"
};
```

### **2. Pattern Control**
**Test Cases:**
- ✅ Apply regex pattern validation
- ✅ Display custom error messages
- ✅ Validate common patterns (email, phone, URL, GUID)
- ✅ Handle pattern matching correctly
- ✅ Test real-time validation
- ✅ Verify field binding
- ✅ Test pattern compilation errors

**Test Patterns:**
```typescript
const testPatterns = {
  email: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  phone: "^[+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
  url: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)",
  guid: "^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
};
```

### **3. Slider Control**
**Test Cases:**
- ✅ Display current numeric value
- ✅ Set minimum and maximum values
- ✅ Adjust step size correctly
- ✅ Update field value on slider change
- ✅ Handle decimal values
- ✅ Test keyboard navigation
- ✅ Verify accessibility features

**Test Configuration:**
```typescript
const sliderConfig = {
  fieldName: "Microsoft.VSTS.Common.Priority",
  minValue: 1,
  maxValue: 5,
  stepSize: 1,
  currentValue: 3
};
```

### **4. Rating Control**
**Test Cases:**
- ✅ Display star rating correctly
- ✅ Set minimum and maximum values
- ✅ Update rating on star click
- ✅ Handle hover states
- ✅ Test keyboard navigation
- ✅ Verify accessibility features
- ✅ Test partial star ratings

**Test Configuration:**
```typescript
const ratingConfig = {
  fieldName: "Microsoft.VSTS.Common.Priority",
  minValue: 1,
  maxValue: 5,
  currentValue: 4
};
```

### **5. MultiValue Control**
**Test Cases:**
- ✅ Display suggested values
- ✅ Add multiple values
- ✅ Remove values
- ✅ Filter suggestions on input
- ✅ Handle duplicate values
- ✅ Test keyboard navigation
- ✅ Verify field binding

**Test Data:**
```typescript
const multiValueConfig = {
  fieldName: "System.Tags",
  values: "Bug;Feature;Enhancement;Documentation",
  currentValue: "Bug;Feature"
};
```

### **6. Plain Text Control**
**Test Cases:**
- ✅ Display markdown text correctly
- ✅ Render dynamic field substitutions
- ✅ Handle field value macros
- ✅ Test markdown formatting
- ✅ Verify height constraints
- ✅ Test accessibility features

**Test Content:**
```typescript
const plainTextConfig = {
  text: "Work Item ID: ${@fieldValue=ID}\nAssigned to: ${@fieldValue=Assigned To}",
  maxHeight: "200px",
  fieldValues: {
    ID: "12345",
    "Assigned To": "John Doe"
  }
};
```

## 🔧 **Configuration Testing**

### **Control Configuration**
**Test Cases:**
- ✅ Load control configuration from work item form
- ✅ Validate required configuration parameters
- ✅ Handle missing configuration gracefully
- ✅ Test configuration error handling
- ✅ Verify field binding validation

### **Field Type Validation**
**Test Cases:**
- ✅ Validate field type compatibility
- ✅ Handle unsupported field types
- ✅ Test field value conversion
- ✅ Verify data type constraints

## 🎨 **UI/UX Testing**

### **Work Item Form Integration**
**Test Cases:**
- ✅ Display controls within form groups
- ✅ Responsive design within form constraints
- ✅ Theme integration (light, dark, high contrast)
- ✅ Accessibility within form context
- ✅ Keyboard navigation support

### **Control Styling**
**Test Cases:**
- ✅ Consistent visual appearance
- ✅ Theme-aware styling
- ✅ Focus states and indicators
- ✅ Error state styling
- ✅ Loading state indicators

### **Accessibility**
**Test Cases:**
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast compliance
- ✅ Focus management

## 🔄 **State Management Testing**

### **Field Value Binding**
**Test Cases:**
- ✅ Initialize control with field value
- ✅ Update field value on control change
- ✅ Handle field value changes from external sources
- ✅ Validate field value constraints
- ✅ Test field value persistence

### **Error Handling**
**Test Cases:**
- ✅ Display validation errors
- ✅ Handle API errors gracefully
- ✅ Test network connectivity issues
- ✅ Validate error message clarity
- ✅ Test error recovery

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
- ✅ Component render time < 75ms
- ✅ Memory usage monitoring
- ✅ CPU usage optimization
- ✅ Network request optimization

## 🔒 **Security Testing**

### **Input Validation**
**Test Cases:**
- ✅ Sanitize user inputs
- ✅ Prevent XSS attacks
- ✅ Validate field values
- ✅ Handle malicious patterns
- ✅ Test injection attacks

### **Data Security**
**Test Cases:**
- ✅ Secure field value transmission
- ✅ Validate field access permissions
- ✅ Test data isolation
- ✅ Verify encryption requirements

## 🌐 **Integration Testing**

### **Azure DevOps Work Item Form**
**Test Cases:**
- ✅ Form control integration
- ✅ Field binding validation
- ✅ Form save/cancel handling
- ✅ Work item type detection
- ✅ Project context awareness

### **Field System Integration**
**Test Cases:**
- ✅ Field value retrieval
- ✅ Field value updates
- ✅ Field validation integration
- ✅ Field type compatibility
- ✅ Field permission validation

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
- ✅ HTML5 input types
- ✅ Web APIs (Date API, etc.)
- ✅ Progressive enhancement

## 🧪 **Test Implementation**

### **Unit Tests**
```typescript
// Example test structure
describe('DateTime Control', () => {
  test('should display current field value', () => {
    // Test implementation
  });

  test('should update field value on date selection', () => {
    // Test implementation
  });

  test('should handle invalid date inputs', () => {
    // Test implementation
  });
});

describe('Pattern Control', () => {
  test('should validate email pattern correctly', () => {
    // Test implementation
  });

  test('should display custom error message', () => {
    // Test implementation
  });
});
```

### **Integration Tests**
```typescript
// Example integration test
describe('Control Integration', () => {
  test('should bind to work item field correctly', async () => {
    // Test complete workflow
  });

  test('should handle field value changes', async () => {
    // Test field integration
  });
});
```

### **E2E Tests**
```typescript
// Example Playwright test
test('datetime control workflow', async ({ page }) => {
  await page.goto('/workitems/edit/123');
  await page.click('[data-testid="datetime-control"]');
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
- **Render Time**: < 75ms per component
- **Memory Usage**: < 30MB baseline

## 🐛 **Bug Reporting**

### **Bug Report Template**
```markdown
**Bug Description:**
[Clear description of the issue]

**Control Type:**
[DateTime/Pattern/Slider/Rating/MultiValue/PlainText]

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
- Field Type: [type]
- Browser: [browser and version]
- OS: [operating system]

**Configuration:**
[Control configuration details]

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

### **Field Type Compatibility Testing**
```typescript
// Test different field types
const fieldTypes = ['String', 'Integer', 'DateTime', 'Double', 'Boolean'];

fieldTypes.forEach(type => {
  test(`should handle ${type} field type correctly`, () => {
    // Test implementation for each field type
  });
});
```

### **Pattern Validation Testing**
```typescript
// Test various regex patterns
const patterns = [
  { name: 'Email', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
  { name: 'Phone', pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$' },
  { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)' }
];

patterns.forEach(({ name, pattern }) => {
  test(`should validate ${name} pattern correctly`, () => {
    // Test pattern validation
  });
});
```

### **Accessibility Testing**
```typescript
// Test accessibility features
test('should support keyboard navigation', () => {
  // Test keyboard accessibility
});

test('should have proper ARIA labels', () => {
  // Test ARIA compliance
});

test('should support screen readers', () => {
  // Test screen reader compatibility
});
```

---

**Last Updated**: July 30, 2025  
**Version**: 3.0.0  
**Maintainer**: Bill Curtis 