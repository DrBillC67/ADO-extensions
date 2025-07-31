// Type declarations for VSS/TFS modules
declare namespace VSS {
    function init(options: any): void;
    function require(modules: string[], callback: Function): void;
    function getService<T>(serviceId: string): T;
    function register(contributionId: string, contribution: any): void;
    function unregister(contributionId: string): void;
    function getContribution(contributionId: string): any;
    function getExtensionContext(): any;
    function getWebContext(): any;
    function resize(): void;
    function getConfiguration(): any;
    
    namespace SDK {
        namespace Services {
            class Navigation {
                getService(): any;
            }
        }
    }
    
    namespace WebApi {
        namespace Contracts {
            interface IdentityRef {
                id: string;
                displayName: string;
                uniqueName: string;
                descriptor: string;
                imageUrl?: string; // Add missing property
            }
        }
    }
    
    namespace Controls {
        class TreeView {
            constructor(element: HTMLElement, options: any);
            expand(node: any): void;
            collapse(node: any): void;
            select(node: any): void;
            getSelectedNodes(): any[];
            onNodeSelected(callback: (node: any) => void): void;
            onNodeExpanded(callback: (node: any) => void): void;
            onNodeCollapsed(callback: (node: any) => void): void;
        }
        
        namespace Combos {
            class Combo {
                constructor(element: HTMLElement, options: any);
                setValue(value: any): void;
                getValue(): any;
                onValueChanged(callback: (value: any) => void): void;
                setEnabled(enabled: boolean): void;
                setItems(items: any[]): void;
                focus(): void; // Add missing method
                setInputText(text: string): void; // Add missing method
                dispose(): void; // Add missing method
                getText(): string; // Add missing method
                setSource(source: any[]): void; // Add missing method
            }
            
            class DatePickerCombo extends Combo {
                constructor(element: HTMLElement, options: any);
                setDate(date: Date): void;
                getDate(): Date;
            }
            
            class SimpleCombo extends Combo {
                constructor(element: HTMLElement, options: any);
            }
            
            class TreeCombo extends Combo {
                constructor(element: HTMLElement, options: any);
                setTreeData(data: any[]): void;
            }
        }
    }
}

// Global type declarations
declare var VSS: any;
declare interface IDictionaryStringTo<T> {
    [key: string]: T;
}

declare interface IDictionaryNumberTo<T> {
    [key: number]: T;
}

// VSS/TFS function and interface signatures
declare namespace VSS {
    function getService<T>(contributionId: string): T;
    function require<T>(module: string): T;
    function getWebContext(): WebContext;
    function getExtensionContext(): ExtensionContext;
    function resize(): void;
    function resize(width: number, height: number): void;
    function getAccessToken(): Promise<string>;
    
    namespace ServiceIds {
        const HostDialogService: string;
        const ExtensionData: string;
        const Dialog: string;
        const Navigation: string;
    }
    
    interface WebContext {
        user: IdentityRef;
        project: ProjectInfo;
        collection: CollectionInfo;
        host: any;
    }
    
    interface ExtensionContext {
        baseUri: string;
        extensionId: string;
        publisherId: string;
    }
}

declare namespace TFS {
    namespace Core {
        namespace Contracts {
            interface TeamProject {
                id: string;
                name: string;
                description: string;
            }
            
            interface WebApiTeam {
                id: string;
                name: string;
                description: string;
            }
            
            interface WebApiTagDefinition {
                id: string;
                name: string;
                description?: string;
            }
        }
        
        namespace RestClient {
            class CoreHttpClient {
                getTeamProject(project: string): Promise<any>;
                getClient(): any;
            }
        }
    }
    
    namespace WorkItemTracking {
        namespace Contracts {
            interface WorkItem {
                id: number;
                fields: { [key: string]: any };
                url?: string; // Add missing property
            }
            
            interface WorkItemField {
                referenceName: string;
                name: string;
                type: FieldType;
                isIdentity?: boolean; // Add missing property
            }
            
            interface WorkItemType {
                name: string;
                referenceName: string;
                fields?: WorkItemField[]; // Add missing property
                icon?: any; // Add missing property
            }
            
            interface WorkItemTemplateReference {
                id: string;
                name: string;
                workItemTypeName?: string; // Add missing property
            }
            
            interface WorkItemRelation {
                rel: string;
                url: string;
                attributes?: { [key: string]: any };
            }
            
            interface WorkItemRelationType {
                name: string;
                referenceName: string;
                url?: string;
            }
            
