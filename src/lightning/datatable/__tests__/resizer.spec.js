import {
    updateColumnWidthsMetadata,
    getCustomerColumnWidths,
    resizeColumnWithDelta,
    resizeColumn,
    adjustColumnsSize,
} from '../resizer';

jest.mock('../columns', () => ({
    getColumns: state => state.columns,
    isCustomerColumn: column => column.isCustomer,
}));

describe('resizer', () => {
    describe('adjustColumnsSize', () => {
        it('should set table width to maxWidth times nro of columns when the available space is larger', () => {
            const root = {
                querySelector: jest.fn(() => {
                    return { offsetWidth: 100 };
                }),
            };

            const state = {
                columns: [
                    {
                        internal: true,
                        initialWidth: 52,
                        minWidth: 52,
                        maxWidth: 1000,
                    },
                    {},
                    {},
                ],
                minColumnWidth: 15,
                maxColumnWidth: 20,
            };

            adjustColumnsSize(root, state);
            expect(state.tableWidth).toBe(92);
            expect(state.columns[0].columnWidth).toBe(52);
            expect(state.columns[1].columnWidth).toBe(20);
            expect(state.columns[2].columnWidth).toBe(20);
        });
    });

    describe('updateColumnWidthsMetadata', () => {
        it('fill column defs with minWidth and maxWidth', () => {
            const state = {
                columns: [
                    {
                        minWidth: 10,
                        maxWidth: 15,
                    },
                    {},
                ],
                minColumnWidth: 15,
                maxColumnWidth: 20,
            };
            updateColumnWidthsMetadata(state);
            expect(state.columns).toEqual([
                {
                    minWidth: state.minColumnWidth,
                    maxWidth: state.maxColumnWidth,
                },
                {
                    minWidth: state.minColumnWidth,
                    maxWidth: state.maxColumnWidth,
                },
            ]);
        });

        it('should respect internal column defs with minWidth and maxWidth', () => {
            const state = {
                columns: [
                    {
                        minWidth: 10,
                        maxWidth: 15,
                        internal: true,
                    },
                    {},
                ],
                minColumnWidth: 15,
                maxColumnWidth: 20,
            };
            updateColumnWidthsMetadata(state);
            expect(state.columns).toEqual([
                {
                    internal: true,
                    minWidth: 10,
                    maxWidth: 15,
                },
                {
                    minWidth: state.minColumnWidth,
                    maxWidth: state.maxColumnWidth,
                },
            ]);
        });

        it('clamp initialWidth with minWidth and maxWidth if initialWidth is defined', () => {
            const state = {
                columns: [
                    {
                        initialWidth: 10,
                    },
                    {
                        initialWidth: 30,
                        maxWidth: 25,
                    },
                ],
                minColumnWidth: 15,
                maxColumnWidth: 20,
            };
            updateColumnWidthsMetadata(state);
            expect(state.columns).toEqual([
                {
                    initialWidth: 15,
                    minWidth: state.minColumnWidth,
                    maxWidth: state.maxColumnWidth,
                },
                {
                    initialWidth: 20,
                    minWidth: state.minColumnWidth,
                    maxWidth: state.maxColumnWidth,
                },
            ]);
        });
    });

    describe('getCustomerColumnWidths', () => {
        it('returns empty array if no customer columns', () => {
            const state = {
                columns: [
                    {
                        isCustomer: false,
                    },
                    {
                        isCustomer: false,
                    },
                ],
                columnWidths: [10, 20],
            };
            expect(getCustomerColumnWidths(state)).toEqual([]);
        });
        it('returns widths of customer columns', () => {
            const state = {
                columns: [
                    {
                        isCustomer: true,
                    },
                    {
                        isCustomer: false,
                    },
                    {
                        isCustomer: true,
                    },
                ],
                columnWidths: [10, 20, 30],
            };
            expect(getCustomerColumnWidths(state)).toEqual([10, 30]);
        });
    });

    describe('resizeColumn', () => {
        function getMockStateForResizing() {
            return {
                tableWidth: 50,
                columns: [
                    {
                        columnWidth: 20,
                        minWidth: 10,
                        maxWidth: 30,
                    },
                    {
                        columnWidth: 30,
                        minWidth: 10,
                        maxWidth: 40,
                    },
                ],
                columnWidths: [20, 30],
            };
        }

        function getNewMockState(colIndex, newWidth, tableWidth) {
            const state = getMockStateForResizing();
            state.tableWidth = tableWidth;
            state.columns[colIndex].columnWidth = newWidth;
            state.columns[colIndex].style = `width:${newWidth}px`;
            state.columns[colIndex].isResized = true;
            state.columnWidths[colIndex] = newWidth;
            return state;
        }

        it('resize width correctly', () => {
            const colIndex = 0;
            const newWidth = 30;
            const state = getMockStateForResizing();
            const newState = getNewMockState(colIndex, newWidth, 60);
            resizeColumn(state, colIndex, newWidth);
            expect(state).toEqual(newState);
        });

        it('use minWidth if newWidth is smaller than minWidth', () => {
            const colIndex = 0;
            const newWidth = 5;
            const state = getMockStateForResizing();
            const newState = getNewMockState(
                colIndex,
                state.columns[colIndex].minWidth,
                40
            );
            resizeColumn(state, colIndex, newWidth);
            expect(state).toEqual(newState);
        });

        it('use maxWidth if newWidth is larger than maxWidth', () => {
            const colIndex = 1;
            const newWidth = 50;
            const state = getMockStateForResizing();
            const newState = getNewMockState(
                colIndex,
                state.columns[colIndex].maxWidth,
                60
            );
            resizeColumn(state, colIndex, newWidth);
            expect(state).toEqual(newState);
        });

        it('does not do anything when width is the same', () => {
            const colIndex = 0;
            const state = getMockStateForResizing();
            resizeColumn(state, colIndex, state.columnWidths[colIndex]);
            expect(state).toEqual(state);
        });

        describe('with delta', () => {
            it('resize width correctly with positive delta', () => {
                const colIndex = 0;
                const delta = 5;
                const state = getMockStateForResizing();
                const newState = getNewMockState(
                    colIndex,
                    state.columnWidths[colIndex] + delta,
                    state.tableWidth + delta
                );
                resizeColumnWithDelta(state, colIndex, delta);
                expect(state).toEqual(newState);
            });

            it('resize width correctly with negative delta', () => {
                const colIndex = 0;
                const delta = -5;
                const state = getMockStateForResizing();
                const newState = getNewMockState(
                    colIndex,
                    state.columnWidths[colIndex] + delta,
                    state.tableWidth + delta
                );
                resizeColumnWithDelta(state, colIndex, delta);
                expect(state).toEqual(newState);
            });

            it('use maxWidth if newWidth is larger than maxWidth', () => {
                const colIndex = 1;
                const delta = 20;
                const state = getMockStateForResizing();
                const newState = getNewMockState(
                    colIndex,
                    state.columns[colIndex].maxWidth,
                    60
                );
                resizeColumnWithDelta(state, colIndex, delta);
                expect(state).toEqual(newState);
            });

            it('use minWidth if newWidth is smaller than minWidth', () => {
                const colIndex = 0;
                const delta = -15;
                const state = getMockStateForResizing();
                const newState = getNewMockState(
                    colIndex,
                    state.columns[colIndex].minWidth,
                    40
                );
                resizeColumnWithDelta(state, colIndex, delta);
                expect(state).toEqual(newState);
            });

            it('does not do anything when delta is 0', () => {
                const colIndex = 0;
                const state = getMockStateForResizing();
                resizeColumnWithDelta(state, colIndex, 0);
                expect(state).toEqual(state);
            });
        });
    });
});
