import * as ExtensionDataManager from "Common/Utilities/ExtensionDataManager";
import { getCurrentUser } from "Common/Utilities/Identity";
import { hashCode } from "Common/Utilities/String";
import { Constants, SettingKey } from "OneClick/Constants";
import { IRule, IRuleGroup } from "OneClick/Interfaces";
import { RuleGroupsDataService } from "OneClick/DataServices/RuleGroupsDataService";
import { RulesDataService } from "OneClick/DataServices/RulesDataService";
import { SettingsDataService } from "OneClick/DataServices/SettingsDataService";

export interface IOneClickExportData {
    version: string;
    exportDate: string;
    projectId: string;
    projectName: string;
    exportedBy: string;
    exportType: ExportType;
    exportScope: ExportScope;
    ruleGroups: IRuleGroup[];
    globalRules: IRule[];
    projectSettings: IProjectSettings;
    metadata: IExportMetadata;
    versionHistory?: IVersionHistoryEntry[];
    templateInfo?: ITemplateInfo;
}

export interface IProjectSettings {
    workItemTypes: IWorkItemTypeSettings[];
}

export interface IWorkItemTypeSettings {
    workItemTypeName: string;
    personalRulesEnabled: boolean;
    globalRulesEnabled: boolean;
    workItemTypeEnabled: boolean;
}

export interface IExportMetadata {
    totalRuleGroups: number;
    totalGlobalRules: number;
    totalWorkItemTypes: number;
    exportFormat: string;
    selectedWorkItemTypes?: string[];
    selectedRuleGroups?: string[];
}

export interface IImportResult {
    success: boolean;
    importedRuleGroups: number;
    importedGlobalRules: number;
    importedSettings: number;
    errors: string[];
    warnings: string[];
    versionHistoryUpdated: boolean;
}

export interface IVersionHistoryEntry {
    version: string;
    timestamp: string;
    exportedBy: string;
    description: string;
    changes: string[];
    exportType: ExportType;
    exportScope: ExportScope;
}

export interface ITemplateInfo {
    templateName: string;
    templateDescription: string;
    templateCategory: string;
    templateTags: string[];
    templateAuthor: string;
    templateVersion: string;
    templateCreatedDate: string;
    templateLastModified: string;
    templateUsage: number;
    templateRating?: number;
    templateReviews?: ITemplateReview[];
}

export interface ITemplateReview {
    reviewer: string;
    rating: number;
    comment: string;
    reviewDate: string;
}

export interface IExportOptions {
    exportType: ExportType;
    exportScope: ExportScope;
    selectedWorkItemTypes?: string[];
    selectedRuleGroups?: string[];
    includeVersionHistory?: boolean;
    includeTemplateInfo?: boolean;
    templateInfo?: ITemplateInfo;
    description?: string;
}

export interface IImportOptions {
    generateNewIds?: boolean;
    overwriteExisting?: boolean;
    skipErrors?: boolean;
    updateVersionHistory?: boolean;
    importAsTemplate?: boolean;
    templateInfo?: ITemplateInfo;
}

export enum ExportType {
    Full = "full",
    Selective = "selective",
    Template = "template",
    Backup = "backup"
}

export enum ExportScope {
    All = "all",
    WorkItemTypes = "workItemTypes",
    RuleGroups = "ruleGroups",
    Settings = "settings",
    Custom = "custom"
}

export namespace ExportImportDataService {
    const EXPORT_VERSION = "3.0";
    const EXPORT_FORMAT = "OneClick-Global-Settings";
    const VERSION_HISTORY_KEY = "version_history";
    const TEMPLATE_LIBRARY_KEY = "template_library";

