import { LightningElement, track } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'Close Date', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableRowSelection extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;
    @track selectedRows = [];

    async connectedCallback() {
        const data = await fetchDataHelper({ amountOfRecords: 100 });
        this.data = data;
        this.tableLoadingState = false;
    }

    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
    }
}
