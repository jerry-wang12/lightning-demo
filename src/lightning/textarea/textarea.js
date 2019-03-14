import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    synchronizeAttrs,
    getRealDOMId,
} from 'lightning/utilsPrivate';
import {
    InteractingState,
    normalizeVariant,
    FieldConstraintApiWithProxyInput,
    isEmptyString,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};

/**
 * Represents a multiline text input field.
 */
export default class LightningTextarea extends LightningElement {
    /**
     * Text that describes the textarea input field.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * Text that is displayed when the field is empty,
     * to prompt the user for a valid entry.
     * @type {string}
     */
    @api placeholder;

    /**
     * Specifies the name of an input element.
     * @type {string}
     */
    @api name;

    // Validity related messages
    /**
     * Error message to be displayed when a bad input is detected.
     * @type {string}
     */
    @api messageWhenBadInput;

    /**
     * Error message to be displayed when the value is too short.
     * @type {string}
     */
    @api messageWhenTooShort;

    /**
     * Error message to be displayed when the value is too long.
     * @type {string}
     */
    @api messageWhenTooLong;

    /**
     * Error message to be displayed when the value is missing.
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * The keyboard shortcut for input field.
     * @type {string}
     */
    @api accessKey;

    @track _maxLength;
    @track _minLength;
    @track _defaultValue = '';
    @track _disabled = false;
    @track _required = false;
    @track _readOnly = false;
    @track _variant;

    @track _helpMessage;
    @track _fieldLevelHelp;

    connectedCallback() {
        this.classList.add('slds-form-element');
        this._connected = true;
        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.showHelpMessageIfInvalid());
    }

    synchronizeA11y() {
        const input = this.template.querySelector('textarea');
        synchronizeAttrs(input, {
            'aria-describedby': this.computedUniqueHelpElementId,
        });
    }

    renderedCallback() {
        // IE11: This is needed to work-around IE11 issue where it would append default value to the place holder,
        // instead of actually setting the value on the textarea element.
        if (!this._rendered) {
            this._rendered = true;
            this.inputElement.value = this._defaultValue;
            this.synchronizeA11y();
        }
        this.synchronizeA11y();
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * The maximum number of characters allowed in the textarea.
     * @type {number}
     */
    @api
    get maxLength() {
        return this._maxLength;
    }

    set maxLength(value) {
        this._maxLength = value;
        this._updateProxyInputAttributes('maxlength');
    }

    /**
     * The minimum number of characters allowed in the textarea.
     * @type {number}
     */
    @api
    get minLength() {
        return this._minLength;
    }

    set minLength(value) {
        this._minLength = value;
        this._updateProxyInputAttributes('minlength');
    }

    /**
     * The value of the textarea input, also used as the default value during init.
     * @type {string}
     */
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        // W-5026729 - On IE11, set same value again, will trigger another input event.
        if (this._value !== value) {
            this._value = value || '';
            if (this._connected) {
                // We're connected, so no longer need to update the default value, change the actual value instead
                this.inputElement.value = this._value;
            } else {
                this._defaultValue = this._value;
            }
        }

        this._updateProxyInputAttributes('value');
    }

    /**
     * If present, the textarea field is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
        this._updateProxyInputAttributes('disabled');
    }

    /**
     * If present, the textarea field is read-only and cannot be edited.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
        this._updateProxyInputAttributes('readonly');
    }

    /**
     * If present, the textarea field must be filled out before the form can be submitted.
     * @type {boolean}
     */
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        this._updateProxyInputAttributes('required');
    }

    /**
     * The variant changes the appearance of an input field.
     * Accepted variants include standard and label-hidden.
     * The default is standard.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
    }

    /**
     * Represents the validity states of the textarea input, with respect to constraint validation.
     * @type {object}
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the textarea meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the textarea.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity(message => {
            this._helpMessage = message;
        });
    }

    /**
     * Sets a custom error message to be displayed when the textarea value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Displays error messages on invalid fields.
     * An invalid field fails at least one constraint validation and returns false when checkValidity() is called.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * The help text that appears in a popover.
     * Set field-level help to provide an informational tooltip on the textarea input field.
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    /**
     * Sets focus on the textarea field.
     */
    @api
    focus() {
        if (this._connected) {
            this.inputElement.focus();
        }
    }

    /**
     * Removes focus from the textarea field.
     */
    @api
    blur() {
        if (this._connected) {
            this.inputElement.blur();
        }
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get i18n() {
        return i18n;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleFocus() {
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleChange(event) {
        // we only fire change event oninput
        // so stop native event here
        event.stopPropagation();
    }

    handleInput(event) {
        event.stopPropagation();

        // If the current value is the same as it was prior to last update, don't fire the event.
        // This allows us to fix an issue with IE11 which fires an 'input' event every time the placeholder
        // is changed, since the value isn't affected we're effectively ignoring such events.
        if (!this._connected || this._value === event.target.value) {
            return;
        }

        this.interactingState.interacting();

        this._value = this.inputElement.value;
        this._updateProxyInputAttributes('value');

        this.dispatchEvent(
            new CustomEvent('change', {
                bubbles: true,
                composed: true,
                detail: {
                    value: this._value,
                },
            })
        );
    }

    get inputElement() {
        return this.template.querySelector('textarea');
    }

    get computedUniqueHelpElementId() {
        const helpMessage = this.template.querySelector('[data-help-message]');
        return getRealDOMId(helpMessage);
    }

    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApiWithProxyInput(
                () => this,
                {
                    // Override validity.valueMissing, which was broken in Edge until May 2018.
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/291588/
                    valueMissing: () =>
                        this._required && isEmptyString(this._value),

                    tooShort: () =>
                        this._connected && this.inputElement.validity.tooShort,
                    tooLong: () =>
                        this._connected && this.inputElement.validity.tooLong,
                },
                'textarea'
            );

            this._constraintApiProxyInputUpdater = this._constraint.setInputAttributes(
                {
                    value: () => this.value,
                    maxlength: () => this.maxLength,
                    minlength: () => this.minLength,
                    disabled: () => this.disabled,
                    readonly: () => this.readOnly,
                    required: () => this.required,
                }
            );
        }
        return this._constraintApi;
    }
}

LightningTextarea.interopMap = {
    exposeNativeEvent: {
        change: true,
        focus: true,
        blur: true,
    },
};
