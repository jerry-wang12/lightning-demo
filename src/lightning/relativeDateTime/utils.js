// eslint-disable-next-line lwc/no-aura-libs
import { relativeFormat } from 'lightning:IntlLibrary';

/**
 * Returns the number of milliseconds till the datetime formatted representation becomes invalid.
 * @param {Date|timestamp} datetime The date time to get the timeout units till its formatted value becomes invalid.
 * @returns {number} The number of milliseconds till the formatted value of this datetime becomes invalid.
 */
export function getTimeoutUnitsTillInvalid(datetime) {
    const now = Date.now();
    const time = new Date(datetime).getTime();
    const delta = Math.abs(time - now);

    const MINUTE = 1000 * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    if (delta < MINUTE) {
        // since MINUTE is the minimal unit in the specs
        return MINUTE;
    }

    if (delta < HOUR) {
        return MINUTE;
    }

    if (delta < DAY) {
        return HOUR;
    }

    // The maximum scheduled delay will be measured in days since the maximum
    // timer delay is less than the number of milliseconds in 25 days.
    return DAY;
}

/**
 * Returns an internationalized string representation of the relative date.
 * @param {Date|timestamp} date The date to be formatted
 * @returns {string} A formatted date according browser locale.
 */
export function getFormattedRelativeDate(date) {
    const isUndefined = date === undefined;
    const isNull = date === null;
    const isEmptyString = date === '';

    return isUndefined || isNull || isEmptyString
        ? ''
        : relativeFormat().format(date);
}
