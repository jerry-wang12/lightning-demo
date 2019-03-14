import labelAriaSelectedOptions from '@salesforce/label/LightningCombobox.ariaSelectedOptions';
import labelDeselectOptionKeyboard from '@salesforce/label/LightningCombobox.deselectOptionKeyboard';
import labelLoadingText from '@salesforce/label/LightningCombobox.loadingText';
import labelPillCloseButtonAlternativeText from '@salesforce/label/LightningCombobox.pillCloseButtonAlternativeText';
import { LightningElement, api, track } from 'lwc';
import { handleKeyDownOnInput } from './keyboard';
import { BaseComboboxEvents } from './baseComboboxEvents';
import { classSet } from 'lightning/utils';
import {
    assert,
    keyCodes,
    normalizeBoolean,
    normalizeString,
    normalizeAriaAttribute,
    synchronizeAttrs,
    getRealDOMId,
} from 'lightning/utilsPrivate';
import { AutoPosition, Direction } from 'lightning/positionLibrary';
import { VARIANT } from 'lightning/inputUtils';

const i18n = {
    ariaSelectedOptions: labelAriaSelectedOptions,
    deselectOptionKeyboard: labelDeselectOptionKeyboard,
    pillCloseButtonAlternativeText: labelPillCloseButtonAlternativeText,
    loadingText: labelLoadingText,
};

const ARIA_CONTROLS = 'aria-controls';
const ARIA_LABELLEDBY = 'aria-labelledby';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_LABEL = 'aria-label';
const ARIA_ACTIVEDESCENDANT = 'aria-activedescendant';

export default class LightningBaseCombobox extends LightningElement {
    @api inputText = '';
    @api inputIconName = 'utility:down';
    @api inputIconSize = 'x-small';
    @api inputIconAlternativeText;
    @api inputMaxlength;
    @api showInputActivityIndicator = false;
    @api dropdownAlignment = 'left';
    @api placeholder = 'Select an Item';
    @api inputLabel;

    @api name;
    @api inputPill;
    @api attributionLogoUrl;
    @api attributionLogoAssistiveText;

    @track _showDropdownActivityIndicator = false;
    @track _items = [];
    @track _disabled = false;
    @track _dropdownVisible = false;
    @track _hasDropdownOpened = false;
    @track _highlightedOptionElementId = '';
    @track _variant;
    @track _dropdownHeight = 'standard';
    @track _readonly = false;
    @track _logoLoaded = false;

    _id = 0;
    _inputDescribedBy = [];
    _inputAriaControls;
    _activeElementDOMId;

    constructor() {
        super();
        this._events = new BaseComboboxEvents(this);
    }

    set inputControlsElement(el) {
        this._inputAriaControls = el;
        this.synchronizeA11y();
    }

    @api
    get inputControlsElement() {
        return this._inputAriaControls;
    }

    set inputDescribedByElements(els) {
        if (Array.isArray(els)) {
            this._inputDescribedBy = els;
        } else {
            this._inputDescribedBy = [els];
        }

        this.synchronizeA11y();
    }

    @api
    get inputDescribedByElements() {
        return this._inputDescribedBy;
    }

    set inputLabelledByElement(el) {
        this._inputLabelledBy = el;
        this.synchronizeA11y();
    }

    @api
    get inputLabelledByElement() {
        return this._inputLabelledBy;
    }

    get inputLabelledById() {
        return getRealDOMId(this._inputLabelledBy);
    }

    get inputAriaControlsId() {
        return getRealDOMId(this._inputAriaControls);
    }

    get inputId() {
        return getRealDOMId(this.template.querySelector('input'));
    }

    get computedAriaDescribedBy() {
        const ariaValues = [];
        this._inputDescribedBy.forEach(el => {
            ariaValues.push(getRealDOMId(el));
        });
        return normalizeAriaAttribute(ariaValues);
    }

