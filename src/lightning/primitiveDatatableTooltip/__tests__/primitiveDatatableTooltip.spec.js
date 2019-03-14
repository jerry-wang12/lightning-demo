import { createElement } from 'lwc';
import Element from 'lightning/primitiveDatatableTooltip';
import { shadowQuerySelector } from 'lightning/testUtils';

const createComponent = function(props = {}) {
    const element = createElement('lightning-primitive-datatable-tooltip', {
        is: Element,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

const selector = {
    tooltipTrigger: '[data-trigger="true"]',
    tooltipIcon: '[data-trigger="true"] lightning-primitive-icon',
};

describe('tooltip component', () => {
    describe('tooltip icon', () => {
        function testShowCorrectTooltipIcon(variant, iconName) {
            return () => {
                const element = createComponent({ variant });
                const tooltipIcon = shadowQuerySelector(
                    element,
                    selector.tooltipIcon
                );
                expect(tooltipIcon.iconName).toBe(iconName);
            };
        }

        it(
            'for bare variant',
            testShowCorrectTooltipIcon('bare', 'utility:info')
        );
        it(
            'for error variant',
            testShowCorrectTooltipIcon('error', 'utility:ban')
        );
        it(
            'for warning variant',
            testShowCorrectTooltipIcon('warning', 'utility:warning')
        );
    });

    it('focuses on tooltip trigger when focus api is called', () => {
        const element = createComponent();
        element.focus();

        const tooltipTrigger = shadowQuerySelector(
            element,
            selector.tooltipTrigger
        );
        expect(element.shadowRoot.activeElement).toBe(tooltipTrigger);
    });
});
