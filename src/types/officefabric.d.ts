// Type declarations for OfficeFabric modules
declare module "OfficeFabric/Tooltip" {
    export enum DirectionalHint {
        topLeftEdge = 0,
        topCenter = 1,
        topRightEdge = 2,
        topAutoEdge = 3,
        bottomLeftEdge = 4,
        bottomCenter = 5,
        bottomRightEdge = 6,
        bottomAutoEdge = 7,
        leftTopEdge = 8,
        leftCenter = 9,
        leftBottomEdge = 10,
        rightTopEdge = 11,
        rightCenter = 12,
        rightBottomEdge = 13
    }
    
    export interface ITooltipHostProps {
        content: string;
        directionalHint?: DirectionalHint;
        delay?: TooltipDelay;
        overflowMode?: TooltipOverflowMode;
        hostClassName?: string;
    }
    
    export enum TooltipDelay {
        zero = 0,
        medium = 1,
        long = 2
    }
    
    export enum TooltipOverflowMode {
        Clip = 0,
        Overflow = 1,
        Parent = 2,
        Self = 3
    }
    
    export class TooltipHost extends React.Component<ITooltipHostProps> {}
}

declare module "OfficeFabric/components/pickers/TagPicker/TagPicker" {
    export interface ITag {
        key: string;
        name: string;
    }
    
    export interface ITagPickerProps {
        onResolveSuggestions: (filter: string, selectedItems?: ITag[]) => ITag[] | Promise<ITag[]>;
        onItemSelected?: (item: ITag) => ITag | Promise<ITag>;
        selectedItems?: ITag[];
        onChange?: (items?: ITag[]) => void;
        className?: string;
        disabled?: boolean;
        onValidateInput?: (value: string) => ValidationState;
        createGenericItem?: (input: string) => any;
        inputProps?: any;
        pickerSuggestionsProps?: any;
        defaultSelectedItems?: ITag[];
        getTextFromItem?: (item: ITag) => string;
    }
    
    export class TagPicker extends React.Component<ITagPickerProps> {}
    
    export enum ValidationState {
        Valid = 0,
        Invalid = 1,
        Warning = 2,
        valid = 0,
        invalid = 1,
        warning = 2
    }
}

declare module "OfficeFabric/components/ActivityItem/ActivityItem" {
    export interface IActivityItemProps {
        activityDescription?: React.ReactNode[];
        comments?: React.ReactNode[];
        timeStamp?: string | React.ReactNode;
        activityIcon?: React.ReactNode;
        activityPersonas?: any[];
        isCompact?: boolean;
    }
    
    export class ActivityItem extends React.Component<IActivityItemProps> {}
}

declare module "OfficeFabric/components/TextField/TextField" {
    export interface ITextFieldProps {
        label?: string;
        value?: string;
        multiline?: boolean;
        resizable?: boolean;
        required?: boolean;
        disabled?: boolean;
        errorMessage?: string;
        info?: string | Element;
        delay?: number;
        onChange?: (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => void;
        onChanged?: (newValue: string) => void;
        onGetErrorMessage?: (value: string) => string;
    }
    
    export class TextField extends React.Component<ITextFieldProps> {}
} 