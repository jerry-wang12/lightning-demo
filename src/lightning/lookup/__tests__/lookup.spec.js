import * as CONSTANTS from '../constants';
import { createElement } from 'lwc';
import * as mockConfigProvider from 'lightning/configProvider';
import Element from 'lightning/lookup';
import mockRecord from './mockRecord.json';
import mockObjectInfos from './mockObjectInfos.json';

const fieldName = 'AccountId';
const label = 'Account';
const objectInfos = JSON.parse(JSON.stringify(mockObjectInfos));
const record = JSON.parse(JSON.stringify(mockRecord));
const values = ['001xx000000001DAAQ'];
const maxValues = 1;

jest.mock('lightning/configProvider', () => {
    let formFactor;
    return {
        getFormFactor() {
            return formFactor;
        },
        __setFormFactor(name) {
            formFactor = name;
        },
        getPathPrefix() {
            return null;
        },
        getLocalizationService() {
            return null;
        },
        getToken() {
            return null;
        },
    };
});

jest.mock(
    'aura-instrumentation',
    () => {
        return {
            interaction: jest.fn(),
        };
    },
    { virtual: true }
);

jest.mock(
    'lightning/uiActionsApi',
    () => {
        return {
            getLookupActions: jest.fn(data => {
                return Promise.resolve({ data });
            }),
        };
    },
    { virtual: true }
);

const createLookup = (isDesktop, params = {}) => {
    mockConfigProvider.__setFormFactor(isDesktop ? 'DESKTOP' : 'MOBILE');
    const element = createElement('lightning-lookup', { is: Element });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

describe('lightning-lookup', () => {
    describe('Desktop', () => {
        it('Loads lightning-lookup-desktop', () => {
            // Arrange
            const element = createLookup(true, {
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values,
            });

            return Promise.resolve().then(() => {
                // Assert
                const desktop = element.shadowRoot.querySelector(
                    CONSTANTS.LIGHTNING_LOOKUP_DESKTOP
                );
                const mobile = element.shadowRoot.querySelector(
                    CONSTANTS.LIGHTNING_LOOKUP_MOBILE
                );
                expect(desktop).not.toBeNull();
                expect(mobile).toBeNull();
            });
        });
    });

    describe('Mobile', () => {
        it('Loads lightning-lookup-mobile', () => {
            // Arrange
            const element = createLookup(false, {
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values,
            });

            return Promise.resolve().then(() => {
                // Assert
                const desktop = element.shadowRoot.querySelector(
                    CONSTANTS.LIGHTNING_LOOKUP_DESKTOP
                );
                const mobile = element.shadowRoot.querySelector(
                    CONSTANTS.LIGHTNING_LOOKUP_MOBILE
                );
                expect(desktop).toBeFalsy();
                expect(mobile).toBeTruthy();
            });
        });
    });
});
