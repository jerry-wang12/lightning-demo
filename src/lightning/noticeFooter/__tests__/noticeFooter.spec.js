import { createElement } from 'lwc';
import { shadowQuerySelector } from 'lightning/testUtils';
import Element from 'lightning/noticeFooter';

const createNoticeFooter = () => {
    const element = createElement('lightning-notice-footer', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-notice-footer', () => {
    it('should call handleClickCallback', () => {
        const spy = { called: false };
        const element = createNoticeFooter();

        element.handleClickCallback = () => (spy.called = true);

        return Promise.resolve().then(() => {
            const lightningButton = shadowQuerySelector(
                element,
                'lightning-button'
            );
            const button = shadowQuerySelector(lightningButton, 'button');

            button.click();
            expect(spy.called).toBe(true);
        });
    });
});
