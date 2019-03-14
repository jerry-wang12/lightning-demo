import { createElement } from 'lwc';
import {
    shadowQuerySelector,
    shadowQuerySelectorAll,
} from 'lightning/testUtils';
import Element from 'lightning/primitiveDatatableTooltipBubble';

const createComponent = (props = {}) => {
    const element = createElement(
        'lightning-primitive-datatable-tooltip-bubble',
        {
            is: Element,
        }
    );
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const selector = {
    container: 'section',
    headerText: 'header.slds-popover__header .slds-media .slds-media__body h2',
    headerIcon:
        'header.slds-popover__header .slds-media .slds-media__figure lightning-primitive-icon',
    content: '.slds-popover__body',
    contentList: '.slds-popover__body ul li',
    closeButton: '.slds-float_right.slds-popover__close',
    closeButtonBtn: '.slds-float_right.slds-popover__close button',
};

const keyCodes = {
    enter: 13,
    escape: 27,
    space: 32,
};

describe('lightning-primitive-datatable-tooltip-bubble', () => {
    describe('setting nubbin alignment', () => {
        function assertNubbinAlignment(element, vertical, horizontal) {
            const expectedNubbinClass = `slds-nubbin_${vertical}-${horizontal}`;
            expect(
                element.classList.contains(expectedNubbinClass)
            ).toBeTruthy();
        }

        function testNubbinAlignment(vertical, horizontal) {
            return () => {
                const elem = createComponent();
                elem.align = { vertical, horizontal };

                return Promise.resolve().then(() => {
                    assertNubbinAlignment(elem, vertical, horizontal);
                });
            };
        }

        it('should be bottom right ', testNubbinAlignment('bottom', 'right'));
        it('should be bottom left', testNubbinAlignment('bottom', 'left'));
        it('should be top right ', testNubbinAlignment('top', 'right'));
        it('should be top left', testNubbinAlignment('top', 'left'));

        it('should be able to change nubbin alignment', () => {
            const element = createComponent();
            element.content = 'bubble content';
            element.align = { vertical: 'top', horizontal: 'left' };

            return Promise.resolve().then(() => {
                assertNubbinAlignment(element, 'top', 'left');
                element.align = { vertical: 'bottom', horizontal: 'right' };

                return Promise.resolve().then(() => {
                    assertNubbinAlignment(element, 'bottom', 'right');
                });
            });
        });
    });

    describe('render', () => {
        it('should set header string', () => {
            const originalHeader = 'bubble header';
            const modifiedHeader = 'bubble header modified';

            const element = createComponent({
                header: originalHeader,
            });

            return Promise.resolve().then(() => {
                const header = shadowQuerySelector(
                    element,
                    selector.headerText
                );
                expect(header.textContent).toBe(originalHeader);

                element.header = 'bubble header modified';
                return Promise.resolve().then(() => {
                    expect(header.textContent).toBe(modifiedHeader);
                });
            });
        });

        it('should set content string', () => {
            const originalContent = 'bubble content';
            const modifiedContent = 'bubble content modified';

            const element = createComponent({
                content: originalContent,
            });

            return Promise.resolve().then(() => {
                const body = shadowQuerySelector(element, selector.content);
                expect(body.textContent).toBe(originalContent);

                element.content = 'bubble content modified';
                return Promise.resolve().then(() => {
                    expect(body.textContent).toBe(modifiedContent);
                });
            });
        });

        it('should set content list', () => {
            function getContentListText(element) {
                const contentList = shadowQuerySelectorAll(
                    element,
                    selector.contentList
                );
                return Array.prototype.map.call(
                    contentList,
                    li => li.textContent
                );
            }

            const originalContentList = ['item 1', 'item 2'];
            const modifiedContentList = ['item 1 mod', 'item 2 mod'];

            const element = createComponent({
                content: originalContentList,
            });

            return Promise.resolve().then(() => {
                expect(originalContentList).toEqual(
                    getContentListText(element)
                );

                element.content = modifiedContentList;
                return Promise.resolve().then(() => {
                    expect(modifiedContentList).toEqual(
                        getContentListText(element)
                    );
                });
            });
        });

        it('should set visibility', () => {
            const element = createComponent();
            element.visible = true;

            return Promise.resolve().then(() => {
                expect(
                    element.classList.contains('slds-rise-from-ground')
                ).toBeTruthy();
                element.visible = false;

                return Promise.resolve().then(() => {
                    expect(
                        element.classList.contains('slds-fall-into-ground')
                    ).toBeTruthy();
                });
            });
        });

        it('should show hide close button', () => {
            const element = createComponent();
            return Promise.resolve().then(() => {
                let closeButton = shadowQuerySelector(
                    element,
                    selector.closeButton
                );
                expect(closeButton).toBeTruthy();

                element.hideCloseButton = true;
                return Promise.resolve().then(() => {
                    closeButton = shadowQuerySelector(
                        element,
                        selector.closeButton
                    );
                    expect(closeButton).not.toBeTruthy();
                });
            });
        });

        describe('header icon', () => {
            function testShowCorrectHeaderIcon(variant, iconName) {
                return () => {
                    const element = createComponent({ variant });
                    const headerIcon = shadowQuerySelector(
                        element,
                        selector.headerIcon
                    );
                    expect(headerIcon.iconName).toBe(iconName);
                };
            }

            it(
                'for bare variant',
                testShowCorrectHeaderIcon('bare', 'utility:info')
            );
            it(
                'for error variant',
                testShowCorrectHeaderIcon('error', 'utility:ban')
            );
            it(
                'for warning variant',
                testShowCorrectHeaderIcon('warning', 'utility:warning')
            );
        });
    });

    describe('fires close event', () => {
        function testKeydownTriggerOnClose(targetName, keyName) {
            return () => {
                const mockHandler = jest.fn();
                const element = createComponent({
                    onclose: mockHandler,
                });
                const target = shadowQuerySelector(
                    element,
                    selector[targetName]
                );
                target.dispatchEvent(
                    new KeyboardEvent('keydown', { keyCode: keyCodes[keyName] })
                );
                expect(mockHandler).toBeCalled();
            };
        }

        it(
            'when space key on close button',
            testKeydownTriggerOnClose('closeButton', 'space')
        );
        it(
            'when enter key on close button',
            testKeydownTriggerOnClose('closeButton', 'enter')
        );
        it(
            'when escape key on close button',
            testKeydownTriggerOnClose('closeButton', 'escape')
        );
        it(
            'when escape key on container',
            testKeydownTriggerOnClose('container', 'escape')
        );

        it('on close button click', () => {
            const mockHandler = jest.fn();
            const element = createComponent({
                onclose: mockHandler,
            });
            const lightningButton = shadowQuerySelector(
                element,
                'lightning-button-icon'
            );
            shadowQuerySelector(lightningButton, 'button').click();
            expect(mockHandler).toBeCalled();
        });
    });
});
