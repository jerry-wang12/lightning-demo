import { createElement } from 'lwc';
import Element from 'lightning/inputAddress';
// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils } from 'lightning:IntlLibrary';

expect.extend({
    toContainText(actual, expected) {
        const pass = actual.textContent.includes(expected);
        return {
            message: () =>
                `expected element's text \n\n "${actual.textContent}" \n\n to ${
                    pass ? 'NOT ' : ''
                }contain text ${expected}`,
            pass,
        };
    },
});

const defaultAttributes = {
    addressLabel: 'Address',
    streetLabel: 'Street',
    cityLabel: 'City',
    countryLabel: 'Country',
    provinceLabel: 'Province/State',
    postalCodeLabel: 'Zip/Postal Code',
};

const createInputAddress = params => {
    const element = createElement('lightning-input-address', {
        is: Element,
    });
    Object.assign(element, defaultAttributes, params);
    document.body.appendChild(element);
    return element;
};

function setLocaleMock(locale) {
    localeUtils.getLocaleTag = () => locale;
}

describe('input-address', () => {
    const addressValues = {
        street: '121 Spear St.',
        city: 'San Francisco',
        country: 'US',
        province: 'CA',
        postalCode: '94105',
    };

    describe('basic', () => {
        it('sets values correctly', () => {
            const element = createInputAddress(addressValues);
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders Help Text', () => {
            const element = createInputAddress({
                fieldLevelHelp: 'Help Text',
            });
            return Promise.resolve().then(() => {
                expect(
                    element.shadowRoot.querySelector('lightning-helptext')
                        .shadowRoot
                ).toContainText('Help Text');
            });
        });

        it('adds slds-assistive-text class to legend when variant=label-hidden', () => {
            const element = createInputAddress({
                variant: 'label-hidden',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('sets certain fields required based on globalization format if required=true', () => {
            const element = createInputAddress({
                required: true,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('disables all fields when disabled=true', () => {
            const element = createInputAddress({
                disabled: true,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('sets readonly to all fields when readonly=true', () => {
            const element = createInputAddress({
                readOnly: true,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('province and country picklist', () => {
        const provinceOptions = [
            { label: 'California', value: 'CA' },
            { label: 'Texas', value: 'TX' },
            { label: 'Washington', value: 'WA' },
        ];

        const countryOptions = [
            { label: 'United States', value: 'US' },
            { label: 'Japan', value: 'JP' },
            { label: 'China', value: 'CN' },
        ];

        it('shows picklists when options are available', () => {
            const element = createInputAddress({
                provinceOptions,
                countryOptions,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('passes values to picklist', () => {
            const element = createInputAddress({
                provinceOptions,
                countryOptions,
                ...addressValues,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('sets required=true correctly on picklists', () => {
            const element = createInputAddress({
                required: true,
                provinceOptions,
                countryOptions,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('sets disabled=true correctly on picklists', () => {
            const element = createInputAddress({
                disabled: true,
                provinceOptions,
                countryOptions,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('arranging fields', () => {
        it('displays fields in the right order with correct labels', () => {
            // expected widths
            // 6A
            // 4C | 2S
            // 4Z | 2K
            setLocaleMock('en-US');
            const element = createInputAddress();
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('distribute field widths correctly when default widths do not fill up the rows', () => {
            // expected widths
            // 3K | 3S
            // 6C
            // 6A
            // 6Z
            setLocaleMock('cn-CN');
            const element = createInputAddress({
                country: 'CN',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });
    describe('use lookupAddress', () => {
        it('if address is selected, should fire change event', () => {
            let changeEventIsFired = false;
            let addressFromEvent = {};
            const selectedAddress = {
                street: '415 Mission Street',
                city: 'San Francisco',
                state: 'California',
                country: 'USA',
                postalCode: '9004',
            };
            const element = createInputAddress({
                showAddressLookup: true,
                onchange: event => {
                    changeEventIsFired = true;
                    addressFromEvent = event.detail;
                },
            });
            return Promise.resolve().then(() => {
                element.shadowRoot
                    .querySelector('lightning-lookup-address')
                    .fireChangeEvent(selectedAddress);

                expect(changeEventIsFired).toBe(true);
                expect(addressFromEvent.street).toEqual(selectedAddress.street);
                expect(addressFromEvent.city).toEqual(selectedAddress.city);
                expect(addressFromEvent.province).toEqual(
                    selectedAddress.state
                );
                expect(addressFromEvent.country).toEqual(
                    selectedAddress.country
                );
                expect(addressFromEvent.postalCode).toEqual(
                    selectedAddress.postalCode
                );
            });
        });
    });
});
