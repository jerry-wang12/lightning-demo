import { LightningElement, api, track } from 'lwc';
import {
    classListMutation,
    normalizeString,
    isIE11,
} from 'lightning/utilsPrivate';

import {
    computeSldsClass,
    getCategory,
    isValidName,
} from 'lightning/iconUtils';

/**
 * Represents a visual element that provides context and enhances usability.
 */
export default class LightningIcon extends LightningElement {
    @track state = {};

    /**
     * The alternative text used to describe the icon.
     * This text should describe what happens when you click the button,
     * for example 'Upload File', not what the icon looks like, 'Paperclip'.
     * @type {string}
     */
    @api alternativeText;

    /**
     * A uri path to a custom svg sprite, including the name of the resouce,
     * for example: /assets/icons/standard-sprite/svg/test.svg#icon-heart
     * @type {string}
     */
    @api
    get src() {
        return this.privateSrc;
    }

    set src(value) {
        this.privateSrc = value;

        // if value is not present, then we set the state back
        // to the original iconName that was passed
        // this might happen if the user sets a custom icon, then
        // decides to revert back to SLDS by removing the src attribute
        if (!value) {
            this.state.iconName = this.iconName;
            this.classList.remove('slds-icon-standard-default');
        }

        // if isIE11 and the src is set
        // we'd like to show the 'standard:default' icon instead
        // for performance reasons.
        if (value && isIE11) {
            this.setDefault();
            return;
        }

        this.state.src = value;
    }

    /**
     * The Lightning Design System name of the icon.
     * Names are written in the format 'utility:down' where 'utility' is the category,
     * and 'down' is the specific icon to be displayed.
     * @type {string}
     * @required
     */
    @api
    get iconName() {
        return this.privateIconName;
    }

    set iconName(value) {
        this.privateIconName = value;

        // if src is set, we don't need to validate
        // iconName
        if (this.src) {
            return;
        }

        if (isValidName(value)) {
            const isAction = getCategory(value) === 'action';

            // update classlist only if new iconName is different than state.iconName
            // otherwise classListMutation receives class:true and class: false and removes slds class
            if (value !== this.state.iconName) {
                classListMutation(this.classList, {
                    'slds-icon_container_circle': isAction,
                    [computeSldsClass(value)]: true,
                    [computeSldsClass(this.state.iconName)]: false,
                });
            }
            this.state.iconName = value;
        } else {
            console.warn(`<lightning-icon> Invalid icon name ${value}`); // eslint-disable-line no-console

            // Invalid icon names should render a blank icon. Remove any
            // classes that might have been previously added.
            classListMutation(this.classList, {
                'slds-icon_container_circle': false,
                [computeSldsClass(this.state.iconName)]: false,
            });

            this.state.iconName = undefined;
        }
    }

    /**
     * The size of the icon. Options include xx-small, x-small, small, medium, or large.
     * The default is medium.
     * @type {string}
     * @default medium
     */
    @api
    get size() {
        return normalizeString(this.state.size, {
            fallbackValue: 'medium',
            validValues: ['xx-small', 'x-small', 'small', 'medium', 'large'],
        });
    }

    set size(value) {
        this.state.size = value;
    }

    /**
     * The variant changes the appearance of a utility icon.
     * Accepted variants include inverse, warning, and error.
     * Use the inverse variant to implement a white fill in utility icons on dark backgrounds.
     * @type {string}
     */
    @api
    get variant() {
        return normalizeVariant(this.state.variant, this.state.iconName);
    }

    set variant(value) {
        this.state.variant = value;
    }

    connectedCallback() {
        this.classList.add('slds-icon_container');
    }

    setDefault() {
        this.state.src = undefined;
        this.state.iconName = 'standard:default';
        this.classList.add('slds-icon-standard-default');
    }
}

function normalizeVariant(variant, iconName) {
    // Unfortunately, the `bare` variant was implemented to do what the
    // `inverse` variant should have done. Keep this logic for as long as
    // we support the `bare` variant.
    if (variant === 'bare') {
        // TODO: Deprecation warning using strippable assertion
        variant = 'inverse';
    }

    if (getCategory(iconName) === 'utility') {
        return normalizeString(variant, {
            fallbackValue: '',
            validValues: ['error', 'inverse', 'warning'],
        });
    }
    return 'inverse';
}
