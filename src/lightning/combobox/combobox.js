import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeArray,
    synchronizeAttrs,
} from 'lightning/utilsPrivate';
import {
    isEmptyString,
    InteractingState,
    FieldConstraintApi,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};
/**
 * A widget that provides an input field that is readonly,
 * accompanied by a dropdown list of selectable options.
 */
export default class LightningCombobox extends LightningElement {
    @track
    state = {
        fieldLevelHelp: '',
        showActivityIndicator: false,
        selectedLabel: '',
    };

    /**
     * Text label for the combobox.
     */
    @api label;

    /**
     * Specifies where the drop-down list is aligned with or anchored to
     * the selection field. By default the list is aligned with the
     * selection field at the top left so the list opens down. Use bottom-left
     * to make the selection field display at the bottom so the list opens
     * above it. Use auto to let the component determine where to open
     * the list based on space available.
     * @type {string}
     * @default left
     */
    @api dropdownAlignment = 'left';

    /**
     * Text that is displayed before an option is selected, to prompt the user
     * to select an option. The default is "Select an Option".
     * @type {string}
     * @default Select an Option
     */
    @api placeholder = 'Select an Option';

    // Validity related message
    /**
     * Error message to be displayed when the value is missing and input is required.
     * @type {string}
     */
    @api messageWhenValueMissing;

    /**
     * Specifies the name of the combobox.
     * @type {string}
     */
    @api name;

    @track _items = [];
    @track _variant;
    @track _helpMessage;

    _labelForId;
    handleComboboxReady(e) {
        this._labelForId = e.detail.id;
    }

    syncronizeA11y() {
        const label = this.template.querySelector('label');
        const helpText = this.template.querySelector('[data-help-text]');
        const baseComboBox = this.template.querySelector(
            'lightning-base-combobox'
        );
        synchronizeAttrs(label, {
            for: this._labelForId,
        });

        if (this._helpMessage) {
            baseComboBox.inputDescribedByElements = helpText;
        } else {
            baseComboBox.inputDescribedByElements = null;
        }
    }

    renderedCallback() {
        this.syncronizeA11y();
        this.template
            .querySelector('label')
            .setAttribute('for', this._labelForId);
    }

    connectedCallback() {
        this.classList.add('slds-form-element');
        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.showHelpMessageIfInvalid());

        // The connected logic here is needed because at the point when @api setters
        // are called other values may not have been set yet, so it could happen that the 'value' was set, but 'options'
        // are not available, or that the 'options' and 'value' have been set but 'multiple' hasn't been set yet.
        // So here we make sure that we start processing the data only once the element is actually in DOM, which
        // should be beneficial for performance as well
        this.connected = true;

        this._items = this.generateItems(this.options);

        if (this.options && this.selectedValue !== undefined) {
            this.updateSelectedOptions();
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    set fieldLevelHelp(value) {
        this.state.fieldLevelHelp = value;
    }

    /**
     * Help text detailing the purpose and function of the combobox.
     * @type {string}
     */
    @api
    get fieldLevelHelp() {
        return this.state.fieldLevelHelp;
    }

    /**
     * The variant changes the appearance of an input field. Accepted variants include
     *  standard and label-hidden. This value defaults to standard.
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
     * Specifies the value of an input element.
     * @type {object}
     */
    @api
    get value() {
        return this.selectedValue;
    }

    set value(newValue) {
        // There are some cases where this won't work correctly
        // See https://git.soma.salesforce.com/raptor/raptor/issues/457
        if (newValue !== this.selectedValue) {
            this.selectedValue = newValue;
            if (this.connected && this.options) {
                this.updateSelectedOptions();
            }
        }
    }

    /**
     * A list of options that are available for selection. Each option has the following attributes: label and value.
     * @type {object[]}
     * @required
     */
    @api
    get options() {
        return this._options || [];
    }

    set options(newValue) {
        this._options = normalizeArray(newValue);

        if (this.connected) {
            this._items = this.generateItems(this._options);
            this.updateSelectedOptions();
        }
    }

    /**
     * If present, the comboxbox is disabled and users cannot interact with it.
     * @type {boolean}
     * @default false
     */
    @api
    get disabled() {
        return this.state.disabled || this.state.readonly || false;
    }

    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
    }

