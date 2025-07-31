// Type declarations for RoosterJS modules
declare module "roosterjs-editor-core" {
    export class Editor {
        constructor(container: HTMLElement, options?: IEditorOptions);
        getContent(): string;
        setContent(content: string): void;
        focus(): void;
        dispose(): void;
        addDomEventHandler(eventMap: any): void;
        removeDomEventHandler(eventMap: any): void;
        addContentChangedListener(listener: (event: any) => void): void;
        removeContentChangedListener(listener: (event: any) => void): void;
        addUndoSnapshot(): void;
        isDisposed(): boolean;
        getDocument(): Document;
        insertNode(node: Node): void;
        triggerContentChangedEvent(): void;
        undo(): void;
        redo(): void;
    }
    
    export class EditorPlugin {
        constructor();
        getName(): string;
        initialize(editor: Editor): void;
        dispose(): void;
    }
    
    export interface IEditorOptions {
        defaultFormat?: any;
        plugins?: EditorPlugin[];
        initialContent?: string;
    }
}

declare module "roosterjs-editor-plugins/lib/DefaultShortcut/DefaultShortcut" {
    import { EditorPlugin } from "roosterjs-editor-core";
    export class DefaultShortcut extends EditorPlugin {
        constructor();
    }
}

declare module "roosterjs-editor-plugins/lib/HyperLink/HyperLink" {
    import { EditorPlugin } from "roosterjs-editor-core";
    export class HyperLink extends EditorPlugin {
        constructor(callback?: (href: string) => string);
    }
}

declare module "roosterjs-editor-plugins/lib/ContentEdit/ContentEdit" {
    import { EditorPlugin } from "roosterjs-editor-core";
    export class ContentEdit extends EditorPlugin {
        constructor();
    }
}

declare module "roosterjs-editor-plugins/lib/Paste/Paste" {
    import { EditorPlugin } from "roosterjs-editor-core";
    export class Paste extends EditorPlugin {
        constructor(getImageUrl?: (data: string) => Promise<string>);
        getName(): string;
        initialize(editor: Editor): void;
        dispose(): void;
    }
}

declare module "roosterjs-editor-plugins/lib/Paste/getInheritableStyles" {
    export function getInheritableStyles(element: HTMLElement): any;
}

declare module "roosterjs-editor-plugins/lib/Paste/textToHtml" {
    export function textToHtml(text: string): string;
}

declare module "roosterjs-editor-plugins/lib/Paste/wordConverter/convertPastedContentFromWord" {
    export function convertPastedContentFromWord(element: HTMLElement): HTMLElement;
}

declare module "roosterjs-editor-types/lib/browser/NodeType" {
    export enum NodeType {
        Element = 1,
        Text = 3
    }
}

declare module "roosterjs-editor-types/lib/clipboard/BeforePasteEvent" {
    export interface BeforePasteEvent {
        clipboardData: any;
        fragment: DocumentFragment;
        html: string;
        text: string;
        image: File;
    }
}

declare module "roosterjs-editor-types/lib/clipboard/ClipboardData" {
    export interface ClipboardData {
        html: string;
        text: string;
        image: File;
    }
}

declare module "roosterjs-editor-types/lib/clipboard/PasteOption" {
    export enum PasteOption {
        PlainText = 1,
        Html = 2,
        Image = 4
    }
}

declare module "roosterjs-editor-types/lib/editor/ChangeSource" {
    export enum ChangeSource {
        Paste = 1,
        Drop = 2,
        Input = 3
    }
}

declare module "roosterjs-editor-types/lib/editor/DefaultFormat" {
    export interface DefaultFormat {
        fontFamily?: string;
        fontSize?: string;
        textColor?: string;
        backgroundColor?: string;
    }
}

declare module "roosterjs-editor-types/lib/editor/PluginEvent" {
    export interface PluginEvent {
        eventType: any;
        source: any;
    }
}

declare module "roosterjs-editor-types/lib/editor/PluginEventType" {
    export enum PluginEventType {
        BeforePaste = 1,
        ContentChanged = 2
    }
}

declare module "roosterjs-editor-api/lib/format/clearFormat" {
    import { IEditor } from "roosterjs-editor-types";
    import { ClearFormatMode } from "roosterjs-editor-types";
    
    const clearFormat: (editor: IEditor, formatType?: ClearFormatMode) => void;
    export default clearFormat;
    export { clearFormat };
}

declare module "roosterjs-editor-api/lib/format/removeLink" {
    import { IEditor } from "roosterjs-editor-types";
    
    const removeLink: (editor: IEditor) => void;
    export default removeLink;
    export { removeLink };
}

declare module "roosterjs-editor-api/lib/format/setAlignment" {
    import { IEditor } from "roosterjs-editor-types";
    import { Alignment } from "roosterjs-editor-types";
    
