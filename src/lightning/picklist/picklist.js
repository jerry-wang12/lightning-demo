import labelNoneLabel from '@salesforce/label/LightningPicklist.noneLabel';
import labelAvailable from '@salesforce/label/LightningPicklist.available';
import labelChosen from '@salesforce/label/LightningPicklist.chosen';
import { LightningElement, track, api } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { getFormFactor } from 'lightning/configProvider';

const i18n = {
    noneLabel: labelNoneLabel,
    available: labelAvailable,
    chosen: labelChosen,
};

export default class LightningPicklist extends LightningElement {
    // The value that is passed into the sub-components. dual-listbox accepts an array whereas combobox expects a string
    @track _internalValue;
    // The value (String) returned by the picklist. In the multi case, the values are separated by a semicolon
    @track _picklistValue;
    @track _options;
    @track _required = false;
    @track _disabled = false;
    @track _size = 4;
    @track _showActivityIndicator = false;
    @track _fieldLevelHelp;

    @api label;
    @api name;
    @api placeholder;
    @api variant;

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    set value(newValue) {
        this._picklistValue = newValue;

        if (this.connected) {
            this._internalValue = this.getInternalValue(newValue);
        }
    }
    @api
    get value() {
        return this._picklistValue;
    }

    // only works for multi-select picklists
    set size(value) {
        this._size = this.normalizeSize(value);
    }
    @api
    get size() {
        return this._size;
    }

    set options(newOptions) {
        this._options = newOptions;

        if (this.connected) {
            this.updatePicklistOptions(newOptions);
        }
    }
    @api
    get options() {
        return this._options;
    }

    set multiple(value) {
        this._multiple = normalizeBoolean(value);
    }
    @api
    get multiple() {
        return this._multiple || false;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
        // reset the flag that hides the required indicator when we have no options
        this._requiredButDisabled = false;
    }
    @api
    get required() {
        return this._required;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);

