import * as React from "react";

import { PrimaryButton, DefaultButton } from "OfficeFabric/Button";
import { MessageBar, MessageBarType } from "OfficeFabric/MessageBar";
import { Panel, PanelType } from "OfficeFabric/Panel";
import { Spinner, SpinnerSize } from "OfficeFabric/Spinner";
import { TextField } from "OfficeFabric/TextField";
import { Toggle } from "OfficeFabric/Toggle";
import { ChoiceGroup, IChoiceGroupOption } from "OfficeFabric/ChoiceGroup";
import { Dialog, DialogType, DialogFooter } from "OfficeFabric/Dialog";
import { Label } from "OfficeFabric/Label";
import { Stack } from "OfficeFabric/Stack";
import { Text } from "OfficeFabric/Text";
import { Dropdown, IDropdownOption } from "OfficeFabric/Dropdown";

import { ExportImportDataService, IOneClickExportData, IImportResult, IImportOptions, IExportOptions, ExportType, ExportScope, ITemplateInfo } from "OneClick/DataServices/ExportImportDataService";
import { getCurrentUser } from "Common/Utilities/Identity";

export interface IExportImportPanelProps {
    isOpen: boolean;
    onDismiss: () => void;
    projectId: string;
    projectName: string;
}

export interface IExportImportPanelState {
    isLoading: boolean;
    currentOperation: "export" | "import" | null;
    exportData: IOneClickExportData | null;
    importFile: File | null;
    importOptions: IImportOptions;
    exportOptions: IExportOptions;
    result: IImportResult | null;
    error: string | null;
    showConfirmDialog: boolean;
    confirmDialogTitle: string;
    confirmDialogMessage: string;
    confirmDialogAction: (() => void) | null;
    showExportOptions: boolean;
    showTemplateInfo: boolean;
    templateInfo: ITemplateInfo;
    availableWorkItemTypes: string[];
    selectedWorkItemTypes: string[];
}

export class ExportImportPanel extends React.Component<IExportImportPanelProps, IExportImportPanelState> {
    private fileInputRef: React.RefObject<HTMLInputElement>;

    constructor(props: IExportImportPanelProps) {
        super(props);
        this.state = {
            isLoading: false,
            currentOperation: null,
            exportData: null,
            importFile: null,
            importOptions: {
                generateNewIds: true,
                overwriteExisting: false,
                skipErrors: true
            },
            exportOptions: {
                exportType: ExportType.Full,
                exportScope: ExportScope.All,
                includeVersionHistory: true,
                includeTemplateInfo: false
            },
            result: null,
            error: null,
            showConfirmDialog: false,
            confirmDialogTitle: "",
            confirmDialogMessage: "",
            confirmDialogAction: null,
            showExportOptions: false,
            showTemplateInfo: false,
            templateInfo: {
                templateName: "",
                templateDescription: "",
                templateCategory: "General",
                templateTags: [],
                templateAuthor: getCurrentUser().displayName || getCurrentUser().uniqueName,
                templateVersion: "1.0",
                templateCreatedDate: new Date().toISOString(),
                templateLastModified: new Date().toISOString(),
                templateUsage: 0
            },
            availableWorkItemTypes: ["Bug", "User Story", "Task", "Epic", "Feature", "Issue", "Test Case"],
            selectedWorkItemTypes: []
        };
        this.fileInputRef = React.createRef();
    }

    public render(): JSX.Element {
        const { isOpen, onDismiss } = this.props;
        const { isLoading, currentOperation, exportData, importFile, importOptions, result, error } = this.state;

        return (
            <>
                <Panel
                    isOpen={isOpen}
                    onDismiss={onDismiss}
                    headerText="Export/Import OneClick Settings"
                    type={PanelType.medium}
                    isLightDismiss={false}
                >
                    <div style={{ padding: "20px" }}>
                        {this._renderContent()}
                    </div>
                </Panel>

                {this._renderConfirmDialog()}
            </>
        );
    }

