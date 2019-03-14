import {
    updateActiveCell,
    isActiveCell,
    syncActiveCell,
    updateTabIndexActiveCell,
    updateTabIndexActiveRow,
    updateRowNavigationMode,
    getRowParent,
    isActiveCellAnExitCell,
} from './../keyboard';
import { DATATABLE_STATE } from './../__mocks__/data';

function getDeepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

describe('keyboard utils', () => {
    describe('updateActiveCell', () => {
        it('should update the state.activeCell values', () => {
            const state = {};
            const rowKeyValue = 'a';
            const colKeyValue = 'name-text';
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(state.activeCell).toEqual({ rowKeyValue, colKeyValue });
        });
    });

    describe('isActiveCell', () => {
        it('should return true is the value passed are the same of current activeCell value', () => {
            const rowKeyValue = 'a';
            const colKeyValue = 'name-text';
            const state = { activeCell: { rowKeyValue, colKeyValue } };
            expect(isActiveCell(state, rowKeyValue, colKeyValue)).toBe(true);
        });

        it('should return false is the value passed are not the same of current activeCell value', () => {
            const rowKeyValue = 'a';
            const colKeyValue = 'name-text';
            const state = { activeCell: null };
            expect(isActiveCell(state, rowKeyValue, colKeyValue)).toBe(false);
        });
    });
    describe('syncActiveCell', () => {
        it('should set default if there is not previous activeCell', () => {
            const state = syncActiveCell(Object.assign({}, DATATABLE_STATE));
            const expected = {
                rowKeyValue: 'a',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
        });
        it('should default it to headers if there is no rows', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.rows = [];

            const state = syncActiveCell(currentState);
            const expected = {
                rowKeyValue: 'HEADER',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
        });
        it('should default it customer data', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.columns[0].internal = true;

            const state = syncActiveCell(currentState);
            const expected = {
                rowKeyValue: 'a',
                colKeyValue: 'amount-number',
            };
            expect(state.activeCell).toEqual(expected);
        });
        it('should default it to first column if there is no customer column', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.columns.forEach(column => (column.internal = true));

            const state = syncActiveCell(currentState);
            const expected = {
                rowKeyValue: 'a',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
        });
    });
    describe('updateTabIndexActiveCell', () => {
        it('should set the tabindex', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.activeCell = {
                rowKeyValue: 'a',
                colKeyValue: 'name-text',
            };

            const state = updateTabIndexActiveCell(currentState);
            const expected = {
                rowKeyValue: 'a',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
            expect(state.rows[0].cells[0].tabIndex).toBe(0);
        });

        it('should syncActiveCell if there is an invalid active cell', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.activeCell = {
                rowKeyValue: 'non-existing-row',
                colKeyValue: 'non-existing-columnt',
            };

            const state = updateTabIndexActiveCell(currentState);
            const expected = {
                rowKeyValue: 'a',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
            expect(state.rows[0].cells[0].tabIndex).toBe(0);
        });
    });
    describe('updateTabIndexActiveRow', () => {
        it('should set the tabindex of row if in rowMode', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.activeCell = {
                rowKeyValue: 'b',
                colKeyValue: 'name-text',
            };
            currentState.keyboardMode = 'NAVIGATION';
            currentState.rowMode = true;

            const state = updateTabIndexActiveRow(currentState);
            const expected = {
                rowKeyValue: 'b',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
            expect(state.rows[1].tabIndex).toBe(0);
        });

        it('should syncActiveCell if there is an invalid active cell', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.activeCell = {
                rowKeyValue: 'non-existing-row',
                colKeyValue: 'non-existing-columnt',
            };
            currentState.keyboardMode = 'NAVIGATION';
            currentState.rowMode = true;

            const state = updateTabIndexActiveRow(currentState);
            const expected = {
                rowKeyValue: 'a',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
            expect(state.rows[0].tabIndex).toBe(0);
        });

        it('should keep tabindex of row to -1 if not in rowMode', () => {
            const currentState = getDeepClone(DATATABLE_STATE);
            currentState.activeCell = {
                rowKeyValue: 'b',
                colKeyValue: 'name-text',
            };
            currentState.rowMode = false;

            const state = updateTabIndexActiveRow(currentState);
            const expected = {
                rowKeyValue: 'b',
                colKeyValue: 'name-text',
            };
            expect(state.activeCell).toEqual(expected);
            expect(state.rows[1].tabIndex).toBe(undefined);
        });
    });
    describe('updateRowNavigationMode', () => {
        it('sets to rowMode false if there is no tree column', () => {
            let state = {
                rowMode: true,
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'text' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            const hadTreeDataTypePreviously = true;

            state = updateRowNavigationMode(hadTreeDataTypePreviously, state);
            expect(state.rowMode).toBe(false);
        });

        it('keeps rowMode true if it was true and there is tree type column', () => {
            let state = {
                rowMode: true,
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'tree' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            const hadTreeDataTypePreviously = true;

            state = updateRowNavigationMode(hadTreeDataTypePreviously, state);
            expect(state.rowMode).toBe(true);
        });

        it('keeps rowMode false if it was false and there was tree type column', () => {
            let state = {
                rowMode: false,
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'tree' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            const hadTreeDataTypePreviously = true;

            state = updateRowNavigationMode(hadTreeDataTypePreviously, state);
            expect(state.rowMode).toBe(false);
        });
        it('resets rowMode to true if it was false and there was no tree type column', () => {
            let state = {
                rowMode: false,
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'tree' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            const hadTreeDataTypePreviously = false;

            state = updateRowNavigationMode(hadTreeDataTypePreviously, state);
            expect(state.rowMode).toBe(true);
        });
    });
    describe('getRowParent', () => {
        it('returns correct parent row', () => {
            const state = {
                rows: [
                    {
                        key: 'a',
                        level: 1,
                        isSelected: false,
                        classnames: 'slds-hint-parent',
                    },
                    {
                        key: 'b',
                        level: 2,
                        isSelected: true,
                        classnames: 'slds-hint-parent slds-is-selected',
                    },
                    {
                        key: 'c',
                        isSelected: false,
                        level: 2,
                        classnames: 'slds-hint-parent',
                    },
                ],
            };
            const index = getRowParent(state, 2, 2);
            expect(index).toBe(0);
        });

        it('returns -1 if there is no parent at that level', () => {
            const state = {
                rows: [
                    {
                        key: 'a',
                        level: 2,
                        isSelected: false,
                        classnames: 'slds-hint-parent',
                    },
                    {
                        key: 'b',
                        level: 2,
                        isSelected: true,
                        classnames: 'slds-hint-parent slds-is-selected',
                    },
                    {
                        key: 'c',
                        isSelected: false,
                        level: 2,
                        classnames: 'slds-hint-parent',
                    },
                ],
            };
            const index = getRowParent(state, 2, 2);
            expect(index).toBe(-1);
        });
        it('returns -1 if it is row with level 1', () => {
            const state = {
                rows: [
                    {
                        key: 'a',
                        level: 1,
                        isSelected: false,
                        classnames: 'slds-hint-parent',
                    },
                    {
                        key: 'b',
                        level: 1,
                        isSelected: true,
                        classnames: 'slds-hint-parent slds-is-selected',
                    },
                    {
                        key: 'c',
                        isSelected: false,
                        level: 1,
                        classnames: 'slds-hint-parent',
                    },
                ],
            };
            const index = getRowParent(state, 1, 2);
            expect(index).toBe(-1);
        });
        it('returns -1 if it is already row at index 0', () => {
            const state = {
                rows: [
                    {
                        key: 'a',
                        level: 1,
                        isSelected: false,
                        classnames: 'slds-hint-parent',
                    },
                    {
                        key: 'b',
                        level: 1,
                        isSelected: true,
                        classnames: 'slds-hint-parent slds-is-selected',
                    },
                    {
                        key: 'c',
                        isSelected: false,
                        level: 1,
                        classnames: 'slds-hint-parent',
                    },
                ],
            };
            const index = getRowParent(state, 2, 0);
            expect(index).toBe(-1);
        });
    });

    describe('is the active cell an exit cell', () => {
        it('should be false when not in first or last cell of grid and moving right (tab)', () => {
            const state = getDeepClone(DATATABLE_STATE);
            const rowKeyValue = 'b';
            const colKeyValue = 'amount-number';
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(isActiveCellAnExitCell(state, 'RIGHT')).toBe(false);
        });

        it('should be false when not in first or last cell of grid and moving left (shift+tab)', () => {
            const state = getDeepClone(DATATABLE_STATE);
            const rowKeyValue = 'b';
            const colKeyValue = 'amount-number';
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(isActiveCellAnExitCell(state, 'LEFT')).toBe(false);
        });

        it('should be false when in first cell of grid and moving right (tab)', () => {
            const state = getDeepClone(DATATABLE_STATE);
            const firstColumn = state.columns[0];
            const rowKeyValue = 'HEADER';
            const colKeyValue = firstColumn.fieldName + '-' + firstColumn.type;
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(isActiveCellAnExitCell(state, 'RIGHT')).toBe(false);
        });

        it('should be true when in first cell of grid and moving left (shift+tab)', () => {
            const state = getDeepClone(DATATABLE_STATE);
            const firstColumn = state.columns[0];
            const rowKeyValue = 'HEADER';
            const colKeyValue = firstColumn.fieldName + '-' + firstColumn.type;
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(isActiveCellAnExitCell(state, 'LEFT')).toBe(true);
        });

        it('should be true when in last cell of grid and moving right (tab)', () => {
            const state = getDeepClone(DATATABLE_STATE);
            const lastRow = state.rows[state.rows.length - 1];
            const lastColumn = state.columns[state.columns.length - 1];
            const rowKeyValue = lastRow.key;
            const colKeyValue = lastColumn.fieldName + '-' + lastColumn.type;
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(isActiveCellAnExitCell(state, 'RIGHT')).toBe(true);
        });

        it('should be false when in last cell of grid and moving left (shift+tab)', () => {
            const state = getDeepClone(DATATABLE_STATE);
            const lastRow = state.rows[state.rows.length - 1];
            const lastColumn = state.columns[state.columns.length - 1];
            const rowKeyValue = lastRow.key;
            const colKeyValue = lastColumn.fieldName + '-' + lastColumn.type;
            updateActiveCell(state, rowKeyValue, colKeyValue);
            expect(isActiveCellAnExitCell(state, 'LEFT')).toBe(false);
        });
    });
});