    /**
     * Export OneClick settings with selective options
     */
    export async function exportSettings(
        projectId: string, 
        projectName: string, 
        options: IExportOptions
    ): Promise<IOneClickExportData> {
        try {
            const workItemTypes = await getWorkItemTypesForProject(projectId);
            const filteredWorkItemTypes = filterWorkItemTypes(workItemTypes, options);
            
            const ruleGroups: IRuleGroup[] = [];
            const globalRules: IRule[] = [];
            const workItemTypeSettings: IWorkItemTypeSettings[] = [];

            // Export data based on scope
            if (shouldExportScope(options.exportScope, ExportScope.WorkItemTypes) || 
                shouldExportScope(options.exportScope, ExportScope.All)) {
                
                for (const workItemType of filteredWorkItemTypes) {
                    // Export rule groups
                    if (shouldExportRuleGroups(workItemType, options)) {
                        const witRuleGroups = await RuleGroupsDataService.loadRuleGroups(workItemType, projectId);
                        ruleGroups.push(...witRuleGroups);
                    }

                    // Export global rules
                    if (shouldExportGlobalRules(workItemType, options)) {
                        const witGlobalRules = await RulesDataService.loadRulesForGroup(Constants.GlobalRuleGroupId, projectId);
                        const filteredGlobalRules = witGlobalRules.filter(rule => 
                            rule.workItemType === workItemType
                        );
                        globalRules.push(...filteredGlobalRules);
                    }

                    // Export project settings
                    if (shouldExportScope(options.exportScope, ExportScope.Settings) || 
                        shouldExportScope(options.exportScope, ExportScope.All)) {
                        
                        const [personalRulesEnabled, globalRulesEnabled, workItemTypeEnabled] = await Promise.all([
                            SettingsDataService.loadSetting<boolean>(SettingKey.PersonalRulesEnabled, true, workItemType, projectId, false),
                            SettingsDataService.loadSetting<boolean>(SettingKey.GlobalRulesEnabled, true, workItemType, projectId, false),
                            SettingsDataService.loadSetting<boolean>(SettingKey.WorkItemTypeEnabled, true, workItemType, projectId, false)
                        ]);

                        workItemTypeSettings.push({
                            workItemTypeName: workItemType,
                            personalRulesEnabled,
                            globalRulesEnabled,
                            workItemTypeEnabled
                        });
                    }
                }
            }

            // Get version history if requested
            let versionHistory: IVersionHistoryEntry[] | undefined;
            if (options.includeVersionHistory) {
                versionHistory = await getVersionHistory(projectId);
            }

            const exportData: IOneClickExportData = {
                version: EXPORT_VERSION,
                exportDate: new Date().toISOString(),
                projectId,
                projectName,
                exportedBy: getCurrentUser().displayName || getCurrentUser().uniqueName,
                exportType: options.exportType,
                exportScope: options.exportScope,
                ruleGroups,
                globalRules,
                projectSettings: {
                    workItemTypes: workItemTypeSettings
                },
                metadata: {
                    totalRuleGroups: ruleGroups.length,
                    totalGlobalRules: globalRules.length,
                    totalWorkItemTypes: workItemTypeSettings.length,
                    exportFormat: EXPORT_FORMAT,
                    selectedWorkItemTypes: filteredWorkItemTypes,
                    selectedRuleGroups: options.selectedRuleGroups
                },
                versionHistory,
                templateInfo: options.templateInfo
            };

            // Update version history
            if (options.includeVersionHistory) {
                await updateVersionHistory(projectId, exportData, options.description);
            }

            // Save to template library if it's a template
            if (options.exportType === ExportType.Template && options.templateInfo) {
                await saveToTemplateLibrary(exportData);
            }

            return exportData;
        } catch (error) {
            throw new Error(`Failed to export OneClick settings: ${error.message}`);
        }
    }

