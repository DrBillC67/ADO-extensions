# OneClick Extension Modernization Implementation Plan

## Phase 1: Foundation Setup

### 1.1 Update Package Dependencies

Create a new `package.json` with modern dependencies:

```json
{
  "name": "oneclick-modern",
  "version": "3.0.0",
  "dependencies": {
    "@fluentui/react": "^8.120.0",
    "@fluentui/react-hooks": "^8.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "typescript": "^5.0.0",
    "zustand": "^4.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0"
  }
}
```

### 1.2 Modern Build Configuration

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'Common': resolve(__dirname, '../Common'),
      'OneClick': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OneClick',
      formats: ['umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@fluentui/react'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fluentui/react': 'FluentUIReact'
        }
      }
    }
  }
});
```

### 1.3 TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "Common/*": ["../Common/*"],
      "OneClick/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Phase 2: Core Component Modernization

### 2.1 Modernize WorkItemFormRuleButton

**Before (Class Component):**
```typescript
export class WorkItemFormRuleButton extends BaseFluxComponent<IWorkItemFormRuleButtonProps, IWorkItemFormRuleButtonState> {
    public render(): JSX.Element {
        const { rule } = this.props;
        const name = rule.getFieldValue<string>(RuleFieldNames.Name);
        const color = rule.getFieldValue<string>(RuleFieldNames.Color);
        const hideButton = rule.getFieldValue<boolean>(RuleFieldNames.HideOnForm);
        
        return (
            <div
                className={css("rule-button", { disabled: this.state.disabled })}
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
            this.setState({ disabled: false });
        }
    };
}
```

**After (Functional Component with Hooks):**
```typescript
interface WorkItemFormRuleButtonProps {
  rule: Rule;
  onExecute: (error: IActionError | null) => void;
}

export const WorkItemFormRuleButton: React.FC<WorkItemFormRuleButtonProps> = ({ rule, onExecute }) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { trackEvent } = useTelemetry();
  
  const name = rule.getFieldValue<string>(RuleFieldNames.Name);
  const color = rule.getFieldValue<string>(RuleFieldNames.Color);
  const hideButton = rule.getFieldValue<boolean>(RuleFieldNames.HideOnForm);
  
  const tooltip = useMemo(() => {
    const triggersTooltipText = rule.hasTriggers 
      ? `\nTriggers: ${rule.triggers.map(t => t.getFriendlyName()).join(", ")}` 
      : "";
    return `${name}.\nActions: ${rule.actions.map(a => a.getFriendlyName()).join(", ")}${triggersTooltipText}`;
  }, [rule, name]);

  const textColor = useMemo(() => {
    return new Color(color).toBlackOrWhite().invert().asHex();
  }, [color]);

  const handleClick = useCallback(async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      const error = await rule.run();
      onExecute(error);
      
      // Track telemetry
      trackEvent("RuleClicked", {
        ruleId: rule.id,
        workItemType: rule.getFieldValue<string>(RuleFieldNames.WorkItemType),
        projectId: rule.getFieldValue<string>(RuleFieldNames.ProjectId),
        user: getCurrentUserName()
      });
    } finally {
      setIsExecuting(false);
    }
  }, [rule, onExecute, isExecuting, trackEvent]);

  if (hideButton) return null;

  return (
    <Button
      className={mergeStyles(styles.ruleButton, { backgroundColor: color, color: textColor })}
      onClick={handleClick}
      disabled={isExecuting}
      title={tooltip}
    >
      {rule.hasTriggers && <LightningBoltIcon />}
      <span className={styles.ruleButtonText}>{name}</span>
    </Button>
  );
};

