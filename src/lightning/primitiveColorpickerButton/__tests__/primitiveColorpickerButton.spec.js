import { createElement } from 'lwc';
import Element from 'lightning/primitiveColorpickerButton';
import { shadowQuerySelector } from 'lightning/testUtils';

function createComponent() {
    const element = createElement('lightning-primitive-colorpicker-button', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
}

describe('lightning-primitive-colorpicker-button', () => {
    it('renders', () => {
        const element = createComponent();

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('opens colorpicker', () => {
        const element = createComponent();
        shadowQuerySelector(element, 'button').click();

        return Promise.resolve().then(() => {
            expect(
                shadowQuerySelector(element, 'lightning-color-picker-panel')
            ).not.toBe(null);
        });
    });

    it('focuses', () => {
        const element = createComponent();
        element.focus();

        return Promise.resolve().then(() => {
            expect(shadowQuerySelector(element, 'button')).toBe(
                element.shadowRoot.activeElement
            );
        });
    });

    it('blurs', () => {
        const element = createComponent();
        element.focus();
        element.blur();

        return Promise.resolve().then(() => {
            expect(shadowQuerySelector(element, 'button')).not.toBe(
                document.activeElement
            );
        });
    });
});
