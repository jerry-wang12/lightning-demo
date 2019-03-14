import { createElement } from 'lwc';
import Element from 'lightning/primitiveHeaderFactory';
import { shadowQuerySelector } from 'lightning/testUtils';

const createHeaderFactory = (props = {}) => {
    const element = createElement('lightning-primitive-header-actions', {
        is: Element,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

describe('lightning-primitive-header-factory', () => {
    it('should preventDefault in the handleSortingClick', () => {
        const element = createHeaderFactory({
            sortable: true,
            actions: {
                internalActions: [],
                customerActions: [],
            },
        });

        return Promise.resolve().then(() => {
            const sortAnchor = shadowQuerySelector(element, 'a');
            const evt = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            });
            sortAnchor.dispatchEvent(evt);
            expect(evt.defaultPrevented).toBe(true);
        });
    });
    it('should render only assistive text when selectable column and showCheckbox false', () => {
        const element = createHeaderFactory({
            def: {
                type: 'SELECTABLE_CHECKBOX',
                showCheckbox: false,
            },
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should render checkbox when selectable column and showCheckbox true', () => {
        const element = createHeaderFactory({
            def: {
                type: 'SELECTABLE_CHECKBOX',
            },
            showCheckbox: true,
            dtContextId: 'abc',
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should render sortable column header when not selectable column', () => {
        const element = createHeaderFactory({
            def: {
                type: 'text',
            },
            sortable: true,
            hideCheckbox: true,
            actions: {
                internalActions: ['foo', 'bar'],
                customerActions: [],
            },
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should render non-sortable column header when not selectable column', () => {
        const element = createHeaderFactory({
            def: {
                type: 'text',
            },
            hideCheckbox: true,
            actions: {
                internalActions: ['foo', 'bar'],
                customerActions: [],
            },
        });
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('should render resizable markup when resizable is true', () => {
        const element = createHeaderFactory({
            def: {
                type: 'text',
            },
            resizable: true,
            actions: {
                internalActions: [],
                customerActions: [],
            },
        });
        const resizableWrapper = shadowQuerySelector(
            element,
            'lightning-primitive-resize-handler'
        );
        expect(resizableWrapper).not.toBeNull();
    });
    it('should not render resizable markup if resizable true && column def does not specify resizable false', () => {
        const element = createHeaderFactory({
            def: {
                type: 'rowNumber',
                resizable: false,
            },
            resizable: true,
            actions: {
                internalActions: [],
                customerActions: [],
            },
        });
        const resizableWrapper = shadowQuerySelector(
            element,
            'lightning-primitive-resize-handler'
        );
        expect(resizableWrapper).toBeNull();
    });
});
