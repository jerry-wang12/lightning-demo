import labelLoading from '@salesforce/label/LightningButtonMenu.loading';
import labelShowMenu from '@salesforce/label/LightningButtonMenu.showMenu';
import { unwrap, LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    normalizeBoolean,
    observePosition,
    normalizeString,
} from 'lightning/utilsPrivate';
import {
    handleKeyDownOnMenuItem,
    handleKeyDownOnMenuTrigger,
} from './keyboard';
import {
    Direction,
    startPositioning,
    stopPositioning,
} from 'lightning/positionLibrary';

const i18n = {
    loading: labelLoading,
    showMenu: labelShowMenu,
};

// CSS class and selectors for menu items
const menuItemCSSClassName = 'slds-dropdown__item';
const menuItemCSSSelector = `.slds-dropdown__list .${menuItemCSSClassName}`;

/**
 * Represents a dropdown menu with a list of actions or functions.
 */
export default class LightningButtonMenu extends LightningElement {
    static delegatesFocus = true;
    /**
     * The variant changes the look of the button.
     * Accepted variants include bare, container, border, border-filled, bare-inverse, and border-inverse.
     * This value defaults to border.
     *
     * @type {string}
     * @default border
     */
    @api variant = 'border';

    /**
     * The size of the icon.
     * Options include xx-small, x-small, medium, or large.
     * This value defaults to medium.
     *
     * @type {string}
     * @default medium
     */
    @api iconSize = 'medium';

    /**
     * The name of the icon to be used in the format 'utility:down'.
     * If an icon other than 'utility:down' or 'utility:chevrondown' is used,
     * a utility:down icon is appended to the right of that icon.
     * This value defaults to utility:down.
     *
     * @type {string}
     * @default utility:down
     */
    @api iconName = 'utility:down';

    /**
     * The value for the button element.
     * This value is optional and can be used when submitting a form.
     *
     * @type {string}
     */
    @api value = '';

    /**
     * The assistive text for the button.
     *
     * @type {string}
     */
    @api alternativeText = i18n.showMenu;

    /**
     * Message displayed while the menu is in the loading state.
     *
     * @type {string}
     */
    @api loadingStateAlternativeText = i18n.loading;

    /**
     * Optional text to be shown on the button.
     *
     * @type {string}
     */
    @api label;

    /**
     * Describes the reason for showing the draft indicator.
     * This is required when is-draft is true.
     *
     * @type {string}
     */
    @api draftAlternativeText;

    _positioning = false;
    privateMenuAlignment = 'left';
    privateBoundingRect = {};
    @track _order = null;

    @track
    state = {
        accesskey: null,
        disabled: false,
        dropdownVisible: false,
        dropdownOpened: false,
        nubbin: false,
        tabindex: 0,
        title: null,
        isDraft: false,
        isLoading: false,
        focusOnIndexDuringRenderedCallback: null,
    };

    /**
     * Determines the alignment of the menu relative to the button.
     * Available options are: auto, left, center, right, bottom-left, bottom-center, bottom-right.
     * The auto option aligns the dropdown menu based on available space.
     * This value defaults to left.
     *
     * @type {string}
     * @default left
     */
    @api
    get menuAlignment() {
        return this.privateMenuAlignment;
    }

    set menuAlignment(value) {
        this.privateMenuAlignment = normalizeString(value, {
            fallbackValue: 'left',
            validValues: [
                'auto',
                'auto-right',
                'auto-left',
                'left',
                'center',
                'right',
                'bottom-left',
                'bottom-center',
                'bottom-right',
            ],
        });
    }

    /**
     * If present, the menu can be opened by users.
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
     * If present, a nubbin is present on the menu.
     * A nubbin is a stub that protrudes from the menu item towards the button menu.
     * The nubbin position is based on the menu-alignment.
     * @type {boolean}
     * @default false
     */
    @api
    get nubbin() {
        return this.state.nubbin;
    }

    set nubbin(value) {
        this.state.nubbin = normalizeBoolean(value);
    }

