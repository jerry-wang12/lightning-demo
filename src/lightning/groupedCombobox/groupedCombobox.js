import labelRequired from '@salesforce/label/LightningControl.required';
import { LightningElement, api, track, unwrap } from 'lwc';
import { classSet } from 'lightning/utils';
import { assert, synchronizeAttrs } from 'lightning/utilsPrivate';
import {
    isEmptyString,
    generateUniqueId,
    InteractingState,
    FieldConstraintApi,
    normalizeVariant,
    VARIANT,
} from 'lightning/inputUtils';

const i18n = {
    required: labelRequired,
};

export default class LightningGroupedCombobox extends LightningElement {
    @api label;
    @api inputText = '';
    @api inputIconName = 'utility:search';
    @api inputIconSize = 'x-small';
    @api inputIconAlternativeText;
    @api inputMaxlength;
    // TODO: Rename to 'showInputActivityIndicator'
    @api showActivityIndicator = false;
    @api showDropdownActivityIndicator = false;
    @api dropdownAlignment = 'left';
    @api placeholder = 'Select an Item';

    // Validity related message
    @api messageWhenValueMissing = i18n.required;

    @api name;
    @api value;
    @api required = false;
    @api disabled = false;
    // TODO: Need to remove as if a readonly combobox is needed,
    // the regular lightning-combobox should be used
    @api readOnly = false;

    @api inputPill;
    @api filterLabel;
    @api filterItems;
    @api filterInputText;

    @track _pills;

    @track _variant;
    @track _items = [];

    @track _expandPillContainer = false;
    @track _highlightedOptionElementId = '';
    @track _helpMessage;
    @track _fieldLevelHelp;

    _filterInputId;
    _mainInputId;

    constructor() {
        super();
        this._mainInputId = generateUniqueId();
        this._filterInputId = generateUniqueId();
    }

    connectedCallback() {
        this._connected = true;
        this.classList.add('slds-form-element');

        this.interactingState = new InteractingState({
            // keeps interacting state when switching between two comboboxes and the pill container
            debounceInteraction: true,
        });

        this.interactingState.onleave(() => {
            this.reportValidity();
        });
    }

    synchronizeA11y() {
        const label = this.template.querySelector('[data-main-label]');
        const filterLabel = this.template.querySelector('[data-filter-label]');
        const helpMessage = this.template.querySelector('[data-help-message]');
        // const filter = this.template.querySelector('[data-filter]');
        const lookup = this.template.querySelector('[data-lookup]');
        lookup.inputDescribedBy = helpMessage;
        synchronizeAttrs(label, {
            for: this._mainInputId,
        });
        synchronizeAttrs(filterLabel, {
            for: this._filterInputId,
        });
    }

    renderedCallback() {
        this.synchronizeA11y();
    }

    disconnectedCallback() {
        this._connected = false;
    }

    @api
    get pills() {
        return this._pills;
    }

    set pills(newPills) {
        assert(Array.isArray(newPills), '"pills" must be an array.');

        if (this._connected && (!newPills || newPills.length === 0)) {
            if (this._focusOnPills) {
                // check why requestAnimationFrame is needed, something is stealing focus otherwise
                requestAnimationFrame(() => {
                    this.lookupCombobox.focus();
                });
            }
        }

        this._pills = newPills;
    }

    @api
    get fieldLevelHelp() {
        return this._fieldLevelHelp;
    }

    set fieldLevelHelp(value) {
        this._fieldLevelHelp = value;
    }

    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeVariant(value);
    }

    set items(items = []) {
        items = unwrap(items);
        this._items = items;

        if (items) {
            assert(Array.isArray(items), '"items" must be an array.');
        }
    }

    @api
    get items() {
        return this._items;
    }

    @api
    highlightInputText() {
        if (this._connected) {
            this.lookupCombobox.highlightInputText();
        }
    }

    /**
     * Sets focus on the input element.
     */
    @api
    focus() {
        if (this._connected) {
            this.lookupCombobox.focus();
        }
    }

    @api
    focusAndOpenDropdownIfNotEmpty() {
        if (this._connected) {
            this.lookupCombobox.focusAndOpenDropdownIfNotEmpty();
        }
    }

    /**
     * Removes focus from the input element.
     */
    @api
    blur() {
        if (this._connected) {
            this.lookupCombobox.blur();
        }
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
            this._helpMessage = message;
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

    handleLookupReady(e) {
        this._mainInputId = e.detail.id;
    }

    handleFilterReady(e) {
        this._filterInputId = e.detail.id;
    }

    get computedUniqueHelpElementId() {
        return this._helpMessage ? this._mainInputId + '-error' : null;
    }

    get lookupCombobox() {
        return this.template.querySelector('[data-lookup]');
    }

    handleDropdownOpenRequest() {
        this.dispatchEvent(new CustomEvent('dropdownopenrequest'));
    }

    handlePillRemove(event) {
        if (!this.disabled) {
            this.dispatchEvent(
                new CustomEvent('pillremove', { detail: event.detail })
            );
        }
    }

    handleTextChange(event) {
        this.dispatchEvent(
            new CustomEvent('textchange', {
                detail: { text: event.detail.text },
            })
        );
    }

    handleTextInput(event) {
        this.dispatchEvent(
            new CustomEvent('textinput', {
                detail: { text: event.detail.text },
            })
        );
    }

    handleSelect(event) {
        this.dispatchEvent(
            new CustomEvent('select', { detail: { value: event.detail.value } })
        );
    }

    handleSelectFilter(event) {
        const selectedFilterValue = event.detail.value;

        this.dispatchEvent(
            new CustomEvent('selectfilter', {
                detail: { value: selectedFilterValue },
            })
        );
    }

    handleEndReached() {
        this.dispatchEvent(new CustomEvent('endreached'));
    }

    handleFocus() {
        this.interactingState.enter();
        this._expandPillContainer = true;

        if (!this._hasFocus) {
            this._hasFocus = true;
            this.dispatchEvent(new CustomEvent('focus'));
        }
    }

    handlePillsFocus() {
        this.handleFocus();

        this._focusOnPills = true;
    }

    handlePillsBlur() {
        this.handleBlur();

        this._focusOnPills = false;
    }

    handleBlur() {
        this._hasFocus = false;

        // Once https://github.com/salesforce/lwc/issues/444 is fixed, consider switching to
        // `onfocusout` and `event.relatedTarget` to determine whether the focus stayed in the component,
        // this way the use of async blur can be avoided.
        requestAnimationFrame(() => {
            if (!this._hasFocus) {
                this.interactingState.leave();

                this.dispatchEvent(new CustomEvent('blur'));

                this._expandPillContainer = false;

                if (this.pills && this.pills.length > 0) {
                    // Sometimes (involves focusing on lower pills) the pill container scrolls and the top
                    // line with the "+ n more" button does not show so we have to manually scroll to the top.
                    // We need to figure a better solution for this.
                    requestAnimationFrame(() => {
                        if (this._connected) {
                            this.template.querySelector(
                                'lightning-pill-container'
                            ).scrollTop = 0;
                        }
                    });
                }
            }
        });
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

    get computedComboboxGroupClass() {
        return classSet().add({
            'slds-has-selection':
                Array.isArray(this._pills) && this._pills.length > 0,
            'slds-combobox-group': this.computedHasFilter,
        });
    }

    get computedHasFilter() {
        return Array.isArray(this.filterItems);
    }

    get computedLookupComboboxClass() {
        return this.computedHasFilter ? 'slds-combobox-addon_end' : '';
    }

    get _hasPills() {
        return this.pills && this.pills.length > 0;
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
}
