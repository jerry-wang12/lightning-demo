import labelAdd from '@salesforce/label/LightningLookup.add';
import labelAdvancedSearch from '@salesforce/label/LightningLookup.searchForInObject';
import labelCreateNew from '@salesforce/label/LightningLookup.createNewObject';
import labelCurrentSelection from '@salesforce/label/LightningLookup.currentSelection';
import labelMruHeader from '@salesforce/label/LightningLookup.recentObject';
import labelSearch from '@salesforce/label/LightningLookup.search';
import labelSearchObjectsPlaceholder from '@salesforce/label/LightningLookup.searchObjectsPlaceholder';
import labelSearchPlaceholder from '@salesforce/label/LightningLookup.searchPlaceholder';
import labelSelectObject from '@salesforce/label/LightningLookup.selectObject';
import {
    ACTION_ADVANCED_SEARCH,
    ACTION_CREATE_NEW,
    ICON_ADD,
    ICON_CHECK,
    ICON_DEFAULT,
    ICON_SEARCH,
    ICON_SIZE_X_SMALL,
    OPTION_TYPE_CARD,
    OPTION_TYPE_INLINE,
} from '../constants';
import {
    arraysIdentical,
    computeAdvancedSearchOption,
    computeBindingsString,
    computeBindingsMap,
    computeCreateNewOption,
    computeDedupedItems,
    computeEvent,
    computeFieldApiName,
    computeFieldInfo,
    computeFilterItems,
    computeFilterLabel,
    computeIconName,
    computeHeading,
    computeHighlightedItems,
    computeObjectInfo,
    computeOptionalNameFields,
    computePlaceholder,
    computeRecordPills,
    computeRecordValues,
    computeReferenceInfos,
    computeScopeMap,
    computeUnqualifiedFieldApiName,
    hasCJK,
    hasCreateFromLookup,
    isEmptyObject,
    isValidSearchTerm,
    isValidTypeAheadTerm,
    mergeIntervals,
    splitTextFromMatchingIndexes,
} from '../utils.js';

const i18n = {
    add: labelAdd,
    advancedSearch: labelAdvancedSearch,
    createNew: labelCreateNew,
    currentSelection: labelCurrentSelection,
    mruHeader: labelMruHeader,
    search: labelSearch,
    searchObjectsPlaceholder: labelSearchObjectsPlaceholder,
    searchPlaceholder: labelSearchPlaceholder,
    selectEntity: labelSelectObject,
};

