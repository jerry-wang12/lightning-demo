import { createElement } from 'lwc';
import Element from 'lightning/helptext';
import { shadowQuerySelector } from 'lightning/testUtils';

// Note that mocking the whole thing means that we lose the real
// definitions of everything else in the utils, we should re-consider
// unique id generation in the context of jest tests
jest.mock('lightning/utilsPrivate', () => ({
    assert: () => {},
    normalizeString: value => value,
    guid: () => '[unique-string]',
}));

const createHelptext = function(props = {}) {
    const element = createElement('lightning-helptext', { is: Element });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

describe('helptext component', () => {
    it('should render the correct markup with SLDS styles', () => {
        const element = createHelptext({ content: 'Hello World!' });
        expect(element).toMatchSnapshot();
    });

    it('render non-default icon when iconName is provided', () => {
        const element = createHelptext({
            content: 'Lorem ipsum dolor sit amet',
            iconName: 'utility:connected_apps',
        });

        return Promise.resolve().then(() => {
            const primitiveIconEl = shadowQuerySelector(
                element,
                'lightning-primitive-icon'
            );
            const primitiveIcon = shadowQuerySelector(
                primitiveIconEl,
                'svg[data-key="connected_apps"]'
            );
            expect(primitiveIcon).toBeTruthy();
        });
    });

    it('render non-default icon in warning color when iconName and iconVariant are provided', () => {
        const element = createHelptext({
            content: 'Lorem ipsum dolor sit amet',
            iconName: 'utility:connected_apps',
            iconVariant: 'warning',
        });

        return Promise.resolve().then(() => {
            const primitiveIconEl = shadowQuerySelector(
                element,
                'lightning-primitive-icon'
            );
            const primitiveIcon = shadowQuerySelector(
                primitiveIconEl,
                '.slds-icon-text-warning'
            );
            expect(primitiveIcon).toBeTruthy();
        });
    });

    it('render non-default icon in error color when iconName and iconVariant are provided', () => {
        const element = createHelptext({
            content: 'Lorem ipsum dolor sit amet',
            iconName: 'utility:connected_apps',
            iconVariant: 'error',
        });

        return Promise.resolve().then(() => {
            const primitiveIconEl = shadowQuerySelector(
                element,
                'lightning-primitive-icon'
            );
            const primitiveIcon = shadowQuerySelector(
                primitiveIconEl,
                '.slds-icon-text-error'
            );
            expect(primitiveIcon).toBeTruthy();
        });
    });

    it('render non-default icon in warning color when iconVariant is changed from `error` to `warning`', () => {
        const element = createHelptext({
            content: 'Lorem ipsum dolor sit amet',
            iconName: 'utility:connected_apps',
            iconVariant: 'error',
        });

        return Promise.resolve().then(() => {
            element.iconVariant = 'warning';

            return Promise.resolve().then(() => {
                const primitiveIconEl = shadowQuerySelector(
                    element,
                    'lightning-primitive-icon'
                );
                const primitiveIcon = shadowQuerySelector(
                    primitiveIconEl,
                    '.slds-icon-text-warning'
                );
                expect(primitiveIcon).toBeTruthy();
            });
        });
    });
});
