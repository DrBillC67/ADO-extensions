// Module declarations specifically for OneClick app
// This file provides targeted type coverage for OneClick dependencies

// TFS/WorkItemTracking/Contracts
declare module "TFS/WorkItemTracking/Contracts" {
    export interface WorkItem {
        id: number;
        fields: { [key: string]: any };
        url?: string;
    }
    
    export interface WorkItemField {
        referenceName: string;
        name: string;
        type: any;
        isIdentity?: boolean;
    }
    
    export interface WorkItemType {
        name: string;
        referenceName: string;
        fields?: WorkItemField[];
        icon?: any;
    }
    
    export interface WorkItemTemplateReference {
        id: string;
        name: string;
        workItemTypeName?: string;
    }
    
    export interface WorkItemRelation {
        rel: string;
        url: string;
        attributes?: { [key: string]: any };
    }
    
    export interface WorkItemRelationType {
        name: string;
        referenceName: string;
        url?: string;
    }
    
    export interface WorkItemClassificationNode {
        id: number;
        name: string;
        structureType: string;
        hasChildren?: boolean;
        children?: WorkItemClassificationNode[];
    }
    
    export interface WorkItemStateColor {
        name?: string;
        category: string;
        color: string;
    }
    
    export interface WorkItemTemplate {
        id: string;
        name: string;
        workItemTypeName: string;
    }
    
    export interface WorkItemTypeFieldsExpandLevel {
        None: 0;
        All: 1;
    }
    
    export interface WorkItemErrorPolicy {
        None: 0;
        Fail: 1;
    }
    
    export interface TreeStructureGroup {
        Areas: 0;
        Iterations: 1;
    }
    
    export enum FieldType {
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
}

// TFS/Core/Contracts
declare module "TFS/Core/Contracts" {
    export interface TeamContext {
        projectId: string;
        teamId: string;
        project: string;
        team: string;
    }
    
    export interface TeamProject {
        id: string;
        name: string;
        description: string;
    }
    
    export interface WebApiTeam {
        id: string;
        name: string;
        description: string;
    }
}

// TFS/Core/RestClient
declare module "TFS/Core/RestClient" {
    export class CoreHttpClient {
        getClient(): any;
    }
    
    export class CoreHttpClient4 {
        getClient(): any;
    }
}

// TFS/WorkItemTracking/ExtensionContracts
declare module "TFS/WorkItemTracking/ExtensionContracts" {
    export interface IWorkItemLoadedArgs {
        id: number;
        isNew: boolean;
    }
    
    export interface IWorkItemChangedArgs {
        id: number;
        changedFields: { [key: string]: any };
    }
    
    export interface IWorkItemFieldChangedArgs extends IWorkItemChangedArgs {
        fieldName: string;
        oldValue: any;
        newValue: any;
    }
    
    export interface IWorkItemNotificationListener {
        onLoaded?(args: IWorkItemLoadedArgs): void;
        onFieldChanged?(args: IWorkItemChangedArgs): void;
        onUnloaded?(args: IWorkItemChangedArgs): void;
        onSaved?(args: IWorkItemChangedArgs): void;
        onRefreshed?(args: IWorkItemChangedArgs): void;
    }
}

// VSS/SDK/Services/Navigation
declare module "VSS/SDK/Services/Navigation" {
    export class NavigationService {
        static getService(): any;
    }
    
    export class HostNavigationService {
        static getService(): any;
        attachNavigate(callback: (args: any) => void): void;
        detachNavigate(callback: (args: any) => void): void;
        getCurrentState(): any;
        updateHistoryEntry(state: any): void;
        reload(): void;
    }
}

// VSS/WebApi/Contracts
declare module "VSS/WebApi/Contracts" {
    export interface IdentityRef {
        id: string;
        displayName: string;
        uniqueName: string;
        descriptor?: string;
        imageUrl?: string;
        _links?: any;
    }
    
    export interface ProjectInfo {
        id: string;
        name: string;
        description?: string;
    }
    
    export interface CollectionInfo {
        id: string;
        name: string;
    }
    
    export interface WebApiTagDefinition {
        id: string;
        name: string;
        description?: string;
    }
    
    export interface JsonPatchDocument {
        operations: JsonPatchOperation[];
    }
    
    export interface JsonPatchOperation {
        op: Operation;
        path: string;
        value?: any;
    }
    
    export enum Operation {
        Add = 0,
        Remove = 1,
        Replace = 2,
        Move = 3,
        Copy = 4,
        Test = 5
    }
}

// VSS/Controls
declare module "VSS/Controls" {
    export class Control {
        constructor(element: HTMLElement, options: any);
        static create(element: HTMLElement, options: any): any;
    }
    
    export class TreeView {
        constructor(element: HTMLElement, options: any);
        expand(node: any): void;
        collapse(node: any): void;
        select(node: any): void;
        getSelectedNodes(): any[];
        onNodeSelected(callback: (node: any) => void): void;
        onNodeExpanded(callback: (node: any) => void): void;
        onNodeCollapsed(callback: (node: any) => void): void;
    }
    
    export interface TreeNode {
        id: string;
        name: string;
        children?: TreeNode[];
        add(child: TreeNode): void;
        expanded?: boolean;
    }
}

// VSS/Controls/Combos
declare module "VSS/Controls/Combos" {
    export interface IComboOptions {
        value?: any;
        items?: any[];
        placeholder?: string;
        width?: string;
        height?: string;
    }
    
    export class Combo {
        constructor(element: HTMLElement, options: IComboOptions);
        setValue(value: any): void;
        getValue(): any;
        onValueChanged(callback: (value: any) => void): void;
        setEnabled(enabled: boolean): void;
        setItems(items: any[]): void;
        focus(): void;
        setInputText(text: string): void;
        dispose(): void;
        getText(): string;
        setSource(source: any[]): void;
    }
    
    export class DatePickerCombo extends Combo {
        constructor(element: HTMLElement, options: IComboOptions);
        setDate(date: Date): void;
        getDate(): Date;
    }
    
    export class SimpleCombo extends Combo {
        constructor(element: HTMLElement, options: IComboOptions);
    }
    
    export class TreeCombo extends Combo {
        constructor(element: HTMLElement, options: IComboOptions);
        setTreeData(data: any[]): void;
    }
}

// VSS/Controls/TreeView
declare module "VSS/Controls/TreeView" {
    export interface TreeNode {
        id: string;
        name: string;
        children?: TreeNode[];
        add(child: TreeNode): void;
        expanded?: boolean;
    }
    
    export class TreeView {
        constructor(element: HTMLElement, options: any);
        expand(node: any): void;
        collapse(node: any): void;
        select(node: any): void;
        getSelectedNodes(): any[];
        onNodeSelected(callback: (node: any) => void): void;
        onNodeExpanded(callback: (node: any) => void): void;
        onNodeCollapsed(callback: (node: any) => void): void;
    }
} 