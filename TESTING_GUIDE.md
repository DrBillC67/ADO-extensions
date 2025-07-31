# Testing Azure DevOps Extensions

## 🎯 **Current Status**

### ✅ **Successfully Implemented:**
- **Complete Test Infrastructure**: Jest + React Testing Library with TypeScript
- **93 Tests Passing**: 100% pass rate across all extensions
- **Individual Test Commands**: Each extension has its own test command
- **Comprehensive Mock System**: VSS/TFS APIs and UI components
- **Coverage Reporting**: Detailed coverage analysis

### 📊 **Test Results:**
```
Test Suites: 7 passed, 7 total
Tests:       93 passed, 93 total
Snapshots:   0 total
```

**Extensions with Working Tests:**
- ✅ **OneClick**: 31 tests passing
- ✅ **BugBashPro**: 7 tests passing (expanded coverage)
- ✅ **Checklist**: 7 tests passing (expanded coverage)
- ✅ **ControlsLibrary**: 10 tests passing (expanded coverage)
- ✅ **PRWorkItems**: 9 tests passing (expanded coverage)
- ✅ **RelatedWits**: 16 tests passing (all fixed!)
- ✅ **Common Components**: 13 tests passing (new comprehensive tests)

## 🚀 **Quick Start**

### **1. Run Tests**
```bash
# Run all tests (93 tests, 100% pass rate)
npm test

# Run tests for specific extension
npm run test:oneclick      # 31 tests passing
npm run test:bugbashpro    # 7 tests passing
npm run test:checklist     # 7 tests passing
npm run test:controlslibrary # 10 tests passing
npm run test:prworkitems   # 9 tests passing
npm run test:relatedwits   # 16 tests passing
npm run test:common        # 13 tests passing

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **2. Start Development Server**
```bash
# Start webpack dev server
npm start

# Or use Vite (faster)
npm run start:vite
```

This will start a development server at `https://localhost:8888` with hot reloading.

---

## 🧪 **Current Testing Infrastructure**

### **✅ Complete Test Setup**
Our testing infrastructure is fully functional with:

- **Jest Configuration**: Complete setup with TypeScript support
- **React Testing Library**: Component testing with accessibility support
- **Mock System**: Comprehensive mocks for VSS/TFS APIs and UI components
- **Test Scripts**: Individual test commands for each extension
- **Coverage Reporting**: Detailed coverage analysis

### **📁 Test Files Structure**
```
src/
├── __mocks__/                    # Global mock files
│   ├── styleMock.js             # CSS/SCSS mocks
│   ├── fileMock.js              # Asset file mocks
│   ├── VSS_Service.js           # VSS/Service mock
│   ├── TFS_Work_RestClient.js   # TFS/Work/RestClient mock
│   └── FluentUIIcons.js         # Fluent UI icons mock
├── Apps/
│   ├── BugBashPro/scripts/__tests__/
│   │   └── BugBashPro.test.tsx  # 7 comprehensive tests
│   ├── Checklist/scripts/__tests__/
│   │   └── Checklist.test.tsx   # 7 comprehensive tests
│   ├── ControlsLibrary/scripts/__tests__/
│   │   └── ControlsLibrary.test.tsx # 10 comprehensive tests
│   ├── OneClick/scripts/Macros/__tests__/
│   │   └── DevOpsMacros.test.ts # 31 tests (all passing)
│   ├── PRWorkItems/scripts/__tests__/
│   │   └── PRWorkItems.test.tsx # 9 comprehensive tests
│   └── RelatedWits/scripts/__tests__/
│       └── RelatedWitsTable.test.tsx # 16 tests (all fixed)
├── Common/Components/__tests__/
│   └── CommonComponents.test.tsx # 13 comprehensive tests
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup and global mocks
└── tsconfig.json                # TypeScript configuration
```

## 🧪 **Testing Approaches**

### **1. Webpack Dev Server Testing**

#### **Setup Mock Environment**
Create a mock Azure DevOps environment for local testing:

