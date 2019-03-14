/**
 * It creates a row key generator based on the keyField passed by the consumer
 * if the keyField does not point to a value row object passed in computeUniqueRowKey
 * it fallback to a generated key using indexes
 *
 * @param {String} keyField  - keyField provided by the consumer
 * @returns {*} - Object with a computeUniqueRowKey method
 */
export const createRowKeysGenerator = function(keyField) {
    let index = 0;
    return {
        computeUniqueRowKey(row) {
            if (row[keyField]) {
                return row[keyField];
            }
            return `row-${index++}`;
        },
    };
};

/**
 * It generate a unique column key value.
 *
 * @param {object} columnMetadata - the object for an specific column metadata
 * @param {int} index - optionally, the index of the column.
 * @returns {string} It generate the column key value based on the column field name and type.
 */
export const generateColKeyValue = function(columnMetadata, index) {
    const prefix = columnMetadata.fieldName || index;
    return `${prefix}-${columnMetadata.type}`;
};
