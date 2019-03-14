import { createElement } from 'lwc';
import Element from 'lightning/primitiveSelect';
import { shadowQuerySelector } from 'lightning/testUtils';

const options = [
    {
        label: 'États-Unis',
        value: 'United States',
    },
    {
        label: 'Canada',
        value: 'Canada',
    },
    {
        label: 'Royaume-Uni',
        value: 'United Kingdom',
    },
];

const getOption = (element, value) => {
    return shadowQuerySelector(element, `option[value='${value}']`);
};

const createPrimitiveSelect = (params = {}) => {
    const element = createElement('lightning-primitve-select', { is: Element });

    element.label = 'Select Label';
    element.name = 'Select';
    element.options = options;

    Object.assign(element, params);

    document.body.appendChild(element);
    return element;
};

describe('single select', () => {
    it('renders with correct options', () => {
        const element = createPrimitiveSelect({
            value: 'Canada',
            required: true,
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('has correct value', () => {
        const element = createPrimitiveSelect({
            value: 'United States',
        });

        const select = shadowQuerySelector(element, 'select');
        const value = select.options[select.selectedIndex].value;

        expect(value).toEqual('United States');
    });

    it('updates with the correct value', () => {
        const element = createPrimitiveSelect({
            value: 'United States',
        });

        const select = shadowQuerySelector(element, 'select');
        select.value = 'Canada';
        select.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
            })
        );

        expect(element.value).toEqual('Canada');
    });

    it('shows error when required and no option selected', () => {
        const element = createPrimitiveSelect({
            required: true,
        });

        element.focus();
        element.blur();

        return Promise.resolve().then(() => {
            const errorDiv = shadowQuerySelector(
                element,
                '.slds-form-element__help'
            );
            expect(errorDiv.textContent).toEqual('Complete this field.');
        });
    });

    it('shows error when element has custom validity', () => {
        const errorMessage = 'Custom Error';
        const element = createPrimitiveSelect();

        element.setCustomValidity(errorMessage);
        element.showHelpMessageIfInvalid();

        return Promise.resolve().then(() => {
            const errorDiv = shadowQuerySelector(
                element,
                '.slds-form-element__help'
            );
            expect(errorDiv.textContent).toEqual(errorMessage);
        });
    });
});

describe('multi select', () => {
    it('renders with correct options', () => {
        const element = createPrimitiveSelect({
            multiple: true,
            value: ['Canada'],
            required: true,
            size: 5,
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('has correct value', () => {
        const element = createPrimitiveSelect({
            multiple: true,
            value: ['United States', 'Canada'],
        });

        expect(getOption(element, 'United States').selected).toBeTruthy();
        expect(getOption(element, 'Canada').selected).toBeTruthy();
        expect(getOption(element, 'United Kingdom').selected).toBeFalsy();
    });

    it('updates with the correct value', () => {
        const element = createPrimitiveSelect({
            multiple: true,
            value: ['United States'],
        });

        getOption(element, 'United States').selected = false;
        getOption(element, 'Canada').selected = true;
        getOption(element, 'United Kingdom').selected = true;

        shadowQuerySelector(element, 'select').dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
            })
        );

        expect(element.value).toEqual(['Canada', 'United Kingdom']);
    });

    it('shows error when required and no option selected', () => {
        const element = createPrimitiveSelect({
            multiple: true,
            required: true,
        });

        element.focus();
        element.blur();

        return Promise.resolve().then(() => {
            const errorDiv = shadowQuerySelector(
                element,
                '.slds-form-element__help'
            );
            expect(errorDiv.textContent).toEqual('Complete this field.');
        });
    });

    it('shows error when element has custom validity', () => {
        const errorMessage = 'Custom Error';
        const element = createPrimitiveSelect({
            multiple: true,
        });

        element.setCustomValidity(errorMessage);
        element.showHelpMessageIfInvalid();

        return Promise.resolve().then(() => {
            const errorDiv = shadowQuerySelector(
                element,
                '.slds-form-element__help'
            );
            expect(errorDiv.textContent).toEqual(errorMessage);
        });
    });

    it('shows custom error message when element has no option selectd', () => {
        const customErrorMessage = 'Custom value missing error';
        const element = createPrimitiveSelect({
            required: true,
            messageWhenValueMissing: customErrorMessage,
        });
        element.showHelpMessageIfInvalid();
        return Promise.resolve().then(() => {
            const errorDiv = shadowQuerySelector(
                element,
                '.slds-form-element__help'
            );
            expect(errorDiv.textContent).toEqual(customErrorMessage);
        });
    });

    it('sets access key when passed in', () => {
        const element = createPrimitiveSelect({
            accessKey: 's',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('sets tabindex value when passed in', () => {
        const element = createPrimitiveSelect({
            tabindex: '1',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
