import { LightningElement, api, track } from 'lwc';
import { classSet } from 'lightning/utils';
import {
    assert,
    normalizeBoolean,
    normalizeString,
} from 'lightning/utilsPrivate';
import subPage from '@salesforce/label/LightningVerticalNavigation.subPage';

const ALLOWED_CHILDREN = [
    'LIGHTNING-VERTICAL-NAVIGATION-ITEM',
    'LIGHTNING-VERTICAL-NAVIGATION-ITEM-BADGE',
    'LIGHTNING-VERTICAL-NAVIGATION-ITEM-ICON',
];

/**
 * A vertical list of links that either take the user to another page or parts of the page the user is in.
 */
export default class LightningVerticalNavigation extends LightningElement {
    @track state = {};

    /**
     * Specify true to reduce spacing between navigation items. This value defaults to false.
     * @param {Boolean} compact - Specify true to reduce spacing between navigation items.
     */
    set compact(compact) {
        this.state.compact = normalizeBoolean(compact);
    }

    /**
     * If present, spacing between navigation items is reduced.
     * @type {boolean}
     * @default false
     */
    @api
    get compact() {
        return this.state.compact || false;
    }

    /**
     * Specify true when the vertical navigation is sitting on top of a shaded background. This value defaults to false.
     * @param {Boolean} shaded - Specify true when the vertical navigation is sitting on top of a shaded background.
     */
    set shaded(shaded) {
        this.state.shaded = normalizeBoolean(shaded);
    }

    /**
     * If present, the vertical navigation is displayed on top of a shaded background.
     * @type {boolean}
     * @default false
     */
    @api
    get shaded() {
        return this.state.shaded || false;
    }

    /**
     * Name of the navigation item to make active.
     * @param {String} selectedItem - Name of the navigation item to make active.
     */
    set selectedItem(selectedItem) {
        this.selectNavigationItem(normalizeString(selectedItem));
    }

    /**
     * Name of the navigation item to make active.
     * An active item is highlighted in blue.
     * @type {string}
     */
    @api
    get selectedItem() {
        return this.state.selectedItem || '';
    }

    get ariaLabel() {
        return this.privateAriaLabel || subPage;
    }

    set ariaLabel(ariaLabel) {
        this.privateAriaLabel = ariaLabel;
    }

    get computedClass() {
        const classes = classSet('slds-nav-vertical');
        if (this.shaded) {
            classes.add('slds-nav-vertical_shade');
        }
        if (this.compact) {
            classes.add('slds-nav-vertical_compact');
        }
        return classes.toString();
    }

    /**
     * @name verticalNavigationItems
     * @type {Array}
     * @private
     * Array that holds all the child vertical-navigation-item, vertical-navigation-item-badge & vertical-navigation-item-icon items.
     */
    verticalNavigationItems = [];

    handleItemRegister(event) {
        event.stopPropagation(); // suppressing event since its not part of vertical-navigation public API

        const target = event.target,
            callbacks = event.detail.callbacks,
            itemName = event.detail.name,
            isItemSelected = this.state.selectedItem === itemName;

        assert(
            target.nodeType in ALLOWED_CHILDREN,
            'Attempt was made to register unsupported type.'
        );

        if (target.nodeType in ALLOWED_CHILDREN) {
            const navigationItem = {
                name: itemName,
                callbacks,
            };
            this.verticalNavigationItems.push(navigationItem);
        }

        if (isItemSelected) {
            callbacks.select();
        }
    }

    handleItemSelect(event) {
        event.stopPropagation(); // suppressing event since its not part of vertical-navigation public API
        this.selectNavigationItem(event.detail.name);
    }

    /**
     * Selects the child navigation item with the specified name.
     * @param {String} itemName - label of the selected child navigation item.
     */
    selectNavigationItem(itemName) {
        // dispatch before events
        const beforeselectevent = new CustomEvent('beforeselect', {
            cancelable: true,
            detail: {
                name: itemName,
            },
        });
        this.dispatchEvent(beforeselectevent);

        if (!beforeselectevent.defaultPrevented) {
            // select navigation item
            this.verticalNavigationItems.forEach(navigationItem => {
                if (navigationItem.name === itemName) {
                    navigationItem.callbacks.select();
                } else {
                    navigationItem.callbacks.deselect();
                }
            });
            // update state
            this.state.selectedItem = itemName;

            // fire after events
            this.dispatchEvent(
                new CustomEvent('select', {
                    detail: {
                        name: itemName,
                    },
                })
            );
        }
    }
}
