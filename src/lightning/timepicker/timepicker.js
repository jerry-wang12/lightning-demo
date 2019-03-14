import labelInvalidDate from '@salesforce/label/LightningDateTimePicker.invalidDate';
import labelRangeOverflow from '@salesforce/label/LightningDateTimePicker.rangeOverflow';
import labelRangeUnderflow from '@salesforce/label/LightningDateTimePicker.rangeUnderflow';
import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, track, api } from 'lwc';
import { getTimeToHighlight } from './utils';
import { classSet } from 'lightning/utils';
import {
    getLocale,
    isBefore,
    isAfter,
    formatTime,
    parseTime,
    removeTimeZoneSuffix,
    normalizeISOTime,
    normalizeFormattedTime,
    STANDARD_TIME_FORMAT,
} from 'lightning/dateTimeUtils';
import { normalizeBoolean, synchronizeAttrs } from 'lightning/utilsPrivate';
import {
    getErrorMessage,
    buildSyntheticValidity,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow,
    rangeUnderflow: labelRangeUnderflow,
    required: labelRequired,
};

const STEP = 15; // in minutes

export default class LightningTimePicker extends LightningElement {
    @track _disabled = false;
    @track _required = false;
    @track _displayValue = null;
    @track _value = null;
    @track _items = [];
    @track _fieldLevelHelp;
    @track _variant = 'lookup';
    @track _mainInputId;
    @track _errorMessage;
    @track _readonly = true;
    @track _describedByElements = [];

    @api label;
    @api name;
    @api max;
    @api min;
    @api placeholder = '';

    @api ariaLabelledByElement;
    @api ariaControlsElement;
    @api ariaLabel;

    @api messageWhenValueMissing;
    @api messageWhenBadInput;
    @api messageWhenRangeOverflow;
    @api messageWhenRangeUnderflow;
    _ariaDescribedByElements;

    set ariaDescribedByElements(el) {
        if (Array.isArray(el)) {
            this._ariaDescribedByElements = el;
        } else {
            this.ariaDescribedByElements = [el];
        }
    }

    @api
    get ariaDescribedByElements() {
        return this._ariaDescribedByElements;
    }

    @api
    get value() {
        return this._value;
    }
    set value(newValue) {
        const normalizedValue = this.normalizeInputValue(newValue);
        if (normalizedValue !== this._value) {
            const normalizedTime = normalizeISOTime(
                normalizedValue,
                this.timeFormat
            );

            this._value = normalizedTime.isoValue;
            this._displayValue = normalizedTime.displayValue;
        }
    }

