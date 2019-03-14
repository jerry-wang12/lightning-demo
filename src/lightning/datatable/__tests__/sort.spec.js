import {
    isValidSortDirection,
    setSortedBy,
    setSortedDirection,
    setDefaultSortDirection,
    updateColumnSortingState,
} from './../sort';

describe('sort module', () => {
    describe('isValidSortDirection()', () => {
        it('should return true when "asc" or "desc" were passed', () => {
            expect(isValidSortDirection('asc')).toBe(true);
            expect(isValidSortDirection('desc')).toBe(true);
        });
        it('should be false when any other thing beside "asc" or "desc" were passed', () => {
            expect(isValidSortDirection('ASC')).toBe(false);
            expect(isValidSortDirection('DESC')).toBe(false);
            expect(isValidSortDirection(undefined)).toBe(false);
            expect(isValidSortDirection(null)).toBe(false);
            expect(isValidSortDirection(0)).toBe(false);
        });
    });
    describe('setSortedBy()', () => {
        it('should update state when a correct value was passed(string)', () => {
            const state = { sortedBy: 'name' };
            setSortedBy(state, 'price');
            expect(state).toEqual({ sortedBy: 'price' });
        });
        it('should fallback to undefined when the value passed is not string', () => {
            const state = { sortedBy: 'name' };
            expect(setSortedBy(state, 12)).toBe(undefined);
        });
    });
    describe('setSortedDirection()', () => {
        it('should update the state when a correct values is passed', () => {
            const state = { sortedDirection: 'asc' };
            setSortedDirection(state, 'desc');
            expect(state).toEqual({ sortedDirection: 'desc' });
        });
        it('should throw when an incorrect value is passed', () => {
            const state = { sortedDirection: 'asc' };
            expect(() => {
                setSortedDirection(state, 'DESC');
            }).toThrow();
        });
    });
    describe('setDefaultSortDirection()', () => {
        it('should update the state when a correct values is passed', () => {
            const state = { defaultSortDirection: 'asc' };
            setDefaultSortDirection(state, 'desc');
            expect(state).toEqual({ defaultSortDirection: 'desc' });
        });
        it('should throw when an incorrect value is passed', () => {
            const state = { defaultSortDirection: 'asc' };
            expect(() => {
                setDefaultSortDirection(state, 'DESC');
            }).toThrow();
        });
    });
    describe('updateColumnSortingState()', () => {
        it('should mark sorted "true" if the column fieldName is being sorted the column is sortable', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'asc',
            };
            const column = { fieldName: 'name', sortable: true };
            updateColumnSortingState(column, state);
            expect(column.sorted).toBe(true);
        });
        it('should mark sorted "false" if the column fieldName is being sorted the column is not sortable', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'asc',
            };
            const column = { fieldName: 'name' };
            updateColumnSortingState(column, state);
            expect(column.sorted).toBe(false);
        });
        it('should set sortedDirection if the column fieldName is being sorted the column is sortable', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'asc',
            };
            const column = { fieldName: 'name', sortable: true };
            updateColumnSortingState(column, state);
            expect(column.sortedDirection).toBe('asc');
        });
        it('should set sortedDirection as defaultSortDirection if the column fieldName is not being sorted', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'desc',
            };
            const column = { fieldName: 'price', sortable: true };
            updateColumnSortingState(column, state);
            expect(column.sortedDirection).toBe('desc');
        });
        it('should set aria-sort string to ascending or descending if the column fieldName is being sorted', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'desc',
            };
            const column = { fieldName: 'name', sortable: true };
            updateColumnSortingState(column, state);
            expect(column.sortAriaLabel).toBe('ascending');
        });
        it('should set aria-sort string to none if the column fieldName is not being sorted but is sortable', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'desc',
            };
            const column = { fieldName: 'price', sortable: true };
            updateColumnSortingState(column, state);
            expect(column.sortAriaLabel).toBe('none');
        });
        it('should set aria-sort string to null(means not aria-label) if the column is not sortable', () => {
            const state = {
                sortedBy: 'name',
                sortedDirection: 'asc',
                defaultSortDirection: 'desc',
            };
            const column = { fieldName: 'price', sortable: false };
            updateColumnSortingState(column, state);
            expect(column.sortAriaLabel).toBeNull();
        });
    });
});
