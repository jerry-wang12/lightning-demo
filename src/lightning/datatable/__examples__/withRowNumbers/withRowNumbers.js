import { LightningElement, track } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableRowNumbers extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track rowOffset = 0;
    @track tableLoadingState = true;

    async connectedCallback() {
        this.data = await fetchDataHelper({ amountOfRecords: 100 });
        this.tableLoadingState = false;
    }

    increaseRowOffset() {
        this.rowOffset += 100;
    }
}
