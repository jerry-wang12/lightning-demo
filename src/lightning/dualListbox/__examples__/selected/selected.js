import { LightningElement, track } from 'lwc';

export default class DualListboxSelected extends LightningElement {
    @track options = [];
    @track values = [];

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
    }
}
