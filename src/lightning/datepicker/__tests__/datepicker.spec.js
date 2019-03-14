import { createElement } from 'lwc';
import Element from 'lightning/datepicker';
import {
    shadowQuerySelector,
    shadowQuerySelectorAll,
    getInputElements,
} from 'lightning/testUtils';

let mockIdCounter = 0;
jest.mock('../../inputUtils/idGenerator.js', () => ({
    generateUniqueId: () => {
        mockIdCounter += 1;
        return 'datepicker-mock-id-' + mockIdCounter;
    },
}));

beforeEach(() => {
    mockIdCounter = 0;
});

expect.extend({
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

const createDatepicker = (params = {}) => {
    const element = createElement('lightning-datepicker', { is: Element });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

const openCalendar = element => {
    const inputElement = shadowQuerySelector(element, 'input');
    inputElement.focus();
    inputElement.click();
};

describe('lightning-datepicker', () => {
    it('default', () => {
        const element = createDatepicker();
        expect(element).toMatchSnapshot();
    });

    it('renders help text', () => {
        const element = createDatepicker({ fieldLevelHelp: 'Hello hello' });
        expect(element).toMatchSnapshot();
    });

    it('renders variant=label-hidden', () => {
        const element = createDatepicker({
            fieldLevelHelp: 'Hello hello',
            variant: 'label-hidden',
        });
        expect(
            shadowQuerySelector(element, '.slds-assistive-text')
        ).not.toBeNull();
    });

    describe('passes aria attributes to input', () => {
        [
            {
                cmpAriaName: 'ariaControlsElement',
                inputAriaName: 'aria-controls',
            },
            {
                cmpAriaName: 'ariaLabel',
                inputAriaName: 'aria-label',
            },
            {
                cmpAriaName: 'ariaLabelledByElement',
                inputAriaName: 'aria-labelledby',
            },
            {
                cmpAriaName: 'ariaDescribedByElements',
                inputAriaName: 'aria-describedby',
            },
        ].forEach(({ cmpAriaName, inputAriaName }) => {
            it(inputAriaName, () => {
                const ariaValue = 'list of stuff';
                let ariaElement;
                let element;
                if (inputAriaName !== 'aria-label') {
                    ariaElement = document.createElement('div');
                    ariaElement.id = ariaValue;
                    element = createDatepicker({
                        [cmpAriaName]: ariaElement,
                    });
                } else {
                    element = createDatepicker({
                        [cmpAriaName]: ariaValue,
                    });
                }
                return Promise.resolve().then(() => {
                    const input = getInputElements(element)[0];
                    expect(input.getAttribute(inputAriaName)).toEqual(
                        expect.stringContaining(ariaValue)
                    );
                });
            });
        });
    });

    it('opens calendar', () => {
        const element = createDatepicker({
            min: '2005-09-12',
            max: '2009-12-11',
        });
        openCalendar(element);
        return Promise.resolve().then(() => {
            expect(element).toHaveSelectors('lightning-calendar');
        });
    });
});
