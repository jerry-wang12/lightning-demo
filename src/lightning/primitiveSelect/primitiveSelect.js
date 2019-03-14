import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, track, api } from 'lwc';
import { classSet } from 'lightning/utils';
import { normalizeBoolean, getRealDOMId } from 'lightning/utilsPrivate';
import {
    InteractingState,
    getErrorMessage,
    buildSyntheticValidity,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};

const { reduce: ArrayReduce } = Array.prototype;

export default class LightningPrimitiveSelect extends LightningElement {
    @track _errorMessage = '';
    @track _options = [];
    @track _selectedValue;
    @track _variant;
    @track _required = false;
    @track _disabled = false;
    @track _multiple = false;
    @track _fieldLevelHelp;
    @track _size;
    @track _ariaDescribedBy;
    @track _tabIndex;

    @api label;
    @api name;
    @api messageWhenValueMissing;
    @api accessKey;

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }
    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
    }
    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set multiple(value) {
        this._multiple = normalizeBoolean(value);
    }
    @api
    get multiple() {
        return this._multiple;
    }

    set size(newValue) {
        this._size = newValue;
    }
    @api
    get size() {
        if (!this.multiple) {
            return null;
        }

        if (this._size === undefined) {
            return '4';
        }
        return this._size;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }
    @api
    get required() {
        return this._required;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }
    @api
    get disabled() {
        return this._disabled;
    }

    set value(newValue) {
        this._selectedValue = newValue;

        if (this.connected && newValue) {
            this.selectOptionsByValue(newValue);
        }
    }
    @api
    get value() {
        return this._selectedValue;
    }

    set options(newValue) {
        this._options = newValue;

        if (this.connected && newValue) {
            this.selectOptionsByValue(this._selectedValue);
        }
    }
    @api
    get options() {
        return this._options;
    }

    @api
    get tabIndex() {
        return this._tabIndex;
    }

    set tabIndex(newValue) {
        this._tabIndex = newValue;
    }

    connectedCallback() {
        this.classList.add('slds-form-element');

        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.showHelpMessageIfInvalid());

        this.connected = true;
    }

    renderedCallback() {
        if (this.options && this._selectedValue !== undefined) {
            this.selectOptionsByValue(this._selectedValue);
        }
    }

    disconnectedCallback() {
        this.connected = false;
    }

    @api
    focus() {
        if (this.connected) {
            this.getElement.focus();
        }
    }

    @api
    blur() {
        if (this.connected) {
            this.getElement.blur();
        }
    }

    @api
    get validity() {
        const missing =
            !this.disabled &&
            this.required &&
            (this._selectedValue == null ||
                this._selectedValue === '' ||
                this._selectedValue.length === 0);

        return buildSyntheticValidity({
            valueMissing: missing,
            customError:
                this.customErrorMessage != null &&
                this.customErrorMessage !== '',
        });
    }

    @api
    checkValidity() {
        const isValid = this.validity.valid;
        if (!isValid) {
            this.dispatchEvent(
                new CustomEvent('invalid', { cancellable: true })
            );
        }
        return isValid;
    }

    @api
    reportValidity() {
        this.showHelpMessageIfInvalid();
        return this.checkValidity();
    }

    @api
    setCustomValidity(message) {
        this.customErrorMessage = message;
    }

    @api
    showHelpMessageIfInvalid() {
        const validity = this.validity;
        if (validity.valid) {
            this._errorMessage = '';
            this.classList.remove('slds-has-error');
            this.removeAriaDescribedBy();
        } else {
            this.classList.add('slds-has-error');
            this._errorMessage = getErrorMessage(validity, {
                valueMissing: this.messageWhenValueMissing,
                customError: this.customErrorMessage,
            });
            this.setAriaDescribedBy(this.computedUniqueErrorMessageElementId);
        }
    }

    get i18n() {
        return i18n;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    get getElement() {
        return this.template.querySelector('select');
    }

    get computedUniqueErrorMessageElementId() {
        return getRealDOMId(this.template.querySelector('[data-help-message]'));
    }

    get isLabelHidden() {
        return this.variant === VARIANT.LABEL_HIDDEN;
    }

    get computedLabelClass() {
        return classSet('slds-form-element__label')
            .add({ 'slds-assistive-text': this.isLabelHidden })
            .toString();
    }

    get computedAriaDescribedBy() {
        return this._ariaDescribedBy;
    }

    handleChange(event) {
        event.preventDefault();
        event.stopPropagation();

        this._selectedValue = this.getSelectedOptionValues();

        this.dispatchChangeEvent();
    }

    handleFocus() {
        this.interactingState.enter();

        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();

        this.dispatchEvent(new CustomEvent('blur'));
    }

    dispatchChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('change', {
                composed: true,
                bubbles: true,
                detail: {
                    value: this._selectedValue,
                },
            })
        );
    }

    selectOptionsByValue(optionValue) {
        if (this.multiple) {
            if (Array.isArray(optionValue)) {
                const options = this.template.querySelectorAll('option');
                options.forEach(option => {
                    option.selected = optionValue.includes(option.value);
                });
            }
        } else {
            this.getElement.value = optionValue;
        }
    }

    getSelectedOptionValues() {
        if (this.multiple) {
            const options = this.template.querySelectorAll('option');
            return ArrayReduce.call(
                options,
                (selectedValues, option) => {
                    if (option.selected) {
                        selectedValues.push(option.value);
                    }
                    return selectedValues;
                },
                []
            );
        }
        return this.getElement.value;
    }

    setAriaDescribedBy(val) {
        this.getElement.setAttribute('aria-describedby', val);
    }

    removeAriaDescribedBy() {
        this.getElement.removeAttribute('aria-describedby');
    }
}
