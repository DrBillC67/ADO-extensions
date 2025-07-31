import { BaseMacro } from "./Macros";
import { MacroUtils } from "./MacroUtils";
import { TeamContext } from "TFS/Core/Contracts";
import * as WorkClient from "TFS/Work/RestClient";
import * as VSS_Service from "VSS/Service";
import { startOfDay, startOfMonth, startOfYear } from "date-fns";

/**
 * @CurrentIteration Macro
 * Resolves to the current iteration for the team context
 */
export class MacroCurrentIteration extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | any> {
        try {
            const teamContext = this.getTeamContext();
            const iteration = await this.getCurrentIteration(teamContext);
            
            if (!iteration) {
                console.warn('No current iteration found for team context:', teamContext);
                return macroStr;
            }

            return typed ? iteration : iteration.path;
        } catch (e) {
            console.warn('Failed to resolve @currentiteration macro:', e);
            return macroStr; // Fallback to original string
        }
    }

    public getName(): string {
        return "@CurrentIteration";
    }

    private async getCurrentIteration(teamContext: TeamContext): Promise<any> {
        try {
            const client = await VSS_Service.getClient<WorkClient.WorkHttpClient>(WorkClient.WorkHttpClient);
            const iterations = await client.getTeamIterations(teamContext, "current");
            
            if (iterations && iterations.length > 0) {
                return iterations[0]; // Return the first current iteration
            }
            
            return null;
        } catch (error) {
            console.error('Error fetching current iteration:', error);
            throw error;
        }
    }

    private getTeamContext(): TeamContext {
        const context = VSS.getWebContext();
        return {
            projectId: context.project.id,
            teamId: context.team.id,
            project: context.project.name,
            team: context.team.name
        };
    }
}

/**
 * @StartOfDay Macro
 * Resolves to the start of the current day (00:00:00)
 */
export class MacroStartOfDay extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        try {
            const today = new Date();
            const startOfDayDate = startOfDay(today);
            
            const operatorAndOperand = MacroUtils.getOperatorAndOperand(macroStr);
            const adjustedDate = MacroUtils.applyDateArithmetic(startOfDayDate, operatorAndOperand);

            return MacroUtils.formatDateForField(adjustedDate, typed);
        } catch (e) {
            console.warn('Failed to resolve @startofday macro:', e);
            return macroStr;
        }
    }

    public getName(): string {
        return "@StartOfDay";
    }
}

/**
 * @StartOfMonth Macro
 * Resolves to the start of the current month (1st day, 00:00:00)
 */
export class MacroStartOfMonth extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        try {
            const today = new Date();
            const startOfMonthDate = startOfMonth(today);
            
            const operatorAndOperand = MacroUtils.getOperatorAndOperand(macroStr);
            const adjustedDate = MacroUtils.applyMonthArithmetic(startOfMonthDate, operatorAndOperand);

            return MacroUtils.formatDateForField(adjustedDate, typed);
        } catch (e) {
            console.warn('Failed to resolve @startofmonth macro:', e);
            return macroStr;
        }
    }

    public getName(): string {
        return "@StartOfMonth";
    }
}

/**
 * @StartOfYear Macro
 * Resolves to the start of the current year (January 1st, 00:00:00)
 */
export class MacroStartOfYear extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | Date> {
        try {
            const today = new Date();
            const startOfYearDate = startOfYear(today);
            
            const operatorAndOperand = MacroUtils.getOperatorAndOperand(macroStr);
            const adjustedDate = MacroUtils.applyYearArithmetic(startOfYearDate, operatorAndOperand);

            return MacroUtils.formatDateForField(adjustedDate, typed);
        } catch (e) {
            console.warn('Failed to resolve @startofyear macro:', e);
            return macroStr;
        }
    }

    public getName(): string {
        return "@StartOfYear";
    }
}

/**
 * @CurrentSprint Macro (Bonus - commonly requested)
 * Resolves to the current sprint for the team context
 */
export class MacroCurrentSprint extends BaseMacro {
    public async translate(macroStr: string, typed?: boolean): Promise<string | any> {
        try {
            const teamContext = this.getTeamContext();
            const sprint = await this.getCurrentSprint(teamContext);
            
            if (!sprint) {
                console.warn('No current sprint found for team context:', teamContext);
                return macroStr;
            }

            return typed ? sprint : sprint.name;
        } catch (e) {
            console.warn('Failed to resolve @currentsprint macro:', e);
            return macroStr;
        }
    }

    public getName(): string {
        return "@CurrentSprint";
    }

    private async getCurrentSprint(teamContext: TeamContext): Promise<any> {
        try {
            const client = await VSS_Service.getClient<WorkClient.WorkHttpClient>(WorkClient.WorkHttpClient);
            const iterations = await client.getTeamIterations(teamContext, "current");
            
            // Find the first iteration that is a sprint (not a release)
            const sprint = iterations.find(iteration => 
                iteration.attributes && 
                iteration.attributes.timeFrame === "current"
            );
            
            return sprint || null;
        } catch (error) {
            console.error('Error fetching current sprint:', error);
            throw error;
        }
    }

    private getTeamContext(): TeamContext {
        const context = VSS.getWebContext();
        return {
            projectId: context.project.id,
            teamId: context.team.id,
            project: context.project.name,
            team: context.team.name
        };
    }
} 