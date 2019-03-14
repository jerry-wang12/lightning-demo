import { LightningElement, track } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const columns = [
    { label: 'Label', fieldName: 'name', editable: true },
    { label: 'Website', fieldName: 'website', type: 'url', editable: true },
    { label: 'Phone', fieldName: 'phone', type: 'phone', editable: true },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date', editable: true },
    { label: 'Balance', fieldName: 'amount', type: 'currency', editable: true },
];

export default class DatatableWithInlineEdit extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track rowOffset = 0;
    @track tableLoadingState = true;

    async connectedCallback() {
        this.data = await fetchDataHelper({ amountOfRecords: 100 });
        this.tableLoadingState = false;
    }
}