    /**
     * Displays tooltip text when the mouse moves over the button menu.
     * @type {string}
     */
    @api
    get title() {
        return this.state.title;
    }

    set title(newValue) {
        this.state.title = newValue;
    }

    /**
     * If present, the menu trigger shows a draft indicator.
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
     * If present, the menu is in a loading state and shows a spinner.
     * @type {boolean}
     * @default false
     */
    @api
    get isLoading() {
        return this.state.isLoading;
    }

    set isLoading(value) {
        const normalizedValue = normalizeBoolean(value);
        if (this.isAutoAlignment()) {
            // stop previous positioning if any as it maintains old position relationship
            this.stopPositioning();

            if (this.state.isLoading && !normalizedValue) {
                // was loading before and now is not, we need to reposition
                this.startPositioning();
            }
        }

        this.state.isLoading = normalizedValue;
    }

    /**
     * The keyboard shortcut for the button menu.
     * @type {string}
     */
    @api
    get accessKey() {
        return this.state.accesskey;
    }

    set accessKey(newValue) {
        this.state.accesskey = newValue;
    }

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * tabindex can be set to 0 or -1.
     * The default tabindex value is 0, which means that the button is focusable and participates in sequential keyboard navigation.
     * -1 means that the button is focusable but does not participate in keyboard navigation.
     * @type {number}
     */
    @api
    get tabIndex() {
        return -1;
    }

    set tabIndex(newValue) {
        this.setAttribute('tabindex', newValue);
        this.state.tabindex = newValue;
    }

    get computedAriaExpanded() {
        return String(this.state.dropdownVisible); // default value must be a string for the attribute to always be present with a string value
    }

    connectedCallback() {
        this.keyboardInterface = this.menuKeyboardInterface();

        this.classList.add(
            'slds-dropdown-trigger',
            'slds-dropdown-trigger_click'
        );

        if (this.isDraft) {
            this.classList.add('slds-is-unsaved');
        }

        // button-group necessities
        const privatebuttonregister = new CustomEvent('privatebuttonregister', {
            bubbles: true,
            detail: {
                callbacks: {
                    setOrder: this.setOrder.bind(this),
                    setDeRegistrationCallback: deRegistrationCallback => {
                        this._deRegistrationCallback = deRegistrationCallback;
                    },
                },
            },
        });

        this.dispatchEvent(privatebuttonregister);
    }

    disconnectedCallback() {
        if (this._deRegistrationCallback) {
            this._deRegistrationCallback();
        }
    }

    renderedCallback() {
        // if we are using autopositioning focus happens in its own cycle
        if (!this._positioning && this.state.dropdownVisible) {
            // logic to focus on first menu item after render
            this.focusOnMenuItemAfterRender();
        }
    }

    focusOnMenuItemAfterRender() {
        // if no menu items are focused then set focus on the first or last one once registered
        // :: this can occur if there's a delay in loading the menu items (loading from server for example)
        // :: revealing the menu in an empty state to later have menu items loaded
        let focusOnIndex = this.state.focusOnIndexDuringRenderedCallback || 0;

        // if focus index is greater than the size of the list,
        // or next focus should be on LAST,
        // set to the last item
        const menuItems = this.getMenuItems();

        // if specified as 'LAST' set it to a valid numeric value instead
        if (focusOnIndex === 'LAST') {
            focusOnIndex = menuItems.length - 1;

            // maintain 'LAST' value if menu items aren't available yet
            if (focusOnIndex < 0) {
                focusOnIndex = 'LAST';
            }
        }

        // only perform operations when we have a valid numeric index
        if (focusOnIndex !== 'LAST') {
            if (focusOnIndex > menuItems.length - 1 && menuItems.length > 0) {
                focusOnIndex = menuItems.length - 1;
            }

            // set the focus
            this.focusOnMenuItem(focusOnIndex);

            // reset tracker value
            this.state.focusOnIndexDuringRenderedCallback = null;
        }
    }

    get computedAccessKey() {
        return this.state.accesskey;
    }

