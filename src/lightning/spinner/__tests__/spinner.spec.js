import { createElement } from 'lwc';
import LightningElement from 'lightning/spinner';

const alternativeText = 'required alternative text';

function createComponent(props = {}) {
    const element = createElement('lightning-spinner', {
        is: LightningElement,
    });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
}

describe('lightning-spinner', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('default', () => {
        const element = createComponent({
            alternativeText,
        });

        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    ['small', 'medium', 'large'].forEach(size => {
        it(`size=${size}`, () => {
            const element = createComponent({
                size,
                alternativeText,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });

    ['base', 'brand', 'inverse'].forEach(variant => {
        it(`variant=${variant}`, () => {
            const element = createComponent({
                variant,
                alternativeText,
            });
            return Promise.resolve().then(() => {
                expect(element).toMatchSnapshot();
            });
        });
    });
});
