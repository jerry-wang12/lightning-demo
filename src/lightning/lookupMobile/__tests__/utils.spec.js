import { getFieldProperties } from '../utils.js';

describe('lookup-mobile:utils', () => {
    describe('getFieldProperties', () => {
        function getMockRecord(objectApiName) {
            return {
                apiName: objectApiName,
            };
        }
        function getMockObjectInfos(
            objectApiName,
            fieldApiName,
            inlineHelpText,
            required
        ) {
            return {
                [objectApiName]: {
                    fields: {
                        [fieldApiName]: {
                            inlineHelpText,
                            required,
                        },
                    },
                },
            };
        }
        function getEmpty() {
            return {
                fieldLevelHelp: null,
                isRequired: false,
            };
        }
        it('Handles empty records', () => {
            const fieldName = 'fieldName';
            const objectInfos = getMockObjectInfos('foo', fieldName, '', false);
            expect(getFieldProperties(null, fieldName, objectInfos)).toEqual(
                getEmpty()
            );
            expect(
                getFieldProperties(undefined, fieldName, objectInfos)
            ).toEqual(getEmpty());
            expect(getFieldProperties({}, 'fieldName', objectInfos)).toEqual(
                getEmpty()
            );
        });
        it('Handles empty fieldNames', () => {
            const objectInfos = getMockObjectInfos(
                'foo',
                'fieldName',
                '',
                false
            );
            const record = getMockObjectInfos('foo');
            expect(getFieldProperties(record, null, objectInfos)).toEqual(
                getEmpty()
            );
            expect(getFieldProperties(record, undefined, objectInfos)).toEqual(
                getEmpty()
            );
            expect(getFieldProperties(record, '', objectInfos)).toEqual(
                getEmpty()
            );
        });
        it('Handles empty objectInfos', () => {
            const fieldName = 'fieldName';
            const record = getMockObjectInfos('foo');
            expect(getFieldProperties(record, fieldName, null)).toEqual(
                getEmpty()
            );
            expect(getFieldProperties(record, fieldName, undefined)).toEqual(
                getEmpty()
            );
            expect(getFieldProperties(record, fieldName, {})).toEqual(
                getEmpty()
            );
        });
        it('Throws on missing objectInfo', () => {
            const fieldName = 'fieldName';
            expect(() => {
                getFieldProperties(
                    getMockRecord('foo'),
                    fieldName,
                    getMockObjectInfos('bar', fieldName, '', false)
                );
            }).toThrow();
        });
        it('Throws on missing field', () => {
            const objectApiName = 'objectApiName';
            expect(() => {
                getFieldProperties(
                    getMockRecord(objectApiName),
                    'foo',
                    getMockObjectInfos(objectApiName, 'bar', '', false)
                );
            }).toThrow();
        });
        it('Returns expected for valid params', () => {
            const objectApiName = 'objectApiName';
            const fieldName = 'fieldName';
            const mockRecord = getMockRecord(objectApiName);
            const mockObjectInfos = getMockObjectInfos(
                objectApiName,
                fieldName,
                'Help',
                true
            );
            expect(
                getFieldProperties(mockRecord, fieldName, mockObjectInfos)
            ).toEqual({
                fieldLevelHelp: 'Help',
                isRequired: true,
            });
        });
    });
});
