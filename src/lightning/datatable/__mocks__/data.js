export const INVALID_DATA_COLLECTION = [
    { data: 'string', desc: 'data is string' },
    { data: 69, desc: 'data is number' },
    { data: undefined, desc: 'data is undefined' },
    { data: null, desc: 'data is null' },
    { data: {}, desc: 'data is plain object' },
    { data: true, desc: 'data is a boolean' },
];

export const NORMALIZED_DATA = [
    {
        id: 'a',
        name: 'Salesforce.com',
        amount: 25,
        email: 'max@salesforce.com',
    },
    { id: 'b', name: 'google.com', amount: 24, email: 'toe@gmail.com' },
    { id: 'c', name: 'facebook.com', amount: 23, email: 'peter@facebook.com' },
];

export const INVALID_METADATA_COLLECTION = [
    { metadata: 'string', desc: 'value is string' },
    { metadata: 69, desc: 'value is number' },
    { metadata: undefined, desc: 'value is undefined' },
    { metadata: null, desc: 'value is null' },
    { metadata: true, desc: 'value is a boolean' },
];

export const NORMALIZED_METADATA = [
    { type: 'text', fieldName: 'name', label: 'Opportunity name' },
    { type: 'number', fieldName: 'amount', label: 'Amount' },
    { type: 'text', fieldName: 'email', label: 'Contact' },
];

export const METADATA_WITH_WRONG_TYPE_AT_INDEX_3 = [
    // since normalization is gonna add the checkbox column at beginning
    // of the metadata.columns the index of the wrong column is 3
    { type: 'text', fieldName: 'name', label: 'Opportunity name' },
    { type: 'number', fieldName: 'amount', label: 'Amount' },
    { type: 'invalid type', fieldName: 'email', label: 'Contact' },
];

export const NORMALIZED_METADATA_NOT_SELECTABLE = [
    { type: 'text', fieldName: 'name', label: 'Opportunity name' },
    { type: 'number', fieldName: 'amount', label: 'Amount' },
    { type: 'text', fieldName: 'email', label: 'Contact' },
];

const NORMALIZED_TREEGRID_DATA = [
    {
        id: 'a',
        name: 'Salesforce.com',
        amount: 25,
        email: 'max@salesforce.com',
        hasChildren: true,
        isExpanded: true,
        level: 1,
        setSize: 2,
        posInSet: 1,
    },
    {
        id: 'b',
        name: 'google.com',
        amount: 24,
        email: 'toe@gmail.com',
        level: 2,
        setSize: 1,
        posInSet: 1,
    },
    {
        id: 'c',
        name: 'facebook.com',
        amount: 23,
        email: 'peter@facebook.com',
        hasChildren: true,
        isExpanded: false,
        level: 1,
        setSize: 2,
        posInSet: 2,
    },
];

const NORMALIZED_TREEGRID_METADATA = [
    {
        type: 'tree',
        fieldName: 'name',
        label: 'Opportunity name',
        typeAttributes: {
            hasChildren: { fieldName: 'hasChildren' },
            isExpanded: { fieldName: 'isExpanded' },
            level: { fieldName: 'level' },
            setSize: { fieldName: 'setSize' },
            posInSet: { fieldName: 'posInSet' },
            subType: 'text',
        },
    },
    { type: 'number', fieldName: 'amount', label: 'Amount' },
    { type: 'text', fieldName: 'email', label: 'Contact' },
];

export const DATATABLE_STATE_WITHOUT_PREVIEW_ROWS = {
    data: NORMALIZED_DATA,
    columns: NORMALIZED_METADATA,
    rows: [],
    selectedRowsKeys: {},
    keyField: 'id',
    wrapText: {},
    errors: {
        rows: {},
        fieldNames: {},
    },
    inlineEdit: { dirtyValues: {} },
};

export const DATATABLE_STATE_TREEDATA_WITHOUT_ROWS = {
    data: NORMALIZED_TREEGRID_DATA,
    columns: NORMALIZED_TREEGRID_METADATA,
    rows: [],
    selectedRowsKeys: {},
    keyField: 'id',
    wrapText: {},
    errors: {
        rows: {},
        fieldNames: {},
    },
    inlineEdit: { dirtyValues: {} },
};

export const DATATABLE_STATE = {
    data: NORMALIZED_DATA,
    columns: NORMALIZED_METADATA,
    headerIndexes: {
        'name-text': 0,
        'amount-number': 1,
        'email-text': 2,
    },
    indexes: {
        a: {
            'name-text': [0, 0],
            'amount-number': [0, 1],
            'email-text': [0, 2],
        },
        b: {
            'name-text': [1, 0],
            'amount-number': [1, 1],
            'email-text': [1, 2],
        },
        c: {
            'name-text': [2, 0],
            'amount-number': [2, 1],
            'email-text': [2, 2],
        },
    },
    rows: [
        {
            key: 'a',
            isSelected: false,
            classnames: 'slds-hint-parent',
            cells: [
                {
                    rowKeyValue: 'a',
                    value: 'Salesforce.com',
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'text',
                        fieldName: 'name',
                        label: 'Opportunity name',
                    },
                },
                {
                    rowKeyValue: 'a',
                    value: 25,
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'number',
                        fieldName: 'amount',
                        label: 'Amount',
                    },
                },
                {
                    rowKeyValue: 'a',
                    value: 'max@salesforce.com',
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'email',
                        fieldName: 'email',
                        label: 'Contact',
                    },
                },
            ],
        },
        {
            key: 'b',
            isSelected: true,
            classnames: 'slds-hint-parent slds-is-selected',
            cells: [
                {
                    rowKeyValue: 'b',
                    value: 'google.com',
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'text',
                        fieldName: 'name',
                        label: 'Opportunity name',
                    },
                },
                {
                    rowKeyValue: 'b',
                    value: 24,
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'number',
                        fieldName: 'amount',
                        label: 'Amount',
                    },
                },
                {
                    rowKeyValue: 'b',
                    value: 'toe@gmail.com',
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'email',
                        fieldName: 'email',
                        label: 'Contact',
                    },
                },
            ],
        },
        {
            key: 'c',
            isSelected: false,
            classnames: 'slds-hint-parent',
            cells: [
                {
                    rowKeyValue: 'c',
                    value: 'facebook.com',
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'text',
                        fieldName: 'name',
                        label: 'Opportunity name',
                    },
                },
                {
                    rowKeyValue: 'c',
                    value: 23,
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'number',
                        fieldName: 'amount',
                        label: 'Amount',
                    },
                },
                {
                    rowKeyValue: 'c',
                    value: 'peter@facebook.com',
                    isDataType: true,
                    isCheckbox: false,
                    columnMetadata: {
                        type: 'email',
                        fieldName: 'email',
                        label: 'Contact',
                    },
                },
            ],
        },
    ],
    selectedRowsKeys: { b: true },
    wrapText: {},
    errors: {
        rows: {},
        fieldNames: {},
    },
};

export const DATATABLE_STATE_VALID_ACTIVE_CELL = Object.assign(
    {},
    DATATABLE_STATE,
    {
        activeCell: {
            rowKeyValue: 'a',
            colKeyValue: 'name-text',
        },
    }
);

export const DATATABLE_STATE_INVALID_ACTIVE_CELL_BUT_CELL_STILL = Object.assign(
    {},
    DATATABLE_STATE,
    {
        activeCell: {
            rowKeyValue: 'b',
            colKeyValue: 'name-text',
        },
    }
);