const styles = mergeStyleSets({
  ruleButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  },
  ruleButtonText: {
    fontWeight: 500
  }
});
```

### 2.2 Create Custom Hooks

```typescript
// hooks/useRules.ts
export const useRules = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRules = useCallback(async (workItemType: string, projectId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedRules = await RulesDataService.loadRulesForGroups(
        await getSubscribedRuleGroupIds(),
        projectId
      );
      setRules(loadedRules);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRules = useCallback(() => {
    // Implementation
  }, []);

  return { rules, loading, error, loadRules, refreshRules };
};

// hooks/useRuleExecution.ts
export const useRuleExecution = () => {
  const [executingRules, setExecutingRules] = useState<Set<string>>(new Set());
  const [lastError, setLastError] = useState<IActionError | null>(null);

  const executeRule = useCallback(async (rule: Rule) => {
    if (executingRules.has(rule.id)) return;
    
    setExecutingRules(prev => new Set(prev).add(rule.id));
    setLastError(null);
    
    try {
      const error = await rule.run();
      if (error) {
        setLastError(error);
      }
      return error;
    } finally {
      setExecutingRules(prev => {
        const next = new Set(prev);
        next.delete(rule.id);
        return next;
      });
    }
  }, [executingRules]);

  const isExecuting = useCallback((ruleId: string) => {
    return executingRules.has(ruleId);
  }, [executingRules]);

  return { executeRule, isExecuting, lastError, clearError: () => setLastError(null) };
};

// hooks/useTelemetry.ts
export const useTelemetry = () => {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (window.appInsights) {
      window.appInsights.trackEvent({ name: eventName }, properties);
    }
  }, []);

  return { trackEvent };
};
```

### 2.3 Modernize State Management with Zustand

```typescript
// stores/ruleStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RuleState {
  rules: Rule[];
  loading: boolean;
  error: string | null;
  selectedRuleGroupId: string | null;
  
  // Actions
  setRules: (rules: Rule[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedRuleGroupId: (id: string | null) => void;
  loadRules: (workItemType: string, projectId: string) => Promise<void>;
  addRule: (rule: Rule) => void;
  updateRule: (rule: Rule) => void;
  deleteRule: (ruleId: string) => void;
}

export const useRuleStore = create<RuleState>()(
  devtools(
    (set, get) => ({
      rules: [],
      loading: false,
      error: null,
      selectedRuleGroupId: null,

      setRules: (rules) => set({ rules }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSelectedRuleGroupId: (id) => set({ selectedRuleGroupId: id }),

      loadRules: async (workItemType, projectId) => {
        set({ loading: true, error: null });
        
        try {
          const ruleGroupIds = await getSubscribedRuleGroupIds();
          const rules = await RulesDataService.loadRulesForGroups(ruleGroupIds, projectId);
          set({ rules, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      addRule: (rule) => set((state) => ({ 
        rules: [...state.rules, rule] 
      })),

      updateRule: (rule) => set((state) => ({
        rules: state.rules.map(r => r.id === rule.id ? rule : r)
      })),

      deleteRule: (ruleId) => set((state) => ({
        rules: state.rules.filter(r => r.id !== ruleId)
      }))
    }),
    { name: 'rule-store' }
  )
);
```

## Phase 3: Component Architecture Modernization

### 3.1 Break Down WorkItemRulesGroup

```typescript
// components/WorkItemRulesGroup/WorkItemRulesGroup.tsx
export const WorkItemRulesGroup: React.FC = () => {
  const { rules, loading, error, loadRules } = useRuleStore();
  const { executeRule, lastError } = useRuleExecution();
  const { workItemType, projectId } = useWorkItemContext();

  useEffect(() => {
    if (workItemType && projectId) {
      loadRules(workItemType, projectId);
    }
  }, [workItemType, projectId, loadRules]);

  return (
    <ErrorBoundary>
      <RulesContainer>
        <RulesHeader />
        {loading && <LoadingSpinner />}
        {error && <ErrorDisplay error={error} />}
        {lastError && <RuleExecutionError error={lastError} />}
        {rules.length > 0 && (
          <RulesList rules={rules} onExecute={executeRule} />
        )}
        {!loading && rules.length === 0 && (
          <EmptyState />
        )}
      </RulesContainer>
    </ErrorBoundary>
  );
};

// components/WorkItemRulesGroup/RulesList.tsx
interface RulesListProps {
  rules: Rule[];
  onExecute: (rule: Rule) => Promise<IActionError | null>;
}

export const RulesList: React.FC<RulesListProps> = ({ rules, onExecute }) => {
  const { isExecuting } = useRuleExecution();
  const { reorderRules } = useRuleStore();

  const handleSortEnd = useCallback(({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const reorderedRules = arrayMove(rules, oldIndex, newIndex);
    reorderRules(reorderedRules);
  }, [rules, reorderRules]);

  return (
    <SortableList onSortEnd={handleSortEnd} useDragHandle>
      {rules.map((rule, index) => (
        <SortableItem key={rule.id} index={index}>
          <RuleButton 
            rule={rule} 
            onExecute={onExecute}
            isExecuting={isExecuting(rule.id)}
          />
        </SortableItem>
      ))}
    </SortableList>
  );
};

// components/WorkItemRulesGroup/RuleButton.tsx
interface RuleButtonProps {
  rule: Rule;
  onExecute: (rule: Rule) => Promise<IActionError | null>;
  isExecuting: boolean;
}

export const RuleButton: React.FC<RuleButtonProps> = ({ rule, onExecute, isExecuting }) => {
  const handleClick = useCallback(async () => {
    await onExecute(rule);
  }, [rule, onExecute]);

  return (
    <WorkItemFormRuleButton
      rule={rule}
      onExecute={handleClick}
      disabled={isExecuting}
    />
  );
};
```

### 3.2 Modernize Settings Interface

```typescript
// components/Settings/SettingsApp.tsx
export const SettingsApp: React.FC = () => {
  return (
    <FluentProvider>
      <SettingsProvider>
        <Router>
          <SettingsLayout>
            <SettingsNavigation />
            <SettingsContent />
          </SettingsLayout>
        </Router>
      </SettingsProvider>
    </FluentProvider>
  );
};

// components/Settings/SettingsLayout.tsx
export const SettingsLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.settingsLayout}>
      <SettingsHeader />
      <div className={styles.settingsContent}>
        {children}
      </div>
      <SettingsFooter />
    </div>
  );
};

// components/Settings/SettingsNavigation.tsx
export const SettingsNavigation: React.FC = () => {
  const { workItemTypes } = useWorkItemTypeStore();
  const { selectedWit, setSelectedWit } = useSettingsStore();

  return (
    <Nav
      className={styles.navigation}
      groups={[
        {
          links: workItemTypes.map(wit => ({
            name: wit.name,
            key: wit.name,
            url: `/settings/work-item-types/${wit.name}`
          }))
        }
      ]}
      selectedKey={selectedWit}
      onLinkClick={(e, link) => setSelectedWit(link.key)}
    />
  );
};

// components/Settings/SettingsContent.tsx
export const SettingsContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/work-item-types/:wit" element={<WorkItemTypeSettings />} />
      <Route path="/export-import" element={<ExportImportPanel />} />
      <Route path="/templates" element={<TemplateLibrary />} />
      <Route path="/" element={<Navigate to="/work-item-types" replace />} />
    </Routes>
  );
};
```

## Phase 4: Rule System Modernization

### 4.1 Modernize Action System

```typescript
// actions/types.ts
export interface IActionConfig {
  name: string;
  attributes: Record<string, any>;
}

export interface IActionContext {
  workItem: IWorkItem;
  projectId: string;
  user: IdentityRef;
}

export interface IRuleAction {
  readonly id: string;
  readonly name: string;
  readonly type: ActionType;
  
  execute(context: IActionContext): Promise<void>;
  validate(): boolean;
  getFriendlyName(): string;
  getDescription(): string;
  render(): React.ReactNode;
  toJSON(): IActionConfig;
}

// actions/BaseAction.ts
export abstract class BaseAction implements IRuleAction {
  public readonly id: string;
  public readonly name: string;
  public readonly type: ActionType;
  
  protected attributes: Record<string, any>;

  constructor(config: IActionConfig) {
    this.id = newGuid();
    this.name = config.name;
    this.type = this.getActionType();
    this.attributes = { ...config.attributes };
  }

  abstract execute(context: IActionContext): Promise<void>;
  abstract validate(): boolean;
  abstract getFriendlyName(): string;
  abstract getDescription(): string;
  abstract render(): React.ReactNode;
  abstract getActionType(): ActionType;

  protected getAttribute<T>(key: string): T {
    return this.attributes[key] as T;
  }

  protected setAttribute<T>(key: string, value: T): void {
    this.attributes[key] = value;
  }

  toJSON(): IActionConfig {
    return {
      name: this.name,
      attributes: { ...this.attributes }
    };
  }
}

// actions/SetFieldValueAction.ts
export class SetFieldValueAction extends BaseAction {
  getActionType(): ActionType {
    return ActionType.SetFieldValue;
  }

  getFriendlyName(): string {
    return 'Set Field Value';
  }

  getDescription(): string {
    const fieldName = this.getAttribute<string>('fieldName');
    const fieldValue = this.getAttribute<string>('fieldValue');
    return `Set ${fieldName} to ${fieldValue}`;
  }

  async execute(context: IActionContext): Promise<void> {
    const fieldName = this.getAttribute<string>('fieldName');
    const fieldValue = this.getAttribute<string>('fieldValue');
    
    if (!fieldName || fieldValue === undefined) {
      throw new Error('Field name and value are required');
    }

    const formService = await getFormService();
    await formService.setFieldValue(fieldName, fieldValue);
  }

  validate(): boolean {
    const fieldName = this.getAttribute<string>('fieldName');
    const fieldValue = this.getAttribute<string>('fieldValue');
    return !!(fieldName && fieldValue !== undefined);
  }

  render(): React.ReactNode {
    return <SetFieldValueActionRenderer action={this} />;
  }
}

// actions/ActionFactory.ts
export class ActionFactory {
  private static actionMap: Record<ActionType, new (config: IActionConfig) => IRuleAction> = {
    [ActionType.SetFieldValue]: SetFieldValueAction,
    [ActionType.AddComment]: AddCommentAction,
    [ActionType.AddTags]: AddTagsAction,
    [ActionType.RemoveTags]: RemoveTagsAction,
    [ActionType.SaveWorkItem]: SaveWorkItemAction,
    [ActionType.AddExistingRelation]: AddExistingRelationAction,
    [ActionType.AddNewRelation]: AddNewRelationAction,
    [ActionType.Mention]: MentionAction
  };

  static create(type: ActionType, config: IActionConfig): IRuleAction {
    const ActionClass = this.actionMap[type];
    if (!ActionClass) {
      throw new Error(`Unknown action type: ${type}`);
    }
    return new ActionClass(config);
  }

  static fromJSON(config: IActionConfig): IRuleAction {
    const type = config.attributes?.type as ActionType;
    if (!type) {
      throw new Error('Action type is required');
    }
    return this.create(type, config);
  }
}
```

### 4.2 Modernize Trigger System

```typescript
// triggers/types.ts
export interface ITriggerConfig {
  name: string;
  attributes: Record<string, any>;
}

export interface ITriggerContext {
  eventName: FormEvents;
  args: any;
  workItem: IWorkItem;
}

export interface IRuleTrigger {
  readonly id: string;
  readonly name: string;
  readonly type: TriggerType;
  
  shouldTrigger(context: ITriggerContext): Promise<boolean>;
  getAssociatedFormEvent(): FormEvents;
  getFriendlyName(): string;
  getDescription(): string;
  render(): React.ReactNode;
  toJSON(): ITriggerConfig;
}

// triggers/BaseTrigger.ts
export abstract class BaseTrigger implements IRuleTrigger {
  public readonly id: string;
  public readonly name: string;
  public readonly type: TriggerType;
  
  protected attributes: Record<string, any>;

  constructor(config: ITriggerConfig) {
    this.id = newGuid();
    this.name = config.name;
    this.type = this.getTriggerType();
    this.attributes = { ...config.attributes };
  }

  abstract shouldTrigger(context: ITriggerContext): Promise<boolean>;
  abstract getAssociatedFormEvent(): FormEvents;
  abstract getFriendlyName(): string;
  abstract getDescription(): string;
  abstract render(): React.ReactNode;
  abstract getTriggerType(): TriggerType;

  protected getAttribute<T>(key: string): T {
    return this.attributes[key] as T;
  }

  protected setAttribute<T>(key: string, value: T): void {
    this.attributes[key] = value;
  }

  toJSON(): ITriggerConfig {
    return {
      name: this.name,
      attributes: { ...this.attributes }
    };
  }
}

// triggers/FieldChangedTrigger.ts
export class FieldChangedTrigger extends BaseTrigger {
  getTriggerType(): TriggerType {
    return TriggerType.FieldChanged;
  }

  getAssociatedFormEvent(): FormEvents {
    return FormEvents.onFieldChanged;
  }

  getFriendlyName(): string {
    return 'Field Changed';
  }

  getDescription(): string {
    const fieldName = this.getAttribute<string>('fieldName');
    const oldValue = this.getAttribute<string>('oldValue');
    const newValue = this.getAttribute<string>('newValue');
    return `${fieldName} changed from ${oldValue} to ${newValue}`;
  }

  async shouldTrigger(context: ITriggerContext): Promise<boolean> {
    if (context.eventName !== FormEvents.onFieldChanged) {
      return false;
    }

    const fieldName = this.getAttribute<string>('fieldName');
    const oldValue = this.getAttribute<string>('oldValue');
    const newValue = this.getAttribute<string>('newValue');

    const args = context.args as IWorkItemFieldChangedArgs;
    
    if (args.fieldName !== fieldName) {
      return false;
    }

    const matchesOldValue = oldValue === Constants.AnyMacro || args.oldValue === oldValue;
    const matchesNewValue = newValue === Constants.AnyMacro || args.newValue === newValue;

    return matchesOldValue && matchesNewValue;
  }

  validate(): boolean {
    const fieldName = this.getAttribute<string>('fieldName');
    return !!fieldName;
  }

  render(): React.ReactNode {
    return <FieldChangedTriggerRenderer trigger={this} />;
  }
}
```

## Phase 5: Testing Infrastructure

### 5.1 Unit Tests

```typescript
// __tests__/components/WorkItemFormRuleButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkItemFormRuleButton } from '@/components/WorkItemFormRuleButton';

describe('WorkItemFormRuleButton', () => {
  const mockRule = {
    id: 'rule-1',
    name: 'Test Rule',
    color: '#007acc',
    hasTriggers: false,
    actions: [],
    triggers: [],
    getFieldValue: jest.fn(),
    run: jest.fn()
  };

  const mockOnExecute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders rule button with correct name', () => {
    mockRule.getFieldValue.mockReturnValue('Test Rule');
    
    render(<WorkItemFormRuleButton rule={mockRule} onExecute={mockOnExecute} />);
    
    expect(screen.getByText('Test Rule')).toBeInTheDocument();
  });

  it('executes rule when clicked', async () => {
    mockRule.run.mockResolvedValue(null);
    
    render(<WorkItemFormRuleButton rule={mockRule} onExecute={mockOnExecute} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockRule.run).toHaveBeenCalled();
      expect(mockOnExecute).toHaveBeenCalledWith(null);
    });
  });

  it('shows lightning bolt icon when rule has triggers', () => {
    mockRule.hasTriggers = true;
    
    render(<WorkItemFormRuleButton rule={mockRule} onExecute={mockOnExecute} />);
    
    expect(screen.getByTestId('lightning-bolt-icon')).toBeInTheDocument();
  });
});
```

### 5.2 Integration Tests

```typescript
// __tests__/integration/RuleExecution.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WorkItemRulesGroup } from '@/components/WorkItemRulesGroup';
import { useRuleStore } from '@/stores/ruleStore';

