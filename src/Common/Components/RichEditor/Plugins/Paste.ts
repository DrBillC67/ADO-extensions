import { onImageAdd } from "Common/Components/RichEditor/Toolbar/Buttons";
import { PluginEvent, PluginEventType } from "roosterjs-editor-types";
import { Editor, EditorPlugin } from "roosterjs-editor-core";

/**
 * Paste plugin, handles onPaste event and paste content into editor
 */
export class Paste implements EditorPlugin {
    private _editor: Editor;
    private _pasteDisposer: () => void;

    /**
     * Create an instance of Paste
     */
    constructor(private _getPastedImageUrl: (data: string) => Promise<string>) {}

    public getName(): string {
        return "Paste";
    }

    public initialize(editor: Editor) {
        this._editor = editor;
        this._pasteDisposer = editor.addDomEventHandler("paste", this._onPaste);
    }

    public dispose() {
        if (this._pasteDisposer) {
            this._pasteDisposer();
            this._pasteDisposer = null;
        }
        this._editor = null;
    }

    public onPluginEvent(event: PluginEvent) {
        // Handle paste events if needed
        if (event.eventType === PluginEventType.BeforePaste) {
            // Handle before paste event
        }
    }

    /**
     * Paste into editor using passed in clipboardData with original format
     * @param clipboardData The clipboardData to paste
     */
    public pasteOriginal(clipboardData: any) {
        this._paste(clipboardData, "html");
    }

    /**
     * Paste plain text into editor using passed in clipboardData
     * @param clipboardData The clipboardData to paste
     */
    public pasteText(clipboardData: any) {
        this._paste(clipboardData, "text");
    }

    /**
     * Paste into editor using passed in clipboardData with current format
     * @param clipboardData The clipboardData to paste
     */
    public pasteAndMergeFormat(clipboardData: any) {
        this._paste(clipboardData, "html", true);
    }

    private _onPaste = (event: Event) => {
        this._editor.addUndoSnapshot();
        
        // Simplified paste handling for RoosterJS 8.x
        const clipboardEvent = event as ClipboardEvent;
        const clipboardData = clipboardEvent.clipboardData;
        
        if (clipboardData) {
            const html = clipboardData.getData("text/html");
            const text = clipboardData.getData("text/plain");
            
            if (html) {
                // Use the paste method from the editor
                this._editor.paste({ html }, false, false);
            } else if (text) {
                // Use the paste method from the editor
                this._editor.paste({ text }, true, false);
            }
            
            this._editor.addUndoSnapshot();
        }
    };

    private _paste(clipboardData: any, pasteOption: string, mergeCurrentFormat?: boolean) {
        if (!this._editor) {
            return;
        }

        this._editor.addUndoSnapshot();
        
        if (pasteOption === "html" && clipboardData.html) {
            this._editor.paste({ html: clipboardData.html }, false, mergeCurrentFormat || false);
        } else if (pasteOption === "text" && clipboardData.text) {
            this._editor.paste({ text: clipboardData.text }, true, false);
        } else if (clipboardData.image) {
            onImageAdd(this._editor, clipboardData.image, this._getPastedImageUrl);
        }
        
        this._editor.addUndoSnapshot();
    }
}