    get computedTitle() {
        return this.state.title;
    }

    get computedAlternativeText() {
        return this.alternativeText || i18n.showMenu;
    }

    get computedLoadingStateAlternativeText() {
        return this.loadingStateAlternativeText || i18n.loading;
    }

    get computedTabIndex() {
        return this.disabled ? -1 : this.state.tabindex;
    }

    /**
     * Sets focus on the button.
     */
    @api
    focus() {
        this.focusOnButton();
    }

    get computedButtonClass() {
        const isDropdownIcon = !this.computedShowDownIcon;
        const isBare = this.variant.split('-')[0] === 'bare';

        return classSet('slds-button')
            .add({
                'slds-button_icon': !isDropdownIcon && !this.label,
                'slds-button_icon-bare': isBare && !this.label,
                'slds-button_icon-more':
                    this.variant !== 'container' &&
                    !isDropdownIcon &&
                    !this.label,
                'slds-button_icon-container-more':
                    this.variant === 'container' &&
                    !isDropdownIcon &&
                    !this.label,
                'slds-button_icon-container':
                    this.variant === 'container' &&
                    isDropdownIcon &&
                    !this.label,
                'slds-button_icon-border':
                    this.variant === 'border' && isDropdownIcon && !this.label,
                'slds-button_icon-border-filled':
                    this.variant === 'border-filled' && !this.label,
                'slds-button_icon-border-inverse':
                    this.variant === 'border-inverse' && !this.label,
                'slds-button_icon-inverse':
                    this.variant === 'bare-inverse' && !this.label,
                'slds-button_icon-xx-small':
                    this.iconSize === 'xx-small' && !isBare && !this.label,
                'slds-button_icon-x-small':
                    this.iconSize === 'x-small' && !isBare && !this.label,
                'slds-button_icon-small':
                    this.iconSize === 'small' && !isBare && !this.label,
                // alternative classes when we have a label value
                'slds-button_neutral':
                    this.variant === 'border' && isDropdownIcon && this.label,
                'slds-button_inverse':
                    this.variant === 'border-inverse' && this.label,
                // order classes when part of a button-group
                'slds-button_first': this._order === 'first',
                'slds-button_middle': this._order === 'middle',
                'slds-button_last': this._order === 'last',
            })
            .toString();
    }

    get computedShowDownIcon() {
        return !(
            this.iconName === 'utility:down' ||
            this.iconName === 'utility:chevrondown'
        );
    }

    get computedDropdownClass() {
        return classSet('slds-dropdown')
            .add({
                'slds-dropdown_left':
                    this.menuAlignment === 'left' || this.isAutoAlignment(),
                'slds-dropdown_center': this.menuAlignment === 'center',
                'slds-dropdown_right': this.menuAlignment === 'right',
                'slds-dropdown_bottom': this.menuAlignment === 'bottom-center',
                'slds-dropdown_bottom slds-dropdown_right slds-dropdown_bottom-right':
                    this.menuAlignment === 'bottom-right',
                'slds-dropdown_bottom slds-dropdown_left slds-dropdown_bottom-left':
                    this.menuAlignment === 'bottom-left',
                'slds-nubbin_top-left':
                    this.nubbin && this.menuAlignment === 'left',
                'slds-nubbin_top-right':
                    this.nubbin && this.menuAlignment === 'right',
                'slds-nubbin_top':
                    this.nubbin && this.menuAlignment === 'center',
                'slds-nubbin_bottom-left':
                    this.nubbin && this.menuAlignment === 'bottom-left',
                'slds-nubbin_bottom-right':
                    this.nubbin && this.menuAlignment === 'bottom-right',
                'slds-nubbin_bottom':
                    this.nubbin && this.menuAlignment === 'bottom-center',
                'slds-p-vertical_large': this.isLoading,
            })
            .toString();
    }

    handleMenuItemPrivateSelect(event) {
        if (this.state.dropdownVisible) {
            this.toggleMenuVisibility();
            this.focusOnButton();
        }

        //
        this.dispatchSelect(event);
    }

