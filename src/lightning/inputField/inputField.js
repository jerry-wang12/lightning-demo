import { LightningElement, api, track } from 'lwc';
import {
    getUiField,
    Fields,
    getCompoundFields,
    isCompoundField,
    isPersonAccount,
    compoundFieldIsUpdateable,
} from 'lightning/fieldUtils';
import * as depUtils from './dependencyUtils';

const NUMBER_TYPES = [
    Fields.DECIMAL,
    Fields.INT,
    Fields.PERCENT,
    Fields.CURRENCY,
    Fields.DOUBLE,
];

const UNSUPPORTED_REF_FIELDS = ['OwnerId', 'CreatedById', 'LastModifiedById'];

const STATE_CODE = 'StateCode';
const COUNTRY_CODE = 'CountryCode';

function uncapitalize(str) {
    return `${str[0].toLowerCase()}${str.slice(1)}`;
}

function isUnsupportedReferenceField(name) {
    return UNSUPPORTED_REF_FIELDS.indexOf(name) !== -1;
}

// Returns a normalized string name by removing the prefix (e.g. removes 'Billing' from 'BillingStreet' for Address fields)
function removePrefix(str, prefix) {
    return prefix ? str.replace(prefix, '') : str;
}

// Adds a prefix to the string (e.g. adds 'Billing' to 'Street' for Address fields)
function addPrefix(str, prefix) {
    return prefix ? prefix + str : str;
}

function isEmptyObject(obj) {
    // fastest way to do this!
    // eslint-disable-next-line guard-for-in
    for (const name in obj) {
        return false;
    }
    return true;
}

function scaleToDecimalPlaces(scale) {
    return Math.pow(10, -parseInt(scale, 10));
}

/**
 * Returns a map of changed values from a compound field,
 * normalizing the names and capitalization rules
 * @param {Object} originalValue A map of the original values
 * @param {Object} changedValues Values that have changed
 * @param {Object} fieldPrefix The field prefix in the map of original values (e.g. 'Billing' in 'BillingStreet')
 *
 * @returns {Object} Map of changed values
 */
function normalizeCompoundFieldValues(
    originalValue,
    changedValues,
    fieldPrefix
) {
    return Object.keys(originalValue).reduce((ret, rawKey) => {
        const key = removePrefix(rawKey, fieldPrefix);
        // map state and country values to code if code is present,
        // rather than raw value
        let normalizedKey;
        if (key === STATE_CODE || uncapitalize(key) === 'state') {
            normalizedKey = 'province';
        } else if (key === COUNTRY_CODE) {
            normalizedKey = 'country';
        } else {
            normalizedKey = uncapitalize(key);
        }
        const normalizedValue = changedValues[normalizedKey]
            ? changedValues[normalizedKey]
            : null;
        if (normalizedValue !== originalValue[key]) {
            ret[addPrefix(key, fieldPrefix)] = normalizedValue;
        }
        return ret;
    }, {});
}

/**
 * Represents an editable input for a field on a Salesforce object.
 */
export default class LightningInputField extends LightningElement {
    /**
     * The variant changes the appearance of an input field. Accepted variants include standard and label-hidden. This value defaults to standard.
     * @type {string}
     * @default standard
     */
    @api variant;

    /**
     * Specifies whether the input fields are read-only. This value defaults to false.
     * @type {boolean}
     * @default false
     */
    @api readonly = false;

    @track uiField = {};
    @track failed = false;
    @track errorMessage = '';

    @track ready = false;
    @track picklistOptions;
    @track isCompoundField = false;
    @track nameField = {};
    @track addressField = {};
    @track label = '';
    @track required = false;
    @track inlineHelpText = '';
    @track _disabled;
    @track internalValue;
    // needed for lookups
    @track objectInfos;
    @track record;
    @track _fieldName;

    // raw field name is stored to validate that when object filed
    // references are used that the objectApiName matches the form
    _rawFieldName;

    /* state tracking :
       orignalValue is _always_ the value provided via wireRecordUi
       liveValue is the dirty value of the input
       internalValue is the overridden value passed via the setter
    */
    originalValue;

    isDirty = false;
    serverError;
    serverErrorValue;

