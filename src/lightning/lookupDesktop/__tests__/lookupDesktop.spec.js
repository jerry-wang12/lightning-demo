import * as CONSTANTS from '../constants';
import { createElement } from 'lwc';
import Element from 'lightning/lookupDesktop';
import { querySelector, querySelectorAll } from 'lightning/testUtils';
import { getLookupActions } from 'lightning/uiActionsApi';
import { getLookupRecords } from 'lightning/uiLookupsApi';
import { getRecordUi } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from 'lwc-wire-service-jest-util';
import mockObjectInfosSingleEntity from './mockObjectInfosSingleEntity.json';
import mockObjectInfosMultiEntity from './mockObjectInfosMultiEntity.json';
import * as mockRecords from './mockRecords.json';
import * as mockWireResponses from './mockWireResponses.json';

const mockConstructor = jest.fn();
const record = JSON.parse(JSON.stringify(mockRecords['record-without-value']));
const accountId = ['001xx000000001DAAQ'];
const accountIds = ['001xx000000001DAAQ', '001xx0000000021AAA'];
const accountOpportunityIds = ['001xx0000000021AAA', '006xx0000000011AAA'];
const accountOpportunityLeadIds = [
    '001xx0000000021AAA',
    '00Qxx000000000WEAQ',
    '006xx0000000011AAA',
];
const opportunityId = ['006xx0000000011AAA'];

jest.mock(
    '../advancedSearch',
    () => {
        return {
            showAdvancedSearch: jest.fn(attrs => {
                attrs.saveCallback([{ id: '001xx000000001DAAQ' }]);
            }),
        };
    },
    { virtual: true }
);

jest.mock(
    'aura-instrumentation',
    () => {
        return {
            interaction: jest.fn(),
        };
    },
    { virtual: true }
);

jest.mock(
    'lightning/resizeObserver',
    () => {
        return {
            LightningResizeObserver: jest.fn().mockImplementation((...args) => {
                mockConstructor(...args);
                return {
                    observe: jest.fn(),
                    connect: jest.fn(),
                    disconnect: jest.fn(),
                };
            }),
        };
    },
    { virtual: true }
);

jest.mock(
    'lightning/uiActionsApi',
    () => {
        return {
            getLookupActions: jest.fn(data => {
                return Promise.resolve({ data });
            }),
        };
    },
    { virtual: true }
);

jest.mock(
    'lightning/uiLookupsApi',
    () => {
        return {
            getLookupRecords: jest.fn(data => {
                return Promise.resolve({ data });
            }),
        };
    },
    { virtual: true }
);

jest.mock(
    'lightning/uiRecordApi',
    () => {
        return {
            getRecordUi: jest.fn(data => {
                return Promise.resolve({ data });
            }),
        };
    },
    { virtual: true }
);

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

const createLookupDesktop = (params = {}) => {
    const element = createElement('lightning-lookup-desktop', {
        is: Element,
    });
    Object.assign(element, params);
    document.body.appendChild(element);
    return element;
};

const getGroupedCompoboxInputs = groupedComboboxElement => {
    return groupedComboboxElement.shadowRoot
        .querySelector('lightning-grouped-combobox')
        .shadowRoot.querySelector('lightning-base-combobox')
        .shadowRoot.querySelectorAll('input');
};

const getGroupedCompoboxFirstOptions = groupedComboboxElement => {
    return groupedComboboxElement.shadowRoot
        .querySelector('lightning-grouped-combobox')
        .shadowRoot.querySelector('lightning-base-combobox')
        .shadowRoot.querySelectorAll(
            'lightning-base-combobox-item[role="option"]'
        );
};

const openLookupDropdown = groupedComboboxElement => {
    const inputs = getGroupedCompoboxInputs(groupedComboboxElement);
    if (inputs.length > 0) {
        // We click the last input since we may have an input for a filter combobox
        // and one for the lookup
        inputs[inputs.length - 1].click();
    }
};

const openFilterDropdown = groupedComboboxElement => {
    const inputs = querySelectorAll(groupedComboboxElement, 'input');
    if (inputs.length > 1) {
        // We click on the first input since it's the one associated with the filter
        inputs[0].click();
    }
};

