import * as CONSTANTS from './constants';
import { api, LightningElement } from 'lwc';
import { getFormFactor } from 'lightning/configProvider';

export default class LightningLookup extends LightningElement {
    // ================================================================================
    // PUBLIC PROPERTIES
    // ================================================================================
    /**
     * Checks the lookup validity, and fires an 'invalid' event if it's in invalid state.
     * @return {Boolean} - The validity status of the lookup.
     */
    @api
    checkValidity() {
        const lookup = this.template.querySelector(this._lookupSelector);

        if (lookup) {
            return lookup.checkValidity();
        }

        return false;
    }

    /**
     * Indicates whether the field is disabled.
     * @type {Boolean}
     */
    @api disabled = false;

    /**
     * The lookup name api field.
     * @type {String}
     */
    @api fieldName;

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (!this._connected) {
            return;
        }

        const lookup = this.template.querySelector(this._lookupSelector);

        if (lookup) {
            lookup.focus();
        }
    }

    /**
     * The text label for the layout field.
     * @type {String}
     */
    @api label;

    /**
     * The maximum number of records that can be inserted in the lookup.
     * @type {Number}
     */
    @api maxValues = 1;

    /**
     * The source record's objectInfos.
     * @param {Object}
     */
    @api objectInfos;

    /**
     * The source record representation.
     * @type {Object}
     */
    @api record;

    /**
     * Shows validation message based on the validity status.
     * @return {Boolean} - The validity status of the lookup.
     */
    @api
    reportValidity() {
        const lookup = this.template.querySelector(this._lookupSelector);

        if (lookup) {
            return lookup.reportValidity();
        }

        return false;
    }

    /**
     * Sets a custom validity message.
     * @param {String} message - The validation message to be shown in an error state.
     */
    @api
    setCustomValidity(message) {
        const lookup = this.template.querySelector(this._lookupSelector);

        if (lookup) {
            lookup.setCustomValidity(message);
        }
    }

    /**
     * Indicates whether or not the show create new option.
     * TODO - Remove when @wire(getLookupActions) response is invocable.
     * @type {Boolean}
     */
    @api showCreateNew = false;

    /**
     * Displays a validation message if the lookup is in invalid state.
     */
    @api
    showHelpMessageIfInvalid() {
        const lookup = this.template.querySelector(this._lookupSelector);

        if (lookup) {
            lookup.showHelpMessageIfInvalid();
        }
    }

    /**
     * Gets the validity constraint of the lookup.
     * @return {Object} - The current validity constraint.
     */
    @api
    get validity() {
        const lookup = this.template.querySelector(this._lookupSelector);

        if (lookup) {
            return lookup.validity;
        }

        return null;
    }

    /**
     * The record ids for the selected lookup record.
     * @param {Array}
     */
    @api values;

    // ================================================================================
    // PRIVATE PROPERTIES
    // ================================================================================
    /**
     * Indiciates whether or not the component is connected.
     * @type {Boolean}
     */
    _connected = false;

    /**
     * Indiciates whether or not the component is loaded on the desktop form
     * factor.
     * @type {Boolean}
     */
    _isDesktop;

    /**
     * The query selector corresponding to the child lookup implementation.
     * @type {String}
     */
    _lookupSelector;

    // ================================================================================
    // ACCESSOR METHODS
    // ================================================================================
    /**
     * Getter used for determing if on the DESKTOP form factor.
     * @return {Boolean} true if on DESKTOP, false otherwise.
     */
    get isDesktop() {
        return this._isDesktop;
    }

    // ================================================================================
    // LIFECYCLE METHODS
    // ================================================================================
    constructor() {
        super();
        const formFactor = getFormFactor();
        this._isDesktop = formFactor === CONSTANTS.FORM_FACTOR_DESKTOP;
        this._lookupSelector = this._isDesktop
            ? CONSTANTS.LIGHTNING_LOOKUP_DESKTOP
            : CONSTANTS.LIGHTNING_LOOKUP_MOBILE;
    }

    connectedCallback() {
        this._connected = true;
    }

    disconnectedCallback() {
        this._connected = false;
    }
}
