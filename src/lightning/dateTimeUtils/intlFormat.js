import DateTimeOptions from './dateTimeOptions';
import {
    formatDateUTC,
    getLocale,
    toOtherCalendar,
    syncUTCToWallTime,
} from './localizationService';

const dateTimeFormatInstancesCache = {};
const POSSIBLE_OPTS = {
    weekday: true,
    era: true,
    year: true,
    month: true,
    day: true,
    hour: true,
    minute: true,
    second: true,
    timeZone: true,
    timeZoneName: true,
    hour12: true,
};

function getOptionsUniqueKey(options) {
    return Object.keys(options)
        .sort()
        .reduce((prev, optionName) => {
            if (POSSIBLE_OPTS[optionName]) {
                return prev + optionName + options[optionName] + '';
            }
            return prev;
        }, '');
}

function getFromCache(options) {
    const optionsUniqueKey = getOptionsUniqueKey(options);
    let formatInstance = dateTimeFormatInstancesCache[optionsUniqueKey];

    if (!formatInstance) {
        formatInstance = new Intl.DateTimeFormat(getLocaleTag(), options);
        dateTimeFormatInstancesCache[optionsUniqueKey] = formatInstance;
    }

    return formatInstance;
}

function convertAndFormatDate(date, format, timeZone) {
    const translatedDate = toOtherCalendar(date);
    const converted = syncUTCToWallTime(translatedDate, timeZone);
    return formatDateUTC(converted, format);
}

function getLocaleTag() {
    const locale = getLocale();
    const localeLanguage = locale.userLocaleLang;
    const localeCountry = locale.userLocaleCountry;

    if (!localeLanguage) {
        return locale.langLocale.replace(/_/g, '-');
    }

    return localeLanguage + (localeCountry ? '-' + localeCountry : '');
}

function isDate(value) {
    return (
        Object.prototype.toString.call(value) === '[object Date]' &&
        !isNaN(value.getTime())
    );
}

function toDate(value) {
    let dateObj = value;
    if (
        !isDate(value) &&
        (typeof value === 'string' || typeof value === 'number')
    ) {
        dateObj = new Date(
            isFinite(value) ? parseInt(value, 10) : Date.parse(value)
        );
    }
    return dateObj;
}

const isTimeZonesSupported = (function() {
    try {
        // IE11 only supports the UTC time zone and throws when given anything else
        // eslint-disable-next-line new-cap
        Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles' });
    } catch (err) {
        return false;
    }
    return true;
})();

function dateTimeFormatFallback(dto) {
    // localization service will default to $Locale.dateFormat when no format is provided
    const format = dto.hasFormattingOptions() ? dto.getSkeleton() : null;
    const { timeZone } = dto.options;
    return {
        format: value => {
            const dateObj = toDate(value);
            if (isDate(dateObj)) {
                if (timeZone === 'UTC') {
                    dateObj.setTime(
                        dateObj.getTime() +
                            dateObj.getTimezoneOffset() * 60 * 1000
                    );
                }
                return convertAndFormatDate(dateObj, format, timeZone);
            }
            return '';
        },
    };
}

export function dateTimeFormat(opts) {
    const options = opts || {};
    const dto = new DateTimeOptions(options);

    if (
        !('Intl' in window) ||
        (!dto.hasFormattingOptions() || !isTimeZonesSupported)
    ) {
        return dateTimeFormatFallback(dto);
    }

    return {
        format: value => {
            const dtf = getFromCache(options);
            return dtf.format(toDate(value));
        },
    };
}
