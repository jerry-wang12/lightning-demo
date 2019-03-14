import { LightningElement, api } from 'lwc';

export default class LightningMenuSubheader extends LightningElement {
    @api label;

    connectedCallback() {
        // add default CSS classes to custom element tag
        this.classList.add('slds-dropdown__header');
        this.classList.add('slds-truncate');

        this.setAttribute('role', 'separator');
    }
}
