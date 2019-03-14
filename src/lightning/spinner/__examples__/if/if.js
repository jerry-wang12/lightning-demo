import { LightningElement, track } from 'lwc';

export default class SpinnerIf extends LightningElement {
    @track loaded = false;

    handleClick() {
        this.loaded = !this.loaded;
    }
}
