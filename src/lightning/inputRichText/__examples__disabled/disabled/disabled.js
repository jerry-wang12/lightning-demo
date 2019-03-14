import { LightningElement } from 'lwc';

export default class InputRichTextDisabled extends LightningElement {
    get myVal() {
        return '**Hello!**';
    }
}
