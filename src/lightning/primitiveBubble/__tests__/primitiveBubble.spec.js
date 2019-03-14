import { createElement } from 'lwc';
import Element from 'lightning/primitiveBubble';

const createPrimitiveBubble = () => {
    const element = createElement('lightning-primitive-bubble', {
        is: Element,
    });
    element.contentId = 'lightning-bubble-007';
    document.body.appendChild(element);
    return element;
};

describe('lightning-primitive-bubble', () => {
    function assertAlign(horizontal, vertical) {
        return () => {
            const elem = createPrimitiveBubble();
            elem.content = 'bubble content';
            elem.align = { horizontal, vertical };

            return Promise.resolve().then(() => {
                expect(elem).toMatchSnapshot();
            });
        };
    }

    it('default should be bottom left', () => {
        const elem = createPrimitiveBubble();
        elem.content = 'bubble content';

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
        });
    });

    it('should be right bottom', assertAlign('right', 'bottom'));
    it('should be left bottom', assertAlign('left', 'bottom'));
    it('should be right top', assertAlign('right', 'top'));
    it('should be left top', assertAlign('left', 'top'));
    it('should be center top', assertAlign('center', 'top'));
    it('should be center bottom', assertAlign('center', 'bottom'));
    it('should be left center', assertAlign('left', 'center'));
    it('should be right center', assertAlign('right', 'center'));

    it('should be able to change content', () => {
        const elem = createPrimitiveBubble();
        elem.content = 'bubble content';

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
            elem.content = 'bubble content modified';

            return Promise.resolve().then(() => {
                expect(elem).toMatchSnapshot();
            });
        });
    });
    it('should be able to change position', () => {
        const elem = createPrimitiveBubble();
        elem.content = 'bubble content';
        elem.align = { horizontal: 'left', vertical: 'top' };

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
            elem.align = { horizontal: 'right', vertical: 'bottom' };

            return Promise.resolve().then(() => {
                expect(elem).toMatchSnapshot();
            });
        });
    });
    it('should be visible', () => {
        const elem = createPrimitiveBubble();
        elem.visible = true;

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
        });
    });
});
