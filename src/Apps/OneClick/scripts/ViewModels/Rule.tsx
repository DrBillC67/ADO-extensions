import * as React from "react";

import { getCurrentUser } from "Common/Utilities/Identity";
import { isNullOrEmpty, stringEquals } from "Common/Utilities/String";
import { IconButton } from "OfficeFabric/Button";
import { FormEvents, RuleFieldNames, SizeLimits } from "OneClick/Constants";
import { getActionType, getTriggerType } from "OneClick/ImportRegisteredArtifacts";
import { IAction, IActionError, IRule, ITrigger } from "OneClick/Interfaces";
import { BaseAction } from "OneClick/RuleActions/BaseAction";
import { BaseTrigger } from "OneClick/RuleTriggers/BaseTrigger";
import { Observable } from "VSSUI/Utilities/Observable";

export class Rule extends Observable<void> {
    public static getNewRule(workItemTypeName: string): Rule {
        return new Rule({
            name: "New rule",
            description: "",
            disabled: false,
            hideOnForm: false,
            color: "#007acc",
            projectId: VSS.getWebContext().project.id,
            workItemType: workItemTypeName,
            actions: [],
            triggers: [],
            createdBy: getCurrentUser(),
            lastUpdatedBy: getCurrentUser()
        });
    }

    private _originalModel: IRule;
    private _updates: { [key: string]: any };
    private _actions: BaseAction[];
    private _triggers: BaseTrigger[];
    private _changedListeners: Array<() => void> = [];

    constructor(model: IRule) {
        super();
        this._originalModel = { ...model };
        this._updates = {};

        this._actions = this._prepareActions(this._originalModel.actions || []);
        this._triggers = this._prepareTriggers(this._originalModel.triggers || []);
    }

    public get id(): string {
        return this._originalModel.id;
    }

    public get isNew(): boolean {
        return isNullOrEmpty(this.id);
    }

    public get version(): number {
        return this._originalModel.__etag;
    }

    public get updatedModel(): IRule {
        const updatedModel = { ...this._originalModel, ...this._updates };
        updatedModel.actions = this._actions.map(action => ({
            name: action.name,
            attributes: action.updatedAttributes
        }));
        updatedModel.triggers = this._triggers.map(trigger => ({
            name: trigger.name,
            attributes: trigger.updatedAttributes
        }));

        return updatedModel;
    }

    public get originalModel(): IRule {
        return { ...this._originalModel };
    }

    public get actions(): BaseAction[] {
        return this._actions;
    }

    public get triggers(): BaseTrigger[] {
        return this._triggers;
    }

    public get hasTriggers(): boolean {
        return this.triggers && this.triggers.length > 0;
    }

    public isDirty(): boolean {
        return (
            !stringEquals(this.updatedModel.name, this._originalModel.name) ||
            !stringEquals(this.updatedModel.color, this._originalModel.color, true) ||
            !stringEquals(this.updatedModel.description, this._originalModel.description, true) ||
            this.updatedModel.disabled !== this._originalModel.disabled ||
            this.updatedModel.hideOnForm !== this._originalModel.hideOnForm ||
            this._originalModel.actions.length !== this._actions.length ||
            this._originalModel.triggers.length !== this._triggers.length ||
            this._actions.some((a: BaseAction) => a.isDirty()) ||
            this._triggers.some((t: BaseTrigger) => t.isDirty())
        );
    }

    public isValid(): boolean {
        if (isNullOrEmpty(this.updatedModel.name)) {
            return false;
        }

        if (this.updatedModel.name.length > SizeLimits.RuleNameMaxLength) {
            return false;
        }

        if (this.updatedModel.description && this.updatedModel.description.length > SizeLimits.RuleDescriptionMaxLength) {
            return false;
        }

        if (!this._actions || this._actions.length === 0) {
            return false;
        }

        if (!this._triggers || this._triggers.length === 0) {
            return false;
        }

        return this._actions.every((a: BaseAction) => a.isValid()) && this._triggers.every((t: BaseTrigger) => t.isValid());
    }

    public setFieldValue<T extends string | boolean | number>(fieldName: RuleFieldNames, fieldValue: T): void {
        this._updates[fieldName] = fieldValue;
        this._emitChanged();
    }

    public getFieldValue<T extends string | boolean | number>(fieldName: RuleFieldNames, original?: boolean): T {
        if (original) {
            return this._originalModel[fieldName] as T;
        }
        return this._updates[fieldName] !== undefined ? this._updates[fieldName] : this._originalModel[fieldName] as T;
    }

    public addChangedListener(listener: () => void): void {
        this._changedListeners.push(listener);
    }

    public removeChangedListener(listener: () => void): void {
        const index = this._changedListeners.indexOf(listener);
        if (index > -1) {
            this._changedListeners.splice(index, 1);
        }
    }

    public dispose(): void {
        this._actions.forEach(action => this._unsubscribeFromAction(action));
        this._triggers.forEach(trigger => this._unsubscribeFromTrigger(trigger));
        this._changedListeners = [];
        super.dispose();
    }

