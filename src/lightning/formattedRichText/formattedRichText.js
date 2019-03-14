import { LightningElement, api } from 'lwc';
import { sanitizeDOM } from 'lightning/configProvider';
import { linkify } from './linkify';
import { richTextConfig } from './richTextConfig';
import { updateRawLinkInfo } from 'lightning/routingService';
import { normalizeBoolean } from 'lightning/utilsPrivate';

/**
 * Displays rich text that's formatted with whitelisted tags and attributes.
 * Other tags and attributes are removed and only their text content is displayed.
 */
export default class LightningFormattedRichText extends LightningElement {
    /**
     * If present, the component does not create links in the rich text.
     * @type {boolean}
     * @default false
     */
    @api
    get disableLinkify() {
        return this._disableLinkify;
    }

    set disableLinkify(val) {
        this._disableLinkify = normalizeBoolean(val);
        this.renderRichText();
    }

    /**
     * Sets the rich text to display.
     * @type {string}
     *
     */
    @api
    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.renderRichText();
    }

    initialRender = true;
    _value = '';
    _disableLinkify = false;
    connected = false;
    clean = false;

    renderedCallback() {
        if (this.initialRender) {
            this.renderRichText();
            this.initialRender = false;
        }
    }

    connectedCallback() {
        this.classList.add('slds-rich-text-editor__output');
        this.connected = true;
    }

    disconnectedCallback() {
        this.connected = false;
    }

    handleClick(event) {
        const eventTarget = event.target;
        // Don't do anything if it's not an anchor
        if (eventTarget.tagName !== 'A') {
            return;
        }
        const href = eventTarget.href;
        // Grab the link info onclick and dispatch
        updateRawLinkInfo(this, href).then(linkInfo => {
            eventTarget.href = linkInfo.url;
            linkInfo.dispatcher(event);
        });
    }

    sanitize(value) {
        this.clean = false;
        let displayValue;

        try {
            displayValue = sanitizeDOM(value, richTextConfig);
            this.clean = true;
        } catch (e) {
            // eslint-disable-next-line no-console
            console.warn(
                `<lightning-formatted-rich-text> Exception caught when attempting to sanitize: `,
                e
            );
            displayValue = value;
            this.clean = false;
        }

        return displayValue;
    }

    renderRichText() {
        if (this.connected) {
            const richText = this.sanitize(
                this.disableLinkify ? this.value : linkify(this.value)
            );
            const container = this.getContainer();

            if (this.clean) {
                // eslint-disable-next-line lwc/no-inner-html
                container.innerHTML = richText;
            } else {
                const textNode = document.createTextNode(richText);
                while (container.hasChildNodes()) {
                    container.removeChild(container.lastChild);
                }
                container.appendChild(textNode);
            }
        }
    }

    getContainer() {
        return this.template.querySelector('span');
    }
}
