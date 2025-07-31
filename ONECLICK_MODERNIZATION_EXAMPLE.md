# OneClick Modernization: Practical Example

This document demonstrates a practical step-by-step approach to modernizing the OneClick extension, starting with the `WorkItemFormRuleButton` component.

## Step 1: Analyze Current Component

Let's examine the current `WorkItemFormRuleButton.tsx`:

```typescript
// Current implementation (76 lines)
export class WorkItemFormRuleButton extends BaseFluxComponent<IWorkItemFormRuleButtonProps, IWorkItemFormRuleButtonState> {
    public render(): JSX.Element {
        const { rule } = this.props;
        const name = rule.getFieldValue<string>(RuleFieldNames.Name);
        const color = rule.getFieldValue<string>(RuleFieldNames.Color);
        const hideButton = rule.getFieldValue<boolean>(RuleFieldNames.HideOnForm);
        const triggersTooltipText = rule.hasTriggers ? `\nTriggers: ${rule.triggers.map(t => t.getFriendlyName()).join(", ")}` : "";
        const tooltip = `${name}.\nActions: ${rule.actions.map(a => a.getFriendlyName()).join(", ")}${triggersTooltipText}`;
        const disabled = this.state.disabled;

        return (
            <div
                className={css("rule-button", { disabled: disabled })}
                onClick={this._onRuleClick}
                title={tooltip}
                style={{
                    backgroundColor: color,
                    color: new Color(color).toBlackOrWhite().invert().asHex(),
                    display: hideButton ? "none" : undefined
                }}
            >
                {rule.hasTriggers && <VssIcon iconName="LightningBolt" iconType={VssIconType.Fabric} />}
                <div className="rule-button-text">{name}</div>
            </div>
        );
    }

    private _onRuleClick = async () => {
        if (!this.state.disabled) {
            this.setState({ disabled: true });
            const error = await this.props.rule.run();
            this.props.onExecute(error);
            trackEvent("RuleClicked", {
                ruleId: this.props.rule.id,
                workItemType: this.props.rule.getFieldValue<string>(RuleFieldNames.WorkItemType),
                projectId: this.props.rule.getFieldValue<string>(RuleFieldNames.ProjectId),
                user: getCurrentUserName()
            });
            this.setState({ disabled: false });
        }
    };
}
```

## Step 2: Create Modern Component Structure

### 2.1 Create Component Directory Structure

```
src/
├── components/
│   └── WorkItemFormRuleButton/
│       ├── index.ts
│       ├── WorkItemFormRuleButton.tsx
│       ├── WorkItemFormRuleButton.test.tsx
│       └── WorkItemFormRuleButton.styles.ts
├── hooks/
│   ├── useRuleExecution.ts
│   └── useTelemetry.ts
└── types/
    └── rule.ts
```

### 2.2 Define Modern Types

```typescript
// types/rule.ts
export interface Rule {
  id: string;
  name: string;
  color: string;
  hasTriggers: boolean;
  actions: Action[];
  triggers: Trigger[];
  getFieldValue<T>(fieldName: string): T;
  run(): Promise<IActionError | null>;
}

export interface IActionError {
  actionName: string;
  error: string;
}

export interface WorkItemFormRuleButtonProps {
  rule: Rule;
  onExecute: (error: IActionError | null) => void;
  disabled?: boolean;
}
```

### 2.3 Create Custom Hooks

```typescript
// hooks/useRuleExecution.ts
import { useState, useCallback } from 'react';
import { IActionError } from '../types/rule';

export const useRuleExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastError, setLastError] = useState<IActionError | null>(null);

  const executeRule = useCallback(async (rule: Rule) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setLastError(null);
    
    try {
      const error = await rule.run();
      if (error) {
        setLastError(error);
      }
      return error;
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting]);

  return { 
    isExecuting, 
    lastError, 
    executeRule, 
    clearError: () => setLastError(null) 
  };
};

// hooks/useTelemetry.ts
import { useCallback } from 'react';

export const useTelemetry = () => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (window.appInsights) {
      window.appInsights.trackEvent({ name: eventName }, properties);
    }
  }, []);

  return { trackEvent };
};
```

