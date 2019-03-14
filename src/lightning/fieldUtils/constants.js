/*
 * Constants to use UI API.
 *
 * The values must match those used in UI API responses.
 */

/** Layout types */
export const Layout = {
    FULL: 'Full',
    COMPACT: 'Compact',
    // TODO - evaluate other constants in LayoutType.java
};

export const Mode = {
    VIEW: 'View',
    EDIT: 'Edit',
    // TODO - CLONE: "CLONE"
};

/**
 * Field types.
 * source: TODO - add ui sdk java class
 */
export const FieldTypes = {
    ADDRESS: 'Address',
    BASE64: 'Base64',
    BOOLEAN: 'Boolean',
    COMPLEX_VALUE: 'ComplexValue',
    CURRENCY: 'Currency',
    DATE: 'Date',
    DATETIME: 'DateTime',
    DOUBLE: 'Double',
    RICH_TEXTAREA: 'RichTextArea',
    DECIMAL: 'Decimal',
    EMAIL: 'Email',
    ENCRYPTED_STRING: 'EncryptedString',
    INT: 'Int',
    LOCATION: 'Location',
    MULTI_PICKLIST: 'MultiPicklist',
    PLAIN_TEXTAREA: 'PlainTextArea',
    PERCENT: 'Percent',
    PHONE: 'Phone',
    PICKLIST: 'Picklist',
    REFERENCE: 'Reference',
    STRING: 'String',
    TEXT: 'Text',
    TEXTAREA: 'TextArea',
    TIME: 'Time',
    URL: 'Url',
    PERSON_NAME: 'PersonName',
    SWITCHABLE_PERSON_NAME: 'SwitchablePersonName',
};

/**
 * Localized field types.
 * source: com.force.util.soql.functions.SoqlFunctions.fieldSupportsToLabel(String, String)
 */
export const LocalizedFieldTypes = [
    FieldTypes.MULTI_PICKLIST,
    FieldTypes.PICKLIST,
    FieldTypes.CURRENCY,
    FieldTypes.DATE,
    FieldTypes.DATETIME,
];

/**
 * Formatted field types.
 * source: /ui-services-api/java/src/ui/services/api/soql/FormatFunctionHelper.java
 */
// TODO - populate this
export const FormattedFieldTypes = [];