            interface WorkItemClassificationNode {
                id: number;
                name: string;
                structureType: string;
                hasChildren?: boolean;
                children?: WorkItemClassificationNode[];
            }
            
            interface WorkItemStateColor {
                category: string;
                color: string;
                name?: string; // Add missing property
            }
            
            enum FieldType {
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
        
        namespace ExtensionContracts {
            interface IWorkItemLoadedArgs {
                id: number;
                isNew: boolean;
            }
            
            interface IWorkItemChangedArgs {
                id: number;
                changedFields: { [key: string]: any };
            }
            
            interface IWorkItemFieldChangedArgs extends IWorkItemChangedArgs {
                fieldName: string;
                oldValue: any;
                newValue: any;
            }
            
            interface IWorkItemNotificationListener {
                onLoaded(args: IWorkItemLoadedArgs): void;
                onFieldChanged(args: IWorkItemChangedArgs): void;
                onUnloaded?(args: IWorkItemChangedArgs): void;
                onSaved?(args: IWorkItemChangedArgs): void;
                onRefreshed?(args: IWorkItemChangedArgs): void;
            }
        }
        
        namespace RestClient {
            class WorkItemTrackingHttpClient {
                getWorkItem(id: number): Promise<any>;
                getWorkItemTypes(project: string): Promise<any>;
                getFields(project: string): Promise<any>;
            }
        }
        
        namespace Services {
            class WorkItemFormService {
                getFieldValue(fieldName: string): any;
                setFieldValue(fieldName: string, value: any): void;
            }
        }
    }
    
    namespace Work {
        namespace Contracts {
            interface TeamContext {
                project: string;
                team: string;
            }
        }
        
        namespace RestClient {
            class WorkHttpClient {
                getTeams(project: string): Promise<any>;
            }
        }
    }
    
    namespace VersionControl {
        namespace Contracts {
            interface GitRepository {
                id: string;
                name: string;
                url: string;
            }
        }
        
        namespace GitRestClient {
            class GitHttpClient {
                getRepositories(project: string): Promise<any>;
            }
        }
    }
}

// VSS Service declarations
declare module "VSS/SDK/Services/Navigation" {
    export class NavigationService {
        static getService(): any;
    }
    
    export class HostNavigationService {
        static getService(): any;
        attachNavigate(callback: Function): void;
        detachNavigate(callback: Function): void;
        getCurrentState(): any;
        updateHistoryEntry(state: any): void;
        reload(): void;
    }
}

declare module "TFS/WorkItemTracking/Contracts" {
    export interface WorkItem {
        id: number;
        fields: { [key: string]: any };
        url?: string;
    }
    
    export interface WorkItemField {
        referenceName: string;
        name: string;
        type: FieldType;
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
        category: string;
        color: string;
        name?: string;
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

declare module "TFS/Core/Contracts" {
    export interface TeamContext {
        projectId: string;
        teamId: string;
        project: string;
        team: string;
    }
    
    export interface WebApiTagDefinition {
        id: string;
        name: string;
        description?: string;
    }
}

declare module "TFS/Core/RestClient" {
    export class CoreHttpClient {
        getClient(): any;
    }
}

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
        onLoaded(args: IWorkItemLoadedArgs): void;
        onFieldChanged(args: IWorkItemChangedArgs): void;
        onUnloaded?(args: IWorkItemChangedArgs): void;
        onSaved?(args: IWorkItemChangedArgs): void;
        onRefreshed?(args: IWorkItemChangedArgs): void;
    }
}

declare module "TFS/VersionControl/Contracts" {
    export interface GitRepository {
        id: string;
        name: string;
        url: string;
    }
}

declare module "VSS/WebApi/Contracts" {
    export interface IdentityRef {
        id: string;
        displayName: string;
        uniqueName: string;
        descriptor: string;
        imageUrl?: string;
    }
}

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

declare var $: any;

declare module "TFS/Core/RestClient" {
    export class CoreHttpClient {
        getClient(): any;
    }
    export class CoreHttpClient4 {
        getClient(): any;
    }
}

declare module "TFS/WorkItemTracking/Contracts" {
    export enum WorkItemTypeFieldsExpandLevel {
        None = 0,
        All = 1
    }
    
    export interface WorkItemTemplate {
        id: string;
        name: string;
        workItemTypeName: string;
        fields?: { [key: string]: any };
    }
    
    export enum WorkItemErrorPolicy {
        None = 0,
        Fail = 1
    }
    
    export enum TreeStructureGroup {
        Areas = 0,
        Iterations = 1
    }
}

declare module "TFS/Work/Contracts" {
    export interface TeamField {
        field: WorkItemField;
        defaultValue: any;
        values: any[];
    }
    
