import labelAutoPlay from '@salesforce/label/LightningCarousel.autoPlay';
import labelTabString from '@salesforce/label/LightningCarousel.tabString';
import { LightningElement, api, track } from 'lwc';
import { keyCodes, normalizeBoolean } from 'lightning/utilsPrivate';

const INDICATOR_ACTION = 'slds-carousel__indicator-action';
const SLDS_ACTIVE = 'slds-is-active';
const PAUSE_ICON = 'utility:pause';
const PLAY_ICON = 'utility:right';
const FALSE_STRING = 'false';
const TRUE_STRING = 'true';

const i18n = {
    autoPlay: labelAutoPlay,
    tabString: labelTabString,
};

/**
 * A collection of images that are displayed one at a time.
 */
export default class LightningCarousel extends LightningElement {
    get i18n() {
        return i18n;
    }

    /**
     * If present, images do not automatically scroll and users must click the indicators to scroll.
     * @type {boolean}
     * @default false
     */
    @api
    get disableAutoScroll() {
        return this._disableAutoScroll || false;
    }
    set disableAutoScroll(value) {
        this._disableAutoScroll = normalizeBoolean(value);
    }

    /**
     * If present, the carousel stops looping
     * after the last item is displayed.
     *
     * @type {boolean}
     * @default false
     */
    @api
    get disableAutoRefresh() {
        return this._disableAutoRefresh || false;
    }
    set disableAutoRefresh(value) {
        this._disableAutoRefresh = normalizeBoolean(value);
    }

    /**
     * The auto scroll duration. The default is 5 seconds, after that the next
     * image is displayed.
     *
     * @type {number}
     * @default 5
     */
    @api scrollDuration = 5;

    /**
     * Array that maintains the state of the Carousel's pagination.
     * @name paginationItems
     * @type {Array}
     * @private
     */
    @track paginationItems = [];

    /**
     * The path of the auto scroll button background
     * @name autoScrollIcon
     * @type {String}
     */
    @track autoScrollIcon = PAUSE_ICON;

    /**
     * Aria role for the pressed state of the auto scroll button
     * @name ariaPressed
     * @type {String}
     */
    @track ariaPressed = FALSE_STRING;

    @track carouselPanelsStyle;

    /**
     * Aria role for the pressed state of the auto scroll button
     * @name ariaPressed
     * @type {String}
     */
    togglePlayString = i18n.autoPlay;

    /**
     * Flag to determine if this is the first time the component
     * is being rendered. Used inside renderedCallback.
     * @name initialRender
     * @type {Boolean}
     * @private
     */
    initialRender = true;

    /**
     * Holds the current index of the active item on the carousel
     * @name activeIndexItem
     * @type {Number}
     * @private
     */
    activeIndexItem = 0;

    /**
     * Array that holds all the carousel Items
     * @name carouselItems
     * @type {Array}
     * @private
     */
    carouselItems = [];

    /**
     * The auto scroll timeout reference.
     * @name autoScrollTimeOut
     * @type {Object}
     * @private
     */
    autoScrollTimeOut;

    /**
     * Handles the registration for all the items inside the carousel that have been
     * loaded via <slot></slot>. It also loads the data for the pagination state object
     * and sets the active item we want to display on first render.
     * @param {Object} event - The event object
     */
    imageRegisterHandler(event) {
        const target = event.target,
            item = event.detail,
            currentIndex = this.carouselItems.length,
            isItemActive = currentIndex === this.activeIndexItem,
            paginationItemDetail = {
                key: item.guid,
                id: `pagination-item-${currentIndex}`,
                tabTitle: target.description
                    ? target.description + ' ' + i18n.tabString
                    : null,
                className: isItemActive
                    ? INDICATOR_ACTION + ' ' + SLDS_ACTIVE
                    : INDICATOR_ACTION,
                tabIndex: isItemActive ? '0' : '-1',
                contentId: event.detail.contentId,
                ariaSelected: isItemActive ? TRUE_STRING : FALSE_STRING,
            };

        if (currentIndex > 5) {
            // console.error('Only up to 5 carousel Images are allowed at a time');
            return;
        }

        // if the activeIndexItem is equal to the currentIndex on the registration process
        // then we se set it active. paginationItemDetail also needs to reflect the active state.
        if (isItemActive) {
            item.callbacks.select();
        }

        item.callbacks.setLabelledBy(paginationItemDetail.id);
        this.paginationItems.push(paginationItemDetail);
        this.carouselItems.push(item);
    }

    /**
     * Render callback handler to call up the autoScoller if
     * the property is enabled.
     */
    renderedCallback() {
        if (this.initialRender) {
            if (!this.disableAutoScroll) {
                this.setAutoScroll();
            }
        }
        this.initialRender = false;
    }

    /**
     * Sets up the timeout for the auto scrolling task
     */
    setAutoScroll() {
        // milliseconds
        const scrollDuration = parseInt(this.scrollDuration, 10) * 1000;
        const carouselItemsLength = this.carouselItems.length;

        if (
            this.activeIndexItem === carouselItemsLength - 1 &&
            this.disableAutoRefresh
        ) {
            this.autoScrollOff();
            return;
        }

        this.cancelAutoScrollTimeOut();
        // eslint-disable-next-line lwc/no-set-timeout
        this.autoScrollTimeOut = setTimeout(
            this.startAutoScroll.bind(this),
            scrollDuration
        );
    }

