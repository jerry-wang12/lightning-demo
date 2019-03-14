import { LightningElement, api } from 'lwc';

/**
 * Class representing primitive iframe.
 * @extends Element
 */
export default class LightningPrimitiveIframe extends LightningElement {
    @api src;
    @api domain;
    @api width = '100%';
    @api height = '100%';
    @api frameStyle = '';

    handleContentLoad() {
        const iframeload = new CustomEvent('iframeload', {
            detail: {
                callbacks: {
                    postToWindow: this.postToWindow.bind(this),
                },
            },
        });

        this.contentWindow = this.template.querySelector(
            'iframe'
        ).contentWindow;
        this.dispatchEvent(iframeload);
    }

    @api
    postToWindow(message) {
        if (this.contentWindow) {
            this.contentWindow.postMessage(message, this.domain);
        }
    }
}
