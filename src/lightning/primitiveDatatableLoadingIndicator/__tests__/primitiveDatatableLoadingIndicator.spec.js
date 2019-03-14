import { createElement } from 'lwc';
import Element from 'lightning/primitiveDatatableLoadingIndicator';

const createComponent = () => {
    const element = createElement(
        'lightning-primitive-datatable-loading-indicator',
        {
            is: Element,
        }
    );
    document.body.appendChild(element);
    return element;
};

describe('lightning-primitive-datatable-loading-indicator', () => {
    it('displays correctly', () => {
        const element = createComponent();
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });
});
