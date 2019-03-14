import { createElement } from 'lwc';
import { querySelector, querySelectorAll } from 'lightning/testUtils';
import Element from 'lightning/primitiveDatatableStatusBar';

const createComponent = props => {
    const element = createElement('lightning-primitive-datatable-status-bar', {
        is: Element,
    });

    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

function cancelButton(element) {
    return querySelectorAll(element, 'button')[0];
}

function saveButton(element) {
    return querySelectorAll(element, 'button')[1];
}

function tooltip(element) {
    return querySelector(element, 'lightning-primitive-datatable-tooltip');
}

describe('lightning-primitive-datatable-status-bar', () => {
    it('renders correctly', () => {
        const element = createComponent();
        return Promise.resolve().then(() => {
            expect(element).toMatchSnapshot();
        });
    });

    it('fires cancel event on cancel button click', () => {
        const mockHandler = jest.fn();
        const element = createComponent({});
        element.addEventListener('privatecancel', mockHandler, false);

        return Promise.resolve().then(() => {
            cancelButton(element).click();
            expect(mockHandler).toBeCalled();
        });
    });

    it('fires save event on save button click', () => {
        const mockHandler = jest.fn();
        const element = createComponent({});
        element.addEventListener('privatesave', mockHandler, false);

        return Promise.resolve().then(() => {
            saveButton(element).click();
            expect(mockHandler).toBeCalled();
        });
    });

    it('shows error tooltip when error object has only title', () => {
        const element = createComponent({
            error: {
                title: 'Error Title',
            },
        });
        expect(tooltip(element)).toBeTruthy();
    });

    it('shows error tooltip when error object has only messages', () => {
        const element = createComponent({
            error: {
                messages: ['error message'],
            },
        });
        expect(tooltip(element)).toBeTruthy();
    });

    it('shows error tooltip when error object is set', () => {
        const element = createComponent();
        return Promise.resolve().then(() => {
            element.error = {
                title: 'Error Title',
                messages: ['error message'],
            };
            return Promise.resolve().then(() => {
                expect(tooltip(element)).toBeTruthy();
            });
        });
    });
});
