import "../css/SliderControl.scss";

import * as React from "react";
import { useState, useCallback } from "react";
import { Stack } from "@fluentui/react";
import { Slider } from "@fluentui/react/lib/Slider";
import {
    IWorkItemFieldControlProps, IWorkItemFieldControlState, WorkItemFieldControl
} from "Common/Components/VSTS/WorkItemFieldControl";

interface ISliderControlInputs {
    FieldName: string;
    MinValue: string;
    MaxValue: string;
    StepSize: string;
}

interface ISliderControlProps extends IWorkItemFieldControlProps {
    minValue: number;
    maxValue: number;
    stepSize: number;
}

// Modern functional component wrapper
export const SliderControl: React.FC<ISliderControlProps> = (props) => {
  const [value, setValue] = useState<number>(0);

  const handleChange = useCallback((newValue: number) => {
    setValue(parseFloat(newValue.toPrecision(10)));
  }, []);

  return (
    <Stack className="fabric-container">
      <Slider
        className="slider-control"
        value={value}
        min={props.minValue}
        max={props.maxValue}
        step={props.stepSize}
        showValue={false}
        onChange={handleChange}
      />

      <span className="slider-value" title={`${value || 0}`}>
        {value || 0}
      </span>
    </Stack>
  );
};

// Legacy class component for backward compatibility
export class SliderControlClass extends WorkItemFieldControl<number, ISliderControlProps, IWorkItemFieldControlState<number>> {
    public render(): JSX.Element {
        return (
            <div className="fabric-container">
                <Slider
                    className="slider-control"
                    value={this.state.value}
                    min={this.props.minValue}
                    max={this.props.maxValue}
                    step={this.props.stepSize}
                    showValue={false}
                    onChange={this._onChange}
                />

                <span className="slider-value" title={`${this.state.value || 0}`}>
                    {this.state.value || 0}
                </span>
            </div>
        );
    }

    private _onChange = (newValue: number) => {
        this.onValueChanged(parseFloat(newValue.toPrecision(10)));
    };
}

export function init() {
    // Initialize the control
    console.log("SliderControl initialized");
}
