import { createElement } from 'lwc';
import Element from 'lightning/primitiveResizeHandler';
import { shadowQuerySelector } from 'lightning/testUtils';

const createResizeHandler = () => {
    const element = createElement('lightning-primitive-resize-handler', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

describe('lightning-primitive-resize-handler', () => {
    it('should render the basic markup correctly', () => {
        const element = createResizeHandler();

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('should render the label and range correctly', () => {
        const element = createResizeHandler();
        element.label = 'test column label';
        element.minWidth = 100;
        element.maxWidth = 500;
        element.colIndex = 0;

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('should render input range correctly', () => {
        const element = createResizeHandler();
        element.label = 'test column label';
        element.minWidth = 100;
        element.maxWidth = 500;
        element.colIndex = 0;

        return Promise.resolve().then(() => {
            const inputRange = shadowQuerySelector(
                element,
                'input[type="range"]'
            );

            expect(inputRange).not.toBeNull();
            expect(inputRange.min).toBe('100');
            expect(inputRange.max).toBe('500');
            expect(inputRange.tabIndex).toBe(0);
        });
    });
});
