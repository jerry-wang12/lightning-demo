import labelDate from '@salesforce/label/LightningDateTimePicker.dateLabel';
import labelInvalidDate from '@salesforce/label/LightningDateTimePicker.invalidDate';
import labelRangeOverflow from '@salesforce/label/LightningDateTimePicker.rangeOverflow';
import labelRangeUnderflow from '@salesforce/label/LightningDateTimePicker.rangeUnderflow';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelTime from '@salesforce/label/LightningDateTimePicker.timeLabel';
import { LightningElement, track, api } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeAriaAttribute,
    synchronizeAttrs,
    getRealDOMId,
} from 'lightning/utilsPrivate';
import {
    getCurrentTime,
    isBefore,
    isAfter,
    parseDateTimeUTC,
    normalizeISODateTime,
    normalizeFormattedDateTime,
    TIME_SEPARATOR,
} from 'lightning/dateTimeUtils';
import {
    generateUniqueId,
    InteractingState,
    getErrorMessage,
    buildSyntheticValidity,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    date: labelDate,
    invalidDate: labelInvalidDate,
    rangeOverflow: labelRangeOverflow,
    rangeUnderflow: labelRangeUnderflow,
    required: labelRequired,
    time: labelTime,
};

export default class LightningDateTimePicker extends LightningElement {
    @track _disabled = false;
    @track _readonly = false;
    @track _required = false;
    @track _fieldLevelHelp;
    @track _variant;
    @track _value = null;
    @track _dateValue = null;
    @track _timeValue = null;
    @track _customErrorMessage = '';

    @api label;
    @api name;
    @api timezone;
    @api placeholder = '';

    @api timeAriaLabel;

    // getters and setters necessary to trigger sync
    set timeAriaControls(val) {
        this._timeAriaControls = val;
        this.synchronizeA11y();
    }

    @api
    get timeAriaControls() {
        return this._timeAriaControls;
    }

    set timeAriaLabelledBy(val) {
        this._timeAriaLabelledBy = val;
        this.synchronizeA11y();
    }

    @api
    get timeAriaLabelledBy() {
        return this._timeAriaLabelledBy;
    }

    set timeAriaDescribedBy(val) {
        this._timeAriaDescribedBy = val;
        this.synchronizeA11y();
    }

    @api
    get timeAriaDescribedBy() {
        return this._timeAriaDescribedBy;
    }

    @api dateAriaControls;
    @api dateAriaLabel;
    @api dateAriaLabelledBy;
    @api dateAriaDescribedBy;

    @api messageWhenValueMissing;
    @api messageWhenBadInput;
    @api messageWhenRangeOverflow;
    @api messageWhenRangeUnderflow;

    @api
    get max() {
        return this.maxValue;
    }
    set max(newValue) {
        this.maxValue = newValue;
        this.calculateFormattedMaxValue();
    }

    @api
    get min() {
        return this.minValue;
    }
    set min(newValue) {
        this.minValue = newValue;
        this.calculateFormattedMinValue();
    }

