import { LightningElement, track } from 'lwc';

export default class LightningExampleVerticalNavAdvanced extends LightningElement {
    @track selectedItem = 'reports_recent';
    @track currentContent = 'reports_recent';
    @track updatedCount = 12;

    handleSelect(event) {
        const selected = event.detail.name;

        if (selected === 'reports_updated') {
            this.updatedCount = 0;
        }

        this.currentContent = selected;
    }
}
