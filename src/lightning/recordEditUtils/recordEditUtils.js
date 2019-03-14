/**
 * This file exists just to reduce code duplication
 * between the aura and raptor implementations
 * of record-edit-form
 */
import {
    updateRecord,
    createRecord,
    generateRecordInputForCreate,
    generateRecordInputForUpdate,
    createRecordInputFilteredByEditedFields,
} from 'lightning/uiRecordApi';

export {
    getPicklistDetails,
    filterByPicklistsInForm,
    formHasPicklists,
} from './picklists';

const OUTPUT_FIELD_TAGNAME = 'LIGHTNING-OUTPUT-FIELD';

function normalizeRecord(newRecord) {
    const normalizedRecord = Object.assign({}, newRecord);
    normalizedRecord.fields = {};
    Object.keys(newRecord.fields).forEach(field => {
        if (
            newRecord.fields[field] &&
            typeof newRecord.fields[field] === 'object'
        ) {
            normalizedRecord.fields[field] = newRecord.fields[field];
        } else {
            normalizedRecord.fields[field] = { value: newRecord.fields[field] };
        }
    });

    return normalizedRecord;
}

export async function ldsUpdateRecord(newRecord, originalRecord, objectInfo) {
    newRecord.id = originalRecord.id;
    newRecord.apiName = null;
    const newRecordEdit = generateRecordInputForUpdate(
        normalizeRecord(newRecord),
        objectInfo
    );
    const recordToSave = createRecordInputFilteredByEditedFields(
        newRecordEdit,
        originalRecord
    );
    return updateRecord(recordToSave);
}

export async function ldsCreateRecord(newRecord, objectInfo) {
    const normalizedRecord = normalizeRecord(newRecord);
    const recordToSave = generateRecordInputForCreate(
        normalizedRecord,
        objectInfo
    );
    return createRecord(recordToSave);
}

/**
 *
 * Create or edit a record. If no original record is
 * specified create the record, otherwise update it
 * @param {recordInput} newRecord the dirty fields to change
 * @param {recordInput} originalRecord the original record
 * @param {objectInfo} objectInfo info about the object
 * @returns {Promise} Resovled when record is created or saved
 */
export async function createOrSaveRecord(
    newRecord,
    originalRecord,
    objectInfo
) {
    if (originalRecord) {
        return ldsUpdateRecord(newRecord, originalRecord, objectInfo);
    }

    return ldsCreateRecord(newRecord, objectInfo);
}

/**
 * Returns a map of fieldNames : values
 * for an *array* of inputField components
 *
 * @param {lightningInputField[]} inputFields components
 * @returns {Object} map of fieldNames: values
 */
export function getFormValues(inputFields) {
    const values = {};
    inputFields.forEach(field => {
        if (field.readonly) {
            return;
        }
        // compound fields need to be flattened
        if (field.value && typeof field.value === 'object') {
            // geoloc compounds have weird field names
            if (field.value.longitude) {
                const prefix = field.fieldName.slice(
                    0,
                    field.fieldName.indexOf('__c')
                );
                values[prefix + '__Longitude__s'] = field.value.longitude;

                values[prefix + '__Latitude__s'] = field.value.latitude;
            } else {
                Object.assign(values, field.value);
            }
        } else {
            values[field.fieldName] = field.value;
        }
    });
    return values;
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
    const parsed = parseError(err);
    return new CustomEvent('error', {
        detail: parsed,
    });
}

/**
 * Creates a list of fully qualified
 * fieldnames with no duplicates
 */
class FieldSet {
    /**
     *
     * @param {String} objectApiName The object name
     */
    constructor(objectApiName) {
        this._set = new Set();
        this._apiName = objectApiName;
    }

    set objectApiName(objectApiName) {
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
 *
 * Calls `reportValidity` on every input field, returns true
 * if all fields are valid, false if any are not
 *
 * @param {Array} inputFields list of input fields to validate
 * @returns {Boolean} true if all fields are false, true otherwise
 */
export function validateForm(inputFields) {
    let isValid = true;
    inputFields.forEach(cmp => {
        // output fields are always valid, the second clause is defensive in case
        // somebody passes the wrong type of component in this array
        if (cmp.tagName === OUTPUT_FIELD_TAGNAME || !cmp.reportValidity) {
            return;
        }
        if (!cmp.reportValidity()) {
            isValid = false;
        }
    });
    return isValid;
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
