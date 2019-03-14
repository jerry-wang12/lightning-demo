import { LightningElement, track } from 'lwc';

const NUM_OF_TABS = 3;

export default class TabsetOnActive extends LightningElement {
    @track activeValueMessage = '';

    get tabs() {
        const tabs = [];
        for (let i = 0; i < NUM_OF_TABS; i++) {
            tabs.push({
                value: `${i}`,
                label: `Item ${i}`,
                content: `Tab Content ${i}`,
            });
        }
        return tabs;
    }

    handleActive(event) {
        this.activeValueMessage = `Tab with value ${
            event.target.value
        } is now active`;
    }
}
