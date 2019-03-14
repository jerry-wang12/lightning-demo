import { createElement } from 'lwc';
import { querySelector, querySelectorAll } from 'lightning/testUtils';
import Element from 'lightning/groupedCombobox';
import exampleData from '../__mockData__/exampleGroupedComboboxData';

let mockIdCounter = 0;
jest.mock('../../inputUtils/idGenerator.js', () => ({
    generateUniqueId: () => {
        mockIdCounter += 1;
        return 'input-mock-id-' + mockIdCounter;
    },
}));

beforeEach(() => {
    mockIdCounter = 0;
});

expect.extend({
    toBeFocused(actual) {
        const pass = actual === document.activeElement;
        return {
            message: () =>
                `expected element to be ${pass ? 'NOT ' : ''}focused`,
            pass,
        };
    },
    toContainText(actual, expected) {
        const pass = actual.textContent.includes(expected);
        return {
            message: () =>
                `expected element's text \n\n "${actual.textContent}" \n\n to ${
                    pass ? 'NOT ' : ''
                }contain text ${expected}`,
            pass,
        };
    },
    toHaveSelectors(actual, expected) {
        const pass = querySelectorAll(actual, expected).length >= 1;
        return {
            message: () =>
                `expected element ${
                    pass ? 'NOT ' : ''
                }to contain one or more selectors ${expected}`,
            pass,
        };
    },
});

