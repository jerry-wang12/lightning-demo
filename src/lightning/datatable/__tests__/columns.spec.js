import {
    hasColumns,
    getColumns,
    isCustomerColumn,
    getUserColumnIndex,
    getStateColumnIndex,
    normalizeColumns,
    getNormalizedSubTypeAttribute,
    getColumnIndexByFieldName,
} from './../columns';

describe('columns', () => {
    describe('hasColumns', () => {
        it('should return false if there are not columns in the state', () => {
            const state = { columns: [] };
            expect(hasColumns(state)).toBe(false);
        });
        it('should return true if there are columns in the state', () => {
            const state = { columns: [1, 2, 3] };
            expect(hasColumns(state)).toBe(true);
        });
    });

    describe('getColumns', () => {
        it('should return the columns collection on the state', () => {
            const state = { columns: [1, 2, 3] };
            expect(getColumns(state)).toEqual([1, 2, 3]);
        });
    });

    describe('isCustomerColumn', () => {
        it('should return false to a no customer column', () => {
            const column = { internal: true };
            expect(isCustomerColumn(column)).toBe(false);
        });
        it('should return true to a customer column', () => {
            const column = {};
            expect(isCustomerColumn(column)).toBe(true);
        });
    });

    describe('normalizeSubTypeAttribute', () => {
        it('should set subtype to provided one when it is valid', () => {
            const expectedTypeAttributes = {
                subType: 'url',
                subTypeAttributes: {
                    label: 'foo',
                },
            };

            const actualTypeAttributes = getNormalizedSubTypeAttribute('tree', {
                subType: 'url',
                subTypeAttributes: {
                    label: 'foo',
                },
            });

            expect(actualTypeAttributes).toEqual(expectedTypeAttributes);
        });
        it('should set subtype to text when invalid subtype is provided', () => {
            const expectedTypeAttributes = {
                subType: 'text',
                subTypeAttributes: {},
            };
            const actualTypeAttributes = getNormalizedSubTypeAttribute('tree', {
                subType: 'button',
            });
            expect(actualTypeAttributes).toEqual(expectedTypeAttributes);
        });
    });
    describe('getColumnIndex', () => {
        it('should return -1 as user index if the column is internal', () => {
            const state = {
                headerIndexes: { '1': 0, '2': 2, key: 1 },
                columns: [
                    { colKeyValue: '1' },
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: '2' },
                ],
            };

            expect(getUserColumnIndex(state, 'key')).toBe(-1);
            expect(getStateColumnIndex(state, 'key')).toBe(1);
        });
        it('both index should match if there is no internal column before the expected', () => {
            const state = {
                headerIndexes: { '1': 0, key1: 2, key: 1 },
                columns: [
                    { colKeyValue: '1' },
                    { colKeyValue: 'key' },
                    { colKeyValue: 'key1', internal: true },
                ],
            };

            expect(getUserColumnIndex(state, 'key')).toBe(1);
            expect(getStateColumnIndex(state, 'key')).toBe(1);
        });
        it('user index should have N reduced when it has N internal before the expected', () => {
            const state = {
                headerIndexes: { '1': 0, key1: 2, key: 1 },
                columns: [
                    { colKeyValue: '1' },
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'key1' },
                ],
            };

            // NOTE: that the user index has 1 reduced because it counted col[1] as internal
            expect(getUserColumnIndex(state, 'key1')).toBe(1);
            expect(getStateColumnIndex(state, 'key1')).toBe(2);
        });
    });

    describe('normalizeColumns', () => {
        it('should set defaults for columns of unknown types', () => {
            const state = {
                columns: [],
                hideCheckboxColumn: true,
            };
            const typesMock = {
                isValidType: () => false,
            };
            normalizeColumns(state, [{ type: 'unknown' }], typesMock);

            const isObject = obj => obj !== null && typeof obj === 'object';
            const unknownColumn = state.columns[0];

            expect(unknownColumn.type).toBe('text');
            expect(isObject(unknownColumn.typeAttributes)).toBe(true);
            expect(isObject(unknownColumn.cellAttributes)).toBe(true);
        });
    });

    describe('getColumnIndexByFieldName', () => {
        const state = {
            columns: [
                { fieldName: 'a' },
                { fieldName: 'b' },
                { fieldName: 'c' },
                { fieldName: 'd' },
            ],
        };
        it('should return -1 if there is no column with that field name', () => {
            const columnIndex = getColumnIndexByFieldName(state, 'non-present');
            expect(columnIndex).toBe(-1);
        });

        it('should return 0 if is the first column', () => {
            const columnIndex = getColumnIndexByFieldName(state, 'a');
            expect(columnIndex).toBe(0);
        });

        it('should return last index if is the last column', () => {
            const columnIndex = getColumnIndexByFieldName(state, 'd');
            expect(columnIndex).toBe(3);
        });

        it('should return the index if is not a boundary column', () => {
            const columnIndex = getColumnIndexByFieldName(state, 'c');
            expect(columnIndex).toBe(2);
        });
    });
});
