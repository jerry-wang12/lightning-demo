import { isValidType, getAttributesNames } from './../types';

describe('types module', () => {
    describe('isValidType', () => {
        it('should return false when the type is not valid', () => {
            expect(isValidType('reinier')).toBe(false);
        });
        it('should return true when the type is valid', () => {
            expect(isValidType('text')).toBe(true);
        });
    });
    describe('getAttributesNames', () => {
        it('should throw if the type passed is not valid', () => {
            expect(() => {
                getAttributesNames('reinier');
            }).toThrow();
        });
        it('should return a list of accepted attributes of the type', () => {
            expect(getAttributesNames('number')).toEqual([
                'minimumIntegerDigits',
                'minimumFractionDigits',
                'maximumFractionDigits',
                'minimumSignificantDigits',
                'maximumSignificantDigits',
            ]);
        });
        it('should return empty array is the type is valid but does not have extra attributes', () => {
            expect(getAttributesNames('text')).toEqual([]);
        });
    });
});
