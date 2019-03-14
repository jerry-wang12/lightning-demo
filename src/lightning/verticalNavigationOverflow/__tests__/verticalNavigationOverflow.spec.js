import { createElement } from 'lwc';
import { shadowQuerySelector } from 'lightning/testUtils';
import showMoreLabel from '@salesforce/label/LightningVerticalNavigation.showMore';
import showLessLabel from '@salesforce/label/LightningVerticalNavigation.showLess';
import Element from 'lightning/verticalNavigationOverflow';

const selector = {
    overflow: '.slds-nav-vertical__overflow',
    overflowButton: '.slds-nav-vertical__action_overflow',
    overflowContent: 'button + div',
};

const createOverflow = () => {
    const element = createElement('lightning-vertical-navigation-overflow', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

function getOverflowButton(element) {
    const button = shadowQuerySelector(element, selector.overflowButton);
    expect(button).toBeTruthy();
    return button;
}

function getOverflowContent(element) {
    const content = shadowQuerySelector(element, selector.overflowContent);
    expect(content).toBeTruthy();
    return content;
}

describe('lightning-vertical-navigation-overflow', () => {
    it('overflow collapsed', () => {
        const element = createOverflow();
        const button = getOverflowButton(element);
        const content = getOverflowContent(element);

        return Promise.resolve().then(() => {
            // button should have correct label
            expect(button.textContent).toContain(showMoreLabel);
            // button should have aria-expanded = false
            expect(button.getAttribute('aria-expanded')).toBe('false');
            // content should have correct classname
            expect(content.className).toBe('slds-hide');
        });
    });
    it('overflow expanded', () => {
        const element = createOverflow();
        const button = getOverflowButton(element);
        button.click();
        const content = getOverflowContent(element);

        return Promise.resolve().then(() => {
            // button should have correct label
            expect(button.textContent).toContain(showLessLabel);
            // button should have aria-expanded = false
            expect(button.getAttribute('aria-expanded')).toBe('true');
            // content should have correct classname
            expect(content.className).toBe('slds-show');
        });
    });
    it('overflow aria controls', () => {
        const element = createOverflow();

        const overflowButton = getOverflowButton(element);
        const ariaControls = overflowButton.getAttribute('aria-controls');

        const overflowContent = getOverflowContent(element);
        const contentId = overflowContent.id;

        expect(ariaControls).toBe(contentId);
    });
});
