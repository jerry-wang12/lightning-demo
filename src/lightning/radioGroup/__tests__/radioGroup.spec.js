import { createElement } from 'lwc';
import Element from 'lightning/radioGroup';
import { shadowQuerySelectorAll } from 'lightning/testUtils';

const createRadioGroup = () => {
    const element = createElement('lighting-radio-group', { is: Element });
    document.body.appendChild(element);
    return element;
};

const options = [
    { label: 'Sales', value: 'option1' },
    { label: 'Force', value: 'option2' },
];
describe('lightning-radio-group', () => {
    it('defaultNoType', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.options = options;
        element.value = '';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('defaultRadioType', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = '';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('defaultButtonType', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'button';
        element.options = options;
        element.value = '';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('one radio selected', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = 'option1';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('one button selected', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'button';
        element.options = options;
        element.value = 'option1';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('required radio', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = 'option1';
        element.required = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('required button', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'button';
        element.options = options;
        element.value = 'option1';
        element.required = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('disabled radio', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = 'option1';
        element.disabled = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('disabled button', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'button';
        element.options = options;
        element.value = 'option1';
        element.disabled = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('required and disabled radio', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = 'option1';
        element.required = true;
        element.disabled = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('required and disabled button', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'button';
        element.options = options;
        element.value = 'option1';
        element.required = true;
        element.disabled = true;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('value change radio', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = 'option1';
        return Promise.resolve()
            .then(() => {
                expect(
                    shadowQuerySelectorAll(element, 'input')[0].checked
                ).toBe(true);
                expect(
                    shadowQuerySelectorAll(element, 'input')[1].checked
                ).toBe(false);
                element.value = 'option2';
            })
            .then(() => {
                expect(
                    shadowQuerySelectorAll(element, 'input')[0].checked
                ).toBe(false);
                expect(
                    shadowQuerySelectorAll(element, 'input')[1].checked
                ).toBe(true);
            });
    });

    it('changes the value when option was clicked', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;
        element.value = 'option1';
        return Promise.resolve()
            .then(() => {
                expect(
                    shadowQuerySelectorAll(element, 'input')[0].checked
                ).toBe(true);
                expect(
                    shadowQuerySelectorAll(element, 'input')[1].checked
                ).toBe(false);
                shadowQuerySelectorAll(element, 'input')[1].click();

                shadowQuerySelectorAll(element, 'input')[1].dispatchEvent(
                    new Event('change')
                );
            })
            .then(() => {
                expect(element.value).toBe('option2');
                expect(
                    shadowQuerySelectorAll(element, 'input')[0].checked
                ).toBe(false);
                expect(
                    shadowQuerySelectorAll(element, 'input')[1].checked
                ).toBe(true);
            });
    });

    it('value change button', () => {
        const element = createRadioGroup();
        element.name = 'testGroup';
        element.label = 'testGroup';
        element.type = 'button';
        element.options = options;
        element.value = 'option1';
        return Promise.resolve()
            .then(() => {
                expect(
                    shadowQuerySelectorAll(element, 'input')[0].checked
                ).toBe(true);
                expect(
                    shadowQuerySelectorAll(element, 'input')[1].checked
                ).toBe(false);
                element.value = 'option2';
            })
            .then(() => {
                expect(
                    shadowQuerySelectorAll(element, 'input')[0].checked
                ).toBe(false);
                expect(
                    shadowQuerySelectorAll(element, 'input')[1].checked
                ).toBe(true);
            });
    });
    it('should generate unique name for all the input when the name prop value was not provided', () => {
        const element = createRadioGroup();
        element.label = 'testGroup';
        element.type = 'radio';
        element.options = options;

        Promise.resolve().then(() => {
            const inputs = shadowQuerySelectorAll(element, 'input');
            expect(inputs[0].name).toBeDefined();
            expect(inputs[0].name).toBe(inputs[1].name);
        });
    });
});
