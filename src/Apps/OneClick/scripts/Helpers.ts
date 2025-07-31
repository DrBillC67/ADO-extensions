import { isInteger, isNumeric } from "Common/Utilities/Number";
import { stringEquals } from "Common/Utilities/String";
import { parse } from "date-fns";
import { Constants } from "OneClick/Constants";
import { IRuleGroup } from "OneClick/Interfaces";
import * as Macros from "OneClick/Macros/Macros";
import * as WitContracts from "TFS/WorkItemTracking/Contracts";

export function isPersonalRuleGroup(ruleGroup: IRuleGroup): boolean {
    return ruleGroup && ruleGroup.id === Constants.PersonalRuleGroupId;
}

export function isGlobalRuleGroup(ruleGroup: IRuleGroup): boolean {
    return ruleGroup && ruleGroup.id === Constants.GlobalRuleGroupId;
}

export function isPersonalOrGlobalRuleGroup(ruleGroup: IRuleGroup): boolean {
    return isPersonalRuleGroup(ruleGroup) || isGlobalRuleGroup(ruleGroup);
}

export function getRuleGroupUrl(witName: string, ruleGroupId: string): string {
    const { collection, project } = VSS.getWebContext();
    const extensionId = `${VSS.getExtensionContext().publisherId}.${VSS.getExtensionContext().extensionId}`;
    return `${collection.uri}/${project.name}/_apps/hub/${extensionId}.settings-hub?witName=${witName}&ruleGroup=${ruleGroupId}`;
}

export async function translateToFieldValue(value: string, fieldType?: WitContracts.FieldType): Promise<any> {
    if (Macros.BaseMacro.isMacro(value) && Macros.BaseMacro.getMacroType(value)) {
        const macroType = Macros.BaseMacro.getMacroType(value);
        return new macroType().translate(value, true);
    } else {
        switch (fieldType) {
            case WitContracts.FieldType.Boolean:
                return stringEquals(value, "True", true) || stringEquals(value, "1", true);
            case WitContracts.FieldType.DateTime:
                return parse(value, "yyyy-MM-dd", new Date()) || value;
            case WitContracts.FieldType.Double:
                return isNumeric(value) ? parseFloat(value) : value;
            case WitContracts.FieldType.Integer:
                return isInteger(value) ? parseInt(value, 10) : value;
            default:
                return value;
        }
    }
}

export function isAnyMacro(value: string): boolean {
    return stringEquals(value, Constants.AnyMacro, true);
}

export function validateMacro(macroStr: string): { isValid: boolean; error?: string } {
    if (!macroStr || !macroStr.startsWith("@")) {
        return { isValid: false, error: "Macro must start with @" };
    }

    const macroName = macroStr.split(/[=+-]/)[0].toUpperCase();
    const supportedMacros = [
        "@ME", "@TODAY", "@FIELDVALUE", "@ANY",
        "@CURRENTITERATION", "@STARTOFDAY", "@STARTOFMONTH", "@STARTOFYEAR", "@CURRENTSPRINT"
    ];

    if (!supportedMacros.includes(macroName)) {
        return { 
            isValid: false, 
            error: `Unsupported macro: ${macroName}. Supported macros: ${supportedMacros.join(", ")}` 
        };
    }

    // Validate macro-specific syntax
    if (macroName === "@FIELDVALUE" && !macroStr.includes("=")) {
        return { 
            isValid: false, 
            error: "@FieldValue macro requires field name after = (e.g., @FieldValue=System.AssignedTo)" 
        };
    }

    // Validate arithmetic operators for date macros
    const dateMacros = ["@TODAY", "@STARTOFDAY", "@STARTOFMONTH", "@STARTOFYEAR"];
    if (dateMacros.includes(macroName)) {
        const hasOperator = /[+-]\d+$/.test(macroStr);
        if (hasOperator) {
            const operand = macroStr.match(/[+-](\d+)$/)[1];
            if (isNaN(parseInt(operand))) {
                return { 
                    isValid: false, 
                    error: `Invalid operand in ${macroName} macro. Expected number after + or -` 
                };
            }
        }
    }

    return { isValid: true };
}
