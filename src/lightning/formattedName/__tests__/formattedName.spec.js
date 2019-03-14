import { createElement } from 'lwc';
import Element from 'lightning/formattedName';
import { setLocaleTagMock } from '../__mocks__/localeUtilsFormattedName';

const createFormattedNameComponent = () => {
    const element = createElement('lightning-formatted-name', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

describe('lightning-formatted-name', () => {
    it('default by not passing any value', () => {
        const element = createFormattedNameComponent();
        expect(element).toMatchSnapshot();
    });

    it('defaults to en_US order and long format', () => {
        const element = createFormattedNameComponent();
        element.salutation = 'Mr.';
        element.firstName = 'John';
        element.lastName = 'Doe';
        element.middleName = 'Middleton';
        element.informalName = 'Jo';
        element.suffix = 'The 3rd';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('Name with short format', () => {
        const element = createFormattedNameComponent();
        element.salutation = 'Mr.';
        element.firstName = 'John';
        element.lastName = 'Doe';
        element.middleName = 'Middleton';
        element.informalName = 'Jo';
        element.suffix = 'The 3rd';
        element.format = 'short';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('Name with medium format', () => {
        const element = createFormattedNameComponent();
        element.salutation = 'Mr.';
        element.firstName = 'John';
        element.lastName = 'Doe';
        element.middleName = 'Middleton';
        element.informalName = 'Jo';
        element.suffix = 'The 3rd';
        element.format = 'medium';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('full name with ja_JP order', () => {
        setLocaleTagMock('ja_JP');
        const element = createFormattedNameComponent();
        element.salutation = 'Mr.';
        element.firstName = 'John';
        element.lastName = 'Doe';
        element.middleName = 'Middleton';
        element.informalName = 'Jo';
        element.suffix = 'The 3rd';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('full name with only locale set to language - ja', () => {
        setLocaleTagMock('ja');
        const element = createFormattedNameComponent();
        element.salutation = 'Mr.';
        element.firstName = 'John';
        element.lastName = 'Doe';
        element.middleName = 'Middleton';
        element.informalName = 'Jo';
        element.suffix = 'The 3rd';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
