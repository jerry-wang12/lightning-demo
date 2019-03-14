import { LightningElement, api } from 'lwc';
import {
    isValidISODateTimeString,
    dateTimeFormat,
} from 'lightning/dateTimeUtils';

/**
 * Displays formatted date and time.
 */
export default class LightningFormattedDateTime extends LightningElement {
    /**
     * The value to be formatted, which can be a Date object, timestamp, or an ISO8601 formatted string.
     * @type {object}
     *
     */
    @api value;

    /**
     * Determines whether time is displayed as 12-hour. If false, time displays as 24-hour. The default setting is determined by the user's locale.
     * @type {boolean}
     *
     */
    @api hour12;

    /**
     * Specifies how to display the day of the week. Allowed values are narrow, short, or long.
     * @type {string}
     *
     */
    @api weekday;

    /**
     * Allowed values are narrow, short, or long.
     * @type {string}
     *
     */
    @api era;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api year;

    /**
     * Allowed values are 2-digit, narrow, short, or long.
     * @type {string}
     *
     */
    @api month;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api day;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api hour;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api minute;

    /**
     * Allowed values are numeric or 2-digit.
     * @type {string}
     *
     */
    @api second;

    /**
     * Allowed values are short or long. For example, the Pacific time zone would display as 'PST'
     * if you specify 'short', or 'Pacific Standard Time' if you specify 'long.'
     * @type {string}
     *
     */
    @api timeZoneName;

    /**
     * The time zone to display. Use this attribute only if you want to override the default, which is the runtime's
     * time zone. Specify a time zone listed in the IANA time zone database (https://www.iana.org/time-zones). For example, set
     * the value to 'Pacific/Honolulu' to display Hawaii time. The short code UTC is also accepted.
     * @type {string}
     *
     */
    @api timeZone;

    get formattedValue() {
        return this.computeFormattedValue();
    }

    computeFormattedValue() {
        const { value } = this;
        if (!this.isEmpty(value) && this.isValid(value)) {
            const formatted = dateTimeFormat(this.getOptions()).format(value);
            if (formatted) {
                return formatted;
            }
        }
        this.printError(value);
        return '';
    }

    isEmpty(value) {
        return value === undefined || value === null || value === '';
    }

    isValid(value) {
        return isFinite(value) || isValidISODateTimeString(value);
    }

    printError(value) {
        const errorMsg =
            `<lightning-formatted-date-time> The value attribute accepts either a Date object, a timestamp, or a valid ISO8601 formatted string ` +
            `with timezone offset. but we are getting the ${typeof value} value "${value}" instead.`;
        console.warn(errorMsg); // eslint-disable-line no-console
    }

    getOptions() {
        return {
            hour12: this.hour12,
            weekday: this.weekday,
            era: this.era,
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            timeZoneName: this.timeZoneName,
            timeZone: this.timeZone,
        };
    }
}
