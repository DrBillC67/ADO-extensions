import "./WorkItemRulesGroup.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";

import { initializeIcons } from "@uifabric/icons";
import { Loading } from "Common/Components/Loading";
import { ErrorBoundary } from "Common/Components/ErrorBoundary";
import { AutoResizableComponent } from "Common/Components/Utilities/AutoResizableComponent";
import {
    IBaseFluxComponentProps, IBaseFluxComponentState
} from "Common/Components/Utilities/BaseFluxComponent";
import { contains, subtract } from "Common/Utilities/Array";
import { getCurrentUserName } from "Common/Utilities/Identity";
import {
    readLocalSetting, WebSettingsScope, writeLocalSetting
} from "Common/Utilities/LocalSettingsService";
import { stringEquals } from "Common/Utilities/String";
import { getMarketplaceUrl, getWorkItemTypeSettingsUrl } from "Common/Utilities/UrlHelper";
import { getFormService } from "Common/Utilities/WorkItemFormHelpers";
import { IconButton } from "OfficeFabric/Button";
import { Fabric } from "OfficeFabric/Fabric";
import { DirectionalHint, TooltipDelay, TooltipHost } from "OfficeFabric/Tooltip";
import { WorkItemFormRuleButton } from "OneClick/Components/FormGroup/WorkItemFormRuleButton";
import {
    Constants, CoreFieldRefNames, FormEvents, RuleFieldNames, SettingKey
} from "OneClick/Constants";
import { RuleGroupsDataService } from "OneClick/DataServices/RuleGroupsDataService";
import { RulesDataService } from "OneClick/DataServices/RulesDataService";
import { SettingsDataService } from "OneClick/DataServices/SettingsDataService";
import { IActionError, ILocalStorageRulesData, IRule } from "OneClick/Interfaces";
import { resetSession, trackEvent } from "OneClick/Telemetry";
import { Rule } from "OneClick/ViewModels/Rule";
import { TeamProject } from "TFS/Core/Contracts";
import * as CoreClient from "TFS/Core/RestClient";
import {
    IWorkItemChangedArgs, IWorkItemFieldChangedArgs, IWorkItemLoadedArgs,
    IWorkItemNotificationListener
} from "TFS/WorkItemTracking/ExtensionContracts";
import { ZeroData, ZeroDataActionType } from "VSSUI/ZeroData";

export interface IWorkItemRulesGroupState extends IBaseFluxComponentState {
    rules?: Rule[];
    workItemTypeEnabled?: boolean;
    ruleExecutionError?: IActionError;
}

const SortableItem: any = SortableElement(({ value }: { value: React.ReactNode }) => {
    return <div className="rule-list-item">{value}</div>;
});

const SortableList: any = SortableContainer(({ items }: { items: React.ReactNode[] }) => {
    return <div className="rules-list-container">{items.map((value, index) => <SortableItem key={`item-${index}`} index={index} value={value} />)}</div>;
});

export class WorkItemRulesGroup extends AutoResizableComponent<IBaseFluxComponentProps, IWorkItemRulesGroupState> {
    private _project: TeamProject;
    private _workItemTypeName: string;
    private _cacheStamp: number;
    private _ruleOrder: IDictionaryStringTo<number>;

    public componentDidMount(): void {
        super.componentDidMount();

        VSS.register(VSS.getContribution().id, {
            onLoaded: async (args: IWorkItemLoadedArgs): Promise<void> => {
                // load data only if its not already loaded and not currently being loaded
                resetSession(); // reset telemetry session id
                let rules = this.state.rules;
                if (!this.state.loading && !this.state.rules) {
                    rules = await this._initializeRules(false);
                }

                this._fireRulesTrigger(FormEvents.onLoaded, args, rules);
            },
            onFieldChanged: (args: IWorkItemFieldChangedArgs): void => {
                this._fireRulesTrigger(FormEvents.onFieldChanged, args);
            },
            onSaved: (args: IWorkItemChangedArgs): void => {
                this._fireRulesTrigger(FormEvents.onSaved, args);
            },
            onRefreshed: (args: IWorkItemChangedArgs): void => {
                this._fireRulesTrigger(FormEvents.onRefreshed, args);
            },
            onReset: (args: IWorkItemChangedArgs): void => {
                this._fireRulesTrigger(FormEvents.onReset, args);
            },
            onUnloaded: (args: IWorkItemChangedArgs): void => {
                this._fireRulesTrigger(FormEvents.onUnloaded, args);
            }
        } as IWorkItemNotificationListener);
    }

    public componentWillUnmount(): void {
        super.componentWillUnmount();
        VSS.unregister(VSS.getContribution().id);
    }

