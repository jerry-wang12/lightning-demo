import { createElement } from 'lwc';
import Element from 'lightning/primitiveCoordinateItem';
import { shadowQuerySelector } from 'lightning/testUtils';

function createPrimitiveCoordinateItem() {
    const element = createElement('lightning-primitive-coordinate-item', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
}

describe('lightning-primitive-coordinate-item', () => {
    it('default', () => {
        const element = createPrimitiveCoordinateItem();

        element.iconName = 'standard:location';
        element.itemTitle = 'SalesForce HQ';
        element.itemAddress = '50 fremont st, san francisco, ca 94105';

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('event fired when clicked', () => {
        const element = createPrimitiveCoordinateItem();
        const callback = jest.fn();
        element.addEventListener('coordinateclick', callback);
        const title = 'SalesForce HQ';

        element.iconName = 'standard:location';
        element.itemTitle = title;
        element.itemAddress = '50 fremont st, san francisco, ca 94105';
        const button = shadowQuerySelector(element, 'button');
        button.click();

        return Promise.resolve().then(() => {
            expect(callback).toBeCalled();
        });
    });

    it('sets ariaPressed values when selected set to true', () => {
        const element = createPrimitiveCoordinateItem();
        const title = 'SalesForce HQ';
        const assistiveText = `${title} is currently selected`;

        element.iconName = 'standard:location';
        element.itemTitle = title;
        element.itemAddress = '50 fremont st, san francisco, ca 94105';
        const button = shadowQuerySelector(element, 'button');
        const assistiveTextElement = shadowQuerySelector(
            element,
            '.slds-assistive-text'
        );
        element.selected = true;

        return Promise.resolve().then(() => {
            expect(button.getAttribute('aria-pressed')).toBe('true');
            expect(assistiveTextElement.textContent).toBe(assistiveText);
        });
    });

    it('sets the ariaPressed to false when selected set to false', () => {
        const element = createPrimitiveCoordinateItem();
        const title = 'SalesForce HQ';

        element.iconName = 'standard:location';
        element.itemTitle = title;
        element.itemAddress = '50 fremont st, san francisco, ca 94105';

        const button = shadowQuerySelector(element, 'button');
        const assistiveTextElement = shadowQuerySelector(
            element,
            '.slds-assistive-text'
        );
        element.selected = false;

        return Promise.resolve().then(() => {
            expect(button.getAttribute('aria-pressed')).toBe('false');
            expect(assistiveTextElement.textContent).toBe('');
        });
    });
});
