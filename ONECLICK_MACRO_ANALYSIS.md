# OneClick Extension Macro System Analysis

## Current Macro System Overview

The OneClick extension has a well-designed macro system that allows dynamic values to be used in rule actions and triggers. Let me analyze the current capabilities and determine if it can support DevOps macros.

### Current Macro Architecture

#### 1. **Base Macro System**
```typescript
// From src/Apps/OneClick/scripts/Macros/Macros.ts
export abstract class BaseMacro {
    private static registeredMacros: IDictionaryStringTo<new () => BaseMacro> = {};
    private static allowedSeparators = ["=", "-", "+"];

    public static getMacroType(macroStr: string): new () => BaseMacro {
        // Parses macro strings and returns appropriate macro class
    }

    public static registerMacro(macroName: string, macroType: new () => BaseMacro): void {
        BaseMacro.registeredMacros[macroName.toUpperCase()] = macroType;
    }

    public static isMacro(str: string): boolean {
        return startsWith(str, "@");
    }

    public abstract translate(macroStr: string, typed?: boolean): Promise<string | any>;
    public abstract getName(): string;
}
```

#### 2. **Currently Supported Macros**

**@Me Macro**
```typescript
export class MacroMe extends BaseMacro {
    public async translate(_macroStr: string, _typed?: boolean): Promise<string> {
        return getCurrentUserName();
    }
}
```

**@Today Macro**
```typescript
export class MacroToday extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        const today = new Date();
        let returnValue = today;

        // Supports @today-2, @today+3 syntax
        const operatorAndOperand = this._getOperatorAndOperand(macroStr);
        if (operatorAndOperand) {
            switch (operatorAndOperand[0]) {
                case "-":
                    returnValue = addDays(returnValue, operatorAndOperand[1] * -1);
                    break;
                case "+":
                    returnValue = addDays(returnValue, operatorAndOperand[1]);
                    break;
            }
        }

        return typed ? returnValue : format(new Date(returnValue), "yyyy-MM-dd");
    }
}
```

**@FieldValue Macro**
```typescript
export class MacroFieldValue extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | any> {
        const fieldName = macroStr.split("=")[1];
        if (!fieldName) {
            return macroStr;
        } else {
            try {
                const formService = await getFormService();
                const field = await getWorkItemField(fieldName);
                const fieldValue = await formService.getFieldValue(field.referenceName);
                return typed ? fieldValue : toString(fieldValue);
            } catch (e) {
                return macroStr;
            }
        }
    }
}
```

**@Any Macro**
```typescript
// Special macro for triggers - allows matching any value
export const AnyMacro = "@any";
```

#### 3. **Macro Usage in Actions and Triggers**

**In SetFieldValueAction:**
```typescript
const fieldValue: string = await translateToFieldValue(
    this.getAttribute<string>("fieldValue", true) || "", 
    field.type
);
```

**In FieldChangedTrigger:**
```typescript
const oldFieldValue: string = await translateToFieldValue(
    this.getAttribute<string>("oldFieldValue", true) || "", 
    field.type
);
const newFieldValue: string = await translateToFieldValue(
    this.getAttribute<string>("newFieldValue", true) || "", 
    field.type
);
```

## Analysis: Can OneClick Support DevOps Macros?

### ✅ **YES - The architecture is fully capable**

The OneClick extension's macro system is **well-designed and extensible** to support DevOps macros. Here's why:

#### 1. **Extensible Registration System**
- Macros are registered dynamically using `BaseMacro.registerMacro()`
- New macro types can be added without modifying existing code
- The system supports complex macro parsing with operators

#### 2. **Async Translation Support**
- All macros support async `translate()` methods
- This allows for API calls to DevOps services
- Proper error handling is built-in

#### 3. **Type-Safe Integration**
- Macros integrate seamlessly with field types
- Support for both string and typed return values
- Proper validation in actions and triggers

### Proposed DevOps Macro Implementations

#### 1. **@CurrentIteration Macro**
```typescript
export class MacroCurrentIteration extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | any> {
        try {
            // Get current team context
            const teamContext = this.getTeamContext();
            
            // Call DevOps API to get current iteration
            const iteration = await this.getCurrentIteration(teamContext);
            
            return typed ? iteration : iteration.path;
        } catch (e) {
            console.warn('Failed to resolve @currentiteration macro:', e);
            return macroStr; // Fallback to original string
        }
    }

    public getName(): string {
        return "@CurrentIteration";
    }

    private async getCurrentIteration(teamContext: TeamContext): Promise<any> {
        // Implementation would use DevOps REST API
        // GET /{organization}/{project}/{team}/_apis/work/teamsettings/iterations?$timeframe=current
        const client = await VSS_Service.getClient(WorkHttpClient);
        return await client.getTeamIterations(teamContext, "current");
    }

    private getTeamContext(): TeamContext {
        const context = VSS.getWebContext();
        return {
            projectId: context.project.id,
            teamId: context.team.id,
            project: context.project.name,
            team: context.team.name
        };
    }
}
BaseMacro.registerMacro("@CurrentIteration", MacroCurrentIteration);
```