    public render(): JSX.Element {
        const iconsDisabled = this.state.loading || !this.state.rules;

        return (
            <ErrorBoundary>
                <Fabric className="fabric-container">
                    {this.state.loading && <Loading />}
                    {!this.state.loading && this.state.rules && this.state.workItemTypeEnabled && (
                        <div className="workitem-rules-group">
                            {this._renderErrors()}
                            {this._renderRules()}
                        </div>
                    )}
                    {!this.state.loading && (!this.state.rules || !this.state.workItemTypeEnabled) && (
                        <div className="workitem-rules-group">
                            <ZeroData
                                primaryText="No rules configured"
                                secondaryText="Rules are not configured for this work item type or the work item type is disabled."
                                actionText="Configure Rules"
                                actionType={ZeroDataActionType.ctaButton}
                                onActionClick={this._openSettingsPage}
                            />
                        </div>
                    )}
                    {!this.state.loading && (
                        <div className="info-button-container">
                            <TooltipHost content={"Refresh rules"} delay={TooltipDelay.medium} directionalHint={DirectionalHint.bottomLeftEdge}>
                                <IconButton
                                    className="info-button"
                                    disabled={iconsDisabled}
                                    iconProps={{
                                        iconName: "Refresh"
                                    }}
                                    onClick={this._refresh}
                                />
                            </TooltipHost>
                            <TooltipHost content={"Configure rules"} delay={TooltipDelay.medium} directionalHint={DirectionalHint.bottomLeftEdge}>
                                <IconButton
                                    className="info-button"
                                    disabled={iconsDisabled}
                                    iconProps={{
                                        iconName: "Settings"
                                    }}
                                    onClick={this._openSettingsPage}
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
                </Fabric>
            </ErrorBoundary>
        );
    }

    protected getInitialState(): IWorkItemRulesGroupState {
        return {
            loading: true
        };
    }

    private _renderErrors(): JSX.Element {
        if (!this.state.ruleExecutionError) {
            return null;
        }

        return (
            <div className="rule-execution-error">
                <a href="#" onClick={this._showErrorsDialog}>
                    Error executing rule "{this.state.ruleExecutionError.actionName}": {this.state.ruleExecutionError.error}
                </a>
            </div>
        );
    }

    private _renderRules(): JSX.Element {
        if (!this.state.rules || this.state.rules.length === 0) {
            return (
                <div className="no-rules-message">
                    <p>No rules configured for this work item type.</p>
                    <p>Click the settings icon to configure rules.</p>
                </div>
            );
        }

        const ruleButtons = this.state.rules.map((rule: Rule) => this._renderRuleButton(rule));

        return (
            <div className="rules-container">
                <SortableList
                    items={ruleButtons}
                    onSortEnd={this._reorderRules}
                    useDragHandle={true}
                    lockAxis="y"
                />
            </div>
        );
    }

    private async _initializeRules(forceFromServer: boolean): Promise<Rule[]> {
        try {
            this.setState({ loading: true });

            // get project info
            this._project = await CoreClient.CoreHttpClient4.getClient().getTeamProject(VSS.getWebContext().project.id);

            // get work item type name
            const formService = await getFormService();
            const workItemTypeField = await formService.getFieldValue(CoreFieldRefNames.WorkItemType);
            this._workItemTypeName = workItemTypeField as string;

            // check if work item type is enabled
            const workItemTypeEnabled = await SettingsDataService.loadSetting<boolean>(
                SettingKey.WorkItemTypeEnabled,
                true,
                this._workItemTypeName,
                this._project.id,
                false
            );

            if (!workItemTypeEnabled) {
                this.setState({ loading: false, workItemTypeEnabled: false });
                return [];
            }

            // get cache stamp
            this._cacheStamp = await SettingsDataService.readCacheStamp(this._workItemTypeName, this._project.id);

            // try to load from local storage first
            let rules: Rule[] = [];
            if (!forceFromServer) {
                rules = this._loadFromLocalStorage(this._cacheStamp);
            }

            // if no rules from local storage, load from server
            if (!rules || rules.length === 0) {
                rules = await this._refreshFromServer();
            }

            this.setState({ loading: false, rules, workItemTypeEnabled: true });
            return rules;
        } catch (error) {
            console.error("Error initializing rules:", error);
            this.setState({ loading: false, workItemTypeEnabled: false });
            return [];
        }
    }

    private _loadFromLocalStorage(currentCacheStamp: number): IRule[] {
        try {
            const localStorageKey = this._getLocalStorageKey();
            const localStorageData = readLocalSetting<ILocalStorageRulesData>(localStorageKey, null, WebSettingsScope.User);
            
            if (localStorageData && localStorageData.cacheStamp === currentCacheStamp) {
                return localStorageData.rules;
            }
        } catch (error) {
            console.warn("Error loading from local storage:", error);
        }
        
        return [];
    }

    private async _filterExistingRuleGroups(ruleGroupIds: string[]): Promise<{ existingRuleGroupIds: string[]; deletedRuleGroupIds: string[] }> {
        const existingRuleGroups = await RuleGroupsDataService.loadRuleGroups(this._workItemTypeName, this._project.id);
        const existingRuleGroupIds = existingRuleGroups.map(rg => rg.id);
        const deletedRuleGroupIds = subtract(ruleGroupIds, existingRuleGroupIds, stringEquals);

        return { existingRuleGroupIds, deletedRuleGroupIds };
    }

    private _getLocalStorageKey(): string {
        return `OneClick_Rules_${this._project.id}_${this._workItemTypeName}`;
    }

    private async _saveWorkItem(): Promise<void> {
        const formService = await getFormService();
        formService.save();
    }

    private async _fireRulesTrigger(eventName: FormEvents, args: any, rulesToEvaluate?: Rule[]): Promise<void> {
        const rules = rulesToEvaluate || this.state.rules;
        if (rules) {
            for (const rule of rules) {
                const shouldRunOnEvent = await rule.shouldRunOnEvent(eventName, args);
                if (shouldRunOnEvent) {
                    const errors = await rule.run();
                    this._setError(errors);

                    // log event
                    trackEvent("RuleTrigger", {
                        ruleId: rule.id,
                        triggerEvent: eventName,
                        workItemType: rule.getFieldValue<string>(RuleFieldNames.WorkItemType),
                        projectId: rule.getFieldValue<string>(RuleFieldNames.ProjectId),
                        user: getCurrentUserName()
                    });
                }
            }
        }
    }

    private _showErrorsDialog = (e: React.MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        // Show error dialog implementation
    };

    private _renderRuleButton = (rule: Rule): JSX.Element => {
        return (
            <WorkItemFormRuleButton
                key={rule.id}
                rule={rule}
                onExecute={this._setError}
            />
        );
    };

    private _setError = (ruleExecutionError: IActionError): void => {
        this.setState({ ruleExecutionError });
    };

    private _reorderRules = (data: { oldIndex: number; newIndex: number }): void => {
        if (!this.state.rules) return;

        const newRules = arrayMove(this.state.rules, data.oldIndex, data.newIndex);
        
        // Update rule order in local storage
        this._ruleOrder = {};
        newRules.forEach((rule, index) => {
            this._ruleOrder[rule.id] = index;
        });

        // Save to local storage
        const localStorageKey = this._getLocalStorageKey();
        const localStorageData: ILocalStorageRulesData = {
            cacheStamp: this._cacheStamp,
            workItemType: this._workItemTypeName,
            projectId: this._project.id,
            rules: newRules.map(rule => rule.updatedModel)
        };
        writeLocalSetting(localStorageKey, localStorageData, WebSettingsScope.User);

        this.setState({ rules: newRules });
    };

    private _openSettingsPage = (): void => {
        navigate({ witName: this._workItemTypeName });
    };

    private _refresh = async (): Promise<void> => {
        await this._initializeRules(true);
    };

    private _onKeyDown = (e: React.KeyboardEvent<any>): void => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this._refresh();
        }
    };

    private async _refreshFromServer(): Promise<IRule[]> {
        try {
            // Get rule groups
            const ruleGroups = await RuleGroupsDataService.loadRuleGroups(this._workItemTypeName, this._project.id);
            
            // Get rules for each rule group
            const allRules: IRule[] = [];
            for (const ruleGroup of ruleGroups) {
                const rules = await RulesDataService.loadRulesForGroup(ruleGroup.id, this._project.id);
                allRules.push(...rules);
            }

            // Convert to Rule objects
            const ruleObjects = allRules.map(ruleData => new Rule(ruleData));

            // Save to local storage
            const localStorageKey = this._getLocalStorageKey();
            const localStorageData: ILocalStorageRulesData = {
                cacheStamp: this._cacheStamp,
                workItemType: this._workItemTypeName,
                projectId: this._project.id,
                rules: allRules
            };
            writeLocalSetting(localStorageKey, localStorageData, WebSettingsScope.User);

            return allRules;
        } catch (error) {
            console.error("Error refreshing rules from server:", error);
            return [];
        }
    }
}

export function init(): void {
    initializeIcons();

    const container = document.getElementById("ext-container");
    if (container) {
        ReactDOM.render(<WorkItemRulesGroup />, container);
    }
}