    /**
     * If present, the combobox is read-only.
     * A read-only combobox is also disabled.
     * @type {boolean}
     * @default false
     */
    @api
    get readOnly() {
        return this.disabled || false;
    }

    set readOnly(value) {
        this.state.readonly = normalizeBoolean(value);
    }

    /**
     * If present, a value must be selected before the form can be submitted.
     * @type {boolean}
     * @default false
     */
    @api
    get required() {
        return this.state.required || false;
    }

    set required(value) {
        this.state.required = normalizeBoolean(value);
    }

    /**
     * If present, a spinner is displayed below the menu items to indicate loading activity.
     * @type {boolean}
     * @default false
     */
    @api
    get spinnerActive() {
        return this.state.spinnerActive || false;
    }

    set spinnerActive(value) {
        this.state.spinnerActive = normalizeBoolean(value);
    }

    /**
     * Sets focus on the combobox.
     */
    @api
    focus() {
        if (this.connected) {
            this.getBaseComboboxElement().focus();
        }
    }

    /**
     * Removes focus from the combobox.
     */
    @api
    blur() {
        if (this.connected) {
            this.getBaseComboboxElement().blur();
        }
    }

    /**
     * Represents the validity states that an element can be in, with respect to constraint validation.
     * @type {object}
     * @required
     */
    @api
    get validity() {
        return this._constraint.validity;
    }

    /**
     * Returns the valid attribute value (Boolean) on the ValidityState object.
     * @returns {boolean} Indicates whether the combobox has any validity errors.
     */
    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    /**
     * Displays the error messages and returns false if the input is invalid.
     * If the input is valid, reportValidity() clears displayed error messages and returns true.
     * @returns {boolean} - The validity status of the combobox.
     */
    @api
    reportValidity() {
        return this._constraint.reportValidity(message => {
            this._helpMessage = message;
        });
    }

    /**
     * Sets a custom error message to be displayed when the combobox value is submitted.
     * @param {string} message - The string that describes the error. If message is an empty string, the error message
     * is reset.
     */
    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    /**
     * Shows the help message if the combobox is in an invalid state.
     */
    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    get i18n() {
        return i18n;
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    handleSelect(event) {
        if (event.detail.value === this.selectedValue) {
            return;
        }
        this.selectedValue = event.detail.value;
        this.updateSelectedOptions();
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this.selectedValue,
                },
            })
        );
    }

    handleFocus() {
        this.interactingState.enter();

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();

        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleDropdownOpen() {
        this.dispatchEvent(new CustomEvent('open'));
    }

    updateSelectedOptions() {
        this.updateSelectedLabelFromValue(this.selectedValue);
        this.markOptionSelectedFromValue(this.selectedValue);
    }

    markOptionSelectedFromValue(value) {
        if (this._items) {
            const selectedItem = this._items.find(item => item.value === value);
            // de-select previously selected item
            if (this._selectedItem) {
                this._selectedItem.iconName = undefined;
                this._selectedItem.highlight = false;
            }
            this._selectedItem = selectedItem;
            if (selectedItem) {
                selectedItem.iconName = 'utility:check';
                this._selectedItem.highlight = true;
            }
            // Make a shallow copy to trigger an update on the combobox
            this._items = this._items.slice();
        }
    }

    updateSelectedLabelFromValue(newValue) {
        this.state.selectedLabel = this.getOptionLabelByValue(newValue);
    }

    getOptionLabelByValue(value) {
        const foundOption = this.options.find(option => option.value === value);
        if (foundOption) {
            return foundOption.label;
        }
        return '';
    }

    generateItems(options) {
        return options.map(option => {
            return {
                type: 'option-inline',
                text: option.label,
                highlight: this.value === option.value,
                value: option.value,
            };
        });
    }

    getBaseComboboxElement() {
        return this.template.querySelector('lightning-base-combobox');
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled &&
                    this.required &&
                    isEmptyString(this.selectedValue),
            });
        }
        return this._constraintApi;
    }
}
