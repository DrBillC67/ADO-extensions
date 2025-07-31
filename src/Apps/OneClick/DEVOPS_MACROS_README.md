# OneClick DevOps Macros

This document describes the DevOps macros that have been added to the OneClick extension to enhance automation capabilities for Azure DevOps scenarios.

## Overview

The OneClick extension now supports additional macros that integrate with Azure DevOps context and provide enhanced date/time functionality. These macros can be used in rule actions and triggers to automate common DevOps workflows.

## Available DevOps Macros

### Date/Time Macros

#### @StartOfDay
Resolves to the start of the current day (00:00:00).

**Syntax:**
- `@StartOfDay` - Start of current day
- `@StartOfDay+1` - Start of tomorrow
- `@StartOfDay-1` - Start of yesterday

**Examples:**
```typescript
// Set start date to beginning of today
fieldValue: "@StartOfDay"

// Set due date to beginning of tomorrow
fieldValue: "@StartOfDay+1"
```

#### @StartOfMonth
Resolves to the start of the current month (1st day, 00:00:00).

**Syntax:**
- `@StartOfMonth` - Start of current month
- `@StartOfMonth+1` - Start of next month
- `@StartOfMonth-1` - Start of previous month

**Examples:**
```typescript
// Set start date to beginning of current month
fieldValue: "@StartOfMonth"

// Set due date to beginning of next month
fieldValue: "@StartOfMonth+1"

// Set milestone date to beginning of previous month
fieldValue: "@StartOfMonth-1"
```

#### @StartOfYear
Resolves to the start of the current year (January 1st, 00:00:00).

**Syntax:**
- `@StartOfYear` - Start of current year
- `@StartOfYear+1` - Start of next year
- `@StartOfYear-1` - Start of previous year

**Examples:**
```typescript
// Set fiscal year start
fieldValue: "@StartOfYear"

// Set planning horizon to next year
fieldValue: "@StartOfYear+1"
```

### DevOps Context Macros

#### @CurrentIteration
Resolves to the current iteration path for the team context.

**Syntax:**
- `@CurrentIteration` - Current team iteration

**Examples:**
```typescript
// Set iteration to current team iteration
fieldValue: "@CurrentIteration"

// Trigger when iteration changes to current
oldValue: "@Any"
newValue: "@CurrentIteration"
```

#### @CurrentSprint
Resolves to the current sprint name for the team context.

**Syntax:**
- `@CurrentSprint` - Current team sprint

**Examples:**
```typescript
// Set sprint field to current sprint
fieldValue: "@CurrentSprint"

// Trigger when sprint changes to current
oldValue: "@Any"
newValue: "@CurrentSprint"
```

## Usage in Rule Actions

### SetFieldValue Action
```typescript
{
  "action": "SetFieldValue",
  "fieldName": "System.IterationPath",
  "fieldValue": "@CurrentIteration"
}
```

```typescript
{
  "action": "SetFieldValue",
  "fieldName": "Microsoft.VSTS.Scheduling.StartDate",
  "fieldValue": "@StartOfMonth"
}
```

```typescript
{
  "action": "SetFieldValue",
  "fieldName": "Microsoft.VSTS.Scheduling.DueDate",
  "fieldValue": "@StartOfMonth+1"
}
```

### AddComment Action
```typescript
{
  "action": "AddComment",
  "comment": "Work item assigned to current iteration: @CurrentIteration"
}
```

## Usage in Rule Triggers

### FieldChanged Trigger
```typescript
{
  "trigger": "FieldChanged",
  "fieldName": "System.IterationPath",
  "oldValue": "@Any",
  "newValue": "@CurrentIteration"
}
```

```typescript
{
  "trigger": "FieldChanged",
  "fieldName": "Microsoft.VSTS.Scheduling.StartDate",
  "oldValue": "@Any",
  "newValue": "@StartOfMonth"
}
```

## Common Use Cases

### 1. Automatic Iteration Assignment
Create a rule that automatically assigns work items to the current iteration when they are created.

**Rule Configuration:**
- **Trigger:** New work item opened
- **Action:** Set field value
  - Field: `System.IterationPath`
  - Value: `@CurrentIteration`

### 2. Monthly Planning Automation
Create a rule that sets start and due dates for monthly planning items.