### 2.4 Create Modern Component

```typescript
// components/WorkItemFormRuleButton/WorkItemFormRuleButton.tsx
import React, { useMemo, useCallback } from 'react';
import { Button } from '@fluentui/react';
import { LightningBoltIcon } from '@fluentui/react-icons';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import { Color } from 'Common/Components/ColorPicker';
import { getCurrentUserName } from 'Common/Utilities/Identity';
import { RuleFieldNames } from 'OneClick/Constants';
import { useRuleExecution } from '../../hooks/useRuleExecution';
import { useTelemetry } from '../../hooks/useTelemetry';
import { WorkItemFormRuleButtonProps } from '../../types/rule';
import { styles } from './WorkItemFormRuleButton.styles';

export const WorkItemFormRuleButton: React.FC<WorkItemFormRuleButtonProps> = ({ 
  rule, 
  onExecute, 
  disabled = false 
}) => {
  const { isExecuting, executeRule } = useRuleExecution();
  const { trackEvent } = useTelemetry();

  // Extract rule properties
  const name = rule.getFieldValue<string>(RuleFieldNames.Name);
  const color = rule.getFieldValue<string>(RuleFieldNames.Color);
  const hideButton = rule.getFieldValue<boolean>(RuleFieldNames.HideOnForm);

  // Memoized computations
  const tooltip = useMemo(() => {
    const triggersTooltipText = rule.hasTriggers 
      ? `\nTriggers: ${rule.triggers.map(t => t.getFriendlyName()).join(", ")}` 
      : "";
    return `${name}.\nActions: ${rule.actions.map(a => a.getFriendlyName()).join(", ")}${triggersTooltipText}`;
  }, [rule, name]);

  const textColor = useMemo(() => {
    return new Color(color).toBlackOrWhite().invert().asHex();
  }, [color]);

  const buttonStyle = useMemo(() => ({
    backgroundColor: color,
    color: textColor
  }), [color, textColor]);

  // Event handlers
  const handleClick = useCallback(async () => {
    if (isExecuting || disabled) return;
    
    const error = await executeRule(rule);
    onExecute(error);
    
    // Track telemetry
    trackEvent("RuleClicked", {
      ruleId: rule.id,
      workItemType: rule.getFieldValue<string>(RuleFieldNames.WorkItemType),
      projectId: rule.getFieldValue<string>(RuleFieldNames.ProjectId),
      user: getCurrentUserName()
    });
  }, [rule, onExecute, isExecuting, disabled, executeRule, trackEvent]);

  // Early return for hidden buttons
  if (hideButton) {
    return null;
  }

  return (
    <Button
      className={mergeStyles(styles.ruleButton, buttonStyle)}
      onClick={handleClick}
      disabled={isExecuting || disabled}
      title={tooltip}
      data-testid="rule-button"
    >
      {rule.hasTriggers && (
        <LightningBoltIcon 
          className={styles.triggerIcon} 
          data-testid="lightning-bolt-icon" 
        />
      )}
      <span className={styles.ruleButtonText}>{name}</span>
    </Button>
  );
};
```

### 2.5 Create Styles

```typescript
// components/WorkItemFormRuleButton/WorkItemFormRuleButton.styles.ts
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

export const styles = mergeStyleSets({
  ruleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease, transform 0.1s ease',
    minHeight: '32px',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '16px',
    
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    
    '&:active': {
      transform: 'translateY(0)'
    },
    
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
      boxShadow: 'none'
    }
  },
  
  triggerIcon: {
    fontSize: '12px',
    flexShrink: 0
  },
  
  ruleButtonText: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '120px'
  }
});
```

### 2.6 Create Tests

