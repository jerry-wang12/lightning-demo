import { LightningElement } from 'lwc';

/**
 * A hierarchy path of the page you're currently visiting within the website or app.
 */
export default class LightningBreadcrumbs extends LightningElement {
    connectedCallback() {
        this.setAttribute('aria-label', 'Breadcrumbs');
        this.setAttribute('role', 'navigation');
    }
}