**Rule Configuration:**
- **Trigger:** New work item opened (for specific work item types)
- **Actions:**
  - Set field value: `Microsoft.VSTS.Scheduling.StartDate` = `@StartOfMonth`
  - Set field value: `Microsoft.VSTS.Scheduling.DueDate` = `@StartOfMonth+1-1` (end of current month)

### 3. Sprint Transition Automation
Create a rule that triggers when work items are moved to the current sprint.

**Rule Configuration:**
- **Trigger:** Field changed
  - Field: `System.IterationPath`
  - Old value: `@Any`
  - New value: `@CurrentIteration`
- **Actions:**
  - Set field value: `System.AssignedTo` = `@Me`
  - Add comment: "Automatically assigned to current user when moved to current iteration"

### 4. Fiscal Year Planning
Create a rule for fiscal year planning items.

**Rule Configuration:**
- **Trigger:** New work item opened (for Epic work item type)
- **Actions:**
  - Set field value: `Microsoft.VSTS.Scheduling.StartDate` = `@StartOfYear`
  - Set field value: `Microsoft.VSTS.Scheduling.DueDate` = `@StartOfYear+1-1` (end of year)

## Error Handling

All DevOps macros include robust error handling:

1. **API Failures:** If DevOps API calls fail, the macro returns the original string
2. **Network Issues:** Graceful fallback to original text
3. **Invalid Context:** Proper error logging and fallback behavior
4. **Date Calculation Errors:** Fallback to original macro string

## Performance Considerations

- **Caching:** DevOps macros make API calls only when needed
- **Async Processing:** All macros are processed asynchronously
- **Error Recovery:** Failed macros don't prevent other actions from executing
- **Minimal Impact:** Macros are resolved only when rules are executed

## Technical Implementation

### File Structure
```
src/Apps/OneClick/scripts/Macros/
├── Macros.ts (existing - updated with new registrations)
├── DevOpsMacros.ts (new - contains all DevOps macro implementations)
├── MacroUtils.ts (new - utility functions for date arithmetic)
└── __tests__/
    └── DevOpsMacros.test.ts (new - comprehensive test suite)
```

### Key Components

1. **MacroUtils:** Provides date arithmetic and operator parsing functionality
2. **DevOpsMacros:** Contains the actual macro implementations
3. **Macro Registration:** New macros are registered in the existing system
4. **Validation:** Enhanced validation for new macro types
5. **UI Help:** New help panel component for user guidance

### Dependencies

- **date-fns:** For date manipulation and formatting
- **TFS/Work/RestClient:** For DevOps API integration
- **VSS/Service:** For service client management

## Migration from Existing Macros

The new DevOps macros are fully backward compatible with existing macros:

- **@Today** - Still works as before
- **@Me** - Still works as before
- **@FieldValue** - Still works as before
- **@Any** - Still works as before

New macros extend the existing functionality without breaking changes.

## Testing

The implementation includes comprehensive unit tests covering:

- Date arithmetic calculations
- API integration scenarios
- Error handling and fallbacks
- Edge cases and boundary conditions
- Macro validation logic

Run tests with:
```bash
npm test -- --testPathPattern=DevOpsMacros
```

## Future Enhancements

Potential future additions to the DevOps macro system:

1. **@CurrentRelease** - Current release iteration
2. **@TeamMembers** - List of current team members
3. **@ProjectName** - Current project name
4. **@CollectionName** - Current collection name
5. **@WorkItemId** - Current work item ID
6. **@ParentIteration** - Parent iteration of current iteration

## Support and Troubleshooting

### Common Issues

1. **Macro not resolving:** Check browser console for error messages
2. **API failures:** Verify user has appropriate permissions
3. **Date calculations:** Ensure date-fns library is properly loaded
4. **Team context:** Verify user is in correct team context

### Debugging

Enable debug logging by setting:
```javascript
localStorage.setItem('oneclick-debug', 'true');
```

This will provide detailed console output for macro resolution.

## Conclusion

The DevOps macros significantly enhance the OneClick extension's automation capabilities by providing:

- **Team Context Awareness:** Rules can adapt to different team contexts
- **Enhanced Date/Time Support:** Powerful date arithmetic and calculations
- **DevOps Integration:** Seamless integration with Azure DevOps APIs
- **Error Resilience:** Robust error handling and fallback mechanisms
- **User-Friendly Interface:** Comprehensive help and documentation

These macros enable more sophisticated automation scenarios while maintaining the simplicity and reliability of the existing OneClick extension. 