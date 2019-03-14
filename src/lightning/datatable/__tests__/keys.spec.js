import { createRowKeysGenerator, generateColKeyValue } from './../keys';

describe('keys module', () => {
    describe('#createRowKeysGenerator', () => {
        it('should return and object with a computeUniqueRowKey function', () => {
            const rowKeyGenetator = createRowKeysGenerator('id');
            expect(typeof rowKeyGenetator.computeUniqueRowKey).toBe('function');
        });
        describe('#computeUniqueRowKey', () => {
            it('should return the row id based on the keyField passed', () => {
                const { computeUniqueRowKey } = createRowKeysGenerator('id');
                expect(computeUniqueRowKey({ id: '123' })).toBe('123');
            });
            it('should return a generated key if keyField does not point to a real prop within row object', () => {
                const { computeUniqueRowKey } = createRowKeysGenerator();
                expect(computeUniqueRowKey({ id: '123' })).toBe('row-0');
                expect(computeUniqueRowKey({ id: '456' })).toBe('row-1');
            });
        });
    });
    describe('generateColKeyValue', () => {
        it('should generate a unique key value based on the fieldName and type', () => {
            const columnMetadata = { fieldName: 'name', type: 'text' };
            expect(generateColKeyValue(columnMetadata)).toEqual('name-text');
        });

        it('should generate a unique key value based on the index and type if fieldName its not present', () => {
            const columnMetadata = { type: 'text' };
            expect(generateColKeyValue(columnMetadata, 37)).toEqual('37-text');
        });
    });
});
