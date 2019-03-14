import { LightningElement, track } from 'lwc';

export default class CheckboxGroupDisabled extends LightningElement {
    @track value = ['option1'];

    get options() {
        return [
            { label: 'Ross', value: 'option1' },
            { label: 'Rachel', value: 'option2' },
        ];
    }
}
