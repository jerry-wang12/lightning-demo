import labelPillDelete from '@salesforce/label/LightningPill.delete';
import labelPillError from '@salesforce/label/LightningPill.error';
import labelPillRemove from '@salesforce/label/LightningPill.remove';
import labelPillWarning from '@salesforce/label/LightningPill.warning';
import { LightningElement, api, track } from 'lwc';
import {
    keyCodes,
    classListMutation,
    normalizeBoolean,
} from 'lightning/utilsPrivate';
import link from './link.html';
import plain from './plain.html';

const i18n = {
    pillDelete: labelPillDelete,
    pillError: labelPillError,
    pillRemove: labelPillRemove,
    pillWarning: labelPillWarning,
};

/**
 * A pill displays a label that can contain links and can be removed from view.
 */
export default class LightningPill extends LightningElement {
    /**
     * The URL of the page that the link goes to.
     * @type {string}
     */
    @api href;

    /**
     * The text label that displays in the pill.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * The name for the pill. This value is optional and can be used to identify the pill in a callback.
     * @type {string}
     */
    @api name;

    /**
     * The variant changes the appearance of the pill. Accepted variants include link and plain.
     * This value defaults to link.
     * @type {string}
     * @default link
     */
    @api variant = 'link';

    render() {
        switch (this.variant) {
            case 'plain':
                return plain;
            case 'link':
            default:
                return link;
        }
    }

    @track
    state = {
        hasMedia: true,
    };

    /**
     * If present, the pill is shown with a red border and an error icon on the left of the label.
     * @type {boolean}
     * @default false
     */
    @api
    get hasError() {
        return this.state.hasError || false;
    }
    set hasError(value) {
        this.state.hasError = normalizeBoolean(value);
    }

    constructor() {
        super();
        this.addEventListener('keydown', this.handleKeypress.bind(this));
    }

    connectedCallback() {
        const cssClass = ['slds-pill'];
        switch (this.variant) {
            case 'plain':
                break;
            case 'link':
            default:
                cssClass.push('slds-pill_link');
        }
        this.classList.add.apply(this.classList, cssClass);
    }

    renderedCallback() {
        // check if a component was passed into the slot
        this.state.hasMedia = !!this.template.querySelector('*');
        classListMutation(this.classList, {
            'slds-has-error': this.hasError,
        });
    }

    set tabIndex(value) {
        this.setAttribute('tabindex', value);
        this.state.tabIndex = value;
    }

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the pill is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the pill is focusable but does not participate in keyboard navigation.
     * @type {number}
     */
    @api
    get tabIndex() {
        return this.state.tabIndex;
    }

    get i18n() {
        return i18n;
    }

    get hasHref() {
        return !!this.href;
    }

    handleKeypress(event) {
        switch (event.keyCode) {
            case keyCodes.delete:
            case keyCodes.backspace:
                this.handleRemove(event);
                break;
            default:
        }
    }

    handleRemove(event) {
        const removeEvent = new CustomEvent('remove', {
            cancelable: true,
            detail: {
                name: this.name,
            },
        });

        this.dispatchEvent(removeEvent);

        if (removeEvent.defaultPrevented) {
            event.stopPropagation();
        }
    }
}
