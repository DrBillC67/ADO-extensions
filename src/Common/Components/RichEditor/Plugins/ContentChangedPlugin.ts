import { PluginEvent, PluginEventType } from "roosterjs-editor-types";
import { Editor, EditorPlugin } from "roosterjs-editor-core";

/**
 * Content Changed Plugin, handles content change events and triggers onChange callback
 */
export class ContentChangedPlugin implements EditorPlugin {
    constructor(private _onChange: () => void) {}

    public getName(): string {
        return "ContentChangedPlugin";
    }

    public initialize(_editor: Editor) {
        // no op
    }

    public dispose() {
        // no op
    }

    public onPluginEvent(event: PluginEvent) {
        if (event.eventType === PluginEventType.ContentChanged || event.eventType === PluginEventType.KeyUp || event.eventType === PluginEventType.CompositionEnd) {
            this._onChange();
        }
    }
}
