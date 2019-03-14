import {
    isObjectLike,
    isPositiveInteger,
    normalizePositiveIntegerAttribute,
    clamp,
} from './../utils';

describe('datatable checkers', () => {
    describe('isObjectLike', () => {
        it('should return false for when null', () => {
            const result = isObjectLike(null);
            expect(result).toBe(false);
        });

        it('should return false for when Function', () => {
            const result = isObjectLike(() => {});
            expect(result).toBe(false);
        });

        it('should return true for when plain object', () => {
            const result = isObjectLike({});
            expect(result).toBe(true);
        });

        it('should return true for when array', () => {
            const result = isObjectLike([1, 2, 3]);
            expect(result).toBe(true);
        });
    });

    describe('isPositiveInteger', () => {
        it('should return true for positive number', () => {
            expect(isPositiveInteger(15)).toBe(true);
        });

        it('should return true for positive number string', () => {
            expect(isPositiveInteger('15')).toBe(true);
        });

        it('should return false for negative number', () => {
            expect(isPositiveInteger(-15)).toBe(false);
        });

        it('should return false for non-number and non-number-string', () => {
            expect(isPositiveInteger('asdf')).toBe(false);
        });

        it('should return false for null', () => {
            expect(isPositiveInteger(null)).toBe(false);
        });
    });

    describe('normalizePositiveIntegerAttribute', () => {
        it('should return original number if it is positive integer', () => {
            expect(normalizePositiveIntegerAttribute('number', 10, 0)).toBe(10);
        });

        it('should convert string number to number', () => {
            expect(normalizePositiveIntegerAttribute('number', '10', 0)).toBe(
                10
            );
        });

        it('should return fallback when value is not a number', () => {
            expect(
                normalizePositiveIntegerAttribute('number', 'dafsd', 1)
            ).toBe(1);
        });

        it('should return fallback when value is a negative integer', () => {
            expect(normalizePositiveIntegerAttribute('number', -10, 1)).toBe(1);
        });
    });

    describe('clamp', () => {
        it('should return original number if within range', () => {
            expect(clamp(3, 0, 5)).toBe(3);
        });

        it('should return min number if less than min', () => {
            expect(clamp(1, 3, 5)).toBe(3);
        });

        it('should return max number if greater than max', () => {
            expect(clamp(10, 0, 5)).toBe(5);
        });
    });
});
