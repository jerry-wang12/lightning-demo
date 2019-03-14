import labelContainerLabel from '@salesforce/label/LightningPillContainer.label';
import pillContainerMoreLabel from '@salesforce/label/LightningPillContainer.more';
import { LightningElement, api, track } from 'lwc';
import LightningPillItem from './pillItem';
import {
    keyCodes,
    normalizeBoolean,
    normalizeString,
} from 'lightning/utilsPrivate';
import { LightningResizeObserver } from 'lightning/resizeObserver';

const PILL_SELECTOR = 'lightning-pill';

const i18n = {
    containerLabel: labelContainerLabel,
};

/**
 * A list of pills grouped in a container. This component requires API version 42.0 and later.
 */
export default class LightningPillContainer extends LightningElement {
    /**
     * Aria label for the pill container.
     * @type {string}
     */
    @api label = i18n.containerLabel;

    @track _variant;
    @track _pills = [];
    @track _singleLine = false;
    @track _isExpanded = false;
    @track _isCollapsible = false;
    @track _focusedIndex = 0;
    @track _focusedTabIndex = 0;
    @track _pillsNotFittingCount;
    @track _pillContainerElementId;

    constructor() {
        super();
        this._pills = [];
    }

    connectedCallback() {
        this._connected = true;
        if (this.variant !== 'bare') {
            this.classList.add('slds-pill_container');
        }
    }

