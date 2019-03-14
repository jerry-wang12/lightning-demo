import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeString as normalize,
} from 'lightning/utilsPrivate';

const DEFAULT_VARIANT = 'neutral';

/**
 * A button that toggles between states.
 */
export default class LightningButtonStateful extends LightningElement {
    static delegatesFocus = true;

    /**
     * The name of the icon to be used in the format 'utility:check' when the state is true.
     *
     * @type {string}
     */
    @api iconNameWhenOn;

    /**
     * The name of the icon to be used in the format 'utility:add' when the state is false.
     *
     * @type {string}
     */
    @api iconNameWhenOff;

    /**
     * The name of the icon to be used in the format 'utility:close' when the state is true and the button receives focus.
     *
     * @type {string}
     */
    @api iconNameWhenHover;

    /**
     * The text to be displayed inside the button when state is false.
     *
     * @type {string}
     * @required
     */
    @api labelWhenOff;

    /**
     * The text to be displayed inside the button when state is true.
     *
     * @type {string}
     * @required
     */
    @api labelWhenOn;

    /**
     * The text to be displayed inside the button when state is true and the button receives focus.
     *
     * @type {string}
     */
    @api labelWhenHover;

    /**
     * The variant changes the appearance of the button.
     * Accepted variants include brand, destructive, inverse, neutral, success, and text.
     *
     * @type {string}
     * @default neutral
     */
    @api variant = DEFAULT_VARIANT;

    @track
    state = {
        isClicked: false,
    };

    @track _order = null;

    /**
     * If present, the button is in the selected state.
     * @type {boolean}
     * @default false
     */
    @api
    get selected() {
        return this.state.selected || false;
    }
    set selected(value) {
        this.state.selected = normalizeBoolean(value);
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.template.querySelector('button').focus();
    }

    // update custom element's classList
    get computedButtonClass() {
        const classes = classSet('slds-button slds-button_stateful')
            .add({
                'slds-button_neutral': this.normalizedVariant === 'neutral',
                'slds-button_brand': this.normalizedVariant === 'brand',
                'slds-button_inverse': this.normalizedVariant === 'inverse',
                'slds-button_destructive':
                    this.normalizedVariant === 'destructive',
                'slds-button_success': this.normalizedVariant === 'success',
            })
            .add({
                'slds-not-selected': !this.selected,
                'slds-is-selected': this.selected && !this.state.isClicked,
                'slds-is-selected-clicked':
                    this.selected && this.state.isClicked,
                // order classes when part of a button-group
                'slds-button_first': this._order === 'first',
                'slds-button_middle': this._order === 'middle',
                'slds-button_last': this._order === 'last',
            });

        return classes.toString();
    }

    // normalize variant attribute
    get normalizedVariant() {
        return normalize(this.variant, {
            fallbackValue: DEFAULT_VARIANT,
            validValues: [
                'neutral',
                'brand',
                'inverse',
                'destructive',
                'success',
                'text',
            ],
        });
    }

    // validate labelWhenOn and output error to console if needed
    get privateLabelWhenOn() {
        let outputVal = this.labelWhenOn;

        // if valid label short circuit out
        if (this.isValidLabel(outputVal)) {
            return outputVal;
        }

        outputVal = '';
        // eslint-disable-next-line no-console
        console.warn(
            `<lightning-button-stateful> The "labelWhenOn" attribute value is required to show the label when selected has a value of true`
        );

        return outputVal;
    }

    // validate labelWhenOff and output error to console if needed
    get privateLabelWhenOff() {
        let outputVal = this.labelWhenOff;

        // if valid label short circuit out
        if (this.isValidLabel(outputVal)) {
            return outputVal;
        }

        outputVal = '';
        // eslint-disable-next-line no-console
        console.warn(
            `<lightning-button-stateful> The "labelWhenOff" attribute value is required to show the label when selected has a value of false`
        );

        return outputVal;
    }

    // validate labelWhenHover and if invalid output same value as labelWhenOn
    get privateLabelWhenHover() {
        const outputVal = this.labelWhenHover;

        // if valid label short circuit out
        if (this.isValidLabel(outputVal)) {
            return outputVal;
        }

        // if invalid label output same value as labelWhenOn
        return this.privateLabelWhenOn;
    }

    // if iconNameWhenHover is empty or missing fall back to iconNameWhenOn
    get privateIconNameWhenHover() {
        // if value exists pass it through
        if (this.iconNameWhenHover) {
            return this.iconNameWhenHover;
        }

        // if no value exists return iconNameWhenOn
        return this.iconNameWhenOn;
    }

    // set isClicked to true when button is clicked
    handleButtonClick() {
        this.state.isClicked = true;
    }

    // set isClicked to false when button is blurred
    handleButtonBlur() {
        this.state.isClicked = false;

        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleButtonFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    // validate a label is a string and not zero length
    isValidLabel(labelVal) {
        // if not a string or of length 0 then label is not valid
        if (typeof labelVal !== 'string' || labelVal.length === 0) {
            return false;
        }

        return true;
    }

    /**
     * {Function} setOrder - Sets the order value of the button when in the context of a button-group or other ordered component
     * @param {String} order -  The order string (first, middle, last)
     */
    setOrder(order) {
        this._order = order;
    }

    /**
     * Once we are connected, we fire a register event so the button-group (or other) component can register
     * the buttons.
     */
    connectedCallback() {
        const privatebuttonregister = new CustomEvent('privatebuttonregister', {
            bubbles: true,
            detail: {
                callbacks: {
                    setOrder: this.setOrder.bind(this),
                    setDeRegistrationCallback: deRegistrationCallback => {
                        this._deRegistrationCallback = deRegistrationCallback;
                    },
                },
            },
        });

        this.dispatchEvent(privatebuttonregister);
    }

    disconnectedCallback() {
        if (this._deRegistrationCallback) {
            this._deRegistrationCallback();
        }
    }
}

LightningButtonStateful.interopMap = {
    props: {
        selected: 'state',
    },
};
