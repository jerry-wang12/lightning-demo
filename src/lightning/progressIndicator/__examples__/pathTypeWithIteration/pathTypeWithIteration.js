import { LightningElement } from 'lwc';

export default class ProgressIndicatorPathTypeWithIteration extends LightningElement {
    steps = [
        { label: 'Contacted', value: 'step-1' },
        { label: 'Open', value: 'step-2' },
        { label: 'Unqualified', value: 'step-3' },
        { label: 'Nurturing', value: 'step-4' },
        { label: 'Closed', value: 'step-5' },
    ];
}
