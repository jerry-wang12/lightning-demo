import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { assert, normalizeBoolean } from 'lightning/utilsPrivate';
import {
    isEmptyString,
    FieldConstraintApi,
    InteractingState,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';
import { getInputOrder, getRequiredFields } from './addressFormat';
import {
    getFieldWidth,
    getFieldWidthClass,
    getTransformedFieldsMetaForLayout,
} from './fieldsLayout';
// eslint-disable-next-line lwc/no-aura-libs
import { utils as localeUtils } from 'lightning:IntlLibrary';

const FIELD_TYPE = {
    TEXTAREA: 'textarea',
    INPUT: 'input',
    PICKLIST: 'combobox',
};

const i18n = {
    required: labelRequired,
};
/**
 * Represents an address compound field.
 */
export default class LightningInputAddress extends LightningElement {
    /**
     * The label of the address compound field.
     * @type {string}
     */
    @api addressLabel;

    /**
     * The label of the street field of the address.
     * @type {string}
     */
    @api streetLabel;

    /**
     * The label of the city field of the address.
     * @type {string}
     */
    @api cityLabel;

    /**
     * The label of the province field of the address.
     * @type {string}
     */
    @api provinceLabel;

    /**
     * The label of the country field of the address.
     * @type {string}
     */
    @api countryLabel;

    /**
     * The label of the postal code field of the address.
     * @type {string}
     */
    @api postalCodeLabel;

    /**
     * The array of label-value pairs for the province. Displays a dropdown menu of options.
     * @type {list}
     */
    @api provinceOptions;

    /**
     * The array of label-value pairs for the country. Displays a dropdown menu of options.
     * @type {list}
     */
    @api countryOptions;

    @track _showAddressLookup;
    @track _fieldLevelHelp;
    @track _variant;

    @track
    state = {
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',

        disabled: false,
        readonly: false,
        required: false,
    };

    connectedCallback() {
        this._connected = true;

        this.classList.add('slds-form_compound');
        this.interactingState = new InteractingState({
            debounceInteraction: true,
        });
        this.interactingState.onenter(() => {
            this.dispatchEvent(new CustomEvent('focus'));
        });
        this.interactingState.onleave(() => {
            this.reportValidity();
            this.dispatchEvent(new CustomEvent('blur'));
        });
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * The street field of the address.
     * @type {string}
     *
     */
    @api
    get street() {
        return this.state.street;
    }
    set street(value) {
        this.state.street = value;
    }

    /**
     * The city field of the address.
     * @type {string}
     *
     */
    @api
    get city() {
        return this.state.city;
    }
    set city(value) {
        this.state.city = value;
    }

    /**
     * The province field of the address. If province-options is provided, this province value is selected by default.
     * @type {string}
     *
     */
    @api
    get province() {
        return this.state.province;
    }
    set province(value) {
        this.state.province = value;
    }

    /**
     * The country field of the address. If country-options is provided, this country value is selected by default.
     * @type {string}
     *
     */
    @api
    get country() {
        return this.state.country;
    }
    set country(value) {
        this.state.country = value;
    }

    /**
     * The postal code field of the address.
     * @type {string}
     *
     */
    @api
    get postalCode() {
        return this.state.postalCode;
    }
    set postalCode(value) {
        this.state.postalCode = value;
    }

    /**
     * If present, the address fields are disabled and users cannot interact with them.
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
     * If present, address lookup using Google Maps is enabled.
     * @type {boolean}
     * @default false
     */
    @api
    get showAddressLookup() {
        return this._showAddressLookup;
    }
    set showAddressLookup(value) {
        this._showAddressLookup = normalizeBoolean(value);
    }

    /**
     * If present, the address fields are read-only and cannot be edited.
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
     * If present, the address fields must be filled before the form is submitted.
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
     * The variant changes the appearance of an input address field. Accepted variants include standard and label-hidden. This value defaults to standard.
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

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    /**
     * Help text detailing the purpose and function of the input.
     * @type {string}
     *
     */
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
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
     * Checks if the input is valid.
     * @returns {boolean} Indicates whether the element meets all constraint validations.
     */
    @api
    checkValidity() {
        return this._combinedConstraint.checkValidity();
    }

    /**
     * Displays error messages on the address fields if the values are invalid.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    /**
     * Sets a custom error message to be displayed for the specified fieldName when
     * the input address value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     * @param {string} fieldName - Name of the field, which must be one of the following: street, city, province, postalCode, country.
     */
    @api
    setCustomValidityForField(message, fieldName) {
        assert(
            this.fieldsMeta[fieldName] !== undefined,
            `Invalid 'fieldName': ${fieldName}`
        );
        this._fieldConstraints[fieldName].setCustomValidity(message);
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the input fields.
     */
    @api
    reportValidity() {
        const valid = this.checkValidity();

        if (!this._connected) {
            return valid;
        }
        this.inputOrder.forEach(field => {
            this._reportValidityForField(field);
        });

        return valid;
    }

    /**
     * Sets focus on the first input element.
     */
    @api
    focus() {
        this.template.querySelector('[data-field]').focus();
    }

    /**
     * Removes focus from all input fields.
     */
    @api
    blur() {
        Array.prototype.forEach.call(
            this.template.querySelectorAll('[data-field]'),
            field => field.blur()
        );
    }

    get searchAddressButtonDisabled() {
        return this.disabled || this.readOnly;
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

    get fieldsTypeMeta() {
        return {
            street: {
                name: 'street',
                maxlength: 255,
                type: FIELD_TYPE.TEXTAREA,
            },
            city: {
                name: 'city',
                maxlength: 40,
                type: FIELD_TYPE.INPUT,
            },
            province: {
                name: 'province',
                maxlength: 80,
                type: Array.isArray(this.provinceOptions)
                    ? FIELD_TYPE.PICKLIST
                    : FIELD_TYPE.INPUT,
            },
            postalCode: {
                name: 'postalCode',
                maxlength: 20,
                type: FIELD_TYPE.INPUT,
            },
            country: {
                name: 'country',
                maxlength: 80,
                type: Array.isArray(this.countryOptions)
                    ? FIELD_TYPE.PICKLIST
                    : FIELD_TYPE.INPUT,
            },
        };
    }

    get inputOrder() {
        const hasCountryPicklist =
            this.fieldsTypeMeta.country.type === FIELD_TYPE.PICKLIST;
        const [langCode, countryCode] = localeUtils.getLocaleTag().split('-');
        return getInputOrder(langCode, countryCode, hasCountryPicklist);
    }

    get requiredFields() {
        const [langCode, countryCode] = localeUtils.getLocaleTag().split('-');
        return getRequiredFields(langCode, countryCode);
    }

    get fieldsMeta() {
        const fieldsMeta = {};
        this.inputOrder.forEach(name => {
            fieldsMeta[name] = Object.assign(
                {},
                this.fieldsTypeMeta[name],
                getFieldWidth(name)
            );
        });
        this.requiredFields.forEach(name => {
            fieldsMeta[name].required = true;
        });
        return fieldsMeta;
    }

    get domFieldsMeta() {
        let rowKey = 0;
        const out = getTransformedFieldsMetaForLayout(
            this.fieldsMeta,
            this.inputOrder
        ).map(row => {
            const rowList = row.map(field => {
                const { name, type, required, maxlength } = field;
                const label = this.getFieldLabel(name);
                const widthClass = getFieldWidthClass(field);

                return {
                    isInput: type === FIELD_TYPE.INPUT,
                    isPicklist: type === FIELD_TYPE.PICKLIST,
                    isTextArea: type === FIELD_TYPE.TEXTAREA,
                    value: this.getFieldValue(name),
                    options: this.getFieldOptions(name),
                    required: this.required && !!required,
                    classnames: `slds-form-element slds-show ${widthClass}`,
                    placeholder: label,
                    label,
                    maxlength,
                    name,
                };
            });
            rowList.name = rowKey++;
            return rowList;
        });

        return out;
    }

    handleAddress(evt) {
        const address = evt.detail.address || {};

        this.street = address.street || '';
        this.city = address.city || '';
        this.province = address.state || '';
        this.country = address.country || '';
        this.postalCode = address.postalCode || '';

        this.dispatchAddressChangeEvent();
    }

    handleFocus() {
        this.interactingState.enter();
    }

    handleBlur(event) {
        this.interactingState.leave();

        const field = event.target.dataset.field;
        this._reportValidityForField(field);
    }

    handleChange(event) {
        event.stopPropagation();

        const fieldName = event.target.dataset.field;
        const value = event.detail.value;
        if (this.getFieldValue(fieldName) === value) {
            // Value didn't change. No need to dispatch.
            return;
        }

        this.state[fieldName] = value;

        this.dispatchAddressChangeEvent();
    }

    dispatchAddressChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    street: this.street,
                    city: this.city,
                    province: this.province,
                    country: this.country,
                    postalCode: this.postalCode,
                    validity: this.validity,
                },
            })
        );
    }

    getFieldValue(fieldName) {
        return this[fieldName];
    }

    getFieldOptions(fieldName) {
        return this[`${fieldName}Options`];
    }

    getFieldLabel(fieldName) {
        return this[`${fieldName}Label`];
    }

    getFieldElement(fieldName) {
        return this.template.querySelector(`[data-field="${fieldName}"]`);
    }

    get _fieldConstraints() {
        if (!this._fieldConstraintApis) {
            // For every field to display create an appropriate constraint
            this._fieldConstraintApis = [
                'street',
                'city',
                'province',
                'country',
                'postalCode',
            ].reduce((constraints, field) => {
                constraints[field] = new FieldConstraintApi(
                    () => this.getFieldElement(field),
                    {
                        valueMissing: () =>
                            !this.disabled &&
                            this.required &&
                            this.requiredFields.indexOf(field) >= 0 &&
                            isEmptyString(this[field]),
                    }
                );
                return constraints;
            }, {});
        }
        return this._fieldConstraintApis;
    }

    get _combinedConstraint() {
        if (!this._combinedConstraintApi) {
            this._combinedConstraintApi = new FieldConstraintApi(() => this, {
                customError: () =>
                    Object.values(this._fieldConstraints).some(
                        constraint => constraint.validity.customError
                    ),
                valueMissing: () =>
                    Object.values(this._fieldConstraints).some(
                        constraint => constraint.validity.valueMissing
                    ),
            });
        }
        return this._combinedConstraintApi;
    }

    _reportValidityForField(field) {
        if (this._fieldConstraints[field]) {
            this._fieldConstraints[field].reportValidity(helpMessage => {
                const fieldElement = this.getFieldElement(field);
                fieldElement.setCustomValidity(helpMessage);
                fieldElement.reportValidity();
            });
        }
    }
}
