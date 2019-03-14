import { api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './button.html';

/**
 * A clickable element used to perform an action.
 */
export default class LightningButton extends LightningPrimitiveButton {
    static delegatesFocus = true;

    /**
     * The name for the button element.
     * This value is optional and can be used to identify the button in a callback.
     *
     * @type {string}
     */
    @api name;

    /**
     * The value for the button element.
     * This value is optional and can be used when submitting a form.
     *
     * @type {string}
     */
    @api value;

    /**
     * The text to be displayed inside the button.
     *
     * @type {string}
     */
    @api label;

    /**
     * The variant changes the appearance of the button.
     * Accepted variants include base, neutral, brand, destructive, inverse and success.
     * This value defaults to neutral.
     *
     * @type {string}
     * @default neutral
     */
    @api variant = 'neutral';

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     *
     * @type {string}
     */
    @api iconName;

    /**
     * Describes the position of the icon with respect to body.
     * Options include left and right.
     * This value defaults to left.
     *
     * @type {string}
     * @default left
     */
    @api iconPosition = 'left';

    /**
     * Specifies the type of button.
     * Valid values are button, reset, and submit.
     * This value defaults to button.
     *
     * @type {string}
     * @default button
     */
    @api type = 'button';

    @track title = null;
    @track _order = null;
    _id = null;

    render() {
        return template;
    }

    get computedButtonClass() {
        return classSet('slds-button')
            .add({
                'slds-button_neutral': this.normalizedVariant === 'neutral',
                'slds-button_brand': this.normalizedVariant === 'brand',
                'slds-button_destructive':
                    this.normalizedVariant === 'destructive',
                'slds-button_inverse': this.normalizedVariant === 'inverse',
                'slds-button_success': this.normalizedVariant === 'success',
                'slds-button_first': this._order === 'first',
                'slds-button_middle': this._order === 'middle',
                'slds-button_last': this._order === 'last',
            })
            .toString();
    }

    get computedTitle() {
        return this.title;
    }

    get normalizedVariant() {
        return normalize(this.variant, {
            fallbackValue: 'neutral',
            validValues: [
                'base',
                'neutral',
                'brand',
                'destructive',
                'inverse',
                'success',
            ],
        });
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: 'button',
            validValues: ['button', 'reset', 'submit'],
        });
    }

    get normalizedIconPosition() {
        return normalize(this.iconPosition, {
            fallbackValue: 'left',
            validValues: ['left', 'right'],
        });
    }

    get showIconLeft() {
        return this.iconName && this.normalizedIconPosition === 'left';
    }

    get showIconRight() {
        return this.iconName && this.normalizedIconPosition === 'right';
    }

    get computedIconClass() {
        return classSet('slds-button__icon')
            .add({
                'slds-button__icon_left':
                    this.normalizedIconPosition === 'left',
                'slds-button__icon_right':
                    this.normalizedIconPosition === 'right',
            })
            .toString();
    }

    handleButtonFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleButtonBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.template.querySelector('button').focus();
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

LightningButton.interopMap = {
    exposeNativeEvent: {
        click: true,
        focus: true,
        blur: true,
    },
};