    dispatchSelect(event) {
        this.dispatchEvent(
            new CustomEvent('select', {
                cancelable: true,
                detail: {
                    value: event.detail.value, // pass value through from original private event
                },
            })
        );
    }

    handleButtonClick() {
        this.allowBlur();

        this.toggleMenuVisibility();

        // Focus on the button even if the browser doesn't do it by default
        // (the behaviour differs between Chrome, Safari, Firefox)
        this.focusOnButton();
    }

    handleButtonKeyDown(event) {
        handleKeyDownOnMenuTrigger(event, this.keyboardInterface);
    }

    handleButtonMouseDown(event) {
        const mainButton = 0;
        if (event.button === mainButton) {
            this.cancelBlur();
        }
    }

    focusOnButton() {
        this.template.querySelector('button').focus();
    }

    focusOnMenuItem(itemIndex) {
        if (this.state.dropdownVisible) {
            const menuItem = this.getMenuItemByIndex(itemIndex);
            this.cancelBlurAndFocusOnMenuItem(menuItem);
        }
    }

    isAutoAlignment() {
        return this.menuAlignment.startsWith('auto');
    }

    startPositioning() {
        if (!this.isAutoAlignment()) {
            return;
        }

        this._positioning = true;

        const align = {
            horizontal: Direction.Left,
            vertical: Direction.Top,
        };

        const targetAlign = {
            horizontal: Direction.Left,
            vertical: Direction.Bottom,
        };

        let autoFlip = true;
        let autoFlipVertical;

        if (this.menuAlignment === 'auto-right') {
            align.horizontal = Direction.Right;
            targetAlign.horizontal = Direction.Right;
        }

        if (
            this.menuAlignment === 'auto-right' ||
            this.menuAlignment === 'auto-left'
        ) {
            autoFlip = false;
            autoFlipVertical = true;
        }

        requestAnimationFrame(() => {
            this.stopPositioning();
            this._autoPosition = startPositioning(this, {
                target: () => this.template.querySelector('button'),
                element: () => this.template.querySelector('.slds-dropdown'),
                align,
                targetAlign,
                autoFlip,
                autoFlipVertical,
            });
        });
        // focus on the first item in next cycle
        // eslint-disable-next-line lwc/no-set-timeout
        setTimeout(() => {
            this._positioning = false;
            this.focusOnMenuItemAfterRender();
        }, 0);
    }

    stopPositioning() {
        if (this._autoPosition) {
            stopPositioning(this._autoPosition);
            this._autoPosition = null;
        }
        this._positioning = false;
    }

    toggleMenuVisibility() {
        if (!this.disabled) {
            this.state.dropdownVisible = this.state.dropdownVisible
                ? false
                : true;
            if (!this.state.dropdownOpened && this.state.dropdownVisible) {
                this.state.dropdownOpened = true;
            }
            if (this.state.dropdownVisible) {
                this.startPositioning();
                this.dispatchEvent(new CustomEvent('open'));

                // update the bounding rect when the menu is toggled
                this.privateBoundingRect = this.getBoundingClientRect();

                this.pollBoundingRect();
            } else {
                this.stopPositioning();
            }

            this.classList.toggle('slds-is-open');
        }
    }

    getMenuItems() {
        return Array.from(this.querySelectorAll(menuItemCSSSelector));
    }

    getMenuItemByIndex(index) {
        return this.getMenuItems()[index];
    }

    findMenuItemIndex(menuItemElement) {
        // Get children (HTMLCollection) and transform into an array.
        const listChildren = Array.prototype.map.call(
            this.getMenuItems(),
            item => {
                return unwrap(item);
            }
        );

        return listChildren.indexOf(menuItemElement);
    }

    findMenuItemFromEventTarget(element) {
        let currentNode = unwrap(element);
        const stopAtElement = unwrap(
            this.template.querySelector("[role='menu']")
        );
        while (currentNode !== stopAtElement) {
            if (
                currentNode.classList &&
                currentNode.classList.contains(menuItemCSSClassName)
            ) {
                return currentNode;
            }
            if (currentNode.parentNode) {
                currentNode = currentNode.parentNode;
            } else {
                return null;
            }
        }
        return null;
    }

