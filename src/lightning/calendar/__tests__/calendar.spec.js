import { createElement } from 'lwc';
import Element from 'lightning/calendar';
import { keyCodes } from 'lightning/utilsPrivate';
import {
    shadowQuerySelector,
    shadowQuerySelectorAll,
} from 'lightning/testUtils';

expect.extend({
    toBeFocused(actual) {
        const pass = actual === document.activeElement;
        return {
            message: () =>
                `expected element to be ${pass ? 'NOT ' : ''}focused`,
            pass,
        };
    },
    toHaveSelectors(actual, expected) {
        const pass = shadowQuerySelectorAll(actual, expected).length >= 1;
        return {
            message: () =>
                `expected element ${
                    pass ? 'NOT ' : ''
                }to contain one or more selectors ${expected}`,
            pass,
        };
    },
});

const defaultProps = {
    type: 'date',
};

const selectedDate = element => {
    const selectedElement = shadowQuerySelector(
        element,
        'tbody [tabindex="0"]'
    );

    // const selectedElement = element
    //     .shadowQuerySelector('tbody')
    //     .shadowQuerySelector('[tabindex="0"]');

    return selectedElement.getAttribute('data-value');
};

const createKeydownEvent = keyCode => {
    return new KeyboardEvent('keydown', { bubbles: true, keyCode });
};

const createComponent = (params = {}) => {
    const element = createElement('lightning-calendar', {
        is: Element,
    });
    Object.assign(element, Object.assign({}, defaultProps, params));
    document.body.appendChild(element);
    return element;
};

const yearOptionsCount = el => {
    const element = shadowQuerySelector(el, '.slds-shrink-none select');

    return element.querySelectorAll('option').length;
};

describe('lightning-calendar', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });
    it('renders with label', () => {
        const labelSelector = '[aria-label="Date picker: August"]';
        const element = createComponent({
            value: '2015-08-12',
        });
        return Promise.resolve().then(() => {
            expect(element).toHaveSelectors(labelSelector);
        });
    });

    it('renders with value', () => {
        const valueMonth = 'September';
        const element = createComponent({
            value: '2017-09-12',
        });

        return Promise.resolve().then(() => {
            expect(element.shadowRoot.textContent).toMatch(valueMonth);
        });
    });

    it('renders min and max for 2 years', () => {
        const element = createComponent({
            min: '2015-09-12',
            max: '2016-12-11',
        });

        return Promise.resolve().then(() => {
            expect(yearOptionsCount(element)).toBe(2);
        });
    });

    it('gets rendered without min and max', () => {
        const element = createComponent();
        return Promise.resolve().then(() => {
            expect(yearOptionsCount(element) > 200).toBe(true);
        });
    });

    describe('supports keyboard navigation:', () => {
        it('enter selects a date', () => {
            const onSelect = jest.fn();
            const element = createComponent({
                value: '2017-09-12',
                onselect: onSelect,
            });
            expect(onSelect).not.toBeCalled();
            const event = new KeyboardEvent('keydown', {
                bubbles: true,
                keyCode: keyCodes.enter,
            });
            return Promise.resolve().then(() => {
                shadowQuerySelector(
                    element,
                    "td[data-value='2017-09-14']"
                ).dispatchEvent(event);
                expect(onSelect).toBeCalled();
            });
        });
        it('right key moves focus right', () => {
            const element = createComponent({
                value: '2017-09-12',
            });
            return Promise.resolve()
                .then(() => {
                    const event = createKeydownEvent(keyCodes.right);

                    shadowQuerySelector(
                        element,
                        "td[data-value='2017-09-14']"
                    ).dispatchEvent(event);
                })
                .then(() => {
                    jest.runAllTimers(); // to run raf
                    expect(selectedDate(element)).toBe('2017-09-15');
                });
        });
        it('left key moves focus left', () => {
            const element = createComponent({
                value: '2017-09-12',
            });
            return Promise.resolve()
                .then(() => {
                    const event = createKeydownEvent(keyCodes.left);

                    shadowQuerySelector(
                        element,
                        "td[data-value='2017-09-14']"
                    ).dispatchEvent(event);
                })
                .then(() => {
                    jest.runAllTimers(); // to run raf
                    expect(selectedDate(element)).toBe('2017-09-13');
                });
        });
        it('down key moves focus down', () => {
            const element = createComponent({
                value: '2017-09-12',
            });
            return Promise.resolve()
                .then(() => {
                    const event = createKeydownEvent(keyCodes.down);

                    shadowQuerySelector(
                        element,
                        "td[data-value='2017-09-14']"
                    ).dispatchEvent(event);
                })
                .then(() => {
                    jest.runAllTimers(); // to run raf
                    expect(selectedDate(element)).toBe('2017-09-21');
                });
        });
        it('up key moves focus up', () => {
            const element = createComponent({
                value: '2017-09-12',
            });
            return Promise.resolve()
                .then(() => {
                    const event = createKeydownEvent(keyCodes.up);

                    shadowQuerySelector(
                        element,
                        "td[data-value='2017-09-14']"
                    ).dispatchEvent(event);
                })
                .then(() => {
                    jest.runAllTimers(); // to run raf
                    expect(selectedDate(element)).toBe('2017-09-07');
                });
        });
    });
});
