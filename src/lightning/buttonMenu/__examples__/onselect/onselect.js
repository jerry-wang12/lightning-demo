import { LightningElement, track } from 'lwc';

export default class ButtonMenuOnselect extends LightningElement {
    @track selectedItemValue;

    handleOnselect(event) {
        this.selectedItemValue = event.detail.value;
    }
}
