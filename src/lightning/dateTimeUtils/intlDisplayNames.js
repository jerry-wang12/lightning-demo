import { getLocale } from 'lightning/configProvider';

const FALLBACK_LOCALE = 'en-us';
const symbolsCache = {};

// Copied over from auraLocalizationService: override for locales which are not identified by browsers
const localeOverrides = {
    no_NO: 'nb', // eslint-disable-line camelcase
    tl_PH: 'fil', // eslint-disable-line camelcase
    sh_BA: 'hr', // eslint-disable-line camelcase
    sh_ME: 'hr', // eslint-disable-line camelcase
    sh_CS: 'hr', // eslint-disable-line camelcase
};

export function getNameOfWeekdays() {
    const locale = getNormalizedLocale();
    const localeCache = symbolsCache[locale];

    if (localeCache && localeCache.weekdays) {
        return localeCache.weekdays;
    }

    const locales = [locale, FALLBACK_LOCALE];
    const fullNameFormatter = new Intl.DateTimeFormat(locales, {
        weekday: 'long',
        timeZone: 'UTC',
    });
    const shortNameFormatter = new Intl.DateTimeFormat(locales, {
        weekday: 'short',
        timeZone: 'UTC',
    });
    const weekdays = [];

    for (let i = 0; i <= 6; i++) {
        // (1970, 0, 4) corresponds to a sunday.
        const date = new Date(Date.UTC(1970, 0, 4 + i));
        weekdays.push({
            fullName: format(fullNameFormatter, date),
            shortName: format(shortNameFormatter, date),
        });
    }

    if (!symbolsCache[locale]) {
        symbolsCache[locale] = {};
    }
    symbolsCache[locale].weekdays = weekdays;

    return weekdays;
}

export function getMonthNames() {
    const locale = getNormalizedLocale();
    const localeCache = symbolsCache[locale];

    if (localeCache && localeCache.months) {
        return localeCache.months;
    }

    const locales = [locale, FALLBACK_LOCALE];
    const monthNameFormatter = new Intl.DateTimeFormat(locales, {
        month: 'long',
    });
    const months = [];

    for (let i = 0; i <= 11; i++) {
        const date = new Date(1970, i, 4);
        months.push({
            // we currently only need the fullName
            fullName: format(monthNameFormatter, date),
        });
    }

    if (!symbolsCache[locale]) {
        symbolsCache[locale] = {};
    }
    symbolsCache[locale].months = months;

    return months;
}

function format(dateTimeFormat, date) {
    const formattedDate = dateTimeFormat.format(date);
    return removeIE11Markers(formattedDate);
}

function removeIE11Markers(formattedString) {
    // IE11 adds LTR / RTL mark in the formatted date time string
    return formattedString.replace(/[\u200E\u200F]/g, '');
}

function getNormalizedLocale() {
    const locale = getLocale().langLocale;
    if (locale) {
        return (
            localeOverrides[locale] || locale.toLowerCase().replace('_', '-')
        );
    }
    return FALLBACK_LOCALE;
}
