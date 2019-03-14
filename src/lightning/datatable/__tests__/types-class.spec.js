import DatatableTypes from './../types';

describe('DatatableTypes class', () => {
    describe('constructor inject custom types', () => {
        it('should add the new types to the type collection', () => {
            const types = new DatatableTypes({
                fancyNumber: {
                    template: () => {},
                    typeAttributes: ['range'],
                },
            });
            expect(types.getType('fancyNumber')).toEqual(
                expect.objectContaining({
                    type: 'custom',
                    typeAttributes: ['range'],
                })
            );
        });
        it('should fallback typeAttributes to empty array', () => {
            const types = new DatatableTypes({
                fancyNumber: {
                    template: () => {},
                },
            });
            expect(types.getType('fancyNumber')).toEqual(
                expect.objectContaining({
                    type: 'custom',
                    typeAttributes: [],
                })
            );
        });
    });
    describe('getType', () => {
        it('should return the type object when the type exists', () => {
            const types = new DatatableTypes();
            expect(types.getType('number')).toEqual(
                expect.objectContaining({
                    type: 'standard',
                    typeAttributes: [
                        'minimumIntegerDigits',
                        'minimumFractionDigits',
                        'maximumFractionDigits',
                        'minimumSignificantDigits',
                        'maximumSignificantDigits',
                    ],
                })
            );
        });
        it('should return undefined when the type does not exists', () => {
            const types = new DatatableTypes();
            expect(types.getType('fancy-number')).toBeUndefined();
        });
    });
});