#### 2. **@StartOfDay Macro**
```typescript
export class MacroStartOfDay extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        // Support @startofday-1, @startofday+2 syntax
        const operatorAndOperand = this._getOperatorAndOperand(macroStr);
        if (operatorAndOperand) {
            switch (operatorAndOperand[0]) {
                case "-":
                    startOfDay.setDate(startOfDay.getDate() - operatorAndOperand[1]);
                    break;
                case "+":
                    startOfDay.setDate(startOfDay.getDate() + operatorAndOperand[1]);
                    break;
            }
        }

        return typed ? startOfDay : format(startOfDay, "yyyy-MM-dd");
    }

    public getName(): string {
        return "@StartOfDay";
    }

    private _getOperatorAndOperand(macroStr: string): any[] {
        // Similar to MacroToday implementation
        // ... implementation details
    }
}
BaseMacro.registerMacro("@StartOfDay", MacroStartOfDay);
```

#### 3. **@StartOfMonth Macro**
```typescript
export class MacroStartOfMonth extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Support @startofmonth-1, @startofmonth+2 syntax
        const operatorAndOperand = this._getOperatorAndOperand(macroStr);
        if (operatorAndOperand) {
            switch (operatorAndOperand[0]) {
                case "-":
                    startOfMonth.setMonth(startOfMonth.getMonth() - operatorAndOperand[1]);
                    break;
                case "+":
                    startOfMonth.setMonth(startOfMonth.getMonth() + operatorAndOperand[1]);
                    break;
            }
        }

        return typed ? startOfMonth : format(startOfMonth, "yyyy-MM-dd");
    }

    public getName(): string {
        return "@StartOfMonth";
    }
}
BaseMacro.registerMacro("@StartOfMonth", MacroStartOfMonth);
```

#### 4. **@StartOfYear Macro**
```typescript
export class MacroStartOfYear extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        const today = new Date();
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        
        // Support @startofyear-1, @startofyear+2 syntax
        const operatorAndOperand = this._getOperatorAndOperand(macroStr);
        if (operatorAndOperand) {
            switch (operatorAndOperand[0]) {
                case "-":
                    startOfYear.setFullYear(startOfYear.getFullYear() - operatorAndOperand[1]);
                    break;
                case "+":
                    startOfYear.setFullYear(startOfYear.getFullYear() + operatorAndOperand[1]);
                    break;
            }
        }

        return typed ? startOfYear : format(startOfYear, "yyyy-MM-dd");
    }

    public getName(): string {
        return "@StartOfYear";
    }
}
BaseMacro.registerMacro("@StartOfYear", MacroStartOfYear);
```

## Implementation Requirements

### 1. **API Dependencies**
```typescript
// Required imports for DevOps API access
import * as WorkClient from "TFS/Work/RestClient";
import * as VSS_Service from "VSS/Service";
import { TeamContext } from "TFS/Core/Contracts";
```

### 2. **Error Handling**
The current system already has robust error handling:
- Macros return the original string if translation fails
- Actions and triggers continue to work even if macros fail
- Console warnings help with debugging

### 3. **Performance Considerations**
- Macros are resolved asynchronously
- Results could be cached for performance
- API calls are made only when needed

## Usage Examples

### In SetFieldValueAction:
```typescript
// Set iteration to current team iteration
fieldValue: "@CurrentIteration"

// Set start date to start of current month
fieldValue: "@StartOfMonth"

// Set due date to start of next month
fieldValue: "@StartOfMonth+1"

// Set created date to start of current year
fieldValue: "@StartOfYear"
```

### In FieldChangedTrigger:
```typescript
// Trigger when iteration changes to current iteration
oldValue: "@any"
newValue: "@CurrentIteration"

// Trigger when start date changes to start of month
oldValue: "@any"
newValue: "@StartOfMonth"
```

## Benefits of Adding DevOps Macros

### 1. **Enhanced Automation**
- Rules can automatically set iteration-based fields
- Time-based automation becomes more powerful
- Reduces manual configuration

### 2. **Team Context Awareness**
- Rules can adapt to different team contexts
- Iteration-based workflows become possible
- Better integration with DevOps processes

### 3. **Consistency**
- Standardized date/time calculations
- Consistent with DevOps terminology
- Reduces errors in date calculations

## Migration Strategy

### Phase 1: Add Basic Time Macros
1. Implement `@StartOfDay`, `@StartOfMonth`, `@StartOfYear`
2. Test with existing actions and triggers
3. Add documentation and examples

### Phase 2: Add DevOps Context Macros
1. Implement `@CurrentIteration`
2. Add team context resolution
3. Test with different team configurations

### Phase 3: Advanced Features
1. Add caching for performance
2. Add more complex macro combinations
3. Add macro validation and error reporting

## Conclusion

**The OneClick extension is fully capable of supporting DevOps macros.** The existing macro system is:

- ✅ **Extensible**: Easy to add new macro types
- ✅ **Robust**: Proper error handling and fallbacks
- ✅ **Well-integrated**: Works seamlessly with actions and triggers
- ✅ **Type-safe**: Supports different field types
- ✅ **Async-ready**: Can handle API calls to DevOps services

The implementation would be straightforward and would significantly enhance the extension's capabilities for DevOps automation scenarios. 