    handleKeyOnMenuItem(event) {
        const menuItem = this.findMenuItemFromEventTarget(event.target);
        if (menuItem) {
            handleKeyDownOnMenuItem(
                event,
                this.findMenuItemIndex(menuItem),
                this.keyboardInterface
            );
        }
    }

    handleMouseOverOnMenuItem(event) {
        const menuItem = this.findMenuItemFromEventTarget(event.target);
        if (menuItem) {
            const menuItemIndex = this.findMenuItemIndex(menuItem);
            this.focusOnMenuItem(menuItemIndex);
        }
    }

    cancelBlurAndFocusOnMenuItem(menuItem) {
        if (menuItem) {
            // prevent blur during a non-blurring focus change
            // set lock so that while focusing on menutitem, menu doesnt close
            this.cancelBlur();
            menuItem.focus();
        }
        // allowBlur is called when the menu items receives focus
    }

    handleFocus() {
        this.dispatchEvent(new CustomEvent('focus'));
    }

    handlePrivateBlur(event) {
        // The event may be synthetic from the menu items
        event.stopPropagation();

        // perform common blurring behavior
        this.handleBlur();
    }

    handlePrivateFocus(event) {
        // synthetic from the menu items
        event.stopPropagation();
        // reset the cancelBlur so any clicks outside the menu can now close the menu
        this.allowBlur();
    }

    handleBlur() {
        // Don't handle the blur event if the focus events are inside the menu (see the cancelBlur/allowBlur functions)
        if (this._cancelBlur) {
            return;
        }
        // Hide only when the focus moved away from the container
        if (this.state.dropdownVisible) {
            this.toggleMenuVisibility();
        }

        // dispatch standard blur event
        this.dispatchEvent(new CustomEvent('blur'));
    }

    allowBlur() {
        this._cancelBlur = false;
    }

    cancelBlur() {
        this._cancelBlur = true;
    }

    menuKeyboardInterface() {
        const that = this;
        return {
            getTotalMenuItems() {
                return that.getMenuItems().length;
            },
            focusOnIndex(index) {
                that.focusOnMenuItem(index);
            },
            setNextFocusIndex(index) {
                that.state.focusOnIndexDuringRenderedCallback = index;
            },
            returnFocus() {
                that.focusOnButton();
            },
            isMenuVisible() {
                return that.state.dropdownVisible;
            },
            toggleMenuVisibility() {
                that.toggleMenuVisibility();
            },
            focusMenuItemWithText(text) {
                const match = [...that.getMenuItems()].filter(menuItem => {
                    const label = menuItem.label;
                    return label && label.toLowerCase().indexOf(text) === 0;
                });
                if (match.length > 0) {
                    that.focusOnMenuItem(match[0]);
                }
            },
        };
    }

    /**
     * {Function} setOrder - Sets the order value of the button when in the context of a button-group or other ordered component
     * @param {String} order -  The order string (first, middle, last)
     */
    setOrder(order) {
        this._order = order;
    }

    /**
     * {Function} close - Closes the dropdown if it's open
     */
    close() {
        // should only do something if dropdown is visible
        if (this.state.dropdownVisible) {
            this.toggleMenuVisibility();
        }
    }

    /**
     * Poll for change in bounding rectangle
     * only if it is menuAlignment=auto since that is
     * position:fixed and is opened
     */
    pollBoundingRect() {
        // only poll if the dropdown is auto aligned
        if (this.isAutoAlignment() && this.state.dropdownVisible) {
            // eslint-disable-next-line lwc/no-set-timeout
            setTimeout(
                () => {
                    observePosition(this, 300, this.privateBoundingRect, () => {
                        this.close();
                    });

                    // continue polling
                    this.pollBoundingRect();
                },
                250 // check every 0.25 second
            );
        }
    }
}
