import { createElement } from 'lwc';
import Element from 'lightning/primitiveCellActions';
import { querySelector } from 'lightning/testUtils';

const createCellActions = () => {
    const element = createElement('lightning-primitive-cell-actions', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

const createCellActionsWithValues = (
    rowKeyValue,
    colKeyValue,
    columnMetadata
) => {
    const element = createCellActions();

    element.rowKeyValue = rowKeyValue;
    element.colKeyValue = colKeyValue;
    element.rowActions = columnMetadata.rowActions;
    if (columnMetadata.typeAttributes) {
        element.menuAlignment = columnMetadata.typeAttributes.menuAlignment;
    }

    return element;
};

function getMenuOpeningMock() {
    return jest.fn(evt => {
        const { actionsProviderFunction, doneCallback } = evt.detail;

        actionsProviderFunction({}, doneCallback);
    });
}

function attachMenuOpeningMock(elem) {
    elem.addEventListener('privatecellactionmenuopening', getMenuOpeningMock());
}

describe('primitive cell actions', () => {
    const staticActions = [
        { id: 1, label: 'action1', iconName: 'utility:description' },
        { id: 2, label: 'action2', disabled: 'true' },
        { id: 3, label: 'action3' },
    ];
    const baseColumnMetadata = {
        label: 'Actions',
        type: 'action',
        rowActions: staticActions,
    };

    describe('defaults', () => {
        it('should default menuAlignment to right', () => {
            const elem = createCellActionsWithValues(1, 1, baseColumnMetadata);
            const buttonMenu = querySelector(elem, 'lightning-button-menu');

            return Promise.resolve().then(() => {
                querySelector(buttonMenu, 'button').click();

                return Promise.resolve().then(() => {
                    const menuAlignmentIsLeft = querySelector(
                        buttonMenu,
                        '.slds-dropdown'
                    ).classList.contains('slds-dropdown_left');

                    expect(menuAlignmentIsLeft).toBe(true);
                });
            });
        });
    });

    it('should pass down tabindex', () => {
        const columnMetadata = Object.assign({}, baseColumnMetadata, {
            typeAttributes: {
                menuAlignment: 'left',
            },
        });
        const elem = createCellActionsWithValues(1, 1, columnMetadata);
        elem.tabIndex = -7;

        const buttonMenu = querySelector(elem, 'lightning-button-menu');

        return Promise.resolve().then(() => {
            return Promise.resolve().then(() => {
                expect(
                    querySelector(buttonMenu, 'button').getAttribute('tabindex')
                ).toBe('-7');
            });
        });
    });

    it('should use menuAlignment to from cellAttributes', () => {
        const columnMetadata = Object.assign({}, baseColumnMetadata, {
            typeAttributes: {
                menuAlignment: 'left',
            },
        });
        const elem = createCellActionsWithValues(1, 1, columnMetadata);
        const buttonMenu = querySelector(elem, 'lightning-button-menu');

        return Promise.resolve().then(() => {
            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                const menuAlignmentIsLeft = querySelector(
                    buttonMenu,
                    '.slds-dropdown'
                ).classList.contains('slds-dropdown_left');

                expect(menuAlignmentIsLeft).toBe(true);
            });
        });
    });

    it('should disable second menu item', () => {
        const elem = createCellActionsWithValues(1, 1, baseColumnMetadata);
        attachMenuOpeningMock(elem);
        const buttonMenu = querySelector(elem, 'lightning-button-menu');

        return Promise.resolve().then(() => {
            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                return Promise.resolve().then(() => {
                    const menu = buttonMenu.querySelectorAll(
                        'lightning-menu-item'
                    );

                    expect(menu[1]).toMatchSnapshot();
                });
            });
        });
    });

    it('should show description icon in first menu item', () => {
        const elem = createCellActionsWithValues(1, 1, baseColumnMetadata);
        attachMenuOpeningMock(elem);
        const buttonMenu = querySelector(elem, 'lightning-button-menu');

        return Promise.resolve().then(() => {
            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                return Promise.resolve().then(() => {
                    const menu = querySelector(
                        buttonMenu,
                        'lightning-menu-item'
                    );
                    const icon = querySelector(
                        menu,
                        'lightning-primitive-icon'
                    );
                    expect(icon).toMatchSnapshot();
                });
            });
        });
    });

    it('should show 3 menu items', () => {
        const elem = createCellActionsWithValues(1, 1, baseColumnMetadata);
        attachMenuOpeningMock(elem);
        const buttonMenu = querySelector(elem, 'lightning-button-menu');

        return Promise.resolve().then(() => {
            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                return Promise.resolve().then(() => {
                    const menuItemselector = 'lightning-menu-item';
                    const totalMenuItems = buttonMenu.querySelectorAll(
                        menuItemselector
                    );

                    expect(totalMenuItems).toHaveLength(3);
                });
            });
        });
    });

    describe('dynamic actions', () => {
        it('should trigger "privatecellactionmenuopening" on open menu', () => {
            const columnMetadata = {
                label: 'Actions',
                type: 'action',
                rowActions: () => {},
            };
            const elem = createCellActionsWithValues(5, 3, columnMetadata);

            const evtListenerMock = jest.fn();
            elem.addEventListener(
                'privatecellactionmenuopening',
                evtListenerMock
            );

            return Promise.resolve().then(() => {
                const buttonMenu = querySelector(elem, 'lightning-button-menu');
                querySelector(buttonMenu, 'button').click();

                return Promise.resolve().then(() => {
                    expect(evtListenerMock.mock.calls).toHaveLength(1);
                    const details = evtListenerMock.mock.calls[0][0].detail;

                    expect(details.rowKeyValue).toBe(5);
                    expect(details.colKeyValue).toBe(3);
                    expect(details.actionsProviderFunction).toBe(
                        columnMetadata.rowActions
                    );
                    expect(typeof details.doneCallback).toBe('function');
                });
            });
        });

        it('should show spinner and load dynamic options', () => {
            const columnMetadata = {
                label: 'Actions',
                type: 'action',
                rowActions: (row, doneCb) =>
                    Promise.resolve().then(() =>
                        doneCb([{ label: 'menu1' }, { label: 'menu2' }])
                    ),
            };
            const elem = createCellActionsWithValues(5, 3, columnMetadata);

            attachMenuOpeningMock(elem);

            return Promise.resolve().then(() => {
                const buttonMenu = querySelector(elem, 'lightning-button-menu');
                querySelector(buttonMenu, 'button').click();

                return Promise.resolve().then(() => {
                    const menuWithSpinner = querySelector(
                        buttonMenu,
                        'div.slds-dropdown'
                    );

                    expect(menuWithSpinner).toMatchSnapshot();

                    return Promise.resolve().then(() => {
                        // we need to do another one because this one its forced to be async in the component
                        return Promise.resolve().then(() => {
                            const menuWithItems = querySelector(
                                buttonMenu,
                                "div[role='menu']"
                            );
                            expect(menuWithItems).toMatchSnapshot();
                        });
                    });
                });
            });
        });
    });

    it('should trigger cellactiontriggered on menu item select', () => {
        const elem = createCellActionsWithValues(1, 1, baseColumnMetadata);
        attachMenuOpeningMock(elem);

        const actionTriggeredListenerMock = jest.fn();
        elem.addEventListener(
            'privatecellactiontriggered',
            actionTriggeredListenerMock
        );

        return Promise.resolve().then(() => {
            const buttonMenu = querySelector(elem, 'lightning-button-menu');
            querySelector(buttonMenu, 'button').click();

            return Promise.resolve().then(() => {
                return Promise.resolve().then(() => {
                    const menuItemselector = 'lightning-menu-item';
                    const menuItems = buttonMenu.querySelectorAll(
                        menuItemselector
                    );
                    expect(menuItems).toHaveLength(3);

                    querySelector(menuItems[2], 'a').click();

                    expect(actionTriggeredListenerMock.mock.calls).toHaveLength(
                        1
                    );
                    const details =
                        actionTriggeredListenerMock.mock.calls[0][0].detail;

                    expect(details.rowKeyValue).toBe(1);
                    expect(details.colKeyValue).toBe(1);
                    expect(details.action.id).toBe(3);
                });
            });
        });
    });
});
