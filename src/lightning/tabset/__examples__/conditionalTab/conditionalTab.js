import { LightningElement, track } from 'lwc';

export default class TabsetConditionalTab extends LightningElement {
    @track showTabFour;

    toggleOptionalTab() {
        this.showTabFour = !this.showTabFour;
    }
}
