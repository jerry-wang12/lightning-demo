import { createElement } from 'lwc';
import Element from 'lightning/formattedTime';
import { setLocaleTagMock } from '../__mocks__/localeUtilsFormattedTime';

const createFormattedTimeComponent = () => {
    const element = createElement('lightning-formatted-time', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

describe('lightning-formatted-time', () => {
    it('default by not passing any value', () => {
        const element = createFormattedTimeComponent();
        expect(element).toMatchSnapshot();
    });

    it('defaults to the US time format', () => {
        setLocaleTagMock('en_US');
        const element = createFormattedTimeComponent();
        element.value = '22:12:30.999Z';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Morning time', () => {
        setLocaleTagMock('en_US');
        const element = createFormattedTimeComponent();
        element.value = '02:12:30.999Z';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Value without Z suffix', () => {
        setLocaleTagMock('en_US');
        const element = createFormattedTimeComponent();
        element.value = '02:12:30.999';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Empty value', () => {
        const element = createFormattedTimeComponent();
        element.value = '';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
