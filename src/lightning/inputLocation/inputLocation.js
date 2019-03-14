import labelCoordinateIsRequired from '@salesforce/label/LightningInputLocation.coordinateIsRequired';
import labelInvalidLatitude from '@salesforce/label/LightningInputLocation.invalidLatitude';
import labelInvalidLongitude from '@salesforce/label/LightningInputLocation.invalidLongitude';
import labelLatitude from '@salesforce/label/LightningInputLocation.latitude';
import labelLongitude from '@salesforce/label/LightningInputLocation.longitude';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    normalizeString,
} from 'lightning/utilsPrivate';
import { validateCoordinate } from './geolocation';
import {
    isEmptyString,
    InteractingState,
    normalizeVariant,
    FieldConstraintApi,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    coordinateIsRequired: labelCoordinateIsRequired,
    invalidLatitude: labelInvalidLatitude,
    invalidLongitude: labelInvalidLongitude,
    latitude: labelLatitude,
    longitude: labelLongitude,
};

/**
 * Represents a geolocation compound field that accepts a latitude and longitude value.
 */
export default class LightningInputLocation extends LightningElement {
    /**
     * The label of the input location field.
     * @type {string}
     */
    @api label;

    /**
     * Help text detailing the purpose and function of the input.
     * @type {string}
     */
    @api fieldLevelHelp;

    @track
    state = {
        latitude: '',
        longitude: '',
        disabled: false,
        readonly: false,
        required: false,
    };

    @track _variant;

    connectedCallback() {
        this._connected = true;

        this.interactingState = new InteractingState({
            // keeps interacting state when switch between latitude and longitude
            debounceInteraction: true,
        });

        this.interactingState.onenter(() => {
            this.dispatchEvent(new CustomEvent('focus'));
        });

        this.interactingState.onleave(() => {
            this.reportValidity();
            this.dispatchEvent(new CustomEvent('blur'));
        });

        this.classList.add('slds-form-compound');
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * The latitude value. Latitude values must be within -90 and 90.
     * @type {string}
     *
     */
    @api
    get latitude() {
        return this.state.latitude;
    }

    set latitude(value) {
        //  Converting the value to string when value is of type decimal to be consistent
        if (value != null) {
            value = value.toString();
        }
        this.state.latitude = normalizeString(value);
    }

    /**
     * The longitude value. Longitude values must be within -180 and 180.
     * @type {string}
     *
     */
    @api
    get longitude() {
        return this.state.longitude;
    }

    set longitude(value) {
        //  Converting the value to string when value is of type decimal to be consistent
        if (value != null) {
            value = value.toString();
        }
        this.state.longitude = normalizeString(value);
    }

    /**
     * If present, the input location fields are disabled and users cannot interact with them.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this.state.disabled;
    }

    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
    }

    /**
     * If present, the input locations fields are read-only and cannot be edited.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this.state.readonly;
    }

    set readOnly(value) {
        this.state.readonly = normalizeBoolean(value);
    }

    /**
     * If present, the input location field must be filled out before the form is submitted.
     * An error message is displayed if a user interacts with the field
     * and does not provide a value.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this.state.required;
    }

    set required(value) {
        this.state.required = normalizeBoolean(value);
    }

    /**
     * The variant changes the appearance of an input field. Accepted variants include standard and label-hidden. This value defaults to standard.
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
     * Sets focus on the latitude field.
     */
    @api
    focus() {
        if (this._connected) {
            this.getCoordinateElement('latitude').focus();
        }
    }

    /**
     * Removes keyboard focus from the latitude and longitude fields.
     */
    @api
    blur() {
        if (this._connected) {
            this.getCoordinateElement('latitude').blur();
            this.getCoordinateElement('longitude').blur();
        }
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     *
     */
    @api
    get validity() {
        return this._combinedConstraint.validity;
    }

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the latitude and longitude field meet all constraint validations.
     */
    @api
    checkValidity() {
        return this._combinedConstraint.checkValidity();
    }

    /**
     * Displays error messages on the latitude or longitude field if the coordinates are invalid.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Sets a custom error message to be displayed for the latitude or longitude field when
     * the input location value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     * @param {string} fieldName - Name of the field, which must be latitude or longitude.
     */
    @api
    setCustomValidityForField(message, fieldName) {
        assert(
            ['latitude', 'longitude'].indexOf(fieldName) >= 0,
            '"fieldName" must be "latitude" or "longitude"'
        );
        this._coordinateConstraints[fieldName].setCustomValidity(message);
    }

    @api
    reportValidity() {
        const valid = this.checkValidity();

        if (!this._connected) {
            return valid;
        }

        Object.keys(this._coordinateConstraints).forEach(coordinate => {
            this._reportValidityForCoordinate(coordinate);
        });

        return valid;
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLegendClass() {
        return classSet('slds-form-element__label slds-form-element__legend')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleLatitudeBlur() {
        this.interactingState.leave();
        this._reportValidityForCoordinate('latitude');
    }

    handleLongitudeBlur() {
        this.interactingState.leave();
        this._reportValidityForCoordinate('longitude');
    }

    handleFocus() {
        this.interactingState.enter();
    }

    handleLatitudeChange(event) {
        this.handleChange('latitude', event);
    }

    handleLongitudeChange(event) {
        this.handleChange('longitude', event);
    }

    handleChange(coordinate, event) {
        event.stopPropagation();
        const value = event.detail.value;
        if (this.state[coordinate] === value) {
            // Value didn't change. No need to dispatch.
            return;
        }

        // Update component state accordingly
        if (coordinate === 'longitude') {
            this.state.longitude = value;
        } else if (coordinate === 'latitude') {
            this.state.latitude = value;
        }

        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    latitude: this.latitude,
                    longitude: this.longitude,
                },
            })
        );
    }

