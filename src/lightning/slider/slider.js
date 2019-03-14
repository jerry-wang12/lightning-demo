import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    normalizeString as normalize,
} from 'lightning/utilsPrivate';
import numberUtils from 'lightning/numberUtils';
import { numberFormat } from 'lightning/numberFormat';
import {
    InteractingState,
    normalizeVariant,
    FieldConstraintApiWithProxyInput,
    VARIANT,
} from 'lightning/inputUtils';

const defaultMin = 0;
const defaultMax = 100;
const defaultStep = 1;

/**
 * An input range slider for specifying a value between two specified numbers.
 */
export default class LightningSlider extends LightningElement {
    /**
     * The size of the slider.
     * The default is an empty string, which sets the slider to the width of the viewport. Accepted values are x-small, small, medium, and large.
     * @type {string}
     */
    @api size;

    /**
     * The type determines the orientation of the slider. Accepted values are vertical and horizontal. The default is horizontal.
     * @type {string}
     * @default horizontal
     */
    @api type = 'horizontal';

    /**
     * Text label to describe the slider. Provide your own label to describe the slider.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * Error message to be displayed when a range overflow is detected.
     * @type {string}
     */
    @api messageWhenRangeOverflow;

    /**
     * Error message to be displayed when a range underflow is detected.
     * @type {string}
     */
    @api messageWhenRangeUnderflow;

    /**
     * Error message to be displayed when a step mismatch is detected.
     * @type {string}
     */
    @api messageWhenStepMismatch;

    // The below don't make sense for the slider

    /**
     * Error message to be displayed when the value is missing.
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * Error message to be displayed when the value is too long.
     * @type {string}
     */
    @api messageWhenTooLong;

    /**
     * Error message to be displayed when a bad input is detected.
     * @type {string}
     */
    @api messageWhenBadInput;

    /**
     * Error message to be displayed when a pattern mismatch is detected.
     * @type {string}
     */
    @api messageWhenPatternMismatch;

    /**
     * Error message to be displayed when a type mismatch is detected.
     * @type {string}
     */
    @api messageWhenTypeMismatch;

    @track _helpMessage;
    @track _min = defaultMin;
    @track _max = defaultMax;
    @track _step = defaultStep;
    @track _variant;
    @track _value;
    @track _disabled = false;

    constructor() {
        super();
        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.showHelpMessageIfInvalid());
    }

    connectedCallback() {
        this.classList.add('slds-form-element');
        assert(
            this.label,
            `<lightning-slider> Missing required "label" attribute.`
        );
    }

    /**
     * The minimum value of the input range. The default is 0.
     * @type {number}
     * @default 0
     */
    @api
    get min() {
        return this._min;
    }

    set min(value) {
        this._min = value || defaultMin;
        this._updateProxyInputAttributes('min');
    }

    /**
     * The maximum value of the input range. The default is 100.
     * @type {number}
     * @default 100
     */
    @api
    get max() {
        return this._max;
    }

    set max(value) {
        this._max = value || defaultMax;
        this._updateProxyInputAttributes('max');
    }

    /**
     * The step increment value of the input range.
     * Example steps include 0.1, 1, or 10. The default is 1.
     * @type {number}
     * @default 1
     */
    @api
    get step() {
        return this._step;
    }

    set step(value) {
        this._step = value || defaultStep;
        this._updateProxyInputAttributes('step');
    }

    /**
     * If present, the slider is disabled and users cannot interact with it.
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
     * The variant changes the appearance of the slider.
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
     * The numerical value of the slider. The default is 0.
     * @type {number}
     * @default 0
     */
    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this._updateProxyInputAttributes('value');
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        this.inputElement.focus();
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        this.inputElement.blur();
    }

    /**
     * Represents the validity states of the slider input, with respect to constraint validation.
     * @type {object}
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the slider meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the slider.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity(message => {
            this._helpMessage = message;
        });
    }

    /**
     * Sets a custom error message to be displayed when the slider value is submitted.
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

    get computedValue() {
        return Number.isFinite(parseFloat(this._value)) ? this._value : null;
    }

    get formattedValue() {
        if (!Number.isFinite(parseFloat(this._value))) {
            return '';
        }

        // calculate decimal points from the step attribute
        const decimalPlaces = numberUtils.decimalPlaces(this._step);
        const formatConfig = { style: 'decimal' };

        if (decimalPlaces > 0) {
            formatConfig.minimumFractionDigits = decimalPlaces;
        }
        return numberFormat(formatConfig).format(this.computedValue);
    }

    get computedClass() {
        const { normalizedSize, normalizedType } = this;
        const classes = classSet('slds-slider');

        if (normalizedType === 'vertical') {
            classes.add('slds-slider_vertical');
        }
        if (normalizedSize) {
            classes.add(`slds-size_${normalizedSize}`);
        }
        return classes.toString();
    }

    get normalizedSize() {
        return normalize(this.size, {
            fallbackValue: '',
            validValues: ['x-small', 'small', 'medium', 'large'],
        });
    }

    // IE11 does not support the input event for range inputs so we need to handle the change
    // event for that browser. When we stop supporting IE11 we can remove the change handler and
    // rely on just the input event handler.
    handleChange(event) {
        event.stopPropagation();

        // The input event fires continually for every value change while the change event gets
        // fired when the user releases the mouse button for example. This can cause two change
        // events to be fired for the same value change. To prevent this, ignore the change event
        // if the value hasn't changed.
        const shouldIgnoreChangeEvent = this._value === event.target.value;
        if (shouldIgnoreChangeEvent) {
            return;
        }

        this.handleInput(event);
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: 'horizontal',
            validValues: ['horizontal', 'vertical'],
        });
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        const classes = classSet();

        classes.add(
            this.isLabelHidden
                ? 'slds-assistive-text'
                : 'slds-slider-label__label'
        );
        return classes.toString();
    }

    // Main slider callback
    handleInput(event) {
        this.interactingState.interacting();
        event.stopPropagation();

        const newValue = event.target.value;

        this._value = newValue;
        this._updateProxyInputAttributes('value');

        const customEvent = this.createCustomChangeEvent(newValue);
        this.dispatchEvent(customEvent);
    }

    createCustomChangeEvent(value) {
        const detail = { value };

        return new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail,
        });
    }

    handleFocus() {
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent('blur'));
    }

    get inputElement() {
        return this.template.querySelector('input');
    }

    get computedAriaDescribedBy() {
        return this._helpMessage ? this.computedUniqueHelpElementId : null;
    }

    _updateProxyInputAttributes(attributes) {
        if (this._constraintApiProxyInputUpdater) {
            this._constraintApiProxyInputUpdater(attributes);
        }
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApiWithProxyInput(
                () => this
            );
            this._constraintApiProxyInputUpdater = this._constraint.setInputAttributes(
                {
                    type: () => 'range',
                    value: () => this.value,
                    max: () => this.max,
                    min: () => this.min,
                    step: () => this.step,
                    disabled: () => this.disabled,
                }
            );
        }
        return this._constraintApi;
    }
}

LightningSlider.interopMap = {
    exposeNativeEvent: {
        change: true,
        focus: true,
        blur: true,
    },
};