    synchronizeA11y() {
        const input = this.template.querySelector('input');
        if (!input) {
            return;
        }
        synchronizeAttrs(input, {
            [ARIA_LABELLEDBY]: this.inputLabelledById,
            [ARIA_DESCRIBEDBY]: this.computedAriaDescribedBy,
            [ARIA_ACTIVEDESCENDANT]: this._activeElementDOMId,
            [ARIA_CONTROLS]: this.computedInputControls,
            [ARIA_LABEL]: this.inputLabel,
        });
    }

    renderedCallback() {
        this.dispatchEvent(
            new CustomEvent('ready', {
                detail: {
                    id: this.inputId,
                    name: this.name,
                },
            })
        );
        this.synchronizeA11y();
    }

    connectedCallback() {
        this.classList.add('slds-combobox_container');
        this._connected = true;
        this._keyboardInterface = this.dropdownKeyboardInterface();
    }

    disconnectedCallback() {
        this._connected = false;
        this._listBoxElementCache = undefined;
    }

    @api
    get dropdownHeight() {
        return this._dropdownHeight;
    }

    set dropdownHeight(height) {
        this._dropdownHeight = normalizeString(height, {
            fallbackValue: 'standard',
            validValues: ['standard', 'small'],
        });
    }

    @api
    get showDropdownActivityIndicator() {
        return this._showDropdownActivityIndicator;
    }

