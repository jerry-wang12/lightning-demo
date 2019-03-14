import { createElement } from 'lwc';
import Element from 'lightning/primitiveCellCheckbox';
import { shadowQuerySelector } from 'lightning/testUtils';

const createCellCheckbox = (props = {}) => {
    const element = createElement('lightning-primitive-cell-checkbox', {
        is: Element,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

describe('primitive-cell-checkbox when type "radio"', () => {
    it('should match slds markup', () => {
        const element = createCellCheckbox({
            dtContextId: 'dt-id',
            rowKeyValue: 0,
            rowIndex: 0,
            type: 'radio',
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should fire "selectrow" event when radio gets checked', () => {
        const element = createCellCheckbox({
            type: 'radio',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);
            const radio = shadowQuerySelector(element, 'input[type="radio"]');
            radio.click();
            expect(callback.mock.calls).toHaveLength(1);
        });
    });
    it('should pass is-disabled prop into the input element', () => {
        const element = createCellCheckbox({
            isDisabled: true,
            type: 'radio',
        });
        const input = shadowQuerySelector(element, 'input');
        expect(input.disabled).toBe(true);
    });
    it('should pass is-selected prop into the input element', () => {
        const element = createCellCheckbox({
            isSelected: true,
            type: 'radio',
        });
        const input = shadowQuerySelector(element, 'input');
        expect(input.checked).toBe(true);
    });

    it('should trigger radio change when entering action mode with space', () => {
        const element = createCellCheckbox({
            type: 'radio',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);

            element.setMode('ACTION', { action: 'space' });
            expect(callback.mock.calls).toHaveLength(1);
        });
    });

    it('should NOT trigger radio change when entering action mode with enter', () => {
        const element = createCellCheckbox({
            type: 'radio',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);

            element.setMode('ACTION', { action: 'enter' });
            expect(callback.mock.calls).toHaveLength(0);
        });
    });
});
