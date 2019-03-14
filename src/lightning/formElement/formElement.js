import { LightningElement } from 'lwc';

export default class LightningFormElement extends LightningElement {
    connectedCallback() {
        this.classList.add('slds-form-element');
    }
}
