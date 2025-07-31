import "./SettingsApp.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { initializeIcons } from "@uifabric/icons";
import { Loading } from "Common/Components/Loading";
import { ErrorBoundary } from "Common/Components/ErrorBoundary";
import {
    BaseFluxComponent, IBaseFluxComponentProps, IBaseFluxComponentState
} from "Common/Components/Utilities/BaseFluxComponent";
import { WorkItemTypeActions } from "Common/Flux/Actions/WorkItemTypeActions";
import { BaseStore } from "Common/Flux/Stores/BaseStore";
import { getHostNavigationService, navigate } from "Common/Utilities/Navigation";
import { getMarketplaceUrl, getWorkItemTypeSettingsUrl } from "Common/Utilities/UrlHelper";
import { IconButton } from "OfficeFabric/Button";
import { Fabric } from "OfficeFabric/Fabric";
import { INavLink, Nav } from "OfficeFabric/Nav";
import { DirectionalHint, TooltipDelay, TooltipHost } from "OfficeFabric/Tooltip";
import { WorkItemTypeView } from "OneClick/Components/Settings/WorkItemTypeView";
import { ExportImportPanel } from "OneClick/Components/Settings/ExportImportPanel";
import { TemplateLibrary } from "OneClick/Components/Settings/TemplateLibrary";
import { StoresHub } from "OneClick/Flux/Stores/StoresHub";
import { initTelemetry, resetSession } from "OneClick/Telemetry";
import { HostNavigationService } from "VSS/SDK/Services/Navigation";

export interface IAppState extends IBaseFluxComponentState {
    selectedWit?: string;
    selectedRuleGroupId?: string;
    showExportImportPanel: boolean;
    showTemplateLibrary: boolean;
}

export class SettingsApp extends BaseFluxComponent<IBaseFluxComponentProps, IAppState> {
    private _navigationService: HostNavigationService;

    public componentDidMount(): void {
        super.componentDidMount();

        resetSession();
        initTelemetry();
        this._attachNavigate();
        WorkItemTypeActions.initializeWorkItemTypes();
    }

    public componentWillUnmount(): void {
        super.componentWillUnmount();
        this._detachNavigate();
    }

    public render(): JSX.Element {
        return (
            <ErrorBoundary>
                <Fabric className="fabric-container">
                    {this.state.loading && <Loading />}
                    {!this.state.loading && (
                        <div className="container">
                            <Nav
                                className="workitemtype-selector-nav"
                                groups={[
                                    {
                                        links: this._getWITNavGroups()
                                    }
                                ]}
                                onLinkClick={this._onNavLinkClick}
                                selectedKey={this.state.selectedWit}
                            />

                            <div className="rule-groups-container">
                                <ErrorBoundary>
                                    <WorkItemTypeView 
                                        workItemTypeName={this.state.selectedWit} 
                                        ruleGroupId={this.state.selectedRuleGroupId} 
                                    />
                                </ErrorBoundary>
                            </div>
                        </div>
                    )}
                    {!this.state.loading && (
                        <div className="info-button-contaier">
                            <TooltipHost content={"Template Library"} delay={TooltipDelay.medium} directionalHint={DirectionalHint.bottomLeftEdge}>
                                <IconButton
                                    className="info-button"
                                    iconProps={{
                                        iconName: "Library"
                                    }}
                                    onClick={this._showTemplateLibrary}
                                />
                            </TooltipHost>
                            <TooltipHost content={"Export/Import Settings"} delay={TooltipDelay.medium} directionalHint={DirectionalHint.bottomLeftEdge}>
                                <IconButton
                                    className="info-button"
                                    iconProps={{
                                        iconName: "Download"
                                    }}
                                    onClick={this._showExportImportPanel}
                                />
                            </TooltipHost>
                            <TooltipHost content={"How to use the extension"} delay={TooltipDelay.medium} directionalHint={DirectionalHint.bottomLeftEdge}>
                                <IconButton
                                    className="info-button"
                                    iconProps={{
                                        iconName: "InfoSolid"
                                    }}
                                    href={getMarketplaceUrl()}
                                    target="_blank"
                                />
                            </TooltipHost>
                        </div>
                    )}

                    <ErrorBoundary>
                        <ExportImportPanel
                            isOpen={this.state.showExportImportPanel}
                            onDismiss={this._hideExportImportPanel}
                            projectId={VSS.getWebContext().project.id}
                            projectName={VSS.getWebContext().project.name}
                        />
                    </ErrorBoundary>

                    <ErrorBoundary>
                        <TemplateLibrary
                            isOpen={this.state.showTemplateLibrary}
                            onDismiss={this._hideTemplateLibrary}
                            projectId={VSS.getWebContext().project.id}
                            projectName={VSS.getWebContext().project.name}
                            onTemplateSelected={this._onTemplateSelected}
                        />
                    </ErrorBoundary>
                </Fabric>
            </ErrorBoundary>
        );
    }

