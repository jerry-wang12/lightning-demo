import { FieldTypes, LocalizedFieldTypes } from './constants';

export const Fields = FieldTypes;

const getCompoundValue = (field, record, fieldInfo, objectInfo) => {
    if (FieldTypes.LOCATION === fieldInfo.dataType) {
        const prefix = field.slice(0, field.indexOf('__c'));
        const longitude = record.fields[prefix + '__Longitude__s'].value;
        const latitude = record.fields[prefix + '__Latitude__s'].value;

        return { longitude, latitude };
    }

    // fields with no value, it must be derived from the constituant fields
    const compoundFields = getCompoundFields(field, record, objectInfo);
    const ret = {};
    compoundFields.forEach(childField => {
        if (record.fields[childField]) {
            ret[childField] = record.fields[childField].value;
        }
    });
    return ret;
};

/**
 * Given a record will determine if it is a PersonAccount or not
 * @param {Object} record the record to check
 *
 * @returns {boolean} true if the record is a personAccount
 */
export function isPersonAccount(record) {
    if (record.apiName !== 'Account' && record.apiName !== 'PersonAccount') {
        return false;
    }

    return record.fields.IsPersonAccount
        ? record.fields.IsPersonAccount.value
        : false;
}

/**
 * Finds the fields needed to complete the given relationships that are missing
 * from the record
 * @param {object} record Record object with the fields
 * @param {object} relationships Map of reference field names to an object
 *                          containing the name of the relationship field
 *                          and a list of nameFields
 * @return {array} A list of fields that are missing
 */
export function getMissingRelationshipFields(record, relationships) {
    const incompleteFields = Object.keys(relationships).filter(
        key => !record.fields[relationships[key].name]
    );

    // Map each incomplete field to an array of its qualified name fields,
    // then concat them into a single array of all the field names
    return Array.prototype.concat.apply(
        [],
        incompleteFields.map(key =>
            relationships[key].nameFields.map(
                nameField => relationships[key].name + '.' + nameField
            )
        )
    );
}

/**
 * Finds all reference relationships in the given objectInfo
 * @param {array} fields A list of unqualified field names
 * @param {object} objectInfo An objectInfo object
 * @return {object} A mapping of reference fields to an object containing
 *                  the name of the relationship field and a list of nameFields
 */
export function getReferenceRelationships(fields, objectInfo) {
    return fields
        .filter(
            field =>
                objectInfo.fields[field] && objectInfo.fields[field].reference
        )
        .reduce((relationships, field) => {
            const fieldInfo = objectInfo.fields[field];
            relationships[field] = {
                name: fieldInfo.relationshipName,
                nameFields: fieldInfo.referenceToInfos[0]
                    ? fieldInfo.referenceToInfos[0].nameFields
                    : [],
            };
            return relationships;
        }, {});
}
/**
/**
 *
 * @param {string} field the field identifier (SOQL syntax)
 * @param {object} record the record
 * @param {object} objectInfo a single object info defining the field
 * @return {array} a list of constituent fields
 */
export function getCompoundFields(field, record, objectInfo) {
    return Object.keys(objectInfo.fields).filter(key => {
        return (
            key !== field &&
            record.fields[key] &&
            objectInfo.fields[key].compoundFieldName === field
        );
    });
}

const getReferenceInfo = (record, fieldInfo) => {
    const relationshipName = fieldInfo.relationshipName;
    // TODO: handle multiple referenceToInfos
    const relationshipNameFields = fieldInfo.referenceToInfos[0].nameFields;
    const relationship = record.fields[relationshipName];

    if (!relationship || !relationship.value) {
        return { referenceId: null, displayValue: null };
    }

    // TODO: Should references support localized fields and thus return a value to complement their displayValue?
    const referenceField = relationship.value.fields;
    const displayValue =
        relationship.displayValue ||
        relationshipNameFields
            .reduce((acc, nameField) => {
                const thisField = referenceField[nameField];
                if (thisField) {
                    return acc + ' ' + thisField.value;
                }
                return acc;
            }, '')
            .trim();
    return {
        referenceId: referenceField.Id.value,
        displayValue,
    };
};

/**
 * Get a UiField from a field on a record.
 * objectInfo and objectInfos are optional but at least one must be present
 * @param {string} field the field identifier (SOQL syntax)
 * @param {object} record the record
 * @param {object} objectInfo a single object info defining the field
 * @return {array} a UiField representing the field.
 */
