import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, track, api } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import {
    isEmptyString,
    generateUniqueId,
    InteractingState,
    FieldConstraintApi,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};

const defaultFormats = [
    'abbr',
    'address',
    'align',
    'alt',
    'background',
    'bdo',
    'big',
    'blockquote',
    'bold',
    'cite',
    'clean',
    'code',
    'code-block',
    'color',
    'data-fileid',
    'del',
    'dfn',
    'direction',
    'divider',
    'dl',
    'dd',
    'dt',
    'font',
    'header',
    'image',
    'indent',
    'ins',
    'ins',
    'italic',
    'kbd',
    'link',
    'list',
    'q',
    'samp',
    'script',
    'size',
    'small',
    'strike',
    'sup',
    'table',
    'tt',
    'underline',
    'var',
];
export default class LightningQuill extends LightningElement {
    @track _required = false;
    @track _helpMessage = '';
    @track _noErrors = true;
    @track _fieldLevelHelp;
    @track _disabled = false;
    @track _displayValue;

    @api label;
    @api disabledCategories = '';
    @api messageWhenValueMissing;
    @api customButtons;
    @api fieldLevelHelp;

    connectedCallback() {
        this._connected = true;

        this.uniqueId = generateUniqueId();

        this.interactingState = new InteractingState();
        this.interactingState.onleave(() => this.reportValidity());
        this.classList.add('slds-form-element');
    }

    disconnectedCallback() {
        this._connected = false;
    }

    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this._displayValue = value;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    @api
    get disabled() {
        return this._disabled;
    }

    @api
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = normalizeBoolean(value);
    }

    @api
    focus() {
        this.inputRichTextElement.focus();
        this.handleFocus();
    }

    @api
    blur() {
        this.inputRichTextElement.blur();
        this.handleBlur();
    }

    @api
    get validity() {
        return this._constraint.validity;
    }

    @api
    checkValidity() {
        return this._constraint.checkValidity();
    }

    @api
    reportValidity() {
        return this._constraint.reportValidity(message => {
            // The errors are shown via the underlying input-rich-text component,
            // we should change it to be more in-line with the other input components
            this._helpMessage = message;
            this._noErrors = message === '';
        });
    }

    @api
    setCustomValidity(message) {
        this._constraint.setCustomValidity(message);
    }

    @api
    showHelpMessageIfInvalid() {
        this.reportValidity();
    }

    handleFocus() {
        this.interactingState.enter();
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handleBlur() {
        this.interactingState.leave();
        this.dispatchEvent(new CustomEvent('blur'));
    }

    handleChange(event) {
        this._value = event.detail.value;
    }

    get i18n() {
        return i18n;
    }

    get formats() {
        return defaultFormats;
    }

    get _constraint() {
        if (!this._constraintApi) {
            this._constraintApi = new FieldConstraintApi(() => this, {
                valueMissing: () =>
                    !this.disabled &&
                    this.required &&
                    isEmptyString(this.value),
            });
        }
        return this._constraintApi;
    }

    get inputRichTextElement() {
        return this.template.querySelector('lightning-input-rich-text');
    }
}
