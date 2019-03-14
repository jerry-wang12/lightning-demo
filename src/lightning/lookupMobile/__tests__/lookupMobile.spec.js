import * as CONSTANTS from '../constants';
import { createElement } from 'lwc';
import Element from 'lightning/lookupMobile';
import mockRecord from './mockRecord.json';
import mockObjectInfos from './mockObjectInfos.json';
import { querySelector } from 'lightning/testUtils';

const fieldName = 'AccountId';
const label = 'Account';
const objectInfos = JSON.parse(JSON.stringify(mockObjectInfos));
const record = JSON.parse(JSON.stringify(mockRecord));
const maxValues = 1;

expect.extend({
    toContainText(actual, expected) {
        const pass = actual.textContent.includes(expected);
        return {
            message: () =>
                `expected element's text \n\n "${actual.textContent}" \n\n to ${
                    pass ? 'NOT ' : ''
                }contain text ${expected}`,
            pass,
        };
    },
});

const createLookupMobile = (params = {}) => {
    const element = createElement('lightning-lookup-mobile', {
        is: Element,
    });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

describe('lightning-lookup-mobile', () => {
    describe('init combobox', () => {
        it('Passes attribues to input', () => {
            const tests = [
                {
                    attr: 'value',
                    expected: '',
                },
                {
                    attr: 'label',
                    expected: label,
                },
                {
                    attr: 'maxLength',
                    expected: CONSTANTS.INPUT_MAX_LENGTH,
                },
                {
                    attr: 'name',
                    expected: fieldName,
                },
                {
                    attr: 'required',
                    expected: true,
                },
            ];
            const element = createLookupMobile({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values: '',
            });
            return Promise.resolve().then(() => {
                const input = querySelector(element, CONSTANTS.LIGHTNING_INPUT);
                tests.forEach(test => {
                    expect(input[test.attr]).toEqual(test.expected);
                });
            });
        });
    });
});
