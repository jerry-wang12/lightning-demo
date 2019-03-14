import { LightningElement, api } from 'lwc';

/**
 * An item in the hierarchy path of the page the user is on.
 */
export default class LightningBreadcrumb extends LightningElement {
    /**
     * The URL of the page that the breadcrumb goes to.
     * @type {string}
     */
    @api href;

    /**
     * The text label for the breadcrumb.
     * @type {string}
     * @required
     */
    @api label;

    /**
     * The name for the breadcrumb component. This value is optional and can be
     * used to identify the breadcrumb in a callback.
     *
     * @type {string}
     */
    @api name;

    connectedCallback() {
        // add default CSS classes to custom element tag
        this.classList.add('slds-breadcrumb__item');
        this.classList.add('slds-text-title_caps');
        this.setAttribute('role', 'listitem');
    }
}
