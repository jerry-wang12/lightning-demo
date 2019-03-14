import { LightningElement, track } from 'lwc';

export default class DualListboxRequired extends LightningElement {
    @track options = [];
    @track values = [];
    @track requiredOptions = [];

    connectedCallback() {
        const items = [];
        for (let i = 1; i <= 10; i++) {
            items.push({
                label: `Option ${i}`,
                value: `opt${i}`,
            });
        }
        this.options.push(...items);
        this.values.push(...['opt2', 'opt4', 'opt6']);
        this.requiredOptions.push(...['opt2', 'opt5']);
    }
}