        // There are two ways a picklist could end up in a disabled state:
        // 1- explicitly setting disabled and 2- when the picklist has no options
        // If the element is explicitly set to be disabled, it should always remain disabled even when new options are provided
        this._externalDisabled = this._disabled;
    }
    @api
    get disabled() {
        return this._disabled;
    }

    set showActivityIndicator(value) {
        this._showActivityIndicator = normalizeBoolean(value);
    }
    @api
    get showActivityIndicator() {
        return this._showActivityIndicator || false;
    }

    connectedCallback() {
        this.updatePicklistOptions(this._options, true);

        this.connected = true;
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api
    focus() {
        this.getElement.focus();
    }

    @api
    blur() {
        this.getElement.blur();
    }

    @api
    get validity() {
        return this.getElement.validity;
    }

    @api
    checkValidity() {
        return this.validity.valid;
    }

    @api
    setCustomValidity(message) {
        this.getElement.setCustomValidity(message);
    }

    @api
    reportValidity() {
        return this.getElement.reportValidity();
    }

    @api
    showHelpMessageIfInvalid() {
        this.getElement.showHelpMessageIfInvalid();
    }

    get i18n() {
        return i18n;
    }

    get internalValue() {
        return this._internalValue;
    }

    get getElement() {
        return this.template.querySelector(
            'lightning-combobox,lightning-dual-listbox,lightning-primitive-select'
        );
    }

    // disable reordering functionality on dual-listbox
    get disableReordering() {
        return true;
    }

    get isDesktop() {
        return getFormFactor() === 'DESKTOP';
    }

    updatePicklistOptions(options, addMissingValues) {
        const newOptions = options ? [...options] : [];
        const existingInternalValue =
            this.internalValue !== undefined
                ? this.internalValue
                : this.getInternalValue(this._picklistValue);

        if (addMissingValues) {
            this.addMissingValuesToOptions(newOptions, existingInternalValue);
        }

        this.maybeAddNoneOption(newOptions);
        this._options = newOptions;

        this.updateDisabledState(options);
        this.updateRequiredState(options);

        const value = this.getValueToSelect(
            this.options,
            existingInternalValue
        );
        this._internalValue = value;

        if (!this.isSameValue(value, existingInternalValue)) {
            this._picklistValue = this.getPicklistValue(value);
            this.dispatchChangeEvent();
        }
    }

    isSameValue(value1, value2) {
        if (Array.isArray(value1) && Array.isArray(value2)) {
            return value1.sort().join(',') === value2.sort().join(',');
        }
        return value1 === value2;
    }

    handleChange(event) {
        event.preventDefault();
        event.stopPropagation();

        this._picklistValue = this.getPicklistValue(event.detail.value);
        this._internalValue = this.getInternalValue(event.detail.value);

        this.dispatchChangeEvent();
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleOpen() {
        // fire internal event for some force components to leverage
        // e.g. to display the spinner while loading more picklist values
        this.dispatchEvent(new CustomEvent('open'));
    }

    maybeAddNoneOption(options) {
        if (this.shouldAddNoneOption(options.length)) {
            this.addOption(options, this.i18n.noneLabel, '');
        }
    }

    addOption(options, label, value) {
        options.unshift({ label, value });
    }

    shouldDisablePicklist(options) {
        if (!options || options.length === 0) {
            return true;
        }

        return false;
    }

    shouldAddNoneOption(numberOfOptions) {
        if (this.multiple) {
            return false;
        }

        if (this.required && numberOfOptions === 1) {
            return false;
        }

        return true;
    }

    updateDisabledState(options) {
        this._disabled =
            this._externalDisabled !== undefined
                ? this._externalDisabled
                : this.shouldDisablePicklist(options);
    }

    updateRequiredState(options) {
        const shouldDisable = this.shouldDisablePicklist(options);
        if (shouldDisable) {
            if (this._required) {
                // when disabling the picklist, we should remove the required indicator
                this._required = false;
                this._requiredButDisabled = true;
            }

            if (this.connected && this.validity.valueMissing) {
                // if we're disabling the picklist, we should make sure any existing valueMissing message is cleared
                requestAnimationFrame(() => {
                    this.showHelpMessageIfInvalid();
                });
            }
        } else if (this._requiredButDisabled) {
            // we now have some options and are not going to have a disabled picklist, so we'll put the required flag back to what it was before
            this._requiredButDisabled = false;
            this._required = true;
        }
    }

    getValueToSelect(options, existingValue) {
        if (!options || options.length === 0) {
            return this.multiple ? [] : '';
        }

        if (this.isValueInOptions(existingValue, options)) {
            return existingValue;
        }
        if (this.multiple) {
            return [];
        }

        if (this.shouldAddNoneOption([...options].length)) {
            return '';
        }
        return options[0].value;
    }

    isValueInOptions(value, options) {
        if (!options || options.length === 0) {
            return false;
        }

        const valueIsInOptions = valueToCheck =>
            options.some(option => {
                return option.value === valueToCheck;
            });

        let valueExists = false;
        if (Array.isArray(value)) {
            valueExists = value.every(valueToCheck => {
                return valueIsInOptions(valueToCheck);
            });
        } else {
            valueExists = valueIsInOptions(value);
        }
        return valueExists;
    }

    // If values are missing from the options, we will add them to the options.
    // However, since we don't have the label, the same value will be used as label
    // See W-4829389
    addMissingValuesToOptions(newOptions, value) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
            return;
        }

        const valueIsInOptions = valueToCheck => {
            return newOptions.some(option => {
                return option.value === valueToCheck;
            });
        };

        const maybeAddOption = valueToCheck => {
            if (!valueIsInOptions(valueToCheck)) {
                // Since we don't have the label, we will use the value instead
                this.addOption(newOptions, valueToCheck, valueToCheck);
            }
        };

        if (Array.isArray(value)) {
            value.forEach(valueToCheck => {
                maybeAddOption(valueToCheck);
            });
        } else {
            maybeAddOption(value);
        }
    }

    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this._picklistValue,
                },
            })
        );
    }

    getPicklistValue(value) {
        // multi select picklists should have a ';' separated value string
        if (this.multiple && Array.isArray(value)) {
            return value.join(';');
        }
        return value;
    }

    // This is the value that is passed into the subcomponents dual-listbox and combobox.
    // In the case of dual-listbox, the component accepts an array of selected values.
    getInternalValue(value) {
        if (this.multiple) {
            if (Array.isArray(value)) {
                return value;
            }
            return (
                (typeof value === 'string' &&
                    value !== '' &&
                    value.split(';')) ||
                []
            );
        }
        return value;
    }

    normalizeSize(value) {
        const parsedValue = parseInt(value, 10);

        if (isNaN(parsedValue) || parsedValue < 3 || parsedValue > 10) {
            // A picklist field can only have a size between 3 and 10 when created declaratively
            // however, there seems to be cases where the size can be outside of this range.
            // In such cases, we will use the default value instead of throwing an error
            return 4;
        }
        return parsedValue;
    }
}
