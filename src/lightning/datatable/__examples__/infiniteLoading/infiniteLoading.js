import { LightningElement, track } from 'lwc';
import fetchDataHelper from './fetchDataHelper';

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'Close Date', fieldName: 'closeAt', type: 'date' },
];

export default class DatatableInfiniteLoading extends LightningElement {
    @track data = [];
    @track columns = columns;
    @track tableLoadingState = true;
    @track loadMoreStatus = '';
    @track enableInfiniteLoading = true;

    async connectedCallback() {
        const data = await fetchDataHelper({ amountOfRecords: 20 });
        this.data = data;
        this.tableLoadingState = false;
    }

    handleLoadMore() {
        // set the table in a loading state
        this.tableLoadingState = true;
        this.loadMoreStatus = 'Loading additional rows...';

        const promiseData = fetchDataHelper({ amountOfRecords: 10 });
        promiseData.then(newData => {
            if (this.data.length >= 100) {
                this.enableInfiniteLoading = false;
                this.loadMoreStatus = 'No more data to load.';
            } else {
                this.data = this.data.concat(newData);
                this.loadMoreStatus = '';
            }

            this.tableLoadingState = false;
        });
    }
}
