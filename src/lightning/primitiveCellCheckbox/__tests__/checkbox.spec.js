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

describe('primitive-cell-checkbox when type "checkbox"', () => {
    it('should match slds markup', () => {
        const element = createCellCheckbox({
            dtContextId: 'dt-id',
            rowKeyValue: 0,
            rowIndex: 0,
            type: 'checkbox',
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should have type "checkbox" by default', () => {
        const element = createCellCheckbox();
        const input = shadowQuerySelector(element, 'input');
        expect(input.type).toBe('checkbox');
    });
    it('should fire "selectrow" event when checkbox gets checked', () => {
        const element = createCellCheckbox({
            type: 'checkbox',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);
            const checkbox = shadowQuerySelector(
                element,
                'label.slds-checkbox__label'
            );
            checkbox.click();
            expect(callback.mock.calls).toHaveLength(1);
        });
    });
    it('should fire "deselectrow" event when checkbox gets unchecked', () => {
        const element = createCellCheckbox({
            type: 'checkbox',
            rowKeyValue: 0,
            rowIndex: 0,
            isSelected: true,
        });

        const callback = jest.fn();
        element.addEventListener('deselectrow', callback);

        return Promise.resolve().then(() => {
            const checkbox = shadowQuerySelector(
                element,
                'label.slds-checkbox__label'
            );
            checkbox.click(); // checked
            // checkbox.click(); // unchecked
            expect(callback.mock.calls).toHaveLength(1);
        });
    });
    it('should pass is-disabled prop into the input element', () => {
        const element = createCellCheckbox({
            isDisabled: true,
            type: 'checkbox',
        });
        const input = shadowQuerySelector(element, 'input');
        expect(input.disabled).toBe(true);
    });
    it('should pass is-selected prop into the input element', () => {
        const element = createCellCheckbox({
            isSelected: true,
            type: 'checkbox',
        });
        const input = shadowQuerySelector(element, 'input');
        expect(input.checked).toBe(true);
    });

    it('should select checkbox when click is on the input', () => {
        const element = createCellCheckbox({
            type: 'checkbox',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);
            const checkbox = shadowQuerySelector(element, 'input');
            checkbox.click();
            expect(callback.mock.calls).toHaveLength(1);
        });
    });

    it('should select checkbox (multiple) when pressing shift+space on the input', () => {
        const element = createCellCheckbox({
            type: 'checkbox',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);
            const checkbox = shadowQuerySelector(element, 'input');

            const eventName = 'click';
            const event = new CustomEvent(eventName);
            event.shiftKey = true;
            checkbox.dispatchEvent(event);

            expect(callback.mock.calls).toHaveLength(1);
            expect(callback.mock.calls[0][0].detail.isMultiple).toBe(true);
        });
    });

    it('should trigger checkbox change when entering action mode with space', () => {
        const element = createCellCheckbox({
            type: 'checkbox',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);

            element.setMode('ACTION', { action: 'space' });
            expect(callback.mock.calls).toHaveLength(1);
        });
    });

    it('should NOT trigger checkbox change when entering action mode with enter', () => {
        const element = createCellCheckbox({
            type: 'checkbox',
        });

        return Promise.resolve().then(() => {
            const callback = jest.fn();
            element.addEventListener('selectrow', callback);

            element.setMode('ACTION', { action: 'enter' });
            expect(callback.mock.calls).toHaveLength(0);
        });
    });
});
