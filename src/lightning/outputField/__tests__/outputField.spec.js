import { createElement } from 'lwc';
import Element from 'lightning/outputField';
import store from './mockData.json';
// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils } from 'lightning:IntlLibrary';

const createOutputField = fieldName => {
    const element = createElement('lightning-output-field', { is: Element });
    element.fieldName = fieldName;
    document.body.appendChild(element);
    element.wireRecordUi(store);
    return element;
};

function setLocaleMock(locale) {
    localeUtils.getLocaleTag = () => locale;
}

function waitForReady(element) {
    let pollCount = 0;
    function pollClassList(resolve, reject) {
        if (pollCount > 10) {
            // poll ten times on the microtask queue
            reject('timed out waiting for ready');
        } else if (element.classList.contains('slds-hide')) {
            pollCount++;
            // eslint-disable-next-line lwc/no-set-timeout
            setTimeout(pollClassList(resolve, reject), 0);
        } else {
            resolve();
        }
    }

    return new Promise((resolve, reject) => {
        pollClassList(resolve, reject);
    });
}

const fields = {
    NameSimple: {
        label: 'Simple Name',
        value: 'Simple Name',
    },
};

/**
 * Help Text generates a new, different ID, each time, so any jest testing
 * would need to be able to ignore different help text IDs
 */
describe('lightning-output-field', () => {
    it('text', () => {
        const element = createOutputField('Text');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('text with field reference', () => {
        const element = createOutputField({
            fieldApiName: 'Text',
            objectApiName: 'entity',
        });
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('throws an error on objectApiName mismatch', () => {
        const element = createElement('lightning-output-field', {
            is: Element,
        });
        const data = JSON.parse(JSON.stringify(store));
        element.fieldName = {
            fieldApiName: 'Text',
            objectApiName: 'notEntity',
        };
        document.body.appendChild(element);
        expect(() => {
            element.wireRecordUi(data);
        }).toThrowErrorMatchingSnapshot();
    });

    it('noLabel', () => {
        const element = createOutputField('Text');
        element.variant = 'label-hidden';
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('nonexistent', async () => {
        const element = createOutputField('NonField');
        return Promise.resolve().then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('boolean', () => {
        const element = createOutputField('Boolean');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('email', () => {
        const element = createOutputField('Email');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('phone', () => {
        const element = createOutputField('Phone');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('picklist', () => {
        const element = createOutputField('Picklist');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('richtext fallback', () => {
        const element = createOutputField('RichText');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('url', () => {
        const element = createOutputField('Url');
        return waitForReady(element).then(() => {
            return expect(element).toMatchSnapshot();
        });
    });

    it('adds slds-hide to invalid or hidden field', () => {
        const element = createOutputField('InvalidField');
        return expect(waitForReady(element)).rejects.toBeDefined();
    });

    describe('formatted-name', () => {
        it('Default Name', () => {
            const element = createOutputField('Name');
            return waitForReady(element).then(() => {
                return expect(element).toMatchSnapshot();
            });
        });
        it('Name based on locale', () => {
            setLocaleMock('ja_JP');
            const element = createOutputField('Name');
            return waitForReady(element).then(() => {
                return expect(element).toMatchSnapshot();
            });
        });
        it('renders simple names as text field', () => {
            const element = createOutputField('NameSimple');
            return waitForReady(element).then(() => {
                const textElement = element.shadowRoot.querySelector(
                    'lightning-formatted-text'
                );
                expect(textElement).toBeDefined();
                expect(textElement.shadowRoot.textContent).toEqual(
                    fields.NameSimple.value
                );
            });
        });
    });

    describe('formatted-address', () => {
        it('Default Address', () => {
            const element = createOutputField('BillingAddress');
            return waitForReady(element).then(() => {
                return expect(element).toMatchSnapshot();
            });
        });

        it('format address based on locale', () => {
            setLocaleMock('cn-CN');
            const element = createOutputField('BillingAddress');
            return waitForReady(element).then(() => {
                return expect(element).toMatchSnapshot();
            });
        });
    });
});
