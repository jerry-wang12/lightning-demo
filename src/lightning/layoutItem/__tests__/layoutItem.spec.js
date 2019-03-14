import { createElement } from 'lwc';
import LightningElement from 'lightning/layoutItem';

function createComponent(props = {}) {
    const element = createElement('lightning-layout-item', {
        is: LightningElement,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

describe('lightning-layout-item', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('default', () => {
        const element = createComponent({
            size: 12,
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('flexibility', () => {
        const element = createComponent({
            size: 12,
            flexibility: 'auto,grow,shrink',
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('alignment-bump', () => {
        const element = createComponent({
            size: 12,
            alignmentBump: 'right',
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('padding', () => {
        const element = createComponent({
            size: 12,
            padding: 'around-medium',
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
