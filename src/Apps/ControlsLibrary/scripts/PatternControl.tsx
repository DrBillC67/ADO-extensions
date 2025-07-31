import "../css/PatternControl.scss";

import * as React from "react";
import { useState, useCallback } from "react";
import { 
  TextField, 
  Stack,
  mergeStyles
} from "@fluentui/react";
import {
    IWorkItemFieldControlProps, IWorkItemFieldControlState, WorkItemFieldControl
} from "Common/Components/VSTS/WorkItemFieldControl";
import { getFormService } from "Common/Utilities/WorkItemFormHelpers";

interface IPatternControlInputs {
    FieldName: string;
    Pattern: string;
    ErrorMessage?: string;
}

interface IPatternControlProps extends IWorkItemFieldControlProps {
    pattern: string;
    errorMessage: string;
}

interface IPatternControlState extends IWorkItemFieldControlState<string> {
    hovered?: boolean;
    focussed?: boolean;
}

// Modern functional component wrapper
export const PatternControl: React.FC<IPatternControlProps> = (props) => {
  const [hovered, setHovered] = useState(false);
  const [focussed, setFocussed] = useState(false);
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const isActive = hovered || focussed || error;

  const validatePattern = useCallback((inputValue: string) => {
    if (inputValue && props.pattern) {
      try {
        const patt = new RegExp(props.pattern);
        const isValid = patt.test(inputValue);
        const errorMessage = isValid ? "" : props.errorMessage;
        setError(errorMessage);
        return errorMessage;
      } catch (e) {
        setError("Invalid pattern");
        return "Invalid pattern";
      }
    } else {
      setError("");
      return "";
    }
  }, [props.pattern, props.errorMessage]);

  const setWorkItemFormError = useCallback(async (errorMessage: string) => {
    try {
      const service: any = await getFormService();
      if (errorMessage) {
        service.setError(errorMessage);
      } else {
        service.clearError();
      }
    } catch (e) {
      console.warn("Failed to set form error:", e);
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

  const handleChange = useCallback((event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    const inputValue = newValue || (event.target as HTMLInputElement).value;
    setValue(inputValue);
    const errorMessage = validatePattern(inputValue);
    setWorkItemFormError(errorMessage);
  }, [validatePattern, setWorkItemFormError]);

  return (
    <Stack className="fabric-container">
      <TextField
        className={mergeStyles("pattern-control", { invalid: !!error })}
        value={value}
        borderless={!isActive}
        onChange={handleChange}
        onKeyDown={handleInputKeyDown}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        errorMessage={error}
      />
    </Stack>
  );
};

// Legacy class component for backward compatibility
export class PatternControlClass extends WorkItemFieldControl<string, IPatternControlProps, IPatternControlState> {
    public render(): JSX.Element {
        const { value, hovered, focussed, error } = this.state;
        const isActive = hovered || focussed || error;
        return (
            <div className="fabric-container">
                <TextField
                    className={`pattern-control ${error ? 'invalid' : ''}`}
                    value={value || ""}
                    borderless={!isActive}
                    onChange={this._onChange}
                    onKeyDown={this._onInputKeyDown}
                    onMouseOver={this._onMouseOver}
                    onMouseOut={this._onMouseOut}
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    errorMessage={error}
                />
            </div>
        );
    }

    protected getErrorMessage(value: string): string {
        let error = "";
        if (value) {
            try {
                const patt = new RegExp(this.props.pattern);
                error = patt.test(value) ? "" : this.props.errorMessage;
            } catch (e) {
                error = "Invalid pattern";
            }
        }
        this._setWorkItemFormError(error);
        return error;
    }

    private async _setWorkItemFormError(error: string) {
        try {
            const service: any = await getFormService();
            if (error) {
                service.setError(error);
            } else {
                service.clearError();
            }
        } catch (e) {
            console.warn("Failed to set form error:", e);
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

    private _onChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        const value = newValue || (event.target as HTMLInputElement).value;
        this.onValueChanged(value);
    };
}

export function init() {
    // Initialize the control
    console.log("PatternControl initialized");
}
