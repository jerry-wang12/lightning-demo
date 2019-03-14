import { LightningElement, track } from 'lwc';

export default class CheckboxGroupRequired extends LightningElement {
    @track value = [];

    get options() {
        return [
            { label: 'Ross', value: 'option1' },
            { label: 'Rachel', value: 'option2' },
        ];
    }
}
