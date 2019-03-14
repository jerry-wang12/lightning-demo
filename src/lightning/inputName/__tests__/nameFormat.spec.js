import { parseFieldsFormat, getFieldsOrder } from '../nameFormatter';
import { setLocaleTagMock } from '../__mocks__/localeMockUtils';

describe('parseFieldsFormat', () => {
    it('Parse input name order', () => {
        const fields = parseFieldsFormat('LMFSXI');
        expect(fields).toEqual([
            'lastName',
            'middleName',
            'firstName',
            'salutation',
            'suffix',
            'informalName',
        ]);
    });
    it('Parse input name order in lower case', () => {
        const fields = parseFieldsFormat('lmfsxi');
        expect(fields).toEqual([
            'lastName',
            'middleName',
            'firstName',
            'salutation',
            'suffix',
            'informalName',
        ]);
    });
    it('Parse short input name order', () => {
        const fields = parseFieldsFormat('FL');
        expect(fields).toEqual(['firstName', 'lastName']);
    });
});
describe('getFieldsOrder', () => {
    it('Get input Name fields order', () => {
        setLocaleTagMock('ja_JP');
        const fields = getFieldsOrder();
        expect(fields).toEqual([
            'lastName',
            'middleName',
            'firstName',
            'suffix',
            'informalName',
        ]);
    });
});
