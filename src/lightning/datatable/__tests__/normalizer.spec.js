import { generateHeaderIndexes } from './../normalizer';

describe('datatable normalizer', () => {
    describe('generateHeaderIndexes', () => {
        it('should return the header index based on the passed metadata', () => {
            const normalizedMetadata = [
                { fieldName: 'name', type: 'text' },
                { fieldName: 'amount', type: 'number' },
            ];
            const headerIndexes = generateHeaderIndexes(normalizedMetadata);
            expect(headerIndexes).toEqual({
                'name-text': 0,
                'amount-number': 1,
            });
        });

        it('should return empty object if no columns', () => {
            const normalizedMetadata = [];
            const headerIndexes = generateHeaderIndexes(normalizedMetadata);
            expect(headerIndexes).toEqual({});
        });
    });
});
