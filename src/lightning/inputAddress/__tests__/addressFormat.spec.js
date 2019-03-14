import { parseLocaleFormat } from '../addressFormat';

describe('address format utils', () => {
    describe('parseLocaleFormat', () => {
        it('parses valid locale format correctly', () => {
            const fields = parseLocaleFormat('ACSZK');
            expect(fields).toEqual([
                'street',
                'city',
                'province',
                'postalCode',
                'country',
            ]);
        });

        it('parses lowercased valid locale format correctly', () => {
            const fields = parseLocaleFormat('acszk');
            expect(fields).toEqual([
                'street',
                'city',
                'province',
                'postalCode',
                'country',
            ]);
        });
    });
});
