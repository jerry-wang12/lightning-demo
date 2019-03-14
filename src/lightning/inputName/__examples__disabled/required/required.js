import { LightningElement } from 'lwc';

export default class InputNameRequired extends LightningElement {
    salutationsList = [
        { label: 'None', value: 'None' },
        { label: 'Mr.', value: 'Mr.' },
        { label: 'Ms.', value: 'Ms.' },
        { label: 'Mrs.', value: 'Mrs.' },
        { label: 'Dr.', value: 'Dr.' },
        { label: 'Prof.', value: 'Prof.' },
    ];

    fieldsList = ['firstName', 'lastName'];

    get salutationOptions() {
        return this.salutationsList;
    }

    get fields() {
        return this.fieldsList;
    }
}
