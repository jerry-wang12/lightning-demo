import { normalizeInput } from './../normalize';

describe('normalizeInput', () => {
    it('does not modify a number type', () => {
        const value = 123;

        expect(normalizeInput(value)).toBe(value);
    });

    it('does not modify a string type', () => {
        const value = '  Hello  ';

        expect(normalizeInput(value)).toBe(value);
    });

    it('returns empty string when value is null', () => {
        const value = null;

        expect(normalizeInput(value)).toBe('');
    });
});
