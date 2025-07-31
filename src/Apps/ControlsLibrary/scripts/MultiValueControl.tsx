import "../css/MultiValueControl.scss";

import * as React from "react";
import { useState, useCallback } from "react";
import { 
  Stack,
  mergeStyles
} from "@fluentui/react";
import {
    IWorkItemFieldControlProps, IWorkItemFieldControlState, WorkItemFieldControl
} from "Common/Components/VSTS/WorkItemFieldControl";
import { findIndex } from "Common/Utilities/Array";
import { isNullOrWhiteSpace, stringEquals } from "Common/Utilities/String";
import { getFormService } from "Common/Utilities/WorkItemFormHelpers";
import { ValidationState } from "@fluentui/react/lib/components/pickers/BasePicker.types";
import { ITag } from "@fluentui/react/lib/components/pickers/TagPicker/TagPicker";
import { CustomTagPicker } from "./CustomTagPicker";

interface IMultiValueControlInputs {
    FieldName: string;
    Values: string;
}

interface IMultiValueControlProps extends IWorkItemFieldControlProps {
    suggestedValues: string[];
}

interface IMultiValueControlState extends IWorkItemFieldControlState<string> {
    hovered?: boolean;
    focussed?: boolean;
}

// Modern functional component wrapper
export const MultiValueControl: React.FC<IMultiValueControlProps> = (props) => {
  const [hovered, setHovered] = useState(false);
  const [focussed, setFocussed] = useState(false);
  const [value, setValue] = useState<string>("");
  const [isCalloutOpen, setIsCalloutOpen] = useState(false);

  const isActive = hovered || focussed;

  const parseFieldValue = useCallback((fieldValue: string): string[] => {
    if (!isNullOrWhiteSpace(fieldValue)) {
      return fieldValue.split(";").map(v => v.trim());
    } else {
      return [];
    }
  }, []);

  const handleInputKeyDown = useCallback(async (e: React.KeyboardEvent<any>) => {
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      const formService = await getFormService();
      formService.save();
    }
  }, []);

  const handleMouseOver = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseOut = useCallback(() => {
    setHovered(false);
  }, []);

  const handleFocus = useCallback(() => {
    setFocussed(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocussed(false);
  }, []);

  const handleValidateInput = useCallback((inputValue: string): ValidationState => {
    return ValidationState.valid;
  }, []);

  const createGenericItem = useCallback((input: string): any => {
    return {
      key: input,
      name: input
    };
  }, []);

  const getTag = useCallback((tag: string): ITag => {
    return {
      key: tag,
      name: tag
    };
  }, []);

  const getTagText = useCallback((tag: ITag): string => {
    return tag.name;
  }, []);

  const handleTagFilterChanged = useCallback((filterText: string, tagList: ITag[]): ITag[] => {
    const suggestions = props.suggestedValues || [];
    return suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().indexOf(filterText.toLowerCase()) !== -1 &&
        findIndex(tagList, tag => stringEquals(tag.name, suggestion, true)) === -1
      )
      .map(suggestion => getTag(suggestion));
  }, [props.suggestedValues, getTag]);

  const handleChange = useCallback((items: ITag[]) => {
    const newValue = items.map(item => item.name).join(";");
    setValue(newValue);
  }, []);

  const handleToggleCallout = useCallback((on: boolean) => {
    setIsCalloutOpen(on);
  }, []);

  const values = parseFieldValue(value);

  return (
    <Stack>
      <CustomTagPicker
        className={mergeStyles("multi-value-control", { borderless: !isActive })}
        suggestionsListClassName="suggestions-list"
        onToggleCallout={handleToggleCallout}
        selectedItems={(values || []).map(getTag)}
        onResolveSuggestions={handleTagFilterChanged}
        getTextFromItem={getTagText}
        onChange={handleChange}
        createGenericItem={createGenericItem}
        onValidateInput={handleValidateInput}
        inputProps={{
          style: {
            height: "26px"
          },
          onKeyDown: handleInputKeyDown,
          onMouseOver: handleMouseOver,
          onMouseOut: handleMouseOut,
          onFocus: handleFocus,
          onBlur: handleBlur
        }}
        pickerSuggestionsProps={{
          suggestionsHeaderText: "Suggested values",
          noResultsFoundText: "No suggested values. Press enter to select current input."
        }}
      />
    </Stack>
  );
};

// Legacy class component for backward compatibility
export class MultiValueControlClass extends WorkItemFieldControl<string, IMultiValueControlProps, IMultiValueControlState> {
    private _isCalloutOpen: boolean = false;

    public render(): JSX.Element {
        const values = this._parseFieldValue();
        const { hovered, focussed } = this.state;
        const isActive = hovered || focussed;
        return (
            <div>
                <CustomTagPicker
                    className={`multi-value-control ${!isActive ? 'borderless' : ''}`}
                    suggestionsListClassName="suggestions-list"
                    onToggleCallout={this._onToggleCallout}
                    selectedItems={(values || []).map(this._getTag)}
                    onResolveSuggestions={this._onTagFilterChanged}
                    getTextFromItem={this._getTagText}
                    onChange={this._onChange}
                    createGenericItem={this._createGenericItem}
                    onValidateInput={this._onValidateInput}
                    inputProps={{
                        style: {
                            height: "26px"
                        },
                        onKeyDown: this._onInputKeyDown,
                        onMouseOver: this._onMouseOver,
                        onMouseOut: this._onMouseOut,
                        onFocus: this._onFocus,
                        onBlur: this._onBlur
                    }}
                    pickerSuggestionsProps={{
                        suggestionsHeaderText: "Suggested values",
                        noResultsFoundText: "No suggested values. Press enter to select current input."
                    }}
                />
            </div>
        );
    }

    private _parseFieldValue(): string[] {
        const value = this.state.value;
        if (!isNullOrWhiteSpace(value)) {
            return value.split(";").map(v => v.trim());
        } else {
            return [];
        }
    }

    private _onInputKeyDown = async (e: React.KeyboardEvent<any>) => {
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            const formService = await getFormService();
            formService.save();
        }
    };

    private _onMouseOver = () => {
        this.setState({ hovered: true });
    };

    private _onMouseOut = () => {
        this.setState({ hovered: false });
    };

    private _onFocus = () => {
        this.setState({ focussed: true });
    };

    private _onBlur = () => {
        this.setState({ focussed: false });
    };

    private _onValidateInput = (value: string): ValidationState => {
        return ValidationState.valid;
    };

    private _createGenericItem = (input: string): any => {
        return {
            key: input,
            name: input
        };
    };

    private _getTag = (tag: string): ITag => {
        return {
            key: tag,
            name: tag
        };
    };

    private _getTagText = (tag: ITag): string => {
        return tag.name;
    };

    private _onTagFilterChanged = (filterText: string, tagList: ITag[]): ITag[] => {
        const suggestions = this.props.suggestedValues || [];
        return suggestions
            .filter(suggestion => 
                suggestion.toLowerCase().indexOf(filterText.toLowerCase()) !== -1 &&
                findIndex(tagList, tag => stringEquals(tag.name, suggestion, true)) === -1
            )
            .map(suggestion => this._getTag(suggestion));
    };

    private _onChange = (items: ITag[]) => {
        const value = items.map(item => item.name).join(";");
        this.onValueChanged(value);
    };

    private _onToggleCallout = (on: boolean) => {
        this._isCalloutOpen = on;
    };
}

export function init() {
    // Initialize the control
    console.log("MultiValueControl initialized");
}
