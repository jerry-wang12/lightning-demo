/**
 * Given a record, field, and objectInfos, returns a map of field attributes.
 *
 * Returned schema -
 * {
 *      inlineHelpText: {String},
 *      isRequired: {Boolean},
 * }
 *
 * @param {Object} record - A record representation.
 * @param {String} fieldName - A field api name.
 * @param {Object} objectInfos - A map of objectInfos.
 * @return {Object} A map of field attributes.
 */
function getFieldProperties(record, fieldName, objectInfos) {
    if (
        Object.keys(record || {}).length === 0 ||
        !fieldName ||
        Object.keys(objectInfos || {}).length === 0
    ) {
        return {
            fieldLevelHelp: null,
            isRequired: false,
        };
    }

    const objectApiName = record.apiName;
    const objectInfo = objectInfos[objectApiName];
    if (!objectInfo) {
        throw new Error(`ObjectInfo [${objectApiName}] was not found`);
    }
    const fieldInfo = objectInfo.fields[fieldName];
    if (!fieldInfo) {
        throw new Error(`Field [${fieldName}] was not found`);
    }
    return {
        fieldLevelHelp: fieldInfo.inlineHelpText,
        isRequired: fieldInfo.required,
    };
}

export { getFieldProperties };
