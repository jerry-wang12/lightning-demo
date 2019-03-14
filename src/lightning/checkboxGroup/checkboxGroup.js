import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, api, track } from 'lwc';
import {
    normalizeBoolean,
    synchronizeAttrs,
    getRealDOMId,
} from 'lightning/utilsPrivate';
import { FieldConstraintApi, debounce } from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};

// needed so it works in all browsers, all tests
const DEBOUNCE_PERIOD = 200;

/**
 * A checkbox group that enables selection of single or multiple options.
 */
export default class LightningCheckboxGroup extends LightningElement {
    /**
     * Text label for the checkbox group.
     *
     * @type {string}
     * @required
     */
    @api label;

    /**
     * Array of label-value pairs for each checkbox.
     *
     * @type {list}
     * @required
     */
    @api options;

    /**
     * Optional message to be displayed when no checkbox is selected
     * and the required attribute is set.
     *
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * The name of the checkbox group.
     *
     * @type {string}
     * @required
     */
    @api name;

    @track _helpMessage;
    @track _disabled;
    @track _required;
    @track _value;

    itemIndex = 0;

    constructor() {
        super();
        // TODO: Change to use InteractingState instead
        this.debouncedShowIfBlurred = debounce(() => {
            if (!this.containsFocus) {
                this.showHelpMessageIfInvalid();
            }
        }, DEBOUNCE_PERIOD);
    }

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
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    /**
     * The list of selected checkboxes.
     * Each array entry contains the value of a selected checkbox.
     * The value of each checkbox is set in the options attribute.
     *
     * @type {string[]}
     * @required
     */
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    /**
     * If present, the checkbox group is disabled.
     * Checkbox selections can't be changed for a disabled checkbox group.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this._disabled || false;
    }
    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    /**
     * If present, at least one checkbox must be selected.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this._required || false;
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
            return options.map(option => ({
                label: option.label,
                value: option.value,
                id: `checkbox-${this.itemIndex++}`,
                isChecked: value.indexOf(option.value) !== -1,
            }));
        }
        return [];
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
     * @returns {boolean} Indicates whether the checkbox group meets all constraint validations.
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
        // required to make sure the sync happens after the render
        return this._constraint.reportValidity(message => {
            this._helpMessage = message;
        });
    }

    /**
     * Sets a custom error message to be displayed when the checkbox value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message
     * is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Displays an error message if the checkbox value is required and no option is selected.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    get computedUniqueHelpElementId() {
        const helpElement = this.template.querySelector('[data-helptext]');
        return getRealDOMId(helpElement);
    }

    /**
     * Sets focus on the first checkbox input element.
     */
    @api
    focus() {
        const firstCheckbox = this.template.querySelector('input');
        if (firstCheckbox) {
            firstCheckbox.focus();
        }
    }

    handleFocus() {
        this.containsFocus = true;

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.containsFocus = false;
        this.debouncedShowIfBlurred();

        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleClick(event) {
        // Fixes an issue for firefox / safari of not focusing on a checkbox on a click.
        // Maybe it makes sense to fix it in lightning-input and use lightning-input so it's consistent
        if (this.template.activeElement !== event.target) {
            event.target.focus();
        }
    }

    handleChange(event) {
        event.stopPropagation(); // Stop input element from propagating event up and instead propagate from checkbox group

        const checkboxes = this.template.querySelectorAll('input');
        const value = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

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

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled && this.required && this.value.length === 0,
            });
        }
        return this._constraintApi;
    }
}
