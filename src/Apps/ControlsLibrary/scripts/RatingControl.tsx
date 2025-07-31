import "../css/RatingControl.scss";

import * as React from "react";
import { useState, useCallback } from "react";
import { Stack } from "@fluentui/react";
import { Rating, RatingSize } from "@fluentui/react/lib/Rating";
import {
    IWorkItemFieldControlProps, IWorkItemFieldControlState, WorkItemFieldControl
} from "Common/Components/VSTS/WorkItemFieldControl";

interface IRatingControlInputs {
    FieldName: string;
    MinValue: string;
    MaxValue: string;
}

interface IRatingControlProps extends IWorkItemFieldControlProps {
    minValue: number;
    maxValue: number;
}

// Modern functional component wrapper
export const RatingControl: React.FC<IRatingControlProps> = (props) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = useCallback((newValue: number) => {
    setValue(newValue);
  }, []);

  return (
    <Stack className="fabric-container">
      <Rating 
        className="rating-control" 
        rating={value} 
        min={props.minValue} 
        max={props.maxValue} 
        size={RatingSize.Large} 
        onChanged={handleChange} 
      />
    </Stack>
  );
};

// Legacy class component for backward compatibility
export class RatingControlClass extends WorkItemFieldControl<number, IRatingControlProps, IWorkItemFieldControlState<number>> {
    public render(): JSX.Element {
        const className = "rating-control";

        return (
            <div className="fabric-container">
                <Rating 
                    className={className} 
                    rating={this.state.value} 
                    min={this.props.minValue} 
                    max={this.props.maxValue} 
                    size={RatingSize.Large} 
                    onChanged={this._onChange} 
                />
            </div>
        );
    }

    private _onChange = (newValue: number) => {
        this.onValueChanged(newValue);
    };
}

export function init() {
    // Initialize the control
    console.log("RatingControl initialized");
}
