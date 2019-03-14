import { LightningElement, track } from 'lwc';

export default class Basic extends LightningElement {
    @track infoText;

    handleRemove() {
        this.infoText = 'Remove button was clicked!';
    }

    handleRemoveOnly() {
        event.preventDefault();
        this.infoText = 'Remove button was clicked!';
    }

    handleClick() {
        this.infoText = 'The pill was clicked!';
    }
}
