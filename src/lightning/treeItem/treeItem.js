import labelCollapseBranch from '@salesforce/label/LightningTree.collapseBranch';
import labelExpandBranch from '@salesforce/label/LightningTree.expandBranch';
import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import { keyCodes } from 'lightning/utilsPrivate';

const i18n = {
    collapseBranch: labelCollapseBranch,
    expandBranch: labelExpandBranch,
};

export default class LightningTreeItem extends LightningElement {
    @track _children = [];
    @track _tabindexes = {};
    @track _selected = {};

    _focusedChild = null;

    @api isRoot = false;
    @api label;
    @api href;
    @api metatext;
    @api nodeRef;
    @api isExpanded;
    @api isDisabled = false;
    @api nodename;
    @api nodeKey;
    @api isLeaf;

    @api
    get childItems() {
        return this._children;
    }

    set childItems(value) {
        this._children = value;
        const childLen = this._children.length;
        for (let i = 0; i < childLen; i++) {
            let tabIndexValue = -1;
            if (this.focusedChild === i) {
                tabIndexValue = 0;
            }
            this.setTabindexAttribute(i, tabIndexValue);
            this.setSelectedAttribute(i, 'false');
        }
    }

    @api
    get focusedChild() {
        return this._focusedChild;
    }

    set focusedChild(value) {
        this._focusedChild = value;
        for (let i = 0; i < this._children.length; i++) {
            if (i === value) {
                this.setTabindexAttribute(i, 0);
                break;
            }
        }
    }

    setTabindexAttribute(childNum, value) {
        this._tabindexes[childNum] = value;
    }

    setSelectedAttribute(childNum, value) {
        this._selected[childNum] = value;
    }

    connectedCallback() {
        this.dispatchEvent(
            new CustomEvent('privateregisteritem', {
                composed: true,
                bubbles: true,
                detail: {
                    focusCallback: this.makeChildFocusable.bind(this),
                    unfocusCallback: this.makeChildUnfocusable.bind(this),
                    key: this.nodeKey,
                },
            })
        );
        this.addEventListener('focus', this.handleFocus.bind(this));
        this.addEventListener('blur', this.handleBlur.bind(this));
        this.addEventListener('keydown', this.handleKeydown.bind(this));
        this.template.addEventListener(
            'privatechildunfocused',
            this.handleChildUnfocused.bind(this)
        );
        this.template.addEventListener(
            'privatechildfocused',
            this.handleChildFocused.bind(this)
        );
    }

    get buttonLabel() {
        if (this.nodeRef && this.nodeRef.expanded) {
            return i18n.collapseBranch;
        }
        return i18n.expandBranch;
    }

    get showExpanded() {
        if (!this.nodeRef) {
            return false;
        }
        return !this.isDisabled && this.nodeRef.expanded;
    }

    get computedButtonClass() {
        return classSet('slds-button slds-button_icon slds-m-right_x-small ')
            .add({
                'slds-is-disabled': this.isLeaf || this.isDisabled,
            })
            .toString();
    }

    get children() {
        return this._children.map((child, idx) => {
            return {
                node: child,
                tabindex: this._tabindexes[idx],
                selected: this._selected[idx],
            };
        });
    }

    preventDefaultAndStopPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    handleClick(event) {
        if (!this.isDisabled) {
            // eslint-disable-next-line no-script-url
            if (this.href === 'javascript:void(0)') {
                event.preventDefault();
            }
            let target = 'anchor';
            if (
                event.target.tagName === 'BUTTON' ||
                event.target.tagName === 'LIGHTNING-PRIMITIVE-ICON'
            ) {
                target = 'chevron';
            }
            const customEvent = new CustomEvent('privateitemclick', {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: {
                    name: this.nodename,
                    key: this.nodeKey,
                    target,
                },
            });
            this.dispatchEvent(customEvent);
        }
    }

    handleKeydown(event) {
        switch (event.keyCode) {
            case keyCodes.space:
            case keyCodes.enter:
                this.preventDefaultAndStopPropagation(event);
                this.template.querySelector('.slds-tree__item a').click();
                break;
            case keyCodes.up:
            case keyCodes.down:
            case keyCodes.right:
            case keyCodes.left:
            case keyCodes.home:
            case keyCodes.end:
                this.preventDefaultAndStopPropagation(event);
                this.dispatchEvent(
                    new CustomEvent('privateitemkeydown', {
                        bubbles: true,
                        composed: true,
                        cancelable: true,
                        detail: {
                            key: this.nodeKey,
                            keyCode: event.keyCode,
                        },
                    })
                );
                break;

            default:
                break;
        }
    }

    fireCustomEvent(eventName, item) {
        const eventObject = {
            bubbles: true,
            composed: true,
            cancelable: false,
        };
        if (item !== undefined) {
            eventObject.detail = { key: item };
        }
        // eslint-disable-next-line lightning-global/no-custom-event-identifier-arguments
        this.dispatchEvent(new CustomEvent(eventName, eventObject));
    }

    handleFocus() {
        this.fireCustomEvent('privatechildfocused', this.nodeKey);
    }

    handleBlur() {
        this.fireCustomEvent('privatechildunfocused', this.nodeKey);
    }

    getChildNum(childKey) {
        const idx = childKey.lastIndexOf('.');
        const childNum =
            idx > -1
                ? parseInt(childKey.substring(idx + 1), 10)
                : parseInt(childKey, 10);
        return childNum - 1;
    }

    // Event handlers to handle attribute changes in IMMEDIATE CHILD, if immediate child change attribute
    // and stop event propagation
    /**
     * Callback so that the child it contains can be made focusable
     * @param {string} childKey key of the item to receive focus
     * @param {boolean} shouldFocus boolean to indicate whether focus should happen immediately
     */
    makeChildFocusable(childKey, shouldFocus) {
        const child = this.getImmediateChildItem(childKey);

        this.setTabindexAttribute(this.getChildNum(childKey), 0);
        if (child && shouldFocus) {
            child.focus();
        }
    }

    /**
     * Callback so that the child it contains can be made unfocusable
     * @param {String} childKey key of the item to make unfocusable
     */
    makeChildUnfocusable(childKey) {
        this.setTabindexAttribute(this.getChildNum(childKey), -1);
    }

    /**
     * Event handler to set aria-selected on the child it contains
     * @param {object} event custom-event child_focused fired by tree_item
     */
    handleChildFocused(event) {
        const child = this.getImmediateChildItem(event.detail.key);
        if (child) {
            event.stopPropagation();
            this.setSelectedAttribute(
                this.getChildNum(event.detail.key),
                'true'
            );
        }
    }

    /**
     * Event handler to set aria-selected on the child it contains
     * @param {object} event custom-event child_unfocused fired by tree_item
     */
    handleChildUnfocused(event) {
        const child = this.getImmediateChildItem(event.detail.key);
        if (child) {
            event.stopPropagation();
            this.setSelectedAttribute(
                this.getChildNum(event.detail.key),
                'false'
            );
        }
    }

    getImmediateChildItem(key) {
        return this.template.querySelector(
            "lightning-tree-item[data-key='" + key + "']"
        );
    }
}
