import * as React from 'react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { InfoLabel } from '../InfoLabel';
import { InputError } from '../InputError';
import { RichEditorToolbar } from './Toolbar/RichEditorToolbar';
import { ALL_BUTTONS, RichEditorToolbarButtonNames } from './Toolbar/RichEditorToolbarButtonNames';
import { ContentChangedPlugin } from './Plugins/ContentChangedPlugin';
import { Paste } from './Plugins/Paste';
import { RichEditorProps, EditorOptions } from './RichEditor.types';
import { useRichEditor } from './hooks/useRichEditor';
import './RichEditor.scss';

export const RichEditor: React.FC<RichEditorProps> = ({
  value = '',
  delay = 300,
  label,
  info,
  error,
  disabled = false,
  required = false,
  editorOptions,
  onChange,
  className,
  ...props
}) => {
  const contentDivRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const {
    editor,
    isEditorReady,
    editorError,
    initializeEditor,
    disposeEditor,
    setContent,
    focus: focusEditor
  } = useRichEditor(contentDivRef, {
    initialContent: value,
    plugins: useMemo(() => {
      const plugins = [
        new ContentChangedPlugin((newValue: string) => {
          setInternalValue(newValue);
          onChange(newValue);
        })
      ];

      if (editorOptions?.getPastedImageUrl) {
        plugins.push(new Paste(editorOptions.getPastedImageUrl));
      }

      return plugins;
    }, [onChange, editorOptions?.getPastedImageUrl]),
    disabled
  });

  // Initialize editor on mount
  useEffect(() => {
    if (contentDivRef.current && !editor) {
      initializeEditor();
    }

    return () => {
      if (editor) {
        disposeEditor();
      }
    };
  }, [editor, initializeEditor, disposeEditor]);

  // Update content when value prop changes
  useEffect(() => {
    if (editor && isEditorReady && value !== internalValue) {
      setContent(value);
      setInternalValue(value);
    }
  }, [editor, isEditorReady, value, internalValue, setContent]);

  // Handle disabled state changes
  useEffect(() => {
    if (contentDivRef.current) {
      contentDivRef.current.setAttribute('contenteditable', (!disabled).toString());
    }
  }, [disabled]);

  // Debounced change handler
  const debouncedOnChange = useCallback(
    React.useMemo(
      () => {
        let timeoutId: NodeJS.Timeout;
        return (newValue: string) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            onChange(newValue);
          }, delay);
        };
      },
      [onChange, delay]
    ),
    [onChange, delay]
  );

  // Focus handler
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    focusEditor();
  }, [focusEditor]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Toolbar action handlers
  const handleToolbarAction = useCallback((action: string) => {
    if (editor && isEditorReady) {
      switch (action) {
        case 'bold':
          editor.execCommand('bold');
          break;
        case 'italic':
          editor.execCommand('italic');
          break;
        case 'underline':
          editor.execCommand('underline');
          break;
        case 'insertLink':
          const url = prompt('Enter URL:');
          if (url) {
            editor.execCommand('createLink', url);
          }
          break;
        case 'insertImage':
          const imageUrl = prompt('Enter image URL:');
          if (imageUrl) {
            editor.execCommand('insertImage', imageUrl);
          }
          break;
        default:
          console.warn(`Unknown toolbar action: ${action}`);
      }
    }
  }, [editor, isEditorReady]);

  // Render toolbar
  const renderToolbar = useMemo(() => {
    if (!editorOptions?.buttons || editorOptions.buttons.length === 0) {
      return null;
    }

    return (
      <RichEditorToolbar
        buttons={editorOptions.buttons}
        onAction={handleToolbarAction}
        disabled={disabled}
        className="rich-editor-toolbar"
      />
    );
  }, [editorOptions?.buttons, handleToolbarAction, disabled]);

  // Render error message
  const renderError = useMemo(() => {
    if (error || editorError) {
      return (
        <InputError
          error={error || editorError}
          className="rich-editor-error"
        />
      );
    }
    return null;
  }, [error, editorError]);

  return (
    <div className={`rich-editor-container ${className || ''}`} {...props}>
      <Stack gap={8}>
        {/* Label */}
        {label && (
          <Text variant="medium" className="rich-editor-label">
            {label}
            {required && <span className="required-indicator">*</span>}
          </Text>
        )}

        {/* Info */}
        {info && (
          <InfoLabel
            info={info}
            className="rich-editor-info"
          />
        )}

        {/* Editor Container */}
        <div 
          className={`rich-editor-wrapper ${isFocused ? 'focused' : ''} ${disabled ? 'disabled' : ''}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {/* Toolbar */}
          {renderToolbar}

          {/* Content Area */}
          <div
            ref={contentDivRef}
            className="rich-editor-content"
            role="textbox"
            aria-label={label}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? 'rich-editor-error' : undefined}
          />

          {/* Loading State */}
          {!isEditorReady && (
            <div className="rich-editor-loading">
              <Text variant="small">Initializing editor...</Text>
            </div>
          )}
        </div>

        {/* Error Message */}
        {renderError}

        {/* Editor Error */}
        {editorError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            className="rich-editor-error-message"
          >
            <Text variant="small">
              Failed to initialize rich text editor. Please refresh the page and try again.
            </Text>
          </MessageBar>
        )}
      </Stack>
    </div>
  );
};
