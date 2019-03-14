import { createElement } from 'lwc';
import Element from 'lightning/recordForm';
import store from './mockdata.json';
import {
    shadowQuerySelector,
    shadowQuerySelectorAll,
} from 'lightning/testUtils';

const createForm = (props = {}) => {
    const element = createElement('lightning-record-form', { is: Element });
    Object.assign(element, props);
    document.body.appendChild(element);
    return element;
};

function destroyAllForms() {
    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild);
    }
}

function checkNodeListLength(list, length) {
    expect(Array.prototype.slice.call(list)).toHaveLength(length);
}

describe('record form', () => {
    afterEach(() => {
        destroyAllForms();
    });

    it('converts listed field to input fields', () => {
        const element = createForm({
            objectApiName: 'Opportunity',
            fields: ['Name'],
        });
        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );
            expect(inputFields[0].fieldName).toBe('Name');
        });
    });

    it('converts listed field to input fields with object api name reference', () => {
        const element = createForm({
            objectApiName: { objectApiName: 'Opportunity' },
            fields: ['Name'],
        });
        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );
            expect(inputFields[0].fieldName).toBe('Name');
        });
    });

    it('converts listed fields in order to input fields', () => {
        const fields = ['Name', 'BillingAddress', 'AccountId'];
        const element = createForm({
            objectApiName: 'Opportunity',
            fields,
        });
        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );
            const fieldNames = Array.prototype.slice
                .call(inputFields)
                .map(field => {
                    return field.fieldName;
                });
            expect(fieldNames).toEqual(fields);
        });
    });

    it('converts listed field references in order to input fields', () => {
        const fields = [
            { fieldApiName: 'Name', objectApiName: 'Opportunity' },
            { fieldApiName: 'BillingAddress', objectApiName: 'Opportunity' },
            { fieldApiName: 'AccountId', objectApiName: 'Opportunity' },
        ];
        const element = createForm({
            objectApiName: 'Opportunity',
            fields,
        });
        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );
            const fieldNames = Array.prototype.slice
                .call(inputFields)
                .map(field => {
                    return field.fieldName;
                });
            expect(fieldNames).toEqual(
                fields.map(field => {
                    return field.fieldApiName;
                })
            );
        });
    });

    it('passes the layout through to record edit form', () => {
        const element = createForm({
            objectApiName: 'Opportunity',
            layoutType: 'Full',
        });
        return Promise.resolve().then(() => {
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            expect(form.layoutType).toEqual('Full');
        });
    });

    it('gets fieldnames from the layout when a layout is provided for create', () => {
        const element = createForm({
            objectApiName: 'Lead',
            layoutType: 'Full',
        });
        return Promise.resolve().then(() => {
            const fields = [
                'OwnerId',
                'Status',
                'Name',
                'Phone',
                'Company',
                'Email',
                'Title',
                'Rating',
                'Address',
                'Website',
                'AnnualRevenue',
                'Description',
            ];
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            form.dispatchEvent(
                new CustomEvent('load', {
                    detail: {
                        objectInfos: { Lead: store.objectInfo },
                        layout: store.layouts.Lead.Full.View,
                    },
                })
            );
            return Promise.resolve().then(() => {
                const inputFields = shadowQuerySelectorAll(
                    element,
                    'lightning-input-field'
                );
                const fieldNames = Array.prototype.slice
                    .call(inputFields)
                    .map(field => {
                        return field.fieldName;
                    });
                expect(fieldNames).toEqual(fields);
            });
        });
    });

    it('gets fieldnames from the layout when a layout is provided for edit', () => {
        const element = createForm({
            objectApiName: 'Lead',
            layoutType: 'Full',
        });

        const layouts = { Lead: {} };

        layouts.Lead.abcdefg = Object.assign({}, store.layouts.Lead); // abcdefg = layout id
        return Promise.resolve().then(() => {
            const fields = [
                'OwnerId',
                'Status',
                'Name',
                'Phone',
                'Company',
                'Email',
                'Title',
                'Rating',
                'Address',
                'Website',
                'AnnualRevenue',
                'Description',
            ];
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            form.dispatchEvent(
                new CustomEvent('load', {
                    detail: {
                        objectInfos: { Lead: store.objectInfo },
                        layouts,
                    },
                })
            );
            return Promise.resolve().then(() => {
                const inputFields = shadowQuerySelectorAll(
                    element,
                    'lightning-input-field'
                );
                const fieldNames = Array.prototype.slice
                    .call(inputFields)
                    .map(field => {
                        return field.fieldName;
                    });
                expect(fieldNames).toEqual(fields);
            });
        });
    });

    it('gets fieldNames for layout with object references for api name', () => {
        const element = createForm({
            objectApiName: { objectApiName: 'Lead' },
            layoutType: 'Full',
        });

        const layouts = { Lead: {} };

        layouts.Lead.abcdefg = Object.assign({}, store.layouts.Lead); // abcdefg = layout id
        return Promise.resolve().then(() => {
            const fields = [
                'OwnerId',
                'Status',
                'Name',
                'Phone',
                'Company',
                'Email',
                'Title',
                'Rating',
                'Address',
                'Website',
                'AnnualRevenue',
                'Description',
            ];
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            form.dispatchEvent(
                new CustomEvent('load', {
                    detail: {
                        objectInfos: { Lead: store.objectInfo },
                        layouts,
                    },
                })
            );
            return Promise.resolve().then(() => {
                const inputFields = shadowQuerySelectorAll(
                    element,
                    'lightning-input-field'
                );
                const fieldNames = Array.prototype.slice
                    .call(inputFields)
                    .map(field => {
                        return field.fieldName;
                    });
                expect(fieldNames).toEqual(fields);
            });
        });
    });

    it('throws an error when you specify an invalid layout name', () => {
        expect(() => {
            createForm({
                objectApiName: 'Lead',
                layoutType: 'banana',
            });
        }).toThrow('Invalid layout');
    });

    it('opens in edit mode by default for create', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
        });

        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );
            checkNodeListLength(inputFields, 1);
        });
    });

    it('opens in view mode by default for edit', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordId: '00abc',
        });

        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );

            const outputFields = shadowQuerySelectorAll(
                element,
                'lightning-output-field'
            );
            checkNodeListLength(inputFields, 0);
            checkNodeListLength(outputFields, 1);
        });
    });

    it('opens in edit mode when specified', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordId: '00abc',
            mode: 'edit',
        });
        return Promise.resolve().then(() => {
            const inputFields = shadowQuerySelectorAll(
                element,
                'lightning-input-field'
            );
            checkNodeListLength(inputFields, 1);
        });
    });

    it('opens in view mode when specified', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: ['Name'],
            mode: 'view',
        });

        return Promise.resolve().then(() => {
            const outputFields = shadowQuerySelectorAll(
                element,
                'lightning-output-field'
            );
            checkNodeListLength(outputFields, 1);
        });
    });

    it('opens in readonly mode when specified', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordId: '00abc',
            mode: 'readonly',
        });

        return Promise.resolve().then(() => {
            const buttons = shadowQuerySelectorAll(
                element,
                'lightning-button-icon'
            );
            const outputFields = shadowQuerySelectorAll(
                element,
                'lightning-output-field'
            );
            checkNodeListLength(outputFields, 1);
            checkNodeListLength(buttons, 0);
        });
    });

    it('toggles to view mode when canceled and recordId is not null', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordId: '00abc',
            mode: 'edit',
        });

        return Promise.resolve().then(() => {
            const el = shadowQuerySelector(
                element,
                'lightning-button.lightning-record-form-cancel'
            );
            shadowQuerySelector(el, 'button').click();
            return Promise.resolve().then(() => {
                const outputFields = shadowQuerySelectorAll(
                    element,
                    'lightning-output-field'
                );
                checkNodeListLength(outputFields, 1);
            });
        });
    });

    it('cancel clears values when recordID is null', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
        });

        return Promise.resolve().then(() => {
            const el = shadowQuerySelector(
                element,
                'lightning-button.lightning-record-form-cancel'
            );
            shadowQuerySelector(el, 'button').click();
            return Promise.resolve().then(() => {
                const inputField = shadowQuerySelector(
                    element,
                    'lightning-input-field'
                );
                expect(inputField.value).toBe('');
            });
        });
    });

    it('fires a cancel event on cancel', done => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
        });

        element.addEventListener('cancel', () => {
            done();
        });

        return Promise.resolve().then(() => {
            const el = shadowQuerySelector(
                element,
                'lightning-button.lightning-record-form-cancel'
            );
            shadowQuerySelector(el, 'button').click();
        });
    });

    it('passes through recordTypeId', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordTypeId: 'foo',
        });

        return Promise.resolve().then(() => {
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            expect(form.recordTypeId).toEqual('foo');
        });
    });

    it('passes through objectApiName', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordTypeId: 'foo',
        });

        return Promise.resolve().then(() => {
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            expect(form.objectApiName).toEqual('Lead');
        });
    });

    it('passes through objectApiName with object reference', () => {
        const element = createForm({
            objectApiName: { objectApiName: 'Lead' },
            fields: 'Name',
            recordTypeId: 'foo',
        });

        return Promise.resolve().then(() => {
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            expect(form.objectApiName).toEqual({ objectApiName: 'Lead' });
        });
    });

    it('calls submit on the form with submit data', () => {
        const element = createForm({
            objectApiName: 'Lead',
            fields: 'Name',
            recordTypeId: 'foo',
        });

        return Promise.resolve().then(() => {
            const form = shadowQuerySelector(
                element,
                'lightning-record-edit-form'
            );
            element.submit({ foo: 'bar' });
            expect(form.getSubmitData()).toEqual({ foo: 'bar' });
        });
    });
});
