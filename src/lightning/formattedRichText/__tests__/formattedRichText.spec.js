import { createElement } from 'lwc';
import Element from 'lightning/formattedRichText';

const createRichText = () => {
    const element = createElement('lightning-formatted-rich-text', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

describe('lightning-formatted-rich-text', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('default', () => {
        const element = createRichText();
        expect(element).toMatchSnapshot();
    });

    it('Plain text, no formatting', () => {
        const element = createRichText();
        element.value = 'This is plain text';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Simple rich text', () => {
        const element = createRichText();
        element.value =
            '<h2>This</h2> <p>is <i>some</i> simple <b>rich</b> text</p>';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Rich text with hyperlink', () => {
        const element = createRichText();
        element.value =
            'This is a link to <a href="www.salesforce.com">Salesforce</a>';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Rich text with links', () => {
        const element = createRichText();
        element.value =
            '<ul><li><a href="http://www.google.com">www.google.com</a></li><li>www.salesforce.com</li><li>http://www.google.com</li><li>salesforce.com</li><li>email@richtext.com</li></ul>';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('Should not throw when value is set to null', () => {
        const element = createRichText();
        expect(() => {
            element.value = null;
        }).not.toThrow();
    });

    // Sanitization library is not accessible from here, so this is not currently useful
    /* it('Rich text with non-whitelisted content', () => {
        const element = createRichText();
        element.value = "SVGs are not whitelisted: <svg height=\"300\" width=\"300\"><rect height=\"100%\" width=\"100%\" fill=\"blue\" /></svg>";
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });*/
});
