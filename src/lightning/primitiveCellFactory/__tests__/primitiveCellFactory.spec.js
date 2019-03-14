import { createElement } from 'lwc';
import Element from 'lightning/primitiveCellFactory';
import { shadowQuerySelector } from 'lightning/testUtils';

const createCellFactory = attrs => {
    const element = createElement('lightning-primitive-cell-factory', {
        is: Element,
    });
    Object.assign(element, attrs);
    document.body.appendChild(element);
    return element;
};

const typesMock = {
    getType: () => ({
        type: 'standard',
        typeAttributes: [],
    }),
};

describe('lightning-primitive-cell-factory', () => {
    describe('cell alignment', () => {
        it('alignment should be spread by default', () => {
            const element = createCellFactory({
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const wrapper = shadowQuerySelector(
                    element,
                    'lightning-primitive-cell-wrapper'
                );
                expect(
                    wrapper.classList.contains('slds-grid_align-spread')
                ).toBe(true);
            });
        });
        it('alignment should be spread if left', () => {
            const element = createCellFactory({
                alignment: 'left',
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const wrapper = shadowQuerySelector(
                    element,
                    'lightning-primitive-cell-wrapper'
                );
                expect(
                    wrapper.classList.contains('slds-grid_align-spread')
                ).toBe(true);
            });
        });
        it('alignment should be to the center if center', () => {
            const element = createCellFactory({
                alignment: 'center',
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const wrapper = shadowQuerySelector(
                    element,
                    'lightning-primitive-cell-wrapper'
                );
                expect(
                    wrapper.classList.contains('slds-grid_align-center')
                ).toBe(true);
            });
        });
        it('alignment should be to the end if right', () => {
            const element = createCellFactory({
                alignment: 'right',
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const wrapper = shadowQuerySelector(
                    element,
                    'lightning-primitive-cell-wrapper'
                );
                expect(wrapper.classList.contains('slds-grid_align-end')).toBe(
                    true
                );
            });
        });
        ['number', 'currency', 'percent'].forEach(type => {
            it(`alignment should be to the end (right) as default if columnType=${type}`, () => {
                const element = createCellFactory({
                    columnType: type,
                    columnLabel: 'Confidence',
                    rowKeyValue: '123',
                    colKeyValue: 'abc',
                    editable: true,
                    types: typesMock,
                });

                return Promise.resolve().then(() => {
                    const wrapper = shadowQuerySelector(
                        element,
                        'lightning-primitive-cell-wrapper'
                    );
                    expect(
                        wrapper.classList.contains('slds-grid_align-end')
                    ).toBe(true);
                });
            });

            it(`columnType=${type} should allow to override the alignment`, () => {
                const element = createCellFactory({
                    alignment: 'left',
                    columnType: type,
                    columnLabel: 'Confidence',
                    rowKeyValue: '123',
                    colKeyValue: 'abc',
                    editable: true,
                    types: typesMock,
                });

                return Promise.resolve().then(() => {
                    const wrapper = shadowQuerySelector(
                        element,
                        'lightning-primitive-cell-wrapper'
                    );
                    expect(
                        wrapper.classList.contains('slds-grid_align-spread')
                    ).toBe(true);
                });
            });
        });
    });
    describe('cell-wrapper', () => {
        it('should fire "editcell" event when customer click the button', () => {
            const element = createCellFactory({
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });
            const handler = jest.fn();
            const wrapper = shadowQuerySelector(
                element,
                'lightning-primitive-cell-wrapper'
            );
            const event = new CustomEvent('edit');

            element.addEventListener('privateeditcell', handler);
            wrapper.dispatchEvent(event);

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail).toEqual({
                rowKeyValue: '123',
                colKeyValue: 'abc',
            });
        });
        it('should pass is-action true into the wrapper when columnType="action"', () => {
            const element = createCellFactory({
                columnType: 'action',
                types: typesMock,
            });
            const wrapper = shadowQuerySelector(
                element,
                'lightning-primitive-cell-wrapper'
            );
            expect(wrapper.isAction).toBe(true);
        });
        it('should have center alignment when column type is action', () => {
            const element = createCellFactory({
                columnType: 'action',
                types: typesMock,
            });
            const wrapper = shadowQuerySelector(
                element,
                'lightning-primitive-cell-wrapper'
            );
            expect(
                wrapper.classList.contains('slds-align_absolute-center')
            ).toBe(true);
        });
        it('should pass is-action true into the wrapper when columnType !== "action"', () => {
            const element = createCellFactory({
                columnType: 'text',
                types: typesMock,
            });
            const wrapper = shadowQuerySelector(
                element,
                'lightning-primitive-cell-wrapper'
            );
            expect(wrapper.isAction).toBe(false);
        });
    });
    describe('entering in action mode', () => {
        it('should perform default action when only one actionable element of type button is present and entering action mode with space', () => {
            const element = createCellFactory({
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const callback = jest.fn();
                element.addEventListener('privateeditcell', callback);

                element.setMode('ACTION', { action: 'space' });
                expect(callback.mock.calls).toHaveLength(1);
            });
        });
        it('should perform default action when only one actionable element of type button is present and entering action mode with enter', () => {
            const element = createCellFactory({
                columnType: 'text',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const callback = jest.fn();
                element.addEventListener('privateeditcell', callback);

                element.setMode('ACTION', { action: 'enter' });
                expect(callback.mock.calls).toHaveLength(1);
            });
        });
        it('should NOT perform default action when has multiple actionable element of type button is present and entering action mode with space', () => {
            const element = createCellFactory({
                columnType: 'phone',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const callback = jest.fn();
                element.addEventListener('privateeditcell', callback);

                element.setMode('ACTION', { action: 'space' });
                expect(callback.mock.calls).toHaveLength(0);
            });
        });
        it('should NOT perform default action when has multiple actionable element of type button is present and entering action mode with enter', () => {
            const element = createCellFactory({
                columnType: 'phone',
                columnLabel: 'Confidence',
                rowKeyValue: '123',
                colKeyValue: 'abc',
                editable: true,
                types: typesMock,
            });

            return Promise.resolve().then(() => {
                const callback = jest.fn();
                element.addEventListener('privateeditcell', callback);

                element.setMode('ACTION', { action: 'enter' });
                expect(callback.mock.calls).toHaveLength(0);
            });
        });
    });
});
