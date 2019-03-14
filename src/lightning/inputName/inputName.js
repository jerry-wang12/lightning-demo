import labelFirstName from '@salesforce/label/LightningInputName.firstName';
import labelInformalName from '@salesforce/label/LightningInputName.informalName';
import labelLastName from '@salesforce/label/LightningInputName.lastName';
import labelMiddleName from '@salesforce/label/LightningInputName.middleName';
import labelNone from '@salesforce/label/LightningInputName.none';
import labelRequired from '@salesforce/label/LightningControl.required';
import labelSalutation from '@salesforce/label/LightningInputName.salutation';
import labelSuffix from '@salesforce/label/LightningInputName.suffix';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { assert, normalizeBoolean } from 'lightning/utilsPrivate';
import {
    isEmptyString,
    InteractingState,
    FieldConstraintApi,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';
import { getFieldsOrder } from './nameFormatter';

const FIELD_TYPE = {
    INPUT: 'input',
    PICKLIST: 'combobox',
};

const DEFAULT_MAXLENGTH = 40;

const DEFAULT_FIELD_META = {
    salutation: { inputType: FIELD_TYPE.PICKLIST },
    firstName: {},
    middleName: {},
    informalName: {},
    lastName: { maxlength: 80, required: true },
    suffix: {},
};

const i18n = {
    firstName: labelFirstName,
    informalName: labelInformalName,
    lastName: labelLastName,
    middleName: labelMiddleName,
    none: labelNone,
    required: labelRequired,
    salutation: labelSalutation,
    suffix: labelSuffix,
};

/**
 * Represents a name compound field.
 */
export default class LightningInputName extends LightningElement {
    /**
     * The label of the input name field.
     * @type {string}
     */
    @api label;
    /**
     * Displays a list of salutation options, such as Dr. or Mrs., provided as label-value pairs.
     * @type {list}
     */
    @api options;
    /**
     * List of fields to be displayed on the component. This value defaults to
     * ['firstName', 'salutation', 'lastName']. Other field values include middleName,
     * informalName, suffix.
     * @type {list}
     */
    @api fieldsToDisplay = ['firstName', 'salutation', 'lastName'];

    @track
    state = {
        salutation: '',
        lastName: '',
        firstName: '',
        middleName: '',
        informalName: '',
        suffix: '',
        disabled: false,
        readonly: false,
        required: false,
    };

    @track _variant;
    @track _fieldLevelHelp;

    connectedCallback() {
        this._connected = true;
        this.classList.add('slds-form-compound');
        this.interactingState = new InteractingState({
            debounceInteraction: true,
        });
        this.interactingState.onenter(() => {
            this.dispatchEvent(new CustomEvent('focus'));
        });
        this.interactingState.onleave(() => {
            this.showHelpMessageIfInvalid();
            this.dispatchEvent(new CustomEvent('blur'));
        });
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Displays the Salutation field as a dropdown menu. An array of label-value pairs must be provided using the options attribute.
     * @type {string}
     *
     */
    @api
    get salutation() {
        return this.state.salutation;
    }

    set salutation(value) {
        this.state.salutation = value;
    }

    /**
     * Displays the First Name field.
     * @type {string}
     *
     */
    @api
    get firstName() {
        return this.state.firstName;
    }

    set firstName(value) {
        this.state.firstName = value;
    }

    /**
     * Displays the Middle Name field.
     * @type {string}
     *
     */
    @api
    get middleName() {
        return this.state.middleName;
    }

    set middleName(value) {
        this.state.middleName = value;
    }

    /**
     * Displays the Informal Name field.
     * @type {string}
     *
     */
    @api
    get informalName() {
        return this.state.informalName;
    }

    set informalName(value) {
        this.state.informalName = value;
    }

    /**
     * Displays the Last Name field.
     * @type {string}
     *
     */
    @api
    get lastName() {
        return this.state.lastName;
    }

    set lastName(value) {
        this.state.lastName = value;
    }

    /**
     * Displays the Suffix field.
     * @type {string}
     *
     */
    @api
    get suffix() {
        return this.state.suffix;
    }

    set suffix(value) {
        this.state.suffix = value;
    }

    /**
     * If present, the input name field is disabled and users cannot interact with it.
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
     * If present, the input name field is read-only and cannot be edited.
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
     * If present, the input name field must be filled out before the form is submitted.
     * A red asterisk is displayed on the Last Name field. An error
     * message is displayed if a user interacts with the Last Name
     * field and does not provide a value.
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
     * Sets focus on the first input field.
     */
    @api
    focus() {
        this.template.querySelector('[data-field]').focus();
    }

    /**
     * Removes keyboard focus from the input element.
     */
    @api
    blur() {
        const inputs = this.template.querySelectorAll('[data-field]');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].blur();
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
     * @returns {boolean} Indicates whether the element meets all constraint validations.
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
     * Sets a custom error message to be displayed for the input name fields when
     * the input value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message is reset.
     * @param {string} fieldName - The name of the input name field.
     */
    @api
    setCustomValidityForField(message, fieldName) {
        assert(
            DEFAULT_FIELD_META[fieldName] !== undefined,
            `Invalid 'fieldName': ${fieldName}`
        );
        this._fieldConstraints[fieldName].setCustomValidity(message);
    }

    @api
    reportValidity() {
        const valid = this.checkValidity();

        if (!this._connected) {
            return valid;
        }
        this.fieldsToDisplay.forEach(field => {
            this._reportValidityForField(field);
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
        const value = event.detail.value;

        const fieldName = event.target.dataset.field;
        if (this.getFieldValue(fieldName) === value) {
            // Value didn't change. No need to dispatch.
            return;
        }

        // update the value for changing field
        this.state[fieldName] = value;
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    salutation: this.salutation,
                    firstName: this.firstName,
                    middleName: this.middleName,
                    lastName: this.lastName,
                    informalName: this.informalName,
                    suffix: this.suffix,
                    validity: this.validity,
                },
            })
        );
    }

    initializeFieldsMetaData(fieldsOrder) {
        const fields = [];

        // setup what fields are needed with the field name
        fieldsOrder.forEach(fieldName => {
            fields.push({ name: fieldName });
        });

        return fields;
    }

    getFieldObject(field) {
        const fieldDefault = DEFAULT_FIELD_META[field];
        const value = this[field];
        const label = this.i18n[field];
        const fieldsToDisplay = this.fieldsToDisplay.map(fieldName => {
            return fieldName.toUpperCase();
        });
        if (fieldsToDisplay.indexOf(field.toUpperCase()) > -1) {
            return {
                isInput: fieldDefault.inputType !== 'combobox',
                isCombobox: fieldDefault.inputType === 'combobox',
                required: fieldDefault.required && this.required,
                options: this.options,
                placeholder:
                    fieldDefault.inputType === 'combobox'
                        ? this.i18n.none
                        : label,
                maxlength: fieldDefault.maxlength || DEFAULT_MAXLENGTH,
                name: field,
                label,
                value,
            };
        }
        return null;
    }

    get fieldsMetaData() {
        const fieldsOrder = getFieldsOrder();
        const fieldsData = this.initializeFieldsMetaData(fieldsOrder);
        const fields = [];
        fieldsData.forEach(row => {
            const fieldName = row.name;
            const fieldObject = this.getFieldObject(fieldName);
            if (fieldObject) {
                fields.push(fieldObject);
            }
        });
        return fields;
    }

    getFieldValue(fieldName) {
        return this[fieldName];
    }

    getFieldElement(fieldName) {
        return this.template.querySelector(`[data-field="${fieldName}"]`);
    }

    get _fieldConstraints() {
        if (!this._fieldConstraintApis) {
            // For every field to display create an appropriate constraint
            this._fieldConstraintApis = Object.keys(DEFAULT_FIELD_META).reduce(
                (constraints, field) => {
                    constraints[field] = new FieldConstraintApi(
                        () => this.getFieldElement(field),
                        {
                            valueMissing: () =>
                                !this.disabled &&
                                this.required &&
                                this.fieldsToDisplay.indexOf(field) >= 0 &&
                                DEFAULT_FIELD_META[field].required &&
                                isEmptyString(this[field]),
                        }
                    );
                    return constraints;
                },
                {}
            );
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