describe('lookup-desktop:utils', () => {
    describe('arraysIdentical', () => {
        it('Handles empty arrays', () => {
            expect(arraysIdentical(null, null)).toBe(false);
            expect(arraysIdentical(undefined, null)).toBe(false);
            expect(arraysIdentical(null, undefined)).toBe(false);
            expect(arraysIdentical(undefined, undefined)).toBe(true);
        });
        it('Handles non arrays', () => {
            expect(arraysIdentical([1, 2, 3], 'foo')).toBe(false);
            expect(arraysIdentical([1, 2, 3], {})).toBe(false);
            expect(arraysIdentical('foo', [1, 2, 3])).toBe(false);
            expect(arraysIdentical({}, [1, 2, 3])).toBe(false);
        });
        it('Handles identical arrays', () => {
            expect(arraysIdentical([1, 2, 3], [1, 2, 3])).toBe(true);
            expect(arraysIdentical([1, 2, 3], [3, 2, 1])).toBe(true);
            expect(arraysIdentical([1, 2, 3], [2, 1, 3])).toBe(true);
        });
        it('Handles non identical arrays', () => {
            expect(arraysIdentical([1, 2, 3], [1, 2, 3, 4])).toBe(false);
            expect(arraysIdentical([1, 2, 3], [])).toBe(false);
        });
    });

    describe('computeAdvancedSearchOption', () => {
        it('Builds the expected text', () => {
            expect(computeAdvancedSearchOption(null, null).text).toBe('"" in ');
            expect(computeAdvancedSearchOption(undefined, undefined).text).toBe(
                '"" in '
            );
            expect(computeAdvancedSearchOption('', '').text).toBe('"" in ');
            expect(
                computeAdvancedSearchOption('term', 'labelPlural').text
            ).toBe('"term" in labelPlural');
        });
        it('Builds the expected option', () => {
            const expected = {
                highlight: true,
                iconAlternativeText: `${i18n.search}`,
                iconName: ICON_SEARCH,
                iconSize: ICON_SIZE_X_SMALL,
                text: `${i18n.advancedSearch}`
                    .replace('{0}', 'Foo')
                    .replace('{1}', 'Accounts'),
                type: OPTION_TYPE_CARD,
                value: ACTION_ADVANCED_SEARCH,
            };
            expect(computeAdvancedSearchOption('Foo', 'Accounts')).toEqual(
                expected
            );
        });
    });

    describe('computeBindingsString', () => {
        it('Handles empty records', () => {
            const dependentFields = ['field0'];
            expect(computeBindingsString(null, dependentFields)).toBeNull();
            expect(
                computeBindingsString(undefined, dependentFields)
            ).toBeNull();
        });
        it('Handles empty dependentFields', () => {
            const record = {};
            expect(computeBindingsString(record, null)).toBeNull();
            expect(computeBindingsString(record, undefined)).toBeNull();
            expect(computeBindingsString(record, [])).toBeNull();
        });
        it('Handles single field in dependentFields', () => {
            const record = {
                fields: {
                    field0: {
                        value: 'val0',
                    },
                    fieldX: {
                        value: 'valX',
                    },
                },
            };
            const dependentFields = ['field0'];
            const bindings = computeBindingsString(record, dependentFields);
            expect(bindings).toBe('field0=val0');
        });
        it('Handles mulitple fields in dependentFields', () => {
            const record = {
                fields: {
                    field0: {
                        value: 'val0',
                    },
                    field1: {
                        value: 'val1',
                    },
                    field2: {
                        value: null,
                    },
                    fieldX: {
                        value: 'valX',
                    },
                },
            };
            const dependentFields = ['field0', 'field1', 'field2'];
            const bindings = computeBindingsString(record, dependentFields);
            expect(bindings).toBe('field0=val0,field1=val1,field2=null');
        });
        it('Handles missing field on record', () => {
            const record = {
                fields: {},
            };
            const dependentFields = ['fieldX'];
            const bindings = computeBindingsString(record, dependentFields);
            expect(bindings).toEqual('fieldX=null');
        });
    });

    describe('computeBindingsMap', () => {
        it('Handles empty records', () => {
            const dependentFields = ['field0'];
            expect(computeBindingsMap(null, dependentFields)).toBeNull();
            expect(computeBindingsMap(undefined, dependentFields)).toBeNull();
        });
        it('Handles empty dependentFields', () => {
            const record = {};
            expect(computeBindingsMap(record, null)).toBeNull();
            expect(computeBindingsMap(record, undefined)).toBeNull();
            expect(computeBindingsMap(record, [])).toBeNull();
        });
        it('Handles single field in dependentFields', () => {
            const record = {
                fields: {
                    field0: {
                        value: 'val0',
                    },
                    fieldX: {
                        value: 'valX',
                    },
                },
            };
            const dependentFields = ['field0'];
            const bindings = computeBindingsMap(record, dependentFields);
            expect(bindings).toEqual({
                field0: 'val0',
            });
        });
        it('Handles mulitple fields in dependentFields', () => {
            const record = {
                fields: {
                    field0: {
                        value: 'val0',
                    },
                    field1: {
                        value: 'val1',
                    },
                    field2: {
                        value: null,
                    },
                    fieldX: {
                        value: 'valX',
                    },
                },
            };
            const dependentFields = ['field0', 'field1', 'field2'];
            const bindings = computeBindingsMap(record, dependentFields);
            expect(bindings).toEqual({
                field0: 'val0',
                field1: 'val1',
                field2: null,
            });
        });
        it('Handles missing field on record', () => {
            const record = {
                fields: {},
            };
            const dependentFields = ['fieldX'];
            const bindings = computeBindingsMap(record, dependentFields);
            expect(bindings).toEqual({
                fieldX: null,
            });
        });
    });

    describe('computeCreateNewOption', () => {
        it('Builds the expected text', () => {
            expect(computeCreateNewOption(null).text).toBe(
                `${i18n.createNew}`.replace('{0}', '')
            );
            expect(computeCreateNewOption(undefined).text).toBe(
                `${i18n.createNew}`.replace('{0}', '')
            );
            expect(computeCreateNewOption('Account').text).toBe(
                `${i18n.createNew}`.replace('{0}', 'Account')
            );
        });
        it('Builds expected option', () => {
            const expected = {
                iconAlternativeText: `${i18n.add}`,
                iconName: ICON_ADD,
                iconSize: ICON_SIZE_X_SMALL,
                text: 'New Account',
                type: OPTION_TYPE_CARD,
                value: ACTION_CREATE_NEW,
            };
            expect(computeCreateNewOption('Account')).toEqual(expected);
        });
    });

    describe('computeDedupedItems', () => {
        it('Handles empty items', () => {
            expect(computeDedupedItems(null)).toEqual([]);
            expect(computeDedupedItems(undefined)).toEqual([]);
            expect(computeDedupedItems([])).toEqual([]);
            expect(computeDedupedItems(undefined, [1, 2, 3])).toEqual([]);
            expect(computeDedupedItems(undefined, [1, 2, 3], 2)).toEqual([]);
            expect(computeDedupedItems(null, [1, 2, 3])).toEqual([]);
            expect(computeDedupedItems(null, [1, 2, 3], 2)).toEqual([]);
        });
        it('Filters items', () => {
            expect(computeDedupedItems([], [1, 2, 3])).toEqual([]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [1]
                )
            ).toEqual([{ value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [1, 3]
                )
            ).toEqual([{ value: 2 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [4]
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    []
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    undefined
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    null
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
        });
        it('Trims items', () => {
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [],
                    undefined
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [],
                    null
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [],
                    0
                )
            ).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);
            expect(
                computeDedupedItems(
                    [{ value: 1 }, { value: 2 }, { value: 3 }],
                    [],
                    1
                )
            ).toEqual([{ value: 1 }]);
            expect(computeDedupedItems([], [], 5)).toEqual([]);
        });
    });

    describe('computeEvent', () => {
        it('Handles empty type', () => {
            expect(computeEvent(undefined)).toEqual({});
            expect(computeEvent(null)).toEqual({});
        });
        it('Handles type', () => {
            expect(computeEvent('change')).toHaveProperty('type', 'change');
        });
        it('Handles empty detail', () => {
            expect(computeEvent('change', undefined, true)).toHaveProperty(
                'type',
                'change'
            );
            expect(computeEvent('change', null, true)).toHaveProperty(
                'type',
                'change'
            );
            expect(computeEvent('change', {}, true)).toHaveProperty(
                'type',
                'change'
            );
        });
        it('Handles detail', () => {
            expect(computeEvent('change', { foo: 'bar' }, true)).toHaveProperty(
                'detail',
                { foo: 'bar' }
            );
        });
        it('Handles empty bubbles', () => {
            expect(
                computeEvent('change', { foo: 'bar' }, undefined)
            ).toHaveProperty('bubbles', true);
            expect(computeEvent('change', { foo: 'bar' }, null)).toHaveProperty(
                'bubbles',
                true
            );
        });
        it('Handles bubbles', () => {
            expect(computeEvent('change', { foo: 'bar' }, true)).toHaveProperty(
                'bubbles',
                true
            );
            expect(
                computeEvent('change', { foo: 'bar' }, false)
            ).toHaveProperty('bubbles', false);
        });
    });

    describe('computeFieldApiName', () => {
        it('Handles empty fieldName', () => {
            expect(computeFieldApiName(undefined)).toEqual('');
            expect(computeFieldApiName(null)).toEqual('');
            expect(computeFieldApiName('')).toEqual('');
        });
        it('Handles fieldId', () => {
            expect(
                computeFieldApiName({
                    objectApiName: 'Opportunity',
                    fieldApiName: 'AccountId',
                })
            ).toEqual('Opportunity.AccountId');
            expect(
                computeFieldApiName({
                    apiName: 'Opportunity',
                    fieldApiName: 'AccountId',
                })
            ).toEqual('');
            expect(
                computeFieldApiName({
                    objectApiName: 'Opportunity',
                    fieldName: 'AccountId',
                })
            ).toEqual('');
        });
        it('Handles fieldName', () => {
            expect(computeFieldApiName('Opportunity.AccountId')).toEqual(
                'Opportunity.AccountId'
            );
            expect(computeFieldApiName('O.AccountId')).toEqual('O.AccountId');
            expect(computeFieldApiName('AccountId', 'Opportunity')).toEqual(
                'Opportunity.AccountId'
            );
            expect(computeFieldApiName('.AccountId')).toEqual('');
            expect(computeFieldApiName('AccountId')).toEqual('');
        });
    });

    describe('computeFieldInfo', () => {
        const objectInfos = {
            Opportunity: {
                apiName: 'Opportunity',
                fields: {
                    AccountId: {
                        apiName: 'AccountId',
                        controllingFields: [],
                        filteredLookupInfo: {
                            controllingFields: ['Some Controlling Field'],
                        },
                        inlineHelpText: 'Some Help Text',
                        referenceToInfos: [
                            {
                                apiName: 'Account',
                                nameFields: ['Name'],
                            },
                        ],
                        relationshipName: 'Account',
                        required: false,
                    },
                },
            },
        };

        it('Handles empty objectInfos', () => {
            expect(computeFieldInfo(undefined, 'Foo', 'SomeField')).toEqual({});
            expect(computeFieldInfo(null, 'Foo', 'FooField')).toEqual({});
        });
        it('Handles empty apiName', () => {
            expect(
                computeFieldInfo({ foo: 'bar' }, undefined, 'FooField')
            ).toEqual({});
            expect(computeFieldInfo({ foo: 'bar' }, null, 'FooField')).toEqual(
                {}
            );
            expect(computeFieldInfo({ foo: 'bar' }, '', 'FooField')).toEqual(
                {}
            );
        });
        it('Handles empty fieldName', () => {
            expect(computeFieldInfo({ foo: 'bar' }, 'Foo', undefined)).toEqual(
                {}
            );
            expect(computeFieldInfo({ foo: 'bar' }, 'Foo', null)).toEqual({});
            expect(computeFieldInfo({ foo: 'bar' }, 'Foo', '')).toEqual({});
            expect(
                computeFieldInfo(
                    objectInfos,
                    'contactId',
                    'Opportunity.contactId'
                )
            ).toEqual({});
        });

        const expected = {
            dependentFields: ['Some Controlling Field'],
            fieldName: 'AccountId',
            inlineHelpText: 'Some Help Text',
            isRequired: false,
            relationshipName: 'Account',
            references: [
                {
                    apiName: 'Account',
                    nameFields: ['Name'],
                },
            ],
        };

        it('Builds info object', () => {
            expect(
                computeFieldInfo(
                    objectInfos,
                    'Opportunity',
                    'Opportunity.AccountId'
                )
            ).toEqual(expected);
        });
    });

    describe('computeFilterItems', () => {
        it('Handles empty references', () => {
            expect(computeFilterItems(undefined)).toBeNull();
            expect(computeFilterItems(null)).toBeNull();
            expect(computeFilterItems({})).toBeNull();
        });
        const references = {
            Opportunity: {
                label: 'Opportunity',
            },
            Account: {
                label: 'Account',
            },
        };
        it('Builds items', () => {
            const expected = [
                {
                    text: 'Account',
                    type: OPTION_TYPE_INLINE,
                    value: 'Account',
                },
                {
                    text: 'Opportunity',
                    type: OPTION_TYPE_INLINE,
                    value: 'Opportunity',
                },
            ];
            expect(computeFilterItems(references)).toEqual(expected);
        });
        it('Builds items with check', () => {
            const expected = [
                {
                    highlight: true,
                    iconAlternativeText: `${i18n.currentSelection}`,
                    iconName: ICON_CHECK,
                    iconSize: ICON_SIZE_X_SMALL,
                    text: 'Account',
                    type: OPTION_TYPE_INLINE,
                    value: 'Account',
                },
                {
                    text: 'Opportunity',
                    type: OPTION_TYPE_INLINE,
                    value: 'Opportunity',
                },
            ];
            expect(computeFilterItems(references, 'Account')).toEqual(expected);
        });
    });

    describe('computeFilterLabel', () => {
        it('Builds label', () => {
            expect(computeFilterLabel()).toEqual(`${i18n.selectEntity}`);
        });
    });

    describe('computeIconName', () => {
        it('Handles empty and malformed objectInfos', () => {
            expect(computeIconName(null)).toBe(ICON_DEFAULT);
            expect(computeIconName(undefined)).toBe(ICON_DEFAULT);
            expect(computeIconName({})).toBe(ICON_DEFAULT);
            expect(
                computeIconName({
                    themeInfo: {},
                })
            ).toBe(ICON_DEFAULT);
            expect(
                computeIconName({
                    themeInfo: {
                        iconUrl: null,
                    },
                })
            ).toBe(ICON_DEFAULT);
        });
        it('Handles custom, standard and other object objectInfos', () => {
            const tests = [
                {
                    iconUrl:
                        'https://localhost/img/icon/t4v35/custom/custom56_120.png',
                    expected: 'custom:custom56',
                },
                {
                    iconUrl:
                        'https://localhost/img/icon/t4v35/standard/account_120.png',
                    expected: 'standard:account',
                },
                {
                    iconUrl:
                        'https://localhost/img/icon/t4v35/standard/service_resource_120.png',
                    expected: 'standard:service_resource',
                },
            ];
            tests.forEach(test => {
                const objectIno = {
                    themeInfo: {
                        iconUrl: test.iconUrl,
                    },
                };
                expect(computeIconName(objectIno)).toEqual(test.expected);
            });
        });
    });

    describe('computeHeading', () => {
        it('Builds the heading', () => {
            expect(computeHeading('Foo')).toEqual(
                `${i18n.mruHeader}`.replace('{0}', 'Foo')
            );
        });
    });

    describe('computeHighlightedItems', () => {
        const items = [
            {
                text: 'salesforce.com account',
                subText: '(213)111-4444',
                type: OPTION_TYPE_CARD,
                value: '001R000002b65xIAA',
            },
        ];
        it('Handles empty items', () => {
            const term = 'foo';
            expect(computeHighlightedItems(null, term)).toEqual([]);
            expect(computeHighlightedItems(undefined, term)).toEqual([]);
            expect(computeHighlightedItems([], term)).toEqual([]);
        });
        it('Handles empty term', () => {
            expect(computeHighlightedItems(items, '')).toEqual([]);
            expect(computeHighlightedItems(items, null)).toEqual([]);
            expect(computeHighlightedItems(items, undefined)).toEqual([]);
        });
        it('Handles prefix matching', () => {
            const expected = [
                {
                    text: [
                        {
                            text: 'sal',
                            highlight: true,
                        },
                        {
                            text: 'esforce.com account',
                        },
                    ],
                    subText: [
                        {
                            text: '(213)111-4444',
                        },
                    ],
                    type: OPTION_TYPE_CARD,
                    value: '001R000002b65xIAA',
                },
            ];
            const term = 'sal';
            expect(computeHighlightedItems(items, term)).toEqual(expected);
        });
        it('Handles suffix matching', () => {
            const expected = [
                {
                    text: [
                        {
                            text: 'salesforce.com a',
                        },
                        {
                            text: 'ccount',
                            highlight: true,
                        },
                    ],
                    subText: [
                        {
                            text: '(213)111-4444',
                        },
                    ],
                    type: OPTION_TYPE_CARD,
                    value: '001R000002b65xIAA',
                },
            ];
            const term = 'ccount';
            expect(computeHighlightedItems(items, term)).toEqual(expected);
        });
        it('Handles matching in between', () => {
            const expected = [
                {
                    text: [
                        {
                            text: 'sales',
                        },
                        {
                            text: 'force',
                            highlight: true,
                        },
                        {
                            text: '.com account',
                        },
                    ],
                    subText: [
                        {
                            text: '(213)111-4444',
                        },
                    ],
                    type: OPTION_TYPE_CARD,
                    value: '001R000002b65xIAA',
                },
            ];
            const term = 'force';
            expect(computeHighlightedItems(items, term)).toEqual(expected);
        });
        it('Handles matching in text and subText together', () => {
            const expected = [
                {
                    text: [
                        {
                            text: 'sa',
                            highlight: true,
                        },
                        {
                            text: 'lesforce.com account',
                        },
                    ],
                    subText: [
                        {
                            text: '(213)',
                        },
                        {
                            text: '111',
                            highlight: true,
                        },
                        {
                            text: '-4444',
                        },
                    ],
                    type: OPTION_TYPE_CARD,
                    value: '001R000002b65xIAA',
                },
            ];
            const term = 'sa 111';
            expect(computeHighlightedItems(items, term)).toEqual(expected);
        });
        it('Handles matching for special characters', () => {
            const expected = [
                {
                    text: [
                        {
                            text: 'salesforce.com account',
                        },
                    ],
                    subText: [
                        {
                            text: '(213)111-4444',
                        },
                    ],
                    type: OPTION_TYPE_CARD,
                    value: '001R000002b65xIAA',
                },
            ];
            const term = 'sale*ce';
            expect(computeHighlightedItems(items, term)).toEqual(expected);
        });
        it('Handles empty text', () => {
            const _items = items.slice();
            const term = 'sale*';
            const expected = [
                {
                    type: OPTION_TYPE_CARD,
                    value: '001R000002b65xIAA',
                },
            ];
            const tests = [
                {
                    text: null,
                    subText: null,
                    expected: {
                        text: null,
                        subText: null,
                    },
                },
                {
                    text: undefined,
                    subText: undefined,
                    expected: {
                        text: null,
                        subText: null,
                    },
                },
                {
                    text: '',
                    subText: '',
                    expected: {
                        text: null,
                        subText: null,
                    },
                },
                {
                    text: _items[0].text,
                    subText: '',
                    expected: {
                        text: [{ text: _items[0].text }],
                        subText: null,
                    },
                },
                {
                    text: '',
                    subText: _items[0].subText,
                    expected: {
                        text: null,
                        subText: [{ text: _items[0].subText }],
                    },
                },
            ];

            tests.forEach(test => {
                _items[0].text = test.text;
                _items[0].subText = test.subText;
                expected[0].text = test.expected.text;
                expected[0].subText = test.expected.subText;
                expect(computeHighlightedItems(_items, term)).toEqual(expected);
            });
        });
    });

    describe('computeObjectInfo', () => {
        it('Handles empty params', () => {
            expect(computeObjectInfo(undefined, undefined)).toEqual({});
            expect(computeObjectInfo(undefined, null)).toEqual({});
            expect(computeObjectInfo(null, undefined)).toEqual({});
            expect(computeObjectInfo({ foo: 'bar' }, '')).toEqual({});
        });
        it('Builds info with or without themeInfo', () => {
            const tests = [
                {
                    objectInfos: {
                        Account: {
                            apiName: 'Account',
                            label: 'Account',
                            labelPlural: 'Accounts',
                            keyPrefix: '001',
                            themeInfo: {
                                color: '7F8DE1',
                                iconUrl:
                                    'http://some-host/img/icon/t4v35/standard/account_120.png',
                            },
                        },
                    },
                    expected: {
                        apiName: 'Account',
                        color: '7F8DE1',
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        iconUrl:
                            'http://some-host/img/icon/t4v35/standard/account_120.png',
                        keyPrefix: '001',
                        label: 'Account',
                        labelPlural: 'Accounts',
                    },
                },
                {
                    objectInfos: {
                        Account: {
                            apiName: 'Account',
                            label: 'Account',
                            labelPlural: 'Accounts',
                            keyPrefix: '001',
                        },
                    },
                    expected: {
                        apiName: 'Account',
                        color: '',
                        iconAlternativeText: 'Account',
                        iconName: 'standard:default',
                        iconUrl: '',
                        keyPrefix: '001',
                        label: 'Account',
                        labelPlural: 'Accounts',
                    },
                },
            ];
            tests.forEach(test => {
                expect(computeObjectInfo(test.objectInfos, 'Account')).toEqual(
                    test.expected
                );
            });
        });
    });

    describe('computeOptionalNameFields', () => {
        it('Handles empty references', () => {
            expect(computeOptionalNameFields(undefined)).toEqual([]);
            expect(computeOptionalNameFields(null)).toEqual([]);
        });
        const references = {
            Account: {
                optionalNameField: 'Account.Name',
            },
            Opportunity: {
                optionalNameField: 'Opportunity.Name',
            },
            Foo: {},
        };
        const expected = ['Account.Name', 'Opportunity.Name'];
        it('Builds list of optional name fields', () => {
            expect(computeOptionalNameFields(references)).toEqual(expected);
        });
    });

    describe('computePlaceholder', () => {
        it('Builds placeholder', () => {
            const searchPlaceholder = `${i18n.searchPlaceholder}`;
            expect(computePlaceholder(null)).toBe(searchPlaceholder);
            expect(computePlaceholder(undefined)).toBe(searchPlaceholder);
            expect(computePlaceholder('')).toBe(searchPlaceholder);
            expect(computePlaceholder('Foo')).toBe(
                `${i18n.searchObjectsPlaceholder}`.replace('{0}', 'Foo')
            );
        });
    });

    describe('computeRecordPills', () => {
        it('Handles empty params', () => {
            expect(computeRecordPills(null, null, null)).toEqual([]);
            expect(computeRecordPills(undefined, undefined, undefined)).toEqual(
                []
            );
        });
        const record = {
            fields: {
                AccountId: {
                    value: '001xx000003GYNKAA4',
                },
                Account: {
                    displayValue: 'Yellow Corporation',
                    value: {
                        apiName: 'Account',
                        childRelationships: {},
                        fields: {
                            Id: {
                                displayValue: null,
                                value: '001xx000003GYNKAA4',
                            },
                            Name: {
                                displayValue: null,
                                value: 'Yellow Corporation',
                            },
                        },
                        id: '001xx000003GYNKAA4',
                        lastModifiedById: null,
                        lastModifiedDate: null,
                        recordTypeInfo: null,
                        systemModstamp: null,
                    },
                },
            },
        };
        const fieldInfo = {
            fieldName: 'AccountId',
            inlineHelpText: null,
            isRequired: false,
            references: [
                {
                    apiName: 'Account',
                    nameFields: ['Name'],
                },
            ],
            relationshipName: 'Account',
        };
        const referenceInfos = {
            Account: {
                apiName: 'Account',
                color: '7F8DE1',
                iconAlternativeText: 'Account',
                iconName: 'standard:account',
                keyPrefix: '001',
                label: 'Account',
                labelPlural: 'Accounts',
                nameField: 'Name',
                optionalNameField: 'Account.Name',
            },
        };
        it('Builds pills', () => {
            const expected = [
                {
                    iconAlternativeText: 'Account',
                    iconName: 'standard:account',
                    iconSize: 'small',
                    label: 'Yellow Corporation',
                    type: 'icon',
                    value: '001xx000003GYNKAA4',
                },
            ];
            expect(
                computeRecordPills(record, fieldInfo, referenceInfos)
            ).toEqual(expected);
        });
        it('Handles empty relationship field', () => {
            const r = JSON.parse(JSON.stringify(record));
            r.fields = {
                Account: {
                    displayValue: null,
                    value: null,
                },
            };
            expect(computeRecordPills(r, fieldInfo, referenceInfos)).toEqual(
                []
            );
        });
        it('Handles field and relationship field id mismatch', () => {
            const r = JSON.parse(JSON.stringify(record));
            r.fields.AccountId.value = 'fooId1';
            r.fields.Account.value.fields.Id.value = 'fooId2';
            expect(computeRecordPills(r, fieldInfo, referenceInfos)).toEqual(
                []
            );
        });
        it('Handles unsupported reference', () => {
            expect(computeRecordPills(record, fieldInfo, {})).toEqual([]);
        });
    });

    describe('computeRecordValues', () => {
        it('Handles empty params', () => {
            expect(computeRecordValues(null, null)).toEqual([]);
            expect(computeRecordValues(undefined, undefined)).toEqual([]);
        });
        it('Handles empty record value', () => {
            const record = {
                fields: {
                    AccountId: {
                        value: '',
                    },
                },
            };
            expect(
                computeRecordValues(record, 'Opportunity.AccountId')
            ).toEqual([]);
        });
        it('Builds values', () => {
            const record = {
                fields: {
                    AccountId: {
                        value: '001xx0000000021AAA',
                    },
                },
            };
            expect(
                computeRecordValues(record, 'Opportunity.AccountId')
            ).toEqual(['001xx0000000021AAA']);
        });
    });

    describe('computeReferenceInfos', () => {
        it('Handles empty params', () => {
            expect(computeReferenceInfos(undefined, undefined)).toEqual({});
            expect(computeReferenceInfos(null, null)).toEqual({});
            expect(computeReferenceInfos(undefined, null)).toEqual({});
            expect(computeReferenceInfos(null, undefined)).toEqual({});
            expect(computeReferenceInfos({ foo: 'bar' }, [])).toEqual({});
        });
        const objectInfos = {
            Account: {
                apiName: 'Account',
                label: 'Account',
                labelPlural: 'Accounts',
                keyPrefix: '001',
                themeInfo: {
                    color: '7F8DE1',
                    iconUrl:
                        'http://some-host/img/icon/t4v35/standard/account_120.png',
                },
            },
            User: {
                apiName: 'User',
                label: 'User',
                labelPlural: 'Users',
                keyPrefix: '005',
                themeInfo: {
                    color: '7F8EEE',
                    iconUrl:
                        'http://some-host/img/icon/t4v35/standard/user_120.png',
                },
            },
        };
        const referenceToInfos = [
            {
                apiName: 'Account',
                nameFields: ['Name'],
            },
            {
                apiName: 'User',
                nameFields: ['FirstName', 'LastName', 'Name'],
            },
        ];
        const expected = {
            Account: {
                apiName: 'Account',
                color: '7F8DE1',
                createNewEnabled: undefined,
                iconAlternativeText: 'Account',
                iconName: 'standard:account',
                iconUrl:
                    'http://some-host/img/icon/t4v35/standard/account_120.png',
                keyPrefix: '001',
                label: 'Account',
                labelPlural: 'Accounts',
                nameField: 'Name',
                optionalNameField: 'Account.Name',
            },
            User: {
                apiName: 'User',
                color: '7F8EEE',
                createNewEnabled: undefined,
                iconAlternativeText: 'User',
                iconName: 'standard:user',
                iconUrl:
                    'http://some-host/img/icon/t4v35/standard/user_120.png',
                keyPrefix: '005',
                label: 'User',
                labelPlural: 'Users',
                nameField: 'Name',
                optionalNameField: 'User.Name',
            },
        };
        it('Builds infos', () => {
            expect(
                computeReferenceInfos(objectInfos, referenceToInfos)
            ).toEqual(expected);
        });
    });

    describe('computeScopeMap', () => {
        it('Handles empty objectInfo', () => {
            expect(computeScopeMap(undefined)).toEqual({});
            expect(computeScopeMap(null)).toEqual({});
        });
        const objectInfo = {
            apiName: 'Account',
            color: '7F8DE1',
            iconAlternativeText: 'Account',
            iconName: 'standard:account',
            iconUrl: 'http://some-host/img/icon/t4v35/standard/account_120.png',
            keyPrefix: '001',
            label: 'Account',
            labelPlural: 'Accounts',
        };
        const expected = {
            iconUrl: 'http://some-host/img/icon/t4v35/standard/account_120.png',
            label: 'Account',
            labelPlural: 'Accounts',
            name: 'Account',
        };
        it('Builds scopeMap', () => {
            expect(computeScopeMap(objectInfo)).toEqual(expected);
        });
    });

    describe('computeUnqualifiedFieldApiName', () => {
        it('Handles empty fieldApiName', () => {
            expect(computeUnqualifiedFieldApiName(undefined)).toEqual('');
            expect(computeUnqualifiedFieldApiName(null)).toEqual('');
            expect(computeUnqualifiedFieldApiName('')).toEqual('');
        });
        it('Handles fieldApiName', () => {
            expect(
                computeUnqualifiedFieldApiName('Opportunity.AccountId')
            ).toEqual('AccountId');
            expect(computeUnqualifiedFieldApiName('O.AccountId')).toEqual(
                'AccountId'
            );
            expect(computeUnqualifiedFieldApiName('AccountId')).toEqual('');
            expect(computeUnqualifiedFieldApiName('.AccountId')).toEqual('');
        });
    });

    describe('hasCJK', () => {
        it('Handles non-CJK terms', () => {
            expect(hasCJK(null)).toBe(false);
            expect(hasCJK(undefined)).toBe(false);
            expect(hasCJK('')).toBe(false);
            expect(hasCJK('   ')).toBe(false);
            expect(hasCJK(' ()"?* ')).toBe(false);
            expect(hasCJK('a')).toBe(false);
        });
        it('Handles partial CJK terms', () => {
            expect(hasCJK('a朵')).toBe(true);
            expect(hasCJK('朵a')).toBe(true);
            expect(hasCJK('a朵a')).toBe(true);
            expect(hasCJK(' a朵')).toBe(true);
            expect(hasCJK('朵a ')).toBe(true);
            expect(hasCJK(' a朵a ')).toBe(true);
        });
        it('Handles CJK terms', () => {
            expect(hasCJK('花朵')).toBe(true);
            expect(hasCJK('朵花')).toBe(true);
            expect(hasCJK('花朵花')).toBe(true);
            expect(hasCJK(' 花 朵 ')).toBe(true);
            expect(hasCJK(' 朵花 ')).toBe(true);
            expect(hasCJK(' 花朵花')).toBe(true);
        });
    });

    describe('hasCreateFromLookup', () => {
        it('Handles empty actions', () => {
            expect(hasCreateFromLookup(undefined)).toEqual(false);
            expect(hasCreateFromLookup(null)).toEqual(false);
            expect(hasCreateFromLookup([])).toEqual(false);
        });

        it('Handles invalid actionListContext', () => {
            let actions = [
                {
                    apiName: 'CreateFromLookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: null,
                    apiName: 'CreateFromLookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: undefined,
                    apiName: 'CreateFromLookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: '',
                    apiName: 'CreateFromLookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: 'Foo',
                    apiName: 'CreateFromLookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
        });

        it('Handles invalid apiName', () => {
            let actions = [
                {
                    actionListContext: 'Lookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: 'Lookup',
                    apiName: undefined,
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: 'Lookup',
                    apiName: null,
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: 'Lookup',
                    apiName: '',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
            actions = [
                {
                    actionListContext: 'Lookup',
                    apiName: 'Foo',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(false);
        });

        it('Handles invalid action', () => {
            const actions = [
                {
                    actionListContext: 'Lookup',
                    apiName: 'CreateFromLookup',
                },
            ];
            expect(hasCreateFromLookup(actions)).toEqual(true);
        });
    });

    describe('isEmptyObject', () => {
        it('Handles invalid objects', () => {
            expect(isEmptyObject(undefined)).toEqual(false);
            expect(isEmptyObject(null)).toEqual(false);
            expect(isEmptyObject('Foo')).toEqual(false);
            expect(isEmptyObject([1, 2, 3])).toEqual(false);
        });
        it('Handles non empty object', () => {
            expect(isEmptyObject({ foo: 'bar' })).toEqual(false);
        });
        it('Handles empty object', () => {
            expect(isEmptyObject({})).toEqual(true);
            expect(isEmptyObject([])).toEqual(true);
        });
    });

    describe('isValidSearchTerm', () => {
        it('Handles invalid empty terms', () => {
            expect(isValidSearchTerm(null)).toBe(false);
            expect(isValidSearchTerm(undefined)).toBe(false);
            expect(isValidSearchTerm('')).toBe(false);
            expect(isValidSearchTerm('   ')).toBe(false);
            expect(isValidSearchTerm(' ()"?* ')).toBe(false);
        });
        it('Handles invalid terms of size 1', () => {
            expect(isValidSearchTerm('a')).toBe(false);
            expect(isValidSearchTerm(' a ')).toBe(false);
            expect(isValidSearchTerm(' a()"?* ')).toBe(false);
        });
        it('Handles valid CJK terms of size 1', () => {
            expect(isValidSearchTerm('朵')).toBe(true);
            expect(isValidSearchTerm('朵')).toBe(true);
            expect(isValidSearchTerm(' 朵 ')).toBe(true);
            expect(isValidSearchTerm(' 朵()"?* ')).toBe(true);
            expect(isValidSearchTerm(' ()"?*朵 ')).toBe(true);
        });
        it('Handles valid terms of size >=2', () => {
            expect(isValidSearchTerm('aa')).toBe(true);
            expect(isValidSearchTerm(' aa ')).toBe(true);
            expect(isValidSearchTerm(' aa()"?* ')).toBe(true);
            expect(isValidSearchTerm('花朵')).toBe(true);
            expect(isValidSearchTerm(' 花朵 ')).toBe(true);
            expect(isValidSearchTerm(' 花朵()"?* ')).toBe(true);
            expect(isValidSearchTerm(' ()"?*花朵 ')).toBe(true);
        });
    });

    describe('isValidTypeAheadTerm', () => {
        it('Handles invalid empty terms', () => {
            expect(isValidTypeAheadTerm(null)).toBe(false);
            expect(isValidTypeAheadTerm(undefined)).toBe(false);
            expect(isValidTypeAheadTerm('')).toBe(false);
            expect(isValidTypeAheadTerm('   ')).toBe(false);
            expect(isValidTypeAheadTerm(' ()"?* ')).toBe(false);
        });
        it('Handles invalid terms of size 1', () => {
            expect(isValidTypeAheadTerm('a')).toBe(false);
            expect(isValidTypeAheadTerm(' a ')).toBe(false);
            expect(isValidTypeAheadTerm(' a()"?* ')).toBe(false);
        });
        it('Handles valid CJK terms of size 1', () => {
            expect(isValidTypeAheadTerm('朵')).toBe(true);
            expect(isValidTypeAheadTerm('朵')).toBe(true);
            expect(isValidTypeAheadTerm(' 朵 ')).toBe(true);
            expect(isValidTypeAheadTerm(' 朵()"?* ')).toBe(true);
            expect(isValidTypeAheadTerm(' a朵()"?* ')).toBe(true);
        });
        it('Handles invalid terms of size 2', () => {
            expect(isValidTypeAheadTerm('aa')).toBe(false);
            expect(isValidTypeAheadTerm(' aa ')).toBe(false);
        });
        it('Handles valid terms of size 2', () => {
            expect(isValidTypeAheadTerm('a朵')).toBe(true);
            expect(isValidTypeAheadTerm(' 朵a ')).toBe(true);
            expect(isValidTypeAheadTerm('花朵')).toBe(true);
            expect(isValidTypeAheadTerm(' 花朵 ')).toBe(true);
        });
        it('Handles valid terms of size >=3', () => {
            expect(isValidTypeAheadTerm('aaa')).toBe(true);
            expect(isValidTypeAheadTerm(' aaa ')).toBe(true);
            expect(isValidTypeAheadTerm(' aaa()"?* ')).toBe(true);
            expect(isValidTypeAheadTerm('花朵花')).toBe(true);
            expect(isValidTypeAheadTerm(' 花朵花 ')).toBe(true);
            expect(isValidTypeAheadTerm(' 花朵花()"?* ')).toBe(true);
            expect(isValidTypeAheadTerm(' ()"?*花朵花 ')).toBe(true);
            expect(isValidTypeAheadTerm(' 花朵()"?* ')).toBe(true);
        });
        it('Handles valid terms of size 254', () => {
            const longTerm = 'a'.repeat(254);
            const longCJKTerm = '花'.repeat(254);
            expect(isValidTypeAheadTerm(longTerm)).toBe(true);
            expect(isValidTypeAheadTerm(` ${longTerm} `)).toBe(true);
            expect(isValidTypeAheadTerm(` ${longTerm}()"?* `)).toBe(true);
            expect(isValidTypeAheadTerm(longCJKTerm)).toBe(true);
            expect(isValidTypeAheadTerm(` ${longCJKTerm} `)).toBe(true);
            expect(isValidTypeAheadTerm(` ${longCJKTerm}()"?* `)).toBe(true);
        });
        it('Handles invalid terms of size 255', () => {
            const longTerm = 'a'.repeat(255);
            const longCJKTerm = '花'.repeat(255);
            expect(isValidTypeAheadTerm(longTerm)).toBe(false);
            expect(isValidTypeAheadTerm(` ${longTerm} `)).toBe(false);
            expect(isValidTypeAheadTerm(` ${longTerm}()"?* `)).toBe(false);
            expect(isValidTypeAheadTerm(longCJKTerm)).toBe(false);
            expect(isValidTypeAheadTerm(` ${longCJKTerm} `)).toBe(false);
            expect(isValidTypeAheadTerm(` ${longCJKTerm}()"?* `)).toBe(false);
        });
    });

    describe('mergeIntervals', () => {
        it('Handles empty intervals', () => {
            expect(mergeIntervals(null)).toEqual([]);
            expect(mergeIntervals(undefined)).toEqual([]);
            expect(mergeIntervals([])).toEqual([]);
        });
        it('Merges intervals with overlaps', () => {
            const intervals = [[0, 3], [1, 4], [5, 7]];
            const expected = [[0, 4], [5, 7]];
            expect(mergeIntervals(intervals)).toEqual(expected);
        });
        it('Handles intervals without overlaps', () => {
            const intervals = [[0, 3], [5, 7]];
            const expected = [[0, 3], [5, 7]];
            expect(mergeIntervals(intervals)).toEqual(expected);
        });
    });

    describe('splitTextFromMatchingIndexes', () => {
        const text = 'salesforce.com account';
        it('Handles empty text', () => {
            expect(splitTextFromMatchingIndexes(null, [[0, 3]])).toEqual([]);
            expect(splitTextFromMatchingIndexes(undefined, [[0, 3]])).toEqual(
                []
            );
            expect(splitTextFromMatchingIndexes('', [[0, 3]])).toEqual([]);
        });
        it('Handles empty intervals', () => {
            expect(splitTextFromMatchingIndexes(text, null)).toEqual([]);
            expect(splitTextFromMatchingIndexes(text, undefined)).toEqual([]);
            expect(splitTextFromMatchingIndexes(text, [])).toEqual([]);
        });
        it('Splits prefix interval', () => {
            const intervals = [[0, 3]];
            const expected = [
                {
                    text: 'sal',
                    highlight: true,
                },
                {
                    text: 'esforce.com account',
                },
            ];
            expect(splitTextFromMatchingIndexes(text, intervals)).toEqual(
                expected
            );
        });
        it('Splits suffix interval', () => {
            const intervals = [[12, 22]];
            const expected = [
                {
                    text: 'salesforce.c',
                },
                {
                    text: 'om account',
                    highlight: true,
                },
            ];
            expect(splitTextFromMatchingIndexes(text, intervals)).toEqual(
                expected
            );
        });
        it('Splits multiple intervals', () => {
            const intervals = [[0, 3], [12, 22]];
            const expected = [
                {
                    text: 'sal',
                    highlight: true,
                },
                {
                    text: 'esforce.c',
                },
                {
                    text: 'om account',
                    highlight: true,
                },
            ];
            expect(splitTextFromMatchingIndexes(text, intervals)).toEqual(
                expected
            );
        });
        it('Splits overlapping intervals', () => {
            const intervals = [[0, 3], [2, 5]];
            const expected = [
                {
                    text: 'sales',
                    highlight: true,
                },
                {
                    text: 'force.com account',
                },
            ];
            expect(splitTextFromMatchingIndexes(text, intervals)).toEqual(
                expected
            );
        });
    });
});
