import {
    getLocale as localeProvider,
    getLocalizationService,
} from 'lightning/configProvider';
import { isValidISOTimeString } from './iso8601';

export function getLocale() {
    return localeProvider();
}

export function isBefore(date1, date2, unit) {
    return getLocalizationService().isBefore(date1, date2, unit);
}

export function isAfter(date1, date2, unit) {
    return getLocalizationService().isAfter(date1, date2, unit);
}

export function isSame(date1, date2) {
    return getLocalizationService().isSame(date1, date2, 'day');
}

export function formatDateTimeUTC(date) {
    return getLocalizationService().formatDateTimeUTC(date);
}

export function formatDate(dateString, format, locale) {
    return getLocalizationService().formatDate(dateString, format, locale);
}

export function formatDateUTC(dateString, format, locale) {
    return getLocalizationService().formatDateUTC(dateString, format, locale);
}

export function formatTime(timeString, format) {
    return getLocalizationService().formatTime(timeString, format);
}

export function parseDateTimeUTC(dateTimeString) {
    return getLocalizationService().parseDateTimeUTC(dateTimeString);
}

export function parseDateTime(dateTimeString, format, strictMode) {
    return getLocalizationService().parseDateTime(
        dateTimeString,
        format,
        strictMode
    );
}

export function syncUTCToWallTime(date, timeZone) {
    let converted = null;

    // eslint-disable-next-line new-cap
    getLocalizationService().UTCToWallTime(date, timeZone, result => {
        converted = result;
    });
    return converted;
}

export function syncWallTimeToUTC(date, timeZone) {
    let converted = null;

    // eslint-disable-next-line new-cap
    getLocalizationService().WallTimeToUTC(date, timeZone, result => {
        converted = result;
    });
    return converted;
}

export function toOtherCalendar(date) {
    return getLocalizationService().translateToOtherCalendar(date);
}

export function fromOtherCalendar(date) {
    return getLocalizationService().translateFromOtherCalendar(date);
}

// This belongs to localization service; i.e. getLocalizationService().parseTime()
// Should be removed after it's been added to the localization service
export function parseTime(timeString, format, strictParsing) {
    if (!timeString) {
        return null;
    }

    if (!format) {
        if (!isValidISOTimeString(timeString)) {
            return null;
        }

        return getLocalizationService().parseDateTimeISO8601(timeString);
    }

    const langLocale = getLocale().langLocale;
    const parseString = timeString.replace(/(\d)([AaPp][Mm])/g, '$1 $2');

    // Modifying the time string so that strict parsing doesn't break on minor deviations
    const parseFormat = format
        .replace(/(\b|[^h])h{2}(?!h)/g, '$1h')
        .replace(/(\b|[^H])H{2}(?!H)/g, '$1H')
        .replace(/(\b|[^m])m{2}(?!m)/g, '$1m')
        .replace(/\s*A/g, ' A')
        .trim();

    const acceptableFormats = [parseFormat];
    // We want to be lenient and accept input values with seconds or milliseconds precision.
    // So even though we may display the time as 10:23 AM, we would accept input values like 10:23:30.555 AM.
    acceptableFormats.push(
        parseFormat.replace('m', 'm:s'),
        parseFormat.replace('m', 'm:s.S'),
        parseFormat.replace('m', 'm:s.SS'),
        parseFormat.replace('m', 'm:s.SSS')
    );

    for (let i = 0; i < acceptableFormats.length; i++) {
        const time = getLocalizationService().parseDateTime(
            parseString,
            acceptableFormats[i],
            langLocale,
            strictParsing
        );

        if (time) {
            return time;
        }
    }

    return null;
}