    connectedCallback() {
        this.classList.add('slds-form-element');
    }

    /**
     * Reserved for internal use.
     * @param {*} record Reserved for internal use.
     */
    @api
    wireRecordUi(record) {
        let uiField;
        // TODO break up wireRecordUi method, too much stuff happening here
        try {
            uiField = getUiField(
                this.fieldName,
                record.record,
                record.objectInfo
            );
        } catch (e) {
            this.failed = true;
            this.errorMessage = `Field "${
                this.fieldName
            }" not found in response.`;
            return;
        }
        this.record = record;
        this.uiField = uiField;
        this.label = uiField.label;
        this.required = uiField.required;
        this.objectInfos = record.objectInfos;
        this.inlineHelpText = uiField.inlineHelpText;

        if (!this.dirty) {
            this.liveValue = uiField.value;
        }

        if (
            this._rawFieldName &&
            this._rawFieldName.objectApiName &&
            this._rawFieldName.objectApiName !== record.objectInfo.apiName
        ) {
            throw new Error(
                `objectApiName (${
                    this._rawFieldName.objectApiName
                }) for field ${
                    this.fieldName
                } does not match the objectApiName provided for the form (${
                    record.objectInfo.apiName
                }).`
            );
        }

        this.originalValue = uiField.value;
        if (
            isCompoundField(
                this.fieldName,
                record.objectInfo,
                isPersonAccount(record.record)
            )
        ) {
            this.isCompoundField = true;
            this.fieldPrefix = this.getFieldPrefix();
            this.initializeCompoundField(uiField, record);
        } else if (
            (!record.createMode && uiField.updateable === false) ||
            (record.createMode && uiField.createable === false)
        ) {
            this._disabled = true;
            this.readonly = true;
        }

        if (!this.isAnyPicklistType && !this.isCompoundField) {
            // compound fields without picklists will be marked ready in initializeCompoundField
            // picklists and compound fields that have picklist constituents will be marked ready after the options are wired
            this.ready = true;
        }
    }

    /**
     * Reserved for internal use
     * @param {*} picklistValues Reserved for internal use
     */
    @api
    wirePicklistValues(picklistValues) {
        // picklist fields rely on the record for dependency management.
        // The initialization logic will fail if record-ui isn't already wired.
        if (!this.record) {
            return;
        }

        this._picklistValues = picklistValues;

        if (this.isAnyPicklistType) {
            this.initializePicklist(this.fieldName);
        } else if (this.isCompoundField) {
            this.initializePicklistsForCompoundField(this.uiField, this.record);
        } else if (this.isTypeCheckbox) {
            // Also need to register checkbox fields that are part of a dependency chain
            this.registerCheckboxDependency();
        }

        this.ready = true;
    }

    initializeCompoundField(uiField, record) {
        const compoundFields = getCompoundFields(
            this.fieldName,
            record.record,
            record.objectInfo
        );

        let compoundField = this.addressField;
        if (uiField.extraTypeInfo === Fields.PERSON_NAME) {
            compoundField = this.nameField;
        }

        if (
            !compoundFieldIsUpdateable(
                compoundFields,
                record.record,
                record.objectInfo
            )
        ) {
            this._disabled = true;
        }

        let hasPicklists = false;
        compoundFields.forEach(field => {
            const fieldName = removePrefix(field, this.fieldPrefix);

            compoundField[fieldName] = getUiField(
                field,
                record.record,
                record.objectInfo
            );
            if (compoundField[fieldName].type === Fields.PICKLIST) {
                hasPicklists = true;
            }
        });

        // if the compound field doesn't have a picklist constituent, mark it ready
        if (!hasPicklists) {
            this.ready = true;
        }
    }

    // TODO this should be removed after records experience updates their code to not rely on this method
    /**
     * Reserved for internal use.
     * @param {*} fieldName Reserved for internal use.
     * @param {*} options Reserved for internal use.
     */
    @api
    updateDependentField(fieldName, options) {
        this.updateFieldOptions(fieldName, options);
        // make sure the component is marked ready
        this.ready = true;
    }

