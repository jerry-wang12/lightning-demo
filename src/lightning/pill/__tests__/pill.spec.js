import { createElement } from 'lwc';
import Element from 'lightning/pill';

const createComponent = () => {
    const element = createElement('lightning-pill', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-pill', () => {
    it('should have a label when label prop is provided', () => {
        const element = createComponent();
        element.label = `Pill Label`;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should have href when href prop is provided', () => {
        const element = createComponent();
        element.label = `Pill Label`;
        element.href = `/path/to/some/where`;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('has error state', () => {
        const element = createComponent();
        element.label = `Pill Label`;
        element.hasError = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('is plain pill', () => {
        const element = createComponent();
        element.label = `Plain Pill Label`;
        element.variant = 'plain';
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });

    it('delete key should fire remove event', () => {
        const element = createComponent();
        let removed = false;
        element.label = `Plain Pill Label`;
        element.variant = 'plain';
        element.addEventListener('remove', () => {
            removed = true;
        });

        document.body.appendChild(element);

        const deleteKey = new KeyboardEvent('keydown', {
            bubbles: true,
            composed: true,
            keyCode: 46,
        });

        element.dispatchEvent(deleteKey);

        expect(removed).toBe(true);
    });

    it('backspace key should fire remove event', () => {
        const element = createComponent();
        let removed = false;
        element.label = `Plain Pill Label`;
        element.variant = 'plain';
        element.addEventListener('remove', () => {
            removed = true;
        });

        document.body.appendChild(element);

        const backspaceKey = new KeyboardEvent('keydown', {
            bubbles: true,
            composed: true,
            keyCode: 8,
        });

        element.dispatchEvent(backspaceKey);

        expect(removed).toBe(true);
    });
});