    public addAction(action: BaseAction): void {
        this._actions.push(action);
        this._subscribeToAction(action);
        this._emitChanged();
    }

    public addTrigger(trigger: BaseTrigger): void {
        this._triggers.push(trigger);
        this._subscribeToTrigger(trigger);
        this._emitChanged();
    }

    public renderActions(): React.ReactNode {
        return this._actions.map((action: BaseAction, index: number) => (
            <div key={`action-${index}`} className="action-item">
                <div className="action-content">
                    {action.render()}
                </div>
                <div className="action-remove">
                    <IconButton
                        iconProps={{ iconName: "Delete" }}
                        onClick={this._onRemoveActionButtonClick(action)}
                        title="Remove action"
                    />
                </div>
            </div>
        ));
    }

    public renderTriggers(): React.ReactNode {
        return this._triggers.map((trigger: BaseTrigger, index: number) => (
            <div key={`trigger-${index}`} className="trigger-item">
                <div className="trigger-content">
                    {trigger.render()}
                </div>
                <div className="trigger-remove">
                    <IconButton
                        iconProps={{ iconName: "Delete" }}
                        onClick={this._onRemoveTriggerButtonClick(trigger)}
                        title="Remove trigger"
                    />
                </div>
            </div>
        ));
    }

    // Returns an array of strings - each string corresponds to an error in action execution
    public async run(): Promise<IActionError | null> {
        let error: IActionError | null = null;
        if (this.actions == null || this.actions.length === 0) {
            return null;
        }

        for (const action of this.actions) {
            try {
                await action.run();
            } catch (e) {
                error = {
                    actionName: action.getFriendlyName(),
                    error: e.message || e
                };

                break;
            }
        }

        return error;
    }

    // determine if the rule should be run when an event is fired
    public async shouldRunOnEvent(eventName: FormEvents, triggerArgs: any): Promise<boolean> {
        return this._triggers.some(async (trigger: BaseTrigger) => await this._shouldTriggerFire(eventName, triggerArgs, trigger));
    }

    private async _shouldTriggerFire(eventName: FormEvents, triggerArgs: any, trigger: BaseTrigger): Promise<boolean> {
        if (trigger.getAssociatedFormEvent() === eventName) {
            return await trigger.shouldTrigger(triggerArgs);
        }
        return false;
    }

    private _removeAction(action: BaseAction): void {
        const index = this._actions.indexOf(action);
        if (index > -1) {
            this._actions.splice(index, 1);
            this._unsubscribeFromAction(action);
            this._emitChanged();
        }
    }

    private _removeTrigger(trigger: BaseTrigger): void {
        const index = this._triggers.indexOf(trigger);
        if (index > -1) {
            this._triggers.splice(index, 1);
            this._unsubscribeFromTrigger(trigger);
            this._emitChanged();
        }
    }

    private _prepareActions(actionModels: IAction[]): BaseAction[] {
        const actions: BaseAction[] = [];
        for (const actionModel of actionModels) {
            try {
                const ActionType = getActionType(actionModel.name);
                if (ActionType) {
                    const action = new ActionType(actionModel.attributes);
                    this._subscribeToAction(action);
                    actions.push(action);
                }
            } catch (error) {
                console.error(`Error preparing action ${actionModel.name}:`, error);
            }
        }
        return actions;
    }

    private _prepareTriggers(triggerModels: ITrigger[]): BaseTrigger[] {
        const triggers: BaseTrigger[] = [];
        for (const triggerModel of triggerModels) {
            try {
                const TriggerType = getTriggerType(triggerModel.name);
                if (TriggerType) {
                    const trigger = new TriggerType(triggerModel.attributes);
                    this._subscribeToTrigger(trigger);
                    triggers.push(trigger);
                }
            } catch (error) {
                console.error(`Error preparing trigger ${triggerModel.name}:`, error);
            }
        }
        return triggers;
    }

    private _subscribeToAction(action: BaseAction): void {
        action.addChangedListener(this._emitChanged);
    }

    private _subscribeToTrigger(trigger: BaseTrigger): void {
        trigger.addChangedListener(this._emitChanged);
    }

    private _unsubscribeFromAction(action: BaseAction): void {
        action.removeChangedListener(this._emitChanged);
    }

    private _unsubscribeFromTrigger(trigger: BaseTrigger): void {
        trigger.removeChangedListener(this._emitChanged);
    }

    private _onRemoveActionButtonClick = (action: BaseAction): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (event: React.MouseEvent<HTMLButtonElement>): void => {
            event.preventDefault();
            this._removeAction(action);
        };
    };

    private _onRemoveTriggerButtonClick = (trigger: BaseTrigger): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (event: React.MouseEvent<HTMLButtonElement>): void => {
            event.preventDefault();
            this._removeTrigger(trigger);
        };
    };

    private _emitChanged = (): void => {
        this._changedListeners.forEach(listener => listener());
        this.notify();
    };
}
