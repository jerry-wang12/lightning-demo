import {
    markRowSelected,
    markRowDeselected,
    markAllRowsSelected,
    markAllRowsDeselected,
    syncSelectedRowsKeys,
    getSelectorDefaultState,
    getMaxRowSelection,
    setMaxRowSelection,
    isSelectedRow,
    getSelectedRowsKeys,
    setSelectedRowsKeys,
    getCurrentSelectionLength,
    markDeselectedRowDisabled,
    markDeselectedRowEnabled,
    resetSelectedRowsKeys,
    isDisabledRow,
    getRowSelectionInputType,
    updateRowSelectionInputType,
    inputTypeNeedsToChange,
    handleSelectRow,
    handleDeselectRow,
} from './../selector';

function getDtMock(overrides) {
    const dt = {
        state: {},
        fireSelectedRowsChange: jest.fn(),
        getSelectedRows: jest.fn(),
    };
    return Object.assign({}, dt, overrides);
}

describe('datatable rows selector', () => {
    describe('handleSelectRow', () => {
        const indexes = {
            abc: { a: [0, 0], rowIndex: 0 },
            dfg: { a: [1, 0], rowIndex: 1 },
            '123': { a: [2, 0], rowIndex: 2 },
        };
        const getEventMock = rowKeyValue => {
            return {
                stopPropagation: jest.fn(),
                detail: {
                    rowKeyValue,
                    isMultiple: true,
                },
            };
        };

        it('should stop propagation and fire selected rows change', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: true, key: 'abc' },
                        { isSelected: false, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: {
                        abc: true,
                    },
                    maxRowSelection: 2,
                    indexes,
                },
            });
            const evtMock = getEventMock('abc');

            handleSelectRow.call(dtMock, evtMock);
            expect(evtMock.stopPropagation.mock.calls).toHaveLength(1);
            expect(dtMock.fireSelectedRowsChange.mock.calls).toHaveLength(1);
        });
        it('should mark only the one that is selected', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: false, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: {},
                    maxRowSelection: 2,
                    indexes,
                },
            });
            const evtMock = getEventMock('dfg');

            handleSelectRow.call(dtMock, evtMock);
            expect(Object.keys(dtMock.state.selectedRowsKeys)).toHaveLength(1);
            expect(dtMock.state.rows[1].isSelected).toBe(true);
        });
        it('should mark only the one that is selected when lastRowSelection is invalid', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: false, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: {},
                    maxRowSelection: 2,
                    selectionLastSelectedRow: 'invalid-row-key',
                    indexes,
                },
            });
            const evtMock = getEventMock('dfg');

            handleSelectRow.call(dtMock, evtMock);
            expect(Object.keys(dtMock.state.selectedRowsKeys)).toHaveLength(1);
            expect(dtMock.state.rows[1].isSelected).toBe(true);
        });
        it('should mark all rows from lastSelected to the clicked row', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: false, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: {},
                    maxRowSelection: 2,
                    selectionLastSelectedRow: 'abc',
                    indexes,
                },
            });
            const evtMock = getEventMock('dfg');

            handleSelectRow.call(dtMock, evtMock);
            expect(Object.keys(dtMock.state.selectedRowsKeys)).toHaveLength(2);
            expect(dtMock.state.rows[0].isSelected).toBe(true);
            expect(dtMock.state.rows[1].isSelected).toBe(true);
        });
        it('should disable row selections when reach max row selection', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: false, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: {},
                    maxRowSelection: 2,
                    selectionLastSelectedRow: '123',
                    indexes,
                },
            });
            const evtMock = getEventMock('abc');

            handleSelectRow.call(dtMock, evtMock);
            expect(Object.keys(dtMock.state.selectedRowsKeys)).toHaveLength(2);
            expect(dtMock.state.rows[0].isSelected).toBe(true);
            expect(dtMock.state.rows[1].isSelected).toBe(true);
            expect(dtMock.state.rows[2].isSelected).toBe(false);
            expect(dtMock.state.rows[2].isDisabled).toBe(true);
        });
        it('should disable row selections when reach max row selection and has previous selection', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: true, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: { dfg: true },
                    maxRowSelection: 2,
                    selectionLastSelectedRow: 'abc',
                    indexes,
                },
            });
            const evtMock = getEventMock('123');

            handleSelectRow.call(dtMock, evtMock);
            expect(Object.keys(dtMock.state.selectedRowsKeys)).toHaveLength(2);
            expect(dtMock.state.rows[0].isSelected).toBe(true);
            expect(dtMock.state.rows[1].isSelected).toBe(true);
            expect(dtMock.state.rows[2].isSelected).toBe(false);
            expect(dtMock.state.rows[2].isDisabled).toBe(true);
        });
    });

    describe('handleDeselectRow', () => {
        const indexes = {
            abc: { a: [0, 0], rowIndex: 0 },
            dfg: { a: [1, 0], rowIndex: 1 },
            '123': { a: [2, 0], rowIndex: 2 },
        };
        const getEventMock = rowKeyValue => {
            return {
                stopPropagation: jest.fn(),
                detail: {
                    rowKeyValue,
                    isMultiple: true,
                },
            };
        };

        it('should stop propagation and fire selected rows change', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: true, key: 'abc' },
                        { isSelected: false, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: {
                        abc: true,
                    },
                    maxRowSelection: 2,
                    indexes,
                },
            });
            const evtMock = getEventMock();

            handleDeselectRow.call(dtMock, evtMock);
            expect(evtMock.stopPropagation.mock.calls).toHaveLength(1);
            expect(dtMock.fireSelectedRowsChange.mock.calls).toHaveLength(1);
        });
        it('should deselect only the one that is selected', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: true, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: { dfg: true },
                    maxRowSelection: 2,
                    indexes,
                },
            });
            const evtMock = getEventMock('dfg');

            handleDeselectRow.call(dtMock, evtMock);
            expect(dtMock.state.rows[1].isSelected).toBe(false);
        });
        it('should deselect only the one that is selected when lastRowSelection is invalid', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: true, key: 'dfg' },
                        { isSelected: false, key: '123' },
                    ],
                    selectedRowsKeys: { dfg: true },
                    maxRowSelection: 2,
                    selectionLastSelectedRow: 'invalid-row-key',
                    indexes,
                },
            });
            const evtMock = getEventMock('dfg');

            handleDeselectRow.call(dtMock, evtMock);
            expect(dtMock.state.rows[1].isSelected).toBe(false);
        });
        it('should deselect all rows from lastSelected to the clicked row', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: false, key: 'abc' },
                        { isSelected: true, key: 'dfg' },
                        { isSelected: true, key: '123' },
                    ],
                    selectedRowsKeys: { dfg: true, '123': true },
                    maxRowSelection: 2,
                    selectionLastSelectedRow: '123',
                    indexes,
                },
            });
            const evtMock = getEventMock('abc');

            handleDeselectRow.call(dtMock, evtMock);
            expect(dtMock.state.rows[0].isSelected).toBe(false);
            expect(dtMock.state.rows[1].isSelected).toBe(false);
            expect(dtMock.state.rows[2].isSelected).toBe(false);
        });
        it('should enable row selections when deselecting', () => {
            const dtMock = getDtMock({
                state: {
                    rows: [
                        { isSelected: true, key: 'abc' },
                        { isSelected: false, isDisabled: true, key: 'dfg' },
                        { isSelected: true, key: '123' },
                    ],
                    selectedRowsKeys: { abc: true, '123': true },
                    maxRowSelection: 2,
                    selectionLastSelectedRow: '123',
                    indexes,
                },
            });
            const evtMock = getEventMock('abc');

            handleDeselectRow.call(dtMock, evtMock);
            expect(dtMock.state.rows[0].isSelected).toBe(false);
            expect(dtMock.state.rows[1].isSelected).toBe(false);
            expect(dtMock.state.rows[2].isSelected).toBe(false);
            expect(dtMock.state.rows[1].isDisabled).toBe(false);
        });
    });

    describe('getRowSelectionInputType', () => {
        it('should return "radio" when maxRowSelection is 1', () => {
            const state = {
                maxRowSelection: 1,
            };
            expect(getRowSelectionInputType(state)).toBe('radio');
        });
        it('should return "checkbox" when maxRowSelection is different 1', () => {
            const state = {
                maxRowSelection: 2,
            };
            expect(getRowSelectionInputType(state)).toBe('checkbox');
        });
        it('should return "checkbox" when maxRowSelection undefined', () => {
            const state = {};
            expect(getRowSelectionInputType(state)).toBe('checkbox');
        });
    });
    describe('inputTypeNeedsToChange', () => {
        it('should return true when maxRowSelection move from 1 to > then 1', () => {
            expect(inputTypeNeedsToChange(1, 100)).toBe(true);
        });
        it('should return true when maxRowSelection move from > 1 to  1', () => {
            expect(inputTypeNeedsToChange(100, 1)).toBe(true);
        });
        it('should return false when maxRowSelection move from > 1 to > 1', () => {
            expect(inputTypeNeedsToChange(100, 150)).toBe(false);
        });
        it('should return false when maxRowSelection move from 1 to 1', () => {
            expect(inputTypeNeedsToChange(1, 1)).toBe(false);
        });
        it('should return true when maxRowSelection move from undefined to 1', () => {
            expect(inputTypeNeedsToChange(undefined, 1)).toBe(true);
        });
    });
    describe('updateRowSelectionInputType', () => {
        it('should update row.inputType to "radio" for all the rows in state when maxRowSelection = 1', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                },
                maxRowSelection: 1,
            };
            updateRowSelectionInputType(state);
            state.rows.forEach(row => {
                expect(row.inputType).toBe('radio');
            });
        });
        it('should update row.inputType to "checkbox" for all the rows in state when maxRowSelection is > 1', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                maxRowSelection: 2,
            };
            updateRowSelectionInputType(state);
            state.rows.forEach(row => {
                expect(row.inputType).toBe('checkbox');
            });
        });
        it('should reset selectRowsKeys collection', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                maxRowSelection: 2,
            };
            updateRowSelectionInputType(state);
            expect(state.selectedRowsKeys).toEqual({});
        });
        it('should mark deselect all rows', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                maxRowSelection: 2,
            };
            updateRowSelectionInputType(state);
            state.rows.forEach(row => {
                expect(row.isSelected).toBe(false);
            });
        });
        it('should enabled all rows when maxRowSelection > 0', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                maxRowSelection: 2,
            };
            updateRowSelectionInputType(state);
            state.rows.forEach(row => {
                expect(row.isDisabled).toBe(false);
            });
        });
        it('should disabled all rows when maxRowSelection = 0', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: {},
                maxRowSelection: 0,
            };
            updateRowSelectionInputType(state);
            state.rows.forEach(row => {
                expect(row.isDisabled).toBe(true);
            });
        });
    });
    describe('resetSelectedRowsKeys', () => {
        it('should set {} object into state.selectedRowsKeys', () => {
            const state = { selectedRowsKeys: { abc: true, '123': false } };
            resetSelectedRowsKeys(state);
            expect(state.selectedRowsKeys).toEqual({});
        });
    });
    describe('markDeselectedRowDisabled', () => {
        it('should set to true isDisabled prop of not selected rows', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
            };
            markDeselectedRowDisabled(state);
            expect(state.rows[1].isDisabled).toBe(true);
        });
    });
    describe('markDeselectedRowEnabled', () => {
        it('should set to true isDisabled prop of not selected rows', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
            };
            markDeselectedRowEnabled(state);
            expect(state.rows[1].isDisabled).toBe(false);
        });
    });
    describe('getSelectorDefaultState', () => {
        it('should initialize selectedRowsKeys into empty object', () => {
            expect(getSelectorDefaultState().selectedRowsKeys).toEqual({});
        });
        it('should initialize maxRowSelection undefined', () => {
            expect(getSelectorDefaultState().maxRowSelection).toEqual(
                undefined
            );
        });
    });
    describe('getMaxRowSelection', () => {
        it('should return the value @ state.maxRowSelection', () => {
            const state = { maxRowSelection: 100 };
            expect(getMaxRowSelection(state)).toBe(100);
        });
    });
    describe('setMaxRowSelection', () => {
        it('should set the passed value into state.maxRowSelection when a valid value', () => {
            const state = {
                maxRowSelection: 100,
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
            };
            setMaxRowSelection(state, 150);
            expect(state.maxRowSelection).toBe(150);
        });
        it('should fallback to default maxRowSelection value when the value passed in incorrect', () => {
            const state = {
                maxRowSelection: 100,
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
            };
            setMaxRowSelection(state, 'abc');
            expect(state.maxRowSelection).toBe(undefined);
        });
        it('should cast to number when the value is string', () => {
            const state = {
                maxRowSelection: 100,
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
            };
            setMaxRowSelection(state, '150');
            expect(state.maxRowSelection).toBe(150);
        });
        it('should reset row selection every time customer set a new value of maxRowSelection', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
            };
            setMaxRowSelection(state, 2);
            state.rows.forEach(row => {
                expect(row.isSelected).toBe(false);
                expect(row.isDisabled).toBe(false);
            });
            expect(state.selectedRowsKeys).toEqual({});
        });
        it('should change from radio to checkbox when maxRowSelection move from 1 to > 1', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc', inputType: 'radio' },
                    { isSelected: false, key: 'dfg', inputType: 'radio' },
                    { isSelected: false, key: '123', inputType: 'radio' },
                ],
                selectedRowsKeys: {
                    abc: true,
                },
                maxRowSelection: 1,
            };
            setMaxRowSelection(state, 3);
            state.rows.forEach(row => {
                expect(row.inputType).toBe('checkbox');
            });
        });
        it('should change from checkbox to radio when maxRowSelection move from 1 to > 1', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc', inputType: 'checkbox' },
                    { isSelected: false, key: 'dfg', inputType: 'checkbox' },
                    { isSelected: false, key: '123', inputType: 'checkbox' },
                ],
                selectedRowsKeys: {
                    abc: true,
                },
                maxRowSelection: 3,
            };
            setMaxRowSelection(state, 1);
            state.rows.forEach(row => {
                expect(row.inputType).toBe('radio');
            });
        });
    });
    describe('isSelectedRow', () => {
        it('should return true when the rowKeyValue is in the selectedRowsKeys map', () => {
            const state = { selectedRowsKeys: { abc: true } };
            expect(isSelectedRow(state, 'abc')).toBe(true);
        });
    });
    describe('getSelectedRowKeys', () => {
        it('should return an array', () => {
            const state = {
                selectedRowsKeys: { abc: true, asd: false, qwe: true },
            };
            expect(Array.isArray(getSelectedRowsKeys(state))).toBe(true);
        });
        it('should return array with the selected keys', () => {
            const state = {
                selectedRowsKeys: { abc: true, asd: false, qwe: true },
            };
            expect(getSelectedRowsKeys(state)).toEqual(['abc', 'qwe']);
        });
    });
    describe('setSelectedRowsKeys', () => {
        it('should reset selection when the value passed is invalid(no array)', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: { abc: true },
            };
            setSelectedRowsKeys(state, null);
            expect(state.rows[0].isSelected).toBe(false);
            expect(state.selectedRowsKeys).toEqual({});
        });
        it('should select rows based on the keys passed', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: {},
                indexes: {
                    abc: { a: [0, 1], rowIndex: 0 },
                    dfg: { a: [1, 1], rowIndex: 1 },
                    '123': { a: [2, 1], rowIndex: 2 },
                },
            };
            setSelectedRowsKeys(state, ['abc', '123']);
            expect(state.rows[0].isSelected).toBe(true);
            expect(state.rows[2].isSelected).toBe(true);
            expect(state.selectedRowsKeys).toEqual({
                abc: true,
                '123': true,
            });
        });
        it('should filter keys that exists in the current data', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: {},
                indexes: {
                    abc: { a: [0, 1], rowIndex: 0 },
                    dfg: { a: [1, 1], rowIndex: 1 },
                    '123': { a: [2, 1], rowIndex: 2 },
                },
            };
            setSelectedRowsKeys(state, ['abc', '123', 'do-not-exist']);
            expect(state.selectedRowsKeys).toEqual({
                abc: true,
                '123': true,
            });
        });
        it('should selected only until maxRowSelection allows', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: {},
                indexes: {
                    abc: { a: [0, 1], rowIndex: 0 },
                    dfg: { a: [1, 1], rowIndex: 1 },
                    '123': { a: [2, 1], rowIndex: 2 },
                },
                maxRowSelection: 2,
            };
            setSelectedRowsKeys(state, ['abc', 'dfg', '123']);
            expect(state.rows[0].isSelected).toBe(true);
            expect(state.rows[1].isSelected).toBe(true);
            expect(state.rows[2].isSelected).toBe(false);
        });
        it('should disabled deselected rows if the keys reach the maxRowSelection', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: {},
                indexes: {
                    abc: { a: [0, 1], rowIndex: 0 },
                    dfg: { a: [1, 1], rowIndex: 1 },
                    '123': { a: [2, 1], rowIndex: 2 },
                },
                maxRowSelection: 2,
            };
            setSelectedRowsKeys(state, ['abc', 'dfg', '123']);
            expect(state.rows[2].isDisabled).toBe(true);
        });
        it('should not disabled deselected rows if the keys reach the maxRowSelection and its 1', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: false, key: '123' },
                ],
                selectedRowsKeys: {},
                indexes: {
                    abc: { a: [0, 1], rowIndex: 0 },
                    dfg: { a: [1, 1], rowIndex: 1 },
                    '123': { a: [2, 1], rowIndex: 2 },
                },
                maxRowSelection: 1,
            };
            setSelectedRowsKeys(state, ['abc', 'dfg', '123']);
            expect(state.rows[1].isDisabled).toBe(undefined);
            expect(state.rows[2].isDisabled).toBe(undefined);
        });
        it('should enabled deselected rows when keys are less then maxRowSelection and previous selection was full', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: true, key: 'dfg' },
                    { isSelected: false, key: '123', isDisabled: true },
                ],
                selectedRowsKeys: { abc: true, dfg: true },
                indexes: {
                    abc: { a: [0, 1], rowIndex: 0 },
                    dfg: { a: [1, 1], rowIndex: 1 },
                    '123': { a: [2, 1], rowIndex: 2 },
                },
                maxRowSelection: 2,
            };
            setSelectedRowsKeys(state, ['abc']);
            expect(state.rows[2].isDisabled).toBe(false);
        });
    });
    describe('getCurrentSelectionLength', () => {
        it('should count key with true value', () => {
            const state = {
                selectedRowsKeys: {
                    abc: true,
                    dfg: false,
                    '123': true,
                },
            };
            expect(getCurrentSelectionLength(state)).toBe(2);
        });
    });
    describe('isDisabledRow', () => {
        it('should return true for a row that is not selected when the max was reach', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                maxRowSelection: 2,
            };
            const rowKeyValue = 'dfg';
            expect(isDisabledRow(state, rowKeyValue)).toBe(true);
        });
        it('should return false for a row that is not selected when the max was reached and max selection is 1', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                },
                maxRowSelection: 1,
            };
            expect(isDisabledRow(state, 'dfg')).toBe(false);
            expect(isDisabledRow(state, '123')).toBe(false);
        });
    });
    describe('markRowSelected', () => {
        const indexes = {
            abc: { a: [0, 0], rowIndex: 0 },
            dfg: { a: [1, 0], rowIndex: 1 },
            '123': { a: [2, 0], rowIndex: 2 },
        };
        it('it should update the state by setting the row.isSelected true for the passed rowKeyValue', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'dfg';
            markRowSelected(state, rowKeyValue);
            expect(state.rows[1].isSelected).toBe(true);
        });
        it('it should update the state by setting the proper row.classnames for the passed rowKeyValue', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'dfg';
            markRowSelected(state, rowKeyValue);
            expect(state.rows[1].classnames).toBe(
                'slds-hint-parent slds-is-selected'
            );
        });
        it('should add the rowKeyValue to state.selectedRowsKeys', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'dfg';
            markRowSelected(state, rowKeyValue);
            expect(state.selectedRowsKeys[rowKeyValue]).toBe(true);
        });
        it('should set ariaSelected as true string', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'dfg';
            markRowSelected(state, rowKeyValue);
            expect(state.rows[1].ariaSelected).toBe('true');
        });
        it('should mark disabled "deselected rows" when selection reach the maxRowSelection', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc', isDisabled: false },
                    { isSelected: false, key: 'dfg', isDisabled: false },
                    { isSelected: false, key: '123', isDisabled: false },
                ],
                selectedRowsKeys: {
                    abc: true,
                },
                maxRowSelection: 2,
                indexes,
            };
            const rowKeyValue = 'dfg';
            markRowSelected(state, rowKeyValue);
            expect(state.rows[0].isDisabled).toBe(false);
            expect(state.rows[1].isDisabled).toBe(false);
            expect(state.rows[2].isDisabled).toBe(true);
        });
        it('should deselect previous selected row when input "radio"', () => {
            const state = {
                rows: [
                    { isSelected: false, key: 'abc', isDisabled: false },
                    { isSelected: false, key: 'dfg', isDisabled: false },
                    { isSelected: false, key: '123', isDisabled: false },
                ],
                selectedRowsKeys: {},
                maxRowSelection: 1,
                indexes,
            };
            markRowSelected(state, 'abc');
            expect(state.rows[0].isSelected).toBe(true);
            expect(state.selectedRowsKeys.abc).toBe(true);

            markRowSelected(state, '123');
            expect(state.rows[2].isSelected).toBe(true);
        });
    });

    describe('markRowDelected', () => {
        const indexes = {
            abc: { a: [0, 0], rowIndex: 0 },
            dfg: { a: [1, 0], rowIndex: 1 },
            '123': { a: [2, 0], rowIndex: 2 },
        };
        it('it should update the state by setting the row.isSelected false for the passed rowKeyValue', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'abc';
            markRowDeselected(state, rowKeyValue);
            expect(state.rows[0].isSelected).toBe(false);
        });

        it('it should update the state by setting the row.ariaSelected to false for the passed rowKeyValue', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'abc';
            markRowDeselected(state, rowKeyValue);
            expect(state.rows[0].ariaSelected).toBe(false);
        });

        it('it should update the state by setting the proper row.classnames for the passed rowKeyValue', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'abc';
            markRowDeselected(state, rowKeyValue);
            expect(state.rows[0].classnames).toBe('slds-hint-parent');
        });

        it('should remove the rowKeyValue to state.selectedRowsKeys', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg' },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                indexes,
            };
            const rowKeyValue = 'abc';
            markRowDeselected(state, rowKeyValue);
            expect(state.selectedRowsKeys[rowKeyValue]).toBe(false);
        });
        it('should enable "disabled rows" when reach max and deselect happen', () => {
            const state = {
                rows: [
                    { isSelected: true, key: 'abc' },
                    { isSelected: false, key: 'dfg', isDisabled: true },
                    { isSelected: true, key: '123' },
                ],
                selectedRowsKeys: {
                    abc: true,
                    '123': true,
                },
                maxRowSelection: 2,
                indexes,
            };
            const rowKeyValue = 'abc';
            markRowDeselected(state, rowKeyValue);
            expect(state.rows[1].isDisabled).toBe(false);
        });
    });

    describe('markAllRowsSelected', () => {
        it('it should update the state by setting the row.isSelected true for all rows until reach the maxRowSelection', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [{ key: 'abc' }, { key: '123' }, { key: '456' }],
                maxRowSelection: 2,
            };
            markAllRowsSelected(state);
            expect(state.rows[0].isSelected).toBe(true);
            expect(state.rows[1].isSelected).toBe(true);
            expect(state.rows[2].isSelected).toBe(false);
        });

        it('it should update the state by setting the row.ariaSelected string true for all rows until reach the maxRowSelection', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [{ key: 'abc' }, { key: '123' }, { key: '456' }],
                maxRowSelection: 2,
            };
            markAllRowsSelected(state);
            expect(state.rows[0].ariaSelected).toBe('true');
            expect(state.rows[1].ariaSelected).toBe('true');
            expect(state.rows[2].ariaSelected).toBe(false);
        });

        it('it should update the state by setting the proper row.classnames for all rows', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [{ key: 'abc' }, { key: '123' }, { key: '456' }],
                maxRowSelection: 2,
            };
            markAllRowsSelected(state);
            expect(state.rows[0].classnames).toBe(
                'slds-hint-parent slds-is-selected'
            );
            expect(state.rows[1].classnames).toBe(
                'slds-hint-parent slds-is-selected'
            );
            expect(state.rows[2].classnames).toBe('slds-hint-parent');
        });

        it('should add the rowKeyValue of selected rows into state.selectedRowsKeys', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [{ key: 'abc' }, { key: '123' }, { key: '456' }],
                maxRowSelection: 2,
            };
            markAllRowsSelected(state);
            expect(state.selectedRowsKeys).toEqual({ abc: true, '123': true });
        });
    });

    describe('markAllRowsDeselected', () => {
        it('it should update the state by setting the row.isSelected false for all rows', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [
                    { key: 'abc', isSelected: true },
                    { key: '123' },
                    { key: '456' },
                ],
                maxRowSelection: 2,
            };
            markAllRowsDeselected(state);
            state.rows.forEach(row => {
                expect(row.isSelected).toBe(false);
            });
        });

        it('it should update the state by setting the row.ariaSelected false for all rows', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [
                    { key: 'abc', isSelected: true },
                    { key: '123' },
                    { key: '456' },
                ],
                maxRowSelection: 2,
            };
            markAllRowsDeselected(state);
            state.rows.forEach(row => {
                expect(row.ariaSelected).toBe(false);
            });
        });

        it('it should update the state by setting the proper row.classnames for all rows', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [
                    { key: 'abc', isSelected: true },
                    { key: '123' },
                    { key: '456' },
                ],
                maxRowSelection: 2,
            };
            markAllRowsDeselected(state);
            state.rows.forEach(row => {
                expect(row.classnames).toBe('slds-hint-parent');
            });
        });

        it('should add the rowKeyValue to state.selectedRowsKeys all rows', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [
                    { key: 'abc', isSelected: true },
                    { key: '123' },
                    { key: '456' },
                ],
                maxRowSelection: 2,
            };
            markAllRowsDeselected(state);
            expect(state.selectedRowsKeys).toEqual({});
        });
        it('should set isDisabled false to all rows', () => {
            const state = {
                selectedRowsKeys: {},
                rows: [
                    { key: 'abc', isSelected: true },
                    { key: '123' },
                    { key: '456' },
                ],
                maxRowSelection: 2,
            };
            markAllRowsDeselected(state);
            state.rows.forEach(row => {
                expect(row.isDisabled).toBe(false);
            });
        });
    });

    describe('syncSelectedRowsKeys', () => {
        it('should update selectedRowsKeys map when is not the same as state.rows selected state', () => {
            const row = { name: 'Salesforce.com', id: 'a' };
            const state = {
                keyField: 'id',
                selectedRowsKeys: {},
                columns: [],
            };
            const selectedRows = [row];

            syncSelectedRowsKeys(state, selectedRows);
            expect(state.selectedRowsKeys).toEqual({ a: true });
        });

        it('should invoke ifChanged callback if it was passed and there was a change in selectedRowsKeys', () => {
            const row = { name: 'Salesforce.com', id: 'a' };
            const state = {
                keyField: 'id',
                selectedRowsKeys: {},
                columns: [],
            };
            const selectedRows = [row];
            const callback = jest.fn();
            syncSelectedRowsKeys(state, selectedRows).ifChanged(callback);
            expect(callback.mock.instances).toHaveLength(1);
        });

        it(
            'should invoke ifChanged callback if there was a change in selectedRowsKeys ' +
                'and pass selectedRows as first arg',
            () => {
                const row = { name: 'Salesforce.com', id: 'a' };
                const state = {
                    keyField: 'id',
                    selectedRowsKeys: {},
                    columns: [],
                };
                const selectedRows = [row];
                const callback = jest.fn();
                syncSelectedRowsKeys(state, selectedRows).ifChanged(callback);
                expect(callback.mock.calls[0][0]).toBe(selectedRows);
            }
        );

        it('should not invoke ifChanged callback if there was not any change in selectedRowsKeys', () => {
            const row = { name: 'Salesforce.com', id: 'a' };
            const state = {
                keyField: 'id',
                selectedRowsKeys: { a: true },
                columns: [],
            };
            const selectedRows = [row];
            const callback = jest.fn();
            syncSelectedRowsKeys(state, selectedRows).ifChanged(callback);
            expect(callback.mock.instances).toHaveLength(0);
        });

        it('should keep same selectedRowsKeys if there is not different', () => {
            const row = { name: 'Salesforce.com', id: 'a' };
            const selectedRowsKeys = { a: true };
            const state = {
                keyField: 'id',
                selectedRowsKeys,
                columns: [],
            };
            const selectedRows = [row];
            syncSelectedRowsKeys(state, selectedRows);
            expect(state.selectedRowsKeys).toBe(selectedRowsKeys);
        });
    });
});