    private _renderContent(): JSX.Element {
        const { isLoading, currentOperation, exportData, importFile, importOptions, result, error } = this.state;

        if (isLoading) {
            return (
                <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
                    <Spinner size={SpinnerSize.large} label={`${currentOperation === "export" ? "Exporting" : "Importing"} OneClick settings...`} />
                </Stack>
            );
        }

        return (
            <Stack tokens={{ childrenGap: 20 }}>
                {error && (
                    <MessageBar messageBarType={MessageBarType.error} onDismiss={this._clearError}>
                        {error}
                    </MessageBar>
                )}

                {result && (
                    <MessageBar 
                        messageBarType={result.success ? MessageBarType.success : MessageBarType.warning}
                        onDismiss={this._clearResult}
                    >
                        {this._renderResultMessage(result)}
                    </MessageBar>
                )}

                {exportData && this._renderExportResults()}

                {!exportData && this._renderMainContent()}
            </Stack>
        );
    }

    private _renderMainContent(): JSX.Element {
        const { importFile, importOptions, exportOptions, showExportOptions, showTemplateInfo } = this.state;

        return (
            <Stack tokens={{ childrenGap: 20 }}>
                <Text variant="large">Export Settings</Text>
                <Text>Export OneClick settings for this project with advanced options.</Text>
                
                <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                    <PrimaryButton 
                        text="Export Settings" 
                        onClick={this._handleExport}
                        iconProps={{ iconName: "Download" }}
                    />
                    <DefaultButton 
                        text="Export Options" 
                        onClick={() => this.setState({ showExportOptions: !showExportOptions })}
                        iconProps={{ iconName: "Settings" }}
                    />
                    <DefaultButton 
                        text="Save as Template" 
                        onClick={() => this.setState({ showTemplateInfo: !showTemplateInfo })}
                        iconProps={{ iconName: "Save" }}
                    />
                </Stack>

                {showExportOptions && this._renderExportOptions()}
                {showTemplateInfo && this._renderTemplateInfo()}

                <hr style={{ border: "none", borderTop: "1px solid #e1e1e1", margin: "20px 0" }} />

                <Text variant="large">Import Settings</Text>
                <Text>Import OneClick settings from a previously exported JSON file.</Text>
                
                <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                    <input
                        ref={this.fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={this._handleFileSelect}
                        style={{ display: "none" }}
                    />
                    <DefaultButton 
                        text="Select File" 
                        onClick={() => this.fileInputRef.current?.click()}
                        iconProps={{ iconName: "OpenFile" }}
                    />
                    {importFile && (
                        <Text style={{ alignSelf: "center" }}>
                            Selected: {importFile.name}
                        </Text>
                    )}
                </Stack>

                {importFile && (
                    <Stack tokens={{ childrenGap: 10 }}>
                        <Text variant="medium">Import Options</Text>
                        
                        <Toggle
                            label="Generate new IDs"
                            checked={importOptions.generateNewIds}
                            onText="Enabled"
                            offText="Disabled"
                            onChange={(_, checked) => this._updateImportOption("generateNewIds", checked)}
                        />
                        <Text variant="small" style={{ color: "#666" }}>
                            Generate new unique IDs for imported items to avoid conflicts
                        </Text>

                        <Toggle
                            label="Overwrite existing items"
                            checked={importOptions.overwriteExisting}
                            onText="Enabled"
                            offText="Disabled"
                            onChange={(_, checked) => this._updateImportOption("overwriteExisting", checked)}
                        />
                        <Text variant="small" style={{ color: "#666" }}>
                            Replace existing rule groups and rules with the same name
                        </Text>

                        <Toggle
                            label="Skip errors and continue"
                            checked={importOptions.skipErrors}
                            onText="Enabled"
                            offText="Disabled"
                            onChange={(_, checked) => this._updateImportOption("skipErrors", checked)}
                        />
                        <Text variant="small" style={{ color: "#666" }}>
                            Continue importing even if some items fail
                        </Text>

                        <Toggle
                            label="Update version history"
                            checked={importOptions.updateVersionHistory}
                            onText="Enabled"
                            offText="Disabled"
                            onChange={(_, checked) => this._updateImportOption("updateVersionHistory", checked)}
                        />
                        <Text variant="small" style={{ color: "#666" }}>
                            Track this import in the project's version history
                        </Text>

                        <PrimaryButton 
                            text="Import Settings" 
                            onClick={this._handleImport}
                            iconProps={{ iconName: "Upload" }}
                            disabled={!importFile}
                        />
                    </Stack>
                )}
            </Stack>
        );
    }

    private _renderExportResults(): JSX.Element {
        const { exportData } = this.state;
        if (!exportData) return null;

        return (
            <Stack tokens={{ childrenGap: 15 }}>
                <Text variant="large">Export Summary</Text>
                
                <Stack tokens={{ childrenGap: 10 }}>
                    <Text><strong>Project:</strong> {exportData.projectName}</Text>
                    <Text><strong>Exported by:</strong> {exportData.exportedBy}</Text>
                    <Text><strong>Export date:</strong> {new Date(exportData.exportDate).toLocaleString()}</Text>
                    <Text><strong>Version:</strong> {exportData.version}</Text>
                </Stack>

                <Stack tokens={{ childrenGap: 10 }}>
                    <Text variant="medium">Data Summary</Text>
                    <Text>• Rule Groups: {exportData.metadata.totalRuleGroups}</Text>
                    <Text>• Global Rules: {exportData.metadata.totalGlobalRules}</Text>
                    <Text>• Work Item Types: {exportData.metadata.totalWorkItemTypes}</Text>
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                    <PrimaryButton 
                        text="Download JSON File" 
                        onClick={this._downloadExportFile}
                        iconProps={{ iconName: "Download" }}
                    />
                    <DefaultButton 
                        text="Export Again" 
                        onClick={this._clearExportData}
                    />
                </Stack>
            </Stack>
        );
    }

    private _renderResultMessage(result: IImportResult): JSX.Element {
        if (result.success) {
            return (
                <div>
                    <Text><strong>Import completed successfully!</strong></Text>
                    <Text>• Imported {result.importedRuleGroups} rule groups</Text>
                    <Text>• Imported {result.importedGlobalRules} global rules</Text>
                    <Text>• Imported {result.importedSettings} work item type settings</Text>
                </div>
            );
        } else {
            return (
                <div>
                    <Text><strong>Import completed with errors:</strong></Text>
                    <Text>• Imported {result.importedRuleGroups} rule groups</Text>
                    <Text>• Imported {result.importedGlobalRules} global rules</Text>
                    <Text>• Imported {result.importedSettings} work item type settings</Text>
                    {result.errors.length > 0 && (
                        <div style={{ marginTop: "10px" }}>
                            <Text variant="small"><strong>Errors:</strong></Text>
                            {result.errors.map((error, index) => (
                                <Text key={index} variant="small" style={{ color: "#d13438" }}>
                                    • {error}
                                </Text>
                            ))}
                        </div>
                    )}
                </div>
            );
        }
    }

    private _renderConfirmDialog(): JSX.Element {
        const { showConfirmDialog, confirmDialogTitle, confirmDialogMessage, confirmDialogAction } = this.state;

        return (
            <Dialog
                hidden={!showConfirmDialog}
                onDismiss={this._hideConfirmDialog}
                dialogContentProps={{
                    type: DialogType.normal,
                    title: confirmDialogTitle,
                    subText: confirmDialogMessage
                }}
            >
                <DialogFooter>
                    <PrimaryButton onClick={this._executeConfirmAction} text="Confirm" />
                    <DefaultButton onClick={this._hideConfirmDialog} text="Cancel" />
                </DialogFooter>
            </Dialog>
        );
    }

    private _handleExport = async (): Promise<void> => {
        this.setState({ isLoading: true, currentOperation: "export", error: null });

        try {
            const { exportOptions, selectedWorkItemTypes, templateInfo } = this.state;
            
            // Prepare export options
            const options: IExportOptions = {
                ...exportOptions,
                selectedWorkItemTypes: exportOptions.exportScope === ExportScope.Custom ? selectedWorkItemTypes : undefined,
                templateInfo: exportOptions.exportType === ExportType.Template ? templateInfo : undefined
            };

            const exportData = await ExportImportDataService.exportSettings(
                this.props.projectId,
                this.props.projectName,
                options
            );

            this.setState({ 
                exportData, 
                isLoading: false, 
                currentOperation: null 
            });
        } catch (error) {
            this.setState({ 
                error: `Export failed: ${error.message}`, 
                isLoading: false, 
                currentOperation: null 
            });
        }
    };

    private _handleImport = async (): Promise<void> => {
        const { importFile, importOptions } = this.state;
        if (!importFile) return;

        this._showConfirmDialog(
            "Confirm Import",
            `Are you sure you want to import OneClick settings? This will affect all work item types in the project.`,
            async () => {
                this.setState({ isLoading: true, currentOperation: "import", error: null });

                try {
                    const fileContent = await this._readFileAsText(importFile);
                    const importData: IOneClickExportData = JSON.parse(fileContent);

                    const result = await ExportImportDataService.importGlobalSettings(
                        importData,
                        this.props.projectId,
                        importOptions
                    );

                    this.setState({ 
                        result, 
                        isLoading: false, 
                        currentOperation: null 
                    });
                } catch (error) {
                    this.setState({ 
                        error: `Import failed: ${error.message}`, 
                        isLoading: false, 
                        currentOperation: null 
                    });
                }
            }
        );
    };

    private _handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            this.setState({ importFile: file, error: null, result: null });
        }
    };

    private _updateImportOption = (key: keyof IImportOptions, value: boolean): void => {
        this.setState(prevState => ({
            importOptions: {
                ...prevState.importOptions,
                [key]: value
            }
        }));
    };

    private _updateExportOption = (key: keyof IExportOptions, value: any): void => {
        this.setState(prevState => ({
            exportOptions: {
                ...prevState.exportOptions,
                [key]: value
            }
        }));
    };

    private _updateTemplateInfo = (key: keyof ITemplateInfo, value: any): void => {
        this.setState(prevState => ({
            templateInfo: {
                ...prevState.templateInfo,
                [key]: value
            }
        }));
    };

    private _toggleWorkItemType = (workItemType: string, checked: boolean): void => {
        this.setState(prevState => ({
            selectedWorkItemTypes: checked 
                ? [...prevState.selectedWorkItemTypes, workItemType]
                : prevState.selectedWorkItemTypes.filter(wit => wit !== workItemType)
        }));
    };

    private _renderExportOptions(): JSX.Element {
        const { exportOptions, availableWorkItemTypes, selectedWorkItemTypes } = this.state;

        const exportTypeOptions: IChoiceGroupOption[] = [
            { key: ExportType.Full, text: 'Full Export', description: 'Export all settings and data' },
            { key: ExportType.Selective, text: 'Selective Export', description: 'Export specific work item types or rule groups' },
            { key: ExportType.Template, text: 'Template Export', description: 'Export as reusable template' },
            { key: ExportType.Backup, text: 'Backup Export', description: 'Export for backup purposes' }
        ];

        const exportScopeOptions: IChoiceGroupOption[] = [
            { key: ExportScope.All, text: 'All Data', description: 'Export everything' },
            { key: ExportScope.WorkItemTypes, text: 'Work Item Types Only', description: 'Export only work item type settings' },
            { key: ExportScope.RuleGroups, text: 'Rule Groups Only', description: 'Export only rule groups and rules' },
            { key: ExportScope.Settings, text: 'Settings Only', description: 'Export only project settings' },
            { key: ExportScope.Custom, text: 'Custom Selection', description: 'Select specific items to export' }
        ];

        return (
            <Stack tokens={{ childrenGap: 15 }} style={{ padding: '15px', border: '1px solid #e1e1e1', borderRadius: '4px' }}>
                <Text variant="medium">Export Options</Text>
                
                <ChoiceGroup
                    label="Export Type"
                    options={exportTypeOptions}
                    selectedKey={exportOptions.exportType}
                    onChange={(_, option) => this._updateExportOption("exportType", option?.key as ExportType)}
                />

                <ChoiceGroup
                    label="Export Scope"
                    options={exportScopeOptions}
                    selectedKey={exportOptions.exportScope}
                    onChange={(_, option) => this._updateExportOption("exportScope", option?.key as ExportScope)}
                />

                {exportOptions.exportScope === ExportScope.Custom && (
                    <Stack tokens={{ childrenGap: 10 }}>
                        <Text variant="small">Select Work Item Types:</Text>
                        {availableWorkItemTypes.map(wit => (
                            <Toggle
                                key={wit}
                                label={wit}
                                checked={selectedWorkItemTypes.includes(wit)}
                                onChange={(_, checked) => this._toggleWorkItemType(wit, checked)}
                            />
                        ))}
                    </Stack>
                )}

                <Toggle
                    label="Include version history"
                    checked={exportOptions.includeVersionHistory}
                    onChange={(_, checked) => this._updateExportOption("includeVersionHistory", checked)}
                />

                <Toggle
                    label="Include template information"
                    checked={exportOptions.includeTemplateInfo}
                    onChange={(_, checked) => this._updateExportOption("includeTemplateInfo", checked)}
                />

                <TextField
                    label="Export Description"
                    multiline
                    rows={3}
                    placeholder="Optional description for this export..."
                    onChange={(_, newValue) => this._updateExportOption("description", newValue)}
                />
            </Stack>
        );
    }

    private _renderTemplateInfo(): JSX.Element {
        const { templateInfo } = this.state;

        const categoryOptions: IDropdownOption[] = [
            { key: 'General', text: 'General' },
            { key: 'Agile', text: 'Agile' },
            { key: 'Scrum', text: 'Scrum' },
            { key: 'Kanban', text: 'Kanban' },
            { key: 'Bug Tracking', text: 'Bug Tracking' },
            { key: 'Feature Management', text: 'Feature Management' }
        ];

        return (
            <Stack tokens={{ childrenGap: 15 }} style={{ padding: '15px', border: '1px solid #e1e1e1', borderRadius: '4px' }}>
                <Text variant="medium">Template Information</Text>
                
                <TextField
                    label="Template Name"
                    value={templateInfo.templateName}
                    onChange={(_, newValue) => this._updateTemplateInfo("templateName", newValue)}
                    required
                />

                <TextField
                    label="Description"
                    multiline
                    rows={3}
                    value={templateInfo.templateDescription}
                    onChange={(_, newValue) => this._updateTemplateInfo("templateDescription", newValue)}
                    placeholder="Describe what this template provides..."
                />

                <Dropdown
                    label="Category"
                    options={categoryOptions}
                    selectedKey={templateInfo.templateCategory}
                    onChange={(_, option) => this._updateTemplateInfo("templateCategory", option?.key as string)}
                />

                <TextField
                    label="Tags (comma-separated)"
                    value={templateInfo.templateTags.join(', ')}
                    onChange={(_, newValue) => this._updateTemplateInfo("templateTags", newValue.split(',').map(t => t.trim()).filter(t => t))}
                    placeholder="agile, scrum, bug-tracking"
                />

                <TextField
                    label="Version"
                    value={templateInfo.templateVersion}
                    onChange={(_, newValue) => this._updateTemplateInfo("templateVersion", newValue)}
                />
            </Stack>
        );
    }

    private _downloadExportFile = (): void => {
        const { exportData } = this.state;
        if (!exportData) return;

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `OneClick-Settings-${this.props.projectName}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    private _readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = (e) => reject(new Error("Failed to read file"));
            reader.readAsText(file);
        });
    };

    private _clearError = (): void => {
        this.setState({ error: null });
    };

    private _clearResult = (): void => {
        this.setState({ result: null });
    };

    private _clearExportData = (): void => {
        this.setState({ exportData: null });
    };

    private _showConfirmDialog = (title: string, message: string, action: () => void): void => {
        this.setState({
            showConfirmDialog: true,
            confirmDialogTitle: title,
            confirmDialogMessage: message,
            confirmDialogAction: action
        });
    };

    private _hideConfirmDialog = (): void => {
        this.setState({
            showConfirmDialog: false,
            confirmDialogTitle: "",
            confirmDialogMessage: "",
            confirmDialogAction: null
        });
    };

    private _executeConfirmAction = (): void => {
        const { confirmDialogAction } = this.state;
        if (confirmDialogAction) {
            confirmDialogAction();
        }
        this._hideConfirmDialog();
    };
} 