    disconnectedCallback() {
        this._connected = false;
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
        }
    }

    renderedCallback() {
        if (this._resizeObserver) {
            // If we have a resize observer and the pill container is not collapsible it means it was changed
            // to not collapsible, we should disconnect the resize observer.
            if (!this.isCollapsible) {
                this._resizeObserver.disconnect();
                this._resizeObserver = undefined;
            }
        } else if (this.isCollapsible) {
            // No resize observer and is collapsible, we should setup the resize observer
            this._resizeObserver = this._setupResizeObserver();
        }

        const ul = this.template.querySelector('ul');
        if (this._pills.length === 0) {
            // If no option is present, set ul has the focus (SLDS require UL has focus).
            ul.tabIndex = 0;
        } else {
            ul.tabIndex = -1;
            this.setFocusedItemTabIndex(0);
            // Consider adding pills programmatically to empty pill container.
            // UL has focus, so should shift focus to pill.
            if (this.template.querySelector('ul:focus')) {
                this.focus();
            }
        }
    }

    /**
     * The variant changes the appearance of the pill container. Accepted variants
     * include standard and bare. This value defaults to standard.
     * @type {string}
     * @default standard
     */
    @api
    get variant() {
        return this._variant || 'standard';
    }

    set variant(value) {
        this._variant = normalizeString(value, {
            fallbackValue: 'standard',
            validValues: ['standard', 'bare'],
        });
    }

    /**
     * Specifies whether to keep the pills in a single line.
     * @type {boolean}
     *
     */
    @api
    get singleLine() {
        return this._singleLine;
    }

    set singleLine(value) {
        this._singleLine = normalizeBoolean(value);
    }

    /**
     * Specifies whether the pill container can be collapsed.
     * @type {boolean}
     */
    @api
    get isCollapsible() {
        return this._isCollapsible;
    }

    set isCollapsible(value) {
        this._isCollapsible = normalizeBoolean(value);
    }

    /**
     * Specifies whether the pill container is expanded.
     * @type {boolean}
     */
    @api
    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        this._isExpanded = normalizeBoolean(value);
        this.classList.toggle('slds-is-expanded', this._isExpanded);
    }

    /**
     * An array of items to be rendered as pills in a container.
     * @type {list}
     */
    @api
    get items() {
        return this._pills;
    }

    set items(value) {
        this._pillsChanged = true;
        this._pills = (value || []).map(item => new LightningPillItem(item));
    }

    get pillViewModels() {
        return this._pills.map((pill, index) => {
            return {
                pill,
                tabIndex:
                    this._focusedIndex === index ? this._focusedTabIndex : -1,
            };
        });
    }

    get computedListboxClass() {
        const singleLineClass = this.singleLine ? 'slds-listbox_inline' : '';
        return `slds-listbox slds-listbox_horizontal ${singleLineClass}`;
    }

    get focusedIndex() {
        // NOTE: this._pills is manged by getter, setter. So it won't be null or undefined.
        // So call this._pill.length is safe.
        if (this._focusedIndex >= this._pills.length) {
            // Change is due to itemremove event, should move focus to the last one.
            this._focusedIndex = this._deleteLast ? this._pills.length - 1 : 0;
            this._deleteLast = false;
        } else if (this._focusedIndex < 0) {
            this._focusedIndex = this._pills.length - 1;
        }
        return this._focusedIndex;
    }

    set focusedIndex(value) {
        // Host may asynchronous update items. For example, move focus to latest item with right/left key, then host change items.
        // Then at renderedCallback call, need to update which item should has focus, but index > items.length.
        // When set it, the index is valid, but when rendered, index is not valid, so the validation check is happened at getter.
        this._focusedIndex = value;
    }

    get pillNodes() {
        if (!this._pillNodes || this._pillsChanged) {
            this._pillsChanged = false;
            this._pillNodes =
                this.template.querySelectorAll(PILL_SELECTOR) || [];
        }
        return this._pillNodes;
    }

    get focusedNode() {
        const pills = this.pillNodes;
        return pills.length <= 0 ? null : pills[this.focusedIndex];
    }

    /**
     * Sets focus on the pill list.
     */
    @api
    focus() {
        const focusedNode = this.focusedNode;
        if (focusedNode) {
            focusedNode.focus();
        } else {
            const ul = this.template.querySelector('ul');
            if (ul) {
                ul.focus();
            }
        }
    }

    handleRemove(removeEvent) {
        const index = parseInt(removeEvent.detail.name, 10);
        if (typeof index !== 'number' || index < 0) {
            return;
        }

        this.fireEvent(index);
    }

    fireEvent(index) {
        // Mouse click on non-focused pill, switch focus to it.
        if (this.focusedIndex !== index) {
            this.switchFocus(index);
        }
        // Request to remove the last one, if removed, should move focus to last.
        this._deleteLast = index >= this._pills.length - 1;

        this.dispatchEvent(
            new CustomEvent('itemremove', {
                detail: {
                    item: this.items[index].item,
                    index,
                },
            })
        );
    }

    setFocusedItemTabIndex(value) {
        const focusedNode = this.focusedNode;
        if (focusedNode) {
            this._focusedTabIndex = value;
        }
    }

    switchFocus(newValue) {
        // remove focus from current pill
        this.setFocusedItemTabIndex(-1);
        // move to next
        this.focusedIndex = newValue;
        // set focus
        this.setFocusedItemTabIndex(0);
        this.focus();
    }

    handleKeyDown(event) {
        if (this._pills.length <= 0) {
            return;
        }
        const index = this.focusedIndex;
        switch (event.keyCode) {
            case keyCodes.left:
            case keyCodes.up:
                this.switchFocus(index - 1);
                break;
            case keyCodes.right:
            case keyCodes.down:
                this.switchFocus(index + 1);
                break;
            default:
                this.focus();
        }
    }

    handlePillFocus() {
        if (!this._hasFocus) {
            this._hasFocus = true;
            this.dispatchEvent(new CustomEvent('focus'));
        }
    }

    handlePillBlur(event) {
        // Replace the below with !this.template.contains(event.relatedTarget) once 0.24 is out
        if (
            !event.relatedTarget ||
            !event.relatedTarget.hasAttribute('data-pill')
        ) {
            this._hasFocus = false;

            this.dispatchEvent(new CustomEvent('blur'));
        }
    }

    handleClick() {
        this.focus();
    }

    handlePillClick(clickEvent) {
        const index = parseInt(clickEvent.currentTarget.name, 10);

        if (index >= 0 && this.focusedIndex !== index) {
            this.switchFocus(index);
        } else {
            this.focus();
        }
        clickEvent.stopPropagation();
    }

    handleMoreClick() {
        this.focus();
    }

    get _showMore() {
        return this.isCollapsible && !this.isExpanded;
    }

    get computedPillCountMoreLabel() {
        if (
            this._isExpanded ||
            isNaN(this._pillsNotFittingCount) ||
            this._pillsNotFittingCount <= 0
        ) {
            return undefined;
        }
        // TODO: We should have a standard utility for that
        return pillContainerMoreLabel.replace(
            '{0}',
            this._pillsNotFittingCount
        );
    }

    _setupResizeObserver() {
        const resizeObserver = new LightningResizeObserver(() => {
            const visibleHeight = this.getBoundingClientRect().height;

            let notFittingCount = 0;
            for (let i = 0; i < this.pillNodes.length; i++) {
                const node = this.pillNodes[i];
                if (node.offsetTop > visibleHeight) {
                    notFittingCount += 1;
                }
            }
            this._pillsNotFittingCount = notFittingCount;
        });
        resizeObserver.observe(this.template.querySelector('[role="listbox"]'));
        return resizeObserver;
    }
}