    set showDropdownActivityIndicator(value) {
        this._showDropdownActivityIndicator = normalizeBoolean(value);

        if (this._connected) {
            if (this._showDropdownActivityIndicator) {
                if (this._shouldOpenDropDown) {
                    this.openDropdownIfNotEmpty();
                }
            } else if (this._dropdownVisible && this.isDropdownEmpty) {
                this.closeDropdown();
            }
        }
    }

    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);

        if (this._disabled && this._dropdownVisible) {
            this.closeDropdown();
        }
    }

    @api
    get readOnly() {
        return this._readonly;
    }

    set readOnly(value) {
        this._readonly = normalizeBoolean(value);
        if (this._readonly && this._dropdownVisible) {
            this.closeDropdown();
        }
    }

    @api
    get variant() {
        return this._variant || VARIANT.STANDARD;
    }

    set variant(value) {
        this._variant = normalizeString(value, {
            fallbackValue: VARIANT.STANDARD,
            validValues: [VARIANT.STANDARD, 'lookup'],
        });
    }

    set items(items = []) {
        this._unprocessedItems = items;

        if (this._connected) {
            if (this._hasDropdownOpened) {
                // The dropdown has already been opened at least once, so process the items immediately
                this.updateItems(items);

                if (this._dropdownVisible) {
                    // The dropdown is visible but there are no items to show, close it
                    if (this.isDropdownEmpty) {
                        this.closeDropdown();
                    } else {
                        // We have new items, update highlight
                        this.highlightDefaultItem();

                        // Since the items have changed, the positioning should be recomputed
                        this.startDropdownAutoPositioning();
                    }
                }
            }

            if (this._shouldOpenDropDown) {
                this.openDropdownIfNotEmpty();
            }
        }
    }

    @api
    get items() {
        return this._unprocessedItems;
    }

    @api
    highlightInputText() {
        if (this._connected) {
            // Safari has issues with invoking set selection range immediately in the 'focus' handler, instead
            // we'd be doing it in an animation frame. Remove the requestAnimationFrame once/if this is fixed
            // in Safari
            requestAnimationFrame(() => {
                const { inputElement } = this;
                inputElement.setSelectionRange(0, inputElement.value.length);
            });
        }
    }

    get showAttribution() {
        return this.attributionLogoUrl;
    }

    @api
    focus() {
        if (this._connected) {
            this.inputElement.focus();
        }
    }

    @api
    focusAndOpenDropdownIfNotEmpty() {
        if (this._connected) {
            if (!this._inputHasFocus) {
                this.focus();
            }
            this.openDropdownIfNotEmpty();
        }
    }

    @api
    blur() {
        if (this._connected) {
            this.inputElement.blur();
        }
    }

    itemId(index) {
        return this.inputId + '-' + index;
    }

    itemIndexFromId(id) {
        // Extracts the index from an item id.
        return parseInt(id.substring(id.lastIndexOf('-') + 1), 10);
    }

    processItem(item) {
        const itemCopy = {};

        // Supported item properties:
        // 'type' (string): option-inline, option-card
        // 'highlight' (boolean): Whether to highlight the item when dropdown opens
        // 'iconName': left icon name
        // 'iconSize': left icon size
        // 'iconAlternativeText': assistive text for the left icon
        // 'rightIconName': right icon name
        // 'rightIconSize': right icon size
        // 'rightIconAlternativeText': assistive text for the right icon
        // 'text': text to display
        // 'subText': sub-text to display (only option-card supports it)
        // 'value': value associated with the option
        itemCopy.type = item.type;
        itemCopy.iconName = item.iconName;
        itemCopy.iconSize = item.iconSize;
        itemCopy.iconAlternativeText = item.iconAlternativeText;
        itemCopy.rightIconName = item.rightIconName;
        itemCopy.rightIconSize = item.rightIconSize;
        itemCopy.rightIconAlternativeText = item.rightIconAlternativeText;
        itemCopy.text = item.text;
        itemCopy.subText = item.subText;
        itemCopy.value = item.value;

        // extra metadata needed
        itemCopy.selectable =
            ['option-card', 'option-inline'].indexOf(item.type) >= 0;

        if (item.highlight) {
            this._highlightedItemIndex = this._selectableItems;
        }
        if (itemCopy.selectable) {
            itemCopy.index = this._selectableItems;
            itemCopy.id = this.itemId(itemCopy.index);
            this._selectableItems += 1;
        }
        return itemCopy;
    }

    get _inputReadOnly() {
        return (
            this._readonly ||
            this.variant === VARIANT.STANDARD ||
            this.hasInputPill
        );
    }

    get computedAriaAutocomplete() {
        if (this.hasInputPill) {
            // no aria-autocomplete when pill is showing
            return null;
        }

        return this._inputReadOnly ? 'none' : 'list';
    }

    get computedPlaceholder() {
        return this.hasInputPill ? this.inputPill.label : this.placeholder;
    }

    get computedInputValue() {
        return this.hasInputPill ? this.inputPill.label : this.inputText;
    }

    handleListboxScroll(event) {
        const listbox = event.target;
        const height = listbox.getBoundingClientRect().height;
        const maxScroll = listbox.scrollHeight - height;
        const bottomReached = listbox.scrollTop >= maxScroll;
        if (bottomReached) {
            this._events.dispatchEndReached();
        }
    }

    get listboxElement() {
        if (!this._listBoxElementCache) {
            this._listBoxElementCache = this.template.querySelector(
                '[role="listbox"]'
            );
        }
        return this._listBoxElementCache;
    }

    get computedUniqueElementId() {
        return this.inputId;
    }

    get computedUniqueDropdownElementId() {
        const el = this.template.querySelector('[data-dropdown-element]');
        return getRealDOMId(el);
    }

    get computedInputControls() {
        const ariaValues = [this.computedUniqueDropdownElementId];

        if (this.inputControlsElement) {
            ariaValues.push(this.inputAriaControlsId);
        }

        return normalizeAriaAttribute(ariaValues);
    }

    get i18n() {
        return i18n;
    }

    get computedDropdownTriggerClass() {
        return classSet(
            'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click'
        )
            .add({ 'slds-is-open': this._dropdownVisible })
            .toString();
    }

    get computedDropdownClass() {
        const alignment = this.dropdownAlignment;
        return classSet(
            'slds-listbox slds-listbox_vertical slds-dropdown slds-dropdown_fluid'
        )
            .add({
                'slds-dropdown_length-with-icon-10':
                    this._dropdownHeight === 'standard',
                'slds-dropdown_length-with-icon-5':
                    this._dropdownHeight === 'small',
                'slds-dropdown_left':
                    alignment === 'left' || alignment === 'auto',
                'slds-dropdown_center': alignment === 'center',
                'slds-dropdown_right': alignment === 'right',
                'slds-dropdown_bottom': alignment === 'bottom-center',
                'slds-dropdown_bottom slds-dropdown_right slds-dropdown_bottom-right':
                    alignment === 'bottom-right',
                'slds-dropdown_bottom slds-dropdown_left slds-dropdown_bottom-left':
                    alignment === 'bottom-left',
            })
            .toString();
    }

    get computedInputClass() {
        const classes = classSet('slds-input slds-combobox__input');
        if (this.hasInputPill) {
            classes.add('slds-combobox__input-value');
        } else {
            classes.add({
                'slds-input-has-icon_group-right': this
                    .showInputActivityIndicator,
            });
        }
        return classes.toString();
    }

    get _shouldOpenDropDown() {
        // If items were empty and through a user interaction the dropdown should have opened, and if the
        // component still has the focus we'll open it on items update instead.
        return (
            !this.dropdownDisabled &&
            this._inputHasFocus &&
            this._requestedDropdownOpen
        );
    }

    get dropdownDisabled() {
        return this.readOnly || this.disabled;
    }

    handleOptionClick(event) {
        if (event.currentTarget.hasAttribute('aria-selected')) {
            event.stopPropagation();
            event.preventDefault();

            this.selectOptionAndCloseDropdown(event.currentTarget);
        }
    }

    handleOptionMouseEnter(event) {
        if (event.currentTarget.hasAttribute('aria-selected')) {
            this.highlightOption(event.currentTarget);
        }
    }

    handleDropdownMouseLeave() {
        this.removeHighlight();

        // This is to account for when a user makes a mousedown press on the dropdown and then leaves the dropdown
        // area, it would leave the dropdown open even though the focus would no longer be on the input
        if (!this._inputHasFocus) {
            this.closeDropdown();
        }
    }

    handleTriggerClick(event) {
        event.stopPropagation();

        this.allowBlur();

        if (this.dropdownDisabled) {
            return;
        }

        if (!this.hasInputPill) {
            // toggle dropdown only for readonly combobox, only open the dropdown otherwise
            // if it's not already opened.
            if (this._inputReadOnly) {
                if (this._dropdownVisible) {
                    this.closeDropdown();
                } else {
                    this.openDropdownIfNotEmpty();
                }
            } else {
                this.openDropdownIfNotEmpty();
            }
            this.inputElement.focus();
        }
    }

    handlePillKeyDown(event) {
        if (this.dropdownDisabled) {
            return;
        }
        if (event.keyCode === keyCodes.delete) {
            this.handlePillRemove();
        }
    }

    handleInputKeyDown(event) {
        if (this.dropdownDisabled) {
            return;
        }
        if (this.hasInputPill) {
            this.handlePillKeyDown(event);
        } else {
            handleKeyDownOnInput(
                event,
                this.getCurrentHighlightedOptionIndex(),
                this._keyboardInterface
            );
        }
    }

    handleTextChange() {
        this._events.dispatchTextChange(this.inputElement.value);
    }

    handleFocus() {
        this._inputHasFocus = true;
        this._events.dispatchFocus();
    }

    handleInput() {
        this._events.dispatchTextInput(this.inputElement.value);
    }

    handleBlur() {
        this._inputHasFocus = false;

        if (this._cancelBlur) {
            return;
        }
        this.closeDropdown();

        this._events.dispatchBlur();
    }

    handleDropdownMouseDown(event) {
        const mainButton = 0;
        if (event.button === mainButton) {
            this.cancelBlur();
        }
    }

    handleDropdownMouseUp() {
        // We need this to make sure that if a scrollbar is being dragged with the mouse, upon release
        // of the drag we allow blur, otherwise the dropdown would not close on blur since we'd have cancel blur
        // set
        this.allowBlur();
    }

    highlightOption(option) {
        this.removeHighlight();
        if (option) {
            option.highlight();
            this._highlightedOptionElement = option;
            this._highlightedOptionElementId = option.getAttribute(
                'data-item-id'
            );
            // active element is a component id getter works properly
            this._activeElementDOMId = option.id;
        }
        this.synchronizeA11y();
    }

    highlightOptionAndScrollIntoView(optionElement) {
        if (this._items.length === 0 || !optionElement) {
            return;
        }
        this.highlightOption(optionElement);
        scrollIntoViewIfNeeded(optionElement, this.listboxElement);
    }

    removeHighlight() {
        const option = this._highlightedOptionElement;
        if (option) {
            option.removeHighlight();
            this._highlightedOptionElement = null;
            this._highlightedOptionElementId = null;
            this._activeElementDOMId = null;
        }
    }

    selectOptionAndCloseDropdown(optionElement) {
        this.closeDropdown();

        this.inputElement.focus();

        const value = optionElement.getAttribute('data-value');
        this._events.dispatchSelect(value);
    }

    handleInputSelect(event) {
        event.stopPropagation();
    }

    openDropdownIfNotEmpty() {
        if (this._dropdownVisible) {
            // Already visible
            return;
        }

        const noOptions = !Array.isArray(this.items) || this.items.length === 0;
        if (noOptions) {
            // Dispatch dropdown open request
            this._events.dispatchDropdownOpenRequest();
        }

        // Do not open if there's nothing to show in the dropdown (eg. no options and no dropdown activity indicator)
        if (this.isDropdownEmpty) {
            // We use this attribute to flag whether an attempt has been made via user-interaction
            // to open the dropdown
            this._requestedDropdownOpen = true;
            return;
        }

        if (!this._hasDropdownOpened) {
            if (this._unprocessedItems) {
                this.updateItems(this._unprocessedItems);
            }
            this._hasDropdownOpened = true;
        }

        this._requestedDropdownOpen = false;

        this._dropdownVisible = true;

        this.startDropdownAutoPositioning();
        this.highlightDefaultItem();

        this._events.dispatchDropdownOpen();
    }

    closeDropdown() {
        if (!this._dropdownVisible) {
            // Already closed
            return;
        }
        this.stopDropdownPositioning();
        this.removeHighlight();
        this._dropdownVisible = false;
    }

    findOptionElementByIndex(index) {
        return this.template.querySelector(
            `[data-item-id="${this.itemId(index)}"]`
        );
    }

    allowBlur() {
        this._cancelBlur = false;
    }

    cancelBlur() {
        this._cancelBlur = true;
    }

    getCurrentHighlightedOptionIndex() {
        if (this._highlightedOptionElementId) {
            return this.itemIndexFromId(this._highlightedOptionElementId);
        }
        return -1;
    }

    get inputElement() {
        return this.template.querySelector('input');
    }

    startDropdownAutoPositioning() {
        if (this.dropdownAlignment !== 'auto') {
            return;
        }

        if (!this._autoPosition) {
            this._autoPosition = new AutoPosition(this);
        }

        this._autoPosition.start({
            target: () => this.template.querySelector('input'),
            element: () => this.template.querySelector('div.slds-dropdown'),
            align: {
                horizontal: Direction.Left,
                vertical: Direction.Top,
            },
            targetAlign: {
                horizontal: Direction.Left,
                vertical: Direction.Bottom,
            },
            autoFlip: true,
            alignWidth: true,
        });
    }

    stopDropdownPositioning() {
        if (this._autoPosition) {
            this._autoPosition.stop();
        }
    }

    get hasInputPill() {
        return this.inputPill && Object.keys(this.inputPill).length > 0;
    }

    handlePillRemove() {
        this.inputElement.focus();
        this._events.dispatchPillRemove(this.inputPill);
    }

    get computedFormElementClass() {
        const hasIcon = this.hasInputPill && this.inputPill.iconName;
        return classSet('slds-combobox__form-element slds-input-has-icon')
            .add({
                'slds-input-has-icon_right': !hasIcon,
                'slds-input-has-icon_left-right': hasIcon,
            })
            .toString();
    }

    get computedAriaExpanded() {
        return this._dropdownVisible ? 'true' : 'false';
    }

    updateItems(items) {
        if (!items) {
            return;
        }

        assert(Array.isArray(items), '"items" must be an array');

        this._selectableItems = 0;
        this._highlightedItemIndex = 0;

        this._items = items.map(item => {
            if (item.items) {
                // This is a group
                const groupCopy = { label: item.label };
                groupCopy.items = item.items.map(groupItem => {
                    return this.processItem(groupItem);
                });
                return groupCopy;
            }
            return this.processItem(item);
        });
    }

    highlightDefaultItem() {
        requestAnimationFrame(() => {
            this.highlightOptionAndScrollIntoView(
                this.findOptionElementByIndex(this._highlightedItemIndex)
            );
        });
    }

    get isDropdownEmpty() {
        // If the activity indicator is showing then it's not empty
        return (
            !this.showDropdownActivityIndicator &&
            (!Array.isArray(this.items) || this.items.length === 0)
        );
    }

    dropdownKeyboardInterface() {
        const that = this;
        return {
            getTotalOptions() {
                return that._selectableItems;
            },
            selectByIndex(index) {
                that.selectOptionAndCloseDropdown(
                    that.findOptionElementByIndex(index)
                );
            },
            highlightOptionWithIndex(index) {
                that.highlightOptionAndScrollIntoView(
                    that.findOptionElementByIndex(index)
                );
            },
            isInputReadOnly() {
                return that._inputReadOnly;
            },
            highlightOptionWithText(currentIndex, text) {
                // This only supports a flat structure, groups are not supported
                for (
                    let index = currentIndex + 1;
                    index < that._items.length;
                    index++
                ) {
                    const option = that._items[index];
                    if (
                        option.selectable &&
                        option.text &&
                        option.text
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) === 0
                    ) {
                        that.highlightOptionAndScrollIntoView(
                            that.findOptionElementByIndex(index)
                        );
                        return;
                    }
                }
                for (let index = 0; index < currentIndex; index++) {
                    const option = that._items[index];
                    if (
                        option.selectable &&
                        option.text &&
                        option.text
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) === 0
                    ) {
                        that.highlightOptionAndScrollIntoView(
                            that.findOptionElementByIndex(index)
                        );
                        return;
                    }
                }
            },
            isDropdownVisible() {
                return that._dropdownVisible;
            },
            openDropdownIfNotEmpty() {
                that.openDropdownIfNotEmpty();
            },
            closeDropdown() {
                that.closeDropdown();
            },
        };
    }
}

function scrollIntoViewIfNeeded(element, scrollingParent) {
    const parentRect = scrollingParent.getBoundingClientRect();
    const findMeRect = element.getBoundingClientRect();
    if (findMeRect.top < parentRect.top) {
        if (element.offsetTop + findMeRect.height < parentRect.height) {
            // If element fits by scrolling to the top, then do that
            scrollingParent.scrollTop = 0;
        } else {
            // Otherwise, top align the element
            scrollingParent.scrollTop = element.offsetTop;
        }
    } else if (findMeRect.bottom > parentRect.bottom) {
        // bottom align the element
        scrollingParent.scrollTop += findMeRect.bottom - parentRect.bottom;
    }
}
