import { LightningElement, track, api } from 'lwc';
import { normalizeISOTime } from 'lightning/dateTimeUtils';

/**
 * Displays a formatted time in user's locale format.
 */
export default class FormattedTime extends LightningElement {
    @track _formattedTimeValue = null;
    _inputValue = null;

    set value(newValue) {
        const normalizedValue = this.normalizeInputValue(newValue);
        if (normalizedValue !== this._inputValue) {
            const normalizedTime = normalizeISOTime(normalizedValue);

            this._inputValue = normalizedTime.isoValue;
            this._formattedTimeValue = normalizedTime.displayValue;
        }
    }

    /**
     * Time value to format.
     * @type {string}
     *
     */
    @api
    get value() {
        return this._inputValue;
    }

    get formattedTime() {
        return this._formattedTimeValue;
    }

    normalizeInputValue(value) {
        if (!value || value === '') {
            return null;
        }
        return value;
    }
}