    /**
     * Reserved for internal use.
     * @param {*} errors Reserved for internal use.
     */
    @api
    setErrors(errors) {
        if (
            errors.body &&
            errors.body.output &&
            errors.body.output.fieldErrors &&
            errors.body.output.fieldErrors[this.fieldName]
        ) {
            this.setCustomValidity(
                errors.body.output.fieldErrors[this.fieldName][0].message
            );
            this.serverError = errors.body.output.fieldErrors[this.fieldName];
            this.serverErrorValue = this.value;
        } else {
            this.serverError = undefined;
        }
    }

    /**
     * The field value, which overrides the existing value.
     * @type {string}
     *
     */
    @api
    get value() {
        if (this.dirty) {
            return this.liveValue;
        }
        // "false" is a possible value
        if (this.internalValue !== undefined) {
            return this.internalValue;
        }

        if (this.isTypeNumber && typeof this.originalValue === 'number') {
            // cast numbers to strings
            // to work around W-4561323
            return '' + this.originalValue;
        }

        return this.originalValue;
    }

    set fieldName(name) {
        this._rawFieldName = name;
        if (name.fieldApiName) {
            this._fieldName = name.fieldApiName;
        } else {
            this._fieldName = name;
        }
    }

    /**
     * The API name of the field to be displayed.
     * @type {string}
     */
    @api
    get fieldName() {
        return this._fieldName;
    }

    set value(val) {
        this.internalValue = val;
    }

    /**
     * If present, the field is disabled and users cannot interact with it.
     * Read-only fields are also disabled by default.
     * @type {boolean}
     *
     */
    @api
    get disabled() {
        return this._disabled ? true : false;
    }

    @api
    reportValidity() {
        const input = this.getInputComponent();
        if (input) {
            return input.reportValidity();
        }
        return true;
    }

    set disabled(val) {
        this._disabled = val;
    }

    /**
     * If present, the field has been modified by the user but not saved or submitted.
     * @type {boolean}
     * @default false
     */
    @api
    get dirty() {
        return this.isDirty;
    }

    get isTypeName() {
        return (
            this.isCompoundField &&
            (Fields.PERSON_NAME === this.uiField.extraTypeInfo ||
                Fields.SWITCHABLE_PERSON_NAME === this.uiField.extraTypeInfo)
        );
    }

    get isTypeAddress() {
        return this.uiField.compound && Fields.ADDRESS === this.uiField.type;
    }

    get country() {
        return this.getNormalizedStateCountryField('Country');
    }

    get state() {
        return this.getNormalizedStateCountryField('State');
    }

    getNormalizedStateCountryField(fieldName) {
        if (this.addressField && this.addressField[`${fieldName}Code`]) {
            return this.addressField[`${fieldName}Code`];
        } else if (this.addressField && this.addressField[fieldName]) {
            return this.addressField[fieldName];
        }
        return {};
    }

    get isTypeNumber() {
        return NUMBER_TYPES.includes(this.uiField.type);
    }

    get numberFormatter() {
        let formatter = 'decimal';
        switch (this.uiField.type) {
            case 'Currency':
                formatter = 'currency';
                break;
            case 'Percent':
                formatter = 'percent-fixed';
                break;
            default:
        }
        return formatter;
    }

    get numberStep() {
        switch (this.uiField.type) {
            case 'Currency':
                return 0.01;
            case 'Percent':
            case 'Double':
            case 'Decimal':
                return scaleToDecimalPlaces(this.uiField.scale);
            default:
                return 1;
        }
    }

    // text type is the default
    get isTypeText() {
        return (
            !this.isTypeNumber &&
            !this.isTypePassword &&
            !this.isTypeRichText &&
            !this.isTypeTextArea &&
            !this.isTypeCheckbox &&
            !this.isTypeDate &&
            !this.isTypeDateTime &&
            !this.isTypeEmail &&
            !this.isTypePicklist &&
            !this.isTypeMultiPicklist &&
            !this.isTypeName &&
            !this.isTypeReference &&
            !this.isTypeLocation &&
            !this.isTypeUnsupportedReference &&
            !this.isTypeAddress
        );
    }

    get isTypeRichText() {
        return (
            Fields.TEXTAREA === this.uiField.type &&
            Fields.RICH_TEXTAREA === this.uiField.extraTypeInfo &&
            this.uiField.htmlFormatted
        );
    }

