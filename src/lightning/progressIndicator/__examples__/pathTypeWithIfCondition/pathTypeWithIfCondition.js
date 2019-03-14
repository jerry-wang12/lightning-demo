import { LightningElement, track } from 'lwc';

export default class ProgressIndicatorPathTypeWithIfCondition extends LightningElement {
    @track showStep4 = true;

    toggleStep4() {
        this.showStep4 = !this.showStep4;
    }
}