    protected getInitialState(): IAppState {
        return {
            loading: true,
            showExportImportPanel: false,
            showTemplateLibrary: false
        };
    }

    protected getStores(): BaseStore<any, any, any>[] {
        return [StoresHub.workItemTypeStore];
    }

    protected getStoresState(): IAppState {
        const workItemTypes = StoresHub.workItemTypeStore.getAll();
        let newState = {
            loading: StoresHub.workItemTypeStore.isLoading()
        } as IAppState;

        if (workItemTypes) {
            if (!this.state.selectedWit) {
                // if no wit is selected, route to the 1st wit
                navigate({ witName: workItemTypes[0].name }, true, false, null, true);
                newState = { ...newState, selectedWit: workItemTypes[0].name };
            } else {
                // check the correct witName for current selected wit
                const wit = StoresHub.workItemTypeStore.getItem(this.state.selectedWit);
                if (!wit) {
                    // if its an invalid wit, route to the 1st workitemtype page
                    navigate({ witName: workItemTypes[0].name }, true, false, null, true);
                    newState = { ...newState, selectedWit: workItemTypes[0].name };
                } else {
                    newState = { ...newState, selectedWit: wit.name };
                }
            }
        }

        return newState;
    }

    private async _attachNavigate(): Promise<void> {
        this._navigationService = await getHostNavigationService();
        this._navigationService.attachNavigate(this._onNavigate);
    }

    private _detachNavigate(): void {
        if (this._navigationService) {
            this._navigationService.detachNavigate(this._onNavigate);
        }
    }

    private _getWITNavGroups(): INavLink[] {
        return StoresHub.workItemTypeStore.getAll().map(wit => ({
            name: wit.name,
            key: wit.name,
            url: getWorkItemTypeSettingsUrl(wit.name)
        }));
    }

    private _onNavLinkClick = (e: React.MouseEvent<HTMLElement>, link: INavLink): void => {
        if (!e.ctrlKey) {
            e.preventDefault();
            navigate({ witName: link.key });
        }
    };

    private _onNavigate = async (): Promise<void> => {
        if (this._navigationService) {
            const workItemTypes = StoresHub.workItemTypeStore.getAll();
            const state = await this._navigationService.getCurrentState();
            let witName = state && state.witName;
            const ruleGroupId = state && state.ruleGroup;

            if (witName && workItemTypes) {
                // if wit store is loaded, check the store for witName
                // if it doesnt exist in store, get the 1st work item type from store.
                const wit = StoresHub.workItemTypeStore.getItem(witName);
                if (!wit) {
                    // if its an invalid wit, route to the 1st workitemtype page
                    navigate({ witName: workItemTypes[0].name }, true);
                    return;
                } else {
                    witName = wit.name;
                }
            } else if (!witName && workItemTypes) {
                witName = workItemTypes[0].name;
            }

            this.setState({
                selectedWit: witName,
                selectedRuleGroupId: ruleGroupId || ""
            });
        }
    };

    private _showExportImportPanel = (): void => {
        this.setState({ showExportImportPanel: true });
    };

    private _hideExportImportPanel = (): void => {
        this.setState({ showExportImportPanel: false });
    };

    private _showTemplateLibrary = (): void => {
        this.setState({ showTemplateLibrary: true });
    };

    private _hideTemplateLibrary = (): void => {
        this.setState({ showTemplateLibrary: false });
    };

    private _onTemplateSelected = (template: any): void => {
        // Handle template selection - could open import dialog or apply template directly
        console.log("Template selected:", template);
    };
}

export function init(): void {
    initializeIcons();

    const container = document.getElementById("ext-container");
    const spinner = document.getElementById("spinner");
    if (container && spinner) {
        container.removeChild(spinner);
    }

    ReactDOM.render(<SettingsApp />, container);
}
