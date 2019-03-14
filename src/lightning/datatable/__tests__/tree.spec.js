import { getStateTreeColumn, hasTreeDataType } from '../tree';

describe('tree module', () => {
    describe('getStateTreeColumn', () => {
        it('should return the correct column with type tree', () => {
            const state = {
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'text' },
                    { colKeyValue: 'tree-1', type: 'tree' },
                    { colKeyValue: 'text-2', type: 'text' },
                ],
            };
            expect(getStateTreeColumn(state).colKeyValue).toBe('tree-1');
        });
        it('should return null when there is no tree column', () => {
            const state = {
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'text' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            expect(getStateTreeColumn(state)).toBe(null);
        });
    });
    describe('hasTreeDataType', () => {
        it('should return false when no columns', () => {
            const state = {
                columns: [],
            };
            expect(hasTreeDataType(state)).toBe(false);
        });
        it('should return false when there is no tree column', () => {
            const state = {
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'text' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            expect(hasTreeDataType(state)).toBe(false);
        });
        it('should return false when there is atleast a tree column', () => {
            const state = {
                columns: [
                    { colKeyValue: 'key', internal: true },
                    { colKeyValue: 'text-1', type: 'tree' },
                    { colKeyValue: 'url-2', type: 'url' },
                    { colKeyValue: 'phone-3', type: 'phone' },
                ],
            };
            expect(hasTreeDataType(state)).toBe(true);
        });
    });
});
