import {
    getRowNumberState,
    getRowNumberColumnDef,
    getRowNumberOffset,
    setRowNumberOffset,
    adjustRowNumberColumnWidth,
} from './../rowNumber';
import * as resizer from './../resizer';

jest.mock('./../resizer', () => ({
    hasDefinedColumnsWidths: state => {
        return state.columnWidths.length > 0;
    },
    adjustColumnsSize: jest.fn(),
}));

function getMockState() {
    const rowNumberColumnDef = getRowNumberColumnDef();
    return {
        showRowNumberColumn: true,
        rowNumberOffset: 0,
        rows: {
            length: 0, // fake array length
        },
        columns: [rowNumberColumnDef],
        columnWidths: [rowNumberColumnDef.initialWidth],
    };
}

describe('datatable row number column', () => {
    describe('row number offset', () => {
        it('returns defaults when value is not a number', () => {
            const state = {};
            setRowNumberOffset(state, 'abc');
            expect(getRowNumberOffset(state)).toBe(
                getRowNumberState().rowNumberOffset
            );
        });

        it('returns defaults when value is negative', () => {
            const state = {};
            setRowNumberOffset(state, -5);
            expect(getRowNumberOffset(state)).toBe(
                getRowNumberState().rowNumberOffset
            );
        });

        it('converts string number to number type', () => {
            const state = {};
            setRowNumberOffset(state, '10');
            expect(getRowNumberOffset(state)).toBe(10);
        });
    });

    describe('calculate rown number column width', () => {
        it('should returns a greater width when row numbers are large and need more space', () => {
            const state = getMockState();
            state.rows.length = 10000000;
            const rowNumberCol = state.columns[0];
            const initialWidth = rowNumberCol.initialWidth;

            adjustRowNumberColumnWidth({}, state);
            expect(rowNumberCol.initialWidth).toBeGreaterThan(initialWidth);
        });

        it('should find the row number column def correctly and adjust width', () => {
            const state = getMockState();
            state.columns.unshift({});
            state.rows.length = 10000000;
            const rowNumberCol = state.columns[1];
            const initialWidth = rowNumberCol.initialWidth;

            adjustRowNumberColumnWidth({}, state);
            expect(rowNumberCol.initialWidth).toBeGreaterThan(initialWidth);
        });

        it('do not use resizer if resizer has not initialized column widths', () => {
            const state = getMockState();
            state.columnWidths = [];

            resizer.adjustColumnsSize.mockReset();
            adjustRowNumberColumnWidth({}, state);
            expect(resizer.adjustColumnsSize).not.toBeCalled();
        });

        it('uses resizer if resizer has initialized column widths and width has changed', () => {
            const state = getMockState();

            state.rows.length = 10000000;
            resizer.adjustColumnsSize.mockReset();
            adjustRowNumberColumnWidth({}, state);
            expect(resizer.adjustColumnsSize).toBeCalled();

            state.rows.length = 10000005;
            resizer.adjustColumnsSize.mockReset();
            adjustRowNumberColumnWidth({}, state);
            expect(resizer.adjustColumnsSize).not.toBeCalled();
        });
    });
});
