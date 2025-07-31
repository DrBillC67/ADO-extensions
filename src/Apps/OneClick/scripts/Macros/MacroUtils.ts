import { isInteger } from "Common/Utilities/Number";
import { addDays, addMonths, addYears, startOfDay, startOfMonth, startOfYear } from "date-fns";
import { format } from "date-fns";

export interface OperatorAndOperand {
    operator: string;
    operand: number;
}

export class MacroUtils {
    private static allowedOperands = ["-", "+"];

    /**
     * Extracts operator and operand from macro string
     * Example: "@startofmonth-2" returns { operator: "-", operand: 2 }
     */
    public static getOperatorAndOperand(macroStr: string): OperatorAndOperand | null {
        let operator = "";
        let operatorIndex = -1;

        for (const sep of this.allowedOperands) {
            const index = macroStr.indexOf(sep);
            if (index !== -1 && (operatorIndex === -1 || index < operatorIndex)) {
                operatorIndex = index;
                operator = sep;
            }
        }

        if (operator) {
            const operand = macroStr.substring(operatorIndex + 1);
            if (isInteger(operand)) {
                return {
                    operator,
                    operand: parseInt(operand, 10)
                };
            }
        }

        return null;
    }

    /**
     * Applies date arithmetic based on operator and operand
     */
    public static applyDateArithmetic(date: Date, operatorAndOperand: OperatorAndOperand | null): Date {
        if (!operatorAndOperand) {
            return date;
        }

        const { operator, operand } = operatorAndOperand;

        switch (operator) {
            case "-":
                return addDays(date, operand * -1);
            case "+":
                return addDays(date, operand);
            default:
                return date;
        }
    }

    /**
     * Applies month arithmetic
     */
    public static applyMonthArithmetic(date: Date, operatorAndOperand: OperatorAndOperand | null): Date {
        if (!operatorAndOperand) {
            return date;
        }

        const { operator, operand } = operatorAndOperand;

        switch (operator) {
            case "-":
                return addMonths(date, operand * -1);
            case "+":
                return addMonths(date, operand);
            default:
                return date;
        }
    }

    /**
     * Applies year arithmetic
     */
    public static applyYearArithmetic(date: Date, operatorAndOperand: OperatorAndOperand | null): Date {
        if (!operatorAndOperand) {
            return date;
        }

        const { operator, operand } = operatorAndOperand;

        switch (operator) {
            case "-":
                return addYears(date, operand * -1);
            case "+":
                return addYears(date, operand);
            default:
                return date;
        }
    }

    /**
     * Formats date for field value
     */
    public static formatDateForField(date: Date, typed: boolean): string | Date {
        return typed ? date : format(date, "yyyy-MM-dd");
    }
} 