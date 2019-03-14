import {
    STANDARD_TIME_FORMAT,
    normalizeISODate,
    normalizeISOTime,
    normalizeISODateTime,
    normalizeFormattedDateTime,
} from 'lightning/dateTimeUtils';

export function normalizeInput(value) {
    if (typeof value === 'number' || typeof value === 'string') {
        return value;
    }
    return '';
}

export function normalizeDate(value) {
    return normalizeISODate(value).isoValue || '';
}

export function normalizeTime(value) {
    return normalizeISOTime(value, STANDARD_TIME_FORMAT).isoValue || '';
}

// Converts value to the user's timezone and formats it in a way that will be accepted by the input
export function normalizeUTCDateTime(value, timezone) {
    return normalizeISODateTime(value, timezone).isoValue || '';
}

// parses the input value and converts it back to UTC from the user's timezone
export function normalizeDateTimeToUTC(value, timezone) {
    return normalizeFormattedDateTime(value, timezone) || '';
}
