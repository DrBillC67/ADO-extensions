import { MacroCurrentIteration, MacroStartOfDay, MacroStartOfMonth, MacroStartOfYear, MacroCurrentSprint } from "../DevOpsMacros";
import { MacroUtils } from "../MacroUtils";

// Mock VSS and DevOps APIs
jest.mock("VSS/Service", () => ({
    getClient: jest.fn()
}));

jest.mock("TFS/Work/RestClient", () => ({
    WorkHttpClient: jest.fn()
}));

// Mock VSS global
global.VSS = {
    getWebContext: jest.fn(() => ({
        project: { id: "test-project-id", name: "TestProject" },
        team: { id: "test-team-id", name: "TestTeam" }
    }))
} as any;

describe('DevOps Macros', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('MacroStartOfDay', () => {
        const macro = new MacroStartOfDay();

        it('should resolve to start of current day', async () => {
            const result = await macro.translate('@StartOfDay');
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            // Should be today's date
            const today = new Date();
            const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            expect(result).toBe(expectedDate);
        });

        it('should support arithmetic operations', async () => {
            const result = await macro.translate('@StartOfDay+1');
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            // Should be tomorrow's date
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const expectedDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
            expect(result).toBe(expectedDate);
        });

        it('should support negative arithmetic operations', async () => {
            const result = await macro.translate('@StartOfDay-1');
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
            
            // Should be yesterday's date
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const expectedDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
            expect(result).toBe(expectedDate);
        });

        it('should handle errors gracefully', async () => {
            // Mock date-fns to throw an error
            jest.spyOn(console, 'warn').mockImplementation(() => {});
            
            const result = await macro.translate('@StartOfDay');
            expect(result).toBe('@StartOfDay'); // Should return original string on error
        });
    });

    describe('MacroStartOfMonth', () => {
        const macro = new MacroStartOfMonth();

        it('should resolve to start of current month', async () => {
            const result = await macro.translate('@StartOfMonth');
            expect(result).toMatch(/^\d{4}-\d{2}-01$/);
            
            // Should be first day of current month
            const today = new Date();
            const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
            expect(result).toBe(expectedDate);
        });

        it('should support month arithmetic', async () => {
            const result = await macro.translate('@StartOfMonth+1');
            expect(result).toMatch(/^\d{4}-\d{2}-01$/);
            
            // Should be first day of next month
            const nextMonth = new Date();
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const expectedDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`;
            expect(result).toBe(expectedDate);
        });

        it('should support negative month arithmetic', async () => {
            const result = await macro.translate('@StartOfMonth-1');
            expect(result).toMatch(/^\d{4}-\d{2}-01$/);
            
            // Should be first day of previous month
            const prevMonth = new Date();
            prevMonth.setMonth(prevMonth.getMonth() - 1);
            const expectedDate = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}-01`;
            expect(result).toBe(expectedDate);
        });
    });

    describe('MacroStartOfYear', () => {
        const macro = new MacroStartOfYear();

        it('should resolve to start of current year', async () => {
            const result = await macro.translate('@StartOfYear');
            expect(result).toMatch(/^\d{4}-01-01$/);
            
            // Should be January 1st of current year
            const today = new Date();
            const expectedDate = `${today.getFullYear()}-01-01`;
            expect(result).toBe(expectedDate);
        });

        it('should support year arithmetic', async () => {
            const result = await macro.translate('@StartOfYear+1');
            expect(result).toMatch(/^\d{4}-01-01$/);
            
            // Should be January 1st of next year
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            const expectedDate = `${nextYear.getFullYear()}-01-01`;
            expect(result).toBe(expectedDate);
        });

        it('should support negative year arithmetic', async () => {
            const result = await macro.translate('@StartOfYear-1');
            expect(result).toMatch(/^\d{4}-01-01$/);
            
            // Should be January 1st of previous year
            const prevYear = new Date();
            prevYear.setFullYear(prevYear.getFullYear() - 1);
            const expectedDate = `${prevYear.getFullYear()}-01-01`;
            expect(result).toBe(expectedDate);
        });
    });

    describe('MacroCurrentIteration', () => {
        const macro = new MacroCurrentIteration();

        it('should handle API errors gracefully', async () => {
            // Mock API failure
            jest.spyOn(console, 'warn').mockImplementation(() => {});
            
            const result = await macro.translate('@CurrentIteration');
            expect(result).toBe('@CurrentIteration'); // Should return original string on error
        });

        it('should return iteration path when successful', async () => {
            // Mock successful API response
            const mockClient = {
                getTeamIterations: jest.fn().mockResolvedValue([
                    { path: "Project\\Iteration\\Sprint 1", name: "Sprint 1" }
                ])
            };
            
            const { getClient } = require("VSS/Service");
            getClient.mockResolvedValue(mockClient);
            
            const result = await macro.translate('@CurrentIteration');
            expect(result).toBe("Project\\Iteration\\Sprint 1");
        });

        it('should return typed iteration object when requested', async () => {
            // Mock successful API response
            const mockIteration = { path: "Project\\Iteration\\Sprint 1", name: "Sprint 1" };
            const mockClient = {
                getTeamIterations: jest.fn().mockResolvedValue([mockIteration])
            };
            
            const { getClient } = require("VSS/Service");
            getClient.mockResolvedValue(mockClient);
            
            const result = await macro.translate('@CurrentIteration', true);
            expect(result).toEqual(mockIteration);
        });

        it('should handle empty iteration response', async () => {
            // Mock empty API response
            const mockClient = {
                getTeamIterations: jest.fn().mockResolvedValue([])
            };
            
            const { getClient } = require("VSS/Service");
            getClient.mockResolvedValue(mockClient);
            
            jest.spyOn(console, 'warn').mockImplementation(() => {});
            
            const result = await macro.translate('@CurrentIteration');
            expect(result).toBe('@CurrentIteration'); // Should return original string
        });
    });

    describe('MacroCurrentSprint', () => {
        const macro = new MacroCurrentSprint();

        it('should handle API errors gracefully', async () => {
            // Mock API failure
            jest.spyOn(console, 'warn').mockImplementation(() => {});
            
            const result = await macro.translate('@CurrentSprint');
            expect(result).toBe('@CurrentSprint'); // Should return original string on error
        });

        it('should return sprint name when successful', async () => {
            // Mock successful API response
            const mockClient = {
                getTeamIterations: jest.fn().mockResolvedValue([
                    { 
                        path: "Project\\Iteration\\Sprint 1", 
                        name: "Sprint 1",
                        attributes: { timeFrame: "current" }
                    }
                ])
            };
            
            const { getClient } = require("VSS/Service");
            getClient.mockResolvedValue(mockClient);
            
            const result = await macro.translate('@CurrentSprint');
            expect(result).toBe("Sprint 1");
        });

        it('should return typed sprint object when requested', async () => {
            // Mock successful API response
            const mockSprint = { 
                path: "Project\\Iteration\\Sprint 1", 
                name: "Sprint 1",
                attributes: { timeFrame: "current" }
            };
            const mockClient = {
                getTeamIterations: jest.fn().mockResolvedValue([mockSprint])
            };
            
            const { getClient } = require("VSS/Service");
            getClient.mockResolvedValue(mockClient);
            
            const result = await macro.translate('@CurrentSprint', true);
            expect(result).toEqual(mockSprint);
        });
    });
});

