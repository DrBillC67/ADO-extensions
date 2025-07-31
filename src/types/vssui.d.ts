// Type declarations for VSSUI components
declare module "VSSUI/VssIcon" {
    export enum VssIconType {
        Fabric = 0,
        Image = 1,
        fabric = 0,
        image = 1
    }

    export interface IVssIconProps {
        iconName: string;
        className?: string;
        iconType?: VssIconType | number;
        title?: string;
        onClick?: () => void;
        style?: React.CSSProperties;
    }
    export class VssIcon extends React.Component<IVssIconProps> {}
}

declare module "VSSUI/IconToggleButton" {
    export interface IIconToggleButtonProps {
        iconName: string;
        title?: string;
        checked?: boolean;
        disabled?: boolean;
        onToggle?: (checked: boolean) => void;
        className?: string;
        toggledOnIconProps?: any;
        toggledOffIconProps?: any;
        isToggledOn?: boolean;
    }
    export class IconToggleButton extends React.Component<IIconToggleButtonProps> {}
}

declare module "VSSUI/FileInput" {
    export enum FileInputContentType {
        Text = 0,
        Binary = 1,
        RawFile = 2
    }

    export interface IFileInputProps {
        className?: string;
        label?: string;
        buttonText?: string;
        placeholder?: string;
        onFileSelected: (file: File, content: string | ArrayBuffer, contentType: FileInputContentType) => void;
        allowedFileExtensions?: string[];
        fileInputContentType?: FileInputContentType;
        maximumNumberOfFiles?: number;
        maximumSingleFileSize?: number;
        updateHandler?: (updateEvent: FileInputUpdateEventData) => void;
        resultContentType?: FileInputContentType;
    }
    export class FileInput extends React.Component<IFileInputProps> {}
    
    export interface FileInputUpdateEventData {
        files: File[];
        resultContentType: FileInputContentType;
    }
    
    export interface FileInputResult {
        content: string;
        contentType: FileInputContentType;
        file?: File;
    }
}

declare module "VSSUI/Hub" {
    export interface IHubProps {
        title: string;
        className?: string;
        hideFullScreenToggle?: boolean;
        hubViewState?: any;
        commands?: any[];
        children?: React.ReactNode;
    }
    export class Hub extends React.Component<IHubProps> {}
}

declare module "VSSUI/HubHeader" {
    export interface IHubHeaderProps {
        title: string;
        breadcrumbs?: any[];
        breadcrumbItems?: any[];
    }
    export class HubHeader extends React.Component<IHubHeaderProps> {}
    export class HubTextTile extends React.Component<any> {}
    export class HubTileRegion extends React.Component<any> {}
}

declare module "VSSUI/KeywordFilterBarItem" {
    export interface IKeywordFilterBarItemProps {
        filterItemKey: string;
        value: string;
        onChanged: (value: string) => void;
    }
    export class KeywordFilterBarItem extends React.Component<IKeywordFilterBarItemProps> {}
}

declare module "VSSUI/VssDetailsList" {
    export interface IVssDetailsListProps {
        items: any[];
        columns: any[];
        layoutMode?: any;
        constrainMode?: any;
        selectionMode?: any;
        selection?: any;
        onItemInvoked?: (item: any) => void;
        getMenuItems?: (item: any) => any[];
        actionsColumnKey?: string;
        className?: string;
        selectionPreservedOnEmptyClick?: boolean;
        checkboxVisibility?: any;
        onColumnHeaderClick?: (ev: React.MouseEvent<HTMLElement>, column: any) => void;
        getKey?: (item: any) => string;
        setKey?: (item: any) => string;
        allocateSpaceForActionsButtonWhileHidden?: boolean;
        listProps?: any;
        onRenderItemColumn?: (item: any, index: number, column: any) => JSX.Element;
    }
    export class VssDetailsList extends React.Component<IVssDetailsListProps> {}
}

declare module "VSSUI/FilterBar" {
    export interface IKeywordFilterBarItemProps {
        value: string;
        onChanged: (value: string) => void;
        filterItemKey?: string;
    }
    export class KeywordFilterBarItem extends React.Component<IKeywordFilterBarItemProps> {}
    
    export interface IFilterBar {
        focus(): void;
    }
    export class FilterBar extends React.Component<any> {}
}

declare module "VSSUI/PickList" {
    export interface IPickListProps {
        items: any[];
        onSelectionChanged: (items: any[]) => void;
    }
    export class PickList extends React.Component<IPickListProps> {}
    
    export interface IPickListItem {
        // Add pick list item interface
    }
    
    export class PickListFilterBarItem extends React.Component<any> {}
}

declare module "VSSUI/PivotBar" {
    export interface IPivotBarProps {
        items: any[];
        selectedKey: string;
        onPivotItemClicked: (item: any) => void;
    }
    export class PivotBar extends React.Component<IPivotBarProps> {}
    
    export interface IPivotBarAction {
        key: string;
        name: string;
        disabled?: boolean;
        important?: boolean;
        iconProps?: any;
        onClick?: () => void;
    }
    
    export class PivotBarItem extends React.Component<any> {}

    export interface IPivotBarViewAction {
        key: string;
        name: string;
        actionType: PivotBarViewActionType;
        iconProps?: any;
        important?: boolean;
        actionProps?: any;
    }
    
    export enum PivotBarViewActionType {
        ChoiceGroup = 0
    }
    
    export interface IChoiceGroupViewActionProps {
        options: any[];
    }
}

// Use the actual VSSUI library interface instead of our custom one
declare module "VSSUI/Utilities/HubViewState" {
    export interface IHubViewState {
        selectedPivot: any;
        filter: any;
        viewOptions: any;
        canSwitchPivots(targetPivot: string): boolean;
        subscribe(callback: (value: any, action?: string) => void, action?: string): void;
        unsubscribe(callback: (value: any, action?: string) => void, action?: string): void;
    }
    export class HubViewState implements IHubViewState {
        selectedPivot: any;
        filter: any;
        viewOptions: any;
        canSwitchPivots(targetPivot: string): boolean;
        subscribe(callback: (value: any, action?: string) => void, action?: string): void;
        unsubscribe(callback: (value: any, action?: string) => void, action?: string): void;
    }
    
    export namespace HubViewOptionKeys {
        const showFilterBar = "showFilters";
        const fullScreen = "fullScreen";
    }
}

declare module "VSSUI/Utilities/Observable" {
    export class Observable<T = any> {
        subscribe(callback: Function): void;
        unsubscribe(callback: Function): void;
        notify(data?: T): void;
    }
}

declare module "VSSUI/Utilities/Internal" {
    export function getService<T>(serviceId: string): T;
    export function closest(element: HTMLElement, selector: string): HTMLElement | null;
} 