export const getUiField = (field, record, objectInfo) => {
    const fieldInfo = objectInfo.fields[field];
    if (!fieldInfo) {
        throw new Error(`Field [${field}] was not found`);
    }

    const personAccount = isPersonAccount(record);

    const value = isCompoundField(field, objectInfo, personAccount)
        ? getCompoundValue(field, record, fieldInfo, objectInfo)
        : record.fields[field] && record.fields[field].value;

    // TODO - handle formatting
    // ui sdk formats these field types: currency, date, datetime, time (/ui-services-api/java/src/ui/services/api/soql/FormatFunctionHelper.java
    // ui sdk localizes based on com.force.util.soql.functions.SoqlFunctions.fieldSupportsToLabel(String, String)
    // thomas will expose this in objectInfo but until then i can pivot on that logic
    // - if [currency date datetime time] use value
    // - else if diplayValue is present use it
    // - else use value
    let result = {
        type: fieldInfo.dataType,
        extraTypeInfo: fieldInfo.extraTypeInfo,
        label: fieldInfo.label,
        inlineHelpText: fieldInfo.inlineHelpText,
        value,
    };

    result = Object.assign(result, fieldInfo);

    if (fieldInfo.reference) {
        const referenceInfo = getReferenceInfo(record, fieldInfo);

        result.value = referenceInfo.referenceId;
        result.displayValue = referenceInfo.displayValue;
    } else {
        // provide the display value for localizable field types
        const includeDisplayValue = LocalizedFieldTypes.includes(
            fieldInfo.dataType
        );
        if (includeDisplayValue) {
            result.displayValue = record.fields[field].displayValue;
        }
    }
    return result;
};

export const getUiFields = (fields, record, objectInfos) => {
    const fieldValues = fields.map(field =>
        getUiField(field, record, objectInfos)
    );
    return fieldValues;
};

/**
 * Determine if any field in a list of fields
 * is updateable
 * @param {array} fields list of constituent fields
 * @param {object} record the record
 * @param {object} objectInfo object info
 *
 * @returns {Boolean} true if any of the fields are updateable, otherwise false
 */
export function compoundFieldIsUpdateable(fields, record, objectInfo) {
    // if any constituent field is updateable, the field is
    for (let i = 0; i < fields.length; i++) {
        if (objectInfo.fields[fields[i]].updateable) {
            return true;
        }
    }
    return false;
}

/**
 *
 * Determines if a field actually has contituent fields,
 * because some fields might identify themselves as compound
 * but without constituent fields we can't treat them as compound
 *
 * @param {string} field the field identifier (SOQL syntax)
 * @param {object} objectInfo a single object info defining the field
 * @param {boolean} personAccount if this object is a PersonAccount (Name is compound)
 *                                  https://help.salesforce.com/articleView?id=account_person.htm&type=5
 * @returns {boolean} true if the field is a compound field, false if it is not
 */
export function isCompoundField(field, objectInfo, personAccount = false) {
    const fieldInfo = objectInfo.fields[field];
    if (!fieldInfo) {
        // a field that does not exist is not compound
        // this is safety to prevent gacks and probably should not generally happen
        return false;
    }

    if (fieldInfo.compound === false) {
        return false;
    }

    const keys = Object.keys(objectInfo.fields);
    for (let i = 0; i < keys.length; i++) {
        if (
            keys[i] !== field &&
            objectInfo.fields[keys[i]].compoundFieldName === field
        ) {
            // special case for when person accounts are enabled, but this is not a personAccount. In this case
            // the Name field of an account looks like a compound field but is not.
            if (
                objectInfo.apiName === 'Account' &&
                objectInfo.fields[keys[i]].compoundFieldName === 'Name' &&
                !personAccount
            ) {
                return false;
            }

            return true;
        }
    }

    return false;
}

/**
 * Normalize the given error object.
 * @param  {Error | Object} err This could be a javascript Error or an error emitted from LDS (ErrorResponse).
 * @return {Object} An object with a string message and a string detail
 */
