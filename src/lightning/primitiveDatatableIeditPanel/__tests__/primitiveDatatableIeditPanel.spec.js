import Element from 'lightning/primitiveDatatableIeditPanel';
import { createElement } from 'lwc';
import { querySelector, querySelectorAll } from 'lightning/testUtils';

const createIeditPanel = props => {
    const button = createElement('primitive-datatable-iedit-panel', {
        is: Element,
    });
    Object.assign(button, props);
    document.body.appendChild(button);
    return button;
};

describe('lightning-primitive-editable-button', () => {
    function assertTriggersTabPressed(elementThatGetFocus, dir) {
        const element = createIeditPanel({
            visible: true,
            rowKeyValue: '123',
            colKeyValue: 'abc',
            anchorElement: { top: 32, left: 5 },
            columnDef: { type: 'text', label: 'abc label' },
        });

        const handler = jest.fn();
        element.addEventListener('ieditfinished', handler);

        return Promise.resolve().then(() => {
            querySelector(element, elementThatGetFocus).focus();

            expect(handler.mock.calls).toHaveLength(1);
            expect(handler.mock.calls[0][0].detail).toEqual({
                reason: `tab-pressed-${dir}`,
                rowKeyValue: '123',
                colKeyValue: 'abc',
            });
        });
    }

    it('should trigger ieditfinished when form start gets focus', () => {
        return assertTriggersTabPressed('.inline-edit-form-start', 'prev');
    });

    it('should trigger ieditfinished when form ends gets focus', () => {
        return assertTriggersTabPressed('.inline-edit-form-end', 'next');
    });

    it('should trigger ieditfinished when form is submitted', () => {
        const element = createIeditPanel({
            visible: true,
            rowKeyValue: '123',
            colKeyValue: 'abc',
            anchorElement: { top: 32, left: 5 },
            columnDef: { type: 'text', label: 'abc label' },
        });

        const handler = jest.fn();
        element.addEventListener('ieditfinished', handler);

        return Promise.resolve().then(() => {
            const form = querySelector(element, 'form');
            form.dispatchEvent(new CustomEvent('submit'));

            expect(handler).toBeCalled();
            expect(handler.mock.calls[0][0].detail).toEqual({
                reason: 'submit-action',
                rowKeyValue: '123',
                colKeyValue: 'abc',
            });
        });
    });

    it('should not trigger editfinished when form is submitted and not valid', () => {
        const element = createIeditPanel({
            editedValue: 'not-valid',
            visible: true,
            rowKeyValue: '123',
            colKeyValue: 'abc',
            anchorElement: { top: 32, left: 5 },
            columnDef: { type: 'text', label: 'abc label' },
        });

        const handler = jest.fn();
        element.addEventListener('ieditfinished', handler);

        return Promise.resolve().then(() => {
            const form = querySelector(element, 'form');
            form.dispatchEvent(new CustomEvent('submit'));

            expect(handler).not.toBeCalled();
        });
    });

    describe('lightning-primitive-datatable-iedit-panel-type-factory passthrough', () => {
        const creationProps = {
            visible: true,
            rowKeyValue: '123',
            colKeyValue: 'abc',
            anchorElement: { top: 32, left: 5 },
            editedValue: 'some-value',
            columnDef: {
                type: 'text',
                label: 'column-label',
            },
        };

        it('should display the implicit form submit button', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                expect(
                    querySelector(element, 'button[type="submit"]')
                ).not.toBeNull();
            });
        });

        it('should pass the required attribute from column.typeAttributes', () => {
            const props = Object.assign({}, creationProps, {
                columnDef: {
                    type: 'text',
                    label: 'column-label',
                    typeAttributes: { required: true },
                },
            });
            const element = createIeditPanel(props);

            return Promise.resolve().then(() => {
                const factory = querySelector(
                    element,
                    'lightning-primitive-datatable-iedit-type-factory'
                );
                const isRequired = querySelector(factory, '.is-required');
                expect(isRequired).not.toBeNull();
            });
        });

        it('should display the implicit form submit button with all accessibility requirements', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                const implicitFormSubmitButton = querySelector(
                    element,
                    'button[type="submit"]'
                );

                expect(implicitFormSubmitButton).not.toBeNull();
                expect(
                    implicitFormSubmitButton.getAttribute('aria-hidden')
                ).toBe('true');
                expect(implicitFormSubmitButton.getAttribute('tabindex')).toBe(
                    '-1'
                );
                expect(implicitFormSubmitButton.getAttribute('class')).toBe(
                    'slds-hide'
                );
            });
        });

        it('should render type-factory', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                const typeComponent = querySelector(
                    element,
                    'lightning-primitive-datatable-iedit-type-factory'
                );

                expect(typeComponent).toMatchSnapshot();
            });
        });
        it('should add the iedit-type-component class to the factory', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                const typeComponent = querySelector(
                    element,
                    'lightning-primitive-datatable-iedit-type-factory'
                );

                expect(
                    typeComponent.classList.contains('dt-type-edit-factory')
                ).toBe(true);
            });
        });
        it('should delegate to factory return value', () => {
            const element = createIeditPanel(creationProps);
            return Promise.resolve().then(() => {
                expect(element.value).toBe('type-value');
            });
        });
        it('should delegate to factory return validity', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                expect(element.validity.valid).toBe('type-validity');
            });
        });
        it('should delegate to factory the focus', () => {
            const element = createIeditPanel(creationProps);
            element.focus();
            return Promise.resolve().then(() => {
                const typeComponent = querySelector(
                    element,
                    'lightning-primitive-datatable-iedit-type-factory'
                );
                return Promise.resolve().then(() => {
                    expect(
                        querySelector(typeComponent, 'span')
                    ).toMatchSnapshot();
                });
            });
        });
    });

    describe('mass edit', () => {
        const creationProps = {
            visible: true,
            rowKeyValue: '123',
            colKeyValue: 'abc',
            editedValue: 'some-value',
            columnDef: {
                type: 'text',
                label: 'column-label',
            },
            isMassEditEnabled: true,
            numberOfSelectedRows: 3,
        };

        it('should NOT display the implicit form submit button', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                expect(
                    querySelector(element, 'button[type="submit"]')
                ).toBeNull();
            });
        });

        it('should display the mass edit checkbox', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                expect(
                    querySelector(element, '[data-mass-selection="true"]')
                ).not.toBeNull();
            });
        });

        it('should display the popover_footer', () => {
            const element = createIeditPanel(creationProps);

            return Promise.resolve().then(() => {
                expect(
                    querySelector(element, '.slds-popover__footer')
                ).toMatchSnapshot();
            });
        });

        it('should trigger masscheckboxchange when mass edit checkbox change', () => {
            const element = createIeditPanel(creationProps);

            const evtListenerMock = jest.fn();
            element.addEventListener('masscheckboxchange', evtListenerMock);

            return Promise.resolve().then(() => {
                const selected = querySelector(
                    element,
                    '[data-mass-selection="true"]'
                );
                const checkbox = querySelector(selected, 'input');

                checkbox.click();
                expect(evtListenerMock.mock.calls).toHaveLength(1);
                expect(evtListenerMock.mock.calls[0][0].detail.checked).toBe(
                    true
                );

                checkbox.click();
                expect(evtListenerMock.mock.calls).toHaveLength(2);
                expect(evtListenerMock.mock.calls[1][0].detail.checked).toBe(
                    false
                );
            });
        });

        it('should not trigger ieditfinished on form submit when mass edit is enabled', () => {
            const element = createIeditPanel(creationProps);

            const evtListenerMock = jest.fn();
            element.addEventListener('ieditfinished', evtListenerMock);

            return Promise.resolve().then(() => {
                const form = querySelector(element, 'form');
                form.dispatchEvent(new CustomEvent('submit'));

                expect(evtListenerMock.mock.calls).toHaveLength(0);
            });
        });

        it('should trigger ieditfinished when clicking on cancel', () => {
            const element = createIeditPanel(creationProps);

            const evtListenerMock = jest.fn();
            element.addEventListener('ieditfinished', evtListenerMock);

            return Promise.resolve().then(() => {
                const button = querySelectorAll(
                    element,
                    '.slds-popover__footer lightning-button'
                )[0];
                const cancelBtn = querySelector(button, 'button');
                cancelBtn.click();

                expect(evtListenerMock.mock.calls).toHaveLength(1);
                expect(evtListenerMock.mock.calls[0][0].detail.reason).toBe(
                    'edit-canceled'
                );
            });
        });

        it('should trigger ieditfinished when clicking on apply', () => {
            const element = createIeditPanel(creationProps);

            const evtListenerMock = jest.fn();
            element.addEventListener('ieditfinished', evtListenerMock);

            return Promise.resolve().then(() => {
                const button = querySelectorAll(
                    element,
                    '.slds-popover__footer lightning-button'
                )[1];
                const cancelBtn = querySelector(button, 'button');
                cancelBtn.click();

                expect(evtListenerMock.mock.calls).toHaveLength(1);
                expect(evtListenerMock.mock.calls[0][0].detail.reason).toBe(
                    'submit-action'
                );
            });
        });

        it('should trap focus, when reaching the beginning should focus last element', () => {
            const element = createIeditPanel(creationProps);
            const formStart = querySelector(element, '.inline-edit-form-start');
            const secondButton = querySelectorAll(
                element,
                '.slds-popover__footer lightning-button'
            )[1];
            const lastElement = querySelector(secondButton, 'button');

            return Promise.resolve().then(() => {
                formStart.focus();

                expect(
                    document.activeElement.shadowRoot.activeElement.shadowRoot // primitive-dt-iedit-panel shadow // lightning-button shadow
                        .activeElement
                ).toBe(lastElement);
            });
        });
    });
});
