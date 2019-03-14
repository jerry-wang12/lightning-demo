import { getPicklistValuesByRecordTypeObservable } from 'force/lds';

import { Fields, parseError } from 'lightning/fieldUtils';

const MASTER_RECORD_TYPE_ID = '012000000000000AAA';

export function getPicklistDetails(record, apiName, recordTypeId, fields) {
    const objectInfo = record.objectInfo;
    const recordTypeIdToUse = getRecordTypeId(objectInfo, recordTypeId);

    return getPicklistValues(apiName, recordTypeIdToUse, objectInfo, fields);
}

export function filterByPicklistsInForm(objectInfo, picklistValues, fields) {
    const picklistsInForm = getPicklistFields(objectInfo, fields);
    return filterPicklistValues(picklistValues, picklistsInForm);
}

export function formHasPicklists(objectInfo, fields) {
    return getPicklistFields(objectInfo, fields).size > 0;
}

function getPicklistFields(objectInfo, fields) {
    const picklistFields = new Set();
    for (const fieldName in objectInfo.fields) {
        if (objectInfo.fields.hasOwnProperty(fieldName)) {
            const field = objectInfo.fields[fieldName];
            if (
                field.dataType === Fields.PICKLIST ||
                field.dataType === Fields.MULTI_PICKLIST
            ) {
                // need to check the parent for compound fields
                const fieldNameToCheck = field.compoundFieldName || fieldName;
                if (
                    fields.includes(`${objectInfo.apiName}.${fieldNameToCheck}`)
                ) {
                    picklistFields.add(field.apiName);
                }
            }
        }
    }

    return picklistFields;
}

function getPicklistValues(objectApiName, recordTypeId, objectInfo, fields) {
    const observable = getPicklistValuesByRecordTypeObservable(
        objectApiName,
        recordTypeId
    );

    return new Promise(resolve => {
        observable.subscribe({
            next: data => {
                if (data && data.picklistFieldValues) {
                    const filteredValues = filterByPicklistsInForm(
                        objectInfo,
                        data.picklistFieldValues,
                        fields
                    );

                    resolve(filteredValues);
                } else {
                    resolve({});
                }
            },
            error: error => {
                const { message } = parseError(error);
                throw new Error(message);
            },
        });
    });
}

function filterPicklistValues(picklistsByRecordType, picklistsInForm) {
    return Object.keys(picklistsByRecordType)
        .filter(key => picklistsInForm.has(key))
        .reduce((obj, key) => {
            return {
                ...obj,
                [key]: picklistsByRecordType[key],
            };
        }, {});
}

function getRecordTypeId(objectInfo, recordTypeId) {
    if (recordTypeId === undefined) {
        return objectInfo.defaultRecordTypeId || MASTER_RECORD_TYPE_ID;
    }
    return recordTypeId;
}