    /**
     * Import OneClick settings with enhanced options
     */
    export async function importSettings(
        importData: IOneClickExportData, 
        targetProjectId: string,
        options: IImportOptions = {}
    ): Promise<IImportResult> {
        const result: IImportResult = {
            success: true,
            importedRuleGroups: 0,
            importedGlobalRules: 0,
            importedSettings: 0,
            errors: [],
            warnings: [],
            versionHistoryUpdated: false
        };

        try {
            validateImportData(importData);

            // Import project settings
            for (const workItemTypeSetting of importData.projectSettings.workItemTypes) {
                try {
                    await Promise.all([
                        SettingsDataService.updateSetting(
                            SettingKey.PersonalRulesEnabled, 
                            workItemTypeSetting.personalRulesEnabled, 
                            workItemTypeSetting.workItemTypeName, 
                            targetProjectId, 
                            false
                        ),
                        SettingsDataService.updateSetting(
                            SettingKey.GlobalRulesEnabled, 
                            workItemTypeSetting.globalRulesEnabled, 
                            workItemTypeSetting.workItemTypeName, 
                            targetProjectId, 
                            false
                        ),
                        SettingsDataService.updateSetting(
                            SettingKey.WorkItemTypeEnabled, 
                            workItemTypeSetting.workItemTypeEnabled, 
                            workItemTypeSetting.workItemTypeName, 
                            targetProjectId, 
                            false
                        )
                    ]);
                    result.importedSettings++;
                } catch (error) {
                    result.errors.push(`Failed to import settings for ${workItemTypeSetting.workItemTypeName}: ${error.message}`);
                }
            }

            // Import rule groups
            for (const ruleGroup of importData.ruleGroups) {
                try {
                    const newRuleGroup = {
                        ...ruleGroup,
                        id: options.generateNewIds ? generateNewId() : ruleGroup.id,
                        projectId: targetProjectId,
                        createdBy: getCurrentUser(),
                        lastUpdatedBy: getCurrentUser()
                    };

                    await RuleGroupsDataService.createRuleGroup(
                        ruleGroup.workItemType,
                        newRuleGroup,
                        targetProjectId
                    );
                    result.importedRuleGroups++;
                } catch (error) {
                    result.errors.push(`Failed to import rule group "${ruleGroup.name}": ${error.message}`);
                }
            }

            // Import global rules
            for (const rule of importData.globalRules) {
                try {
                    const newRule = {
                        ...rule,
                        id: options.generateNewIds ? generateNewId() : rule.id,
                        projectId: targetProjectId,
                        createdBy: getCurrentUser(),
                        lastUpdatedBy: getCurrentUser()
                    };

                    await RulesDataService.createRule(Constants.GlobalRuleGroupId, newRule);
                    result.importedGlobalRules++;
                } catch (error) {
                    result.errors.push(`Failed to import global rule "${rule.name}": ${error.message}`);
                }
            }

            // Update cache stamps
            const workItemTypes = [...new Set([
                ...importData.ruleGroups.map(rg => rg.workItemType),
                ...importData.globalRules.map(r => r.workItemType)
            ])];

            for (const workItemType of workItemTypes) {
                SettingsDataService.updateCacheStamp(workItemType, targetProjectId);
            }

            // Update version history if requested
            if (options.updateVersionHistory && importData.versionHistory) {
                await updateVersionHistory(targetProjectId, importData, "Imported from external source");
                result.versionHistoryUpdated = true;
            }

            // Save as template if requested
            if (options.importAsTemplate && options.templateInfo) {
                await saveToTemplateLibrary(importData);
            }

            if (result.errors.length > 0) {
                result.success = false;
            }

            return result;
        } catch (error) {
            result.success = false;
            result.errors.push(`Import failed: ${error.message}`);
            return result;
        }
    }