    @api
    get value() {
        return this._value;
    }
    set value(newValue) {
        const normalizedValue = this.normalizeInputValue(newValue);
        if (normalizedValue !== this._value) {
            if (!this.connected) {
                // we set the values in connectedCallback to make sure timezone is available.
                this._initialValue = normalizedValue;
                return;
            }
            this.setDateAndTimeValues(normalizedValue);
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
    }

    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
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
     * Sets focus on the date input element.
     */
    @api
    focus() {
        if (this.connected) {
            this.getDatepicker().focus();
        }
    }

    /**
     * Removes keyboard focus from the input elements.
     */
    @api
    blur() {
        if (this.connected) {
            this.getDatepicker().blur();
            this.getTimepicker().blur();
        }
    }

    /**
     * The following will result in the value being invalid:
     * - Missing: if the value is missing when the input is required
     * - Overflow/Underflow: if the time is before 'min' or after 'max'
     * - Bad Input will be handled by the individual date or time components
     */
    @api
    get validity() {
        const selectedDateTime = parseDateTimeUTC(this._value);
        const dateValidity = this.getDatepicker().validity;
        const timeValidity = this.getTimepicker().validity;

        const dateMissing = this.required && !this._dateValue;
        const timeMissing = this.required && !this._timeValue;

        const rangeOverflow = this.isAfterMaxDate(selectedDateTime, 'minute');
        const dateOverflow = this.isAfterMaxDate(selectedDateTime, 'day');
        const timeOverflow = rangeOverflow && !dateOverflow;

        const rangeUnderflow = this.isBeforeMinDate(selectedDateTime, 'minute');
        const dateUnderflow = this.isBeforeMinDate(selectedDateTime, 'day');
        const timeUnderflow = rangeUnderflow && !dateUnderflow;

        this.dateValid =
            !dateOverflow &&
            !dateUnderflow &&
            !dateMissing &&
            dateValidity.valid;
        this.timeValid =
            !timeOverflow &&
            !timeUnderflow &&
            !timeMissing &&
            timeValidity.valid;

        return buildSyntheticValidity({
            valueMissing: dateMissing && timeMissing,
            rangeOverflow,
            rangeUnderflow,
            badInput:
                timeMissing || dateValidity.badInput || timeValidity.badInput,
            customError:
                this._customErrorMessage != null &&
                this._customErrorMessage !== '',
        });
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
        this._customErrorMessage = message;
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
        let errorMessage = '';
        if (validity.valid) {
            this._customErrorMessage = '';
            this.classList.remove('slds-has-error');
            this.updateDatepickerError(errorMessage);
            this.updateTimepickerError(errorMessage);
        } else {
            if (validity.customError) {
                // custom error messages apply to the whole component, not individial date/time components
                // TODO add aria-describedby on the input elements in datepicker and timepicker
                // As of 212, there is no good way to set aria-describedby on child components, raptor is currently working on a proposal
                this.classList.add('slds-has-error');
                return;
            }

            errorMessage = getErrorMessage(
                validity,
                this.getErrorMessageLabels()
            );

            const dateError = !this.dateValid ? errorMessage : '';
            this.updateDatepickerError(dateError);

            const timeError = !this.timeValid ? errorMessage : '';
            this.updateTimepickerError(timeError);
        }
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__legend slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get i18n() {
        return i18n;
    }

    get dateValue() {
        return this._dateValue;
    }

    get timeValue() {
        return this._timeValue;
    }

    get customErrorMessage() {
        return this._customErrorMessage;
    }

    get dateMin() {
        return this._dateMin;
    }

    get dateMax() {
        return this._dateMax;
    }

    get errorMessageElementId() {
        return getRealDOMId(this.template.querySelector('[data-error-message'));
    }

    get computedDateAriaDescribedBy() {
        const ariaValues = [];

        if (this.customErrorMessage) {
            ariaValues.push(this.errorMessageElementId);
        }
        if (this.dateAriaDescribedBy) {
            ariaValues.push(this.dateAriaDescribedBy);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get computedTimeAriaDescribedBy() {
        const ariaValues = [];

        if (this.customErrorMessage) {
            ariaValues.push(this.errorMessageElementId);
        }
        if (this.timeAriaDescribedBy) {
            ariaValues.push(this.timeAriaDescribedBy);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    constructor() {
        super();

        this.uniqueId = generateUniqueId();
    }

    synchronizeA11y() {
        const datepicker = this.template.querySelector('lightning-datepicker');
        const timepicker = this.template.querySelector('lightning-timepicker');
        if (datepicker) {
            synchronizeAttrs(datepicker, {
                ariaLabelledByElement: this.dateAriaLabelledBy,
                ariaDescribedByElements: this.computedDateAriaDescribedBy,
                ariaControlsElement: this.dateAriaControls,
                'aria-label': this.dateAriaLabel,
            });
        }

        if (timepicker) {
            synchronizeAttrs(timepicker, {
                ariaLabelledByElement: this.timeAriaLabelledBy,
                ariaDescribedByElements: this.computedTimeAriaDescribedBy,
                ariaControlsElement: this.timeAriaControls,
                'aria-label': this.timeAriaLabel,
            });
        }
    }

    connectedCallback() {
        this.classList.add('slds-form_compound');
        this.calculateFormattedMinValue();
        this.calculateFormattedMaxValue();

        this.connected = true;

        // we set the initial values here in order to make sure timezone is available.
        this.setDateAndTimeValues(this._initialValue);

        this.interactingState = new InteractingState();

        this.interactingState.onenter(() => {
            this.dispatchEvent(new CustomEvent('focus'));
        });

        this.interactingState.onleave(() => {
            this.dispatchEvent(new CustomEvent('blur'));
        });
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    disconnectedCallback() {
        this.connected = false;
    }

    updateTimepickerError(errorMessage) {
        const timepicker = this.getTimepicker();

        timepicker.setCustomValidity(errorMessage);
        timepicker.showHelpMessageIfInvalid();
    }

    updateDatepickerError(errorMessage) {
        const datepicker = this.getDatepicker();
        requestAnimationFrame(() => {
            datepicker.setCustomValidity(errorMessage);
            datepicker.showHelpMessageIfInvalid();
        });
    }

    getTimepicker() {
        return this.template.querySelector('lightning-timepicker');
    }

    getDatepicker() {
        return this.template.querySelector('lightning-datepicker');
    }

    handleDatepickerFocus() {
        this._dateFocus = true;

        this.interactingState.enter();
    }

    handleTimepickerFocus() {
        this._timeFocus = true;

        this.interactingState.enter();
    }

    handleDatepickerBlur() {
        this._dateFocus = false;

        // timepicker fires focus before datepicker fires blur
        if (!this._timeFocus) {
            this.interactingState.leave();
        }
    }

    handleTimepickerBlur() {
        this._timeFocus = false;

        // datepicker fires focus before timepicker fires blur
        if (!this._dateFocus) {
            this.interactingState.leave();
        }
    }

    handleDateChange(event) {
        event.stopPropagation();

        // for some reason this event is fired without detail from listbox
        if (!event.detail) {
            return;
        }

        this._dateValue = event.detail.value;
        if (this._dateValue) {
            this._timeValue = this._timeValue || getCurrentTime(this.timezone);
        }

        this.updateValue();
    }

    handleTimeChange(event) {
        event.stopPropagation();

        // for some reason this event is fired without detail from listbox
        if (!event.detail) {
            return;
        }

        this._timeValue = event.detail.value;

        this.updateValue();
    }

    updateValue() {
        const dateValue = this._dateValue;
        const timeValue = this._timeValue;

        if (dateValue && timeValue) {
            const dateTimeString = dateValue + TIME_SEPARATOR + timeValue;
            this._value = normalizeFormattedDateTime(
                dateTimeString,
                this.timezone
            );

            this.dispatchChangeEvent();
        } else if (!dateValue) {
            this._value = null;
            this._timeValue = null;

            this.dispatchChangeEvent();
        }
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

    normalizeInputValue(value) {
        if (!value || value === '') {
            return null;
        }
        return value;
    }

    setDateAndTimeValues(value) {
        const normalizedValue = normalizeISODateTime(value, this.timezone)
            .isoValue;

        const isDateOnly = normalizedValue && value.indexOf(TIME_SEPARATOR) < 0;
        if (isDateOnly) {
            this._dateValue = value;
            this._value = this._dateValue;

            return;
        }

        const dateAndTime = this.separateDateTime(normalizedValue);
        this._dateValue = dateAndTime && dateAndTime[0];
        this._timeValue = dateAndTime && dateAndTime[1];
        this._value = normalizedValue;
    }

    calculateFormattedMinValue() {
        if (!this.min) {
            return;
        }

        const normalizedDate = normalizeISODateTime(this.min, this.timezone);
        this._dateMin = this.separateDateTime(normalizedDate.isoValue)[0];
        this.formattedMin = normalizedDate.displayValue;
    }

    calculateFormattedMaxValue() {
        if (!this.max) {
            return;
        }

        const normalizedDate = normalizeISODateTime(this.max, this.timezone);
        this._dateMax = this.separateDateTime(normalizedDate.isoValue)[0];
        this.formattedMax = normalizedDate.displayValue;
    }

    separateDateTime(isoString) {
        return typeof isoString === 'string'
            ? isoString.split(TIME_SEPARATOR)
            : null;
    }

    isBeforeMinDate(date, unit) {
        const minDate = parseDateTimeUTC(this.min);
        return minDate ? isBefore(date, minDate, unit) : false;
    }

    isAfterMaxDate(date, unit) {
        const maxDate = parseDateTimeUTC(this.max);
        return maxDate ? isAfter(date, maxDate, unit) : false;
    }

    getErrorMessageLabels() {
        const badInput = this.messageWhenValueMissing;
        const valueMissing = this.messageWhenValueMissing;
        const rangeOverflow =
            this.messageWhenRangeOverflow ||
            this.formatString(i18n.rangeOverflow, this.formattedMax);
        const rangeUnderflow =
            this.messageWhenRangeUnderflow ||
            this.formatString(i18n.rangeUnderflow, this.formattedMin);

        return {
            badInput,
            valueMissing,
            rangeOverflow,
            rangeUnderflow,
            customError: this._customErrorMessage,
        };
    }

    formatString(str, ...args) {
        return str.replace(/{(\d+)}/g, (match, i) => {
            return args[i];
        });
    }
}