    /**
     * Function that starts the autoScrolling functionallity
     */
    startAutoScroll() {
        this.selectNextSibling();
        this.setAutoScroll();
    }

    /**
     * Cancels the auto scroll timeout task.
     */
    cancelAutoScrollTimeOut() {
        clearTimeout(this.autoScrollTimeOut);
    }

    /**
     * Event handle for toggling on play/pause the autoScroll
     */
    toggleAutoScroll() {
        const ariaPressed = this.ariaPressed;

        if (ariaPressed === FALSE_STRING) {
            this.autoScrollOff();
        } else {
            this.autoScrollOn();
        }
    }

    /**
     * Sets the state for Auto Scroll on.
     */
    autoScrollOn() {
        const carouselItemsLength = this.carouselItems.length;

        if (!this.disableAutoScroll) {
            if (
                this.activeIndexItem === carouselItemsLength - 1 &&
                this.disableAutoRefresh
            ) {
                this.unselectCurrentItem();
                this.selectNewItem(0);
            }

            this.autoScrollIcon = PAUSE_ICON;
            this.ariaPressed = FALSE_STRING;
            this.setAutoScroll();
        }
    }

    /**
     * Sets the state for Auto Scroll off.
     */
    autoScrollOff() {
        if (!this.disableAutoScroll) {
            this.ariaPressed = TRUE_STRING;
            this.autoScrollIcon = PLAY_ICON;
            this.cancelAutoScrollTimeOut();
        }
    }

    /**
     * Handler for when the user selects a new carousel item via the
     * carousel's pagination. It unselects the current active item and sets
     * active the new item recieved.
     * @param {Object} event - The event object
     */
    onItemSelect(event) {
        const currentTarget = event.currentTarget,
            itemIndex = currentTarget.getAttribute('data-index');

        this.autoScrollOff();

        if (this.activeIndexItem !== itemIndex) {
            this.unselectCurrentItem();
            this.selectNewItem(itemIndex);
            this.activeIndexItem = parseInt(itemIndex, 10);
        }
    }

    /**
     * Unselects the current active item on the carousel.
     */
    unselectCurrentItem() {
        const activePaginationItem = this.paginationItems[this.activeIndexItem];

        activePaginationItem.tabIndex = '-1';
        activePaginationItem.ariaSelected = FALSE_STRING;
        activePaginationItem.className = INDICATOR_ACTION;

        this.carouselItems[this.activeIndexItem].callbacks.unselect();
    }

    /**
     * Selects a new item on the carousel based on the index provided.
     * @param {Number} itemIndex - The index of the item to be selected
     */
    selectNewItem(itemIndex) {
        const activePaginationItem = this.paginationItems[itemIndex];

        if (!this.carouselItems[itemIndex].callbacks.isSelected()) {
            activePaginationItem.tabIndex = '0';
            activePaginationItem.ariaSelected = TRUE_STRING;
            activePaginationItem.className =
                INDICATOR_ACTION + ' ' + SLDS_ACTIVE;

            this.carouselPanelsStyle = `transform:translateX(-${itemIndex *
                100}%);`;
            this.carouselItems[itemIndex].callbacks.select();
            this.activeIndexItem = itemIndex;
        }
    }

    /**
     * Key press event handler.
     * Listens to key presses and reacts moving the carousel items to next or previous
     * when the focus is active.
     * @param {Object} event - The event object
     */
    keyDownHandler(event) {
        const key = event.keyCode;
        let indicatorActionsElements = this.indicatorActionsElements;

        if (key === keyCodes.right) {
            event.preventDefault();
            event.stopPropagation();

            this.autoScrollOff();
            this.selectNextSibling();
        }

        if (key === keyCodes.left) {
            event.preventDefault();
            event.stopPropagation();

            this.autoScrollOff();
            this.selectPreviousSibling();
        }

        // we cache them the first time
        if (!indicatorActionsElements) {
            indicatorActionsElements = this.template.querySelectorAll(
                '.slds-carousel__indicator-action'
            );
            this.indicatorActionsElements = indicatorActionsElements;
        }

        // we want to make sure that while we are using the keyboard
        // navigation we are focusing on the right indicator
        indicatorActionsElements[this.activeIndexItem].focus();
    }

    /**
     * Marks as active the next sibiling to the
     * current active index.
     */
    selectNextSibling() {
        const carouselItemsLength = this.carouselItems.length;
        let itemIndex = this.activeIndexItem + 1;

        // go to first item
        if (this.activeIndexItem === carouselItemsLength - 1) {
            if (this.disableAutoRefresh) {
                this.autoScrollOff();
                return;
            }

            itemIndex = 0;
        }

        this.unselectCurrentItem();
        this.selectNewItem(itemIndex);
    }

    /**
     * Marks as active the previous sibiling to the
     * current active index.
     */
    selectPreviousSibling() {
        const carouselItemsLength = this.carouselItems.length;
        let itemIndex = this.activeIndexItem - 1;

        // go to last item
        if (this.activeIndexItem === 0) {
            if (this.disableAutoRefresh) {
                this.autoScrollOff();
                return;
            }
            itemIndex = carouselItemsLength - 1;
        }

        this.unselectCurrentItem();
        this.selectNewItem(itemIndex);
    }
}