    get isTypeTextArea() {
        return (
            Fields.TEXTAREA === this.uiField.type &&
            Fields.PLAIN_TEXTAREA === this.uiField.extraTypeInfo &&
            !this.uiField.htmlFormatted
        );
    }

    get isTypeCheckbox() {
        return Fields.BOOLEAN === this.uiField.type;
    }

    get isTypePassword() {
        return Fields.ENCRYPTED_STRING === this.uiField.type;
    }

    get isTypeEmail() {
        return Fields.EMAIL === this.uiField.type;
    }

    get isTypeDate() {
        return Fields.DATE === this.uiField.type;
    }

    get isTypeDateTime() {
        return Fields.DATETIME === this.uiField.type;
    }

    get isTypePicklist() {
        return Fields.PICKLIST === this.uiField.type;
    }

    get isTypeMultiPicklist() {
        return Fields.MULTI_PICKLIST === this.uiField.type;
    }

    get canBeControllingField() {
        return this.isTypePicklist || this.isTypeCheckbox;
    }

    get isAnyPicklistType() {
        return this.isTypePicklist || this.isTypeMultiPicklist;
    }

    get isTypeReference() {
        if (this.isTypeUnsupportedReference) {
            return false;
        }
        return Fields.REFERENCE === this.uiField.type;
    }

    get isTypeLocation() {
        return Fields.LOCATION === this.uiField.type;
    }

    get isTypeUnsupportedReference() {
        return isUnsupportedReferenceField(this.fieldName);
    }

    get displayValue() {
        return this.uiField.displayValue;
    }

    /**
     * Lookup needs an array,
     * so this casts the value to an array
     */
    get lookupValues() {
        if (this.value === undefined) {
            return [];
        } else if (Array.isArray(this.value)) {
            return this.value;
        }
        return [this.value];
    }

    renderedCallback() {
        if (!this.ready) {
            this.dispatchEvent(
                // eslint-disable-next-line lightning-global/no-custom-event-bubbling
                new CustomEvent('registerinputfield', {
                    bubbles: true,
                    composed: true,
                    cancelable: true,
                })
            );
        }
    }

    setCustomValidity(message) {
        const input = this.getInputComponent();
        if (input && input.setCustomValidity) {
            input.setCustomValidity(message ? message : '');
            input.showHelpMessageIfInvalid();
        }
    }

    // TODO refactor this function into smaller pieces
    handleChange(e) {
        // ignore change events until ready
        if (!this.ready) {
            return;
        }

        // change events without detail should be ignored
        if (!e.detail) {
            return;
        }

        if (this.isTypeName || this.isTypeAddress || this.isTypeLocation) {
            this.handleCompoundFieldChange(e);
            return;
        }

        if (e.detail.checked !== undefined) {
            this.liveValue = e.detail.checked;
        } else if (this.isTypeReference) {
            // multiselect doesn't actually work yet,
            // normalize falsey values
            this.liveValue = e.detail.value[0] ? e.detail.value[0] : '';
        } else {
            this.liveValue = e.detail.value;
        }

        if (this.liveValue !== this.originalValue) {
            this.isDirty = true;
            if (this.serverError) {
                this.setCustomValidity();
                this.serverError = false;
            }
        } else {
            this.isDirty = false;
        }

        if (this.canBeControllingField) {
            this.dispatchControllerFieldChangeEvent(
                this.fieldName,
                this.liveValue
            );
        }
    }

    handleCompoundFieldChange(e) {
        const newValue = normalizeCompoundFieldValues(
            this.originalValue,
            e.detail,
            this.fieldPrefix
        );
        const countryCodeField = addPrefix(COUNTRY_CODE, this.fieldPrefix);
        // currently input-address return 'province' as both stateCode and state. Having both of these
        // set to the same value returns an API error.
        if (this.originalValue.hasOwnProperty(countryCodeField)) {
            delete newValue[this.fieldPrefix + 'Country'];
            delete newValue[this.fieldPrefix + 'State'];
        }

        // if the newValue is not an empty object
        // this is a dirty record
        if (!isEmptyObject(newValue)) {
            this.isDirty = true;
            // CountryCode is a controlling picklist, so we need to update the options for StateCode
            if (
                newValue[countryCodeField] !== this.liveValue[countryCodeField]
            ) {
                this.dispatchControllerFieldChangeEvent(
                    countryCodeField,
                    newValue[countryCodeField]
                );
            }
            const modifiedObject = Object.assign({}, this.liveValue, newValue);
            this.liveValue = modifiedObject;
        }
    }

