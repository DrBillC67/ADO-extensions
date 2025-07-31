import "../css/DateTimeControl.scss";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { 
  TextField, 
  IconButton, 
  Stack,
  mergeStyles
} from "@fluentui/react";
import { 
  CalendarRegular,
  DismissRegular
} from "@fluentui/react-icons";
import { DateTimePicker } from "Common/Components/DateTimePicker";
import {
    IWorkItemFieldControlProps, IWorkItemFieldControlState, WorkItemFieldControl
} from "Common/Components/VSTS/WorkItemFieldControl";
import { getFormService } from "Common/Utilities/WorkItemFormHelpers";
import { format } from "date-fns";

interface IDateTimeControlInputs {
    FieldName: string;
}

interface IDateTimeControlProps extends IWorkItemFieldControlProps {
    fieldName: string;
}

interface IDateTimeControlState extends IWorkItemFieldControlState<Date> {
    expanded?: boolean;
    hovered?: boolean;
    focussed?: boolean;
}

// Modern functional component wrapper
export const DateTimeControl: React.FC<IDateTimeControlProps> = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focussed, setFocussed] = useState(false);
  const [value, setValue] = useState<Date | undefined>(undefined);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isActive = hovered || focussed || expanded;

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

  const toggleCalendar = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  const clearValue = useCallback(() => {
    setValue(undefined);
    setExpanded(false);
  }, []);

  const handleSelectDate = useCallback((newDate: Date) => {
    setValue(newDate);
    setExpanded(false);
  }, []);

  return (
    <Stack className="date-time-control">
      <div 
        className={mergeStyles("date-time-picker-input-container", { borderless: !isActive })}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <TextField
          type="text"
          spellCheck={false}
          autoComplete="off"
          readOnly={true}
          className="date-time-picker-input"
          value={value ? format(value, "M/D/YYYY hh:mm A") : ""}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {value && (
          <IconButton
            icon={<DismissRegular />}
            className="date-time-picker-icon clear-icon"
            onClick={clearValue}
          />
        )}
        <IconButton
          icon={<CalendarRegular />}
          className="date-time-picker-icon"
          onClick={toggleCalendar}
        />
      </div>
      {expanded && (
        <div className="arrow-box">
          <DateTimePicker 
            onSelectDate={handleSelectDate} 
            today={today} 
            value={value || today} 
          />
        </div>
      )}
      {expanded && <div style={{ clear: "both" }} />}
    </Stack>
  );
};

// Legacy class component for backward compatibility
export class DateTimeControlClass extends WorkItemFieldControl<Date, IWorkItemFieldControlProps, IDateTimeControlState> {
    constructor(props: IWorkItemFieldControlProps) {
        super(props);

        this.state = {
            expanded: false
        };
    }

    public render(): JSX.Element {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { value, expanded, hovered, focussed } = this.state;
        const isActive = hovered || focussed || expanded;

        return (
            <div className="date-time-control">
                <div className={`date-time-picker-input-container ${!isActive ? 'borderless' : ''}`} onMouseOver={this._onMouseOver} onMouseOut={this._onMouseOut}>
                    <input
                        type="text"
                        spellCheck={false}
                        autoComplete="off"
                        readOnly={true}
                        className="date-time-picker-input"
                        value={value ? format(value, "M/D/YYYY hh:mm A") : ""}
                        onKeyDown={this._onInputKeyDown}
                        onFocus={this._onFocus}
                        onBlur={this._onBlur}
                    />
                    {value && (
                        <IconButton
                            icon={<DismissRegular />}
                            className="date-time-picker-icon clear-icon"
                            onClick={this._clearValue}
                        />
                    )}
                    <IconButton
                        icon={<CalendarRegular />}
                        className="date-time-picker-icon"
                        onClick={this._toggleCalendar}
                    />
                </div>
                {expanded && (
                    <div className="arrow-box">
                        <DateTimePicker onSelectDate={this._onSelectDate} today={today} value={value || today} />
                    </div>
                )}
                {expanded && <div style={{ clear: "both" }} />}
            </div>
        );
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

    private _toggleCalendar = () => {
        this.setState({ expanded: !this.state.expanded });
    };

    private _clearValue = () => {
        this.onValueChanged(undefined);
        this.setState({ expanded: false });
    };

    private _onSelectDate = (newDate: Date) => {
        this.onValueChanged(newDate);
        this.setState({ expanded: false });
    };
}

export function init() {
    // Initialize the control
    console.log("DateTimeControl initialized");
}
