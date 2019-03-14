import { LightningElement } from 'lwc';

export default class DemoBreadcrumbs extends LightningElement {
    handleNavigateToAccount(event) {
        // prevent default navigation by href
        event.preventDefault();

        const div2 = this.template.querySelector('.container .case');
        div2.classList.add('slds-hide');
        div2.classList.remove('slds-show');

        const div1 = this.template.querySelector('.container .account');
        div1.classList.remove('slds-hide');
        div1.classList.add('slds-show');
    }

    handleNavigateToCase(event) {
        // prevent default navigation by href
        event.preventDefault();

        const div1 = this.template.querySelector('.container .account');
        div1.classList.add('slds-hide');
        div1.classList.remove('slds-show');

        const div = this.template.querySelector('.container .case');
        div.classList.remove('slds-hide');
        div.classList.add('slds-show');
    }
}
