import { FieldTypes, LocalizedFieldTypes } from './constants';

export const Fields = FieldTypes;

// TODO: Review this file to convert from POC to deliverable

/**
 * Get a UiField from a field on a record.
 * objectInfo and objectInfos are optional but at least one must be present
 * @param {string} field the field identifier (SOQL syntax)
 * @param {object} record the record
 * @param {object} objectInfo a single object info defining the field
 * @return {object} a UiField representing the field.
 */

const getCompoundValue = (field, record, fieldInfo) => {
    if (FieldTypes.LOCATION === fieldInfo.dataType) {
        const prefix = field.slice(0, field.indexOf('__c'));
        const longitude = record.fields[prefix + '__Longitude__s'].value;
        const latitude = record.fields[prefix + '__Latitude__s'].value;

        return { longitude, latitude };
    }

    return {};
};

export const getUiField = (field, record, objectInfo) => {
    const fieldInfo = objectInfo.fields[field];

    if (!fieldInfo) {
        throw new Error(`unknown field ${field}`);
    }
    // TODO support for spanning fields
    if (fieldInfo.reference) {
        const relationshipName = fieldInfo.relationshipName;
        // TODO handle multiple referenceToInfos
        const relationshipNameFields = fieldInfo.referenceToInfos[0].nameFields;
        const relationship = record.fields[relationshipName];

        // absence of the value on the record indicates the relationship doesn't exist
        if (!relationship.value) {
            return {
                isEmpty: true,
                label: fieldInfo.label,
            };
        }

        // TODO should references:
        // a. support localized fields and thus return a value to complement their displayValue?
        // b. have a proper type field based on the related object's name field(s)?
        const referenceField = relationship.value.fields;
        const displayValue = relationshipNameFields
            .reduce((accumulator, nameField) => {
                const thisField = referenceField[nameField];
                if (thisField) {
                    return accumulator + ' ' + thisField.value;
                }
                return accumulator;
            }, '')
            .trim();
        return {
            isReference: true,
            type: FieldTypes.STRING,
            label: fieldInfo.label,
            referenceId: referenceField.Id.value,
            displayValue,
        };
    }

    const value = fieldInfo.compound
        ? getCompoundValue(field, record, fieldInfo)
        : record.fields[field].value;

    // TODO - handle formatting
    // ui sdk formats these field types: currency, date, datetime, time (/ui-services-api/java/src/ui/services/api/soql/FormatFunctionHelper.java
    // ui sdk localizes based on com.force.util.soql.functions.SoqlFunctions.fieldSupportsToLabel(String, String)
    // thomas will expose this in objectInfo but until then i can pivot on that logic
    // - if [currency date datetime time] use value
    // - else if diplayValue is present use it
    // - else use value
    const result = {
        type: fieldInfo.dataType,
        extraTypeInfo: fieldInfo.extraTypeInfo,
        label: fieldInfo.label,
        scale: fieldInfo.scale,
        htmlFormatted: fieldInfo.htmlFormatted,
        value,
    };

    // provide the display value for localizable field types
    const includeDisplayValue = LocalizedFieldTypes.includes(
        fieldInfo.dataType
    );
    if (includeDisplayValue) {
        result.displayValue = record.fields[field].displayValue;
    }
    return result;
};

export const getUiFields = (fields, record, objectInfos) => {
    const fieldValues = fields.map(field =>
        getUiField(field, record, objectInfos)
    );
    return fieldValues;
};
