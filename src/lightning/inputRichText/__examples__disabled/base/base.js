import { LightningElement, track } from 'lwc';

export default class InputRichTextBase extends LightningElement {
    @track myVal = '**Hello**';

    changeHandler() {
        this.myVal = event.detail.value;
    }
}
