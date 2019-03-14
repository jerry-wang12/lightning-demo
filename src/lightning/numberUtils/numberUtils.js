/*
    Returns a number of decimal places
    ex:
        decimalPlaces('.05') -> 2
        decimalPlaces('.5') -> 1
        decimalPlaces('1') -> 0
        decimalPlaces('25e-100') -> 100
        decimalPlaces('2.5e-99') -> 100
        decimalPlaces('.5e1') -> 0
        decimalPlaces('.25e1') -> 1
*/
function decimalPlaces(num) {
    const match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
        return 0;
    }
    return Math.max(
        0,
        // Number of digits right of decimal point.
        (match[1] ? match[1].length : 0) -
            // Adjust for scientific notation.
            (match[2] ? +match[2] : 0)
    );
}

export default {
    decimalPlaces,
};
