import * as React from "react";
import { TextField, Link, IconButton, TooltipHost, DirectionalHint } from "@fluentui/react";
import { InfoIcon } from "@fluentui/react-icons";
import { SupportedMacros, DevOpsMacros } from "../../Constants";

export interface MacroHelpPanelProps {
    className?: string;
}

export const MacroHelpPanel: React.FC<MacroHelpPanelProps> = ({ className }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`macro-help-panel ${className || ""}`}>
            <div className="macro-help-header" onClick={toggleExpanded}>
                <h3>Available Macros</h3>
                <IconButton
                    iconProps={{ iconName: isExpanded ? "ChevronUp" : "ChevronDown" }}
                    onClick={toggleExpanded}
                    ariaLabel={isExpanded ? "Collapse macro help" : "Expand macro help"}
                />
            </div>
            
            {isExpanded && (
                <div className="macro-help-content">
                    <div className="macro-section">
                        <h4>User Macros</h4>
                        <ul>
                            <li>
                                <strong>@Me</strong> - Current user name
                                <div className="macro-example">Example: Set "Assigned To" to @Me</div>
                            </li>
                            <li>
                                <strong>@FieldValue=FieldName</strong> - Value of specified field
                                <div className="macro-example">Example: @FieldValue=System.CreatedBy</div>
                            </li>
                        </ul>
                    </div>

                    <div className="macro-section">
                        <h4>Date Macros</h4>
                        <ul>
                            <li>
                                <strong>@Today</strong> - Current date (supports @today-2, @today+3)
                                <div className="macro-example">Examples: @Today, @Today-1, @Today+7</div>
                            </li>
                            <li>
                                <strong>@StartOfDay</strong> - Start of current day (supports @startofday-1, @startofday+2)
                                <div className="macro-example">Examples: @StartOfDay, @StartOfDay-1, @StartOfDay+1</div>
                            </li>
                            <li>
                                <strong>@StartOfMonth</strong> - Start of current month (supports @startofmonth-1, @startofmonth+2)
                                <div className="macro-example">Examples: @StartOfMonth, @StartOfMonth+1 (next month)</div>
                            </li>
                            <li>
                                <strong>@StartOfYear</strong> - Start of current year (supports @startofyear-1, @startofyear+2)
                                <div className="macro-example">Examples: @StartOfYear, @StartOfYear+1 (next year)</div>
                            </li>
                        </ul>
                    </div>

                    <div className="macro-section">
                        <h4>DevOps Context Macros</h4>
                        <ul>
                            <li>
                                <strong>@CurrentIteration</strong> - Current team iteration path
                                <div className="macro-example">Example: Set "Iteration Path" to @CurrentIteration</div>
                            </li>
                            <li>
                                <strong>@CurrentSprint</strong> - Current team sprint name
                                <div className="macro-example">Example: Set "Sprint" field to @CurrentSprint</div>
                            </li>
                        </ul>
                    </div>

                    <div className="macro-section">
                        <h4>Trigger Macros</h4>
                        <ul>
                            <li>
                                <strong>@Any</strong> - Matches any value (for triggers only)
                                <div className="macro-example">Example: Trigger when field changes from @Any to "Active"</div>
                            </li>
                        </ul>
                    </div>

                    <div className="macro-section">
                        <h4>Usage Tips</h4>
                        <ul>
                            <li>Macros are case-insensitive: @today, @Today, @TODAY all work</li>
                            <li>Date macros support arithmetic: + for future, - for past</li>
                            <li>DevOps macros automatically adapt to your team context</li>
                            <li>If a macro fails to resolve, the original text is used as fallback</li>
                        </ul>
                    </div>

                    <div className="macro-section">
                        <h4>Common Use Cases</h4>
                        <div className="use-case-examples">
                            <div className="use-case">
                                <strong>Set iteration automatically:</strong>
                                <code>@CurrentIteration</code>
                            </div>
                            <div className="use-case">
                                <strong>Set start date to beginning of month:</strong>
                                <code>@StartOfMonth</code>
                            </div>
                            <div className="use-case">
                                <strong>Set due date to end of current month:</strong>
                                <code>@StartOfMonth+1-1</code>
                            </div>
                            <div className="use-case">
                                <strong>Assign to current user:</strong>
                                <code>@Me</code>
                            </div>
                            <div className="use-case">
                                <strong>Copy value from another field:</strong>
                                <code>@FieldValue=System.CreatedBy</code>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MacroHelpPanel; 