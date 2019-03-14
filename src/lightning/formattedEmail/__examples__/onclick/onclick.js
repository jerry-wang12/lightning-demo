import { LightningElement, track } from 'lwc';

export default class FormattedEmailBasic extends LightningElement {
    @track count = 0;

    handleClick(e) {
        e.preventDefault();
        this.count += 1;
    }
}
