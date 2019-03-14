import { LightningElement, api, track } from 'lwc';
import { isAbsoluteUrl } from './urlValidation';
import { updateRawLinkInfo } from 'lightning/routingService';

/**
 * Displays a URL as a hyperlink.
 */
export default class LightningFormattedUrl extends LightningElement {
    /**
     * Specifies where to open the link. Options include _blank, _parent, _self, and _top.
     * @type {string}
     *
     */
    @api target;

    /**
     * The text to display when the mouse hovers over the link.
     * @type {string}
     *
     */
    @api tooltip;

    /**
     * The text to display in the link.
     * @type {string}
     *
     */
    @api label;

    /**
     * Reserved for internal use. Use tabindex instead to indicate if an element should be focusable.
     * A value of 0 means that the element is focusable and
     * participates in sequential keyboard navigation. A value of -1 means
     * that the element is focusable but does not participate in keyboard navigation.
     * @type {number}
     *
     */
    @api tabIndex;

    @track _url;
    @track _value;

    _connected = false;
    _dispatcher = () => {};

    /**
     * The URL to format.
     * @type {string}
     *
     */
    @api
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        if (this._connected) {
            this.updateLinkInfo(value);
        }
    }

    connectedCallback() {
        this._connected = true;
        this.updateLinkInfo(this.value);
    }

    disconnectedCallback() {
        this._connected = false;
    }

    /**
     * Sets focus on the element.
     */
    @api
    focus() {
        if (this.urlAnchor) {
            this.urlAnchor.focus();
        }
    }

    /**
     * Removes keyboard focus from the element.
     */
    @api
    blur() {
        if (this.urlAnchor) {
            this.urlAnchor.blur();
        }
    }

    get urlAnchor() {
        if (this._connected && this.hasValue) {
            return this.template.querySelector('a');
        }
        return undefined;
    }

    handleClick(event) {
        this._dispatcher(event);
    }

    updateLinkInfo(url) {
        updateRawLinkInfo(this, this.makeAbsoluteUrl(url)).then(linkInfo => {
            this._url = linkInfo.url;
            this._dispatcher = linkInfo.dispatcher;
        });
    }

    get computedLabel() {
        const { label, computedUrl } = this;
        return label != null && label !== '' ? label : computedUrl;
    }

    get computedUrl() {
        return this._url || this.makeAbsoluteUrl(this.value);
    }

    get hasValue() {
        const url = this.value;
        return url != null && url !== '';
    }

    makeAbsoluteUrl(url) {
        return isAbsoluteUrl(url) ? url : `http://${url}`;
    }
}
