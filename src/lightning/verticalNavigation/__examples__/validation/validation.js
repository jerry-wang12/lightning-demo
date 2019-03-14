import { LightningElement, track } from 'lwc';

export default class LightningExampleVerticalNavValidation extends LightningElement {
    @track asyncValidation;
    @track hasBeenEdited = false;
    @track selectedItem = 'report_1';

    handleClick() {
        this.hasBeenEdited = true;
    }

    handleBeforeSelect(event) {
        if (this.hasBeenEdited) {
            // Prevent the onselect handler from running
            event.preventDefault();

            this.asyncValidation = true;

            // Simulate an async operation
            // eslint-disable-next-line lwc/no-set-timeout
            setTimeout(() => {
                this.hasBeenEdited = false;
                this.selectedItem = event.detail.name;
                this.asyncValidation = false;
            }, 2000);
        }
    }
}
