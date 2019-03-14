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
    BASE64: 'Base64',
    BOOLEAN: 'Boolean',
    COMPLEX_VALUE: 'ComplexValue',
    CURRENCY: 'Currency',
    DATE: 'Date',
    DATETIME: 'DateTime',
    DECIMAL: 'Decimal',
    DOUBLE: 'Double',
    EMAIL: 'Email',
    ENCRYPTED_STRING: 'EncryptedString',
    INT: 'Int',
    LOCATION: 'Location',
    MULTI_PICKLIST: 'MultiPicklist',
    PERCENT: 'Percent',
    PHONE: 'Phone',
    PICKLIST: 'Picklist',
    PLAIN_TEXTAREA: 'PlainTextArea',
    REFERENCE: 'Reference',
    RICH_TEXTAREA: 'RichTextArea',
    STRING: 'String',
    TEXT: 'Text',
    TEXTAREA: 'TextArea',
    TIME: 'Time',
    URL: 'Url',
};

/**
 * Localized field types.
 * source: com.force.util.soql.functions.SoqlFunctions.fieldSupportsToLabel(String, String)
 */
export const LocalizedFieldTypes = [
    FieldTypes.MULTI_PICKLIST,
    FieldTypes.PICKLIST,
    FieldTypes.CURRENCY,
];

/**
 * Formatted field types.
 * source: /ui-services-api/java/src/ui/services/api/soql/FormatFunctionHelper.java
 */
// TODO - populate this
export const FormattedFieldTypes = [];
