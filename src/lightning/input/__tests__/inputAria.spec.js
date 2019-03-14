import { createElement } from 'lwc';
import Element from 'lightning/input';
import { getInputElements, querySelector } from 'lightning/testUtils';
import * as configProviderMock from 'lightning/configProvider';

const defaultParams = {
    name: 'input',
    label: 'input',
};

const createInput = (params = {}, isMobile) => {
    configProviderMock.getFormFactor = () => {
        return isMobile ? 'MOBILE' : 'DESKTOP';
    };

    const element = createElement('lightning-input', { is: Element });
    Object.assign(element, defaultParams, params);
    document.body.appendChild(element);
    // set up some required attributes
    return element;
};

const ARIA_MAP = [
    {
        cmpAriaName: 'ariaControls',
        inputAriaName: 'aria-controls',
    },
    {
        cmpAriaName: 'ariaLabel',
        inputAriaName: 'aria-label',
    },
    {
        cmpAriaName: 'ariaLabelledBy',
        inputAriaName: 'aria-labelledby',
    },
    {
        cmpAriaName: 'ariaDescribedBy',
        inputAriaName: 'aria-describedby',
    },
];

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function testInputAriaAttributes(type) {
    ARIA_MAP.forEach(({ cmpAriaName, inputAriaName }) => {
        it(inputAriaName, () => {
            const ariaValue = 'list of stuff';
            const element = createInput({
                type,
                [cmpAriaName]: ariaValue,
            });
            return Promise.resolve().then(() => {
                const inputs = getInputElements(element);

                inputs.forEach(input => {
                    expect(input.getAttribute(inputAriaName)).toEqual(
                        expect.stringContaining(ariaValue)
                    );
                });
            });
        });
    });
}

describe('aria-described-by for error message', () => {
    it('points to the message when invalid', () => {
        const element = createInput({
            type: 'text',
            required: true,
        });
        const input = getInputElements(element)[0];
        return Promise.resolve()
            .then(() => {
                input.focus();
            })
            .then(() => {
                input.blur();
            })
            .then(() => {
                // two assertions, but really one test, just want to make sure
                // if this fails its easier to find out where
                const describedby = input.getAttribute('aria-describedby');
                expect(describedby).toBeTruthy();
                const description = element.querySelector(`#${describedby}`);
                expect(description).toBeDefined();
            });
    });

    it('does not have described-by when valid', () => {
        const element = createInput({
            type: 'text',
            required: true,
        });
        const input = getInputElements(element)[0];
        return Promise.resolve()
            .then(() => {
                input.focus();
            })
            .then(() => {
                input.blur();
            })
            .then(() => {
                input.focus();
            })
            .then(() => {
                element.value = 'hello';
                input.blur();
            })
            .then(() => {
                const describedby = input.getAttribute('aria-describedby');
                expect(describedby).toBeNull();
            });
    });
});

describe('lightning-input passes aria attributes to internal input(s)', () => {
    describe('type simple', () => {
        testInputAriaAttributes();
    });

    describe('type=toggle', () => {
        const type = 'toggle';

        testInputAriaAttributes(type);

        it('aria-describedby includes file button label id', () => {
            const element = createInput({
                type,
                ariaDescribedBy: 'user describedby',
            });
            return Promise.resolve().then(() => {
                const input = querySelector(element, 'input');
                const toggleLabel = querySelector(element, 'input + span');
                expect(input.getAttribute('aria-describedby')).toEqual(
                    expect.stringContaining(toggleLabel.getAttribute('id'))
                );
            });
        });
    });

    describe('type=checkbox', () => {
        const type = 'checkbox';

        testInputAriaAttributes(type);
    });

    describe('type=checkbox-button', () => {
        const type = 'checkbox-button';

        testInputAriaAttributes(type);
    });

    describe('type=radio', () => {
        const type = 'radio';

        testInputAriaAttributes(type);
    });

    describe('type=file', () => {
        const type = 'file';

        testInputAriaAttributes(type);

        it('aria-labelledby includes file button label id', () => {
            const element = createInput({
                type,
                ariaLabelledBy: 'user labelledby',
            });
            return Promise.resolve().then(() => {
                const input = querySelector(element, 'input');
                const fileLabel = querySelector(element, 'input + label');
                expect(input.getAttribute('aria-labelledby')).toEqual(
                    expect.stringContaining(fileLabel.getAttribute('id'))
                );
            });
        });
    });

    describe('type=color', () => {
        const type = 'color';

        testInputAriaAttributes(type);
    });

    describe('type=time', () => {
        const type = 'time';

        testInputAriaAttributes(type);
    });

    describe('type=date', () => {
        const type = 'date';

        testInputAriaAttributes(type);
    });
    // skipping these because they work in real usage but not tests
    // some kind of race condition in tests
    // eslint-disable-next-line jest/no-disabled-tests
    describe.skip('type=datetime', () => {
        const type = 'datetime';

        describe('desktop', () => {
            ARIA_MAP.forEach(({ cmpAriaName, inputAriaName }) => {
                it(inputAriaName, () => {
                    const ariaValue = 'default aria';
                    const dateAriaValue = 'date aria';
                    const timeAriaValue = 'time aria';
                    const element = createInput({
                        type,
                        [cmpAriaName]: ariaValue,
                        ['date' + capitalize(cmpAriaName)]: dateAriaValue,
                        ['time' + capitalize(cmpAriaName)]: timeAriaValue,
                    });
                    return Promise.resolve().then(() => {
                        const [dateInput, timeInput] = getInputElements(
                            element
                        );
                        // for type datetime on mobile, all arias are merged
                        expect(
                            dateInput.getAttribute(inputAriaName)
                        ).not.toEqual(expect.stringContaining(ariaValue));
                        expect(dateInput.getAttribute(inputAriaName)).toEqual(
                            expect.stringContaining(dateAriaValue)
                        );

                        expect(
                            timeInput.getAttribute(inputAriaName)
                        ).not.toEqual(expect.stringContaining(ariaValue));
                        expect(timeInput.getAttribute(inputAriaName)).toEqual(
                            expect.stringContaining(timeAriaValue)
                        );
                    });
                });
            });
        });

        describe('mobile', () => {
            ARIA_MAP.forEach(({ cmpAriaName, inputAriaName }) => {
                it(inputAriaName, () => {
                    const ariaValue = 'default aria';
                    const dateAriaValue = 'date aria';
                    const timeAriaValue = 'time aria';
                    const element = createInput(
                        {
                            type,
                            [cmpAriaName]: ariaValue,
                            ['date' + capitalize(cmpAriaName)]: dateAriaValue,
                            ['time' + capitalize(cmpAriaName)]: timeAriaValue,
                        },
                        true
                    );
                    return Promise.resolve().then(() => {
                        const input = querySelector(element, 'input');
                        // for type datetime on mobile, all arias are merged
                        expect(input.getAttribute(inputAriaName)).toEqual(
                            expect.stringContaining(ariaValue)
                        );
                        expect(input.getAttribute(inputAriaName)).toEqual(
                            expect.stringContaining(dateAriaValue)
                        );
                        expect(input.getAttribute(inputAriaName)).toEqual(
                            expect.stringContaining(timeAriaValue)
                        );
                    });
                });
            });
        });
    });
});
