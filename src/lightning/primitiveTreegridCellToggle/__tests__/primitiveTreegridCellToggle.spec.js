import { createElement } from 'lwc';
import { shadowQuerySelector } from 'lightning/testUtils';
import Element from 'lightning/primitiveTreegridCellToggle';

const createTreeCell = attrs => {
    const element = createElement('lightning-primitive-treegrid-cell-toggle', {
        is: Element,
    });
    document.body.appendChild(element);

    Object.keys(attrs).forEach(
        attrName => (element[attrName] = attrs[attrName])
    );

    return element;
};

describe('lightning-primitive-treegrid-cell-toggle', () => {
    describe('renders expand-collapse state', () => {
        it('should render chevron button if it has children', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: true,
            });

            return Promise.resolve().then(() => {
                const buttonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon'
                );
                expect(buttonIcon).not.toBeNull();
            });
        });
        it('should render chevron button disabled if it has no children', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: undefined,
            });

            return Promise.resolve().then(() => {
                const buttonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon.slds-is-disabled'
                );
                expect(buttonIcon).not.toBeNull();
            });
        });
        it('should render expanded state if is expanded is true', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: true,
                value: 'foo',
                isExpanded: true,
            });

            return Promise.resolve().then(() => {
                const lightningButtonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon'
                );
                const assistiveSpan = shadowQuerySelector(
                    lightningButtonIcon,
                    'span.slds-assistive-text'
                );
                expect(assistiveSpan).not.toBeNull();
                expect(assistiveSpan.textContent).toBe('Collapse foo');
            });
        });
        it('should render expanded state if is expanded is not passed', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: true,
                value: 'foo',
                isExpanded: undefined,
            });

            return Promise.resolve().then(() => {
                const lightningButtonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon'
                );
                const assistiveSpan = shadowQuerySelector(
                    lightningButtonIcon,
                    'span.slds-assistive-text'
                );
                expect(assistiveSpan).not.toBeNull();
                expect(assistiveSpan.textContent).toBe('Expand foo');
            });
        });
        it('should render expanded state if is expanded is false', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: true,
                value: 'foo',
                isExpanded: false,
            });

            return Promise.resolve().then(() => {
                const lightningButtonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon'
                );
                const assistiveSpan = shadowQuerySelector(
                    lightningButtonIcon,
                    'span.slds-assistive-text'
                );
                expect(assistiveSpan).not.toBeNull();
                expect(assistiveSpan.textContent).toBe('Expand foo');
            });
        });
    });
    describe('fires toggle event on chevron click', () => {
        it('should render fire toggle event with expanded false in detail', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: true,
                rowKeyValue: '12b-453',
            });

            return Promise.resolve().then(() => {
                const lightningButtonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon'
                );
                const buttonIcon = shadowQuerySelector(
                    lightningButtonIcon,
                    'button'
                );
                const evtListenerMock = jest.fn();
                element.addEventListener('privatetogglecell', evtListenerMock);
                buttonIcon.click();
                return Promise.resolve().then(() => {
                    expect(evtListenerMock.mock.calls).toHaveLength(1);
                    const details = evtListenerMock.mock.calls[0][0].detail;

                    expect(details.name).toBe('12b-453');
                    expect(details.nextState).toBe(true);
                });
            });
        });
        it('should render fire toggle event with expanded true in detail', () => {
            const element = createTreeCell({
                subType: 'text',
                hasChildren: true,
                rowKeyValue: '12b-453',
                isExpanded: 'true',
            });

            return Promise.resolve().then(() => {
                const lightningButtonIcon = shadowQuerySelector(
                    element,
                    'lightning-button-icon'
                );
                const buttonIcon = shadowQuerySelector(
                    lightningButtonIcon,
                    'button'
                );
                const evtListenerMock = jest.fn();
                element.addEventListener('privatetogglecell', evtListenerMock);
                buttonIcon.click();
                return Promise.resolve().then(() => {
                    expect(evtListenerMock.mock.calls).toHaveLength(1);
                    const details = evtListenerMock.mock.calls[0][0].detail;

                    expect(details.name).toBe('12b-453');
                    expect(details.nextState).toBe(false);
                });
            });
        });
    });
});
