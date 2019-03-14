import {
    computeCellTypeAttributes,
    computeCellAttributes,
    getUserRowByCellKeys,
    resolveRowClassNames,
    updateRowsAndCellIndexes,
    getRows,
    getRowByKey,
    getRowsTotal,
    isRowExpanded,
    getRowLevel,
    rowKeyExists,
} from './../rows';
import { getDefaultState } from './../normalizer';

import {
    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS,
    DATATABLE_STATE_TREEDATA_WITHOUT_ROWS,
} from './../__mocks__/data';

jest.doMock('./../types', () => ({
    getAttributesNames: () => ['label', 'target'],
    isValidType: () => true,
    isTreeType: () => false,
}));

const typeUrl = {
    getType: () => ({
        type: 'standard',
        typeAttributes: ['label', 'target', 'tooltip'],
    }),
};

const state = {
    indexes: {
        'row-0': {
            'col-0': [0, 0],
        },
        'row-1': {
            'col-0': [1, 0],
        },
        'row-2': {
            'col-0': [0, 0], // the row here its modified intentionally.
        },
    },
    data: [
        { name: 'name-0', desc: 'desc-0' },
        { name: 'name-1', desc: 'desc-1' },
        { name: 'name-2', desc: 'desc-2' },
    ],
};

describe('rows module', () => {
    describe('getRows', () => {
        it('should return the rows prop in state', () => {
            const rows = [];
            const dtState = { rows };
            expect(getRows(dtState)).toBe(rows);
        });
    });
    describe('getRowByKey', () => {
        it('should return the row instance for the passed rowKeyValue', () => {
            const dtState = {
                rows: [{ key: 'abc' }, { key: '123' }],
                indexes: { abc: { rowIndex: 0 }, '123': { rowIndex: 1 } },
            };
            expect(getRowByKey(dtState, '123')).toEqual({ key: '123' });
        });
        it('should return undefined if the rowKeyValue passed is not in the row collection', () => {
            const dtState = {
                rows: [{ key: 'abc' }, { key: '123' }],
                indexes: { abc: { a: [0, 0] }, '123': { a: [1, 0] } },
            };
            expect(getRowByKey(dtState, '456')).toBe(undefined);
        });
    });
    describe('rowKeyExists', () => {
        it('should return true in the key exists in the indexes', () => {
            const dtState = {
                indexes: {
                    abc: {
                        '123': [1, 2],
                    },
                },
            };
            expect(rowKeyExists(dtState, 'abc')).toBe(true);
        });
        it('should return false in the key does not exists in the indexes', () => {
            const dtState = {
                indexes: {
                    abc: {
                        '123': [1, 2],
                    },
                },
            };
            expect(rowKeyExists(dtState, 'zxc')).toBe(false);
        });
    });
    describe('getRowsTotal', () => {
        it('should return the total of rows in the state', () => {
            const dtState = {
                rows: [{ key: 'abc' }, { key: '123' }],
            };
            expect(getRowsTotal(dtState)).toBe(2);
        });
    });
    describe('computeCellTypeAttributes', () => {
        it('should return empty object if there are no typeAttributes defined', () => {
            const row = {};
            const col = { type: 'url' };
            expect(computeCellTypeAttributes(row, col, typeUrl)).toEqual({});
        });
        it('should name the object props like "typeAttribute#"', () => {
            const row = {};
            const col = {
                type: 'url',
                typeAttributes: {
                    label: 'Show details',
                },
            };

            const typeAttributes = computeCellTypeAttributes(row, col, typeUrl);
            Object.keys(typeAttributes).forEach(attributeName => {
                expect(/^typeAttribute\d+$/.test(attributeName)).toBe(true);
            });
        });
        it('should return a value passed when it is not an object like', () => {
            const row = {};
            const col = {
                type: 'url',
                typeAttributes: {
                    label: 'Show details',
                },
            };
            expect(computeCellTypeAttributes(row, col, typeUrl)).toEqual({
                typeAttribute0: 'Show details',
            });
        });
        it('should get the value from the row when and object with filedName prop is passed', () => {
            const row = { labelUrl: 'salesforce.com' };
            const col = {
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'labelUrl',
                    },
                    target: '_blank',
                },
            };
            expect(computeCellTypeAttributes(row, col, typeUrl)).toEqual({
                typeAttribute0: 'salesforce.com',
                typeAttribute1: '_blank',
            });
        });
        it('should not include attributes when the fieldName is pointing to nowhere', () => {
            const row = { labelUrl: 'salesforce.com' };
            const col = {
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'label',
                    },
                },
            };
            expect(computeCellTypeAttributes(row, col, typeUrl)).toEqual({});
        });
        it('should return subtype attributes when subtype is defined and subtypeattributes present', () => {
            const row = { labelUrl: 'salesforce.com', targetField: '_blank' };
            const col = {
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'labelUrl',
                    },
                    subType: 'url',
                    subTypeAttributes: {
                        target: { fieldName: 'targetField' },
                    },
                },
            };
            expect(computeCellTypeAttributes(row, col, typeUrl)).toEqual({
                typeAttribute0: undefined,
                typeAttribute1: '_blank',
            });
        });
        it('should have typeattributes undefined when subType present with no subTypeAttributes', () => {
            const row = { labelUrl: 'salesforce.com' };
            const col = {
                type: 'url',
                typeAttributes: {
                    label: {
                        fieldName: 'labelUrl',
                    },
                    target: '_blank',
                    subType: 'text',
                },
            };
            expect(computeCellTypeAttributes(row, col, typeUrl)).toEqual({
                typeAttribute0: undefined,
                typeAttribute1: undefined,
            });
        });
    });
    describe('getUserRowByCellKeys', () => {
        it('should return user data row based on rowKey and colKey', () => {
            const dtState = Object.assign({}, state);

            expect(getUserRowByCellKeys(dtState, 'row-1', 'col-0')).toBe(
                dtState.data[1]
            );
            expect(getUserRowByCellKeys(dtState, 'row-2', 'col-0')).toBe(
                dtState.data[0]
            );
        });
    });
    describe('resolveRowClassNames', () => {
        it('should have "slds-hint-parent" class always', () => {
            const row = {};
            const classnames = resolveRowClassNames(row);
            expect(classnames.indexOf('slds-hint-parent')).not.toBe(-1);
        });

        it('should have "slds-is-selected" when row.isSelected is true', () => {
            const row = { isSelected: true };
            const classnames = resolveRowClassNames(row);
            expect(classnames.indexOf('slds-is-selected')).not.toBe(-1);
        });
    });
    describe('isRowExpanded', () => {
        it('should return undefined when hasChildren is false', () => {
            const rowData = { hasChildren: false };
            const col = {
                colKeyValue: 'tree-1',
                type: 'tree',
                typeAttributes: {
                    hasChildren: {
                        fieldName: 'hasChildren',
                    },
                    isExpanded: {
                        fieldName: 'expanded',
                    },
                },
            };

            expect(isRowExpanded(col, rowData)).toBe(undefined);
        });
        it('should return false when hasChildren is true and isExpanded is not there', () => {
            const rowData = { hasChildren: true };
            const col = {
                colKeyValue: 'tree-1',
                type: 'tree',
                typeAttributes: {
                    hasChildren: {
                        fieldName: 'hasChildren',
                    },
                    isExpanded: {
                        fieldName: 'expanded',
                    },
                },
            };

            expect(isRowExpanded(col, rowData)).toBe('false');
        });
        it('should return false when hasChildren is true and isExpanded is false', () => {
            const rowData = { hasChildren: true, expanded: false };
            const col = {
                colKeyValue: 'tree-1',
                type: 'tree',
                typeAttributes: {
                    hasChildren: {
                        fieldName: 'hasChildren',
                    },
                    isExpanded: {
                        fieldName: 'expanded',
                    },
                },
            };

            expect(isRowExpanded(col, rowData)).toBe('false');
        });
        it('should return false when hasChildren is true and isExpanded is true', () => {
            const rowData = { hasChildren: true, expanded: true };
            const col = {
                colKeyValue: 'tree-1',
                type: 'tree',
                typeAttributes: {
                    hasChildren: {
                        fieldName: 'hasChildren',
                    },
                    isExpanded: {
                        fieldName: 'expanded',
                    },
                },
            };

            expect(isRowExpanded(col, rowData)).toBe('true');
        });
    });
    describe('getRowLevel', () => {
        it('should return level when defined', () => {
            const rowData = { level: 2 };
            const col = {
                colKeyValue: 'tree-1',
                type: 'tree',
                typeAttributes: {
                    level: {
                        fieldName: 'level',
                    },
                    isExpanded: {
                        fieldName: 'expanded',
                    },
                },
            };

            expect(getRowLevel(col, rowData)).toBe(2);
        });
        it('should return default level when not defined', () => {
            const rowData = {};
            const col = {
                colKeyValue: 'tree-1',
                type: 'tree',
                typeAttributes: {
                    level: {
                        fieldName: 'level',
                    },
                },
            };

            expect(getRowLevel(col, rowData)).toBe(1);
        });
    });
    describe('updateRowsAndCellIndexes', () => {
        const privateTypes = {
            getType: () => ({
                type: 'standard',
                typeAttributes: [],
            }),
            isValidType: () => true,
        };

        it('should return empty Array when initialState', () => {
            const dtState = getDefaultState();
            updateRowsAndCellIndexes.call({ state: dtState });
            expect(dtState.rows).toEqual([]);
        });

        it('should attach row key value to every row', () => {
            const dtState = Object.assign(
                {},
                DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
            );
            updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
            const rows = dtState.rows;
            const keys = rows.map(row => row.key);
            expect(keys).toEqual(['a', 'b', 'c']);
        });

        it('should attach the selected state to every row', () => {
            const dtState = Object.assign(
                {},
                DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
            );
            updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
            const rows = dtState.rows;
            const rowsSelectedState = rows.map(row => row.isSelected);
            expect(rowsSelectedState).toEqual([false, false, false]);
        });

        it('should attach classnames to row object', () => {
            const dtState = Object.assign(
                {},
                DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
            );
            updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
            const rows = dtState.rows;
            rows.forEach(row => {
                expect(row.classnames).toBe('slds-hint-parent');
            });
        });

        it('should put dirtyValue as value', () => {
            const dtState = Object.assign(
                {},
                DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
            );

            dtState.inlineEdit = {
                dirtyValues: {
                    a: {
                        'name-text': 'dirty-value',
                    },
                },
            };

            updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
            const rows = dtState.rows;
            const dirtyCellValue = rows[0].cells[0].value;
            expect(dirtyCellValue).toEqual('dirty-value');
        });

        it('should add slds-is-edited class to the cell', () => {
            const dtState = Object.assign(
                {},
                DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
            );

            dtState.inlineEdit = {
                dirtyValues: {
                    a: {
                        'name-text': 'dirty-value',
                    },
                },
            };

            updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
            const rows = dtState.rows;
            const dirtyCell = rows[0].cells[0];
            expect(dirtyCell.class.indexOf('slds-is-edited')).not.toEqual(-1);
        });

        describe('cell objects creation', () => {
            it('should create cell objects', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                const rowsLengths = rows.map(row => row.cells.length);
                expect(rowsLengths).toEqual([3, 3, 3]);
            });

            it('should attach dataLabel', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                const { columns } = DATATABLE_STATE_WITHOUT_PREVIEW_ROWS;
                rows.forEach(row => {
                    row.cells.forEach((cell, index) => {
                        const expectedDataLabel = columns[index].label;
                        expect(cell.dataLabel).toEqual(expectedDataLabel);
                    });
                });
            });

            it('should attach columnType', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                const { columns } = DATATABLE_STATE_WITHOUT_PREVIEW_ROWS;
                rows.forEach(row => {
                    row.cells.forEach((cell, index) => {
                        const expectedColumnType = columns[index].type;
                        expect(cell.columnType).toEqual(expectedColumnType);
                    });
                });
            });

            it('should attach to cell the value', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                const { data, columns } = DATATABLE_STATE_WITHOUT_PREVIEW_ROWS;

                rows.forEach((row, rowIndex) => {
                    row.cells.forEach((cell, colIndex) => {
                        const expectedValue =
                            data[rowIndex][columns[colIndex].fieldName];
                        expect(cell.value).toEqual(expectedValue);
                    });
                });
            });

            it('should attach to cell isDataType prop based on the type', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                rows.forEach(row => {
                    row.cells.forEach(cell => {
                        // since the columns passed are all data type columns
                        expect(cell.isDataType).toEqual(true);
                    });
                });
            });

            it('should attach to cell isCheckbox prop based on type', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                rows.forEach(row => {
                    row.cells.forEach(cell => {
                        // since the columns passed are all data type columns
                        expect(cell.isCheckbox).toEqual(false);
                    });
                });
            });

            it('should attach row key value to every cell', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                const keys = rows[0].cells.map(cell => cell.rowKeyValue);
                expect(keys).toEqual(['a', 'a', 'a']);
            });

            it('should attach col key value to every cell', () => {
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                const keys = rows[0].cells.map(cell => cell.colKeyValue);
                expect(keys).toEqual([
                    'name-text',
                    'amount-number',
                    'email-text',
                ]);
            });
            it('should attach row state values to row if colun is tree', () => {
                jest.doMock('./../types', () => ({
                    getAttributesNames: () => ['label', 'target'],
                    isValidType: () => true,
                    isTreeType: () => true,
                }));
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_TREEDATA_WITHOUT_ROWS
                );

                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                expect(rows[0].isExpanded).toEqual('true');
                expect(rows[0].hasChildren).toEqual(true);
                expect(rows[0].level).toEqual(1);
                expect(rows[0].setSize).toEqual(2);
                expect(rows[0].posInSet).toEqual(1);
                expect(rows[1].isExpanded).toEqual(undefined);
                expect(rows[1].hasChildren).toEqual(false);
                expect(rows[2].isExpanded).toEqual('false');
                expect(rows[2].hasChildren).toEqual(true);
            });
            it('should attach row state values to cell type attributes if column is tree', () => {
                jest.doMock('./../types', () => ({
                    getAttributesNames: () => ['label', 'target'],
                    isValidType: () => true,
                    isTreeType: () => true,
                }));
                const dtState = Object.assign(
                    {},
                    DATATABLE_STATE_TREEDATA_WITHOUT_ROWS
                );

                updateRowsAndCellIndexes.call({ state: dtState, privateTypes });
                const rows = dtState.rows;
                let cell = rows[0].cells[0];
                expect(cell.typeAttribute21).toEqual(true);
                expect(cell.typeAttribute22).toEqual(true);
                cell = rows[1].cells[0];
                expect(cell.typeAttribute21).toEqual(false);
                expect(cell.typeAttribute22).toEqual(false);
            });
        });

        describe('cells indexes creation', () => {
            it('should create Map of Map with cell indexes', () => {
                const myState = Object.assign(
                    {},
                    DATATABLE_STATE_WITHOUT_PREVIEW_ROWS
                );
                updateRowsAndCellIndexes.call({ state: myState, privateTypes });
                const expectedIndexesMap = {
                    a: {
                        'name-text': [0, 0],
                        'amount-number': [0, 1],
                        'email-text': [0, 2],
                        rowIndex: 0,
                    },
                    b: {
                        'name-text': [1, 0],
                        'amount-number': [1, 1],
                        'email-text': [1, 2],
                        rowIndex: 1,
                    },
                    c: {
                        'name-text': [2, 0],
                        'amount-number': [2, 1],
                        'email-text': [2, 2],
                        rowIndex: 2,
                    },
                };
                expect(myState.indexes).toEqual(expectedIndexesMap);
            });
        });
    });
    describe('computeCellAttributes', () => {
        it('should return empty object if there are no cellAttributes defined', () => {
            const row = {};
            const col = { type: 'currency' };
            expect(computeCellAttributes(row, col)).toEqual({});
        });
        it('should return a value passed when it is not an object like', () => {
            const row = {};
            const col = {
                type: 'url',
                cellAttributes: {
                    iconLabel: 'Show details',
                },
            };
            expect(computeCellAttributes(row, col)).toEqual({
                iconLabel: 'Show details',
            });
        });
        it('should get the value from the row when and object with filedName prop is passed', () => {
            const row = { confidenceDeltaIcon: 'utility:up' };
            const col = {
                type: 'url',
                cellAttributes: {
                    iconName: {
                        fieldName: 'confidenceDeltaIcon',
                    },
                    iconLabel: 'delta',
                },
            };
            expect(computeCellAttributes(row, col)).toEqual({
                iconName: 'utility:up',
                iconLabel: 'delta',
            });
        });
        it('should not include attributes when the fieldName is pointing to nowhere', () => {
            const row = { confidenceDeltaLabel: 'utility:up' };
            const col = {
                type: 'url',
                cellAttributes: {
                    iconName: {
                        fieldName: 'idonotexist',
                    },
                },
            };
            expect(computeCellAttributes(row, col)).toEqual({});
        });
    });
});
