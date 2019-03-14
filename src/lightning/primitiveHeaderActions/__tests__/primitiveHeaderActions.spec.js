import { createElement } from 'lwc';
import { querySelector } from 'lightning/testUtils';
import Element from 'lightning/primitiveHeaderActions';

const createResizeHandler = () => {
    const element = createElement('lightning-primitive-header-actions', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

describe('lightning-primitive-header-actions', () => {
    // TODO: Do we need this? It's causing the unit test run to hang.
    //    afterEach(() => {
    //        while (document.body.firstChild) {
    //            document.body.removeChild(document.body.firstChild);
    //        }
    //    });

    it('should render the basic markup correctly', () => {
        const element = createResizeHandler();

        element.actions = {
            menuAlignment: 'left',
            internalActions: [],
            customerActions: [{ label: 'customer' }],
        };

        return Promise.resolve()
            .then(() => {
                expect(element).toMatchSnapshot();
            })
            .then(() => {
                const buttonMenu = element.shadowRoot.querySelector(
                    'lightning-button-menu'
                );
                const button = buttonMenu.shadowRoot.querySelector('button');
                button.click();
            })
            .then(() => {
                expect(element).toMatchSnapshot();
            });
    });

    it('should render a separator when it has internal and customer actions', () => {
        const element = createResizeHandler();

        element.actions = {
            menuAlignment: 'left',
            internalActions: [{ label: 'internal' }],
            customerActions: [{ label: 'customer' }],
        };

        return Promise.resolve().then(() => {
            const buttonMenu = querySelector(element, 'lightning-button-menu');

            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                const qs = 'lightning-menu-divider[role="separator"]';
                const separator = querySelector(element, qs);
                expect(separator).toBeTruthy();
            });
        });
    });

    it('should pass the focus to the button', () => {
        const element = createResizeHandler();

        element.actions = {
            menuAlignment: 'left',
            internalActions: [{ label: 'internal' }],
            customerActions: [{ label: 'customer' }],
        };

        return Promise.resolve().then(() => {
            element.focus();

            return Promise.resolve().then(() => {
                const buttonMenu = querySelector(
                    element,
                    'lightning-button-menu'
                );
                const button = querySelector(buttonMenu, 'button');
                expect(button).toBe(buttonMenu.shadowRoot.activeElement);
            });
        });
    });

    it('should trigger cellheaderactiontriggered event', () => {
        const element = createResizeHandler();

        element.actions = {
            menuAlignment: 'left',
            internalActions: [{ label: 'internal', name: 'nameInternal' }],
            customerActions: [{ label: 'customer', name: 'nameCustomer' }],
        };
        element.colKeyValue = 'col-key-value';

        const evtListenerMock = jest.fn();
        element.addEventListener(
            'privatecellheaderactiontriggered',
            evtListenerMock
        );

        return Promise.resolve().then(() => {
            const buttonMenu = querySelector(element, 'lightning-button-menu');

            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                const items = buttonMenu.querySelectorAll(
                    'lightning-menu-item'
                );

                querySelector(items[0], 'a').click();

                return Promise.resolve().then(() => {
                    expect(evtListenerMock.mock.calls).toHaveLength(1);
                    const details = evtListenerMock.mock.calls[0][0].detail;

                    expect(details.action.name).toBe('nameInternal');
                    expect(details.actionType).toBe('internal');
                    expect(details.colKeyValue).toBe('col-key-value');
                });
            });
        });
    });
});
