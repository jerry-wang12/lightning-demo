/** TEST DISABLED FOR RAPTOR BUG */

import { createElement } from 'lwc';
import Element from 'lightning/messages';

const createMessages = () => {
    const element = createElement('lightning-messages', { is: Element });
    document.body.appendChild(element);
    return element;
};

describe('lightning-messages', () => {
    it('default', () => {
        const elem = createMessages();
        elem.setError(getErrorResponse([{ errorCode: 'foo', message: 'bar' }]));

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
        });
    });
    it('just a message', () => {
        const elem = createMessages();
        elem.setError(getErrorResponse([{ message: 'bar' }]));

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
        });
    });
    it('has no error', () => {
        const elem = createMessages();
        elem.setError(null);

        return Promise.resolve().then(() => {
            expect(elem).toMatchSnapshot();
        });
    });
});

function getErrorResponse(body) {
    return {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        body,
    };
}
