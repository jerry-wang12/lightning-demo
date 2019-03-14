import { createElement } from 'lwc';
import Element from 'lightning/formattedEmail';
import { shadowQuerySelector } from 'lightning/testUtils';

const createFormattedEmail = (params = {}) => {
    const element = createElement('lightning-formatted-email', { is: Element });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

describe('lightning-formatted-email', () => {
    it('default', () => {
        const element = createFormattedEmail();
        expect(element).toMatchSnapshot();
    });

    it('shows value as label when no label', () => {
        const element = createFormattedEmail({
            value: 'abc@email.com',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('shows value as label when label is empty string', () => {
        const element = createFormattedEmail({
            value: 'abc@email.com',
            label: '',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('shows label', () => {
        const element = createFormattedEmail({
            value: 'abc@email.com',
            label: 'my email',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('shows nothing when value has nothing', () => {
        const element = createFormattedEmail({
            value: '  ',
            label: 'my email',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('trims value', () => {
        const element = createFormattedEmail({
            value: ' \r\n\t abc@email.com \r\n\t',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('trims label', () => {
        const element = createFormattedEmail({
            value: 'abc@email.com',
            label: ' \r\n\t my email \r\n\t',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('sets tabIndex', () => {
        const element = createFormattedEmail({
            value: '1234567890',
            tabIndex: '0',
        });
        return Promise.resolve().then(() => {
            expect(element.getAttribute('tabindex')).toBeFalsy();
            expect(
                shadowQuerySelector(element, 'a').getAttribute('tabindex')
            ).toBe('0');
        });
    });

    it('propagates click events down to the inner anchor', () => {
        const element = createFormattedEmail({
            value: '1234567890',
        });
        return Promise.resolve().then(() => {
            const anchor = element.shadowRoot.querySelector('a');
            anchor.click = jest.fn();
            element.click();
            expect(anchor.click).toHaveBeenCalled();
        });
    });

    it('hides the icon when hideIcon is set', () => {
        const element = createFormattedEmail({
            value: '1234567890',
            hideIcon: true,
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
