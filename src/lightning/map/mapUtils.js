import { normalizeString } from 'lightning/utilsPrivate';

/**
 * Build a human readable string of address components.
 * e.g. "1 Market St, San Francisco CA"
 * @param {Object} coordinate - either a Latitude, Longitude pair or address components.
 * @returns {String} - formatted address.
 */
export function formatAddress(coordinate) {
    let formattedAddress;

    if (coordinate.Latitude && coordinate.Longitude && !coordinate.Street) {
        formattedAddress = `${coordinate.Latitude}, ${coordinate.Longitude}`;
    } else {
        formattedAddress = [
            coordinate.Street,
            coordinate.City,
            coordinate.State,
        ]
            .filter(value => value) // remove falsy values
            .join(', ');
    }

    return formattedAddress;
}

/**
 * Convert a passed-in string to Title Case.
 * e.g. hello world => Hello World
 * @param {String} string  - a string
 * @returns {String} titleCasedString - A String In Title Case Format
 */
export function titleCase(string) {
    return normalizeString(string)
        .split(' ')
        .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(' ');
}