    const setAlignment: (editor: IEditor, alignment: Alignment) => void;
    export default setAlignment;
    export { setAlignment };
}

declare module "roosterjs-editor-api/lib/format/toggleBold" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleBold: (editor: IEditor) => void;
    export default toggleBold;
    export { toggleBold };
}

declare module "roosterjs-editor-api/lib/format/toggleItalic" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleItalic: (editor: IEditor) => void;
    export default toggleItalic;
    export { toggleItalic };
}

declare module "roosterjs-editor-api/lib/format/toggleUnderline" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleUnderline: (editor: IEditor) => void;
    export default toggleUnderline;
    export { toggleUnderline };
}

declare module "roosterjs-editor-api/lib/format/toggleStrikethrough" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleStrikethrough: (editor: IEditor) => void;
    export default toggleStrikethrough;
    export { toggleStrikethrough };
}

declare module "roosterjs-editor-api/lib/format/toggleSubscript" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleSubscript: (editor: IEditor) => void;
    export default toggleSubscript;
    export { toggleSubscript };
}

declare module "roosterjs-editor-api/lib/format/toggleSuperscript" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleSuperscript: (editor: IEditor) => void;
    export default toggleSuperscript;
    export { toggleSuperscript };
}

declare module "roosterjs-editor-api/lib/format/setFontName" {
    import { IEditor } from "roosterjs-editor-types";
    
    const setFontName: (editor: IEditor, fontName: string) => void;
    export default setFontName;
    export { setFontName };
}

declare module "roosterjs-editor-api/lib/format/setFontSize" {
    import { IEditor } from "roosterjs-editor-types";
    
    const setFontSize: (editor: IEditor, fontSize: string) => void;
    export default setFontSize;
    export { setFontSize };
}

declare module "roosterjs-editor-api/lib/format/setTextColor" {
    import { IEditor } from "roosterjs-editor-types";
    
    const setTextColor: (editor: IEditor, textColor: string) => void;
    export default setTextColor;
    export { setTextColor };
}

declare module "roosterjs-editor-api/lib/format/setBackgroundColor" {
    import { IEditor } from "roosterjs-editor-types";
    
    const setBackgroundColor: (editor: IEditor, backgroundColor: string) => void;
    export default setBackgroundColor;
    export { setBackgroundColor };
}

declare module "roosterjs-editor-api/lib/format/toggleBullet" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleBullet: (editor: IEditor) => void;
    export default toggleBullet;
    export { toggleBullet };
}

declare module "roosterjs-editor-api/lib/format/toggleNumbering" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleNumbering: (editor: IEditor) => void;
    export default toggleNumbering;
    export { toggleNumbering };
}

declare module "roosterjs-editor-api/lib/format/setIndentation" {
    import { IEditor } from "roosterjs-editor-types";
    
    const setIndentation: (editor: IEditor, indentation: number) => void;
    export default setIndentation;
    export { setIndentation };
}

declare module "roosterjs-editor-api/lib/format/setHeadingLevel" {
    import { IEditor } from "roosterjs-editor-types";
    
    const setHeadingLevel: (editor: IEditor, level: number) => void;
    export default setHeadingLevel;
    export { setHeadingLevel };
}

declare module "roosterjs-editor-api/lib/format/toggleBlockQuote" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleBlockQuote: (editor: IEditor) => void;
    export default toggleBlockQuote;
    export { toggleBlockQuote };
}

declare module "roosterjs-editor-api/lib/format/toggleCodeBlock" {
    import { IEditor } from "roosterjs-editor-types";
    
    const toggleCodeBlock: (editor: IEditor) => void;
    export default toggleCodeBlock;
    export { toggleCodeBlock };
}

declare module "roosterjs-editor-api/lib/format/createLink" {
    import { IEditor } from "roosterjs-editor-types";
    
    const createLink: (editor: IEditor, url: string, text?: string, displayText?: string) => void;
    export default createLink;
    export { createLink };
}

declare module "roosterjs-editor-api/lib/format/insertImage" {
    import { IEditor } from "roosterjs-editor-types";
    
    const insertImage: (editor: IEditor, imageFile: File, altText?: string) => void;
    export default insertImage;
    export { insertImage };
}

declare module "roosterjs-editor-api/lib/format/getFormatState" {
    import { IEditor } from "roosterjs-editor-types";
    
    interface IFormatState {
        isBold: boolean;
        isItalic: boolean;
        isUnderline: boolean;
        isStrikethrough: boolean;
        isSubscript: boolean;
        isSuperscript: boolean;
        fontName: string;
        fontSize: string;
        textColor: string;
        backgroundColor: string;
        alignment: number;
        isBullet: boolean;
        isNumbering: boolean;
        headingLevel: number;
        isBlockQuote: boolean;
        isCodeBlock: boolean;
        canUndo: boolean;
        canRedo: boolean;
    }
    
