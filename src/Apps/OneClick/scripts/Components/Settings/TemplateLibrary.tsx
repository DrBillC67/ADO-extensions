import * as React from "react";

import { PrimaryButton, DefaultButton, IconButton } from "OfficeFabric/Button";
import { MessageBar, MessageBarType } from "OfficeFabric/MessageBar";
import { Panel, PanelType } from "OfficeFabric/Panel";
import { Spinner, SpinnerSize } from "OfficeFabric/Spinner";
import { TextField } from "OfficeFabric/TextField";
import { ChoiceGroup, IChoiceGroupOption } from "OfficeFabric/ChoiceGroup";
import { Dialog, DialogType, DialogFooter } from "OfficeFabric/Dialog";
import { Label } from "OfficeFabric/Label";
import { Stack } from "OfficeFabric/Stack";
import { Text } from "OfficeFabric/Text";
import { SearchBox } from "OfficeFabric/SearchBox";
import { DetailsList, IColumn, SelectionMode } from "OfficeFabric/DetailsList";
import { Rating, RatingSize } from "OfficeFabric/Rating";
import { TagPicker, ITag } from "OfficeFabric/Pickers";
import { Toggle } from "OfficeFabric/Toggle";
import { Dropdown, IDropdownOption } from "OfficeFabric/Dropdown";

import { ExportImportDataService, IOneClickExportData, ITemplateInfo, ITemplateSearchCriteria, ExportType, ExportScope } from "OneClick/DataServices/ExportImportDataService";

export interface ITemplateLibraryProps {
    isOpen: boolean;
    onDismiss: () => void;
    projectId: string;
    projectName: string;
    onTemplateSelected: (template: IOneClickExportData) => void;
}

export interface ITemplateLibraryState {
    isLoading: boolean;
    templates: IOneClickExportData[];
    filteredTemplates: IOneClickExportData[];
    searchCriteria: ITemplateSearchCriteria;
    selectedTemplate: IOneClickExportData | null;
    showTemplateDetails: boolean;
    showImportDialog: boolean;
    importOptions: {
        generateNewIds: boolean;
        overwriteExisting: boolean;
        skipErrors: boolean;
        updateVersionHistory: boolean;
    };
    error: string | null;
    success: string | null;
}

export class TemplateLibrary extends React.Component<ITemplateLibraryProps, ITemplateLibraryState> {
    private _columns: IColumn[];

