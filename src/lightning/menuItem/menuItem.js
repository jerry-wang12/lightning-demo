import { LightningElement, api, track, unwrap } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    normalizeString,
    keyCodes,
} from 'lightning/utilsPrivate';

/**
 * Represents a list item in a menu.
 */
export default class LightningMenuItem extends LightningElement {
    /**
     * A value associated with the menu item.
     * @type {string}
     */
    @api value;

    /**
     * Text of the menu item.
     * @type {string}
     */
    @api label;

    /**
     * The name of an icon to display after the text of the menu item.
     * @type {string}
     */
    @api iconName;

    @track
    state = {
        accesskey: null,
        disabled: false,
        tabindex: '-1',
        checked: undefined,
        isDraft: false,
    };

    /**
     * The name of an icon to display before the text of the menu item.
     * @type {string}
     */
    @api prefixIconName;

    /**
     * URL for a link to use for the menu item.
     * @type {string}
     */
    @api href;

    /**
     * Describes the reason for showing the draft indicator.
     * This is required when is-draft is present on the lightning-menu-item tag.
     * @type {string}
     */
    @api draftAlternativeText;

    connectedCallback() {
        this.classList.add('slds-dropdown__item');

        this.setAttribute('role', 'presentation');
    }

    /**
     * If present, a draft indicator is shown on the menu item.
     * A draft indicator is denoted by blue asterisk on the left of the menu item.
     * When you use a draft indicator, include alternative text for accessibility using draft-alternative-text.
     * @type {boolean}
     * @default false
     */
    @api
    get isDraft() {
        return this.state.isDraft;
    }

    set isDraft(value) {
        this.state.isDraft = normalizeBoolean(value);
    }

    /**
     * The keyboard shortcut for the menu item.
     * @type {string}
     */
    @api
    get accessKey() {
        return this.state.accesskey;
    }

    set accessKey(newValue) {
        this.state.accesskey = newValue;
        this.handleAccessKeyChange(newValue);
    }

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * tabindex can be set to 0 or -1.
     * The default tabindex value is 0, which means that the menu item is focusable and
     * participates in sequential keyboard navigation. The value -1 means
     * that the menu item is focusable but does not participate in keyboard navigation.
     * @type {number}
     */
    @api
    get tabIndex() {
        return this.state.tabindex;
    }

    set tabIndex(newValue) {
        this.state.tabindex = newValue;
        this.handleTabIndexChange(newValue);
    }

    handleAccessKeyChange(value) {
        this.state.accesskey = value;
    }

    handleTabIndexChange(value) {
        this.state.tabindex = value;
    }

    get computedAccessKey() {
        return this.state.accesskey;
    }

    get computedTabIndex() {
        return this.state.tabindex;
    }

    /**
     * If present, the menu item is disabled and users cannot interact with it.
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
     * If present, a check mark displays on the left of the menu item if it's selected.
     * @type {boolean}
     * @default false
     */
    @api
    get checked() {
        return this.state.checked;
    }
    set checked(value) {
        if (typeof value === 'string') {
            // handle string
            value = normalizeString(value, {
                fallbackValue: undefined,
                validValues: ['true', 'false'],
            });
            if (value !== undefined) {
                value = value === 'true';
            }
        }
        if (value !== undefined) {
            // handle boolean which is from above or user
            value = normalizeBoolean(value);
        }
        this.state.checked = value;

        this.classList.toggle('slds-is-selected', this.checked === true);
    }

    get computedCheckedIconClass() {
        // note that what .slds-icon_selected does is to hide the checked icon
        return classSet(
            'slds-icon slds-icon_x-small slds-icon-text-default slds-m-right_x-small'
        )
            .add({ 'slds-icon_selected': !this.checked })
            .toString();
    }

    get computedHref() {
        // eslint-disable-next-line no-script-url
        return this.href ? this.href : 'javascript:void(0)';
    }

    get computedAriaChecked() {
        return this.isMenuItemCheckbox ? this.checked + '' : null;
    }

    get computedAriaDisabled() {
        // Note: Needed to explicitly set aria-disabled="true"
        return this.disabled ? 'true' : 'false';
    }

    get isMenuItemCheckbox() {
        return this.checked !== undefined;
    }

    get computedRole() {
        return this.isMenuItemCheckbox ? 'menuitemcheckbox' : 'menuitem';
    }

    handleBlur() {
        this.dispatchEvent(new CustomEvent('blur'));

        // we need to trigger a private blur to make it bubble and be handled by parent button-menu
        this.dispatchEvent(
            new CustomEvent('privateblur', {
                composed: true,
                bubbles: true,
                cancelable: true,
            })
        );
    }

    handleFocus() {
        // trigger a private focus to make it bubble and be handled by parent button-menu
        // this is used for resetting cancelBlur in button-menu
        this.dispatchEvent(
            new CustomEvent('privatefocus', {
                bubbles: true,
                cancelable: true,
            })
        );
    }

    handleClick() {
        // no action needed when item is disabled
        if (this.disabled) {
            // do nothing and return
            return;
        }

        // allow HREF to be followed
        if (this.href) {
            // do nothing and take default action
        } else {
            this.dispatchSelect();
        }
    }

    handleKeyDown(event) {
        // no action needed when item is disabled
        if (this.disabled) {
            // do nothing and return
            return;
        }

        if (event.keyCode === keyCodes.space) {
            // follow HREF if a value was provided
            if (this.href) {
                // trigger click behavior
                this.template.querySelector('a').click();
            } else {
                // if no HREF is provided follow usual select behavior
                this.dispatchSelect();
            }
        }
    }

    /**
     *
     * The select event is a non-navigational event.
     * The purpose of the event is to toggle the selected state of a menu item.
     * It will not be dispatched if a menu item has an HREF value to navigate to (other than the default).
     * This event will be handled by the parent button-menu component.
     *
     **/
    dispatchSelect() {
        if (!this.disabled) {
            this.dispatchEvent(
                new CustomEvent('privateselect', {
                    composed: true,
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        value: unwrap(this.value),
                    },
                })
            );
        }
    }

    /**
     * Sets focus on the anchor element in the menu item.
     */
    @api
    focus() {
        // set the focus on the anchor element
        this.template.querySelector('a').focus();
        // dispatch a focus event for the menu item component
        this.dispatchEvent(new CustomEvent('focus'));
    }
}