```typescript
// components/WorkItemFormRuleButton/WorkItemFormRuleButton.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkItemFormRuleButton } from './WorkItemFormRuleButton';
import { Rule } from '../../types/rule';

// Mock dependencies
jest.mock('../../hooks/useRuleExecution');
jest.mock('../../hooks/useTelemetry');
jest.mock('Common/Utilities/Identity');

const mockUseRuleExecution = useRuleExecution as jest.MockedFunction<typeof useRuleExecution>;
const mockUseTelemetry = useTelemetry as jest.MockedFunction<typeof useTelemetry>;
const mockGetCurrentUserName = getCurrentUserName as jest.MockedFunction<typeof getCurrentUserName>;

describe('WorkItemFormRuleButton', () => {
  const createMockRule = (overrides: Partial<Rule> = {}): Rule => ({
    id: 'rule-1',
    name: 'Test Rule',
    color: '#007acc',
    hasTriggers: false,
    actions: [],
    triggers: [],
    getFieldValue: jest.fn(),
    run: jest.fn(),
    ...overrides
  });

  const mockOnExecute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUseRuleExecution.mockReturnValue({
      isExecuting: false,
      lastError: null,
      executeRule: jest.fn(),
      clearError: jest.fn()
    });
    
    mockUseTelemetry.mockReturnValue({
      trackEvent: jest.fn()
    });
    
    mockGetCurrentUserName.mockReturnValue('test-user');
  });

  it('renders rule button with correct name', () => {
    const rule = createMockRule();
    rule.getFieldValue.mockReturnValue('Test Rule');
    
    render(<WorkItemFormRuleButton rule={rule} onExecute={mockOnExecute} />);
    
    expect(screen.getByText('Test Rule')).toBeInTheDocument();
    expect(screen.getByTestId('rule-button')).toBeInTheDocument();
  });

  it('executes rule when clicked', async () => {
    const rule = createMockRule();
    const mockExecuteRule = jest.fn().mockResolvedValue(null);
    mockUseRuleExecution.mockReturnValue({
      isExecuting: false,
      lastError: null,
      executeRule: mockExecuteRule,
      clearError: jest.fn()
    });
    
    render(<WorkItemFormRuleButton rule={rule} onExecute={mockOnExecute} />);
    
    const button = screen.getByTestId('rule-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockExecuteRule).toHaveBeenCalledWith(rule);
      expect(mockOnExecute).toHaveBeenCalledWith(null);
    });
  });

  it('shows lightning bolt icon when rule has triggers', () => {
    const rule = createMockRule({ hasTriggers: true });
    
    render(<WorkItemFormRuleButton rule={rule} onExecute={mockOnExecute} />);
    
    expect(screen.getByTestId('lightning-bolt-icon')).toBeInTheDocument();
  });

  it('hides button when hideOnForm is true', () => {
    const rule = createMockRule();
    rule.getFieldValue.mockImplementation((fieldName: string) => {
      if (fieldName === 'hideOnForm') return true;
      return 'Test Rule';
    });
    
    const { container } = render(
      <WorkItemFormRuleButton rule={rule} onExecute={mockOnExecute} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('disables button when executing', () => {
    const rule = createMockRule();
    mockUseRuleExecution.mockReturnValue({
      isExecuting: true,
      lastError: null,
      executeRule: jest.fn(),
      clearError: jest.fn()
    });
    
    render(<WorkItemFormRuleButton rule={rule} onExecute={mockOnExecute} />);
    
    const button = screen.getByTestId('rule-button');
    expect(button).toBeDisabled();
  });

  it('tracks telemetry when rule is executed', async () => {
    const rule = createMockRule();
    const mockTrackEvent = jest.fn();
    mockUseTelemetry.mockReturnValue({ trackEvent: mockTrackEvent });
    
    rule.getFieldValue.mockImplementation((fieldName: string) => {
      switch (fieldName) {
        case 'System.WorkItemType': return 'Bug';
        case 'System.ProjectId': return 'project-1';
        default: return 'Test Rule';
      }
    });
    
    const mockExecuteRule = jest.fn().mockResolvedValue(null);
    mockUseRuleExecution.mockReturnValue({
      isExecuting: false,
      lastError: null,
      executeRule: mockExecuteRule,
      clearError: jest.fn()
    });
    
    render(<WorkItemFormRuleButton rule={rule} onExecute={mockOnExecute} />);
    
    const button = screen.getByTestId('rule-button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('RuleClicked', {
        ruleId: 'rule-1',
        workItemType: 'Bug',
        projectId: 'project-1',
        user: 'test-user'
      });
    });
  });
});
```

