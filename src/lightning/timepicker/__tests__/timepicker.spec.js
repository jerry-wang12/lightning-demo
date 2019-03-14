import { createElement } from 'lwc';
import Element from 'lightning/timepicker';
import { getTimeToHighlight } from './../utils';
import { getInputElements, shadowQuerySelector } from 'lightning/testUtils';

let mockIdCounter = 0;
jest.mock('../../inputUtils/idGenerator.js', () => ({
    generateUniqueId: () => {
        mockIdCounter += 1;
        return 'timepicker-mock-id-' + mockIdCounter;
    },
}));

beforeEach(() => {
    mockIdCounter = 0;
});

const createTimepicker = (params = {}) => {
    const element = createElement('lightning-timepicker', { is: Element });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

describe('lightning-timepicker', () => {
    it('default', () => {
        const element = createTimepicker();
        expect(element).toMatchSnapshot();
    });

    it('renders help text', () => {
        const element = createTimepicker({ fieldLevelHelp: 'Hello hello' });
        expect(element).toMatchSnapshot();
    });

    it('highlights the correct time', () => {
        const highlightTime = getTimeToHighlight('18:15', 15);
        expect(highlightTime).toBe('18:15:00.000');
    });

    it('highlights the closest time if value is not in list', () => {
        const highlightTime = getTimeToHighlight('18:12', 15);
        expect(highlightTime).toBe('18:15:00.000');
    });

    it('renders variant=label-hidden', () => {
        const element = createTimepicker({
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
                    element = createTimepicker({
                        [cmpAriaName]: ariaElement,
                    });
                } else {
                    element = createTimepicker({
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
});