    registerCheckboxDependency() {
        // no need to bother with dependency management if there are no picklists in the form.
        if (!this._picklistValues) {
            return;
        }

        const hasDependents = depUtils.hasDependents(
            this.uiField,
            this.record.objectInfo.fields,
            this._picklistValues
        );

        // register checkboxes that are part of a dependency chain
        if (hasDependents) {
            this.dispatchRegisterDependencyEvent(this.fieldName);
        }
    }

    initializePicklistsForCompoundField() {
        const compoundFields = getCompoundFields(
            this.fieldName,
            this.record.record,
            this.record.objectInfo
        );

        let compoundField = this.addressField;
        if (this.uiField.extraTypeInfo === Fields.PERSON_NAME) {
            compoundField = this.nameField;
        }

        compoundFields.forEach(field => {
            const fieldName = removePrefix(field, this.fieldPrefix);

            if (compoundField[fieldName].type === Fields.PICKLIST) {
                this.initializePicklist(field);
            }
        });
    }

    initializePicklist(fieldName) {
        if (!this._picklistValues || !this._picklistValues[fieldName]) {
            throw new Error(
                `Could not find picklist values for field [${fieldName}]`
            );
        }

        // should disable the picklist if the controlling field is missing
        const controllerMissing = depUtils.isControllerMissing(
            this.uiField,
            this.record.objectInfo.fields,
            this._picklistValues
        );
        if (controllerMissing) {
            this.liveValue = '';
            this.picklistOptions = [];
            throw new Error(
                `Field [${
                    this.uiField.controllerName
                }] controls the field [${fieldName}] but was not found in the form`
            );
        }

        // state and country picklists are in a dependency chain, no need to check.
        let isInDependencyChain = false;
        if (this.isTypeAddress) {
            isInDependencyChain = true;
        } else {
            isInDependencyChain =
                this.isAnyPicklistType &&
                depUtils.isInDependencyChain(
                    this.uiField,
                    this.record.objectInfo.fields,
                    this._picklistValues
                );
        }

        if (isInDependencyChain) {
            // initializing picklists in empty state, dependency manager will later update the options.
            this.picklistOptions = [];
            this.dispatchRegisterDependencyEvent(fieldName);
        } else {
            // regular picklist field not within a dependency chain
            this.picklistOptions = this._picklistValues[fieldName].values;
        }
    }

    updateFieldOptions(fieldName, options) {
        if (this.isTypeAddress) {
            const field = removePrefix(fieldName, this.fieldPrefix);
            this.addressField[field].options = options;
        } else if (this.isAnyPicklistType) {
            this.picklistOptions = options;
        }
    }

    getFieldPrefix() {
        if (this.isTypeAddress) {
            // Address fields usually have a prefix, e.g. `BillingStreet` or `ShippingStreet`
            return this.fieldName.split(/Address$/)[0];
        }
        return null;
    }

    dispatchRegisterDependencyEvent(fieldName) {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('registerfielddependency', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    fieldName,
                    // field-dependency-manager only needs the update method and the live value of the input-field
                    fieldElement: {
                        updateFieldOptions: this.updateFieldOptions.bind(this),
                        getFieldValue: () => {
                            return this.value;
                        },
                    },
                },
            })
        );
    }

    dispatchControllerFieldChangeEvent(fieldName, value) {
        this.dispatchEvent(
            // eslint-disable-next-line lightning-global/no-custom-event-bubbling
            new CustomEvent('updatedependentfields', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: { fieldName, value },
            })
        );
    }

    getInputComponent() {
        return this.template.querySelector(
            'lightning-input,lightning-textarea,lightning-picklist,lightning-lookup'
        );
    }
}
