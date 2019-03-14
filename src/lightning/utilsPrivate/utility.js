/**
 * Create a deep copy of an object or array
 * @param {object|array} o - item to be copied
 * @returns {object|array} copy of the item
 */
export function deepCopy(o) {
    let key, v;
    const output = Array.isArray(o) ? [] : {};
    for (key in o) {
        if (o.hasOwnProperty(key)) {
            v = o[key];
            output[key] = typeof v === 'object' ? deepCopy(v) : v;
        }
    }
    return output;
}

/**
 * Compare two arrays and return true if they are equal
 * @param {array} array1 - first array to compare
 * @param {array} array2 - second array to compare
 * @returns {boolean} if the arrays are identical
 */
export function arraysEqual(array1, array2) {
    // if either array is falsey, return false
    if (!array1 || !array2) {
        return false;
    }

    // if array lengths don't match, return false
    if (array1.length !== array2.length) {
        return false;
    }

    for (let index = 0; index < array1.length; index++) {
        // Check if we have nested arrays
        if (array1[index] instanceof Array && array2[index] instanceof Array) {
            // recurse into the nested arrays
            if (!arraysEqual(array1[index], array2[index])) {
                return false;
            }
        } else if (array1[index] !== array2[index]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }

    return true;
}
