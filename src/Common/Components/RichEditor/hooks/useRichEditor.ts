import { useState, useEffect, useRef, useCallback } from 'react';
import { Editor, IEditorOptions as EditorOptions, EditorPlugin } from 'roosterjs-editor-core';
import { ContentEdit, HyperLink } from 'roosterjs-editor-plugins';

export interface UseRichEditorOptions {
  initialContent?: string;
  plugins?: EditorPlugin[];
  disabled?: boolean;
  onContentChange?: (content: string) => void;
  onEditorReady?: (editor: Editor) => void;
  onEditorError?: (error: Error) => void;
}

export interface UseRichEditorReturn {
  editor: Editor | null;
  isEditorReady: boolean;
  editorError: string | null;
  initializeEditor: () => void;
  disposeEditor: () => void;
  setContent: (content: string) => void;
  getContent: () => string;
  focus: () => void;
  blur: () => void;
  execCommand: (command: string, value?: any) => void;
  insertText: (text: string) => void;
  insertHtml: (html: string) => void;
  clear: () => void;
}

export const useRichEditor = (
  contentDivRef: React.RefObject<HTMLDivElement>,
  options: UseRichEditorOptions = {}
): UseRichEditorReturn => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const editorRef = useRef<Editor | null>(null);

  const {
    initialContent = '',
    plugins = [],
    disabled = false,
    onContentChange,
    onEditorReady,
    onEditorError
  } = options;

  // Initialize the editor
  const initializeEditor = useCallback(() => {
    if (!contentDivRef.current || editorRef.current) {
      return;
    }

    try {
      setEditorError(null);

      // Create default plugins
      const defaultPlugins: EditorPlugin[] = [
        new ContentEdit() as any,
        new HyperLink() as any,
        ...plugins
      ];

      // Create editor options
      const editorOptions: EditorOptions = {
        plugins: defaultPlugins,
        initialContent: initialContent
      };

      // Create the editor
      const newEditor = new Editor(contentDivRef.current, editorOptions);
      editorRef.current = newEditor;
      setEditor(newEditor);
      setIsEditorReady(true);

      // Set initial disabled state
      if (disabled) {
        contentDivRef.current.setAttribute('contenteditable', 'false');
      }

      // Call onEditorReady callback
      onEditorReady?.(newEditor);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize editor';
      setEditorError(errorMessage);
      onEditorError?.(error instanceof Error ? error : new Error(errorMessage));
    }
  }, [contentDivRef, plugins, initialContent, disabled, onEditorReady, onEditorError]);

  // Dispose the editor
  const disposeEditor = useCallback(() => {
    if (editorRef.current) {
      try {
        editorRef.current.dispose();
      } catch (error) {
        console.warn('Error disposing editor:', error);
      }
      editorRef.current = null;
      setEditor(null);
      setIsEditorReady(false);
    }
  }, []);

  // Set content
  const setContent = useCallback((content: string) => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.setContent(content);
        onContentChange?.(content);
      } catch (error) {
        console.warn('Error setting content:', error);
      }
    }
  }, [isEditorReady, onContentChange]);

  // Get content
  const getContent = useCallback((): string => {
    if (editorRef.current && isEditorReady) {
      try {
        return editorRef.current.getContent();
      } catch (error) {
        console.warn('Error getting content:', error);
        return '';
      }
    }
    return '';
  }, [isEditorReady]);

  // Focus the editor
  const focus = useCallback(() => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.focus();
      } catch (error) {
        console.warn('Error focusing editor:', error);
      }
    }
  }, [isEditorReady]);

  // Blur the editor
  const blur = useCallback(() => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.blur();
      } catch (error) {
        console.warn('Error blurring editor:', error);
      }
    }
  }, [isEditorReady]);

  // Execute command
  const execCommand = useCallback((command: string, value?: any) => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.execCommand(command, value);
      } catch (error) {
        console.warn('Error executing command:', error);
      }
    }
  }, [isEditorReady]);

  // Insert text
  const insertText = useCallback((text: string) => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.insertNode(document.createTextNode(text));
      } catch (error) {
        console.warn('Error inserting text:', error);
      }
    }
  }, [isEditorReady]);

  // Insert HTML
  const insertHtml = useCallback((html: string) => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.insertNode(editorRef.current.getDocument().createRange().createContextualFragment(html));
      } catch (error) {
        console.warn('Error inserting HTML:', error);
      }
    }
  }, [isEditorReady]);

  // Clear content
  const clear = useCallback(() => {
    if (editorRef.current && isEditorReady) {
      try {
        editorRef.current.setContent('');
        onContentChange?.('');
      } catch (error) {
        console.warn('Error clearing content:', error);
      }
    }
  }, [isEditorReady, onContentChange]);

  // Handle disabled state changes
  useEffect(() => {
    if (contentDivRef.current && editorRef.current) {
      contentDivRef.current.setAttribute('contenteditable', (!disabled).toString());
    }
  }, [disabled, contentDivRef]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disposeEditor();
    };
  }, [disposeEditor]);

  return {
    editor,
    isEditorReady,
    editorError,
    initializeEditor,
    disposeEditor,
    setContent,
    getContent,
    focus,
    blur,
    execCommand,
    insertText,
    insertHtml,
    clear
  };
}; 