describe('lightning-lookup-desktop', () => {
    const getRecordWireAdapter = registerLdsTestWireAdapter(getRecordUi);
    const getLookupRecordsWireAdapter = registerLdsTestWireAdapter(
        getLookupRecords
    );
    const getLookupActionsWireAdapter = registerLdsTestWireAdapter(
        getLookupActions
    );
    const fieldName = 'AccountId';
    const label = 'Account';

    describe('Combobox', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );
        const values = [];
        const maxValues = 1;

        it('Passes attribues to combobox', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values,
            });
            const tests = [
                {
                    attr: 'disabled',
                    expected: false,
                },
                {
                    attr: 'value',
                    expected: undefined,
                },
                {
                    attr: 'label',
                    expected: label,
                },
                {
                    attr: 'placeholder',
                    expected: 'Search Accounts...',
                },
                {
                    attr: 'items',
                    expected: [],
                },
                {
                    attr: 'inputText',
                    expected: '',
                },
                {
                    attr: 'inputIconName',
                    expected: CONSTANTS.ICON_SEARCH,
                },
                {
                    attr: 'inputMaxlength',
                    expected: CONSTANTS.INPUT_MAX_LENGTH,
                },
                {
                    attr: 'required',
                    expected: true,
                },
            ];

            return Promise.resolve().then(() => {
                // Assert
                const combobox = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                );
                tests.forEach(test => {
                    expect(combobox[test.attr]).toEqual(test.expected);
                });
            });
        });

        it('Calls focus', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            return Promise.resolve().then(() => {
                // Act
                element.focus();

                // Assert
                const input = getGroupedCompoboxInputs(element)[0];
                expect(
                    document.activeElement.shadowRoot.activeElement.shadowRoot
                        .activeElement.shadowRoot.activeElement
                ).toEqual(input);
            });
        });
    });

    describe('Validity', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );

        objectInfos.Opportunity.fields.AccountId.required = true;

        const maxValues = 1;

        it('Checks validity', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            const validity = element.checkValidity();

            // Assert
            expect(validity).toEqual(false);
        });

        it('Reports validity', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            element.reportValidity();

            return Promise.resolve().then(() => {
                // Assert
                expect(
                    element.shadowRoot.querySelector(
                        'lightning-grouped-combobox'
                    ).shadowRoot
                ).toContainText('Complete this field');
            });
        });

        it('Sets custom validity message', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });
            const message = 'ERROR!!';

            // Act
            element.setCustomValidity(message);
            element.showHelpMessageIfInvalid();

            return Promise.resolve().then(() => {
                // Assert
                expect(
                    element.shadowRoot.querySelector(
                        'lightning-grouped-combobox'
                    ).shadowRoot
                ).toContainText(message);
            });
        });

        it('Shows help message', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            return Promise.resolve()
                .then(() => {
                    // Act
                    element.blur();
                    element.showHelpMessageIfInvalid();
                })
                .then(() => {
                    // Assert
                    const helpText = querySelector(
                        element,
                        '.slds-form-element__help'
                    );
                    expect(helpText).toContainText('Complete this field.');
                });
        });
    });

    describe('Referential Integrity', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );

        objectInfos.Opportunity.fields.AccountId.required = true;

        const maxValues = 1;

        it('Handles qualified string fieldId', () => {
            // Arrange
            let actualEventValue;
            const changeHandler = jest.fn().mockImplementation(event => {
                actualEventValue = event.detail.value;
            });
            const expected = {
                pill: {
                    iconAlternativeText: 'Account',
                    iconName: 'standard:account',
                    label: 'Blue Sky Network LLC',
                    type: CONSTANTS.PILL_TYPE_ICON,
                    value: '001xx000000008bAAA',
                    iconSize: 'small',
                },
                values: ['001xx000000008bAAA'],
            };
            const element = createLookupDesktop({
                fieldName: 'Opportunity.AccountId',
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: undefined,
            });

            return Promise.resolve()
                .then(() => {
                    // Act
                    querySelector(element, 'input').click();
                    getLookupRecordsWireAdapter.emit(
                        mockWireResponses['lookup-account']
                    );
                })
                .then(() => {
                    // Act
                    querySelector(
                        element,
                        'lightning-base-combobox-item'
                    ).click();
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).toBeCalled();
                    expect(actualEventValue).toEqual(expected.values);
                    expect(inputPill).toEqual(expected.pill);
                });
        });

        it('Handles object fieldId', () => {
            // Arrange
            let actualEventValue;
            const changeHandler = jest.fn().mockImplementation(event => {
                actualEventValue = event.detail.value;
            });
            const expected = {
                pill: {
                    iconAlternativeText: 'Account',
                    iconName: 'standard:account',
                    label: 'Blue Sky Network LLC',
                    type: CONSTANTS.PILL_TYPE_ICON,
                    value: '001xx000000008bAAA',
                    iconSize: 'small',
                },
                values: ['001xx000000008bAAA'],
            };
            const element = createLookupDesktop({
                fieldName: {
                    objectApiName: 'Opportunity',
                    fieldApiName: 'AccountId',
                },
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: undefined,
            });

            return Promise.resolve()
                .then(() => {
                    // Act
                    querySelector(element, 'input').click();
                    getLookupRecordsWireAdapter.emit(
                        mockWireResponses['lookup-account']
                    );
                })
                .then(() => {
                    // Act
                    querySelector(
                        element,
                        'lightning-base-combobox-item'
                    ).click();
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).toBeCalled();
                    expect(actualEventValue).toEqual(expected.values);
                    expect(inputPill).toEqual(expected.pill);
                });
        });
    });

    describe('Single Entity - Single Select', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );
        const maxValues = 1;

        it('Handles values set during init', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values: accountId,
            });
            const expected = {
                iconAlternativeText: 'Account',
                iconName: 'standard:account',
                label: 'Bank of Ireland Finance Ltd',
                type: CONSTANTS.PILL_TYPE_ICON,
                value: '001xx000000001DAAQ',
            };
            getRecordWireAdapter.emit(mockWireResponses['record-ui-account']);

            return Promise.resolve().then(() => {
                // Assert
                const inputPill = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).inputPill;
                expect(inputPill).toEqual(expected);
            });
        });

        it('Handles values set using api', () => {
            // Arrange
            const changeHandler = jest.fn();
            const expected = {
                pill: {
                    iconAlternativeText: 'Account',
                    iconName: 'standard:account',
                    label: 'Bank of Ireland Finance Ltd',
                    type: CONSTANTS.PILL_TYPE_ICON,
                    value: '001xx000000001DAAQ',
                },
                values: ['001xx000000001DAAQ'],
            };
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: undefined,
            });

            return Promise.resolve()
                .then(() => {
                    // Act
                    element.values = accountId;
                    getRecordWireAdapter.emit(
                        mockWireResponses['record-ui-account']
                    );
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).not.toBeCalled();
                    expect(inputPill).toEqual(expected.pill);
                });
        });

        it('Normalizes values to 18-char ids', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values: undefined,
            });

            return Promise.resolve()
                .then(() => {
                    // Act
                    element.values = ['001xx000003GYWc'];
                })
                .then(() => {
                    // Assert
                    expect(element.values).toEqual(['001xx000003GYWcAAO']);
                });
        });

        it('Handles when option is selected', () => {
            const expected = {
                pill: {
                    iconAlternativeText: 'Account',
                    iconName: 'standard:account',
                    label: 'Blue Sky Network LLC',
                    type: CONSTANTS.PILL_TYPE_ICON,
                    value: '001xx000000008bAAA',
                    iconSize: 'small',
                },
                values: ['001xx000000008bAAA'],
            };
            let actualEventValue;
            const changeHandler = jest.fn().mockImplementation(event => {
                actualEventValue = event.detail.value;
            });
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: undefined,
            });

            return Promise.resolve()
                .then(() => {
                    // Act
                    openLookupDropdown(element);
                    getLookupRecordsWireAdapter.emit(
                        mockWireResponses['lookup-account']
                    );
                })
                .then(() => {
                    // Act
                    querySelector(
                        element,
                        'lightning-base-combobox-item'
                    ).click();
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).toBeCalled();
                    expect(inputPill).toEqual(expected.pill);
                    expect(actualEventValue).toEqual(expected.values);
                    expect(element.values).toEqual(expected.values);
                });
        });

        it('Resolves pill from the source record', () => {
            const recordWithValue = JSON.parse(
                JSON.stringify(mockRecords['record-with-value'])
            );
            const expected = {
                pill: {
                    iconAlternativeText: 'Account',
                    iconName: 'standard:account',
                    iconSize: 'small',
                    label: 'Yellow Corporation',
                    type: 'icon',
                    value: '001xx000003GYNKAA4',
                },
                values: ['001xx000003GYNKAA4'],
            };
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record: recordWithValue,
            });

            return Promise.resolve().then(() => {
                // Assert
                const inputPill = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).inputPill;
                expect(changeHandler).not.toBeCalled();
                expect(inputPill).toEqual(expected.pill);
                expect(element.values).toEqual(expected.values);
            });
        });

        it('Clears values when pill is removed', () => {
            // Arrange
            let actualEventValue;
            const changeHandler = jest.fn().mockImplementation(event => {
                actualEventValue = event.detail.value;
            });
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: accountId,
            });
            getRecordWireAdapter.emit(mockWireResponses['record-ui-account']);

            return Promise.resolve()
                .then(() => {
                    // Act
                    const button = querySelector(element, 'button');
                    button.click();
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).toBeCalled();
                    expect(inputPill).toBeNull();
                    expect(actualEventValue).toEqual([]);
                    expect(element.values).toHaveLength(0);
                });
        });

        it('Clears pill when values set to empty', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: accountId,
            });
            getRecordWireAdapter.emit(mockWireResponses['record-ui-account']);

            return Promise.resolve()
                .then(() => {
                    // Act
                    element.values = [];
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).not.toBeCalled();
                    expect(inputPill).toBeNull();
                    expect(element.values).toHaveLength(0);
                });
        });

        it('Clears pill when values set to null', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: accountId,
            });
            getRecordWireAdapter.emit(mockWireResponses['record-ui-account']);

            return Promise.resolve()
                .then(() => {
                    // Act
                    element.values = null;
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(changeHandler).not.toBeCalled();
                    expect(inputPill).toBeNull();
                    expect(element.values).toHaveLength(0);
                });
        });

        it('Does not show filter', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            return Promise.resolve().then(() => {
                // Assert
                const filterItems = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).filterItems;
                expect(filterItems).toBeNull();
            });
        });

        it('Only shows maxValues number of pills', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values: accountIds,
            });
            const expected = {
                iconAlternativeText: 'Account',
                iconName: 'standard:account',
                label: 'Bank of Ireland Finance Ltd',
                type: CONSTANTS.PILL_TYPE_ICON,
                value: '001xx000000001DAAQ',
            };
            getRecordWireAdapter.emit(mockWireResponses['record-ui-account']);

            return Promise.resolve().then(() => {
                // Assert
                const inputPill = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).inputPill;
                expect(inputPill).toEqual(expected);
            });
        });

        it('Does not reset term if inputText is present', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                values: undefined,
            });
            openLookupDropdown(element);
            getLookupRecordsWireAdapter.emit({
                records: [],
            });
            return Promise.resolve()
                .then(() => {
                    // Assert
                    const expectedLastConfig = {
                        fieldApiName: 'Opportunity.AccountId',
                        requestParams: {
                            q: '', // empty term
                            searchType: 'Recent',
                            page: 1,
                            pageSize: 25,
                            dependentFieldBindings: null,
                        },
                        targetApiName: 'Account',
                    };

                    expect(getLookupRecordsWireAdapter.getLastConfig()).toEqual(
                        expectedLastConfig
                    );

                    // Act
                    // Enter a term
                    const input = querySelector(element, 'input');
                    input.value = 'G';
                    input.dispatchEvent(new Event('input'));

                    // Click on lookup input
                    openLookupDropdown(element);
                    getLookupRecordsWireAdapter.emit({
                        records: [],
                    });
                })
                .then(() => {
                    // Assert
                    // Validate if wire adapter is called with an updated term.
                    const expectedLastConfig = {
                        fieldApiName: 'Opportunity.AccountId',
                        requestParams: {
                            q: 'G', // non empty term
                            searchType: 'Recent',
                            page: 1,
                            pageSize: 25,
                            dependentFieldBindings: null,
                        },
                        targetApiName: 'Account',
                    };
                    expect(getLookupRecordsWireAdapter.getLastConfig()).toEqual(
                        expectedLastConfig
                    );
                });
        });

        it('Validate disabled change', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            element.disabled = true;

            return Promise.resolve().then(() => {
                const combobox = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                );
                // Assert
                expect(element.disabled).toBe(true);
                expect(combobox.disabled).toBe(true);
            });
        });
    });

    describe('Multi Entity - Single Select', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosMultiEntity)
        );
        const maxValues = 1;

        it('Shows filter', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });
            const expected = {
                filterInputText: 'Account',
                filterLabel: 'Choose an object',
                filterItems: [
                    {
                        highlight: true,
                        iconAlternativeText: 'Current Selection',
                        iconName: CONSTANTS.ICON_CHECK,
                        iconSize: CONSTANTS.ICON_SIZE_X_SMALL,
                        text: 'Account',
                        type: CONSTANTS.OPTION_TYPE_INLINE,
                        value: 'Account',
                    },
                    {
                        text: 'Opportunity',
                        type: CONSTANTS.OPTION_TYPE_INLINE,
                        value: 'Opportunity',
                    },
                    {
                        text: 'User',
                        type: CONSTANTS.OPTION_TYPE_INLINE,
                        value: 'User',
                    },
                ],
            };

            return Promise.resolve().then(() => {
                // Assert
                const combobox = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                );
                expect(combobox.filterInputText).toBe(expected.filterInputText);
                expect(combobox.filterLabel).toBe(expected.filterLabel);
                expect(combobox.filterItems).toEqual(expected.filterItems);
            });
        });

        it('Handles entity selection from filter', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                value: null,
            });
            const combobox = querySelector(
                element,
                CONSTANTS.LIGHTNING_COMBOBOX
            );

            expect(combobox.filterInputText).toBe('Account');
            openFilterDropdown(element);

            return Promise.resolve()
                .then(() => {
                    // Act
                    const options = querySelectorAll(
                        element,
                        'lightning-base-combobox-item[role="option"]'
                    );
                    options[options.length - 1].click();
                })
                .then(() => {
                    // Assert
                    expect(combobox.filterInputText).toBe('User');
                    const input = querySelectorAll(element, 'input')[1];
                    expect(input.placeholder).toBe('Search...');
                });
        });

        it('Selecting option hides filter', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            querySelectorAll(element, 'input')[1].click();
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve()
                .then(() => {
                    // Act
                    querySelector(
                        element,
                        'lightning-base-combobox-item'
                    ).click();
                })
                .then(() => {
                    // Assert
                    const combobox = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    );
                    expect(combobox.filterItems).toBeNull();
                    expect(combobox.inputPill).not.toBeNull();
                });
        });

        it('Handles when values is set using api', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });
            const expected = {
                iconAlternativeText: 'Opportunity',
                iconName: 'standard:opportunity',
                label: 'Mind2Market',
                type: CONSTANTS.PILL_TYPE_ICON,
                value: '006xx0000000011AAA',
            };

            return Promise.resolve()
                .then(() => {
                    // Act
                    element.values = opportunityId;
                    getRecordWireAdapter.emit(
                        mockWireResponses['record-ui-opportunity']
                    );
                })
                .then(() => {
                    // Assert
                    const inputPill = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).inputPill;
                    expect(inputPill).toEqual(expected);
                });
        });
    });

    describe('Multi Select - Single Entity', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );
        const maxValues = 2;

        it('Handles values set during init', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: accountIds,
            });
            const expected = {
                pills: [
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Bank of Ireland Finance Ltd',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx000000001DAAQ',
                    },
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Identity Engines Inc',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx0000000021AAA',
                    },
                ],
                values: ['001xx000000001DAAQ', '001xx0000000021AAA'],
            };
            getRecordWireAdapter.emit(mockWireResponses['record-ui-accounts']);

            return Promise.resolve().then(() => {
                // Assert
                const pills = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).pills;
                expect(changeHandler).not.toHaveBeenCalled();
                expect(pills).toEqual(expected.pills);
            });
        });

        it('Handles multiple values set via api', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
            });
            const expected = {
                pills: [
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Bank of Ireland Finance Ltd',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx000000001DAAQ',
                    },
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Identity Engines Inc',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx0000000021AAA',
                    },
                ],
                values: ['001xx000000001DAAQ', '001xx0000000021AAA'],
            };

            // Act
            element.values = accountIds;
            getRecordWireAdapter.emit(mockWireResponses['record-ui-accounts']);

            return Promise.resolve().then(() => {
                // Assert
                const pills = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).pills;
                expect(changeHandler).not.toBeCalled();
                expect(pills).toEqual(expected.pills);
            });
        });

        it('Handles multiple option selection', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                objectInfos,
                record,
                maxValues,
                onchange: changeHandler,
            });

            openLookupDropdown(element);
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve()
                .then(() => {
                    // Act
                    const options = querySelectorAll(
                        element,
                        'lightning-base-combobox-item[role="option"]'
                    );
                    options[0].click();
                    // Assert
                    expect(changeHandler).toBeCalled();
                })
                .then(() => {
                    openLookupDropdown(element);
                    getLookupRecordsWireAdapter.emit(
                        mockWireResponses['lookup-account']
                    );
                })
                .then(() => {
                    // Act
                    const options = querySelectorAll(
                        element,
                        'lightning-base-combobox-item[role="option"]'
                    );
                    options[0].click();
                })
                .then(() => {
                    // Assert
                    const pills = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).pills;

                    expect(pills).toEqual([
                        {
                            iconAlternativeText: 'Account',
                            iconName: 'standard:account',
                            iconSize: 'small',
                            label: 'Blue Sky Network LLC',
                            type: CONSTANTS.PILL_TYPE_ICON,
                            value: '001xx000000008bAAA',
                        },
                        {
                            iconAlternativeText: 'Account',
                            iconName: 'standard:account',
                            iconSize: 'small',
                            label: 'Blue Bell Wilmslow Ltd.',
                            type: CONSTANTS.PILL_TYPE_ICON,
                            value: '001xx00000000FgAAI',
                        },
                    ]);
                    expect(element.values).toEqual([
                        '001xx000000008bAAA',
                        '001xx00000000FgAAI',
                    ]);
                    expect(changeHandler).toBeCalled();
                });
        });

        it('Does not allow values more than maxValues', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                onchange: changeHandler,
            });

            // Act
            element.values = accountIds.concat(opportunityId);
            getRecordWireAdapter.emit(mockWireResponses['record-ui-accounts']);

            return Promise.resolve()
                .then(() => {
                    // Assert
                    const pills = querySelector(
                        element,
                        CONSTANTS.LIGHTNING_COMBOBOX
                    ).pills;
                    expect(pills).toEqual([
                        {
                            iconAlternativeText: 'Account',
                            iconName: 'standard:account',
                            label: 'Bank of Ireland Finance Ltd',
                            type: CONSTANTS.PILL_TYPE_ICON,
                            value: '001xx000000001DAAQ',
                        },
                        {
                            iconAlternativeText: 'Account',
                            iconName: 'standard:account',
                            label: 'Identity Engines Inc',
                            type: CONSTANTS.PILL_TYPE_ICON,
                            value: '001xx0000000021AAA',
                        },
                    ]);
                    expect(changeHandler).not.toBeCalled();
                    openLookupDropdown(element);
                })
                .then(() => {
                    // Assert
                    const option = querySelector(
                        element,
                        'lightning-base-combobox-item'
                    );
                    expect(option).toBeNull();
                });
        });

        it('Drops duplicate values', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            element.values = accountId.concat(accountId);
            getRecordWireAdapter.emit(mockWireResponses['record-ui-account']);

            return Promise.resolve().then(() => {
                // Assert
                const pills = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).pills;
                expect(pills).toEqual([
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Bank of Ireland Finance Ltd',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx000000001DAAQ',
                    },
                ]);
                expect(element.values).toEqual(accountId);
            });
        });

        it('Drops existing values from display list items', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            openLookupDropdown(element);
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve()
                .then(() => {
                    // Act
                    querySelector(
                        element,
                        'lightning-base-combobox-item'
                    ).click();
                })
                .then(() => {
                    // Assert
                    expect(element.values).toContain('001xx000000008bAAA');
                    openLookupDropdown(element);
                    getLookupRecordsWireAdapter.emit(
                        mockWireResponses['lookup-account']
                    );
                })
                .then(() => {
                    const option = querySelector(
                        element,
                        'lightning-base-combobox-item'
                    );
                    // The first mru option should no longer show up
                    // because it is already selected in value.
                    expect(option).not.toContainText('Blue Sky Network LLC');
                });
        });
    });

    describe('Multi Entity - Multi Select', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosMultiEntity)
        );
        const maxValues = 2;

        it('Handles multiple values of different entities', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
            });
            const expected = {
                pills: [
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Identity Engines Inc',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx0000000021AAA',
                    },
                    {
                        iconAlternativeText: 'Opportunity',
                        iconName: 'standard:opportunity',
                        label: 'Mind2Market',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '006xx0000000011AAA',
                    },
                ],
                values: ['001xx0000000021AAA', '006xx0000000011AAA'],
            };

            // Act
            element.values = accountOpportunityIds;
            getRecordWireAdapter.emit(
                mockWireResponses['record-ui-account-opportunity']
            );

            return Promise.resolve().then(() => {
                // Assert
                const pills = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).pills;
                expect(changeHandler).not.toBeCalled();
                expect(pills).toEqual(expected.pills);
            });
        });

        it('Handles values of only supported entities', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues: 3,
                objectInfos,
                onchange: changeHandler,
                record,
            });
            const expected = {
                pills: [
                    {
                        iconAlternativeText: 'Account',
                        iconName: 'standard:account',
                        label: 'Identity Engines Inc',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '001xx0000000021AAA',
                    },
                    {
                        iconAlternativeText: 'Opportunity',
                        iconName: 'standard:opportunity',
                        label: 'Mind2Market',
                        type: CONSTANTS.PILL_TYPE_ICON,
                        value: '006xx0000000011AAA',
                    },
                ],
                values: ['001xx0000000021AAA', '006xx0000000011AAA'],
            };

            // Act
            element.values = accountOpportunityLeadIds;
            getRecordWireAdapter.emit(
                mockWireResponses['record-ui-account-opportunity-lead']
            );

            return Promise.resolve().then(() => {
                // Assert
                const pills = querySelector(
                    element,
                    CONSTANTS.LIGHTNING_COMBOBOX
                ).pills;
                expect(changeHandler).not.toBeCalled();
                expect(pills).toEqual(expected.pills);
            });
        });
    });

    describe('Create New', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );
        const maxValues = 1;

        it('Create new option is not available when showCreateNew = false', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                showCreateNew: false,
            });

            // Act
            openLookupDropdown(element);
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve().then(() => {
                // Assert
                const options = querySelectorAll(
                    element,
                    'lightning-base-combobox-item[role="option"]'
                );
                expect(options[options.length - 1]).not.toContainText(
                    'New Account'
                );
            });
        });

        it('Create new option is available when CreateFromLookup action is supported', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                showCreateNew: true,
            });

            // Act
            openLookupDropdown(element);
            getLookupActionsWireAdapter.emit(
                mockWireResponses['lookup-actions']
            );
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve().then(() => {
                // Assert
                const options = getGroupedCompoboxFirstOptions(element);
                expect(
                    options[options.length - 1].shadowRoot.querySelector(
                        'lightning-base-combobox-formatted-text'
                    ).shadowRoot
                ).toContainText('New Account');
            });
        });

        it('Create new option is shown when there are no MRUs', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
                showCreateNew: true,
            });

            // Act
            openLookupDropdown(element);
            getLookupActionsWireAdapter.emit(
                mockWireResponses['lookup-actions']
            );
            getLookupRecordsWireAdapter.emit({ records: [] });

            return Promise.resolve().then(() => {
                // Assert
                const options = getGroupedCompoboxFirstOptions(element);
                expect(
                    options[options.length - 1].shadowRoot.querySelector(
                        'lightning-base-combobox-formatted-text'
                    ).shadowRoot
                ).toContainText('New Account');
            });
        });

        it('Create new callback is handled', () => {
            // Arrange
            let actualEventValue;
            const changeHandler = jest.fn().mockImplementation(event => {
                actualEventValue = event.detail.value;
            });
            const createNewHandler = jest.fn().mockImplementation(event => {
                event.detail.callback(accountId);
            });
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                showCreateNew: true,
            });
            element.addEventListener('createnew', createNewHandler);

            // Act
            openLookupDropdown(element);
            getLookupActionsWireAdapter.emit(
                mockWireResponses['lookup-actions']
            );
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve().then(() => {
                // Act
                const options = querySelectorAll(
                    element,
                    'lightning-base-combobox-item[role="option"]'
                );
                options[options.length - 1].click();

                // Assert
                expect(createNewHandler).toBeCalled();
                expect(changeHandler).toBeCalled();
                expect(actualEventValue).toEqual(accountId);
                const input = getGroupedCompoboxInputs(element)[0];
                expect(
                    document.activeElement.shadowRoot.activeElement.shadowRoot
                        .activeElement.shadowRoot.activeElement
                ).toEqual(input);
            });
        });
    });

    describe('Advanced Search', () => {
        const objectInfos = JSON.parse(
            JSON.stringify(mockObjectInfosSingleEntity)
        );
        const maxValues = 1;

        it('Advanced search option is not available when term is empty', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            openLookupDropdown(element);
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account']
            );

            return Promise.resolve().then(() => {
                // Assert
                const options = querySelectorAll(
                    element,
                    'lightning-base-combobox-item[role="option"]'
                );
                expect(options[0]).not.toContainText('in Accounts');
            });
        });

        it('Advanced search option becomes available if term is valid', () => {
            // Arrange
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                record,
            });

            // Act
            openLookupDropdown(element);
            const input = getGroupedCompoboxInputs(element)[0];
            input.value = 'Glo';
            input.dispatchEvent(new Event('input'));
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account-glo']
            );

            return Promise.resolve().then(() => {
                // Assert
                const options = getGroupedCompoboxFirstOptions(element);
                expect(
                    options[0].shadowRoot.querySelector(
                        'lightning-base-combobox-formatted-text'
                    ).shadowRoot
                ).toContainText('in Accounts');
            });
        });

        it('Advanced search has saveCallback with change event', () => {
            // Arrange
            const changeHandler = jest.fn();
            const element = createLookupDesktop({
                fieldName,
                label,
                maxValues,
                objectInfos,
                onchange: changeHandler,
                record,
                values: undefined,
            });

            // Act
            openLookupDropdown(element);
            const input = getGroupedCompoboxInputs(element)[0];
            input.value = 'Glo';
            input.dispatchEvent(new Event('input'));
            getLookupRecordsWireAdapter.emit(
                mockWireResponses['lookup-account-glo']
            );

            return Promise.resolve()
                .then(() => {
                    // Act
                    const options = getGroupedCompoboxFirstOptions(element);
                    expect(
                        options[0].shadowRoot.querySelector(
                            'lightning-base-combobox-formatted-text'
                        ).shadowRoot
                    ).toContainText('in Accounts');
                    options[0].click();
                })
                .then(() => {
                    // Assert
                    expect(changeHandler).toBeCalled();
                });
        });
    });
});
