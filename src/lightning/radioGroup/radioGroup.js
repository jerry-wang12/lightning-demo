import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, api, track } from 'lwc';
import {
    normalizeBoolean,
    synchronizeAttrs,
    getRealDOMId,
    normalizeString as normalize,
} from 'lightning/utilsPrivate';
import {
    isEmptyString,
    InteractingState,
    FieldConstraintApi,
    generateUniqueId,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};

/**
 * A radio button group that can have a single option selected.
 */
export default class LightningRadioGroup extends LightningElement {
    /**
     * The style of the radio group. Options are radio or button. The default is radio.
     * @type {string}
     * @default radio
     */
    @api type = 'radio';

    /**
     * Text label for the radio group.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * Array of label-value pairs for each radio button.
     * @type {list}
     * @required
     */
    @api options;

    // Validity related message
    /**
     * Optional message displayed when no radio button is selected and the required attribute is set to true.
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * Specifies the name of the radio button group. Only only one button can be selected if a name is specified
     * for the group.
     * @type {string}
     */
    @api name = generateUniqueId();

    @track _required = false;
    @track _disabled = false;
    @track _helpMessage;
    @track _value;

    synchronizeA11y() {
        const inputs = this.template.querySelectorAll('input');
        Array.prototype.slice.call(inputs).forEach(input => {
            synchronizeAttrs(input, {
                'aria-describedby': this.computedUniqueHelpElementId,
            });
        });
    }
    connectedCallback() {
        this.classList.add('slds-form-element');
        this.interactingState = new InteractingState();
        this.interactingState.onleave(this.showHelpMessageIfInvalid.bind(this));
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    /**
     * Specifies the value of the selected radio button.
     * @type {object}
     */
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get radioButtonElements() {
        return this.template.querySelectorAll('input');
    }

    /**
     * If present, the radio group is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * If present, a radio button must be selected before the form can be submitted.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }

    get i18n() {
        return i18n;
    }

    get transformedOptions() {
        const { options, value } = this;
        if (Array.isArray(options)) {
            return options.map((option, index) => ({
                label: option.label,
                value: option.value,
                isChecked: value === option.value,
                indexId: `radio-${index}`,
            }));
        }
        return [];
    }

    get isRadio() {
        return this.normalizedType === 'radio';
    }

    get isButton() {
        return this.normalizedType === 'button';
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: 'radio',
            validValues: ['radio', 'button'],
        });
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the radio group has any validity errors.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity(message => {
            this._helpMessage = message;
        });
    }

    /**
     * Sets a custom error message to be displayed when the radio group value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message
     *     is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Shows the help message if the form control is in an invalid state.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Sets focus on the first radio input element.
     */
    @api
    focus() {
        const firstRadio = this.template.querySelector('input');
        if (firstRadio) {
            firstRadio.focus();
        }
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
        event.stopPropagation(); // Stop input element from propagating event up and instead propagate from radio group

        this.interactingState.interacting();

        const value = Array.from(this.radioButtonElements)
            .filter(radioButton => radioButton.checked)
            .map(radioButton => radioButton.value)
            .toString();

        this._value = value;

        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    value,
                },
                composed: true,
                bubbles: true,
                cancelable: true,
            })
        );
    }

    get computedUniqueHelpElementId() {
        return getRealDOMId(this.template.querySelector('[data-help-message]'));
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled &&
                    this.required &&
                    isEmptyString(this.value),
            });
        }
        return this._constraintApi;
    }
}
