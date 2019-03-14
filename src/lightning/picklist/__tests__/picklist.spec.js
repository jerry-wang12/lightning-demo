import { createElement } from 'lwc';
import {
    shadowQuerySelectorAll,
    shadowQuerySelector,
} from 'lightning/testUtils';
import Element from 'lightning/picklist';

const picklistOptions = [
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

const picklistSingleOption = [
    {
        label: 'États-Unis',
        value: 'United States',
    },
];

let mockIdCounter = 0;
jest.mock('../../inputUtils/idGenerator.js', () => ({
    generateUniqueId: () => {
        mockIdCounter += 1;
        return 'picklist-mock-id-' + mockIdCounter;
    },
}));

beforeEach(() => {
    mockIdCounter = 0;
});

const createPicklist = (params = {}) => {
    const element = createElement('lightning-picklist', { is: Element });

    element.label = 'Picklist Label';
    element.name = 'Picklist';

    Object.assign(element, params);

    document.body.appendChild(element);
    return element;
};

const getSubComponent = picklistElement => {
    return shadowQuerySelector(
        picklistElement,
        'lightning-combobox,lightning-dual-listbox,lightning-primitive-select'
    );
};

const FORM_FACTOR = {
    DESKTOP: true,
    MOBILE: false,
};

const switchFormFactor = formFactor => {
    window.testDesktop = formFactor;
};

describe('on desktop', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        switchFormFactor(FORM_FACTOR.DESKTOP);
    });

    afterAll(() => {
        // default is set to mobile, resetting to avoid any unintentional failures
        switchFormFactor(FORM_FACTOR.MOBILE);
    });

    describe('single-select picklist', () => {
        const createSingleSelectPicklist = (params = {}) => {
            const picklistParams = {
                multiple: false,
                placeholder: 'Please choose an option',
                required: true,
                value: 'United States',
                options: picklistOptions,
            };
            Object.assign(picklistParams, params);

            return createPicklist(picklistParams);
        };

        const openCombobox = picklist => {
            const lightningCombobox = shadowQuerySelector(
                picklist,
                'lightning-combobox'
            );
            const lightningBaseCombobox = shadowQuerySelector(
                lightningCombobox,
                'lightning-base-combobox'
            );

            shadowQuerySelectorAll(lightningBaseCombobox, 'input')[0].click();
        };

        const selectOption = (picklist, optionText) => {
            const lightningCombobox = shadowQuerySelector(
                picklist,
                'lightning-combobox'
            );
            const lightningBaseCombobox = shadowQuerySelector(
                lightningCombobox,
                'lightning-base-combobox'
            );

            shadowQuerySelectorAll(
                lightningBaseCombobox,
                `*[data-value='${optionText}']`
            )[0].click();
        };

        it('renders combobox with correct options', () => {
            const element = createSingleSelectPicklist();
            openCombobox(element);

            return Promise.resolve().then(() => {
                jest.runAllTimers(); // to run raf
                expect(element).toMatchSnapshot();
            });
        });

        it('renders without -none- option when required and has only one option', () => {
            const element = createSingleSelectPicklist({
                options: picklistSingleOption,
            });
            openCombobox(element);

            return Promise.resolve().then(() => {
                jest.runAllTimers(); // to run raf
                expect(element).toMatchSnapshot();
            });
        });

        it('has correct attributes when required and has more than one option', () => {
            const element = createSingleSelectPicklist();

            expect(element).toHaveAttributes({
                value: 'United States',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when required, has more than one option, and value is empty', () => {
            const value = '';
            const element = createSingleSelectPicklist({ value });

            expect(element).toHaveAttributes({
                value,
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when not required and has more than one option', () => {
            const required = false;
            const element = createSingleSelectPicklist({ required });

            expect(element).toHaveAttributes({
                value: 'United States',
                required,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when not required, has more than one option, and value is empty', () => {
            const [required, value] = [false, ''];
            const element = createSingleSelectPicklist({
                required,
                value,
            });

            expect(element).toHaveAttributes({
                value,
                required,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when not required, has one option', () => {
            const [options, required] = [picklistSingleOption, false];
            const element = createSingleSelectPicklist({
                options,
                required,
            });

            expect(element).toHaveAttributes({
                value: 'United States',
                required,
                disabled: false,
            });

            expect(element.options).toContainOptions(['', 'United States']);
        });

        it('has correct attributes when required, has one option', () => {
            const options = picklistSingleOption;
            const element = createSingleSelectPicklist({ options });

            expect(element).toHaveAttributes({
                value: 'United States',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions(['United States']);
        });

        it('has correct options when initial value is not in the options', () => {
            const options = picklistSingleOption;
            const element = createSingleSelectPicklist({
                value: 'Italy',
                options,
            });

            expect(element).toHaveAttributes({
                value: 'Italy',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'Italy',
                'United States',
            ]);
        });

        it('is disabled when there are no options', () => {
            const options = [];
            const element = createSingleSelectPicklist({
                value: '',
                options,
            });

            expect(element.options).toContainOptions(['']);

            expect(getSubComponent(element).disabled).toBeTruthy();
        });

        it('is not required when there are no options', () => {
            const options = [];
            const element = createSingleSelectPicklist({
                value: '',
                options,
            });

            expect(getSubComponent(element).required).toBeFalsy();

            element.options = picklistOptions;

            return Promise.resolve().then(() => {
                expect(getSubComponent(element).required).toBeTruthy();
            });
        });

        it('is not disabled when there are no options but disabled is set to false', () => {
            const element = createSingleSelectPicklist({
                options: [],
                disabled: false,
            });

            expect(getSubComponent(element).disabled).toBeFalsy();
        });

        it('fires "open" event when combobox is opened', () => {
            const openHandler = jest.fn();
            const element = createSingleSelectPicklist();

            element.addEventListener('open', openHandler);

            openCombobox(element);

            return Promise.resolve().then(() => {
                expect(openHandler).toBeCalled();
            });
        });

        it('is invalid when required and no option selected', () => {
            const element = createSingleSelectPicklist({
                value: '',
            });

            expect(element.checkValidity()).toBeFalsy();
        });

        it('is invalid when element has custom validity ', () => {
            const element = createSingleSelectPicklist();
            element.setCustomValidity('Custom error');

            expect(element.checkValidity()).toBeFalsy();
        });

        it('has correct value when selecting a new option', () => {
            const element = createSingleSelectPicklist({
                required: false,
            });
            openCombobox(element);

            return Promise.resolve()
                .then(() => {
                    selectOption(element, 'Canada');
                    expect(element.value).toBe('Canada');
                })
                .then(() => {
                    selectOption(element, 'United Kingdom');
                    expect(element.value).toBe('United Kingdom');
                })
                .then(() => {
                    selectOption(element, '');
                    expect(element.value).toBe('');
                });
        });
    });

    describe('multi-select picklist', () => {
        const createMultiSelectPicklist = (params = {}) => {
            const picklistParams = {
                multiple: true,
                required: true,
                value: 'United States',
                options: picklistOptions,
            };
            Object.assign(picklistParams, params);

            return createPicklist(picklistParams);
        };

        const selectOption = (picklist, optionValue) => {
            const lightningDualCombobox = shadowQuerySelector(
                picklist,
                'lightning-dual-listbox'
            );
            const lightningButtonIcon = shadowQuerySelector(
                lightningDualCombobox,
                'lightning-button-icon'
            );

            shadowQuerySelectorAll(
                lightningDualCombobox,
                `div[data-value='${optionValue}']`
            )[0].click();
            shadowQuerySelectorAll(
                lightningButtonIcon,
                'button[title="Move selection to Chosen"]'
            )[0].click();
        };

        const deselectOption = (picklist, optionValue) => {
            const lightningDualCombobox = shadowQuerySelector(
                picklist,
                'lightning-dual-listbox'
            );
            const lightningButtonIcon = shadowQuerySelectorAll(
                lightningDualCombobox,
                'lightning-button-icon'
            )[1];

            shadowQuerySelectorAll(
                lightningDualCombobox,
                `div[data-value='${optionValue}']`
            )[0].click();
            shadowQuerySelectorAll(
                lightningButtonIcon,
                'button[title="Move selection to Available"]'
            )[0].click();
        };

        it('renders dual-listbox with correct options', () => {
            const element = createMultiSelectPicklist({
                value: 'United States;Canada',
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('has correct attributes when there is a single value', () => {
            const element = createMultiSelectPicklist();

            expect(element).toHaveAttributes({
                value: 'United States',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                'United States',
                'Canada',
                'United Kingdom',
            ]);

            expect(getSubComponent(element).value).toEqual(['United States']);
        });

        it('has correct attributes when there are multiple values', () => {
            const element = createMultiSelectPicklist({
                value: 'United States;Canada;United Kingdom',
            });

            expect(element).toHaveAttributes({
                value: 'United States;Canada;United Kingdom',
                required: true,
                disabled: false,
            });
            expect(element.options).toContainOptions([
                'United States',
                'Canada',
                'United Kingdom',
            ]);

            expect(getSubComponent(element).disabled).toBeFalsy();
            expect(getSubComponent(element).value).toEqual([
                'Canada',
                'United Kingdom',
                'United States',
            ]);
        });

        it('has correct options when initial value is not in the options', () => {
            const element = createMultiSelectPicklist({
                value: 'United States;Canada;Italy',
            });

            expect(element).toHaveAttributes({
                value: 'United States;Canada;Italy',
                required: true,
                disabled: false,
            });
            expect(element.options).toContainOptions([
                'Italy',
                'United States',
                'Canada',
                'United Kingdom',
            ]);

            expect(getSubComponent(element).value).toEqual([
                'Canada',
                'Italy',
                'United States',
            ]);
        });

        it('is disabled when there are no options', () => {
            const element = createMultiSelectPicklist({
                options: [],
            });

            expect(getSubComponent(element).disabled).toBeTruthy();
        });

        it('is not required when there are no options', () => {
            const element = createMultiSelectPicklist({
                value: '',
                options: [],
            });

            expect(getSubComponent(element).required).toBeFalsy();

            element.options = picklistOptions;

            return Promise.resolve().then(() => {
                expect(getSubComponent(element).required).toBeTruthy();
            });
        });

        it('is not disabled when there are no options but disabled is set to false', () => {
            const element = createMultiSelectPicklist({
                options: [],
                disabled: false,
            });

            expect(getSubComponent(element).disabled).toBeFalsy();
        });

        it('has correct size when value is in range (between 3 and 10)', () => {
            const element = createMultiSelectPicklist({
                size: 6,
            });

            expect(getSubComponent(element).size).toEqual(6);
        });

        it('defaults to 4 when size is not in range (between 3 and 10)', () => {
            const element = createMultiSelectPicklist({
                size: 0,
            });

            expect(getSubComponent(element).size).toEqual(4);
        });

        it('is invalid when required and no option selected', () => {
            const element = createMultiSelectPicklist({
                value: '',
            });

            expect(element.checkValidity()).toBeFalsy();
        });

        it('is invalid when element has custom validity ', () => {
            const element = createMultiSelectPicklist();
            element.setCustomValidity('Custom error');

            expect(element.checkValidity()).toBeFalsy();
        });

        it('has correct value when selecting a new option', () => {
            const options = [
                ...picklistOptions,
                {
                    label: 'Cote d&#39Ivoire',
                    value: 'Cote d&#39Ivoire',
                },
            ];
            const element = createMultiSelectPicklist({
                options,
                required: false,
            });

            return Promise.resolve()
                .then(() => {
                    selectOption(element, 'Canada');
                    expect(element.value).toBe('United States;Canada');
                })
                .then(() => {
                    selectOption(element, 'Cote d&#39Ivoire');
                    expect(element.value).toBe(
                        'United States;Canada;Cote d&#39Ivoire'
                    );
                })
                .then(() => {
                    deselectOption(element, 'United States');
                    expect(element.value).toBe('Canada;Cote d&#39Ivoire');
                });
        });
    });
});

describe('on mobile/tablet', () => {
    beforeAll(() => {
        switchFormFactor(FORM_FACTOR.MOBILE);
    });

    describe('single-select picklist', () => {
        const createSingleSelectPicklist = (params = {}) => {
            const picklistParams = {
                required: true,
                value: 'United States',
                options: picklistOptions,
            };
            Object.assign(picklistParams, params);

            return createPicklist(picklistParams);
        };

        it('renders primitive-select with correct options', () => {
            const element = createSingleSelectPicklist();

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('renders without -none- option when required and has only one option', () => {
            const element = createSingleSelectPicklist({
                options: picklistSingleOption,
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('has correct attributes when required and has more than one option', () => {
            const element = createSingleSelectPicklist();

            expect(element).toHaveAttributes({
                value: 'United States',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when required, has more than one option, and value is empty', () => {
            const value = '';
            const element = createSingleSelectPicklist({ value });

            expect(element).toHaveAttributes({
                value,
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when not required and has more than one option', () => {
            const required = false;
            const element = createSingleSelectPicklist({ required });

            expect(element).toHaveAttributes({
                value: 'United States',
                required,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when not required, has more than one option, and value is empty', () => {
            const [required, value] = [false, ''];
            const element = createSingleSelectPicklist({
                required,
                value,
            });

            expect(element).toHaveAttributes({
                value,
                required,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'United States',
                'Canada',
                'United Kingdom',
            ]);
        });

        it('has correct attributes when not required, has one option', () => {
            const [options, required] = [picklistSingleOption, false];
            const element = createSingleSelectPicklist({
                options,
                required,
            });

            expect(element).toHaveAttributes({
                value: 'United States',
                required,
                disabled: false,
            });

            expect(element.options).toContainOptions(['', 'United States']);
        });

        it('has correct attributes when required, has one option', () => {
            const options = picklistSingleOption;
            const element = createSingleSelectPicklist({ options });

            expect(element).toHaveAttributes({
                value: 'United States',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions(['United States']);
        });

        it('has correct options when initial value is not in the options', () => {
            const options = picklistSingleOption;
            const element = createSingleSelectPicklist({
                value: 'Italy',
                options,
            });

            expect(element).toHaveAttributes({
                value: 'Italy',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                '',
                'Italy',
                'United States',
            ]);
        });

        it('is disabled when there are no options', () => {
            const options = [];
            const element = createSingleSelectPicklist({
                value: '',
                options,
            });

            expect(element.options).toContainOptions(['']);

            expect(getSubComponent(element).disabled).toBeTruthy();
        });

        it('is not required when there are no options', () => {
            const element = createSingleSelectPicklist({
                value: '',
                options: [],
            });

            expect(getSubComponent(element).required).toBeFalsy();

            element.options = picklistOptions;

            return Promise.resolve().then(() => {
                expect(getSubComponent(element).required).toBeTruthy();
            });
        });

        it('is not disabled when there are no options but disabled is set to false', () => {
            const element = createSingleSelectPicklist({
                options: [],
                disabled: false,
            });

            expect(getSubComponent(element).disabled).toBeFalsy();
        });

        it('is invalid when required and no option selected', () => {
            const element = createSingleSelectPicklist({
                value: '',
            });

            expect(element.checkValidity()).toBeFalsy();
        });

        it('is invalid when element has custom validity ', () => {
            const element = createSingleSelectPicklist();
            element.setCustomValidity('Custom error');

            expect(element.checkValidity()).toBeFalsy();
        });
    });

    describe('multi-select picklist', () => {
        const createMultiSelectPicklist = (params = {}) => {
            const picklistParams = {
                multiple: true,
                required: true,
                value: 'United States',
                options: picklistOptions,
            };
            Object.assign(picklistParams, params);

            return createPicklist(picklistParams);
        };

        it('renders primitive-select with correct options', () => {
            const element = createMultiSelectPicklist({
                value: 'United States;Canada',
            });

            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('has correct attributes when there is a single value', () => {
            const element = createMultiSelectPicklist();

            expect(element).toHaveAttributes({
                value: 'United States',
                required: true,
                disabled: false,
            });

            expect(element.options).toContainOptions([
                'United States',
                'Canada',
                'United Kingdom',
            ]);

            expect(getSubComponent(element).value).toEqual(['United States']);
        });

        it('has correct attributes when there are multiple values', () => {
            const element = createMultiSelectPicklist({
                value: 'United States;Canada;United Kingdom',
            });

            expect(element).toHaveAttributes({
                value: 'United States;Canada;United Kingdom',
                required: true,
                disabled: false,
            });
            expect(element.options).toContainOptions([
                'United States',
                'Canada',
                'United Kingdom',
            ]);

            expect(getSubComponent(element).disabled).toBeFalsy();
            expect(getSubComponent(element).value).toEqual([
                'Canada',
                'United Kingdom',
                'United States',
            ]);
        });

        it('has correct options when initial value is not in the options', () => {
            const element = createMultiSelectPicklist({
                value: 'United States;Canada;Italy',
            });

            expect(element).toHaveAttributes({
                value: 'United States;Canada;Italy',
                required: true,
                disabled: false,
            });
            expect(element.options).toContainOptions([
                'Italy',
                'United States',
                'Canada',
                'United Kingdom',
            ]);

            expect(getSubComponent(element).value).toEqual([
                'Canada',
                'Italy',
                'United States',
            ]);
        });

        it('is disabled when there are no options', () => {
            const element = createMultiSelectPicklist({
                options: [],
            });

            expect(getSubComponent(element).disabled).toBeTruthy();
        });

        it('is not required when there are no options', () => {
            const element = createMultiSelectPicklist({
                value: '',
                options: [],
            });

            expect(getSubComponent(element).required).toBeFalsy();

            element.options = picklistOptions;

            return Promise.resolve().then(() => {
                expect(getSubComponent(element).required).toBeTruthy();
            });
        });

        it('has correct size when value is in range (between 3 and 10)', () => {
            const element = createMultiSelectPicklist({
                size: 6,
            });

            expect(getSubComponent(element).size).toEqual(6);
        });

        it('defaults to 4 when size is not in range (between 3 and 10)', () => {
            const element = createMultiSelectPicklist({
                size: 0,
            });

            expect(getSubComponent(element).size).toEqual(4);
        });

        it('is invalid when required and no option selected', () => {
            const element = createMultiSelectPicklist({
                value: '',
            });

            expect(element.checkValidity()).toBeFalsy();
        });

        it('is invalid when element has custom validity ', () => {
            const element = createMultiSelectPicklist();
            element.setCustomValidity('Custom error');

            expect(element.checkValidity()).toBeFalsy();
        });
    });
});

expect.extend({
    toContainOptions(actual, expected) {
        const valueExists = valueToCheck =>
            [...actual].some(actualValue => {
                return actualValue.value === valueToCheck;
            });
        const lengthCheck = actual.length === expected.length;
        const pass =
            lengthCheck &&
            [...expected].every(expectedValue => {
                return valueExists(expectedValue);
            });

        return {
            message: () =>
                `expected the picklist to contain options: ${JSON.stringify(
                    expected
                )}
                actual options: ${JSON.stringify(actual)}`,
            pass,
        };
    },
    toHaveAttributes(element, expectedAttributes) {
        const actualAttributes = {
            value: element.value,
            required: element.required,
            disabled: getSubComponent(element).disabled,
        };
        return {
            message: () =>
                `expected the picklist to contain attributes: ${JSON.stringify(
                    expectedAttributes
                )} but
                instead found: ${JSON.stringify(actualAttributes)}`,
            pass: this.equals(expectedAttributes, actualAttributes),
        };
    },
});
