import { createElement } from 'lwc';
import Element from 'lightning/formattedAddress';
// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils } from 'lightning:IntlLibrary';

const defaultAttributes = {
    street: '121 Spear St.',
    city: 'San Francisco',
    country: 'US',
    province: 'CA',
    postalCode: '94105',
};

const createFormattedAddress = params => {
    const element = createElement('lightning-formatted-address', {
        is: Element,
    });
    Object.assign(element, defaultAttributes, params);
    document.body.appendChild(element);
    return element;
};

function setLocaleMock(locale) {
    localeUtils.getLocaleTag = () => locale;
}

describe('formatted-address', () => {
    setLocaleMock('cn-CN');

    it('format address based on locale', () => {
        const element = createFormattedAddress();
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('disabled formatted-address has no link', () => {
        const element = createFormattedAddress({
            disabled: true,
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('uses latitude and longitude for title and url if both exist', () => {
        const element = createFormattedAddress({
            latitude: '123',
            longitude: '456',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('does not use latitude and longitude for title and url if latitude does not exist', () => {
        const element = createFormattedAddress({
            longitude: '456',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('does not use latitude and longitude for title and url if longitude does not exist', () => {
        const element = createFormattedAddress({
            latitude: '123',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
