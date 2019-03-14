import { createElement } from 'lwc';
import Element from 'lightning/breadcrumb';

const createBreadcrumb = () => {
    const element = createElement('lightning-breadcrumb', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-breadcrumb', () => {
    it('breadcrumb with name label href', () => {
        const element = createBreadcrumb();
        element.name = 'snapshotlink';
        element.label = 'Test Snapshot Link';
        element.href = '#';
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
