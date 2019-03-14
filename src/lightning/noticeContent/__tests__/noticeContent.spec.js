import { createElement } from 'lwc';
import Element from 'lightning/noticeContent';

const createNoticeContent = () => {
    const element = createElement('lightning-notice-content', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-notice-content', () => {
    it('default', () => {
        const element = createNoticeContent();
        expect(element).toMatchSnapshot();
    });

    it('should display text with links and newlines', () => {
        const element = createNoticeContent();
        element.messageTitle = 'title should be strong';
        element.messageBody = `this is the first line
        should replace https://google.com into a link in the second line
        this should be in the third line.`;

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