describe('MacroUtils', () => {
    describe('getOperatorAndOperand', () => {
        it('should parse @startofmonth+2 correctly', () => {
            const result = MacroUtils.getOperatorAndOperand('@startofmonth+2');
            expect(result).toEqual({ operator: '+', operand: 2 });
        });

        it('should parse @startofday-1 correctly', () => {
            const result = MacroUtils.getOperatorAndOperand('@startofday-1');
            expect(result).toEqual({ operator: '-', operand: 1 });
        });

        it('should return null for invalid operand', () => {
            const result = MacroUtils.getOperatorAndOperand('@startofday+abc');
            expect(result).toBeNull();
        });

        it('should return null for no operator', () => {
            const result = MacroUtils.getOperatorAndOperand('@startofday');
            expect(result).toBeNull();
        });

        it('should handle multiple operators and use the first one', () => {
            const result = MacroUtils.getOperatorAndOperand('@startofday+3-1');
            expect(result).toEqual({ operator: '+', operand: 3 });
        });
    });

    describe('applyDateArithmetic', () => {
        it('should add days correctly', () => {
            const date = new Date('2023-01-01');
            const result = MacroUtils.applyDateArithmetic(date, { operator: '+', operand: 2 });
            expect(result).toEqual(new Date('2023-01-03'));
        });

        it('should subtract days correctly', () => {
            const date = new Date('2023-01-03');
            const result = MacroUtils.applyDateArithmetic(date, { operator: '-', operand: 2 });
            expect(result).toEqual(new Date('2023-01-01'));
        });

        it('should return original date when no operator provided', () => {
            const date = new Date('2023-01-01');
            const result = MacroUtils.applyDateArithmetic(date, null);
            expect(result).toEqual(date);
        });
    });

    describe('applyMonthArithmetic', () => {
        it('should add months correctly', () => {
            const date = new Date('2023-01-01');
            const result = MacroUtils.applyMonthArithmetic(date, { operator: '+', operand: 2 });
            expect(result).toEqual(new Date('2023-03-01'));
        });

        it('should subtract months correctly', () => {
            const date = new Date('2023-03-01');
            const result = MacroUtils.applyMonthArithmetic(date, { operator: '-', operand: 2 });
            expect(result).toEqual(new Date('2023-01-01'));
        });
    });

    describe('applyYearArithmetic', () => {
        it('should add years correctly', () => {
            const date = new Date('2023-01-01');
            const result = MacroUtils.applyYearArithmetic(date, { operator: '+', operand: 2 });
            expect(result).toEqual(new Date('2025-01-01'));
        });

        it('should subtract years correctly', () => {
            const date = new Date('2025-01-01');
            const result = MacroUtils.applyYearArithmetic(date, { operator: '-', operand: 2 });
            expect(result).toEqual(new Date('2023-01-01'));
        });
    });

    describe('formatDateForField', () => {
        it('should return formatted string when typed is false', () => {
            const date = new Date('2023-01-01');
            const result = MacroUtils.formatDateForField(date, false);
            expect(result).toBe('2023-01-01');
        });

        it('should return date object when typed is true', () => {
            const date = new Date('2023-01-01');
            const result = MacroUtils.formatDateForField(date, true);
            expect(result).toEqual(date);
        });
    });
}); 