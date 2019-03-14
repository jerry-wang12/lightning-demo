import { toNorthAmericanPhoneNumber } from '../phonify';

describe('isNorthAmericanPhoneNumber()', () => {
    it('11 digits, start with 1', () => {
        expect(toNorthAmericanPhoneNumber('14251221234')).toBe(
            '(425) 122-1234'
        );
    });

    it('11 digits, not start with 1', () => {
        expect(toNorthAmericanPhoneNumber('24251221234')).toBe('24251221234');
    });

    it('10 digits', () => {
        expect(toNorthAmericanPhoneNumber('4251221234')).toBe('(425) 122-1234');
        expect(toNorthAmericanPhoneNumber('1234567890')).toBe('(123) 456-7890');
    });

    it('non 10 or 11 digits', () => {
        expect(toNorthAmericanPhoneNumber('+14251221234')).toBe('+14251221234');
        expect(toNorthAmericanPhoneNumber('56789')).toBe('56789');
        expect(toNorthAmericanPhoneNumber('4s51221234')).toBe('4s51221234');
    });
});