    @api
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    @api
    get readOnly() {
        return this._readonly;
    }
    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
        if (this._readonly) {
            this._variant = VARIANT.STANDARD;
        }
    }

    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
    }

    /**
     * The following will result in the value being invalid:
     * - Missing: if the value is missing when the input is required
     * - Bad input: if the entered time cannot be parsed in the locale format using strict parsing
     * - Overflow/Underflow: if the time is before 'min' or after 'max'
     */
    @api
    get validity() {
        const selectedTime = parseTime(this._value);

        return buildSyntheticValidity({
            valueMissing: this.required && !this._displayValue,
            badInput: !!this._displayValue && this._value === null,
            rangeOverflow: this.isAfterMaxTime(selectedTime),
            rangeUnderflow: this.isBeforeMinTime(selectedTime),
            customError:
                this.customErrorMessage != null &&
                this.customErrorMessage !== '',
        });
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (this.connected) {
            this.getCombobox().focus();
        }
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        if (this.connected) {
            this.getCombobox().blur();
        }
    }

    /**
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    @api
    checkValidity() {
        return this.validity.valid;
    }

    /**
     * Sets a custom error message to be displayed when the input value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */
    @api
    setCustomValidity(message) {
        this.customErrorMessage = message;
    }

    /**
     * Displays an error message if the input value is invalid.
     */
    @api
    showHelpMessageIfInvalid() {
        if (!this.connected || this.readOnly) {
            return;
        }

        const validity = this.validity;
        if (validity.valid) {
            this.classList.remove('slds-has-error');
            this._errorMessage = '';
        } else {
            this.classList.add('slds-has-error');
            this._errorMessage = getErrorMessage(
                validity,
                this.getErrorMessageLabels()
            );
        }
    }

    connectedCallback() {
        this.connected = true;
    }

    disconnectedCallback() {
        this.connected = false;
    }

    synchronizeA11y() {
        const label = this.template.querySelector('label');
        const comboBox = this.template.querySelector('lightning-base-combobox');
        let describedByElements = [];
        if (this._ariaDescribedByElements) {
            describedByElements = describedByElements.concat(
                this._ariaDescribedByElements
            );
        }

        const errorMessage = this.template.querySelector(
            '[data-error-message]'
        );

        if (errorMessage) {
            describedByElements.push(errorMessage);
        }

        comboBox.inputDescribedByElements = describedByElements;
        synchronizeAttrs(label, {
            for: this._mainInputId,
        });
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    get displayValue() {
        return this._displayValue;
    }

    get items() {
        return this._items;
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleReady(e) {
        this._mainInputId = e.detail.id;
    }

    buildTimeList() {
        const timeList = [];
        const minTime = parseTime(this.normalizeInputValue(this.min));
        const minHour = minTime ? minTime.getHours() : 0;

        const maxTime = parseTime(this.normalizeInputValue(this.max));
        const maxHour = maxTime ? maxTime.getHours() + 1 : 24;

        const date = new Date();
        for (let hour = minHour; hour < maxHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += STEP) {
                date.setHours(hour, minutes);
                date.setSeconds(0, 0);

                if (this.isBeforeMinTime(date, minTime)) {
                    continue; // eslint-disable-line no-continue
                }

                if (this.isAfterMaxTime(date, maxTime)) {
                    break;
                }

                timeList.push({
                    type: 'option-inline',
                    text: this.format(date, this.timeFormat),
                    value: this.format(date),
                });
            }
        }

        return timeList;
    }

    get timeList() {
        if (!this._timeList) {
            this._timeList = this.buildTimeList();
        }

        if (!this._value) {
            return this._timeList;
        }

        const timeToHighlight = getTimeToHighlight(this._value, STEP);

        const timeList = this._timeList.map(item => {
            const itemCopy = Object.assign({}, item);
            if (item.value === this._value) {
                itemCopy.iconName = 'utility:check';
            }
            if (item.value === timeToHighlight) {
                itemCopy.highlight = true;
            }
            return itemCopy;
        });
        return timeList;
    }

    get timeFormat() {
        if (!this._timeFormat) {
            // We only remove the seconds when displaying the time
            this._timeFormat = this.getDisplayFormat(getLocale().timeFormat);
        }
        return this._timeFormat;
    }

    getCombobox() {
        return this.template.querySelector('lightning-base-combobox');
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleInputChange(event) {
        event.preventDefault();
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.detail.text;
        this._value = normalizeFormattedTime(
            this._displayValue,
            this._timeFormat
        );

        this._items = this.timeList;

        this.dispatchChangeEvent();
    }

    handleTextInput(event) {
        event.preventDefault();
        event.stopPropagation();

        // keeping the display value in sync with the element's value
        this._displayValue = event.detail.text;
    }

    handleTimeSelect(event) {
        event.stopPropagation();

        // for some reason this event is fired without detail from grouped-combobox
        if (!event.detail) {
            return;
        }

        this._value = event.detail.value;
        this._displayValue = normalizeISOTime(
            this._value,
            this.timeFormat
        ).displayValue;

        this._items = this.timeList;
        this.dispatchChangeEvent();
    }

    handleDropdownOpenRequest() {
        this._items = this.timeList;
    }

    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this._value,
                },
            })
        );
    }

    getDisplayFormat(formatString) {
        const regexp = /(\W*(?=[sS])[^aAZ\s]*)/;
        return formatString.replace(regexp, '');
    }

    normalizeInputValue(value) {
        if (!value || value === '') {
            return null;
        }
        return removeTimeZoneSuffix(value);
    }

    format(date, formatString) {
        return formatTime(date, formatString || STANDARD_TIME_FORMAT);
    }

    isBeforeMinTime(date, minTime) {
        const minDate =
            minTime || parseTime(this.normalizeInputValue(this.min));
        return minDate ? isBefore(date, minDate, 'minute') : false;
    }

    isAfterMaxTime(date, maxTime) {
        const maxDate =
            maxTime || parseTime(this.normalizeInputValue(this.max));
        return maxDate ? isAfter(date, maxDate, 'minute') : false;
    }

    getErrorMessageLabels() {
        const valueMissing = this.messageWhenValueMissing;
        const badInput =
            this.messageWhenBadInput ||
            this.formatString(i18n.invalidDate, this.timeFormat);
        const rangeOverflow =
            this.messageWhenRangeOverflow ||
            this.formatString(
                i18n.rangeOverflow,
                normalizeISOTime(this.max, this.timeFormat).displayValue
            );
        const rangeUnderflow =
            this.messageWhenRangeUnderflow ||
            this.formatString(
                i18n.rangeUnderflow,
                normalizeISOTime(this.max, this.timeFormat).displayValue
            );

        return {
            valueMissing,
            badInput,
            rangeOverflow,
            rangeUnderflow,
            customError: this.customErrorMessage,
        };
    }

    formatString(str, ...args) {
        return str.replace(/{(\d+)}/g, (match, i) => {
            return args[i];
        });
    }
}