    export interface TeamContext {
        projectId: string;
        teamId: string;
        project: string;
        team: string;
    }
    
    export interface TeamFieldValues {
        defaultValue: any;
        values: any[];
        field?: WorkItemField;
    }
    
    export interface WorkItemField {
        referenceName: string;
        name: string;
        type: FieldType;
        isIdentity?: boolean;
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

declare module "TFS/WorkItemTracking/RestClient" {
    export class WorkItemTrackingHttpClient {
        getClient(): any;
    }
}

declare module "TFS/WorkItemTracking/Services" {
    export interface IWorkItemFormService {
        getFieldValue(fieldName: string): any;
        getFieldValues(fieldNames?: string[]): Promise<any>;
        setFieldValue(fieldName: string, value: any): void;
        isValid(): boolean;
        save(): Promise<void>;
    }
}

declare module "TFS/Work/RestClient" {
    export class WorkRestClient {
        getClient(): any;
        getTeamFieldValues(project: string, team: string): Promise<any>;
    }
}

declare module "TFS/Core/RestClient" {
    export class CoreHttpClient {
        getClient(): any;
        getTeamProject(project: string): Promise<any>;
    }
    
    export class CoreHttpClient4 {
        getClient(): any;
        getTeams(project: string): Promise<any[]>;
        getTeamProject(project: string): Promise<any>;
    }
}

declare module "TFS/VersionControl/GitRestClient" {
    export class GitHttpClient {
        getClient(): any;
        getRepositories(project: string): Promise<any[]>;
    }
}

declare module "TFS/VersionControl/Contracts" {
    export interface GitRepository {
        id: string;
        name: string;
        url: string;
        defaultBranch?: string;
        remoteUrl?: string;
    }
}

declare module "TFS/VersionControl/GitRestClient" {
    export class GitHttpClient {
        getClient(): any;
    }
}

declare module "VSS/Authentication/Services" {
    export interface IAuthenticationService {
        getAccessToken(): Promise<string>;
    }
}

declare module "VSS/Service" {
    export function getService<T>(serviceId: string): T;
}

declare module "VSS/Controls/Menu" {
    export interface IContributedMenuItem {
        id: string;
        text: string;
        icon?: string;
        disabled?: boolean;
        groupId?: string;
        order?: number;
        action?: () => void;
    }
}

declare module "VSS/Controls/Dialogs" {
    export interface IHostDialogOptions {
        title: string;
        width?: number;
        height?: number;
        modal?: boolean;
    }
}

declare module "VSS/SDK/Services/ExtensionData" {
    export interface IExtensionDataService {
        getValue<T>(collection: string, key: string, defaultValue?: T): Promise<T>;
        setValue<T>(collection: string, key: string, value: T): Promise<T>;
        getDocuments<T>(collection: string, documentIds?: string[]): Promise<T[]>;
        setDocument<T>(collection: string, document: T): Promise<T>;
        updateDocument<T>(collection: string, document: T): Promise<T>;
        deleteDocument(collection: string, documentId: string): Promise<void>;
        queryDocuments<T>(collection: string, query: any): Promise<T[]>;
        getDocument<T>(collection: string, documentId: string): Promise<T>;
        createDocument<T>(collection: string, document: T): Promise<T>;
        queryCollectionNames(collectionNames: string[]): Promise<string[]>;
        queryCollections(collections: any[]): Promise<any[]>;
    }
    
    export class ExtensionDataService implements IExtensionDataService {
        getValue<T>(collection: string, key: string, defaultValue?: T): Promise<T>;
        setValue<T>(collection: string, key: string, value: T): Promise<T>;
        getDocuments<T>(collection: string, documentIds?: string[]): Promise<T[]>;
        setDocument<T>(collection: string, document: T): Promise<T>;
        updateDocument<T>(collection: string, document: T): Promise<T>;
        deleteDocument(collection: string, documentId: string): Promise<void>;
        queryDocuments<T>(collection: string, query: any): Promise<T[]>;
    }
    
    export interface ExtensionDataCollection {
        id: string;
        name: string;
        documents?: any[];
    }
}

declare module "VSS/Controls" {
    export class Control {
        static create<T>(controlType: any, element: JQuery, options?: any): T;
    }
    
