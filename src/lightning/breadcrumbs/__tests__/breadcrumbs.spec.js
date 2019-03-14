import { createElement } from 'lwc';
import Element from 'snapshot/breadcrumbs';

const createBreadcrumbs = () => {
    const element = createElement('snapshot-breadcrumbs', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-breadcrumbs', () => {
    it('breadcrumbs', () => {
        const breadcrumbs = createBreadcrumbs();
        breadcrumbs.label1 = 'Parent';
        breadcrumbs.label2 = 'Child1';
        breadcrumbs.label3 = 'Child2';
        breadcrumbs.href1 = 'LinkParent';
        breadcrumbs.href2 = 'LinkLevel1';
        breadcrumbs.href3 = '#';

        return Promise.resolve().then(() => {
            expect(breadcrumbs).toMatchSnapshot();
        });
    });
});
