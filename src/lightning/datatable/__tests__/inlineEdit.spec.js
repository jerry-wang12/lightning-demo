import {
    normalizeEditable,
    handleEditCell,
    handleInlineEditFinish,
    cancelInlineEdit,
    isInlineEditTriggered,
    getDirtyValues,
    setDirtyValues,
} from './../inlineEdit';

import * as rowsDependencies from './../rows';
import * as columnDependencies from './../columns';
import * as keyboardDependencies from './../keyboard';
import * as selectorDependencies from './../selector';

describe('inline-edit module', () => {
    describe('normalizeEditable', () => {
        it('should set editable to false if the type does not support inline edit', () => {
            const column = { type: 'no-editable-type', editable: true };
            normalizeEditable(column);
            expect(column.editable).toBe(false);
        });
        it('should normalize to boolean type when the column type is allows inline edit', () => {
            const column = {
                type: 'text',
                // false string is normalized to boolean true
                editable: 'false',
            };
            normalizeEditable(column);
            expect(column.editable).toBe(true);
        });
    });

    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('handleEditCell', () => {
        const _getRowByKey = rowsDependencies.getRowByKey,
            _getStateColumnIndex = columnDependencies.getStateColumnIndex,
            _getColumns = columnDependencies.getColumns,
            _getSelectedRowsKeys = selectorDependencies.getSelectedRowsKeys,
            _getCurrentSelectionLength =
                selectorDependencies.getCurrentSelectionLength,
            _isSelectedRow = selectorDependencies.isSelectedRow;

        beforeEach(() => {
            // eslint-disable-next-line import/namespace
            rowsDependencies.getRowByKey = jest
                .fn()
                .mockReturnValue({ cells: [{ value: 'b' }] });
            // eslint-disable-next-line import/namespace
            columnDependencies.getStateColumnIndex = jest
                .fn()
                .mockReturnValue(0);
            // eslint-disable-next-line import/namespace
            columnDependencies.getColumns = jest.fn().mockReturnValue([
                {
                    def: {
                        type: 'text',
                        label: 'text label',
                    },
                },
            ]);
            // eslint-disable-next-line import/namespace
            selectorDependencies.getSelectedRowsKeys = jest
                .fn()
                .mockReturnValue([]);
            // eslint-disable-next-line import/namespace
            selectorDependencies.getCurrentSelectionLength = jest
                .fn()
                .mockReturnValue(0);
            // eslint-disable-next-line import/namespace
            selectorDependencies.isSelectedRow = jest
                .fn()
                .mockReturnValue(false);
        });

        afterEach(() => {
            // eslint-disable-next-line import/namespace
            rowsDependencies.getRowByKey = _getRowByKey;
            // eslint-disable-next-line import/namespace
            columnDependencies.getStateColumnIndex = _getStateColumnIndex;
            // eslint-disable-next-line import/namespace
            columnDependencies.getColumns = _getColumns;
            // eslint-disable-next-line import/namespace
            selectorDependencies.getSelectedRowsKeys = _getSelectedRowsKeys;
            // eslint-disable-next-line import/namespace
            selectorDependencies.getCurrentSelectionLength = _getCurrentSelectionLength;
            // eslint-disable-next-line import/namespace
            selectorDependencies.isSelectedRow = _isSelectedRow;
        });

        jest.useFakeTimers();

        const dtMock = () => {
            const focusMock = jest.fn();
            return {
                state: {
                    inlineEdit: { dirtyValues: {} },
                    indexes: {
                        abc: {
                            'name-text': [0, 0],
                        },
                    },
                    rows: [],
                },
                template: {
                    querySelector: () => {
                        return { focus: focusMock };
                    },
                },
            };
        };
        const eventMock = () => {
            return {
                target: {
                    offsetTop: 3,
                    offsetLeft: 5,
                },
                detail: {
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            };
        };

        it('should set the panel visible', () => {
            const datatableMock = dtMock();
            handleEditCell.call(datatableMock, eventMock());
            expect(datatableMock.state.inlineEdit.isPanelVisible).toBe(true);
            jest.runAllTimers();
        });
        it('should set the row/col keyValue', () => {
            const datatableMock = dtMock();
            handleEditCell.call(datatableMock, eventMock());
            expect(datatableMock.state.inlineEdit.rowKeyValue).toBe('abc');
            expect(datatableMock.state.inlineEdit.colKeyValue).toBe('def');
            jest.runAllTimers();
        });

        it('should set focus to the element', () => {
            const datatableMock = dtMock();
            const focusMock = datatableMock.template.querySelector().focus;

            handleEditCell.call(datatableMock, eventMock());
            expect(focusMock).not.toBeCalled();
            jest.runAllTimers();
            expect(focusMock).toBeCalled();
            expect(focusMock).toHaveBeenCalledTimes(1);
        });

        it('should set the editedValue corresponding to the cell', () => {
            const datatableMock = dtMock();
            handleEditCell.call(datatableMock, eventMock());
            expect(datatableMock.state.inlineEdit.editedValue).toBe('b');
            jest.runAllTimers();
        });

        it('should not activate mass-edit if row is not selected', () => {
            const datatableMock = dtMock();
            // eslint-disable-next-line import/namespace
            selectorDependencies.getCurrentSelectionLength = jest
                .fn()
                .mockReturnValue(2);
            // eslint-disable-next-line import/namespace
            selectorDependencies.isSelectedRow = jest
                .fn()
                .mockReturnValue(false);
            handleEditCell.call(datatableMock, eventMock());
            expect(datatableMock.state.inlineEdit.massEditEnabled).toBe(false);
            jest.runAllTimers();
        });

        it('should not activate mass-edit if the is the only row selected', () => {
            const datatableMock = dtMock();
            // eslint-disable-next-line import/namespace
            selectorDependencies.getCurrentSelectionLength = jest
                .fn()
                .mockReturnValue(1);
            // eslint-disable-next-line import/namespace
            selectorDependencies.isSelectedRow = jest
                .fn()
                .mockReturnValue(true);
            handleEditCell.call(datatableMock, eventMock());
            expect(datatableMock.state.inlineEdit.massEditEnabled).toBe(false);
            jest.runAllTimers();
        });

        it('should activate mass-edit if the row is selected and there is more than 1 selected row', () => {
            const datatableMock = dtMock();
            // eslint-disable-next-line import/namespace
            selectorDependencies.getCurrentSelectionLength = jest
                .fn()
                .mockReturnValue(2);
            // eslint-disable-next-line import/namespace
            selectorDependencies.isSelectedRow = jest
                .fn()
                .mockReturnValue(true);
            handleEditCell.call(datatableMock, eventMock());
            expect(datatableMock.state.inlineEdit.massEditEnabled).toBe(true);
            expect(datatableMock.state.inlineEdit.massEditSelectedRows).toBe(2);
            jest.runAllTimers();
        });
    });

    describe('handleInlineEditFinish', () => {
        const _updateRowsAndCellIndexes =
                rowsDependencies.updateRowsAndCellIndexes,
            _getRowByKey = rowsDependencies.getRowByKey,
            _getStateColumnIndex = columnDependencies.getStateColumnIndex,
            _setFocusActiveCell = keyboardDependencies.setFocusActiveCell,
            _getSelectedRowsKeys = selectorDependencies.getSelectedRowsKeys;

        beforeEach(() => {
            // eslint-disable-next-line import/namespace
            rowsDependencies.updateRowsAndCellIndexes = jest.fn();
            // eslint-disable-next-line import/namespace
            rowsDependencies.getRowByKey = jest
                .fn()
                .mockReturnValue({ cells: [{ value: 'b' }] });
            // eslint-disable-next-line import/namespace
            columnDependencies.getStateColumnIndex = jest
                .fn()
                .mockReturnValue(0);
            // eslint-disable-next-line import/namespace
            keyboardDependencies.setFocusActiveCell = jest.fn();
            // eslint-disable-next-line import/namespace
            selectorDependencies.getSelectedRowsKeys = jest
                .fn()
                .mockReturnValue([]);
        });

        afterEach(() => {
            // eslint-disable-next-line import/namespace
            rowsDependencies.updateRowsAndCellIndexes = _updateRowsAndCellIndexes;
            // eslint-disable-next-line import/namespace
            rowsDependencies.getRowByKey = _getRowByKey;
            // eslint-disable-next-line import/namespace
            columnDependencies.getStateColumnIndex = _getStateColumnIndex;
            // eslint-disable-next-line import/namespace
            keyboardDependencies.setFocusActiveCell = _setFocusActiveCell;
            // eslint-disable-next-line import/namespace
            selectorDependencies.getSelectedRowsKeys = _getSelectedRowsKeys;
        });

        const dtMock = (editionValue, validity) => {
            const template = {
                querySelector: jest.fn(() => {
                    return {
                        value: editionValue || 'edited',
                        validity: {
                            valid: validity !== undefined ? validity : true,
                        },
                    };
                }),
            };

            return {
                template,
                state: {
                    keyField: 'id',
                    columns: [{ fieldName: 'mockColumn' }],
                    inlineEdit: {
                        isPanelVisible: true,
                        dirtyValues: {},
                    },
                },
                dispatchEvent: jest.fn(),
            };
        };

        it('it should hide the panel in any case', () => {
            const datatableMock = dtMock();
            handleInlineEditFinish.call(datatableMock, {
                detail: {
                    reason: 'any-reason',
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            });
            expect(datatableMock.state.inlineEdit.isPanelVisible).toBe(false);
        });

        it('it should dispatch cellchange on blur', () => {
            const datatableMock = dtMock();
            handleInlineEditFinish.call(datatableMock, {
                detail: {
                    reason: 'any-reason',
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            });

            expect(datatableMock.dispatchEvent).toBeCalled();
            const evt = datatableMock.dispatchEvent.mock.calls[0][0];

            expect(evt.type).toBe('cellchange');

            const expected = [{ id: 'abc', mockColumn: 'edited' }];
            expect(evt.detail.draftValues).toEqual(expected);
        });

        it('it should not update rowsAndCellsIndexes on edit-canceled', () => {
            const datatableMock = dtMock();
            handleInlineEditFinish.call(datatableMock, {
                detail: {
                    reason: 'edit-canceled',
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            });
            expect(rowsDependencies.updateRowsAndCellIndexes).not.toBeCalled();
        });

        it('it should not update rowsAndCellsIndexes when its not valid', () => {
            const datatableMock = dtMock('edited', false);
            handleInlineEditFinish.call(datatableMock, {
                detail: {
                    reason: 'submit-action',
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            });
            expect(rowsDependencies.updateRowsAndCellIndexes).not.toBeCalled();
        });

        it('it should not update rowsAndCellsIndexes when mass-edit enabled and loses panel focus', () => {
            const datatableMock = dtMock('edited', false);
            datatableMock.state.inlineEdit.massEditEnabled = true;
            handleInlineEditFinish.call(datatableMock, {
                detail: {
                    reason: 'loosed-focus',
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            });
            expect(rowsDependencies.updateRowsAndCellIndexes).not.toBeCalled();
        });

        it('it should update rowsAndCellsIndexes when on a new valid value', () => {
            const datatableMock = dtMock();
            handleInlineEditFinish.call(datatableMock, {
                detail: {
                    reason: 'submit-action',
                    rowKeyValue: 'abc',
                    colKeyValue: 'def',
                },
            });

            expect(rowsDependencies.updateRowsAndCellIndexes).toBeCalled();
            expect(datatableMock.state.inlineEdit.dirtyValues.abc.def).toBe(
                'edited'
            );
        });
    });

    describe('cancelInlineEdit', () => {
        beforeEach(() => {
            // eslint-disable-next-line import/namespace
            rowsDependencies.updateRowsAndCellIndexes = jest.fn();
        });

        it('should set the dirtyCells to an empty object and call updateRowsAndCellIndexes', () => {
            const state = {
                inlineEdit: {
                    dirtyValues: {
                        row1: {
                            col1: '',
                        },
                    },
                },
            };
            const dtMock = { state };
            cancelInlineEdit(dtMock);
            expect(Object.keys(state.inlineEdit.dirtyValues)).toHaveLength(0);
            expect(rowsDependencies.updateRowsAndCellIndexes).toBeCalled();
        });
    });

    describe('isInlineEditTriggered', () => {
        it('should return false when there is no dirty value', () => {
            const state = {
                inlineEdit: {
                    dirtyValues: {},
                },
            };
            expect(isInlineEditTriggered(state)).toBe(false);
        });

        it('should return true when there is one dirty value', () => {
            const state = {
                inlineEdit: {
                    dirtyValues: {
                        row1: {
                            col1: '',
                        },
                    },
                },
            };
            expect(isInlineEditTriggered(state)).toBe(true);
        });

        it('should return true when there is multiple dirty value', () => {
            const state = {
                inlineEdit: {
                    dirtyValues: {
                        row1: { col1: '' },
                        row2: { col1: '' },
                        row3: { col1: '' },
                    },
                },
            };
            expect(isInlineEditTriggered(state)).toBe(true);
        });
    });

    describe('getDirtyValues', () => {
        const state = {
            keyField: 'rowKey',
            headerIndexes: { col1: 0, col2: 1, col3: 2 },
            columns: [
                { fieldName: 'col1Field', colKeyValue: 'col1' },
                { fieldName: 'col2Field', colKeyValue: 'col2' },
                { fieldName: 'col3Field', colKeyValue: 'col3' },
            ],
            inlineEdit: {
                dirtyValues: {
                    row1: { col1: 'm col1' },
                    row2: { col2: 'm col2' },
                    row3: { col1: 'm col1' },
                },
            },
        };

        it('should map the values to the customer format', () => {
            const expected = [
                { rowKey: 'row1', col1Field: 'm col1' },
                { rowKey: 'row2', col2Field: 'm col2' },
                { rowKey: 'row3', col1Field: 'm col1' },
            ];

            expect(getDirtyValues(state)).toEqual(expected);
        });

        it('should map the values to the internal format', () => {
            const modifiedState = JSON.parse(JSON.stringify(state));
            modifiedState.inlineEdit.dirtyValues = { row1: { col2: 'm col1' } };

            const expected = {
                row1: { col1: 'm col1' },
                row2: { col2: 'm col2' },
                row3: { col3: 'm col3' },
            };

            const newDraftValues = [
                { rowKey: 'row1', col1Field: 'm col1' },
                { rowKey: 'row2', col2Field: 'm col2' },
                { rowKey: 'row3', col3Field: 'm col3' },
            ];

            setDirtyValues(modifiedState, newDraftValues);

            expect(modifiedState.inlineEdit.dirtyValues).toEqual(expected);
        });
    });
});
