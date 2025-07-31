import "../css/PlainTextControl.scss";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Stack } from "@fluentui/react";
import { AutoResizableComponent } from "Common/Components/Utilities/AutoResizableComponent";
import { first } from "Common/Utilities/Array";
import { isNullOrWhiteSpace, stringEquals } from "Common/Utilities/String";
import { getFormService } from "Common/Utilities/WorkItemFormHelpers";
import * as MarkdownIt from "markdown-it";
import {
    IWorkItemChangedArgs, IWorkItemLoadedArgs, IWorkItemNotificationListener
} from "TFS/WorkItemTracking/ExtensionContracts";

interface IPlainTextControlInputs {
    Text: string;
    MaxHeight: number;
}

interface IPlainTextControlProps {
    text: string;
    maxHeight: number;
}

interface IPlainTextControlState {
    translatedText: string;
}

function unescape(html: string): string {
    // tslint:disable-next-line:quotemark
    return html.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

async function processString(str: string): Promise<string> {
    if (isNullOrWhiteSpace(str)) {
        return str;
    }

    const fieldValueRegex = /\${@fieldValue=\w[\w\s\d]*\w}/gi;
    const matches = str.match(fieldValueRegex);
    if (matches && matches.length > 0) {
        let returnStr = str;
        const fieldValues = await Promise.all(
            matches.map(m => {
                const fieldName = m
                    // tslint:disable-next-line:no-invalid-template-strings
                    .replace("${@fieldValue=", "")
                    .replace("}", "")
                    .trim();
                return getFieldValue(fieldName);
            })
        );

        matches.forEach((m, i) => {
            const fieldValue = fieldValues[i] || "";
            returnStr = returnStr.replace(m, fieldValue.toString());
        });

        return returnStr;
    } else {
        return str;
    }
}

async function getFieldValue(fieldName: string): Promise<any> {
    const formService = await getFormService();
    if (stringEquals(fieldName, "id", true)) {
        return formService.getId();
    }
    try {
        const fields = await formService.getFields();
        const field = first(fields, f => {
            return stringEquals(f.name, fieldName, true) || stringEquals(f.referenceName, fieldName, true);
        });

        if (field) {
            return await formService.getFieldValue(field.referenceName);
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

// Modern functional component wrapper
export const PlainTextControl: React.FC<IPlainTextControlProps> = (props) => {
  const [translatedText, setTranslatedText] = useState<string>("");
  const [markdown] = useState(() => new MarkdownIt({ linkify: true }));

  const setText = useCallback(async () => {
    try {
      const processedText = await processString(props.text);
      const html = markdown.render(processedText);
      setTranslatedText(unescape(html));
    } catch (error) {
      console.warn("Failed to process text:", error);
      setTranslatedText(props.text || "");
    }
  }, [props.text, markdown]);

  useEffect(() => {
    setText();
  }, [setText]);

  return (
    <Stack className="plain-text-control">
      <div 
        className="markdown-content"
        style={{ maxHeight: props.maxHeight }}
        dangerouslySetInnerHTML={{ __html: translatedText }}
      />
    </Stack>
  );
};

// Legacy class component for backward compatibility
export class PlainTextControlClass extends AutoResizableComponent<IPlainTextControlProps, IPlainTextControlState> {
    private _markdown: MarkdownIt.MarkdownIt;

    constructor(props: IPlainTextControlProps, context?: any) {
        super(props, context);
        this.state = { translatedText: null };
        this._markdown = new MarkdownIt({
            linkify: true
        });

        // Remember old renderer, if overriden, or proxy to default renderer
        const defaultRender = (tokens, idx, options, _env, self) => {
            return self.renderToken(tokens, idx, options);
        };

        this._markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            const hrefIndex = token.attrIndex("href");
            if (hrefIndex >= 0) {
                const href = token.attrs[hrefIndex][1];
                if (href && href.startsWith("http")) {
                    token.attrPush(["target", "_blank"]);
                    token.attrPush(["rel", "noopener noreferrer"]);
                }
            }
            return defaultRender(tokens, idx, options, env, self);
        };
    }

    public render(): JSX.Element {
        return (
            <div className="plain-text-control">
                <div 
                    className="markdown-content"
                    style={{ maxHeight: this.props.maxHeight }}
                    dangerouslySetInnerHTML={{ __html: this.state.translatedText }}
                />
            </div>
        );
    }

    public componentDidMount() {
        this._setText();
    }

    public componentWillUnmount() {
        // Cleanup if needed
    }

    private async _setText() {
        try {
            const processedText = await processString(this.props.text);
            const html = this._markdown.render(processedText);
            this.setState({ translatedText: unescape(html) });
        } catch (error) {
            console.warn("Failed to process text:", error);
            this.setState({ translatedText: this.props.text || "" });
        }
    }
}

export function init() {
    // Initialize the control
    console.log("PlainTextControl initialized");
}