    export class Combo {
        constructor(element: JQuery, options?: any);
        setInputText(text: string): void;
        setEnabled(enabled: boolean): void;
        getText(): string;
        dispose(): void;
    }
}

declare module "VSS/Controls/Combos" {
    export class Combo {
        constructor(element: JQuery, options?: any);
        setInputText(text: string): void;
        setEnabled(enabled: boolean): void;
        getText(): string;
        dispose(): void;
    }
}

declare module "TFS/WorkItemTracking/Contracts" {
    export interface WorkItem {
        id: number;
        url: string;
        rev: number;
        fields: { [key: string]: any };
        _links: any;
    }
    
    export interface WorkItemRelation {
        rel: string;
        url: string;
        attributes: { [key: string]: any };
    }
    
    export interface WorkItemRelationUpdates {
        added: WorkItemRelation[];
        removed: WorkItemRelation[];
        updated: WorkItemRelation[];
    }
    
    export interface WorkItemUpdate {
        id: number;
        rev: number;
        fields: { [key: string]: any };
        relations: WorkItemRelationUpdates;
    }
    
    export interface WorkItemQueryResult {
        workItems: WorkItemReference[];
        asOf: Date;
        columns: WorkItemFieldReference[];
        queryType: QueryType;
        queryResultType: QueryResultType;
        sortFields: WorkItemQuerySortColumn[];
        workItemRelations: WorkItemRelation[];
    }
    
    export interface WorkItemReference {
        id: number;
        url: string;
    }
    
    export interface WorkItemFieldReference {
        referenceName: string;
        name: string;
        url: string;
    }
    
    export enum QueryType {
        Flat = 1,
        Tree = 2,
        OneHop = 3
    }
    
    export enum QueryResultType {
        WorkItem = 1,
        WorkItemLink = 2
    }
    
    export interface WorkItemQuerySortColumn {
        field: WorkItemFieldReference;
        descending: boolean;
    }
}

declare module "TFS/WorkItemTracking/RestClient" {
    export class WorkItemTrackingHttpClient {
        getClient(): any;
    }
}

declare module "TFS/WorkItemTracking/Services" {
    export interface IWorkItemFormService {
        getFieldValue(fieldName: string): any;
        setFieldValue(fieldName: string, value: any): void;
        getFieldError(fieldName: string): string;
        setFieldError(fieldName: string, error: string): void;
        clearFieldError(fieldName: string): void;
        isDirty(): boolean;
        isValid(): boolean;
        save(): Promise<void>;
        reset(): void;
    }
}

declare module "TFS/WorkItemTracking/Controls" {
    export interface IWorkItemControl {
        getControl(): any;
        getValue(): any;
        setValue(value: any): void;
        clear(): void;
        focus(): void;
        isVisible(): boolean;
        setVisible(visible: boolean): void;
        isEnabled(): boolean;
        setEnabled(enabled: boolean): void;
        isReadOnly(): boolean;
        setReadOnly(readOnly: boolean): void;
    }
}

declare module "TFS/WorkItemTracking/WorkItemForm" {
    export interface IWorkItemForm {
        getFieldValue(fieldName: string): any;
        setFieldValue(fieldName: string, value: any): void;
        getFieldError(fieldName: string): string;
        setFieldError(fieldName: string, error: string): void;
        clearFieldError(fieldName: string): void;
        isDirty(): boolean;
        isValid(): boolean;
        save(): Promise<void>;
        reset(): void;
        getControl(fieldName: string): any;
        getId(): number;
        getFields(): any[];
        getFieldValues(): any;
        getWorkItemRelationTypes(): any[];
        getWorkItemRelations(): any[];
        addWorkItemRelations(relations: any[]): void;
    }
}

declare module "TFS/WorkItemTracking/Services" {
    export interface IWorkItemFormService {
        getFieldValue(fieldName: string): any;
        setFieldValue(fieldName: string, value: any): void;
        getFieldError(fieldName: string): string;
        setFieldError(fieldName: string, error: string): void;
        clearFieldError(fieldName: string): void;
        isDirty(): boolean;
        isValid(): boolean;
        save(): Promise<void>;
        reset(): void;
        getId(): number;
        getFields(): any[];
        getFieldValues(): any;
        getWorkItemRelationTypes(): any[];
        getWorkItemRelations(): any[];
        addWorkItemRelations(relations: any[]): void;
    }
    
    export interface IWorkItemFormNavigationService {
        openWorkItem(id: number): void;
        openWorkItemInNewWindow(id: number): void;
    }
    