export function parseError(err) {
    let message = '',
        output = {},
        detail = '';

    if (err) {
        if (err.body && err.body.output) {
            // ErrorResponse with Record Output Error
            // https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_error_with_output.htm
            message = err.body.message;

            if (err.body.output.errors.length > 0) {
                detail = err.body.output.errors[0].message;
            }

            // output is part of the recordUi error response,
            // so we will include it.
            output = JSON.parse(JSON.stringify(err.body.output));
        } else if (Array.isArray(err.body) && err.body.length > 0) {
            // ErrorResponse with normal UIAPI error.
            message = err.body[0].message;
            detail = err.body[0].errorCode;
        } else if (err.body && err.body.message) {
            // ErrorResponse with body that has a message.
            message = err.body.message;
        } else if (err.body) {
            // ErrorResponse with unknown body.
            message = err.body;
        } else if (err.statusText) {
            // ErrorResponse with no body.
            message.err = err.statusText;
        } else if (err.message) {
            // Vanilla js error.
            message = err.message;
        } else {
            // Unknown error.
            message = err;
        }
    }

    return { message, detail, output };
}

export function createErrorEvent(err) {
    const { message, detail } = parseError(err);
    const error = new Error(message);
    return new ErrorEvent('error', {
        error,
        message,
        detail,
    });
}

/**
 * Creates a list of fully qualified
 * fieldnames with no duplicats
 */
class FieldSet {
    /**
     *
     * @param {String} objectApiName The object name
     */
    constructor(objectApiName) {
        this._set = new Set();
        if (typeof objectApiName !== 'string') {
            throw new Error('objectApiName must be a string');
        }
        this._apiName = objectApiName;
    }

    set objectApiName(objectApiName) {
        if (typeof objectApiName !== 'string') {
            throw new Error('objectApiName must be a string');
        }
        this._apiName = objectApiName;
    }

    /**
     * Add a single field
     * @param {String} val unqualified field name
     */
    add(val) {
        this._set.add(val);
    }

    /**
     * Add a list of fieldnames
     * @param {Array} arr Array of unqualified field names
     */
    concat(arr) {
        arr.forEach(item => {
            this.add(item);
        });
    }

    // using a method here rather than a getter
    // because this seemed clearer

    /**
     * @returns {Array} a list of fully qualified field names
     */
    getList() {
        const apiName = this._apiName;
        return [...this._set].map(field => {
            return `${apiName}.${field}`;
        });
    }

    /**
     * @returns {Array} a list of unqualified field names
     */
    getUnqualifiedList() {
        return [...this._set];
    }
}

/**
 * Convenience function because you can't use
 * Set() in aura directly, also this
 * puts the "qualification" of fields in one place
 *
 * @param {String} objectApiName An object api name (entity name) to qualify fields
 * @returns {FieldSet} Field set has one method: add() to add a fieldname and one attribute list,
 *                     which you can use to get the qualified list of api names (an array)
 */
export function getFieldSet(objectApiName) {
    return new FieldSet(objectApiName);
}

/**
 *
 * Converts a Salesforce layout  response into a list of fields.
 *
 * Rolls compound field constituents up to parent
 * https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_responses_record_layout.htm#ui_api_responses_record_layout
 * @param {Object} layout the layout response
 * @param {Object} objectInfo the objectInfo for the object
 * @returns {Array} the list of fields.
 */
export function getFieldsForLayout(layout, objectInfo) {
    const processedFieldNames = {};

    const fieldsAccumulator = (listToReduce, fieldsGetterFn) => {
        return listToReduce.reduce((fields, item) => {
            return fields.concat(fieldsGetterFn(item));
        }, []);
    };

    const getFieldsFromLayoutComponent = layoutComponent => {
        // normalize compound fields, de-dupe (dupes are just caused by compound fields)
        // this assumes that layoutItems only ever have more than one component if they are
        // a compound field
        let fieldName = layoutComponent.apiName;
        const fieldInfo = objectInfo.fields[layoutComponent.apiName];

        // checking for fieldInfo filters out layout items that aren't fields
        if (fieldInfo && fieldInfo.compoundFieldName) {
            fieldName = fieldInfo.compoundFieldName;
        }
        if (fieldInfo && !processedFieldNames[fieldName]) {
            processedFieldNames[fieldName] = true;
            return fieldName;
        }
        return []; // empty array so concat adds nothing
    };
    const getFieldsFromItem = item =>
        fieldsAccumulator(item.layoutComponents, getFieldsFromLayoutComponent);
    const getFieldsFromRow = row =>
        fieldsAccumulator(row.layoutItems, getFieldsFromItem);
    const getFieldsFromSection = section =>
        fieldsAccumulator(section.layoutRows, getFieldsFromRow);
    const getFieldsFromSections = sections =>
        fieldsAccumulator(sections, getFieldsFromSection);
    return getFieldsFromSections(layout.sections);
}