```typescript
// src/test/mocks/azure-devops-mock.ts
export const mockVSS = {
  getExtensionContext: () => ({
    publisherId: 'test-publisher',
    extensionId: 'test-extension',
    baseUri: 'https://localhost:8888'
  }),
  getWebContext: () => ({
    project: { id: 'test-project', name: 'Test Project' },
    collection: { id: 'test-collection', name: 'Test Collection' },
    user: { id: 'test-user', name: 'Test User' }
  }),
  register: (contributionId: string, callback: any) => {
    console.log(`Registered contribution: ${contributionId}`);
    return callback;
  },
  getService: async (serviceId: string) => {
    // Mock services
    const services = {
      'ms.vss-web.dialog-service': {
        openDialog: (contributionId: string, options: any) => {
          console.log('Mock dialog opened:', contributionId);
        }
      },
      'ms.vss-work-web.work-item-form-service': {
        getFieldValue: (fieldName: string) => 'Mock Value',
        setFieldValue: (fieldName: string, value: any) => {
          console.log(`Field ${fieldName} set to:`, value);
        }
      }
    };
    return services[serviceId] || {};
  }
};

// Mock global VSS object
(global as any).VSS = mockVSS;
```

#### **Create Test Harness**
```typescript
// src/test/test-harness.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Fabric } from '@fluentui/react';
import { initializeIcons } from '@fluentui/react/lib/Icons';

// Import your extension components
import { App as OneClickApp } from '../Apps/OneClick/scripts/App';
import { App as ChecklistApp } from '../Apps/Checklist/scripts/App';
import { App as RelatedWitsApp } from '../Apps/RelatedWits/scripts/App';
import { App as BugBashProApp } from '../Apps/BugBashPro/scripts/App';
import { ConfigureDialog as PRWorkItemsDialog } from '../Apps/PRWorkItems/scripts/Components/ConfigureDialog';

// Initialize Fluent UI
initializeIcons();

// Test Harness Component
const TestHarness: React.FC = () => {
  const [selectedExtension, setSelectedExtension] = React.useState('oneclick');

  const renderExtension = () => {
    switch (selectedExtension) {
      case 'oneclick':
        return <OneClickApp />;
      case 'checklist':
        return <ChecklistApp />;
      case 'relatedwits':
        return <RelatedWitsApp />;
      case 'bugbashpro':
        return <BugBashProApp />;
      case 'prworkitems':
        return <PRWorkItemsDialog />;
      default:
        return <div>Select an extension to test</div>;
    }
  };

  return (
    <Fabric>
      <div style={{ padding: '20px' }}>
        <h1>Azure DevOps Extensions Test Harness</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Select Extension: </label>
          <select 
            value={selectedExtension} 
            onChange={(e) => setSelectedExtension(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          >
            <option value="oneclick">OneClick</option>
            <option value="checklist">Checklist</option>
            <option value="relatedwits">RelatedWits</option>
            <option value="bugbashpro">BugBashPro</option>
            <option value="prworkitems">PRWorkItems</option>
          </select>
        </div>

        <div style={{ border: '1px solid #ccc', padding: '20px', minHeight: '500px' }}>
          {renderExtension()}
        </div>
      </div>
    </Fabric>
  );
};

// Initialize test harness
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestHarness />);
}
```

### **2. Unit Testing with Jest & React Testing Library**

#### **Setup Testing Environment**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

#### **Jest Configuration**
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^Common/(.*)$': '<rootDir>/src/Common/$1',
    '^OfficeFabric/(.*)$': '@fluentui/react',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx)'
  ]
};
```

#### **Test Setup**
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { mockVSS } from './mocks/azure-devops-mock';

// Mock VSS globally
(global as any).VSS = mockVSS;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

#### **Example Test**
```typescript
// src/Apps/OneClick/scripts/__tests__/App.test.tsx
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../App';

describe('OneClick App', () => {
  beforeEach(() => {
    // Setup any mocks needed
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/OneClick Actions/i)).toBeInTheDocument();
  });

  it('handles button clicks', async () => {
    render(<App />);
    
    const button = screen.getByRole('button', { name: /create work item/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText(/work item created/i)).toBeInTheDocument();
    });
  });
});
```

### **3. Integration Testing**

#### **Create Integration Test Suite**
```typescript
// src/test/integration/extension-integration.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OneClickApp } from '../../Apps/OneClick/scripts/App';
import { ChecklistApp } from '../../Apps/Checklist/scripts/App';