    get _coordinateConstraints() {
        if (!this._coordinateConstraintApis) {
            this._coordinateConstraintApis = ['latitude', 'longitude'].reduce(
                (constraints, coordinate) => {
                    const constraintProviders = {
                        badInput: () =>
                            !this.disabled &&
                            !isEmptyString(this[coordinate]) &&
                            !validateCoordinate(coordinate, this[coordinate]),
                        valueMissing: () =>
                            !this.disabled &&
                            this.required &&
                            isEmptyString(this[coordinate]),
                    };
                    constraints[coordinate] = new FieldConstraintApi(
                        this.getCoordinateElement.bind(this, coordinate),
                        constraintProviders
                    );
                    return constraints;
                },
                {}
            );
        }
        return this._coordinateConstraintApis;
    }

    get _combinedConstraint() {
        if (!this._combinedConstraintApi) {
            const { _coordinateConstraints } = this;
            const checkCoordinates = property =>
                Object.values(_coordinateConstraints).some(
                    coordinateConstraint =>
                        coordinateConstraint.validity[property]
                );
            this._combinedConstraintApi = new FieldConstraintApi(() => this, {
                customError: () => checkCoordinates('customError'),
                badInput: () => checkCoordinates('badInput'),
                valueMissing: () => checkCoordinates('valueMissing'),
            });
        }
        return this._combinedConstraintApi;
    }

    getCoordinateElement(fieldName) {
        const propertyName = `_${fieldName}Element`;
        if (!this[propertyName]) {
            this[propertyName] = this.template.querySelector(
                `lightning-input[data-${fieldName}]`
            );
        }
        return this[propertyName];
    }

    _reportValidityForCoordinate(coordinate) {
        this._coordinateConstraints[coordinate].reportValidity(helpMessage => {
            const coordinateElement = this.getCoordinateElement(coordinate);
            coordinateElement.setCustomValidity(helpMessage);
            coordinateElement.reportValidity();
        });
    }
}
