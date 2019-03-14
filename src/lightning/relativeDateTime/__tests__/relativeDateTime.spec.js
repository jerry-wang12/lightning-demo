import { createElement } from 'lwc';
import Element from 'lightning/relativeDateTime';
// eslint-disable-next-line lwc/no-aura-libs
import { relativeFormat } from 'lightning:IntlLibrary';

const createRelativeDateTime = value => {
    const element = createElement('lightning-relative-date-time', {
        is: Element,
    });
    element.value = value;
    document.body.appendChild(element);
    return element;
};

beforeEach(() => {
    const format = relativeFormat().format;
    const validDate = Date.now();

    jest.useFakeTimers();

    while (format(validDate) !== 'hours') {} // eslint-disable-line no-empty
    format.mockClear();
});

describe('lightning-relative-date-time', () => {
    it('should throw when invalid value provided', () => {
        const elem = createRelativeDateTime();
        expect(() => {
            elem.value = 'not valid value';
        }).toThrow();
    });

    it('should change formattedValue with time', () => {
        jest.clearAllTimers();
        const elem = createRelativeDateTime(Date.now());
        const assertFormattedValueChanged = () => {
            expect(elem).toMatchSnapshot();
            jest.runOnlyPendingTimers();

            return Promise.resolve();
        };

        return Promise.resolve()
            .then(assertFormattedValueChanged)
            .then(assertFormattedValueChanged)
            .then(assertFormattedValueChanged);
    });
});
