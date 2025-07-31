// Global type declarations for ADO Extensions
// This file provides comprehensive type coverage for the legacy VSS/TFS ecosystem

// Global VSS namespace
declare var VSS: any;

// Dictionary types
declare interface IDictionaryStringTo<T> {
    [key: string]: T;
}

declare interface IDictionaryNumberTo<T> {
    [key: number]: T;
}

// Common VSS/TFS interfaces
declare interface IdentityRef {
    id: string;
    displayName: string;
    uniqueName: string;
    descriptor?: string;
    imageUrl?: string;
    _links?: any;
}

declare interface ProjectInfo {
    id: string;
    name: string;
    description?: string;
}

declare interface CollectionInfo {
    id: string;
    name: string;
}

declare interface WebContext {
    user: IdentityRef;
    project: ProjectInfo;
    collection: CollectionInfo;
    host?: any;
}

declare interface ExtensionContext {
    baseUri: string;
    extensionId: string;
    publisherId?: string;
}

// Work Item interfaces
declare interface WorkItem {
    id: number;
    fields: { [key: string]: any };
    url?: string;
}

declare interface WorkItemField {
    referenceName: string;
    name: string;
    type: any;
    isIdentity?: boolean;
}

declare interface WorkItemType {
    name: string;
    referenceName: string;
    fields?: WorkItemField[];
    icon?: any;
}

declare interface WorkItemTemplateReference {
    id: string;
    name: string;
    workItemTypeName?: string;
}

declare interface WorkItemRelation {
    rel: string;
    url: string;
    attributes?: { [key: string]: any };
}

declare interface WorkItemRelationType {
    name: string;
    referenceName: string;
    url?: string;
}

declare interface WorkItemClassificationNode {
    id: number;
    name: string;
    structureType: string;
    hasChildren?: boolean;
    children?: WorkItemClassificationNode[];
}

declare interface WorkItemStateColor {
    name?: string;
    category: string;
    color: string;
}

// Team and Project interfaces
declare interface TeamContext {
    projectId: string;
    teamId: string;
    project: string;
    team: string;
}

declare interface TeamProject {
    id: string;
    name: string;
    description: string;
}

declare interface WebApiTeam {
    id: string;
    name: string;
    description: string;
}

// Git interfaces
declare interface GitRepository {
    id: string;
    name: string;
    url: string;
    defaultBranch?: string;
}

// Service interfaces
declare interface IWorkItemFormService {
    getFieldValue(fieldName: string): any;
    setFieldValue(fieldName: string, value: any): void;
    isValid(): boolean;
    save(): Promise<void>;
}

declare interface IWorkItemNotificationListener {
    onLoaded?(args: any): void;
    onFieldChanged?(args: any): void;
    onUnloaded?(args: any): void;
    onSaved?(args: any): void;
    onRefreshed?(args: any): void;
}

declare interface IWorkItemFieldChangedArgs {
    fieldName: string;
    oldValue: any;
    newValue: any;
}

declare interface IWorkItemChangedArgs {
    id: number;
    changedFields: { [key: string]: any };
}

declare interface IWorkItemLoadedArgs {
    id: number;
    isNew: boolean;
}

// Navigation interfaces
declare interface HostNavigationService {
    attachNavigate(callback: (args: any) => void): void;
    detachNavigate(callback: (args: any) => void): void;
    getCurrentState(): any;
    updateHistoryEntry(state: any): void;
    reload(): void;
}

// Extension Data interfaces
declare interface ExtensionDataCollection {
    id: string;
    name: string;
    scope?: number;
}

declare interface ExtensionDataManager {
    getValue<T>(key: string, defaultValue?: T): Promise<T>;
    setValue<T>(key: string, value: T): Promise<void>;
    queryCollections(): Promise<ExtensionDataCollection[]>;
}

// Dialog interfaces
declare interface IHostDialogService {
    openDialog(dialogOptions: any): Promise<any>;
    closeDialog(result?: any): void;
}

// JSON Patch interfaces
declare interface JsonPatchDocument {
    operations: JsonPatchOperation[];
}

declare interface JsonPatchOperation {
    op: Operation;
    path: string;
    value?: any;
}

declare enum Operation {
    Add = 0,
    Remove = 1,
    Replace = 2,
    Move = 3,
    Copy = 4,
    Test = 5
}

// Field types
declare enum FieldType {
    String = 1,
    Integer = 2,
    DateTime = 3,
    PlainText = 4,
    Html = 5,
    TreePath = 6,
    History = 7,
    Double = 8,
    Guid = 9,
    Boolean = 10,
    Identity = 11,
    PicklistString = 12,
    PicklistInteger = 13,
    PicklistDouble = 14
}

// Work Item Template interfaces
declare interface WorkItemTemplate {
    id: string;
    name: string;
    workItemTypeName: string;
}

declare interface WorkItemTypeFieldsExpandLevel {
    None: 0;
    All: 1;
}

declare interface WorkItemErrorPolicy {
    None: 0;
    Fail: 1;
}

declare interface TreeStructureGroup {
    Areas: 0;
    Iterations: 1;
}

// Team Field interfaces
declare interface TeamField {
    field: WorkItemField;
    defaultValue: any;
    values: any[];
}

// Web API interfaces
declare interface WebApiTagDefinition {
    id: string;
    name: string;
    description?: string;
}

// Authentication interfaces
declare interface IAuthenticationService {
    getAccessToken(): Promise<string>;
}

// Global jQuery declaration
declare var $: any;

// Global React declaration
declare namespace React {
    interface FormEvent<T = Element> {
        target: T;
    }
    
    interface CSSProperties {
        [key: string]: any;
    }
}

// Global Node.js declarations for browser environment
declare namespace NodeJS {
    interface Process {
        env: { [key: string]: string | undefined };
    }
}

declare var process: NodeJS.Process; 