    constructor(props: ITemplateLibraryProps) {
        super(props);
        this.state = {
            isLoading: false,
            templates: [],
            filteredTemplates: [],
            searchCriteria: {},
            selectedTemplate: null,
            showTemplateDetails: false,
            showImportDialog: false,
            importOptions: {
                generateNewIds: true,
                overwriteExisting: false,
                skipErrors: true,
                updateVersionHistory: true
            },
            error: null,
            success: null
        };

        this._columns = [
            {
                key: 'templateName',
                name: 'Template Name',
                fieldName: 'templateName',
                minWidth: 200,
                maxWidth: 300,
                isResizable: true,
                onRender: (item: IOneClickExportData) => (
                    <div>
                        <Text variant="medium" style={{ fontWeight: 'bold' }}>
                            {item.templateInfo?.templateName || 'Untitled Template'}
                        </Text>
                        <Text variant="small" style={{ color: '#666' }}>
                            by {item.templateInfo?.templateAuthor || 'Unknown'}
                        </Text>
                    </div>
                )
            },
            {
                key: 'category',
                name: 'Category',
                fieldName: 'category',
                minWidth: 120,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: IOneClickExportData) => (
                    <Text>{item.templateInfo?.templateCategory || 'General'}</Text>
                )
            },
            {
                key: 'workItemTypes',
                name: 'Work Item Types',
                fieldName: 'workItemTypes',
                minWidth: 150,
                maxWidth: 200,
                isResizable: true,
                onRender: (item: IOneClickExportData) => (
                    <Text>
                        {item.metadata.selectedWorkItemTypes?.join(', ') || 'All'}
                    </Text>
                )
            },
            {
                key: 'rating',
                name: 'Rating',
                fieldName: 'rating',
                minWidth: 100,
                maxWidth: 120,
                isResizable: true,
                onRender: (item: IOneClickExportData) => (
                    <Rating
                        rating={item.templateInfo?.templateRating || 0}
                        max={5}
                        size={RatingSize.Small}
                        readOnly
                    />
                )
            },
            {
                key: 'usage',
                name: 'Usage',
                fieldName: 'usage',
                minWidth: 80,
                maxWidth: 100,
                isResizable: true,
                onRender: (item: IOneClickExportData) => (
                    <Text>{item.templateInfo?.templateUsage || 0}</Text>
                )
            },
            {
                key: 'actions',
                name: 'Actions',
                fieldName: 'actions',
                minWidth: 120,
                maxWidth: 150,
                isResizable: true,
                onRender: (item: IOneClickExportData) => (
                    <Stack horizontal tokens={{ childrenGap: 8 } as any}>
                        <IconButton
                            iconProps={{ iconName: 'Info' }}
                            title="View Details"
                            onClick={() => this._showTemplateDetails(item)}
                        />
                        <IconButton
                            iconProps={{ iconName: 'Download' }}
                            title="Use Template"
                            onClick={() => this._useTemplate(item)}
                        />
                    </Stack>
                )
            }
        ];
    }

    public componentDidMount(): void {
        this._loadTemplates();
    }

    public render(): JSX.Element {
        const { isOpen, onDismiss } = this.props;
        const { 
            isLoading, 
            filteredTemplates, 
            selectedTemplate, 
            showTemplateDetails, 
            showImportDialog,
            importOptions,
            error,
            success
        } = this.state;

        return (
            <>
                <Panel
                    isOpen={isOpen}
                    onDismiss={onDismiss}
                    headerText="OneClick Template Library"
                    type={PanelType.large}
                    isLightDismiss={false}
                >
                    <div style={{ padding: "20px" }}>
                        {this._renderContent()}
                    </div>
                </Panel>

                {showTemplateDetails && selectedTemplate && this._renderTemplateDetails()}
                {showImportDialog && selectedTemplate && this._renderImportDialog()}
            </>
        );
    }

    private _renderContent(): JSX.Element {
        const { isLoading, filteredTemplates, error, success } = this.state;

        if (isLoading) {
            return (
                <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
                    <Spinner size={SpinnerSize.large} label="Loading template library..." />
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

                {success && (
                    <MessageBar messageBarType={MessageBarType.success} onDismiss={this._clearSuccess}>
                        {success}
                    </MessageBar>
                )}

                {this._renderSearchFilters()}
                {this._renderTemplateList()}
            </Stack>
        );
    }

    private _renderSearchFilters(): JSX.Element {
        const { searchCriteria } = this.state;

        const categoryOptions: IDropdownOption[] = [
            { key: '', text: 'All Categories' },
            { key: 'Agile', text: 'Agile' },
            { key: 'Scrum', text: 'Scrum' },
            { key: 'Kanban', text: 'Kanban' },
            { key: 'Bug Tracking', text: 'Bug Tracking' },
            { key: 'Feature Management', text: 'Feature Management' },
            { key: 'General', text: 'General' }
        ];

        const workItemTypeOptions: IDropdownOption[] = [
            { key: '', text: 'All Work Item Types' },
            { key: 'Bug', text: 'Bug' },
            { key: 'User Story', text: 'User Story' },
            { key: 'Task', text: 'Task' },
            { key: 'Epic', text: 'Epic' },
            { key: 'Feature', text: 'Feature' },
            { key: 'Issue', text: 'Issue' },
            { key: 'Test Case', text: 'Test Case' }
        ];

        return (
            <Stack tokens={{ childrenGap: 15 }}>
                <Text variant="large">Search Templates</Text>
                
                <Stack horizontal tokens={{ childrenGap: 15 } as any}>
                    <SearchBox
                        placeholder="Search by template name..."
                        value={searchCriteria.name || ''}
                        onChange={(_, newValue) => this._updateSearchCriteria('name', newValue)}
                        styles={{ root: { width: 300 } }}
                    />
                    
                    <Dropdown
                        placeholder="Select category"
                        options={categoryOptions}
                        selectedKey={searchCriteria.category || ''}
                        onChange={(_, option) => this._updateSearchCriteria('category', option?.key as string)}
                        styles={{ root: { width: 200 } }}
                    />
                    
                    <Dropdown
                        placeholder="Select work item type"
                        options={workItemTypeOptions}
                        selectedKey={searchCriteria.workItemTypes?.[0] || ''}
                        onChange={(_, option) => this._updateSearchCriteria('workItemTypes', option?.key ? [option.key as string] : [])}
                        styles={{ root: { width: 200 } }}
                    />
                </Stack>

                <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                    <DefaultButton 
                        text="Clear Filters" 
                        onClick={this._clearSearchFilters}
                    />
                    <PrimaryButton 
                        text="Search" 
                        onClick={this._performSearch}
                    />
                </Stack>
            </Stack>
        );
    }

    private _renderTemplateList(): JSX.Element {
        const { filteredTemplates } = this.state;

        return (
            <Stack tokens={{ childrenGap: 15 }}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Text variant="large">
                        Available Templates ({filteredTemplates.length})
                    </Text>
                    <DefaultButton 
                        text="Refresh" 
                        onClick={this._loadTemplates}
                        iconProps={{ iconName: 'Refresh' }}
                    />
                </Stack>

                {filteredTemplates.length === 0 ? (
                    <Stack tokens={{ childrenGap: 10 }} horizontalAlign="center">
                        <Text variant="medium">No templates found</Text>
                        <Text variant="small" style={{ color: '#666' }}>
                            Try adjusting your search criteria or check back later for new templates.
                        </Text>
                    </Stack>
                ) : (
                    <DetailsList
                        items={filteredTemplates}
                        columns={this._columns}
                        selectionMode={SelectionMode.none}
                        isHeaderVisible={true}
                        compact={true}
                    />
                )}
            </Stack>
        );
    }

    private _renderTemplateDetails(): JSX.Element {
        const { selectedTemplate } = this.state;
        if (!selectedTemplate || !selectedTemplate.templateInfo) return null;

        const template = selectedTemplate.templateInfo;

        return (
            <Panel
                isOpen={true}
                onDismiss={this._hideTemplateDetails}
                headerText={template.templateName}
                type={PanelType.medium}
                isLightDismiss={false}
            >
                <div style={{ padding: "20px" }}>
                    <Stack tokens={{ childrenGap: 15 }}>
                        <Text variant="medium">{template.templateDescription}</Text>
                        
                        <Stack horizontal tokens={{ childrenGap: 20 } as any}>
                            <Stack tokens={{ childrenGap: 10 }>
                                <Text variant="medium"><strong>Category:</strong></Text>
                                <Text>{template.templateCategory}</Text>
                            </Stack>
                            <Stack tokens={{ childrenGap: 10 }>
                                <Text variant="medium"><strong>Author:</strong></Text>
                                <Text>{template.templateAuthor}</Text>
                            </Stack>
                            <Stack tokens={{ childrenGap: 10 }>
                                <Text variant="medium"><strong>Version:</strong></Text>
                                <Text>{template.templateVersion}</Text>
                            </Stack>
                        </Stack>

                        <Stack tokens={{ childrenGap: 10 }}>
                            <Text variant="medium"><strong>Work Item Types:</strong></Text>
                            <Text>{selectedTemplate.metadata.selectedWorkItemTypes?.join(', ') || 'All'}</Text>
                        </Stack>

                        <Stack tokens={{ childrenGap: 10 }}>
                            <Text variant="medium"><strong>Tags:</strong></Text>
                            <Text>{template.templateTags.join(', ')}</Text>
                        </Stack>

                        <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                            <Stack tokens={{ childrenGap: 5 }>
                                <Text variant="medium"><strong>Rating:</strong></Text>
                                <Rating
                                    rating={template.templateRating || 0}
                                    max={5}
                                    size={RatingSize.Small}
                                    readOnly
                                />
                            </Stack>
                            <Stack tokens={{ childrenGap: 5 }}>
                                <Text variant="medium"><strong>Usage Count:</strong></Text>
                                <Text>{template.templateUsage}</Text>
                            </Stack>
                        </Stack>

                        <Stack tokens={{ childrenGap: 10 }}>
                            <Text variant="medium"><strong>Created:</strong></Text>
                            <Text>{new Date(template.templateCreatedDate).toLocaleDateString()}</Text>
                        </Stack>

                        <Stack tokens={{ childrenGap: 10 }}>
                            <Text variant="medium"><strong>Last Modified:</strong></Text>
                            <Text>{new Date(template.templateLastModified).toLocaleDateString()}</Text>
                        </Stack>

                        <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                            <PrimaryButton onClick={() => this._useTemplate(selectedTemplate)} text="Use This Template" />
                            <DefaultButton onClick={this._hideTemplateDetails} text="Close" />
                        </Stack>
                    </Stack>
                </div>
            </Panel>
        );
    }

    private _renderImportDialog(): JSX.Element {
        const { selectedTemplate, importOptions } = this.state;
        if (!selectedTemplate) return null;

        return (
            <Panel
                isOpen={true}
                onDismiss={this._hideImportDialog}
                headerText={`Import Template: ${selectedTemplate.templateInfo?.templateName}`}
                type={PanelType.medium}
                isLightDismiss={false}
            >
                <div style={{ padding: "20px" }}>
                    <Stack tokens={{ childrenGap: 15 }}>
                        <Text variant="medium">Configure import options for this template</Text>
                        
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

                        <Stack horizontal tokens={{ childrenGap: 10 } as any}>
                            <PrimaryButton onClick={this._performImport} text="Import Template" />
                            <DefaultButton onClick={this._hideImportDialog} text="Cancel" />
                        </Stack>
                    </Stack>
                </div>
            </Panel>
        );
    }

    private _loadTemplates = async (): Promise<void> => {
        this.setState({ isLoading: true, error: null });

        try {
            const templates = await ExportImportDataService.getTemplateLibrary();
            this.setState({ 
                templates, 
                filteredTemplates: templates,
                isLoading: false 
            });
        } catch (error) {
            this.setState({ 
                error: `Failed to load templates: ${error.message}`, 
                isLoading: false 
            });
        }
    };

    private _performSearch = async (): Promise<void> => {
        const { searchCriteria, templates } = this.state;

        try {
            const filteredTemplates = await ExportImportDataService.searchTemplates(searchCriteria);
            this.setState({ filteredTemplates });
        } catch (error) {
            this.setState({ 
                error: `Search failed: ${error.message}` 
            });
        }
    };

    private _updateSearchCriteria = (key: keyof ITemplateSearchCriteria, value: any): void => {
        this.setState(prevState => ({
            searchCriteria: {
                ...prevState.searchCriteria,
                [key]: value
            }
        }));
    };

    private _clearSearchFilters = (): void => {
        this.setState({ 
            searchCriteria: {},
            filteredTemplates: this.state.templates
        });
    };

    private _updateImportOption = (key: keyof typeof this.state.importOptions, value: boolean): void => {
        this.setState(prevState => ({
            importOptions: {
                ...prevState.importOptions,
                [key]: value
            }
        }));
    };

    private _showTemplateDetails = (template: IOneClickExportData): void => {
        this.setState({ selectedTemplate: template, showTemplateDetails: true });
    };

    private _hideTemplateDetails = (): void => {
        this.setState({ selectedTemplate: null, showTemplateDetails: false });
    };

    private _useTemplate = (template: IOneClickExportData): void => {
        this.setState({ selectedTemplate: template, showImportDialog: true });
        this._hideTemplateDetails();
    };

    private _hideImportDialog = (): void => {
        this.setState({ selectedTemplate: null, showImportDialog: false });
    };

    private _performImport = async (): Promise<void> => {
        const { selectedTemplate, importOptions } = this.state;
        if (!selectedTemplate) return;

        this.setState({ isLoading: true, error: null });

        try {
            const result = await ExportImportDataService.importSettings(
                selectedTemplate,
                this.props.projectId,
                importOptions
            );

            if (result.success) {
                this.setState({ 
                    success: `Template imported successfully! Imported ${result.importedRuleGroups} rule groups, ${result.importedGlobalRules} global rules, and ${result.importedSettings} settings.`,
                    isLoading: false 
                });
                this._hideImportDialog();
                
                // Update template usage count
                if (selectedTemplate.templateInfo) {
                    await ExportImportDataService.updateTemplateUsage(selectedTemplate.templateInfo.templateName);
                }
            } else {
                this.setState({ 
                    error: `Import completed with errors: ${result.errors.join(', ')}`,
                    isLoading: false 
                });
            }
        } catch (error) {
            this.setState({ 
                error: `Import failed: ${error.message}`,
                isLoading: false 
            });
        }
    };

    private _clearError = (): void => {
        this.setState({ error: null });
    };

    private _clearSuccess = (): void => {
        this.setState({ success: null });
    };
} 