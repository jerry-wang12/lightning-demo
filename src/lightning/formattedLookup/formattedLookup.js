import { LightningElement, api, track } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { getLinkInfo } from 'lightning/routingService';

export default class LightningFormattedLookup extends LightningElement {
    /**
     * {string} The related name/record name to display
     */
    @api displayValue;

    /**
     * @param {string} value - The record id to point to.
     */
    set recordId(value) {
        // hanging value on state makes sure changes
        // trigger a re-render
        this.state.recordId = value;
        // re-fetch url info
        this.updateLinkData();
    }

    @api
    get recordId() {
        return this.state.recordId;
    }

    /**
     * {boolean} Determines if the output is navigable or not along
     * with the url and dispatcher returned from routing-service
     */
    @api
    get disabled() {
        return this.state.disabled;
    }
    set disabled(value) {
        this.state.disabled = normalizeBoolean(value);
        this.state.isNavigable =
            !this.disabled && !!this.dispatcher && !!this.state.url;
    }

    _connected;

    dispatcher;

    @track
    state = {
        disabled: false,
        recordId: null,
        url: null,
        isNavigable: false,
    };

    constructor() {
        super();
        this._connected = false;
        this.dispatcher = null;
    }

    /**
     * Lifecycle callback for connected.
     * @returns {undefined}
     */
    connectedCallback() {
        // this is to guard getLinkInfo, which will
        // not work if called before the component is connected
        this._connected = true;
        this.updateLinkData();
    }

    /**
     * Lifecycle callback for disconnected
     * @returns {undefined}
     */
    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Fetch info for the link url
     * async, updates this.state
     * @returns {undefined}
     */
    updateLinkData() {
        if (this._connected && this.state.recordId) {
            getLinkInfo(this, {
                stateType: 'standard__recordPage',
                attributes: {
                    recordId: this.state.recordId,
                    actionName: 'view',
                },
            }).then(linkInfo => {
                this.state.url = linkInfo.url;
                this.dispatcher = linkInfo.dispatcher;
                this.state.isNavigable =
                    !this.disabled && !!this.dispatcher && !!this.state.url;
            });
        }
    }

    /**
     * Handles the click event on the link.
     * @param {Event} event The event that triggered this handler.
     * @returns {undefined}
     */
    handleClick(event) {
        this.dispatcher(event);
    }
}