    export class WorkItemFormService implements IWorkItemFormService {
        getFieldValue(fieldName: string): any;
        setFieldValue(fieldName: string, value: any): void;
        getFieldError(fieldName: string): string;
        setFieldError(fieldName: string, error: string): void;
        clearFieldError(fieldName: string): void;
        isDirty(): boolean;
        isValid(): boolean;
        save(): Promise<void>;
        reset(): void;
        getId(): number;
        getFields(): any[];
        getFieldValues(): any;
        getWorkItemRelationTypes(): any[];
        getWorkItemRelations(): any[];
        addWorkItemRelations(relations: any[]): void;
    }
    
    export class WorkItemFormNavigationService implements IWorkItemFormNavigationService {
        openWorkItem(id: number): void;
        openWorkItemInNewWindow(id: number): void;
    }
}

declare module "TFS/Core/RestClient" {
    export class CoreHttpClient {
        getClient(): any;
    }
}

declare module "TFS/Work/RestClient" {
    export class WorkHttpClient {
        getClient(): any;
    }
}

declare module "TFS/VersionControl/GitRestClient" {
    export class GitHttpClient {
        getClient(): any;
    }
}

declare module "VSS/Authentication/Services" {
    export interface IAuthenticationService {
        getAccessToken(): Promise<string>;
    }
    
    export interface IAuthTokenManager {
        getToken(): Promise<string>;
    }
    
    export const authTokenManager: IAuthTokenManager;
}

declare module "VSS/Service" {
    export function getService<T>(serviceId: string): T;
    export function getClient<T>(clientType: any): T;
}

declare module "VSS/Controls" {
    export interface IComboBox {
        getText(): string;
        setText(text: string): void;
        setEnabled(enabled: boolean): void;
        dispose(): void;
    }
}

declare module "VSSUI/FileInput" {
    export interface IFileInputProps {
        maximumNumberOfFiles: number;
        maximumSingleFileSize: number;
        allowedFileExtensions: string[];
        onFileSelected: (files: FileInputResult[]) => void;
        updateHandler: (updateEvent: FileInputUpdateEventData) => void;
        resultContentType: FileInputContentType;
    }
    
    export interface FileInputResult {
        file: File;
        result: string;
    }
    
    export interface FileInputUpdateEventData {
        files: FileInputResult[];
    }
    
    export enum FileInputContentType {
        Binary = 0,
        RawFile = 1
    }
    
    export class FileInput extends React.Component<IFileInputProps> {}
}

declare module "VSSUI/Utilities/Internal" {
    export function closest(element: HTMLElement, selector: string): HTMLElement;
}

declare module "VSSUI/Icon" {
    export interface IVssIconProps {
        iconType: VssIconType;
        iconName?: string;
        title?: string;
        className?: string;
        onClick?: () => void;
        imageProps?: {
            src: string;
            width: number;
            height: number;
        };
    }
    
    export enum VssIconType {
        Fabric = 0,
        Image = 1
    }
    
    export class VssIcon extends React.Component<IVssIconProps> {}
}

declare module "VSSUI/DetailsList" {
    export interface IDetailsListProps {
        items: any[];
        columns: IColumn[];
        layoutMode?: DetailsListLayoutMode;
        constrainMode?: ConstrainMode;
        onRenderItemColumn?: (item: any, index: number, column: IColumn) => React.ReactNode;
    }
    
    export interface IColumn {
        key: string;
        name: string;
        fieldName?: string;
        minWidth?: number;
        maxWidth?: number;
        isResizable?: boolean;
        onRender?: (item: any, index: number, column: IColumn) => React.ReactNode;
    }
    
    export enum DetailsListLayoutMode {
        fixedColumns = 0,
        justified = 1
    }
    
    export enum ConstrainMode {
        horizontalConstrained = 0,
        unconstrained = 1
    }
    
    export class DetailsList extends React.Component<IDetailsListProps> {}
}

declare module "VSSUI/ComboBox" {
    export interface IComboBoxProps {
        options: IComboBoxOption[];
        selectedKey?: string | number;
        onChange?: (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => void;
        disabled?: boolean;
        placeholder?: string;
        allowFreeform?: boolean;
    }
    
    export interface IComboBoxOption {
        key: string | number;
        text: string;
    }
    
    export interface IComboBox {
        selectedOptions: IComboBoxOption[];
    }
    
    export class ComboBox extends React.Component<IComboBoxProps> {}
}

declare module "VSS/WebApi/Contracts" {
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
        onLoaded(args: IWorkItemLoadedArgs): void;
        onFieldChanged(args: IWorkItemChangedArgs): void;
        onUnloaded?(args: IWorkItemChangedArgs): void;
        onSaved?(args: IWorkItemChangedArgs): void;
        onRefreshed?(args: IWorkItemChangedArgs): void;
    }
} 