describe('Extension Integration Tests', () => {
  describe('OneClick Extension', () => {
    it('should create work item and link to pull request', async () => {
      render(<OneClickApp />);
      
      // Simulate work item creation
      const createButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText(/work item created successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Checklist Extension', () => {
    it('should add and remove checklist items', async () => {
      render(<ChecklistApp />);
      
      // Add item
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/new item/i)).toBeInTheDocument();
      });
      
      // Remove item
      const removeButton = screen.getByRole('button', { name: /remove/i });
      fireEvent.click(removeButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/new item/i)).not.toBeInTheDocument();
      });
    });
  });
});
```

### **4. E2E Testing with Playwright**

#### **Setup Playwright**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

#### **Playwright Configuration**
```typescript
// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/test/e2e',
  use: {
    baseURL: 'https://localhost:8888',
    headless: false,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Chrome',
      use: { browserName: 'chromium' },
    },
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'Safari',
      use: { browserName: 'webkit' },
    },
  ],
};

export default config;
```

#### **E2E Test Example**
```typescript
// src/test/e2e/oneclick.spec.ts
import { test, expect } from '@playwright/test';

test.describe('OneClick Extension E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should create work item', async ({ page }) => {
    // Navigate to OneClick extension
    await page.selectOption('select', 'oneclick');
    
    // Click create button
    await page.click('button:has-text("Create Work Item")');
    
    // Fill form
    await page.fill('input[name="title"]', 'Test Work Item');
    await page.fill('textarea[name="description"]', 'Test Description');
    
    // Submit
    await page.click('button:has-text("Save")');
    
    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

---

## 🔧 **Development Workflow**

### **1. Local Development**
```bash
# Start development server
npm start

# In another terminal, run tests
npm test

# Run E2E tests
npx playwright test
```

### **2. Build and Package**
```bash
# Build for production
npm run build

# Package extensions
npm run package
```

### **3. Deploy to Test Environment**
```bash
# Install tfx-cli globally
npm install -g tfx-cli

# Publish to test organization
tfx extension publish --token <PAT> --organization https://dev.azure.com/your-org
```

---

## 🎯 **Testing Best Practices**

### **1. Component Testing**
- Test individual components in isolation
- Mock Azure DevOps services
- Test user interactions and state changes
- Verify accessibility features

### **2. Integration Testing**
- Test component interactions
- Verify data flow between components
- Test error handling and edge cases

### **3. E2E Testing**
- Test complete user workflows
- Verify extension behavior in realistic scenarios
- Test cross-browser compatibility

### **4. Performance Testing**
- Monitor bundle sizes
- Test rendering performance
- Verify memory usage

---

## 🛠 **Debugging Tools**

### **1. Browser DevTools**
- Use React DevTools for component debugging
- Monitor network requests
- Check console for errors

### **2. VS Code Debugging**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Extension",
      "type": "chrome",
      "request": "launch",
      "url": "https://localhost:8888",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### **3. Logging**
```typescript
// Add logging to your components
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

---

## 📊 **Testing Checklist**

- [ ] Unit tests for all components
- [ ] Integration tests for workflows
- [ ] E2E tests for critical paths
- [ ] Accessibility testing
- [ ] Cross-browser testing
- [ ] Performance testing
- [ ] Error handling testing
- [ ] Security testing

---

## 🚀 **Quick Commands**

```bash
# Development
npm start                    # Start dev server
npm run start:vite          # Start Vite dev server

# Testing
npm test                    # Run unit tests
npm run test:watch          # Run tests in watch mode
npx playwright test         # Run E2E tests

# Building
npm run build               # Build for production
npm run package             # Package extensions

# Quality
npm run lint                # Run ESLint
npm run type-check          # Run TypeScript checks
npm run security-audit      # Security audit
```

This comprehensive testing setup will allow you to develop and test your Azure DevOps extensions efficiently without needing to deploy to Azure DevOps for every change! 