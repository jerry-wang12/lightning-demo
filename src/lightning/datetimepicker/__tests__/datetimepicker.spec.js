import { createElement } from 'lwc';
import Element from 'lightning/datetimepicker';
import { getInputElements, querySelector } from 'lightning/testUtils';
let mockIdCounter = 0;
jest.mock('../../inputUtils/idGenerator.js', () => ({
    generateUniqueId: () => {
        mockIdCounter += 1;
        return 'datetimepicker-mock-id-' + mockIdCounter;
    },
}));

beforeEach(() => {
    mockIdCounter = 0;
});

const createDateTimepicker = (params = {}) => {
    const element = createElement('lightning-datetimepicker', { is: Element });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

describe('lightning-datetimepicker', () => {
    it('default', () => {
        const element = createDateTimepicker();
        expect(element).toMatchSnapshot();
    });

    it('renders help text', () => {
        const element = createDateTimepicker({ fieldLevelHelp: 'Hello hello' });
        expect(element).toMatchSnapshot();
    });

    it('renders variant=label-hidden', () => {
        const element = createDateTimepicker({
            fieldLevelHelp: 'Hello hello',
            variant: 'label-hidden',
        });
        expect(querySelector(element, '.slds-assistive-text')).not.toBeNull();
    });

    describe('passes aria attributes to input', () => {
        ['date', 'time'].forEach(type => {
            describe(type, () => {
                const inputSelector = `lightning-${type}picker`;
                [
                    {
                        attrName: `${type}AriaControls`,
                        inputAttrName: 'aria-controls',
                        value: 'ids separated by space',
                    },
                    {
                        attrName: `${type}AriaLabel`,
                        inputAttrName: 'aria-label',
                        value: 'aria label',
                    },
                    {
                        attrName: `${type}AriaLabelledBy`,
                        inputAttrName: 'aria-labelledby',
                        value: 'ids separated by space',
                    },
                    {
                        attrName: `${type}AriaDescribedBy`,
                        inputAttrName: 'aria-describedby',
                        value: 'ids separated by space',
                    },
                ].forEach(({ attrName, inputAttrName, value }) => {
                    // SKIPPED REASON: a11y broken for this component temporarily
                    // eslint-disable-next-line jest/no-disabled-tests
                    it.skip(inputAttrName, () => {
                        const element = createDateTimepicker({
                            [attrName]: value,
                        });
                        return Promise.resolve().then(() => {
                            const input = getInputElements(
                                querySelector(element, inputSelector)
                            )[0];
                            expect(input.getAttribute(inputAttrName)).toEqual(
                                expect.stringContaining(value)
                            );
                        });
                    });
                });
            });
        });
    });
});