    const getFormatState: (editor: IEditor) => IFormatState;
    export default getFormatState;
    export { getFormatState };
}

declare module "roosterjs-editor-types/lib/format/Alignment" {
    export enum Alignment {
        Left = 0,
        Center = 1,
        Right = 2
    }
}

declare module "roosterjs-editor-types/lib/format/ClearFormatMode" {
    export enum ClearFormatMode {
        All = 0,
        Inline = 1,
        Block = 2
    }
}

declare module "roosterjs-editor-core/lib/editor/EditorPlugin" {
    import { IEditor } from "roosterjs-editor-types";
    
    export interface EditorPlugin {
        getName(): string;
        initialize(editor: IEditor): void;
        dispose(): void;
        onPluginEvent?(event: any): void;
    }
}

declare module "roosterjs-editor-core/lib/undo/snapshotUtils" {
    import { IEditor } from "roosterjs-editor-types";
    
    export function addUndoSnapshot(editor: IEditor, callback?: () => void): void;
}

declare module "roosterjs-editor-dom/lib/domWalker/getLeafNode" {
    export function getLeafNode(node: Node): Node;
}

declare module "roosterjs-editor-dom/lib/domWalker/getLeafSibling" {
    export function getLeafSibling(node: Node, direction: number): Node;
}

declare module "roosterjs-editor-dom/lib/utils/sanitizeHtml" {
    export function sanitizeHtml(html: string): string;
}

declare module "roosterjs-editor-plugins/lib/Paste/buildClipboardData" {
    export function buildClipboardData(event: ClipboardEvent): any;
}

declare module "roosterjs-editor-plugins/lib/Paste/wordConverter/convertPastedContentFromWord" {
    export function convertPastedContentFromWord(editor: any, clipboardData: any): any;
}

declare module "roosterjs-editor-plugins/lib/Paste/textToHtml" {
    export function textToHtml(text: string): string;
}

declare module "roosterjs-editor-plugins/lib/Paste/getInheritableStyles" {
    export function getInheritableStyles(element: HTMLElement): any;
}

declare module "roosterjs-editor-plugins/lib/DefaultShortcut/DefaultShortcut" {
    import { EditorPlugin } from "roosterjs-editor-core/lib/editor/EditorPlugin";
    
    export default class DefaultShortcut implements EditorPlugin {
        getName(): string;
        initialize(editor: any): void;
        dispose(): void;
    }
}

declare module "roosterjs-editor-plugins/lib/HyperLink/HyperLink" {
    import { EditorPlugin } from "roosterjs-editor-core/lib/editor/EditorPlugin";
    
    export default class HyperLink implements EditorPlugin {
        getName(): string;
        initialize(editor: any): void;
        dispose(): void;
    }
}

declare module "roosterjs-editor-plugins/lib/ContentEdit/ContentEdit" {
    import { EditorPlugin } from "roosterjs-editor-core/lib/editor/EditorPlugin";
    
    export default class ContentEdit implements EditorPlugin {
        getName(): string;
        initialize(editor: any): void;
        dispose(): void;
    }
}

declare module "roosterjs-editor-types/lib/editor/PluginEventType" {
    export enum PluginEventType {
        ContentChanged = 1,
        KeyUp = 2,
        CompositionEnd = 3,
        BeforePaste = 4
    }
}

declare module "roosterjs-editor-types/lib/clipboard/PasteOption" {
    export enum PasteOption {
        PasteHtml = 1,
        PasteText = 2,
        PasteImage = 3
    }
}

declare module "roosterjs-editor-types/lib/editor/ChangeSource" {
    export enum ChangeSource {
        Paste = 1
    }
}

declare module "roosterjs-editor-types/lib/format/DefaultFormat" {
    export interface DefaultFormat {
        fontFamily?: string;
        fontSize?: string;
        textColor?: string;
        backgroundColor?: string;
    }
}

declare module "roosterjs-editor-types/lib/browser/NodeType" {
    export enum NodeType {
        Text = 3
    }
}

declare module "roosterjs-editor-types/lib/editor/PluginEvent" {
    export interface PluginEvent {
        eventType: number;
    }
}

declare module "roosterjs-editor-types/lib/clipboard/BeforePasteEvent" {
    export interface BeforePasteEvent {
        clipboardData: any;
        fragment: DocumentFragment;
    }
}

declare module "roosterjs-editor-types/lib/clipboard/ClipboardData" {
    export interface ClipboardData {
        html?: string;
        text?: string;
        image?: File;
    }
}

// Global type for Editor
declare global {
    interface Editor {
        getContent(): string;
        setContent(content: string): void;
        focus(): void;
        dispose(): void;
    }
} 