### 2.7 Create Index File

```typescript
// components/WorkItemFormRuleButton/index.ts
export { WorkItemFormRuleButton } from './WorkItemFormRuleButton';
export type { WorkItemFormRuleButtonProps } from '../../types/rule';
```

## Step 3: Update Parent Component

Now update the parent component to use the new modern component:

```typescript
// components/WorkItemRulesGroup/RulesList.tsx
import React from 'react';
import { WorkItemFormRuleButton } from '../WorkItemFormRuleButton';
import { useRuleExecution } from '../../hooks/useRuleExecution';
import { Rule } from '../../types/rule';

interface RulesListProps {
  rules: Rule[];
  onExecute: (rule: Rule) => Promise<IActionError | null>;
}

export const RulesList: React.FC<RulesListProps> = ({ rules, onExecute }) => {
  const { isExecuting } = useRuleExecution();

  return (
    <div className="rules-list">
      {rules.map(rule => (
        <WorkItemFormRuleButton
          key={rule.id}
          rule={rule}
          onExecute={onExecute}
          disabled={isExecuting(rule.id)}
        />
      ))}
    </div>
  );
};
```

## Step 4: Benefits Achieved

### 4.1 Code Quality Improvements

1. **Separation of Concerns**: Logic separated into custom hooks
2. **Type Safety**: Strong TypeScript interfaces
3. **Testability**: Comprehensive unit tests
4. **Reusability**: Component can be easily reused
5. **Maintainability**: Smaller, focused component

### 4.2 Performance Improvements

1. **Memoization**: Expensive computations memoized with `useMemo`
2. **Callback Optimization**: Event handlers optimized with `useCallback`
3. **Early Returns**: Avoid unnecessary rendering for hidden buttons
4. **Modern React Patterns**: Functional components with hooks

### 4.3 Developer Experience

1. **Better Error Handling**: Centralized error management
2. **Improved Debugging**: Better component structure and test coverage
3. **Modern Tooling**: Compatible with modern React dev tools
4. **Accessibility**: Proper ARIA attributes and keyboard navigation

## Step 5: Migration Strategy

### 5.1 Gradual Migration

1. **Phase 1**: Create new component alongside existing
2. **Phase 2**: Update parent components to use new component
3. **Phase 3**: Remove old component and update imports
4. **Phase 4**: Update tests and documentation

### 5.2 Backward Compatibility

```typescript
// Legacy wrapper for backward compatibility
export class WorkItemFormRuleButtonLegacy extends BaseFluxComponent<IWorkItemFormRuleButtonProps, IWorkItemFormRuleButtonState> {
  public render(): JSX.Element {
    return (
      <WorkItemFormRuleButton
        rule={this.props.rule}
        onExecute={this.props.onExecute}
        disabled={this.state.disabled}
      />
    );
  }
}
```

## Step 6: Next Steps

After successfully modernizing this component:

1. **Apply similar patterns** to other components
2. **Create shared hooks** for common functionality
3. **Implement state management** with Zustand
4. **Add integration tests** for component interactions
5. **Update build system** to support modern tooling

This example demonstrates how to modernize a single component while maintaining functionality and improving code quality. The same approach can be applied to the entire OneClick extension systematically. 