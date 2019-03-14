import { createElement } from 'lwc';
import Element from 'lightning/formattedLocation';

const createComponent = () => {
    const element = createElement('lightning-formatted-location', {
        is: Element,
    });
    document.body.appendChild(element);
    return element;
};

describe('lightning-formatted-location', () => {
    it('default', () => {
        const element = createComponent();
        expect(element).toMatchSnapshot();
    });

    it('normal longitude and latitude', () => {
        const element = createComponent();
        element.longitude = 122.222;
        element.latitude = 22.222;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('too big longitude', () => {
        const element = createComponent();
        element.longitude = 182.222;
        element.latitude = 22.222;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
    it('too big latitude', () => {
        const element = createComponent();
        element.longitude = 182.222;
        element.latitude = 99.222;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('invalid longitude and latitude', () => {
        const element = createComponent();
        element.longitude = '122.222sss';
        element.latitude = 22.222;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('missing longitude and latitude', () => {
        const element = createComponent();
        element.longitude = null;
        element.latitude = 22.222;
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
