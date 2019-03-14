import labelClickToDial from '@salesforce/label/LightningClickToDial.enabled';
import labelClickToDialDisabled from '@salesforce/label/LightningClickToDial.disabled';
import { LightningElement, api, track } from 'lwc';
import { toNorthAmericanPhoneNumber } from 'lightning/utilsPrivate';
import { getIconPath, polyfill } from 'lightning/iconUtils';
import {
    isEnabled,
    addStateChangeListener,
    dial,
    removeStateChangeListener,
} from 'lightning/clickToDialService';

const Labels = {
    clickToDial: labelClickToDial,
    clickToDialDisabled: labelClickToDialDisabled,
};

const enabledIconPath = getIconPath('utility:call');
const disabledIconPath = getIconPath('utility:end_call');

/**
 * Renders a formatted phone number as click-to-dial enabled or disabled for Open CTI and Voice.
 */
export default class ClickToDial extends LightningElement {
    /**
     * The phone number to be dialed.
     * @type {string}
     * @required
     */
    @api value;
    // The recordId member is intended to be used by the consuming phone
    /**
     * The Salesforce record Id that's associated with the phone number.
     * This Id is passed by the component and does not get validated.
     * @type {string}
     */
    @api recordId;
    /**
     * Comma-separated list of parameters to pass to the third-party phone system.
     * @type {string}
     */
    @api params;

    @track
    state = {
        enabled: isEnabled(),
    };

    stateChangeListener;

    /**
     * When the component is actually connected, initialize the event
     * handling hooks.
     */
    connectedCallback() {
        // defining it here with arrow function to preserve
        // `this` context
        this.stateChangeListener = () => {
            this.state.enabled = isEnabled();
        };
        addStateChangeListener(this.stateChangeListener);
    }

    /**
     * When the component is destroyed, de-register the event handler.
     */
    disconnectedCallback() {
        removeStateChangeListener(this.stateChangeListener);
    }

    renderedCallback() {
        const iconPath = this.iconPath;
        if (iconPath !== this.prevIconPath) {
            this.prevIconPath = iconPath;
            polyfill(this.template.querySelector('svg'));
        }
    }

    get iconPath() {
        return this.state.enabled ? enabledIconPath : disabledIconPath;
    }

    get formattedPhoneNumber() {
        return toNorthAmericanPhoneNumber(this.value);
    }

    get enabled() {
        return this.state.enabled;
    }

    get i18n() {
        return Labels;
    }

    handleClick() {
        dial({
            number: this.value,
            recordId: this.recordId,
            params: this.params,
            pageInfo: {
                hashFragment: window.location.hash,
            },
        });
    }
}