const createComponent = (params = {}) => {
    const element = createElement('lightning-grouped-combobox', {
        is: Element,
    });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

function baseElement(element) {
    return querySelector(element, 'lightning-base-combobox');
}

function getInput(element) {
    return querySelector(baseElement(element), 'input');
}

function getButton(element) {
    return querySelector(baseElement(element), 'button');
}

describe('lightning-grouped-combobox', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    describe('renders properly', () => {
        it('with items', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });
            expect(element).toMatchSnapshot();
        });

        it('can be disabled', () => {
            const element = createComponent({
                label: 'List Box Example',
                disabled: true,
            });
            expect(element).toMatchSnapshot();
        });

        it('with dropdown open', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });
            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve().then(() => {
                jest.runAllTimers(); // to run raf
                expect(element).toMatchSnapshot();
            });
        });

        it('with maxlength', () => {
            const element = createComponent({
                label: 'List Box Example',
                inputMaxlength: '50',
            });
            expect(element).toMatchSnapshot();
            expect(baseElement(element)).toHaveSelectors(
                'input[maxlength="50"]'
            );
            expect(baseElement(element)).not.toHaveSelectors(
                'input[maxlength="51"]'
            );
        });

        it('with field level help', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                fieldLevelHelp: 'help help',
            });
            expect(element).toMatchSnapshot();
        });

        it("with spinnerActive, but only if it's set", () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                spinnerActive: true,
            });
            expect(element).toMatchSnapshot();
            element.spinnerActive = false;
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('with empty items', () => {
        it("won't open dropdown", () => {
            const element = createComponent({
                label: 'List Box Example',
                items: [],
            });
            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });

        it('will close dropdown when items become empty', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });
            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve()
                .then(() => {
                    expect(
                        querySelector(baseElement(element), '.slds-is-open')
                    ).not.toBe(null);
                    element.items = [];
                })
                .then(() => {
                    expect(
                        querySelector(baseElement(element), '.slds-is-open')
                    ).toBe(null);
                });
        });
    });

    describe('with a pill', () => {
        it('should render a pill when a pill is set', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                inputPill: {
                    iconName: 'standard:account',
                    iconAlternativeText: 'Account',
                    label: 'Some Choice',
                },
            });
            expect(element).toMatchSnapshot();
        });

        it('should render a value for a pill', () => {
            const pillLabel = 'The Pill';
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                inputPill: {
                    iconName: 'standard:account',
                    label: pillLabel,
                },
            });
            expect(getInput(element).value).toBe(pillLabel);
        });

        it('triggers pill remove event when a user removes a pill', () => {
            const onPillRemoveFunc = jest.fn();
            const element = createComponent({
                label: 'List Box Example',
                inputPill: {
                    iconName: 'standard:account',
                    label: 'Some Choice',
                },
            });
            element.addEventListener('pillremove', onPillRemoveFunc);
            expect(onPillRemoveFunc).not.toBeCalled();
            const button = getButton(element);
            button.click();
            return Promise.resolve().then(() => {
                expect(onPillRemoveFunc).toBeCalled();
            });
        });

        it('triggers pillremove when delete button on keyboard is pressed', () => {
            const onPillRemoveFunc = jest.fn();
            const element = createComponent({
                label: 'List Box Example',
                inputPill: {
                    iconName: 'standard:account',
                    label: 'Some Choice',
                },
            });

            element.addEventListener('pillremove', onPillRemoveFunc);
            expect(onPillRemoveFunc).not.toBeCalled();
            const event = new KeyboardEvent('keydown', { keyCode: 46 });
            const input = getInput(element);
            input.dispatchEvent(event);
            return Promise.resolve().then(() => {
                expect(onPillRemoveFunc).toBeCalled();
            });
        });

        it('renders a class name for the pill`s icon', () => {
            const element = createComponent({
                label: 'List Box Example',
                inputPill: {
                    label: 'Some Choice - icon presents',
                    iconName: 'standard:account',
                    iconAlternativeText: 'Account',
                },
            });
            return Promise.resolve()
                .then(() => {
                    expect(baseElement(element)).toHaveSelectors(
                        '.slds-input-has-icon_left-right'
                    );
                    expect(baseElement(element)).not.toHaveSelectors(
                        '.slds-input-has-icon_right'
                    );
                })
                .then(() => {
                    element.inputPill = {
                        label: 'Some Choice - but no icon this time',
                    };
                })
                .then(() => {
                    expect(baseElement(element)).not.toHaveSelectors(
                        '.slds-input-has-icon_left-right'
                    );
                    expect(baseElement(element)).toHaveSelectors(
                        '.slds-input-has-icon_right'
                    );
                });
        });
    });

    describe('is accessible', () => {
        it('renders alternative text for icon', () => {
            const element = createComponent({
                label: 'List Box Example',
                inputIconAlternativeText: 'Alternative Icon Text',
                items: exampleData.exampleItems,
                fieldLevelHelp: 'help help',
            });
            expect(element).toMatchSnapshot();
        });
    });

    describe('shows errors', () => {
        it('shows custom errors', () => {
            const element = createComponent({
                label: 'List Box Example',
            });
            element.setCustomValidity('Unknown error');
            element.showHelpMessageIfInvalid();
            return Promise.resolve().then(() => {
                expect(element.shadowRoot).toContainText('Unknown error');
                expect(element).toMatchSnapshot();
            });
        });

        it('shows required error when value missing', () => {
            const element = createComponent({
                label: 'List Box Example',
                required: true,
            });
            element.showHelpMessageIfInvalid();
            return Promise.resolve().then(() => {
                const helpText = querySelector(
                    element,
                    '.slds-form-element__help'
                );
                expect(helpText).toContainText('required');
            });
        });
    });

    describe('with items', () => {
        it('when groups are passed amd dropdown is open', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleGroups,
            });
            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve().then(() => {
                jest.runAllTimers(); // to run raf
                // Snapshot match intended
                expect(element).toMatchSnapshot();
            });
        });
    });

    describe('highlights properly', () => {
        it('highlights an option', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });
            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve().then(() => {
                jest.runAllTimers(); // to run raf
                const items = [
                    ...querySelectorAll(
                        baseElement(element),
                        'lightning-base-combobox-item[role="option"]'
                    ),
                ];
                const selectedItem = querySelector(
                    baseElement(element),
                    '.slds-has-focus'
                );
                expect(items.indexOf(selectedItem)).toBe(0);
            });
        });

        it('highlights an option, defined in items', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleDataWithHighlightedCard,
            });

            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve().then(() => {
                jest.runAllTimers(); // to run raf
                const items = [
                    ...querySelectorAll(
                        baseElement(element),
                        'lightning-base-combobox-item[role="option"]'
                    ),
                ];
                const selectedItem = querySelector(
                    baseElement(element),
                    '.slds-has-focus'
                );
                expect(items.indexOf(selectedItem)).toBe(
                    exampleData.exampleDataWithHighlightedCard.findIndex(
                        e => e.highlight
                    )
                );
            });
        });
    });

    describe('triggers events', () => {
        it('triggers select event when an option is selected', () => {
            const onSelectFunc = jest.fn();
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                onselect: onSelectFunc,
            });
            const input = getInput(element);
            input.click();
            return Promise.resolve().then(() => {
                querySelector(
                    baseElement(element),
                    'lightning-base-combobox-item'
                ).click();
                expect(onSelectFunc).toBeCalled();
            });
        });

        it('opens dropdown on click', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });
            const input = getInput(element);
            input.click();
            return Promise.resolve().then(() => {
                expect(baseElement(element)).toHaveSelectors('.slds-is-open');
            });
        });

        it('triggers closing dropdown with escape key', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });
            const event = new KeyboardEvent('keydown', {
                bubbles: true,
                composed: true,
                keyCode: 65,
            });
            const escapeKeyPressed = new KeyboardEvent('keydown', {
                bubbles: true,
                composed: true,
                keyCode: 27,
            });
            const input = getInput(element);
            input.dispatchEvent(event);
            return Promise.resolve()
                .then(() => {
                    jest.runAllTimers(); // to run raf
                    expect(element).toMatchSnapshot();
                    input.dispatchEvent(escapeKeyPressed);
                })
                .then(() => {
                    expect(element).toMatchSnapshot();
                    expect(baseElement(element)).not.toHaveSelectors(
                        '.slds-combobox__input-entity-icon'
                    );
                });
        });

        it("doesn't trigger onselect event when input text is selected Ctrl+a", () => {
            const onInputTextSelect = jest.fn();
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                inputText: 'Hello',
                onselect: onInputTextSelect,
            });
            expect(onInputTextSelect).not.toBeCalled();
            const input = getInput(element);
            input.select();

            return Promise.resolve().then(() => {
                expect(onInputTextSelect).not.toBeCalled();
            });
        });

        it('triggers scroll when user scrolled', () => {
            const onScroll = jest.fn();
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleDataManyRecords,
                inputText: 'Hello',
            });
            element.addEventListener('endreached', onScroll);
            const input = getInput(element);
            input.value = 'Glo';
            input.click();
            return Promise.resolve()
                .then(() => {
                    expect(onScroll).not.toBeCalled();
                    const listbox = querySelector(
                        baseElement(element),
                        '[role="listbox"]'
                    );
                    listbox.scrollTop = 50000;
                    listbox.dispatchEvent(
                        // eslint-disable-next-line lightning-global/no-custom-event-bubbling
                        new CustomEvent('scroll', {
                            composed: true,
                            bubbles: true,
                        })
                    );
                })
                .then(() => {
                    expect(onScroll).toBeCalled();
                });
        });

        it('triggers ontextchange event when the text input value changed', () => {
            const onTextChangeFunc = jest.fn();
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
            });

            element.addEventListener('textchange', onTextChangeFunc);

            const input = getInput(element);
            input.dispatchEvent(new Event('change'));

            return Promise.resolve().then(() => {
                expect(onTextChangeFunc).toBeCalled();
            });
        });
    });

    describe("properly handles 'value'", () => {
        it('binds value to inputText value', () => {
            const element = createComponent({
                label: 'List Box Example',
                items: exampleData.exampleItems,
                inputText: 'test value',
            });
            const input = getInput(element);
            expect(element.inputText).toBe(input.value);
        });
    });
});
