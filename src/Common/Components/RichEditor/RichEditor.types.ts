import { RichEditorToolbarButtonNames } from './Toolbar/RichEditorToolbarButtonNames';

export interface RichEditorProps {
  /** The current value of the editor */
  value?: string;
  /** Delay in milliseconds before firing onChange */
  delay?: number;
  /** Label text for the editor */
  label?: string;
  /** Info text to display below the label */
  info?: string;
  /** Error message to display */
  error?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Editor configuration options */
  editorOptions?: EditorOptions;
  /** Callback when the content changes */
  onChange(newValue: string): void;
  /** Additional CSS class name */
  className?: string;
  /** Additional props to pass to the container div */
  [key: string]: any;
}

export interface EditorOptions {
  /** Array of toolbar buttons to show */
  buttons?: RichEditorToolbarButtonNames[];
  /** Function to handle pasted image uploads */
  getPastedImageUrl?(value: string): Promise<string>;
  /** Custom plugins to add to the editor */
  plugins?: any[];
  /** Initial content for the editor */
  initialContent?: string;
  /** Whether to show the toolbar */
  showToolbar?: boolean;
  /** Custom toolbar configuration */
  toolbarConfig?: ToolbarConfig;
}

export interface ToolbarConfig {
  /** Whether to show formatting buttons */
  showFormatting?: boolean;
  /** Whether to show link buttons */
  showLinks?: boolean;
  /** Whether to show image buttons */
  showImages?: boolean;
  /** Whether to show list buttons */
  showLists?: boolean;
  /** Whether to show table buttons */
  showTables?: boolean;
  /** Custom button configurations */
  customButtons?: CustomButtonConfig[];
}

export interface CustomButtonConfig {
  /** Unique identifier for the button */
  id: string;
  /** Display name for the button */
  name: string;
  /** Icon for the button */
  icon?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Whether the button is enabled */
  enabled?: boolean;
  /** Click handler for the button */
  onClick: (editor: any) => void;
}

export interface RichEditorState {
  /** Whether the editor is ready */
  isReady: boolean;
  /** Whether the editor is focused */
  isFocused: boolean;
  /** Whether the editor is loading */
  isLoading: boolean;
  /** Current error state */
  error: string | null;
  /** Current content value */
  value: string;
}

export interface RichEditorRef {
  /** Focus the editor */
  focus(): void;
  /** Blur the editor */
  blur(): void;
  /** Get the current content */
  getContent(): string;
  /** Set the content */
  setContent(content: string): void;
  /** Clear the content */
  clear(): void;
  /** Insert text at cursor position */
  insertText(text: string): void;
  /** Insert HTML at cursor position */
  insertHtml(html: string): void;
  /** Execute a command */
  execCommand(command: string, value?: any): void;
} 