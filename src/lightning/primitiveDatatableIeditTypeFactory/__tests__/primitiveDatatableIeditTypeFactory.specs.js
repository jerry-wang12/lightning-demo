import Element from 'lightning/primitiveDatatableIeditTypeFactory';
import { createElement } from 'lwc';
import { querySelector } from 'lightning/testUtils';

const createIeditTypeFactory = props => {
    const button = createElement(
        'lightning-primitive-datatable-iedit-type-factory',
        {
            is: Element,
        }
    );
    Object.assign(button, props);
    document.body.appendChild(button);
    return button;
};

const getElementInInput = (panel, qs) => {
    return querySelector(panel, 'lightning-input').shadowRoot.querySelector(qs);
};

describe('lightning-primitive-datatable-iedit-type-factory', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('lightning-primitive-datatable-iedit-text-type', () => {
        const creationProps = {
            editedValue: 'some-text-value',
            columnDef: {
                type: 'text',
                label: 'text-column-label',
            },
        };

        it('should render the editedValue', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                expect(getElementInInput(element, 'input').value).toBe(
                    'some-text-value'
                );
            });
        });

        it('should render the column label', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const label = getElementInInput(element, 'label');

                // eslint-disable-next-line lwc/no-inner-html
                expect(label.innerHTML).toBe('text-column-label');
            });
        });

        it('should render text-type when the type is text', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const textElement = getElementInInput(
                    element,
                    '[name="dt-inline-edit-text"]'
                );

                expect(textElement).not.toBeNull();
            });
        });

        it('should add the inputable data attribute', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const textElement = querySelector(
                    element,
                    '[data-inputable="true"]'
                );

                expect(textElement).not.toBeNull();
            });
        });

        it('should focus the input when focus', () => {
            const element = createIeditTypeFactory(creationProps);
            element.focus();

            return Promise.resolve().then(() => {
                const textElement = getElementInInput(element, 'input');
                expect(
                    document.activeElement.shadowRoot.activeElement.shadowRoot // panel // lightning-input
                        .activeElement
                ).toBe(textElement);
            });
        });
    });

    describe('lightning-primitive-datatable-iedit-phone-type', () => {
        const creationProps = {
            editedValue: 'some-phone-value',
            columnDef: {
                type: 'phone',
                label: 'phone-column-label',
            },
        };

        it('should render the editedValue', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                expect(getElementInInput(element, 'input').value).toBe(
                    'some-phone-value'
                );
            });
        });

        it('should render the column label', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const label = getElementInInput(element, 'label');

                // eslint-disable-next-line lwc/no-inner-html
                expect(label.innerHTML).toBe('phone-column-label');
            });
        });

        it('should render phone-type when the type is text', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const phoneElement = getElementInInput(
                    element,
                    '[name="dt-inline-edit-phone"]'
                );

                expect(phoneElement).not.toBeNull();
            });
        });

        it('should add the inputable data attribute', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const phoneElement = querySelector(
                    element,
                    '[data-inputable="true"]'
                );

                expect(phoneElement).not.toBeNull();
            });
        });

        it('should focus the phone when focus', () => {
            const element = createIeditTypeFactory(creationProps);
            element.focus();

            return Promise.resolve().then(() => {
                const phone = getElementInInput(element, 'input');
                expect(
                    document.activeElement.shadowRoot.activeElement.shadowRoot // panel // lightning-input
                        .activeElement
                ).toBe(phone);
            });
        });
        describe('when type="boolean"', () => {
            it('should render an lightning-input type "checkbox"', () => {
                const element = createIeditTypeFactory({
                    editedValue: true,
                    columnDef: {
                        type: 'boolean',
                        label: 'Closed',
                    },
                });
                const input = element.shadowRoot.querySelector(
                    'lightning-input'
                );
                expect(input).not.toBeNull();
                expect(input.type).toBe('checkbox');
            });
            it('should pass the label of the column to the lightning-input', () => {
                const element = createIeditTypeFactory({
                    editedValue: true,
                    columnDef: {
                        type: 'boolean',
                        label: 'Closed',
                    },
                });
                const input = element.shadowRoot.querySelector(
                    'lightning-input'
                );
                expect(input.label).toBe('Closed');
            });
            it('should return true in the get value when the editedValue is true', () => {
                const element = createIeditTypeFactory({
                    editedValue: true,
                    columnDef: {
                        type: 'boolean',
                        label: 'Closed',
                    },
                });
                expect(element.value).toBe(true);
            });
            it('should return false in the get value when the editedValue is false', () => {
                const element = createIeditTypeFactory({
                    editedValue: false,
                    columnDef: {
                        type: 'boolean',
                        label: 'Closed',
                    },
                });
                expect(element.value).toBe(false);
            });
        });
    });

    describe('lightning-primitive-datatable-iedit-dateLocal-type', () => {
        const creationProps = {
            editedValue: '2018-02-07',
            columnDef: {
                type: 'date-local',
                label: 'date-local-column-label',
            },
        };

        it('should render the editedValue', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                expect(getElementInInput(element, 'input').value).toBe(
                    '2018-02-07'
                );
            });
        });

        it('should render the column label', () => {
            const element = createIeditTypeFactory(creationProps);

            return Promise.resolve().then(() => {
                const label = getElementInInput(element, 'label');

                // eslint-disable-next-line lwc/no-inner-html
                expect(label.innerHTML).toBe('date-local-column-label');
            });
        });
    });
});
