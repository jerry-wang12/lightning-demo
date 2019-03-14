import { LightningElement } from 'lwc';

export default class InputNameBase extends LightningElement {
    salutationsList = [
        { label: 'None', value: 'None' },
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' },
    ];

    get salutationOptions() {
        return this.salutationsList;
    }
}
