import { showAdvancedSearch } from '../advancedSearch';
import { showCustomOverlay } from 'lightning/deprecatedOverlayUtils';

jest.mock(
    'lightning/deprecatedOverlayUtils',
    () => {
        return {
            showCustomOverlay: jest.fn(),
        };
    },
    { virtual: true }
);

describe('lookup-desktop:advanced-search', () => {
    const label = 'Test Label';
    const panel = {
        _panelInstance: {},
    };
    const attrs = {
        label,
    };

    showCustomOverlay.mockImplementation(() => {
        return new Promise(resolve => {
            resolve(panel);
        });
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Calls showCustomOverlay', () => {
        showAdvancedSearch(attrs);
        return Promise.resolve().then(() => {
            expect(showCustomOverlay.mock.calls).toHaveLength(1);
        });
    });

    it('Errors on null attributes', () => {
        expect(() => {
            showAdvancedSearch(null);
        }).toThrow();
    });

    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('No errors with valid attributes', () => {
        expect(() => {
            showAdvancedSearch(attrs);
        }).not.toThrow();
    });
});