    /**
     * Get version history for a project
     */
    export async function getVersionHistory(projectId: string): Promise<IVersionHistoryEntry[]> {
        try {
            const history = await ExtensionDataManager.readSetting<IVersionHistoryEntry[]>(
                VERSION_HISTORY_KEY,
                [],
                "",
                projectId,
                false
            );
            return history || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Get template library
     */
    export async function getTemplateLibrary(): Promise<IOneClickExportData[]> {
        try {
            const templates = await ExtensionDataManager.readDocuments<IOneClickExportData>(
                TEMPLATE_LIBRARY_KEY
            );
            return templates || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Search templates by criteria
     */
    export async function searchTemplates(criteria: ITemplateSearchCriteria): Promise<IOneClickExportData[]> {
        const templates = await getTemplateLibrary();
        
        return templates.filter(template => {
            if (!template.templateInfo) return false;
            
            const info = template.templateInfo;
            
            // Search by name
            if (criteria.name && !info.templateName.toLowerCase().includes(criteria.name.toLowerCase())) {
                return false;
            }
            
            // Search by category
            if (criteria.category && info.templateCategory !== criteria.category) {
                return false;
            }
            
            // Search by tags
            if (criteria.tags && criteria.tags.length > 0) {
                const hasMatchingTag = criteria.tags.some(tag => 
                    info.templateTags.includes(tag)
                );
                if (!hasMatchingTag) return false;
            }
            
            // Search by work item types
            if (criteria.workItemTypes && criteria.workItemTypes.length > 0) {
                const hasMatchingWIT = criteria.workItemTypes.some(wit => 
                    template.metadata.selectedWorkItemTypes?.includes(wit)
                );
                if (!hasMatchingWIT) return false;
            }
            
            return true;
        });
    }

    /**
     * Update template usage count
     */
    export async function updateTemplateUsage(templateId: string): Promise<void> {
        try {
            const templates = await getTemplateLibrary();
            const template = templates.find(t => t.metadata.exportFormat === templateId);
            
            if (template && template.templateInfo) {
                template.templateInfo.templateUsage++;
                await ExtensionDataManager.updateDocument(
                    TEMPLATE_LIBRARY_KEY,
                    template
                );
            }
        } catch (error) {
            // Silently fail - usage tracking is not critical
        }
    }

    // Helper functions
    function shouldExportScope(exportScope: ExportScope, targetScope: ExportScope): boolean {
        return exportScope === ExportScope.All || exportScope === targetScope;
    }

    function shouldExportRuleGroups(workItemType: string, options: IExportOptions): boolean {
        if (options.exportScope === ExportScope.Custom && options.selectedWorkItemTypes) {
            return options.selectedWorkItemTypes.includes(workItemType);
        }
        return true;
    }

    function shouldExportGlobalRules(workItemType: string, options: IExportOptions): boolean {
        if (options.exportScope === ExportScope.Custom && options.selectedWorkItemTypes) {
            return options.selectedWorkItemTypes.includes(workItemType);
        }
        return true;
    }

    function filterWorkItemTypes(workItemTypes: string[], options: IExportOptions): string[] {
        if (options.exportScope === ExportScope.Custom && options.selectedWorkItemTypes) {
            return workItemTypes.filter(wit => options.selectedWorkItemTypes!.includes(wit));
        }
        return workItemTypes;
    }

    async function updateVersionHistory(projectId: string, exportData: IOneClickExportData, description?: string): Promise<void> {
        try {
            const history = await getVersionHistory(projectId);
            const newEntry: IVersionHistoryEntry = {
                version: exportData.version,
                timestamp: exportData.exportDate,
                exportedBy: exportData.exportedBy,
                description: description || `Export of type ${exportData.exportType}`,
                changes: generateChangeSummary(exportData),
                exportType: exportData.exportType,
                exportScope: exportData.exportScope
            };
            
            history.unshift(newEntry);
            
            // Keep only last 50 entries
            if (history.length > 50) {
                history.splice(50);
            }
            
            await ExtensionDataManager.writeSetting(
                VERSION_HISTORY_KEY,
                history,
                "",
                projectId,
                false
            );
        } catch (error) {
            // Silently fail - version history is not critical
        }
    }

    async function saveToTemplateLibrary(templateData: IOneClickExportData): Promise<void> {
        try {
            await ExtensionDataManager.createDocument(
                TEMPLATE_LIBRARY_KEY,
                templateData
            );
        } catch (error) {
            throw new Error(`Failed to save template: ${error.message}`);
        }
    }

    function generateChangeSummary(exportData: IOneClickExportData): string[] {
        const changes: string[] = [];
        
        changes.push(`Exported ${exportData.metadata.totalRuleGroups} rule groups`);
        changes.push(`Exported ${exportData.metadata.totalGlobalRules} global rules`);
        changes.push(`Exported ${exportData.metadata.totalWorkItemTypes} work item type settings`);
        
        if (exportData.metadata.selectedWorkItemTypes) {
            changes.push(`Selected work item types: ${exportData.metadata.selectedWorkItemTypes.join(", ")}`);
        }
        
        return changes;
    }

    function validateImportData(importData: IOneClickExportData): void {
        if (!importData.version) {
            throw new Error("Invalid export data: missing version");
        }

        if (!importData.projectSettings || !importData.projectSettings.workItemTypes) {
            throw new Error("Invalid export data: missing project settings");
        }

        if (!importData.ruleGroups) {
            throw new Error("Invalid export data: missing rule groups");
        }

        if (!importData.globalRules) {
            throw new Error("Invalid export data: missing global rules");
        }

        // Version compatibility check
        const majorVersion = parseInt(importData.version.split('.')[0]);
        const currentMajorVersion = parseInt(EXPORT_VERSION.split('.')[0]);
        
        if (majorVersion > currentMajorVersion) {
            throw new Error(`Export version ${importData.version} is not compatible with current version ${EXPORT_VERSION}`);
        }
    }

    async function getWorkItemTypesForProject(projectId: string): Promise<string[]> {
        // This would need to be implemented based on your Azure DevOps API access
        // For now, we'll return common work item types
        return ["Bug", "User Story", "Task", "Epic", "Feature", "Issue", "Test Case"];
    }

    function generateNewId(): string {
        return `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

export interface ITemplateSearchCriteria {
    name?: string;
    category?: string;
    tags?: string[];
    workItemTypes?: string[];
    minRating?: number;
    author?: string;
} 