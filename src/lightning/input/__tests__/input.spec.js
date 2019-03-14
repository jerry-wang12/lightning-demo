import { createElement } from 'lwc';
import Element from 'lightning/input';
import { shadowQuerySelector } from 'lightning/testUtils';

const defaultParams = {
    name: 'input',
    label: 'input',
};

function generateRandomString(len) {
    let result = '';
    while (result.length < len) {
        result += Math.random().toString();
    }

    return result.slice(0, len);
}
const createInput = (params = {}) => {
    const element = createElement('lightning-input', { is: Element });
    Object.assign(element, defaultParams, params);
    document.body.appendChild(element);
    // set up some required attributes
    return element;
};

const typeTextAndReturnInput = (lightningInput, text) => {
    const input = shadowQuerySelector(lightningInput, 'input');
    input.value = text;
    input.dispatchEvent(
        new CustomEvent('input', {
            composed: true,
            bubbles: true,
        })
    );
    return input;
};

describe('lightning-input', () => {
    describe('type=text', () => {
        it('default', () => {
            const element = createInput();
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                placeholder: 'placeholder',
                pattern: '\\d+',
                required: true,
                readOnly: true,
                disabled: true,
                max: '100',
                min: '0',
                step: '1',
                maxLength: '3',
                minLength: '2',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('sets tabindex on the input', () => {
            const element = createInput({
                tabIndex: '-1',
            });

            return Promise.resolve().then(() => {
                const input = shadowQuerySelector(element, 'input');
                expect(input.getAttribute('tabindex')).toBe('-1');
            });
        });

        it('shows * when required=true with no value', () => {
            const element = createInput({ required: true });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('turns label into assistive text when variant=label-hidden', () => {
            const element = createInput({ variant: 'label-hidden' });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders help text', () => {
            const element = createInput({
                fieldLevelHelp: 'help',
            });

            return Promise.resolve().then(() => {
                expect(
                    shadowQuerySelector(element, 'lightning-helptext')
                ).toMatchSnapshot();
            });
        });

        it('passes sfdc max length text correctly to input', () => {
            const value = generateRandomString(255);
            const element = createInput({
                value,
            });
            return Promise.resolve().then(() => {
                const input = shadowQuerySelector(element, 'input');
                expect(input.value).toBe(value);
            });
        });

        it('handles sfdc max length text input correctly', done => {
            const value = generateRandomString(255);
            const element = createInput();
            return Promise.resolve().then(() => {
                element.addEventListener('change', e => {
                    try {
                        expect(e.detail.value).toBe(value);
                    } catch (err) {
                        done(err);
                    }
                    done();
                });
                typeTextAndReturnInput(element, value);
            });
        });

        it('updates the value when re-set to the same value and changed by user in between', () => {
            const value = 'Reset';
            const typedValue = 'User typed string';
            const element = createInput();
            element.value = value;
            const input = typeTextAndReturnInput(element, typedValue);
            return Promise.resolve().then(() => {
                element.value = value;
                return Promise.resolve().then(() => {
                    expect(input.value).toBe(value);
                });
            });
        });
    });

    describe('type=search', () => {
        const type = 'search';

        it('shows loading icon when isLoading=true', () => {
            const element = createInput({ type, isLoading: true });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('resets input when clear button is clicked', () => {
            const element = createInput({ type });
            const input = typeTextAndReturnInput(
                element,
                'User typed search text'
            );
            return Promise.resolve().then(() => {
                const clearButton = shadowQuerySelector(
                    element,
                    '[data-element-id="searchClear"]'
                );
                clearButton.click();
                return Promise.resolve().then(() => {
                    expect(input.value).toBe('');
                });
            });
        });
    });

    describe('type=toggle', () => {
        const type = 'toggle';

        it('default', () => {
            const element = createInput({ type });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                required: true,
                readOnly: true,
                disabled: true,
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('shows * when required=true with no value', () => {
            const element = createInput({ type, required: true });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('turns label into assistive text when variant=label-hidden', () => {
            const element = createInput({
                type,
                variant: 'label-hidden',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('changes default toggle text', () => {
            const element = createInput({
                type,
                messageToggleActive: 'On',
                messageToggleInactive: 'Off',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('type=checkbox', () => {
        const type = 'checkbox';

        it('default', () => {
            const element = createInput({ type });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                required: true,
                readOnly: true,
                disabled: true,
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('shows * when required=true with no value', () => {
            const element = createInput({ type, required: true });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('turns label into assistive text when variant=label-hidden', () => {
            const element = createInput({
                type,
                variant: 'label-hidden',
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders help text', () => {
            const element = createInput({
                type,
                fieldLevelHelp: 'help',
            });

            return Promise.resolve().then(() => {
                expect(
                    shadowQuerySelector(element, 'lightning-helptext')
                ).toMatchSnapshot();
            });
        });
    });

    describe('type=checkbox-button', () => {
        const type = 'checkbox-button';

        it('default', () => {
            const element = createInput({ type });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                required: true,
                readOnly: true,
                disabled: true,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('turns label into assistive text when variant=label-hidden', () => {
            const element = createInput({
                type,
                variant: 'label-hidden',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('type=radio', () => {
        const type = 'radio';

        it('default', () => {
            const element = createInput({ type });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                required: true,
                readOnly: true,
                disabled: true,
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('turns label into assistive text when variant=label-hidden', () => {
            const element = createInput({
                type,
                variant: 'label-hidden',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('type=file', () => {
        const type = 'file';

        it('default', () => {
            const element = createInput({ type });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                accept: 'image/jpg',
                multiple: true,
                required: true,
                readOnly: true,
                disabled: true,
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('shows * when required=true with no value', () => {
            const element = createInput({ type, required: true });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('type=color', () => {
        const type = 'color';

        it('default', () => {
            const element = createInput({ type });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('variant=label-hidden', () => {
            const element = createInput({
                type,
                variant: 'label-hidden',
            });
            return Promise.resolve().then(() => {
                expect(
                    shadowQuerySelector(element, '.slds-assistive-text')
                ).not.toBeNull();
            });
        });
    });

    describe('type=number', () => {
        const type = 'number';

        it('default', () => {
            const element = createInput({ type, value: '10' });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders help text', () => {
            const element = createInput({
                type,
                value: '10',
                fieldLevelHelp: 'help',
            });
            return Promise.resolve().then(() => {
                expect(
                    shadowQuerySelector(element, 'lightning-helptext')
                ).toMatchSnapshot();
            });
        });

        describe('when formatting numbers', () => {
            it('formats a number with no fractional digits', () => {
                const element = createInput({
                    type,
                    value: '123456789',
                });
                return Promise.resolve().then(() => {
                    const formattedValue = shadowQuerySelector(element, 'input')
                        .value;
                    expect(formattedValue).toBe('123,456,789');
                });
            });
            it('adds fractional digits to a whole number when 0.01 step set', () => {
                const element = createInput({
                    type,
                    value: '123456789',
                    step: 0.01,
                });
                return Promise.resolve().then(() => {
                    const formattedValue = shadowQuerySelector(element, 'input')
                        .value;
                    expect(formattedValue).toBe('123,456,789.00');
                });
            });
            it('formats a number with fractional digits and 0.01 step', () => {
                const element = createInput({
                    type,
                    value: '123456789.00',
                    step: 0.01,
                });
                return Promise.resolve().then(() => {
                    const formattedValue = shadowQuerySelector(element, 'input')
                        .value;
                    expect(formattedValue).toBe('123,456,789.00');
                });
            });
            it('removes fractional part when step not set', () => {
                const element = createInput({
                    type,
                    value: '123456789.00',
                });
                return Promise.resolve().then(() => {
                    const formattedValue = shadowQuerySelector(element, 'input')
                        .value;
                    expect(formattedValue).toBe('123,456,789');
                });
            });
            it('formats a number with fractional digits when formatOptions provided', () => {
                const element = createInput({
                    type,
                    value: '123456789.123123123',
                    step: 'any',
                    formatFractionDigits: 5,
                });

                return Promise.resolve().then(() => {
                    const formattedValue = shadowQuerySelector(element, 'input')
                        .value;
                    expect(formattedValue).toBe('123,456,789.12312');
                });
            });
        });
    });

    describe('type=date', () => {
        const type = 'date';

        it('default', () => {
            const element = createInput({ type, value: '2017-10-15' });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                placeholder: 'placeholder',
                required: true,
                readOnly: true,
                disabled: true,
                max: '2017-10-10',
                min: '2017-10-20',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('shows * when required=true', () => {
            const element = createInput({ type, required: true });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders help text', () => {
            const element = createInput({
                type,
                value: '2017-10-15',
                fieldLevelHelp: 'help',
            });

            return Promise.resolve().then(() => {
                expect(
                    shadowQuerySelector(element, 'lightning-helptext')
                ).toMatchSnapshot();
            });
        });
    });

    describe('type=time', () => {
        const type = 'time';

        it('default', () => {
            const element = createInput({ type, value: '20:18:00Z' });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                placeholder: 'placeholder',
                required: true,
                readOnly: true,
                disabled: true,
                max: '10:18:00Z',
                min: '23:18:00Z',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('shows * when required=true', () => {
            const element = createInput({ type, required: true });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('type=datetime', () => {
        const type = 'datetime';

        it('default', () => {
            const element = createInput({
                type,
                value: '2017-10-15T20:18:00Z',
                timezone: 'America/Chicago',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
        it('correctly passes dom attributes to input element', () => {
            const element = createInput({
                type,
                placeholder: 'placeholder',
                required: true,
                readOnly: true,
                disabled: true,
                max: '2017-10-10T20:18:00Z',
                min: '2017-10-20T20:18:00Z',
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('shows * when required=true', () => {
            const element = createInput({ type, required: true });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders help text', () => {
            const element = createInput({
                type,
                value: '2017-10-15T20:18:00Z',
                timezone: 'America/Chicago',
                fieldLevelHelp: 'help',
            });

            return Promise.resolve().then(() => {
                expect(
                    shadowQuerySelector(element, 'lightning-helptext')
                ).toMatchSnapshot();
            });
        });
    });

    describe('event with no value change', () => {
        it('should not fire change event even though input event is fired', () => {
            const mockChangeHandler = jest.fn();
            const element = createInput({
                placeholder: 'good old placeholder',
                onchange: mockChangeHandler,
            });

            const input = shadowQuerySelector(element, 'input');
            input.dispatchEvent(new Event('input'));

            return Promise.resolve().then(() => {
                expect(mockChangeHandler).not.toBeCalled();
            });
        });
    });
});
