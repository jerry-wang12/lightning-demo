import {
    formatDateTimeUTC,
    formatDateUTC,
    parseDateTimeUTC,
    syncUTCToWallTime,
    syncWallTimeToUTC,
    getLocale,
} from 'lightning/internalLocalizationService';

// This library merely exports some methods from another library
// so the test just makes sure the functions exist so nobody accidentaly
// removes them and breaks the downstream teams
describe('exported methods', () => {
    it('includes formatDateTimeUTC', () => {
        expect(typeof formatDateTimeUTC).toBe('function');
    });
    it('includes formatDateUTC', () => {
        expect(typeof formatDateUTC).toBe('function');
    });
    it('includes parseDateTimeUTC', () => {
        expect(typeof parseDateTimeUTC).toBe('function');
    });
    it('includes syncUTCToWallTime', () => {
        expect(typeof syncUTCToWallTime).toBe('function');
    });
    it('includes syncWallTimeToUTC', () => {
        expect(typeof syncWallTimeToUTC).toBe('function');
    });
    it('includes getLocale', () => {
        expect(typeof getLocale).toBe('function');
    });
});
