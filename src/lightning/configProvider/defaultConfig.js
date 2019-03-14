/* eslint eslint-comments/no-use: off */
/* eslint-disable lwc/no-aura */
const FUNCTION = 'function';

function getConfigFromAura($A) {
    return {
        getFormFactor() {
            return $A.get('$Browser.formFactor');
        },
        getLocale() {
            return $A.get('$Locale');
        },
        getLocalizationService() {
            return $A.localizationService;
        },
        getPathPrefix() {
            return $A.getContext().getPathPrefix();
        },
        getToken(name) {
            return $A.getToken(name);
        },
        sanitizeDOM(dirty, config) {
            return $A.util.sanitizeDOM(dirty, config);
        },
    };
}

function createStandAloneConfig() {
    return {
        getFormFactor() {
            return 'DESKTOP';
        },
        getLocale() {
            return {
                userLocaleLang: 'en',
                userLocaleCountry: 'US',
                language: 'en',
                country: 'US',
                variant: '',
                langLocale: 'en_US',
                nameOfMonths: [
                    {
                        fullName: 'January',
                        shortName: 'Jan',
                    },
                    {
                        fullName: 'February',
                        shortName: 'Feb',
                    },
                    {
                        fullName: 'March',
                        shortName: 'Mar',
                    },
                    {
                        fullName: 'April',
                        shortName: 'Apr',
                    },
                    {
                        fullName: 'May',
                        shortName: 'May',
                    },
                    {
                        fullName: 'June',
                        shortName: 'Jun',
                    },
                    {
                        fullName: 'July',
                        shortName: 'Jul',
                    },
                    {
                        fullName: 'August',
                        shortName: 'Aug',
                    },
                    {
                        fullName: 'September',
                        shortName: 'Sep',
                    },
                    {
                        fullName: 'October',
                        shortName: 'Oct',
                    },
                    {
                        fullName: 'November',
                        shortName: 'Nov',
                    },
                    {
                        fullName: 'December',
                        shortName: 'Dec',
                    },
                    {
                        fullName: '',
                        shortName: '',
                    },
                ],
                nameOfWeekdays: [
                    {
                        fullName: 'Sunday',
                        shortName: 'SUN',
                    },
                    {
                        fullName: 'Monday',
                        shortName: 'MON',
                    },
                    {
                        fullName: 'Tuesday',
                        shortName: 'TUE',
                    },
                    {
                        fullName: 'Wednesday',
                        shortName: 'WED',
                    },
                    {
                        fullName: 'Thursday',
                        shortName: 'THU',
                    },
                    {
                        fullName: 'Friday',
                        shortName: 'FRI',
                    },
                    {
                        fullName: 'Saturday',
                        shortName: 'SAT',
                    },
                ],
                labelForToday: 'Today',
                firstDayOfWeek: 1,
                timezone: 'America/Los_Angeles',
                isEasternNameStyle: false,
                dateFormat: 'MMM d, yyyy',
                datetimeFormat: 'MMM d, yyyy h:mm:ss a',
                timeFormat: 'h:mm:ss a',
                numberFormat: '#,##0.###',
                decimal: '.',
                grouping: ',',
                zero: '0',
                percentFormat: '#,##0%',
                currencyFormat: '¤ #,##0.00;¤-#,##0.00',
                currencyCode: 'USD',
                currency: '$',
                dir: 'ltr',
            };
        },
        getLocalizationService() {
            const pad = n => {
                return n < 10 ? '0' + n : n;
            };
            const doublePad = n => {
                return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
            };
            return {
                parseDateTime(dateString) {
                    if (!dateString) {
                        return null;
                    }
                    return new Date(dateString);
                },
                parseDateTimeUTC(dateString) {
                    if (!dateString) {
                        return null;
                    }
                    return new Date(dateString);
                },
                parseDateTimeISO8601(dateString) {
                    // If input is time only
                    if (!dateString.includes('-')) {
                        dateString = '2014-03-20T' + dateString;
                    }
                    return new Date(dateString);
                },
                formatDate(date) {
                    return date.toISOString().split('T')[0];
                },
                formatDateUTC(date) {
                    return this.formatDate(date);
                },
                formatTime(date) {
                    return `${pad(date.getHours())}:${pad(
                        date.getMinutes()
                    )}:${pad(date.getSeconds())}.${doublePad(
                        date.getMilliseconds()
                    )}`;
                },
                isBefore(date1, date2) {
                    const hasValidArguments =
                        date1 &&
                        date2 &&
                        typeof date1.getTime === FUNCTION &&
                        typeof date2.getTime === FUNCTION;

                    return (
                        hasValidArguments && date1.getTime() < date2.getTime()
                    );
                },
                isAfter(date1, date2) {
                    const hasValidArguments =
                        date1 &&
                        date2 &&
                        typeof date1.getTime === FUNCTION &&
                        typeof date2.getTime === FUNCTION;

                    return (
                        hasValidArguments && date1.getTime() > date2.getTime()
                    );
                },
                isSame(date1, date2) {
                    const hasValidArguments =
                        date1 &&
                        date2 &&
                        typeof date1.getTime === FUNCTION &&
                        typeof date2.getTime === FUNCTION;

                    return (
                        hasValidArguments && date1.getTime() === date2.getTime()
                    );
                },
                getToday(timezone, callback) {
                    return callback(new Date().toISOString().split('T')[0]);
                },
                UTCToWallTime(date, timezone, callback) {
                    callback(date);
                },
                WallTimeToUTC(date, timezone, callback) {
                    callback(date);
                },
                translateToOtherCalendar(date) {
                    return date;
                },
                formatDateTimeUTC(date) {
                    return date;
                },
                translateFromOtherCalendar(date) {
                    return date;
                },
            };
        },
        getPathPrefix() {
            return ''; // @sfdc.playground path-prefix DO-NOT-REMOVE-COMMENT
        },
        getToken(name) {
            return name; // @sfdc.playground token DO-NOT-REMOVE-COMMENT
        },
        // not defaulting `sanitizeDOM` dependency since we dont have a good alternative for now.
    };
}

export function getDefaultConfig() {
    return window.$A !== undefined && window.$A.localizationService
        ? getConfigFromAura(window.$A)
        : createStandAloneConfig();
}
