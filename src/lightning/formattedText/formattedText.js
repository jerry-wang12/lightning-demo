import { LightningElement, api, track, unwrap } from 'lwc';
import { normalizeBoolean } from 'lightning/utilsPrivate';
import { updateRawLinkInfo } from 'lightning/routingService';
import {
    parseToFormattedLinkifiedParts,
    parseToFormattedParts,
} from './linkify';

function isLink(element) {
    return element.tagName === 'A';
}

/**
 * Displays text, replaces newlines with line breaks, and linkifies if requested.
 */
export default class FormattedText extends LightningElement {
    /**
     * Sets the text to display.
     * @type {string}
     *
     */
    @api value = '';

    @track
    state = {
        linkify: false,
    };

    /**
     * If present, URLs and email addresses are displayed in anchor tags.
     * They are displayed in plain text by default.
     * @type {boolean}
     * @default false
     */
    @api
    get linkify() {
        return this.state.linkify;
    }
    set linkify(value) {
        this.state.linkify = normalizeBoolean(value);
    }

    connectedCallback() {
        this.template.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.template.removeEventListener('click', this.handleClick);
    }

    handleClick(event) {
        const target = event.target;
        if (target && isLink(target) && !target.onclick) {
            updateRawLinkInfo(target, target.href).then(linkInfo => {
                target.href = linkInfo.url;
                target.onclick = linkInfo.dispatcher;

                linkInfo.dispatcher(unwrap(event));
            });
        }
    }

    get formattedParts() {
        if (!this.value || typeof this.value !== 'string') {
            return [];
        }
        return this.linkify
            ? parseToFormattedLinkifiedParts(this.value)
            : parseToFormattedParts(this.value);
    }
}
