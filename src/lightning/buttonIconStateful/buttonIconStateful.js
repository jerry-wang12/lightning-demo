import { api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeString, normalizeBoolean } from 'lightning/utilsPrivate';
import LightningPrimitiveButton from 'lightning/primitiveButton';
import template from './buttonIconStateful.html';

const DEFAULT_SIZE = 'medium';
const DEFAULT_VARIANT = 'border';

/**
 * An icon-only button that retains state.
 */
export default class LightningButtonIconStateful extends LightningPrimitiveButton {
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
     * Accepted variants include border, border-filled, and border-inverse.
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
     */
    @api iconName;

    /**
     * The size of the button-icon component.
     * Options include xx-small, x-small, small, and medium.
     * This value defaults to medium.
     *
     * @type {string}
     * @default medium
     */
    @api size = DEFAULT_SIZE;

    /**
     * The alternative text used to describe the icon.
     * This text should describe what happens when you click the button,
     * for example 'Upload File', not what the icon looks like, 'Paperclip'.
     *
     * @type {string}
     */
    @api alternativeText;

    @track _order = null;

    // this is there because raptor currently doesnt support inheritance
    render() {
        return template;
    }

    get computedTitle() {
        return this.state.title || this.alternativeText || null;
    }

    get normalizedVariant() {
        return normalizeString(this.variant, {
            fallbackValue: DEFAULT_VARIANT,
            validValues: ['border', 'border-filled', 'border-inverse'],
        });
    }

    get normalizedSize() {
        return normalizeString(this.size, {
            fallbackValue: DEFAULT_SIZE,
            validValues: ['xx-small', 'x-small', 'small', 'medium'],
        });
    }

    @api
    get selected() {
        return this.state.selected || false;
    }

    set selected(value) {
        this.state.selected = normalizeBoolean(value);
    }

    get computedAriaPressed() {
        return String(this.selected);
    }

    get computedButtonClass() {
        const { normalizedSize, normalizedVariant } = this;
        const classes = classSet('slds-button slds-button_icon');
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
            case 'medium': // no size modifier
            default:
        }
        classes.add({
            'slds-button_icon-border': normalizedVariant === 'border',
            'slds-button_icon-border-filled':
                normalizedVariant === 'border-filled',
            // TODO: These two styles should be combined into 'slds-button_icon-border-inverse' when W-4561664 is fixed
            'slds-button_icon-border slds-button_icon-inverse':
                normalizedVariant === 'border-inverse',
            'slds-is-selected': this.selected === true,
            // order classes when part of a button-group
            'slds-button_first': this._order === 'first',
            'slds-button_middle': this._order === 'middle',
            'slds-button_last': this._order === 'last',
        });
        return classes.toString();
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