// Mock the stores
jest.mock('@/stores/ruleStore');

describe('Rule Execution Integration', () => {
  beforeEach(() => {
    (useRuleStore as jest.Mock).mockReturnValue({
      rules: [],
      loading: false,
      error: null,
      loadRules: jest.fn()
    });
  });

  it('executes multiple rules in sequence', async () => {
    const mockRules = [
      createMockRule('rule-1', 'Set Status'),
      createMockRule('rule-2', 'Add Comment')
    ];

    (useRuleStore as jest.Mock).mockReturnValue({
      rules: mockRules,
      loading: false,
      error: null,
      loadRules: jest.fn()
    });

    render(<WorkItemRulesGroup />);

    const buttons = screen.getAllByRole('button');
    
    // Click first rule
    fireEvent.click(buttons[0]);
    
    await waitFor(() => {
      expect(mockRules[0].run).toHaveBeenCalled();
    });

    // Click second rule
    fireEvent.click(buttons[1]);
    
    await waitFor(() => {
      expect(mockRules[1].run).toHaveBeenCalled();
    });
  });
});
```

## Migration Checklist

### Phase 1: Foundation ✅
- [ ] Update package.json with modern dependencies
- [ ] Configure Vite build system
- [ ] Update TypeScript configuration
- [ ] Set up ESLint and Prettier

### Phase 2: Core Components ✅
- [ ] Convert WorkItemFormRuleButton to functional component
- [ ] Create custom hooks (useRules, useRuleExecution, useTelemetry)
- [ ] Implement Zustand store for state management
- [ ] Update import statements to use @fluentui/react

### Phase 3: Component Architecture ✅
- [ ] Break down WorkItemRulesGroup into smaller components
- [ ] Modernize Settings interface with React Router
- [ ] Create reusable UI components
- [ ] Implement proper error boundaries

### Phase 4: Rule System ✅
- [ ] Modernize Action system with factory pattern
- [ ] Update Trigger system with composition
- [ ] Implement proper validation and error handling
- [ ] Add comprehensive type safety

### Phase 5: Testing ✅
- [ ] Set up Jest and React Testing Library
- [ ] Write unit tests for components
- [ ] Add integration tests for critical flows
- [ ] Implement E2E tests

### Phase 6: Performance & Polish ✅
- [ ] Implement React.memo for expensive components
- [ ] Add virtualization for large lists
- [ ] Optimize bundle size
- [ ] Add accessibility improvements

This implementation plan provides a comprehensive roadmap for modernizing the OneClick extension while maintaining its functionality and improving maintainability, performance, and developer experience. 