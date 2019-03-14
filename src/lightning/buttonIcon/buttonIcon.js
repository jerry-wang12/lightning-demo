import { api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString as normalize } from 'lightning/utilsPrivate';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './buttonIcon.html';

const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';
const DEFAULT_TYPE = 'button';

/**
 * An icon-only HTML button.
 */
export default class LightningButtonIcon extends LightningPrimitiveButton {
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
     * The variant changes the appearance of button-icon.
     * Accepted variants include bare, container, brand, border, border-filled, bare-inverse, and border-inverse.
     * This value defaults to border.
     *
     * @type {string}
     * @default border
     */
    @api variant = DEFAULT_VARIANT;

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * Only utility icons can be used in this component.
     *
     * @type {string}
     * @required
     */
    @api iconName;

    /**
     * The class to be applied to the contained icon element.
     * Only Lightning Design System utility classes are currently supported.
     *
     * @type {string}
     */
    @api iconClass;

    /**
     * The size of the button-icon. For the bare variant, options include x-small, small, medium, and large.
     * For non-bare variants, options include xx-small, x-small, small, and medium.
     * This value defaults to medium.
     *
     * @type {string}
     * @default medium
     */
    @api size = DEFAULT_SIZE;

    /**
     * Specifies the type of button. Valid values are button, reset, and submit.
     * This value defaults to button.
     *
     * @type {string}
     * @default button
     */
    @api type = DEFAULT_TYPE;

    /**
     * The alternative text used to describe the icon. This text should describe what
     * happens when you click the button, for example 'Upload File', not what the icon looks like, 'Paperclip'.
     * @type {string}
     */
    @api alternativeText;

    @track _order = null;

    // this is there because raptor currently doesnt support inheritance
    render() {
        return template;
    }

    get computedTitle() {
        return this.state.title || this.alternativeText || '';
    }

    get normalizedVariant() {
        return normalize(this.variant, {
            fallbackValue: DEFAULT_VARIANT,
            validValues: [
                'bare',
                'brand',
                'container',
                'border',
                'border-filled',
                'bare-inverse',
                'border-inverse',
            ],
        });
    }

    get normalizedType() {
        return normalize(this.type, {
            fallbackValue: DEFAULT_TYPE,
            validValues: ['button', 'reset', 'submit'],
        });
    }

    get normalizedSize() {
        return normalize(this.size, {
            fallbackValue: DEFAULT_SIZE,
            validValues: ['xx-small', 'x-small', 'small', 'medium', 'large'],
        });
    }

    getVariantBase() {
        return this.normalizedVariant.split('-')[0];
    }

    getVariantModifier() {
        return this.normalizedVariant.split('-')[1] || '';
    }

    get computedButtonClass() {
        const { normalizedSize, normalizedVariant } = this;
        const isBare = this.getVariantBase(normalizedSize) === 'bare';
        const classes = classSet('slds-button');
        if (!isBare) {
            // If the variant is not bare, then size the button instead of the icon
            switch (normalizedSize) {
                case 'small':
                    classes.add('slds-button_icon-small');
                    break;
                case 'x-small':
                    classes.add('slds-button_icon-x-small');
                    break;
                case 'xx-small':
                    classes.add('slds-button_icon-xx-small');
                    break;
                case 'large': // There is no `large` modifier for buttons so we should drop down one size to `medium`
                    // eslint-disable-next-line no-console
                    console.warn(
                        `<lightning-button-icon> The non-bare variants of buttonIcon do not support a size value of "large". Supported values include "xx-small", "x-small", "small", and "medium". Falling back to size value "medium".`
                    );
                /* falls through */
                case 'medium': // Medium is the default size, and the default size doesn't require a size modifier
                default:
            }
        }
        return classes
            .add({
                'slds-button_icon-bare': isBare,
                'slds-button_icon-container': normalizedVariant === 'container',
                'slds-button_icon-border': normalizedVariant === 'border',
                'slds-button_icon-border-filled':
                    normalizedVariant === 'border-filled',
                'slds-button_icon-border-inverse':
                    normalizedVariant === 'border-inverse',
                'slds-button_icon-inverse':
                    normalizedVariant === 'bare-inverse',
                'slds-button_icon-brand': normalizedVariant === 'brand',
                'slds-button_first': this._order === 'first',
                'slds-button_middle': this._order === 'middle',
                'slds-button_last': this._order === 'last',
            })
            .toString();
    }

    get computedIconClass() {
        const { normalizedSize, normalizedVariant } = this;
        const isBare = this.getVariantBase(normalizedVariant) === 'bare';
        const iconClass = this.iconClass || '';
        const classes = classSet('slds-button__icon');
        classes.add(iconClass);

        if (isBare) {
            // If the variant is bare, then size the icon instead of the button
            switch (normalizedSize) {
                case 'large':
                    classes.add('slds-button__icon_large');
                    break;
                case 'small':
                    classes.add('slds-button__icon_small');
                    break;
                case 'xx-small': // There is no `xx-small` modifier for bare so we should drop down one size to `x-small`
                    // eslint-disable-next-line no-console
                    console.warn(
                        `<lightning-button-icon> The bare variant of buttonIcon does not support a size value of "xx-small". Supported values include "x-small", "small", "medium", and "large". The default is "medium".`
                    );
                /* falls through */
                case 'x-small':
                    classes.add('slds-button__icon_x-small');
                    break;
                case 'medium': // Medium is the default size, and the default size doesn't require a size modifier
                default:
            }
        }
        if (this.getVariantModifier(normalizedVariant) === 'inverse') {
            classes.add('slds-button_icon-inverse');
        }

        return classes.toString();
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
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
